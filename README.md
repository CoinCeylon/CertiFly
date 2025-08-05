<div align="center">

# 🎓 CertiFly 

### *Revolutionizing Academic Credentials with Blockchain Technology*

**A Next-Generation Certificate Issuance and Verification Platform**

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Cardano](https://img.shields.io/badge/Cardano-Blockchain-blue)](https://cardano.org/)
[![Hyperledger FireFly](https://img.shields.io/badge/Hyperledger-FireFly-orange)](https://hyperledger.github.io/firefly/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)

[ 🎬 **Watch Video**](https://www.youtube.com/watch?v=O8qM6nYvAQ0) | [ 🌐 **Live Demo**](https://orange-mushroom-00b958600.1.azurestaticapps.net) | [🚀 **Quick Start**](#-quick-start) | [📚 **Documentation**](#-project-structure) | [🤝 **Contribute**](#-contributing)

---

</div>


## 🎯 The Problem We're Solving

Verifying the authenticity of degree certificates issued by partner universities across multiple countries is often:
- **Slow and Manual**: Traditional verification processes can take weeks or months
- **Non-Transparent**: Limited visibility into the verification process
- **Fraud-Prone**: Fraudulent certificates are difficult to detect, especially across borders
- **Inefficient**: Employers, immigration offices, and universities face delays and uncertainties

## 🚀 Our Solution

**CertiFly** is a revolutionary blockchain-powered platform that connects universities like Cardiff University with their global partner institutions (such as ICBT in Sri Lanka) through:

- **Cardano Blockchain**: For secure, immutable certificate storage
- **Hyperledger FireFly**: For multi-party communication and coordination
- **Cryptographic Hashing**: Ensuring privacy while maintaining verifiability
- **Real-time Verification**: Instant certificate validation for employers and institutions

## 🎬 Live Demo

**See CertiFly in Action!** 

[![CertiFly Demo Video](https://img.youtube.com/vi/O8qM6nYvAQ0/maxresdefault.jpg)](https://www.youtube.com/watch?v=O8qM6nYvAQ0)

*Click the image above to watch our comprehensive demo showcasing the complete certificate issuance and verification workflow.*

### 🎥 What You'll See in the Demo:
- **Partner University Portal**: Bulk certificate request submission
- **Multi-Party Blockchain Communication**: Real-time coordination between universities
- **Certificate Generation**: Automated PDF creation with blockchain verification
- **Public Verification**: Instant certificate authenticity checking
- **End-to-End Workflow**: Complete process from request to verification

---


## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Partner Univ   │    │   Hyperledger    │    │  Main Univ      │
│   (e.g., ICBT)  │◄──►│    FireFly       │◄──►│ (e.g., Cardiff) │
│                 │    │   Multi-Party    │    │                 │
└─────────────────┘    │  Communication   │    └─────────────────┘
         │              └──────────────────┘             │
         │                       │                       │
         │              ┌──────────────────┐             │
         └─────────────►│   Blockchain     │◄────────────┘
                        │   - Ethereum     │
                        │   - Cardano      │
                        │   (Interop)      │
                        └──────────────────┘
```

## 🌟 Key Features

### 🔗 Multi-Party Blockchain Communication
- **Hyperledger FireFly**: Enables seamless coordination between parent and partner universities
- **Three-Node Setup**: Secure multi-party communication network
- **Verified Partners**: Only authenticated partner institutions can submit requests

### 🛡️ Blockchain Interoperability
- **Ethereum**: Currently used for internal messaging (FireFly support)
- **Cardano**: Used for final certificate hash storage (low fees, energy efficient)
- **Future-Ready**: Will transition to full Cardano when FireFly multi-node support is available

### 🔐 Privacy-First Design
- **Zero Personal Data on Chain**: Only cryptographic hashes are stored
- **GDPR Compliant**: Student privacy fully protected
- **Tamper-Proof**: Immutable records prevent certificate fraud

### ⚡ Real-Time Verification
- **Instant Validation**: Upload certificate PDF for immediate verification
- **Public Portal**: Accessible to employers, immigration offices, and institutions
- **No Manual Process**: Eliminates need for direct university contact

## 🎮 Platform Walkthrough

### 1. Partner University Portal
- **Bulk Request Submission**: Partner universities submit batch certificate requests
- **Required Information**:
  - Batch and Faculty details
  - Academic year
  - Contact information
  - CSV file with student data

### 2. Main University Dashboard
- **Cardiff Met Portal**: Dedicated dashboard for main university
- **Batch Processing**: View and process incoming certificate requests
- **Automated Notifications**: Instant updates to partner universities

### 3. Certificate Management
- **Download Certificates**: Partners can download individual PDFs
- **Batch Operations**: Efficient handling of multiple certificates
- **Status Tracking**: Real-time updates on certificate status

### 4. Public Verification
- **Quick Verify**: Instant certificate validation
- **PDF Upload**: Simple drag-and-drop verification
- **Blockchain Confirmation**: Hash verification against stored records

## 🛠️ Technical Stack

### Backend
- **Node.js & TypeScript**: Robust server-side development
- **Express.js**: RESTful API framework
- **Cardano CLI**: Blockchain interaction
- **Hyperledger FireFly**: Multi-party communication

### Frontend
- **React 18**: Modern UI framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Vite**: Fast build tool

### Blockchain
- **Cardano**: Certificate hash storage
- **Ethereum**: Internal messaging (temporary)
- **Hyperledger FireFly**: Multi-party coordination

### Infrastructure
- **Docker**: Containerized deployment
- **Supabase**: Database and authentication
- **Multi-node Setup**: Distributed network architecture

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Cardano CLI
- Hyperledger FireFly CLI (or you can use it like step 2)

### 1. Clone the Repository
```bash
git clone https://github.com/CoinCeylon/CertiFly.git
cd CertiFly
```

### 2. Setup Hyperledger FireFly Multi-Party Network
```bash
# Navigate to firefly-cli directory
cd firefly-cli

# Initialize three-node FireFly network
./ff/main init certifly-network 3 --prompt-names --multiparty

# Prompt names and nodes
When initializing the FireFly network, you will be prompted to enter organization names and node names for each participant. For example:

- name for org 0: cardiff-met
- name for node 0: cardiff-node
- name for org 1: icbt-campus
  name for node 1: icbt-node
- name for org 2: partner-university
- name for node 2: partner-node

Choose meaningful names to easily identify each university and their corresponding node in the network.

# Start the multi-party network
ff start certifly-network
```
### 3. Initialize Cardano Wallet
```bash
# Generate wallet keys 
cardano-cli address key-gen \
  --verification-key-file backend/wallet/payment.vkey \
  --signing-key-file backend/wallet/payment.skey
  # Add to .env
```

### 4. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

### 5. Setup Frontend
```bash
cd frontend
# Configure your environment variables
npm install
npm run dev
```



## 📁 Project Structure

```
certifly/
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── app.ts           # Main application entry point
│   │   ├── controllers/     # Route handlers
│   │   ├── models/          # Data models
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic & external integrations
│   │   ├── utils/           # Utility functions
│   │   └── wallet/          # Cardano wallet keys
│   ├── dist/                # Compiled JavaScript output
│   ├── package.json         # Backend dependencies
│   └── tsconfig.json        # TypeScript configuration
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility libraries
│   │   ├── assets/          # Static assets (images, fonts)
│   │   ├── App.tsx          # Main App component
│   │   ├── ICBTDashboard.tsx # ICBT specific dashboard
│   │   └── main.tsx         # React entry point
│   ├── public/              # Static public assets
│   │   ├── images/          # Image assets
│   │   └── favicon.ico      # Site favicon
│   ├── dist/                # Built frontend assets
│   ├── package.json         # Frontend dependencies
│   ├── vite.config.ts       # Vite build configuration
│   └── tailwind.config.ts   # Tailwind CSS configuration
├── firefly-cli/             # Hyperledger FireFly CLI tools
│   ├── cmd/                 # CLI command implementations
│   ├── internal/            # Core FireFly functionality
│   ├── pkg/                 # Go package definitions
│   ├── ff/                  # FireFly binary executable
│   ├── docs/                # Documentation and guides
│   ├── go.mod               # Go module dependencies
│   └── Makefile             # Build automation
└── README.md                # Project documentation
```

## 🌐 API Endpoints


### Main University (Cadiff) Operations
- `GET /api/cardiff/inbox` - Cardiff university message inbox 
- `GET /api/cardiff/inbox?viewed=true` - Cardiff university message inbox 
- `GET /api/cardiff/inbox?viewed=false` - Cardiff university message inbox 
- `GET /api/cardiff/process-message` - Cardiff university process message and issue certificates 


### Partner University (ICBT) Operations
- `POST /api/icbt/submit-batch-with-metadata` - Submit certificate request batch 
- `GET /api/icbt/certificates` - Get received certificates 
- `GET /api/icbt/download/student/:batchId/:studentId` - Download student certificate 
- `GET /api/icbt/batch-details` - fetch Batch Details 


### Verification Portal
- `POST /api/verify/certificate` - Verify certificate by hash 
- `POST /api/verify/certificate-id` - Verify certificate by ID 


## 🔒 Security Features

- **Multi-Signature Verification**: Multiple parties must confirm certificate issuance
- **Cryptographic Hashing**: SHA-256 hashing for certificate integrity
- **Access Control**: Role-based permissions for different university types
- **Audit Trail**: Complete history of all certificate operations
- **Privacy Protection**: No personal data stored on blockchain

## 🌍 Global Scalability

CertiFly is designed to be globally applicable and can be used by:
- **Universities**: Any institution worldwide can join the network
- **Multinational Organizations**: Document verification and issuance
- **Government Agencies**: Immigration and credential verification
- **Employers**: Instant degree verification for hiring

## 🔮 Future Roadmap

### Phase 1 (Current)
- ✅ Ethereum-based messaging via FireFly
- ✅ Cardano certificate storage
- ✅ Basic multi-party communication

### Phase 2 (Upcoming)
- 🔄 Full Cardano integration when FireFly multi-node support is available
- 🔄 Enhanced partner onboarding
- 🔄 Mobile application

### Phase 3 (Future)
- 🔄 AI-powered fraud detection
- 🔄 Integration with major university systems
- 🔄 Government partnership programs

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

CertiFly is free software released under the **GNU General Public License v3.0 or later**.  
See the full text in the [`LICENSE`](LICENSE) file or read it online at the GNU website.

## 📞 Support

- **Documentation**: [docs.certifly.org](https://docs.certifly.org)
- **Issues**: [GitHub Issues](https://github.com/your-org/certifly/issues)
- **Email**: support@certifly.org
- **Discord**: [Join our community](https://discord.gg/certifly)

## 🏆 Acknowledgments

- **Cardano Foundation**: For the robust blockchain infrastructure
- **Hyperledger Foundation**: For the FireFly multi-party system
- **Cardiff University**: For partnership and testing
- **ICBT**: For real-world validation

---

**Built with ❤️ for a more transparent and secure academic future**
