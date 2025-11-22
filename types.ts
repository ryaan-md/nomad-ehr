export type ViewState = 'landing' | 'access' | 'dashboard' | 'create';
export type DashboardTab = 'overview' | 'notes' | 'history';

export interface MedicalEntry {
  id: string;
  key: string;
  value: string;
  lastUpdated: string;
  updatedBy: string;
}

export interface MedicalSection {
  title: string;
  entries: MedicalEntry[];
}

export interface Note {
  id: string;
  timestamp: string;
  author: string;
  content: string;
  attachments?: string[];
  commitHash: string;
}

export interface Commit {
  hash: string;
  shortHash: string;
  timestamp: string;
  author: string;
  message: string;
  type: 'structure' | 'note' | 'access';
}

export interface PatientRecord {
  id: string;
  name: string;
  dob: string;
  demographics: MedicalSection;
  allergies: MedicalSection;
  medications: MedicalSection;
  history: MedicalSection;
  notes: Note[];
  commits: Commit[];
}

export interface UserSession {
  name: string;
  role: 'patient' | 'clinician';

  threeWords: string[];
}
}