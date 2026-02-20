import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase/config';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import TextViewer from '../components/TextViewer';
import './Exercise.css';

const Exercise = () => {
  const { courseId, exerciseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contentType, setContentType] = useState('web');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const checkCompletion = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const enrollDoc = await getDoc(
          doc(db, 'users', user.uid, 'enrolledCourses', courseId)
        );
        if (enrollDoc.exists()) {
          const data = enrollDoc.data();
          const completed = data.completedExercises || [];
          setIsCompleted(completed.includes(exerciseId));
        }
      } catch (error) {
        console.error('Error checking completion:', error);
      }
    };

    const detectContentType = (url) => {
      if (!url) {
        return { processedUrl: '', type: 'none' };
      }

      // Convert GitHub blob URLs to raw URLs
      let processedUrl = url;
      if (url.includes('github.com') && url.includes('/blob/')) {
        processedUrl = url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
      }

      if (
        processedUrl.includes('drive.google.com') ||
        processedUrl.includes('dropbox.com') ||
        processedUrl.toLowerCase().endsWith('.pdf')
      ) {
        return { processedUrl, type: 'pdf' };
      }

      if (
        processedUrl.includes('raw.githubusercontent.com') ||
        processedUrl.toLowerCase().endsWith('.txt') ||
        processedUrl.toLowerCase().endsWith('.md')
      ) {
        return { processedUrl, type: 'text' };
      }

      return { processedUrl, type: 'web' };
    };

    const loadExercise = async () => {
      try {
        const courseDoc = await getDoc(doc(db, 'courses', courseId));
        if (courseDoc.exists()) {
          const courseData = { id: courseDoc.id, ...courseDoc.data() };
          setCourse(courseData);

          const ex = courseData.exercises?.find(e => e.id === exerciseId);
          if (ex) {
            const { processedUrl, type } = detectContentType(ex.contentPath);
            setExercise({ ...ex, contentPath: processedUrl });
            setContentType(type);
            await checkCompletion();
          } else {
            setContentType('none');
          }
        }
      } catch (error) {
        console.error('Error loading exercise:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExercise();
  }, [courseId, exerciseId]);

  const getPdfUrl = (url) => {
    // Google Drive PDF
    if (url.includes('drive.google.com')) {
      const fileId = url.match(/\/d\/(.+?)\//)?.[1] || url.match(/id=(.+?)(&|$)/)?.[1];
      if (fileId) {
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }
    // Dropbox PDF
    if (url.includes('dropbox.com')) {
      return url.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', '');
    }
    // Direct PDF
    return url;
  };

  const getCurrentExerciseIndex = () => {
    return course?.exercises?.findIndex(e => e.id === exerciseId) || 0;
  };

  const handlePrevious = () => {
    const currentIndex = getCurrentExerciseIndex();
    if (currentIndex > 0) {
      const prevExercise = course.exercises[currentIndex - 1];
      navigate(`/exercise/${courseId}/${prevExercise.id}`);
    } else {
      navigate(`/course/${courseId}`);
    }
  };

  const handleNext = () => {
    const currentIndex = getCurrentExerciseIndex();
    if (currentIndex < course.exercises.length - 1) {
      const nextExercise = course.exercises[currentIndex + 1];
      navigate(`/exercise/${courseId}/${nextExercise.id}`);
    } else {
      navigate(`/course/${courseId}`);
    }
  };

  const handleMarkComplete = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const enrollRef = doc(db, 'users', user.uid, 'enrolledCourses', courseId);
      const enrollDoc = await getDoc(enrollRef);
      
      if (enrollDoc.exists()) {
        const data = enrollDoc.data();
        const completed = data.completedExercises || [];
        
        if (!completed.includes(exerciseId)) {
          await updateDoc(enrollRef, {
            completedExercises: arrayUnion(exerciseId),
            progressPercentage: Math.round(((completed.length + 1) / course.exercises.length) * 100),
            lastAccessed: new Date()
          });
          setIsCompleted(true);
          alert('Exercise marked as complete! ✓');
        }
      }
      handleNext();
    } catch (error) {
      console.error('Error marking complete:', error);
      alert('Failed to mark as complete');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner">📖</div>
        <p>Loading exercise...</p>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="error-state">
        <div className="error-icon">❌</div>
        <h2>Exercise not found</h2>
        <button className="btn-primary" onClick={() => navigate(`/course/${courseId}`)}>
          Back to Course
        </button>
      </div>
    );
  }

  return (
    <div className="exercise-page">
      <div className="exercise-top-bar">
        <button className="back-btn" onClick={() => navigate(`/course/${courseId}`)}>
          ← Back to Course
        </button>
      </div>

      <div className="exercise-header">
        <div className="container">
          <h1>
            {exercise.title}
            {isCompleted && <span className="completed-badge"> ✓ Completed</span>}
          </h1>
          {exercise.description && <p>{exercise.description}</p>}
        </div>
      </div>

      <div className="exercise-content">
        {contentType === 'web' && exercise.contentPath && (
          <iframe
            src={exercise.contentPath}
            title={exercise.title}
            className="content-iframe"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        )}

        {contentType === 'pdf' && exercise.contentPath && (
          <iframe
            src={getPdfUrl(exercise.contentPath)}
            title={exercise.title}
            className="content-iframe"
          />
        )}

        {contentType === 'text' && exercise.contentPath && (
          <TextViewer url={exercise.contentPath} />
        )}

        {contentType === 'none' && (
          <div className="no-content">
            <div className="no-content-icon">📄</div>
            <h2>No content available</h2>
            <p>This exercise doesn't have any content yet.</p>
            <button className="btn-primary" onClick={() => navigate(`/course/${courseId}`)}>
              Back to Course
            </button>
          </div>
        )}
      </div>

      <div className="exercise-footer">
        <button 
          className="btn-secondary" 
          onClick={handlePrevious}
        >
          ← Previous
        </button>
        <button 
          className="btn-primary"
          onClick={handleMarkComplete}
          disabled={isCompleted}
        >
          {isCompleted ? 'Completed ✓' : 'Mark Complete ✓'}
        </button>
        <button 
          className="btn-secondary"
          onClick={handleNext}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Exercise;
