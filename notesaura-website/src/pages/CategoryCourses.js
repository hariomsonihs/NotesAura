import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import CourseCard from '../components/CourseCard';
import './CategoryCourses.css';

const CategoryCourses = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategoryAndCourses = async () => {
      try {
        setLoading(true);

        // Load category details
        const categoryDoc = await getDoc(doc(db, 'categories', categoryId));
        if (categoryDoc.exists()) {
          setCategory({ id: categoryDoc.id, ...categoryDoc.data() });
        }

        // Load courses for this category
        const coursesRef = collection(db, 'courses');
        const q = query(coursesRef, where('category', '==', categoryId));
        const snapshot = await getDocs(q);

        const coursesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })).sort((a, b) => (a.categoryOrder || 0) - (b.categoryOrder || 0));

        setCourses(coursesData);
      } catch (error) {
        console.error('Error loading category courses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryAndCourses();
  }, [categoryId]);

  const handleCourseClick = (course) => {
    navigate(`/course/${course.id}`);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner">📚</div>
        <p>Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="category-courses-page">
      <div className="container">
        <div className="category-header-simple">
          <button className="back-btn-simple" onClick={() => navigate('/categories')}>
            ← Back
          </button>
          <h1>{category?.name || 'Courses'}</h1>
          <p>{courses.length} courses available</p>
        </div>

        {courses.length > 0 ? (
          <div className="course-grid">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} onClick={handleCourseClick} />
            ))}
          </div>
        ) : (
          <div className="empty-state card">
            <p>📚 No courses in this category yet</p>
            <button className="btn-primary" onClick={() => navigate('/categories')}>
              Browse Other Categories
            </button>
          </div>
        )}

        <div style={{ height: '100px' }}></div>
      </div>
    </div>
  );
};

export default CategoryCourses;
