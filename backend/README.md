# Certifly Backend API

🎓 **Blockchain-powered certificate issuance and verification platform**

A Node.js/Express.js backend service that powers the Certifly platform - a revolutionary solution for authentic degree certificate verification using Cardano blockchain and Hyperledger FireFly integration.

## 🌟 Overview

Certifly solves the critical problem of slow, manual, and non-transparent degree certificate verification between parent universities and their global partner institutions. By leveraging blockchain technology, we ensure tamper-proof, immutable records while maintaining student privacy through cryptographic hashing.

### Key Features

- 🔗 **Blockchain Integration**: Cardano for certificate storage, Ethereum for messaging via FireFly
- 🔒 **Privacy-First**: Only cryptographic hashes stored on-chain, no personal data
- 🌐 **Multi-Party Coordination**: Seamless communication between universities via Hyperledger FireFly
- ⚡ **Real-time Verification**: Instant certificate authenticity checks
- 📊 **Dashboard Analytics**: Comprehensive insights for university administrators
- 🔍 **Public Verification**: Anyone can verify certificate authenticity

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Partner Univ   │    │   Cardiff Met   │    │  Public Portal  │
│   (ICBT, etc.)  │    │   (Main Univ)   │    │  (Verification) │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │    Certifly Backend       │
                    │                           │
                    │  ┌─────────────────────┐  │
                    │  │   Express.js API    │  │
                    │  └─────────────────────┘  │
                    │  ┌─────────────────────┐  │
                    │  │ Hyperledger FireFly │  │
                    │  └─────────────────────┘  │
                    │  ┌─────────────────────┐  │
                    │  │  Cardano Service    │  │
                    │  └─────────────────────┘  │
                    │  ┌─────────────────────┐  │
                    │  │  Supabase Database  │  │
                    │  └─────────────────────┘  │
                    └───────────────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **Cardano Testnet** access
- **Hyperledger FireFly** instance
- **Supabase** account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CoinCeylon/CertiFly.git
   cd certifly/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the backend root:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   
   # Supabase Configuration
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-supabase-anon-key

   
   # Hyperledger FireFly Configuration
   CARDIFF_FIREFLY_URL=http://127.0.0.1:5000
   ICBT_FIREFLY_URL=http://127.0.0.1:5001
   PARTNER_FIREFLY_URL=http://127.0.0.1:5002

   
   # Cardano Configuration
   CARDANO_NETWORK=preprod
   BLOCKFROST_API_KEY=your-blockfrost-api-key
   CARDANO_WALLET_ADDRESS=your-wallet-address
   CARDANO_PRIVATE_KEY_HEX=your-wallet-address-pkey
   

   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.ts                 # Express application setup
│   ├── controllers/           # Request handlers
│   │   ├── cardiff.controller.ts     # Cardiff University operations
│   │   ├── dashboard.controller.ts   # Dashboard analytics
│   │   ├── icbt.controller.ts        # Partner university operations
│   │   └── verification.controller.ts # Certificate verification
│   ├── models/                # Data models
│   │   └── student.model.ts          # Student data structure
│   ├── routes/                # API route definitions
│   │   ├── cardiff.routes.ts         # Cardiff-specific routes
│   │   ├── certificate.routes.ts     # Certificate operations
│   │   ├── dashboard.routes.ts       # Dashboard endpoints
│   │   ├── health.routes.ts          # Health check endpoints
│   │   ├── icbt.routes.ts            # Partner university routes
│   │   ├── test.routes.ts            # Testing endpoints
│   │   ├── verification.routes.ts    # Verification endpoints
│   │   └── index.ts                  # Route aggregator
│   ├── services/              # Business logic
│   │   ├── cardano.service.ts        # Cardano blockchain operations
│   │   ├── certificate.service.ts    # Certificate management
│   │   ├── firefly.service.ts        # FireFly integration
│   │   └── supabase.service.ts       # Database operations
│   ├── utils/                 # Utility functions
│   │   └── hash.util.ts              # Cryptographic utilities
│   └── wallet/                # Cardano wallet files
│       ├── payment.addr
│       ├── payment.skey
│       ├── payment.vkey
│       ├── stake.skey
│       └── stake.vkey
├── dist/                      # Compiled JavaScript output
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ API Endpoints

### Health & Testing
- `GET /health` - Service health check
- `GET /cors-test` - CORS configuration test

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

## 🔗 Blockchain Integration

### Cardano Integration
- **Network**: Cardano Testnet
- **Purpose**: Final certificate hash storage
- **Benefits**: Low fees, energy efficiency, security
- **Library**: MeshSDK for Cardano operations

### Hyperledger FireFly
- **Purpose**: Multi-party messaging and coordination
- **Features**: Event streams, identity management, off-chain workflows
- **Benefits**: Seamless university communication, verified partner institutions


## 📊 Database Schema

### Supabase Tables

#### Students
```sql
create table public.student_details (
  id uuid not null default gen_random_uuid (),
  student_id character varying not null,
  batch_id character varying not null,
  first_name character varying not null,
  last_name character varying not null,
  email character varying not null,
  course character varying not null,
  graduation_date date not null,
  gpa numeric(3, 2) not null,
  transaction_hash text null,
  certified_at timestamp with time zone null,
  created_at timestamp with time zone null default now(),
  certificate_id character varying null,
  certificate_pdf text null,
  cardano_tx_id character varying null,
  certificate_hash text null,
  constraint student_details_pkey primary key (id),
  constraint student_details_student_id_key unique (student_id),
  constraint student_details_batch_id_fkey foreign KEY (batch_id) references batch_details (batch_id)
) TABLESPACE pg_default;

create index IF not exists idx_student_batch_id on public.student_details using btree (batch_id) TABLESPACE pg_default;

create index IF not exists idx_student_certificate_id on public.student_details using btree (certificate_id) TABLESPACE pg_default;

create index IF not exists idx_student_certificate_hash on public.student_details using btree (transaction_hash) TABLESPACE pg_default;
```

#### Batch Details
```sql
create table public.batch_details (
  id uuid not null default gen_random_uuid (),
  batch_id character varying not null,
  message_id character varying not null,
  batch_name character varying not null,
  academic_year character varying not null,
  semester character varying not null,
  faculty character varying not null,
  contact_person character varying not null,
  contact_email character varying not null,
  created_at timestamp with time zone null default now(),
  cardano_transaction_id character varying null,
  blockchain_submitted_at timestamp with time zone null,
  status character varying null default 'pending'::character varying,
  constraint batch_details_pkey primary key (id),
  constraint batch_details_batch_id_key unique (batch_id),
  constraint batch_details_message_id_fkey foreign KEY (message_id) references message_inbox (message_id)
) TABLESPACE pg_default;

create index IF not exists idx_batch_message_id on public.batch_details using btree (message_id) TABLESPACE pg_default;

create index IF not exists idx_batch_cardano_tx on public.batch_details using btree (cardano_transaction_id) TABLESPACE pg_default;
```

#### Message Inbox
```sql
create table public.message_inbox (
  id uuid not null default gen_random_uuid (),
  message_id character varying not null,
  message_heading character varying not null,
  sender character varying not null,
  viewed_status boolean null default false,
  message_type character varying null default 'STUDENT_BATCH_SUBMISSION'::character varying,
  received_at timestamp with time zone null default now(),
  processed boolean null default false,
  constraint message_inbox_pkey primary key (id),
  constraint message_inbox_message_id_key unique (message_id)
) TABLESPACE pg_default;

create index IF not exists idx_message_viewed on public.message_inbox using btree (viewed_status) TABLESPACE pg_default;
```

## 🔒 Security Features

- **CORS Protection**: Configurable allowed origins
- **Input Validation**: Request data sanitization
- **Rate Limiting**: API endpoint protection
- **Environment Variables**: Sensitive data protection
- **Cryptographic Hashing**: SHA-256 for certificate integrity
- **Blockchain Immutability**: Tamper-proof record storage

## 🧪 Testing

### Run Tests
```bash
# Development mode
npm run dev

# Production build
npm run start

# Health check
curl http://localhost:8080/health

# CORS test
curl http://localhost:8080/cors-test
```

### Test Endpoints
- Use `GET /cors-test` to verify CORS configuration
- Use `GET /health` to check service status
- Test certificate verification with sample data

## 🚀 Deployment

### Environment Setup
1. Set production environment variables
2. Configure allowed origins for production domains
3. Set up Cardano mainnet wallet (for production)
4. Configure production Supabase instance

### Build for Production
```bash
npm run build
npm start
```

### Docker Deployment (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 8080
CMD ["npm", "start"]
```

## 📝 License

CertiFly is free software released under the **GNU General Public License v3.0 or later**.  
See the full text in the [`LICENSE`](LICENSE) file or read it online at the GNU website.


## 🎯 Roadmap

- [ ] Multi-node FireFly support for Cardano
- [ ] Enhanced analytics dashboard
- [ ] Mobile API optimization
- [ ] Batch processing improvements
- [ ] Advanced verification features

---

**Built with ❤️ for the future of academic credential verification**

*Powered by Cardano blockchain and Hyperledger FireFly*
