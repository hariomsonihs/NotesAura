# 🔥 Firebase Data Structure - NotesAura

## Firebase Collections:

### 1. `categories` Collection
```javascript
Document ID: "programming" (lowercase, underscore separated)
{
  name: "Programming Languages",
  order: 0,
  imageUrl: "https://..."
}
```

**Category IDs used in app:**
- `programming`
- `web_development`
- `app_development`
- `data_science`
- `cheat_sheets`

### 2. `courses` Collection
```javascript
Document ID: Auto-generated
{
  title: "Java Programming",
  description: "Learn Java from basics",
  category: "programming",  // Must match category document ID
  difficulty: "Beginner",
  duration: 10,
  price: 0,
  rating: 4.5,
  imageUrl: "https://...",
  featured: true,
  featuredOrder: 0,
  globalOrder: 0,
  categoryOrder: 0,
  learningObjectives: ["Learn basics", "Build apps"],
  targetAudience: ["Beginners", "Students"],
  exercises: [
    {
      id: "e1",
      title: "Introduction",
      description: "Getting started",
      contentPath: "https://...",
      courseId: "course_id"
    }
  ],
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 3. `users` Collection
```javascript
Document ID: User UID
{
  name: "User Name",
  email: "user@email.com",
  phone: "+1234567890",
  premium: false,
  joinDate: Timestamp,
  fcmToken: "..."
}
```

### 4. `enrolled_courses` Subcollection
```
Path: users/{userId}/enrolledCourses/{courseId}
{
  courseName: "Java Programming",
  category: "programming",
  progressPercentage: 45,
  enrollmentDate: Timestamp,
  lastAccessed: Timestamp
}
```

### 5. `quiz_progress` Collection
```javascript
{
  userId: "user_uid",
  quizSetId: "quiz_id",
  quizSetName: "Java Basics",
  categoryName: "Programming",
  subcategoryName: "Java",
  totalQuestions: 10,
  correctAnswers: 8,
  percentage: 80,
  isCompleted: true,
  completedAt: Timestamp
}
```

## 🔍 Common Issues:

### Issue 1: Category Mismatch
**Problem:** Course has `category: "Programming"` but category ID is `"programming"`
**Fix:** Use lowercase category IDs everywhere

### Issue 2: No Categories
**Problem:** `categories` collection doesn't exist
**Fix:** Create categories first

### Issue 3: Wrong Field Names
**Problem:** Using `exerciseCount` instead of `exercises.length`
**Fix:** Use correct field names

## ✅ Quick Fix Script

Run this in Firebase Console → Firestore → Add these documents:

### Add Categories:
```
Collection: categories
Document ID: programming
Fields:
  name: "Programming Languages"
  order: 0
  imageUrl: ""

Document ID: web_development
Fields:
  name: "Web Development"
  order: 1
  imageUrl: ""

Document ID: app_development
Fields:
  name: "App Development"
  order: 2
  imageUrl: ""

Document ID: data_science
Fields:
  name: "Data Science"
  order: 3
  imageUrl: ""
```

### Add Sample Course:
```
Collection: courses
Auto ID
Fields:
  title: "Java Programming"
  description: "Learn Java from basics to advanced"
  category: "programming"
  difficulty: "Beginner"
  duration: 10
  price: 0
  rating: 4.5
  imageUrl: ""
  featured: true
  featuredOrder: 0
  globalOrder: 0
  categoryOrder: 0
  exercises: []
  learningObjectives: []
  targetAudience: []
```

## 🚀 Website Fix Required:

The website needs to:
1. Load from `categories` collection (not hardcoded)
2. Match category IDs correctly (lowercase)
3. Handle missing data gracefully
4. Show proper error messages
