/**
 * Seed script to populate Firebase with mock patient record
 * 
 * Usage:
 * 1. Make sure Firebase config is set up in firebase/config.ts
 * 2. Run: npx tsx scripts/seedFirebase.ts
 * 
 * This will create a patient record with:
 * - Name: Alara Kovic
 * - DOB: 1994-06-12
 * - Three Words: sunrise, ripple, hope
 */

import { createPatientRecord } from '../services/firebaseService';
import { MOCK_RECORD } from '../constants';

async function seedDatabase() {
  try {
    console.log('🌱 Seeding Firebase with mock patient record...');
    
    const threeWords = ['sunrise', 'ripple', 'hope'];
    const docId = await createPatientRecord(MOCK_RECORD, threeWords);
    
    console.log('✅ Successfully created patient record!');
    console.log(`📄 Document ID: ${docId}`);
    console.log('\n📋 Access Information:');
    console.log(`   Name: ${MOCK_RECORD.name}`);
    console.log(`   DOB: ${MOCK_RECORD.dob}`);
    console.log(`   Three Words: ${threeWords.join(', ')}`);
    console.log('\n💡 You can now use these credentials to access the record in the app.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

