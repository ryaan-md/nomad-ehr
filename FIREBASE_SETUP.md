# Firebase Integration Setup Guide

This guide will walk you through setting up Firebase for the Nomad EHR application.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard:
   - Enter a project name (e.g., "nomad-ehr")
   - Enable/disable Google Analytics (optional)
   - Click "Create project"

## Step 2: Create a Firestore Database

1. In your Firebase project, click on "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development) or "Start in production mode" (for production)
   - **Note**: For production, you'll need to set up security rules
4. Select a location for your database (choose the closest to your users)
5. Click "Enable"

## Step 3: Get Your Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon `</>` to add a web app
5. Register your app with a nickname (e.g., "Nomad EHR Web")
6. Copy the `firebaseConfig` object

## Step 4: Configure Firebase in the App

1. Open `firebase/config.ts` in your project
2. Replace the placeholder values with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 5: Set Up Firestore Security Rules (Important!)

1. In Firebase Console, go to "Firestore Database" > "Rules"
2. For development, you can use these rules (⚠️ **NOT for production**):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /patientRecords/{recordId} {
      // Allow read/write for development (remove in production!)
      allow read, write: if true;
    }
  }
}
```

3. For production, implement proper security rules based on your access control needs.

## Step 6: Seed the Database with Mock Data

1. Install tsx if you haven't already:
   ```bash
   npm install -D tsx
   ```

2. Run the seed script:
   ```bash
   npx tsx scripts/seedFirebase.ts
   ```

3. This will create a patient record with:
   - **Name**: Alara Kovic
   - **Date of Birth**: 1994-06-12
   - **Three Words**: sunrise, ripple, hope

## Step 7: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the Access page
3. Enter the credentials:
   - Name: `Alara Kovic`
   - DOB: `1994-06-12`
   - Three Words: `sunrise`, `ripple`, `hope`
4. Click "Unlock Record"
5. You should see the patient record loaded from Firebase!

## Database Structure

The Firestore collection `patientRecords` stores documents with this structure:

```typescript
{
  accessKeys: {
    name: string,        // Normalized (lowercase, trimmed)
    dob: string,         // ISO format (YYYY-MM-DD)
    threeWords: string[] // Normalized (lowercase, sorted)
  },
  record: PatientRecord, // Full patient record object
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## Access Control

The app uses keyword matching for access control:
- Records are queried by `name` and `dob` (indexed fields)
- The `threeWords` array is then compared exactly (case-insensitive, sorted)
- Only records where all three match are returned

## Creating New Records

To create a new patient record programmatically:

```typescript
import { createPatientRecord } from './services/firebaseService';
import { PatientRecord } from './types';

const newRecord: PatientRecord = {
  // ... your record data
};

const threeWords = ['word1', 'word2', 'word3'];
await createPatientRecord(newRecord, threeWords);
```

## Troubleshooting

### "Record not found" error
- Verify the seed script ran successfully
- Check that name, DOB, and three words match exactly (case-insensitive)
- Verify Firebase config is correct

### Firestore permission errors
- Check your Firestore security rules
- Ensure you're using the correct project ID

### Network errors
- Check your internet connection
- Verify Firebase project is active
- Check browser console for detailed error messages

## Next Steps

- [ ] Set up proper Firestore security rules for production
- [ ] Add error handling and retry logic
- [ ] Implement offline support with Firestore offline persistence
- [ ] Add data validation before writes
- [ ] Set up Firebase indexes for better query performance

