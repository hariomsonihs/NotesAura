import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedQuizzes, setCompletedQuizzes] = useState(0);

  const handleResetPassword = async () => {
    if (!user?.email) return;
    try {
      await sendPasswordResetEmail(auth, user.email);
      alert('✅ Password reset email sent! Check your inbox.');
    } catch (error) {
      alert('❌ Failed to send reset email');
    }
  };

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      loadUserData(currentUser.uid);
      loadEnrolledCourses(currentUser.uid);
      loadQuizProgress(currentUser.uid);
    }
  }, []);

  const loadUserData = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadEnrolledCourses = async (userId) => {
    try {
      // Try subcollection first
      const enrolledRef = collection(db, 'users', userId, 'enrolledCourses');
      const snapshot = await getDocs(enrolledRef);
      
      if (!snapshot.empty) {
        const courses = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEnrolledCourses(courses);
      } else {
        // Try enrolled_courses collection
        const enrolledRef2 = collection(db, 'enrolled_courses');
        const q = query(enrolledRef2, where('userId', '==', userId));
        const snapshot2 = await getDocs(q);
        const courses = snapshot2.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEnrolledCourses(courses);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading courses:', error);
      setLoading(false);
    }
  };

  const loadQuizProgress = async (userId) => {
    try {
      const quizRef = collection(db, 'quiz_progress');
      const q = query(quizRef, where('userId', '==', userId));
      const snapshot = await getDocs(q);
      const quizzes = snapshot.docs.map(doc => doc.data());
      const completed = quizzes.filter(q => q.isCompleted).length;
      setCompletedQuizzes(completed);
    } catch (error) {
      console.error('Error loading quiz progress:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner">👤</div>
        <p>Loading profile...</p>
      </div>
    );
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };


  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-icon-wrapper">
          <div className="profile-icon-circle">
            👤
          </div>
          {userData?.premium && (
            <div className="premium-badge-profile">
              👑 Premium
            </div>
          )}
        </div>

        <div className="user-info-card card">
          <h3>📋 User Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">👤 Name:</span>
              <span className="info-value">{userData?.name || user?.displayName || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">📧 Email:</span>
              <span className="info-value">{user?.email || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">📱 Phone:</span>
              <span className="info-value">{userData?.phone || 'Not provided'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">🆔 User ID:</span>
              <div className="uid-container">
                <span className="info-value uid-text">{user?.uid}</span>
                <button 
                  className="copy-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(user?.uid);
                    alert('✅ User ID copied!');
                  }}
                  title="Copy User ID"
                >
                  📋
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card card">
            <div className="stat-icon">📚</div>
            <h3>{enrolledCourses.length}</h3>
            <p>Courses Enrolled</p>
          </div>
          <div className="stat-card card">
            <div className="stat-icon">📅</div>
            <h3>{formatDate(userData?.joinDate)}</h3>
            <p>Joining Date</p>
          </div>
          <div className="stat-card card">
            <div className="stat-icon">🎯</div>
            <h3>{completedQuizzes}</h3>
            <p>Quizzes Done</p>
          </div>
        </div>

        <div className="profile-section">
          <h2 className="section-title">📚 My Courses</h2>
          {enrolledCourses.length > 0 ? (
            <div className="course-list">
              {enrolledCourses.map((course, index) => (
                <div 
                  key={index} 
                  className="course-item card"
                  onClick={() => {
                    const courseId = course.courseId || course.id;
                    if (courseId) navigate(`/course/${courseId}`);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="course-item-header">
                    <h3>{course.courseName || course.courseTitle}</h3>
                    <span className="course-category">{course.category || 'General'}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${course.progressPercentage || course.progress || 0}%` }}
                    ></div>
                  </div>
                  <div className="course-item-footer">
                    <span>{course.progressPercentage || course.progress || 0}% Complete</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state card">
              <p>📚 No enrolled courses yet</p>
              <button className="btn-primary" onClick={() => navigate('/')}>
                Explore Courses
              </button>
            </div>
          )}
        </div>

        <div className="profile-actions">
          <button className="action-btn card" onClick={handleResetPassword}>
            <span className="action-icon">🔒</span>
            <span>Forgot Password</span>
          </button>
          <button className="action-btn card" onClick={() => navigate('/payments')}>
            <span className="action-icon">💳</span>
            <span>My Payments</span>
          </button>
        </div>

        <div style={{ height: '100px' }}></div>
      </div>
    </div>
  );
};

export default Profile;
