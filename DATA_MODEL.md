# Data Model

## Overview
The application currently uses a mock data store (`MOCK_RECORD` in `constants.ts`) typed via TypeScript interfaces in `types.ts`. The data model is designed to support the "Git for Health Records" philosophy, where every change is a commit.

## Core Interfaces

### PatientRecord
The root object representing a single patient's file.

```typescript
interface PatientRecord {
  id: string;           // Unique Record ID (e.g., "REC-2024-8832")
  name: string;         // Patient Name
  dob: string;          // Date of Birth (ISO string)
  demographics: MedicalSection;
  allergies: MedicalSection;
  medications: MedicalSection;
  history: MedicalSection;
  notes: Note[];        // Array of clinical notes
  commits: Commit[];    // Audit log of all changes
}
```

### MedicalSection & MedicalEntry
Used for structured data (Demographics, Allergies, etc.).

```typescript
interface MedicalSection {
  title: string;        // Section Title (e.g., "Allergies")
  entries: MedicalEntry[];
}

interface MedicalEntry {
  id: string;           // Unique Entry ID
  key: string;          // Label (e.g., "Penicillin")
  value: string;        // Content (e.g., "Severe (Anaphylaxis)")
  lastUpdated: string;  // ISO Timestamp
  updatedBy: string;    // Author Name
}
```

### Note
Represents a free-text clinical note.

```typescript
interface Note {
  id: string;           // Unique Note ID
  timestamp: string;    // ISO Timestamp
  author: string;       // Author Name
  content: string;      // Markdown/Text content
  attachments?: string[]; // Array of filenames/URLs (mock)
  commitHash: string;   // Link to the commit that created this note
}
```

### Commit
Represents a change to the record (the "Git" history).

```typescript
interface Commit {
  hash: string;         // Full SHA-like hash
  shortHash: string;    // Shortened hash for display
  timestamp: string;    // ISO Timestamp
  author: string;       // Author Name
  message: string;      // Commit message (e.g., "Added clinical note")
  type: 'structure' | 'note' | 'access'; // Type of change
}
```

### UserSession
Represents the currently authenticated session (two-party).

```typescript
interface UserSession {
  name: string;         // Accessor Name
  role: 'patient' | 'clinician';
  threeWords: string[]; // The 3-word auth phrase
}
```

## Mock Data Structure
The `MOCK_RECORD` constant initializes with:
*   **Demographics**: Blood Type, Gender, Nationality.
*   **Allergies**: Penicillin, Latex.
*   **Medications**: Albuterol.
*   **History**: Asthma, Fracture.
*   **Notes**: Two sample notes with attachments.
*   **Commits**: Four sample commits (Initial import, updates, notes).

## Type Aliases (Proposed Standardization)
To prepare for the backend, we should strictly adhere to these interfaces. Consider creating type aliases:
*   `NomadRecord`: Alias for `PatientRecord`
*   `NomadNote`: Alias for `Note`
*   `NomadCommit`: Alias for `Commit`
*   `NomadMedicalEntry`: Alias for `MedicalEntry`
*   `NomadMedicalSection`: Alias for `MedicalSection`

## Mock Data Details
The `MOCK_RECORD` constant in `constants.ts` contains:
*   **Patient Info**: `id: "REC-2024-8832"`, `name: "Alara Kovic"`, `dob: "1994-06-12"`
*   **Demographics**: Blood Type (O+), Gender (Female), Nationality (Stateless/Displaced)
*   **Allergies**: Penicillin (Severe), Latex (Mild)
*   **Medications**: Albuterol Inhaler (PRN for Asthma)
*   **History**: Asthma (Diagnosed 2005), Fractured Tibia (Left leg, 2018)
*   **Notes**: 2 sample notes with timestamps, authors, content, and optional attachments
*   **Commits**: 4 sample commits showing initial import, updates, and note additions

## Data Flow in Context
All data flows through `AppContext.tsx`:
*   **Initial State**: `record` initialized from `MOCK_RECORD`
*   **Updates**: `addNote()` and `updateMedicalEntry()` modify `record` state
*   **Commit Generation**: Every write operation creates a new `Commit` object prepended to `record.commits`
*   **Attribution**: `currentUser.name` is used for all `author` and `updatedBy` fields

*Note: The current `MedicalEntry` structure is flat key-value. For a real backend, we might need a more schema-driven approach (e.g., SNOMED codes), but for this prototype, the key-value pair is sufficient.*
