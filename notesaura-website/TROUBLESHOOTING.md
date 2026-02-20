# 🔧 NotesAura Website - Troubleshooting Guide

## ❌ Problem: Courses Not Showing

### Quick Fixes:

#### 1. Check Browser Console
```
Press F12 → Console Tab
Look for errors (red text)
```

**Common Errors:**
- `Firebase: Error (auth/...)` → Authentication issue
- `Firestore: Missing or insufficient permissions` → Database rules issue
- `Network error` → Internet connection issue

#### 2. Verify Firebase Connection

**Open Browser Console (F12) and run:**
```javascript
// Check if Firebase is loaded
console.log('Firebase:', window.firebase);

// Check current user
console.log('User:', auth.currentUser);

// Test database connection
getDocs(collection(db, 'courses')).then(snap => {
  console.log('Courses found:', snap.size);
});
```

#### 3. Check Firestore Rules

**Go to Firebase Console:**
1. Open: https://console.firebase.google.com
2. Select project: `notesaura-programming-guide`
3. Go to: Firestore Database → Rules
4. Check rules allow read access

**Required Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read courses
    match /courses/{courseId} {
      allow read: if request.auth != null;
    }
    
    // Allow users to read their own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow users to read their enrolled courses
    match /enrolled_courses/{enrollmentId} {
      allow read: if request.auth != null;
    }
  }
}
```

#### 4. Verify Data Exists in Firebase

**Firebase Console → Firestore Database:**
- Check `courses` collection exists
- Check it has documents
- Check documents have fields: `title`, `category`, `description`

#### 5. Clear Browser Cache

```
Chrome: Ctrl+Shift+Delete
Firefox: Ctrl+Shift+Delete
Edge: Ctrl+Shift+Delete

Select:
- Cached images and files
- Cookies and site data
```

#### 6. Restart Development Server

```bash
# Stop server (Ctrl+C)
# Then restart:
npm start
```

---

## ❌ Problem: Header/Navbar Blank

### Fixes:

#### 1. Check if User is Logged In
```javascript
// Browser console
console.log('Current user:', auth.currentUser);
```

If `null` → User not logged in → Navbar won't show

#### 2. Verify Navbar Component
```javascript
// Check if Navbar is rendering
document.querySelector('.navbar');
```

#### 3. Check CSS Loading
```javascript
// Check if styles are applied
getComputedStyle(document.querySelector('.navbar')).background;
```

---

## ❌ Problem: Categories Not Showing

### Fixes:

#### 1. Check Course Data
```javascript
// Browser console
getDocs(collection(db, 'courses')).then(snap => {
  const categories = new Set();
  snap.docs.forEach(doc => {
    categories.add(doc.data().category);
  });
  console.log('Available categories:', Array.from(categories));
});
```

#### 2. Verify Category Names Match
Categories in code:
- Programming
- Web Development
- App Development
- Data Science

Must match exactly in Firebase (case-sensitive!)

---

## ❌ Problem: Profile Data Not Showing

### Fixes:

#### 1. Check User Document
```javascript
// Browser console
const userId = auth.currentUser.uid;
getDoc(doc(db, 'users', userId)).then(docSnap => {
  console.log('User data:', docSnap.data());
});
```

#### 2. Check Enrolled Courses
```javascript
// Browser console
const userId = auth.currentUser.uid;
getDocs(query(collection(db, 'enrolled_courses'), where('userId', '==', userId)))
  .then(snap => {
    console.log('Enrolled courses:', snap.size);
  });
```

---

## 🔍 Debug Mode

### Enable Detailed Logging:

**Add to `src/index.js`:**
```javascript
// Enable Firebase debug mode
import { setLogLevel } from 'firebase/firestore';
setLogLevel('debug');
```

---

## ✅ Verification Checklist

### Before Running Website:

- [ ] `npm install` completed successfully
- [ ] `npm install react-firebase-hooks` completed
- [ ] Firebase config in `src/firebase/config.js` is correct
- [ ] Internet connection is working
- [ ] Firebase project is active (not deleted)
- [ ] Firestore rules allow read access
- [ ] At least 1 course exists in Firebase

### After Login:

- [ ] User email shows in navbar drawer
- [ ] Home page loads without errors
- [ ] At least one course section shows
- [ ] Categories page shows 8 categories
- [ ] Profile page shows user info

---

## 🚀 Quick Test Commands

### Test 1: Check Dependencies
```bash
cd notesaura-website
npm list firebase react-firebase-hooks
```

### Test 2: Check for Errors
```bash
npm start
# Watch terminal for errors
```

### Test 3: Browser Console Test
```javascript
// Open browser console (F12)
// Run these one by one:

// 1. Check Firebase
console.log('Firebase loaded:', typeof firebase !== 'undefined');

// 2. Check Auth
console.log('User:', auth.currentUser?.email);

// 3. Check Firestore
getDocs(collection(db, 'courses')).then(s => console.log('Courses:', s.size));
```

---

## 📊 Expected Results

### Home Page:
- Header with "Hello, [Name]!"
- At least 1 course section visible
- Course cards with images and titles
- Bottom navigation visible
- Chatbot button (bottom-right)

### Categories Page:
- 8 category cards
- Each shows course count
- Gradient backgrounds
- Clickable cards

### Profile Page:
- User avatar/initial
- User name and email
- Statistics cards (3)
- Enrolled courses list (if any)
- Quiz progress (if any)

---

## 🆘 Still Not Working?

### Step 1: Check Firebase Console
1. Go to: https://console.firebase.google.com
2. Select: `notesaura-programming-guide`
3. Check:
   - Authentication → Users (should have your account)
   - Firestore → courses (should have documents)
   - Firestore → Rules (should allow read)

### Step 2: Check Browser Network Tab
1. Press F12
2. Go to Network tab
3. Reload page
4. Look for failed requests (red)
5. Click on failed request to see error

### Step 3: Check Firebase API Key
1. Open `src/firebase/config.js`
2. Verify API key matches Firebase Console
3. Go to: Firebase Console → Project Settings → General
4. Compare API key

### Step 4: Re-install Dependencies
```bash
cd notesaura-website
rm -rf node_modules
rm package-lock.json
npm install
npm install react-firebase-hooks
npm start
```

---

## 💡 Common Solutions

### Solution 1: Add Sample Data
If no courses in Firebase, add sample course:

**Firebase Console → Firestore → courses → Add Document:**
```json
{
  "title": "Java Programming",
  "category": "Programming",
  "description": "Learn Java from scratch",
  "featured": true,
  "imageUrl": "",
  "rating": "4.5",
  "exerciseCount": 10
}
```

### Solution 2: Update Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### Solution 3: Clear Everything and Restart
```bash
# Stop server (Ctrl+C)
# Clear browser cache (Ctrl+Shift+Delete)
# Restart server
npm start
# Hard refresh browser (Ctrl+Shift+R)
```

---

## 📞 Debug Information to Collect

If still having issues, collect this info:

1. **Browser Console Errors** (F12 → Console)
2. **Network Errors** (F12 → Network)
3. **Firebase Project ID** (from config.js)
4. **Number of courses in Firebase** (Firestore → courses)
5. **Firestore Rules** (copy-paste)
6. **npm version** (`npm --version`)
7. **Node version** (`node --version`)

---

## ✅ Success Indicators

When everything works:
- ✅ No errors in console
- ✅ Courses load on home page
- ✅ Categories show course counts
- ✅ Profile shows user data
- ✅ Navbar shows properly
- ✅ Bottom nav works
- ✅ Chatbot button visible

---

**Most Common Issue:** Firestore rules not allowing read access
**Quick Fix:** Update rules to allow authenticated read

**Second Most Common:** No courses in database
**Quick Fix:** Add at least 1 course via Firebase Console or Admin Panel
