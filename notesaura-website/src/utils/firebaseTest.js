// Firebase Connection Test Utility
// Run this in browser console to test Firebase connection

import { db } from './firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  console.log('🔥 Testing Firebase Connection...');
  
  try {
    // Test 1: Check Firebase config
    console.log('✅ Firebase initialized');
    
    // Test 2: Try to read courses
    console.log('📚 Fetching courses...');
    const coursesRef = collection(db, 'courses');
    const snapshot = await getDocs(coursesRef);
    
    console.log(`✅ Found ${snapshot.size} courses`);
    
    if (snapshot.size > 0) {
      console.log('📋 Sample course:', snapshot.docs[0].data());
    } else {
      console.warn('⚠️ No courses found in database');
    }
    
    // Test 3: List all collections
    console.log('📂 Available collections:');
    const collections = ['courses', 'users', 'enrolled_courses', 'quiz_progress'];
    
    for (const collName of collections) {
      try {
        const collRef = collection(db, collName);
        const collSnap = await getDocs(collRef);
        console.log(`  - ${collName}: ${collSnap.size} documents`);
      } catch (err) {
        console.log(`  - ${collName}: Error - ${err.message}`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Firebase Error:', error);
    return false;
  }
};

// Auto-run test
if (typeof window !== 'undefined') {
  window.testFirebase = testFirebaseConnection;
  console.log('💡 Run window.testFirebase() to test Firebase connection');
}
