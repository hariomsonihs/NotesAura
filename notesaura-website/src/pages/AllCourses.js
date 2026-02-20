import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import CourseCard from '../components/CourseCard';
import './AllCourses.css';

const AllCourses = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredCourses(allCourses);
      return;
    }
    setFilteredCourses(allCourses.filter(c => c.category === selectedCategory));
  }, [selectedCategory, allCourses]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load categories
      const categoriesSnap = await getDocs(collection(db, 'categories'));
      const categoriesData = categoriesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => (a.order || 0) - (b.order || 0));
      setCategories(categoriesData);

      // Load courses
      const coursesSnap = await getDocs(collection(db, 'courses'));
      const coursesData = coursesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAllCourses(coursesData);
      setFilteredCourses(coursesData);

      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

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
    <div className="all-courses-page">
      <div className="container">
        <div className="page-header">
          <h1>📚 All Courses</h1>
          <p>{filteredCourses.length} courses available</p>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          <button
            className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="courses-grid">
            {filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} onClick={handleCourseClick} />
            ))}
          </div>
        ) : (
          <div className="empty-state card">
            <div className="empty-icon">📭</div>
            <h3>No courses found</h3>
            <p>Try selecting a different category</p>
          </div>
        )}

        <div style={{ height: '100px' }}></div>
      </div>
    </div>
  );
};

export default AllCourses;
