# Quick Start: Firebase Integration

## 🚀 Get Started in 5 Steps

### Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name it (e.g., "nomad-ehr")
4. Complete the setup wizard

### Step 2: Create Firestore Database
1. In Firebase Console, click "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location
5. Click "Enable"

### Step 3: Get Your Config
1. In Firebase Console, click ⚙️ > "Project settings"
2. Scroll to "Your apps"
3. Click the web icon `</>`
4. Register your app
5. Copy the `firebaseConfig` object

### Step 4: Add Config to App
Open `firebase/config.ts` and replace the placeholders:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_AUTH_DOMAIN_HERE",
  projectId: "YOUR_PROJECT_ID_HERE",
  storageBucket: "YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID_HERE",
  appId: "YOUR_APP_ID_HERE"
};
```

### Step 5: Seed the Database
```bash
# Install tsx if needed
npm install -D tsx

# Run the seed script
npx tsx scripts/seedFirebase.ts
```

## ✅ Test It!

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Go to the Access page

3. Enter these credentials:
   - **Name**: `Alara Kovic`
   - **DOB**: `1994-06-12`
   - **Three Words**: `sunrise`, `ripple`, `hope`

4. Click "Unlock Record"

5. You should see the patient record loaded from Firebase! 🎉

## 📝 What's Different Now?

- **Access Records**: Queries Firebase instead of using mock data
- **Create Notes**: Saves to Firebase automatically
- **Update Entries**: Saves to Firebase automatically
- **Keyword Matching**: Only records with matching name, DOB, AND three words are accessible

## 🆘 Troubleshooting

**"Record not found" error?**
- Make sure you ran the seed script
- Check that name, DOB, and words match exactly (case-insensitive)

**Firebase errors?**
- Verify your config values are correct
- Check that Firestore is enabled
- Check browser console for detailed errors

**Need help?**
- See `FIREBASE_SETUP.md` for detailed instructions
- See `FIREBASE_INTEGRATION_SUMMARY.md` for technical details

