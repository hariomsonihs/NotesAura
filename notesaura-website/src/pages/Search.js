import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import CourseCard from '../components/CourseCard';
import './Search.css';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCourses([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allCourses.filter(course => 
      course.title?.toLowerCase().includes(query) ||
      course.description?.toLowerCase().includes(query) ||
      course.category?.toLowerCase().includes(query)
    );
    setFilteredCourses(filtered);
  }, [searchQuery, allCourses]);

  const loadCourses = async () => {
    try {
      const coursesSnap = await getDocs(collection(db, 'courses'));
      const coursesData = coursesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAllCourses(coursesData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading courses:', error);
      setLoading(false);
    }
  };

  const handleCourseClick = (course) => {
    navigate(`/course/${course.id}`);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner">🔍</div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="search-page">
      <div className="container">
        <div className="search-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <h1>🔍 Search Courses</h1>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search for courses, topics, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          {searchQuery && (
            <button className="clear-btn" onClick={() => setSearchQuery('')}>
              ✕
            </button>
          )}
        </div>

        {!searchQuery ? (
          <div className="search-empty">
            <div className="empty-icon">🔎</div>
            <h3>Start searching</h3>
            <p>Type to find courses, topics, or categories</p>
          </div>
        ) : filteredCourses.length > 0 ? (
          <>
            <div className="search-results-header">
              <p>{filteredCourses.length} results found</p>
            </div>
            <div className="courses-grid">
              {filteredCourses.map(course => (
                <CourseCard key={course.id} course={course} onClick={handleCourseClick} />
              ))}
            </div>
          </>
        ) : (
          <div className="search-empty">
            <div className="empty-icon">😕</div>
            <h3>No results found</h3>
            <p>Try searching with different keywords</p>
          </div>
        )}

        <div style={{ height: '100px' }}></div>
      </div>
    </div>
  );
};

export default Search;
