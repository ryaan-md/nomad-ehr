# Backend Implementation Plan

This backlog outlines the steps to replace the mock frontend state with a real Node/Express backend.

## Prerequisites
- Node.js 18+ (or latest LTS)
- PostgreSQL 14+ (for production) or SQLite (for development)
- AWS Account (if using S3 for file storage)

## Phase 1: Foundation

### 1.1 Project Setup
- [ ] Create `server/` directory at repo root
- [ ] Initialize `package.json` with project metadata
- [ ] Install core dependencies:
  ```bash
  npm install express cors dotenv helmet jsonwebtoken bcryptjs
  npm install -D @types/node @types/express @types/cors typescript ts-node nodemon
  ```

### 1.2 Database Setup
- [ ] Install Prisma ORM:
  ```bash
  npm install prisma @prisma/client
  npx prisma init
  ```
- [ ] Configure database connection:
  - Development: SQLite (`file:./dev.db`)
  - Production: PostgreSQL (connection string from env)
- [ ] Define Prisma schema in `server/prisma/schema.prisma`:
  ```prisma
  model PatientRecord {
    id          String   @id @default(uuid())
    name        String
    dob         String
    createdAt   DateTime @default(now())
    updatedAt   DateTime @updatedAt
    
    demographics Json
    allergies    Json
    medications  Json
    history      Json
    
    notes    Note[]
    commits  Commit[]
  }
  
  model Note {
    id         String   @id @default(uuid())
    recordId   String
    record     PatientRecord @relation(fields: [recordId], references: [id])
    timestamp  DateTime @default(now())
    author     String
    content    String
    commitHash String   @unique
    attachments String[] @default([])
  }
  
  model Commit {
    id          String   @id @default(uuid())
    recordId    String
    record      PatientRecord @relation(fields: [recordId], references: [id])
    hash        String   @unique
    shortHash   String
    timestamp   DateTime @default(now())
    author      String
    message     String
    type        String   // 'structure' | 'note' | 'access'
    previousHash String?
  }
  ```
- [ ] Run initial migration: `npx prisma migrate dev --name init`

### 1.3 Project Structure
```
server/
├── src/
│   ├── config/          # Environment config
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth, validation, error handling
│   ├── models/          # Prisma client extensions
│   ├── routes/           # Express routes
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   └── app.ts           # Express app setup
├── prisma/
│   └── schema.prisma
├── uploads/             # Local file storage (dev)
└── package.json
```

## Phase 2: API Implementation

### 2.1 Core Middleware
- [ ] Create error handling middleware
- [ ] Create authentication middleware (JWT verification)
- [ ] Create validation middleware (Zod or similar)
- [ ] Set up CORS configuration for frontend origin

### 2.2 Authentication Endpoints
- [ ] **POST /api/auth/unlock**
  - Accept: `{ patient: { name, dob, threeWords }, accessor: { name, dob, threeWords }, role }`
  - Validate credentials (mock for now, real crypto in Phase 4)
  - Generate JWT token with accessor info in claims
  - Return: `{ token, session: { name, role, threeWords }, recordId }`
  - **Acceptance Criteria**: Returns valid JWT, includes accessor info in token

### 2.3 Record Endpoints
- [ ] **GET /api/records/:id**
  - Auth: Require valid JWT
  - Fetch full record with notes and commits from database
  - Return: `PatientRecord` JSON
  - **Acceptance Criteria**: Returns complete record matching frontend type

- [ ] **POST /api/records/:id/commit-structured**
  - Auth: Require valid JWT + accessor headers
  - Body: `{ section, entryId, value, author }`
  - Update medical section entry in database
  - Generate commit hash (SHA-256 of timestamp + previous hash)
  - Create `Commit` record in database
  - Return: `{ success, commit, updatedEntry, updatedRecord }`
  - **Acceptance Criteria**: Entry updated, commit created, previous state preserved

- [ ] **POST /api/records/:id/commit-note**
  - Auth: Require valid JWT + accessor headers
  - Body: `multipart/form-data` with `content`, `author`, `files[]`
  - Handle file uploads (Phase 3)
  - Create `Note` record in database
  - Generate commit hash
  - Create `Commit` record
  - Return: `{ success, commit, note, attachmentIds }`
  - **Acceptance Criteria**: Note saved, attachments stored, commit created

### 2.4 History Endpoints
- [ ] **GET /api/records/:id/commits**
  - Auth: Require valid JWT
  - Query params: `?limit=50&offset=0`
  - Fetch commits for record, ordered by timestamp DESC
  - Return: `{ commits: Commit[], total: number }`
  - **Acceptance Criteria**: Returns paginated commit list

- [ ] **GET /api/records/:id/commits/:commitHash**
  - Auth: Require valid JWT
  - Calculate record state at specific commit (replay commits)
  - Return: `PatientRecord` snapshot
  - **Acceptance Criteria**: Returns accurate historical state

### 2.5 Export Endpoint
- [ ] **GET /api/records/:id/export.pdf**
  - Auth: Require valid JWT
  - Generate PDF from record data (using `pdfkit` or similar)
  - Return: PDF binary with `Content-Type: application/pdf`
  - **Acceptance Criteria**: Generates valid PDF with all record data

## Phase 3: File Storage

### 3.1 Local Storage (Development)
- [ ] Configure `multer` middleware for file uploads
- [ ] Create `uploads/` directory structure:
  ```
  uploads/
  └── records/
      └── {recordId}/
          └── {attachmentId}.{ext}
  ```
- [ ] Implement file upload handler in `commit-note` endpoint
- [ ] Store attachment metadata in database
- [ ] **Acceptance Criteria**: Files saved locally, metadata stored

### 3.2 S3 Storage (Production)
- [ ] Install AWS SDK: `npm install @aws-sdk/client-s3`
- [ ] Configure S3 client with environment variables
- [ ] Implement S3 upload service:
  ```typescript
  async uploadFile(recordId: string, file: Buffer, filename: string): Promise<string>
  async getFileUrl(attachmentId: string): Promise<string>
  ```
- [ ] Update `commit-note` endpoint to use S3 in production
- [ ] **Acceptance Criteria**: Files uploaded to S3, URLs stored in database

### 3.3 Attachment Retrieval
- [ ] **GET /api/attachments/:attachmentId**
  - Auth: Require valid JWT
  - Retrieve file from storage (local or S3)
  - Return: File binary with appropriate Content-Type
  - **Acceptance Criteria**: Files accessible via endpoint

## Phase 4: Security & Encryption (Future Enhancement)

### 4.1 Record Encryption
- [ ] Implement AES-256-GCM encryption for record content at rest
- [ ] Derive encryption key from patient's three words using PBKDF2 or Argon2
- [ ] Encrypt sensitive fields (demographics, notes, medical entries)
- [ ] Store encrypted records in database
- [ ] **Acceptance Criteria**: Records encrypted, decryption works on unlock

### 4.2 Key Derivation
- [ ] Implement PBKDF2/Argon2 key derivation from three words
- [ ] Generate separate keys for patient and accessor
- [ ] Combine keys for record decryption (two-party requirement)
- [ ] Store key derivation parameters (salt, iterations) securely
- [ ] **Acceptance Criteria**: Keys derived correctly, two-party decryption works

### 4.3 Commit Signatures
- [ ] Generate cryptographic signatures for each commit
- [ ] Sign commits with accessor's derived key
- [ ] Verify signatures when retrieving commits
- [ ] Store signatures in database
- [ ] **Acceptance Criteria**: Commits signed, signatures verifiable

## Phase 5: Testing & Deployment

### 5.1 Testing
- [ ] Unit tests for services and utilities
- [ ] Integration tests for API endpoints
- [ ] Test file upload/download flow
- [ ] Test commit history and snapshot functionality
- [ ] **Acceptance Criteria**: >80% code coverage

### 5.2 Deployment
- [ ] Set up production database (PostgreSQL)
- [ ] Configure environment variables
- [ ] Set up file storage (S3 bucket)
- [ ] Deploy backend (AWS ECS, Railway, Render, etc.)
- [ ] Configure CORS for production frontend URL
- [ ] **Acceptance Criteria**: Backend accessible, all endpoints functional

## Environment Variables

### Required for All Environments
```env
NODE_ENV=development|production
PORT=3001
DATABASE_URL="postgresql://user:password@localhost:5432/nomad_ehr"
JWT_SECRET="super-secret-key-change-in-production"
JWT_EXPIRES_IN="24h"
FRONTEND_URL="http://localhost:3000"
```

### Development Only
```env
STORAGE_PROVIDER="local"
UPLOAD_DIR="./uploads"
```

### Production Only
```env
STORAGE_PROVIDER="s3"
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_BUCKET_NAME="nomad-ehr-attachments"
S3_ENDPOINT=""  # Optional for S3-compatible services
```

### Optional (For Real Encryption - Phase 4)
```env
ENCRYPTION_ALGORITHM="aes-256-gcm"
KEY_DERIVATION_ALGORITHM="pbkdf2"  # or "argon2id"
PBKDF2_ITERATIONS=100000
PBKDF2_KEY_LENGTH=32
```

## Milestones

1. **Milestone 1: Basic API** (Phase 1 + 2.1-2.3)
   - Backend running, can create and retrieve records
   - Frontend can connect and display data

2. **Milestone 2: Full CRUD** (Phase 2.4-2.5)
   - Complete API functionality
   - History and export working

3. **Milestone 3: File Support** (Phase 3)
   - Attachments upload and download working
   - Production-ready storage

4. **Milestone 4: Security** (Phase 4)
   - Real encryption implemented
   - Two-party key derivation working

## Acceptance Criteria Summary

- ✅ All endpoints return correct data structures matching frontend types
- ✅ Commits are created for every write operation
- ✅ Previous record states are preserved (immutable history)
- ✅ File attachments are stored and retrievable
- ✅ JWT authentication works correctly
- ✅ Accessor attribution is tracked for all operations
- ✅ PDF export generates complete record document
- ✅ Backend handles errors gracefully with proper HTTP status codes
- ✅ CORS configured for frontend origin
- ✅ Database migrations can be run cleanly
