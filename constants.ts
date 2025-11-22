import { PatientRecord } from './types';

// Predefined field names for Demographics section
// These fields are always shown, even when empty, so clinicians just fill in values
export const STANDARD_DEMOGRAPHIC_FIELDS = [
  'Blood Type',
  'Gender',
  'Height',
  'Weight',
  'Nationality',
  'Primary Language',
  'Emergency Contact',
  'Phone Number',
  'Address'
];

// Preassigned fields for Demographics & Profile section (Overview tab)
export const DEMOGRAPHICS_PROFILE_FIELDS = [
  'Ethnicity',
  'Occupation',
  'Languages',
  'Emergency Contact'
];

// Preassigned fields for Family History section
export const FAMILY_HISTORY_RELATIONS = [
  'Mother',
  'Father',
  'Sibling',
  'Grandmother (Maternal)',
  'Grandfather (Maternal)',
  'Grandmother (Paternal)',
  'Grandfather (Paternal)'
];

export const MOCK_RECORD: PatientRecord = {
  id: "REC-2024-8832",
  name: "Alara Kovic",
  dob: "1994-06-12",
  demographics: {
    title: "Demographics",
    entries: [
      { id: "d1", key: "Blood Type", value: "O+", lastUpdated: "2023-11-02T10:00:00Z", updatedBy: "Dr. S. Chen" },
      { id: "d2", key: "Gender", value: "Female", lastUpdated: "2023-11-02T10:00:00Z", updatedBy: "Dr. S. Chen" },
      { id: "d3", key: "Nationality", value: "Stateless / Displaced", lastUpdated: "2024-01-15T14:20:00Z", updatedBy: "Admin" },
    ]
  },
  allergies: {
    title: "Allergies",
    entries: [
      { id: "a1", key: "Penicillin", value: "Severe (Anaphylaxis)", lastUpdated: "2022-05-20T09:15:00Z", updatedBy: "Dr. M. Haddad" },
      { id: "a2", key: "Latex", value: "Mild (Contact Dermatitis)", lastUpdated: "2023-02-10T11:30:00Z", updatedBy: "Nurse J. Doe" },
    ]
  },
  medications: {
    title: "Current Medications",
    entries: [
      { id: "m1", key: "Albuterol Inhaler", value: "PRN for Asthma", lastUpdated: "2024-02-28T16:45:00Z", updatedBy: "Dr. A. Smith" },
    ]
  },
  history: {
    title: "Medical History",
    entries: [
      { id: "h1", key: "Asthma", value: "Diagnosed 2005", lastUpdated: "2022-01-10T08:00:00Z", updatedBy: "System Migration" },
      { id: "h2", key: "Fractured Tibia", value: "Left leg, 2018 (Healed)", lastUpdated: "2022-01-10T08:00:00Z", updatedBy: "System Migration" },
    ]
  },
  notes: [
    {
      id: "n1",
      timestamp: "2024-03-10T09:30:00Z",
      author: "Clinician 8f4a",
      content: "Patient presented with mild respiratory distress. Oxygen saturation 96% on room air. Wheezing noted in lower lobes. Refilled albuterol prescription.",
      commitHash: "7c2b9a1",
      attachments: ["chest_xray_thumb.jpg"]
    },
    {
      id: "n2",
      timestamp: "2024-01-15T14:20:00Z",
      author: "Aid Worker 2b1c",
      content: "Routine check-up at Camp Delta. Patient reports shortage of inhalers in sector 4. Provided 2 units from emergency supply.",
      commitHash: "3d1e5f2"
    }
  ],
  commits: [
    { hash: "7c2b9a1", shortHash: "7c2b9a1", timestamp: "2024-03-10T09:30:00Z", author: "Clinician 8f4a", message: "Added clinical note: Respiratory check", type: "note" },
    { hash: "9a8b7c6", shortHash: "9a8b7c6", timestamp: "2024-02-28T16:45:00Z", author: "Dr. A. Smith", message: "Updated Medications: Albuterol refill", type: "structure" },
    { hash: "3d1e5f2", shortHash: "3d1e5f2", timestamp: "2024-01-15T14:20:00Z", author: "Aid Worker 2b1c", message: "Added clinical note: Supply provision", type: "note" },
    { hash: "1f2e3d4", shortHash: "1f2e3d4", timestamp: "2023-11-02T10:00:00Z", author: "Dr. S. Chen", message: "Initial Record Import", type: "access" },
  ]
};