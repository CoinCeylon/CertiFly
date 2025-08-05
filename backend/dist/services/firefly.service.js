"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FireFlyService = void 0;
const axios_1 = __importDefault(require("axios"));
class FireFlyService {
    constructor(host) {
        this.ns = 'default';
        this.baseUrl = host;
        this.rest = axios_1.default.create({ baseURL: `${host}/api/v1` });
    }
    async sendBroadcast(data) {
        await this.rest.post(`/namespaces/${this.ns}/messages/broadcast`, { data });
    }
    async uploadPDFBlob(pdfBuffer, metadata) {
        try {
            console.log(`📤 Uploading PDF blob: ${metadata.filename}`);
            // Create FormData for multipart upload
            const FormData = require('form-data');
            const formData = new FormData();
            formData.append('autometa', 'true');
            if (metadata.metadata) {
                formData.append('metadata', JSON.stringify(metadata.metadata));
            }
            formData.append('filename', metadata.filename);
            formData.append('file', pdfBuffer, {
                filename: metadata.filename,
                contentType: 'application/pdf'
            });
            const response = await this.rest.post(`/namespaces/${this.ns}/data`, formData, {
                headers: {
                    ...formData.getHeaders(),
                }
            });
            console.log(`✅ PDF uploaded to FireFly: ${response.data.id}`);
            return {
                id: response.data.id,
                hash: response.data.hash,
                size: response.data.blob?.size,
                public: response.data.public
            };
        }
        catch (error) {
            console.error('❌ Error uploading PDF blob:', error);
            throw error;
        }
    }
    async sendPrivateMessageWithPDFRefs(messageData, targetOrg) {
        try {
            console.log(`📨 Sending private message with PDF references to: ${targetOrg}`);
            const dataResponse = await this.rest.post(`/namespaces/${this.ns}/data`, {
                value: JSON.stringify(messageData)
            });
            const targetOrgIdentity = await this.getOrgIdentity(targetOrg);
            const privateMessage = {
                data: [{
                        id: dataResponse.data.id
                    }],
                group: {
                    members: [{
                            identity: targetOrgIdentity
                        }]
                }
            };
            const response = await this.rest.post(`/namespaces/${this.ns}/messages/private`, privateMessage);
            console.log('✅ Private message with PDF references sent successfully');
            return response.data;
        }
        catch (error) {
            console.error('❌ Error sending private message with PDF references:', error);
            throw error;
        }
    }
    async downloadPDFBlob(dataId) {
        try {
            console.log(`📥 Downloading PDF blob: ${dataId}`);
            const response = await this.rest.get(`/namespaces/${this.ns}/data/${dataId}/blob`, {
                responseType: 'arraybuffer'
            });
            console.log(`✅ PDF blob downloaded: ${response.data.byteLength} bytes`);
            return Buffer.from(response.data);
        }
        catch (error) {
            console.error('❌ Error downloading PDF blob:', error);
            throw error;
        }
    }
    async sendPrivate(privateMessage) {
        await this.rest.post(`/namespaces/${this.ns}/messages/private`, privateMessage);
    }
    async sendPrivateMessage(data, targetOrg) {
        try {
            console.log(`🔍 Attempting to send message to: ${targetOrg}`);
            const targetOrgIdentity = await this.getOrgIdentity(targetOrg);
            const privateMessage = {
                data: [{ value: JSON.stringify(data) }],
                group: {
                    members: [{ identity: targetOrgIdentity }]
                }
            };
            await this.sendPrivate(privateMessage);
            console.log('✅ Private message sent successfully');
        }
        catch (error) {
            console.error('❌ Error in sendPrivateMessage:', error);
            throw error;
        }
    }
    // Helper method to get organization identity
    async getOrgIdentity(targetOrg) {
        try {
            const orgs = await this.getOrgs();
            console.log('Available organizations:', orgs);
            const targetOrgData = orgs.find(org => org.name === targetOrg);
            if (!targetOrgData) {
                throw new Error(`Organization ${targetOrg} not found. Available: ${orgs.map(o => o.name).join(', ')}`);
            }
            // Use 'did' if available, fallback to 'identity'
            const targetOrgIdentity = targetOrgData.did || targetOrgData.identity;
            if (!targetOrgIdentity) {
                throw new Error(`No identity found for organization ${targetOrg}`);
            }
            console.log(`✅ Found target organization: ${targetOrg} -> ${targetOrgIdentity}`);
            return targetOrgIdentity;
        }
        catch (error) {
            console.error('❌ Error getting organization identity:', error);
            throw error;
        }
    }
    async getMessages(limit = 50) {
        try {
            // Try different message type combinations
            const response = await this.rest.get(`/namespaces/${this.ns}/messages?limit=${limit}&type=private`);
            console.log(`🔍 Retrieved ${response.data.length} messages from FireFly`);
            return response.data;
        }
        catch (error) {
            console.error('❌ Error retrieving messages:', error);
            throw error;
        }
    }
    // Get private messages specifically
    async getPrivateMessages(limit = 50) {
        try {
            const response = await this.rest.get(`/namespaces/${this.ns}/messages?limit=${limit}&type=private`);
            console.log(`🔍 Retrieved ${response.data.length} private messages from FireFly`);
            return response.data;
        }
        catch (error) {
            console.error('❌ Error retrieving private messages:', error);
            throw error;
        }
    }
    // Get messages filtered by author (sender)
    async getMessagesFromSender(sender, limit = 50) {
        try {
            const response = await this.rest.get(`/namespaces/${this.ns}/messages?limit=${limit}&type=private&author=${sender}`);
            console.log(`🔍 Retrieved ${response.data.length} messages from ${sender}`);
            return response.data;
        }
        catch (error) {
            console.error('❌ Error retrieving messages from sender:', error);
            throw error;
        }
    }
    async getStatus() {
        const response = await this.rest.get(`/status`);
        return response.data;
    }
    async getOrgs() {
        try {
            const response = await this.rest.get(`/network/organizations`);
            // Normalize the response to match both patterns
            return response.data.map(org => ({
                ...org,
                identity: org.did || org.identity // Ensure 'identity' is available
            }));
        }
        catch (error) {
            console.error('❌ Error fetching organizations:', error);
            throw new Error(`Failed to fetch organizations: ${error}`);
        }
    }
    async retrieveData(data) {
        return Promise.all(data.map((d) => this.rest
            .get(`/namespaces/${this.ns}/data/${d.id}`)
            .then((response) => response.data)));
    }
}
exports.FireFlyService = FireFlyService;
