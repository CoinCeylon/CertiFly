"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardanoService = void 0;
const axios_1 = __importDefault(require("axios"));
const core_1 = require("@meshsdk/core");
class CardanoService {
    constructor() {
        // All configuration from environment variables
        this.blockfrostApi = process.env.CARDANO_NETWORK === 'mainnet'
            ? 'https://cardano-mainnet.blockfrost.io/api/v0'
            : 'https://cardano-preprod.blockfrost.io/api/v0';
        this.blockfrostApiKey = process.env.BLOCKFROST_API_KEY;
        this.network = process.env.CARDANO_NETWORK || 'preprod';
        this.walletAddress = process.env.CARDANO_WALLET_ADDRESS;
        this.privateKeyHex = process.env.CARDANO_PRIVATE_KEY_HEX;
        // Validate required environment variables
        this.validateEnvironmentVariables();
        // Initialize Blockfrost provider
        this.blockfrostProvider = new core_1.BlockfrostProvider(this.blockfrostApiKey);
        // Initialize Mesh wallet
        this.meshWallet = new core_1.MeshWallet({
            networkId: this.network === 'mainnet' ? 1 : 0,
            fetcher: this.blockfrostProvider,
            submitter: this.blockfrostProvider,
            key: {
                type: 'cli',
                payment: this.privateKeyHex
            }
        });
    }
    validateEnvironmentVariables() {
        const required = [
            'BLOCKFROST_API_KEY',
            'CARDANO_WALLET_ADDRESS',
            'CARDANO_PRIVATE_KEY_HEX'
        ];
        const missing = required.filter(key => !process.env[key]);
        if (missing.length > 0) {
            throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
        }
    }
    // Main transaction submission method
    async submitCertificateHashesToCardano(batchId, batchName, certificateHashes, academicYear, semester, faculty) {
        try {
            console.log(`🔗 Submitting ${certificateHashes.length} certificate hashes via Mesh.js`);
            const metadata = this.createBatchMetadata(batchId, batchName, certificateHashes, academicYear, semester, faculty);
            const utxos = await this.getWalletUTXOs();
            if (utxos.length === 0) {
                throw new Error('No UTXOs available in wallet');
            }
            const txId = await this.submitTransactionViaMesh(utxos, metadata);
            return txId;
        }
        catch (error) {
            console.error('❌ Transaction failed:', error);
            throw new Error(`Failed to submit certificate batch: ${error instanceof Error ? error.message : error}`);
        }
    }
    // Core Mesh.js transaction method
    async submitTransactionViaMesh(utxos, metadata) {
        console.log(`🔨 Building transaction with fresh wallet initialization...`);
        // Calculate total available funds for validation
        const totalInput = utxos.reduce((sum, utxo) => {
            const lovelaceAmount = utxo.amount.find((a) => a.unit === 'lovelace');
            return sum + (lovelaceAmount ? parseInt(lovelaceAmount.quantity) : 0);
        }, 0);
        console.log(`💰 Total available: ${(totalInput / 1000000).toFixed(2)} ADA`);
        if (totalInput < 2000000) { // Need at least 2 ADA
            throw new Error(`Insufficient funds. Need at least 2 ADA, have ${(totalInput / 1000000).toFixed(2)} ADA`);
        }
        try {
            // Create a fresh MeshWallet instance specifically for this transaction
            const freshWallet = new core_1.MeshWallet({
                networkId: this.network === 'mainnet' ? 1 : 0,
                fetcher: this.blockfrostProvider,
                submitter: this.blockfrostProvider,
                key: {
                    type: 'cli',
                    payment: this.privateKeyHex
                }
            });
            console.log('🔍 Wallet initialization complete, checking addresses...');
            // Verify wallet can see its addresses
            const walletAddresses = await freshWallet.getUsedAddresses();
            console.log('🔍 Wallet addresses:', walletAddresses);
            console.log('🔍 Expected address:', this.walletAddress);
            // Create transaction with the fresh wallet
            const tx = new core_1.Transaction({ initiator: freshWallet });
            // Add metadata
            tx.setMetadata(674, metadata['674']);
            // Send 1 ADA to the FIRST address returned by the wallet (not hardcoded)
            const targetAddress = walletAddresses[0] || this.walletAddress;
            tx.sendLovelace(targetAddress, "1000000"); // 1 ADA
            console.log(`🔨 Building transaction to address: ${targetAddress.substring(0, 20)}...`);
            const unsignedTx = await tx.build();
            console.log(`✍️ Signing transaction...`);
            const signedTx = await freshWallet.signTx(unsignedTx);
            console.log(`📤 Submitting to blockchain...`);
            const txId = await freshWallet.submitTx(signedTx);
            return txId;
        }
        catch (error) {
            console.error('❌ Mesh.js transaction error:', error);
            // Additional debugging
            console.log('🔍 Debug info:');
            console.log('   - Network:', this.network);
            console.log('   - Wallet address:', this.walletAddress.substring(0, 20) + '...');
            console.log('   - Private key length:', this.privateKeyHex.length);
            console.log('   - Blockfrost API:', this.blockfrostApi);
            throw error;
        }
    }
    // Wallet utilities
    async getWalletBalance() {
        try {
            const response = await axios_1.default.get(`${this.blockfrostApi}/addresses/${this.walletAddress}`, { headers: { 'project_id': this.blockfrostApiKey } });
            const lovelace = response.data.amount.find((a) => a.unit === 'lovelace');
            return parseInt(lovelace.quantity) / 1000000; // Convert to ADA
        }
        catch (error) {
            console.error('❌ Error fetching balance:', error);
            return 0;
        }
    }
    async getWalletUTXOs() {
        const response = await axios_1.default.get(`${this.blockfrostApi}/addresses/${this.walletAddress}/utxos`, { headers: { 'project_id': this.blockfrostApiKey } });
        console.log(`✅ Found ${response.data.length} UTXOs`);
        return response.data;
    }
    // Transaction verification methods
    async getTransactionMetadata(txId) {
        try {
            const response = await axios_1.default.get(`${this.blockfrostApi}/txs/${txId}/metadata`, { headers: { 'project_id': this.blockfrostApiKey } });
            return response.data.length > 0 ? response.data[0].json_metadata : null;
        }
        catch (error) {
            console.error('❌ Error retrieving metadata:', error);
            return null;
        }
    }
    async verifyTransactionExists(txId) {
        try {
            const response = await axios_1.default.get(`${this.blockfrostApi}/txs/${txId}`, { headers: { 'project_id': this.blockfrostApiKey } });
            return response.status === 200;
        }
        catch (error) {
            return false;
        }
    }
    async getTransactionDetails(txId) {
        try {
            const response = await axios_1.default.get(`${this.blockfrostApi}/txs/${txId}`, { headers: { 'project_id': this.blockfrostApiKey } });
            return {
                txId: response.data.hash,
                blockHeight: response.data.block_height,
                blockTime: response.data.block_time,
                fee: response.data.fees,
                confirmations: response.data.confirmations || 0
            };
        }
        catch (error) {
            throw new Error(`Failed to fetch transaction details: ${error}`);
        }
    }
    // Health check
    async healthCheck() {
        try {
            const balance = await this.getWalletBalance();
            const utxos = await this.getWalletUTXOs();
            return {
                status: 'healthy',
                details: {
                    network: this.network,
                    walletAddress: this.walletAddress.substring(0, 20) + '...',
                    balance: `${balance.toFixed(2)} ADA`,
                    utxoCount: utxos.length,
                    canTransact: balance > 2 && utxos.length > 0
                }
            };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                details: {
                    error: error instanceof Error ? error.message : 'Unknown error',
                    network: this.network
                }
            };
        }
    }
    // Utility methods
    async getCertificateHashesFromTransaction(txId) {
        const metadata = await this.getTransactionMetadata(txId);
        return metadata?.['674']?.hashes || [];
    }
    async verifyCertificateInTransaction(txId, certificateHash) {
        const hashes = await this.getCertificateHashesFromTransaction(txId);
        return hashes.includes(certificateHash);
    }
    createBatchMetadata(batchId, batchName, certificateHashes, academicYear, semester, faculty) {
        return {
            "674": {
                "type": "certificate-batch-hashes",
                "issuer": "Cardiff Metropolitan University",
                "batch_id": batchId,
                "batch_name": batchName,
                "academic_year": academicYear,
                "semester": semester,
                "faculty": faculty,
                "certificate_count": certificateHashes.length,
                "hashes": certificateHashes,
                "issued_at": new Date().toISOString(),
                "authority": "Cardiff Met Academic Registry"
            }
        };
    }
}
exports.CardanoService = CardanoService;
