import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { auth } from './firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import ChatBot from './components/ChatBot';
import Home from './pages/Home';
import Login from './pages/Login';
import Categories from './pages/Categories';
import CategoryCourses from './pages/CategoryCourses';
import AllCourses from './pages/AllCourses';
import Search from './pages/Search';
import CourseDetail from './pages/CourseDetail';
import Exercise from './pages/Exercise';
import Profile from './pages/Profile';
import Payments from './pages/Payments';
import Notifications from './pages/Notifications';
import './styles/globals.css';

const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  
  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner">⏳</div>
        <p>Loading...</p>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

function AppContent() {
  const [user] = useAuthState(auth);
  const location = useLocation();

  const hideBottomNav = location.pathname.includes('/course/') || 
                        location.pathname.includes('/exercise/') ||
                        location.pathname.includes('/categories/');

  const showChatBot = location.pathname === '/';

  return (
    <div className="App">
      <Navbar />
      
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:categoryId" element={<CategoryCourses />} />
        <Route path="/courses" element={<AllCourses />} />
        <Route path="/search" element={<Search />} />
        <Route path="/course/:courseId" element={<CourseDetail />} />
        <Route path="/exercise/:courseId/:exerciseId" element={<Exercise />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/payments" element={
          <ProtectedRoute>
            <Payments />
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {!hideBottomNav && <BottomNav />}
      {showChatBot && <ChatBot />}
    </div>
  );
}

function App() {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    console.log('User state:', user ? 'Logged in' : 'Not logged in');
  }, [user]);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner">⏳</div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
