import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import './CourseDetail.css';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('index');
  const [enrolled, setEnrolled] = useState(false);
  const [completedExercises, setCompletedExercises] = useState([]);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const courseDoc = await getDoc(doc(db, 'courses', courseId));
        if (courseDoc.exists()) {
          const courseData = { id: courseDoc.id, ...courseDoc.data() };
          setCourse(courseData);

          const user = auth.currentUser;
          if (user) {
            try {
              const enrollDoc = await getDoc(
                doc(db, 'users', user.uid, 'enrolledCourses', courseId)
              );
              if (enrollDoc.exists()) {
                setEnrolled(true);
                const data = enrollDoc.data();
                setCompletedExercises(data.completedExercises || []);
              }
            } catch (error) {
              console.error('Error checking enrollment:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error loading course:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId]);

  const handleEnroll = async () => {
    const user = auth.currentUser;
    if (!user) {
      navigate('/login');
      return;
    }

    // Check if user is premium
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const isPremium = userDoc.exists() && userDoc.data().premium === true;

    // Check if course is free or user is premium
    if (course.price === 0 || !course.price || isPremium) {
      // Free enrollment
      try {
        await setDoc(doc(db, 'users', user.uid, 'enrolledCourses', courseId), {
          courseName: course.title,
          category: course.category,
          progressPercentage: 0,
          completedExercises: [],
          enrollmentDate: new Date(),
          lastAccessed: new Date(),
          enrollmentType: isPremium ? 'Premium Access by Admin' : 'Free'
        });
        setEnrolled(true);
        if (isPremium) {
          alert('✅ Enrolled successfully!\n👑 Premium Access by Admin');
        } else {
          alert('Enrolled successfully! 🎉');
        }
      } catch (error) {
        console.error('Error enrolling:', error);
        alert('Failed to enroll');
      }
    } else {
      // Paid course - initiate Razorpay payment
      initiatePayment();
    }
  };

  const initiatePayment = () => {
    const user = auth.currentUser;
    if (!user) {
      alert('Please login first');
      return;
    }

    const options = {
      key: 'rzp_live_RDxnU79iQNwjZM', // Razorpay live key
      amount: course.price * 100, // Amount in paise
      currency: 'INR',
      name: 'NotesAura',
      description: course.title,
      image: '/logo.webp',
      handler: async function (response) {
        // Payment successful
        try {
          const user = auth.currentUser;
          
          // Save payment record
          await setDoc(doc(db, 'payments', response.razorpay_payment_id), {
            userId: user.uid,
            courseName: course.title,
            courseId: courseId,
            amount: course.price,
            orderId: response.razorpay_order_id || '',
            transactionId: response.razorpay_payment_id,
            paymentMethod: 'Razorpay',
            status: 'success',
            timestamp: new Date(),
            category: course.category
          });

          // Enroll user
          await setDoc(doc(db, 'users', user.uid, 'enrolledCourses', courseId), {
            courseName: course.title,
            category: course.category,
            progressPercentage: 0,
            completedExercises: [],
            enrollmentDate: new Date(),
            lastAccessed: new Date()
          });

          setEnrolled(true);
          alert('✅ Payment successful! You are now enrolled.');
        } catch (error) {
          console.error('Error after payment:', error);
          alert('❌ Payment successful but enrollment failed. Contact support.');
        }
      },
      prefill: {
        name: user.displayName || '',
        email: user.email || '',
        contact: ''
      },
      theme: {
        color: '#667eea'
      },
      modal: {
        ondismiss: function() {
          alert('❌ Payment cancelled');
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handleExerciseClick = (exercise) => {
    navigate(`/exercise/${courseId}/${exercise.id}`);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner">📚</div>
        <p>Loading course...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="error-state">
        <div className="error-icon">❌</div>
        <h2>Course not found</h2>
        <button className="btn-primary" onClick={() => navigate('/categories')}>
          Browse Courses
        </button>
      </div>
    );
  }

  const completedCount = completedExercises.length;
  const totalExercises = course.exercises?.length || 0;
  const progress = totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0;

  return (
    <div className="course-detail-page">
      <div className="course-header gradient-primary">
        <div className="container">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <h1>{course.title}</h1>
          <div className="course-meta">
            <span>⏱️ {course.duration || 0}h</span>
            <span>⭐ {course.rating || 4.5}</span>
            <span>📚 {totalExercises} lessons</span>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button 
            className={`tab ${activeTab === 'index' ? 'active' : ''}`}
            onClick={() => setActiveTab('index')}
          >
            Index
          </button>
        </div>

        {activeTab === 'description' ? (
          <div className="description-tab">
            <div className="card">
              <h3>📖 About this course</h3>
              <p>{course.description}</p>
              
              {course.learningObjectives?.length > 0 && (
                <>
                  <h4>What you'll learn:</h4>
                  <ul>
                    {course.learningObjectives.map((obj, idx) => (
                      <li key={idx}>{obj}</li>
                    ))}
                  </ul>
                </>
              )}

              {course.targetAudience?.length > 0 && (
                <>
                  <h4>Who this course is for:</h4>
                  <ul>
                    {course.targetAudience.map((aud, idx) => (
                      <li key={idx}>{aud}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="index-tab">
            {course.exercises && course.exercises.length > 0 ? (
              <>
                {course.exercises.map((exercise, index) => {
                  const isCompleted = completedExercises.includes(exercise.id);
                  return (
                    <div 
                      key={`${exercise.id}-${index}`}
                      className="exercise-card card"
                      onClick={() => handleExerciseClick(exercise)}
                    >
                      <div className={`exercise-icon ${isCompleted ? 'completed' : ''}`}>
                        {isCompleted ? '✓' : '📖'}
                      </div>
                      <div className="exercise-content">
                        <h4>{exercise.title}</h4>
                        {exercise.description && (
                          <p className="exercise-desc">{exercise.description}</p>
                        )}
                      </div>
                      <div className="exercise-arrow">→</div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="empty-state card">
                <p>📚 No exercises available yet</p>
              </div>
            )}
          </div>
        )}

        {totalExercises > 0 && (
          <div className="progress-card card">
            <div className="progress-info">
              <span>{completedCount}/{totalExercises} exercises</span>
              <span>{progress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        {!enrolled && (
          <button className="enroll-btn btn-primary" onClick={handleEnroll}>
            {course.price === 0 ? 'ENROLL FOR FREE' : `ENROLL FOR ₹${course.price}`}
          </button>
        )}

        {enrolled && totalExercises > 0 && (
          <button 
            className="continue-btn gradient-green" 
            onClick={() => handleExerciseClick(course.exercises[0])}
          >
            CONTINUE LEARNING
          </button>
        )}

        <div style={{ height: '100px' }}></div>
      </div>
    </div>
  );
};

export default CourseDetail;
