import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  updateDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { PatientRecord, Note, Commit, MedicalSection } from '../types';

// Collection name in Firestore
const RECORDS_COLLECTION = 'patientRecords';

/**
 * Firestore Document Structure:
 * {
 *   // Access keys (for querying)
 *   accessKeys: {
 *     name: string (normalized: lowercase, trimmed)
 *     dob: string (ISO format: YYYY-MM-DD)
 *     threeWords: string[] (normalized: lowercase, sorted)
 *   }
 *   
 *   // Full patient record
 *   record: PatientRecord
 * }
 */

/**
 * Normalize name for consistent searching (lowercase, trim)
 */
function normalizeName(name: string): string {
  return name.toLowerCase().trim();
}

/**
 * Normalize three words array (lowercase, sort for consistent matching)
 */
function normalizeThreeWords(words: string[]): string[] {
  return words.map(w => w.toLowerCase().trim()).sort();
}

/**
 * Search for a patient record by name, DOB, and three-word key
 * Returns the record if all three match exactly
 */
export async function findRecordByAccessKeys(
  name: string,
  dob: string,
  threeWords: string[]
): Promise<PatientRecord | null> {
  try {
    const normalizedName = normalizeName(name);
    const normalizedWords = normalizeThreeWords(threeWords);
    
    // Query Firestore for records matching name and DOB
    const recordsRef = collection(db, RECORDS_COLLECTION);
    const q = query(
      recordsRef,
      where('accessKeys.name', '==', normalizedName),
      where('accessKeys.dob', '==', dob)
    );
    
    const querySnapshot = await getDocs(q);
    
    // Check each result to see if threeWords match
    for (const docSnapshot of querySnapshot.docs) {
      const data = docSnapshot.data();
      const storedWords = data.accessKeys?.threeWords || [];
      
      // Compare normalized three-word arrays
      if (JSON.stringify(normalizedWords) === JSON.stringify(storedWords)) {
        // All keys match! Return the record
        return data.record as PatientRecord;
      }
    }
    
    // No matching record found
    return null;
  } catch (error) {
    console.error('Error finding record by access keys:', error);
    throw error;
  }
}

/**
 * Create a new patient record in Firestore
 */
export async function createPatientRecord(record: PatientRecord, threeWords: string[]): Promise<string> {
  try {
    const normalizedName = normalizeName(record.name);
    const normalizedWords = normalizeThreeWords(threeWords);
    
    const recordData = {
      accessKeys: {
        name: normalizedName,
        dob: record.dob,
        threeWords: normalizedWords
      },
      record: record,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, RECORDS_COLLECTION), recordData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating patient record:', error);
    throw error;
  }
}

/**
 * Update an existing patient record
 * Requires the access keys to verify ownership
 */
export async function updatePatientRecord(
  name: string,
  dob: string,
  threeWords: string[],
  updatedRecord: PatientRecord
): Promise<void> {
  try {
    // First find the record to get its document ID
    const normalizedName = normalizeName(name);
    const normalizedWords = normalizeThreeWords(threeWords);
    
    const recordsRef = collection(db, RECORDS_COLLECTION);
    const q = query(
      recordsRef,
      where('accessKeys.name', '==', normalizedName),
      where('accessKeys.dob', '==', dob)
    );
    
    const querySnapshot = await getDocs(q);
    
    for (const docSnapshot of querySnapshot.docs) {
      const data = docSnapshot.data();
      const storedWords = data.accessKeys?.threeWords || [];
      
      if (JSON.stringify(normalizedWords) === JSON.stringify(storedWords)) {
        // Found the record, update it
        const docRef = doc(db, RECORDS_COLLECTION, docSnapshot.id);
        await updateDoc(docRef, {
          record: updatedRecord,
          updatedAt: Timestamp.now()
        });
        return;
      }
    }
    
    throw new Error('Record not found or access keys do not match');
  } catch (error) {
    console.error('Error updating patient record:', error);
    throw error;
  }
}

/**
 * Get a record by its Firestore document ID (for internal use)
 */
export async function getRecordById(docId: string): Promise<PatientRecord | null> {
  try {
    const docRef = doc(db, RECORDS_COLLECTION, docId);
    const docSnapshot = await getDoc(docRef);
    
    if (docSnapshot.exists()) {
      return docSnapshot.data().record as PatientRecord;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting record by ID:', error);
    throw error;
  }
}

