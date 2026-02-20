import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import CourseCard from '../components/CourseCard';
import './Home.css';

const Home = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [programmingCourses, setProgrammingCourses] = useState([]);
  const [webCourses, setWebCourses] = useState([]);
  const [appCourses, setAppCourses] = useState([]);
  const [dataCourses, setDataCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user name from Firebase
      const user = auth.currentUser;
      if (user) {
        try {
          const { doc, getDoc } = await import('firebase/firestore');
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserName(userDoc.data().name || user.displayName || user.email?.split('@')[0] || 'User');
          } else {
            setUserName(user.displayName || user.email?.split('@')[0] || 'User');
          }
        } catch (error) {
          console.error('Error loading user:', error);
          setUserName(user.displayName || user.email?.split('@')[0] || 'User');
        }
      }

      // Load all courses first
      console.log('Loading courses from Firebase...');
      const coursesRef = collection(db, 'courses');
      const allCoursesSnap = await getDocs(coursesRef);
      
      if (allCoursesSnap.empty) {
        console.log('No courses found in Firebase');
        setError('No courses available. Please add courses from admin panel.');
        setLoading(false);
        return;
      }

      const coursesData = allCoursesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log(`Loaded ${coursesData.length} courses`);
      setAllCourses(coursesData);

      // Filter courses by category ID (not name)
      const featured = coursesData.filter(c => c.featured === true).slice(0, 6);
      const programming = coursesData.filter(c => c.category === 'programming').slice(0, 6);
      const web = coursesData.filter(c => c.category === 'web_development').slice(0, 6);
      const app = coursesData.filter(c => c.category === 'app_development').slice(0, 6);
      const data = coursesData.filter(c => c.category === 'data_science').slice(0, 6);

      console.log('Filtered courses:', {
        featured: featured.length,
        programming: programming.length,
        web: web.length,
        app: app.length,
        data: data.length
      });

      setFeaturedCourses(featured.length > 0 ? featured : coursesData.slice(0, 6));
      setProgrammingCourses(programming);
      setWebCourses(web);
      setAppCourses(app);
      setDataCourses(data);

      setLoading(false);
    } catch (error) {
      console.error('Error loading courses:', error);
      setError('Failed to load courses. Please check your connection.');
      setLoading(false);
    }
  };

  const handleCourseClick = (course) => {
    navigate(`/course/${course.id}`);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner">📚</div>
        <p>Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <div className="error-icon">⚠️</div>
        <h2>{error}</h2>
        <button className="btn-primary" onClick={loadAllData}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="container">
        {/* Greeting Card */}
        <div className="greeting-card card">
          <div className="greeting-content">
            <div>
              <p className="greeting-time">{getGreeting()},</p>
              <h2 className="greeting-name">{userName} 👋</h2>
              <p className="greeting-subtitle">Ready to Learn? 🚀</p>
            </div>
            <div className="greeting-icon">📚</div>
          </div>
        </div>

        {/* Featured Courses */}
        {featuredCourses.length > 0 && (
          <div className="section">
            <div className="section-header">
              <h2 className="section-title">⭐ Featured Courses</h2>
              <button className="btn-secondary" onClick={() => navigate('/courses')}>
                View All 👀
              </button>
            </div>
            <div className="course-carousel">
              {featuredCourses.map(course => (
                <CourseCard key={course.id} course={course} onClick={handleCourseClick} />
              ))}
            </div>
          </div>
        )}

        {/* Programming Courses */}
        {programmingCourses.length > 0 && (
          <div className="section">
            <div className="section-header">
              <h2 className="section-title">💻 Programming Courses</h2>
              <button className="btn-secondary" onClick={() => navigate('/courses')}>
                Explore 🚀
              </button>
            </div>
            <div className="course-carousel">
              {programmingCourses.map(course => (
                <CourseCard key={course.id} course={course} onClick={handleCourseClick} />
              ))}
            </div>
          </div>
        )}

        {/* Web Development */}
        {webCourses.length > 0 && (
          <div className="section">
            <div className="section-header">
              <h2 className="section-title">🌐 Web Development</h2>
              <button className="btn-secondary" onClick={() => navigate('/courses')}>
                Explore 🚀
              </button>
            </div>
            <div className="course-carousel">
              {webCourses.map(course => (
                <CourseCard key={course.id} course={course} onClick={handleCourseClick} />
              ))}
            </div>
          </div>
        )}

        {/* App Development */}
        {appCourses.length > 0 && (
          <div className="section">
            <div className="section-header">
              <h2 className="section-title">📱 App Development</h2>
              <button className="btn-secondary" onClick={() => navigate('/courses')}>
                Explore 🚀
              </button>
            </div>
            <div className="course-carousel">
              {appCourses.map(course => (
                <CourseCard key={course.id} course={course} onClick={handleCourseClick} />
              ))}
            </div>
          </div>
        )}

        {/* Data Science */}
        {dataCourses.length > 0 && (
          <div className="section">
            <div className="section-header">
              <h2 className="section-title">📊 Data Science</h2>
              <button className="btn-secondary" onClick={() => navigate('/courses')}>
                Explore 🚀
              </button>
            </div>
            <div className="course-carousel">
              {dataCourses.map(course => (
                <CourseCard key={course.id} course={course} onClick={handleCourseClick} />
              ))}
            </div>
          </div>
        )}

        {/* Show all courses if no category-specific courses */}
        {allCourses.length > 0 && 
         featuredCourses.length === 0 && 
         programmingCourses.length === 0 && 
         webCourses.length === 0 && 
         appCourses.length === 0 && 
         dataCourses.length === 0 && (
          <div className="section">
            <div className="section-header">
              <h2 className="section-title">📚 All Courses</h2>
            </div>
            <div className="course-carousel">
              {allCourses.slice(0, 12).map(course => (
                <CourseCard key={course.id} course={course} onClick={handleCourseClick} />
              ))}
            </div>
          </div>
        )}

        {/* Motivational Card */}
        <div className="motivational-card card gradient-primary">
          <div className="motivational-content">
            <div>
              <h3>Keep Learning! 🚀</h3>
              <p>You're doing amazing! Keep up the great work! 💪</p>
            </div>
            <div className="trophy">🏆</div>
          </div>
        </div>

        <div style={{ height: '100px' }}></div>
      </div>
    </div>
  );
};

export default Home;
