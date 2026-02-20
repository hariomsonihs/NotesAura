# NotesAura Website 🚀

Complete web version of NotesAura Programming Guide Android app with same design and functionality!

## ✨ Features

- 🔐 Firebase Authentication (Email/Password)
- 🏠 Modern Home Page with Course Carousels
- 📚 Categories Page
- 👤 User Profile with Progress Tracking
- 💬 AI Chatbot (Google Gemini)
- 📱 Responsive Design (Mobile, Tablet, Desktop)
- 🎨 Same Gradient Design as Android App
- 🔄 Real-time Firebase Sync

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd notesaura-website
npm install
```

### 2. Additional Dependencies
```bash
npm install react-firebase-hooks
```

### 3. Update Gemini API Key
Open `src/components/ChatBot.js` and replace the API key on line 11:
```javascript
const GEMINI_API_KEY = 'YOUR_ACTUAL_GEMINI_API_KEY';
```

Get your free API key from: https://makersuite.google.com/app/apikey

### 4. Start Development Server
```bash
npm start
```

Website will open at: http://localhost:3000

## 📁 Project Structure

```
notesaura-website/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js          # Top navigation bar
│   │   ├── BottomNav.js       # Bottom navigation (like Android)
│   │   ├── CourseCard.js      # Course card component
│   │   └── ChatBot.js         # AI chatbot
│   ├── pages/
│   │   ├── Home.js            # Home page with courses
│   │   ├── Login.js           # Login/Register page
│   │   ├── Categories.js      # All categories
│   │   └── Profile.js         # User profile
│   ├── firebase/
│   │   └── config.js          # Firebase configuration
│   ├── styles/
│   │   └── globals.css        # Global styles
│   ├── App.js                 # Main app with routing
│   └── index.js               # Entry point
└── package.json
```

## 🎨 Design Features

### Same as Android App:
- ✅ Purple-Blue Gradient Theme
- ✅ Card-based Layout with Shadows
- ✅ Bottom Navigation (5 items)
- ✅ Drawer Menu
- ✅ Floating Chatbot Button
- ✅ Course Carousels
- ✅ Emoji-rich Interface
- ✅ Rounded Corners (24dp)

## 🔥 Firebase Setup

The website uses the same Firebase project as your Android app:
- Project ID: `notesaura-programming-guide`
- Same Firestore collections
- Same Authentication
- Real-time sync with Android app

## 📱 Responsive Design

- **Desktop**: Full layout with sidebar
- **Tablet**: Optimized grid layout
- **Mobile**: Bottom navigation, drawer menu

## 🚀 Deployment

### Option 1: Firebase Hosting (Recommended)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### Option 2: Vercel (Easiest)
```bash
npm install -g vercel
vercel
```

### Option 3: Netlify
1. Run `npm run build`
2. Drag `build` folder to Netlify

## 🔧 Configuration

### Update Firebase Config
If needed, update `src/firebase/config.js` with your Firebase credentials.

### Update Colors
Edit `src/styles/globals.css` to change theme colors:
```css
:root {
  --primary-start: #667eea;
  --primary-end: #764ba2;
  --accent-green: #10b981;
}
```

## 📚 Available Pages

- `/` - Home page with featured courses
- `/login` - Login/Register
- `/categories` - All course categories
- `/profile` - User profile and progress
- `/programs` - Programs (Coming soon)
- `/ebooks` - Ebooks (Coming soon)

## 🤖 AI Chatbot

The chatbot uses Google Gemini AI API. To enable:
1. Get API key from Google AI Studio
2. Update `GEMINI_API_KEY` in `ChatBot.js`
3. Chatbot will appear as floating button on all pages

## 🎯 Next Steps

### Phase 2 Features (To Add):
- [ ] Course Detail Page
- [ ] Exercise Viewer (HTML/PDF/Text)
- [ ] Quiz System
- [ ] Interview Questions
- [ ] Programs Section
- [ ] Ebooks Section
- [ ] Search Functionality
- [ ] Notifications
- [ ] Payment Integration

## 💡 Tips

- Use Chrome DevTools for mobile testing
- Check Firebase Console for data
- Monitor Network tab for API calls
- Use React DevTools for debugging

## 🐛 Troubleshooting

**Login not working?**
- Check Firebase Authentication is enabled
- Verify email/password in Firebase Console

**Courses not loading?**
- Check Firestore rules allow read access
- Verify collection name is 'courses'
- Check browser console for errors

**Chatbot not responding?**
- Verify Gemini API key is correct
- Check network tab for API errors
- Ensure API key has proper permissions

## 📞 Support

For issues, check:
- Browser console (F12)
- Firebase Console
- Network tab for failed requests

---

**Built with ❤️ using React + Firebase**

Same design, same functionality, same Firebase backend as Android app! 🎉
