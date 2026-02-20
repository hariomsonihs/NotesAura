import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import './Categories.css';

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load categories from Firebase
      console.log('Loading categories from Firebase...');
      const categoriesRef = collection(db, 'categories');
      const categoriesSnap = await getDocs(categoriesRef);
      
      if (categoriesSnap.empty) {
        console.warn('No categories found in Firebase');
        setError('No categories available. Please add categories from admin panel.');
        setLoading(false);
        return;
      }

      const categoriesData = categoriesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => (a.order || 0) - (b.order || 0));

      console.log(`Loaded ${categoriesData.length} categories:`, categoriesData);
      setCategories(categoriesData);

      // Load all courses to count
      const coursesRef = collection(db, 'courses');
      const coursesSnap = await getDocs(coursesRef);
      const coursesData = coursesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log(`Loaded ${coursesData.length} courses`);
      setCourses(coursesData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load categories. Please check your connection.');
      setLoading(false);
    }
  };

  const getCategoryCount = (categoryId) => {
    return courses.filter(c => c.category === categoryId).length;
  };

  const getCategoryIcon = (categoryId) => {
    const icons = {
      'programming': '💻',
      'web_development': '🌐',
      'app_development': '📱',
      'data_science': '📊',
      'machine_learning': '🤖',
      'database': '🗄️',
      'devops': '⚙️',
      'cybersecurity': '🔒',
      'cheat_sheets': '📝'
    };
    return icons[categoryId] || '📚';
  };

  const getCategoryColor = (index) => {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="categories-page">
        <div className="container">
          <div className="loading">
            <div className="loading-spinner">📚</div>
            <p>Loading categories...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="categories-page">
        <div className="container">
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h2>{error}</h2>
            <button className="btn-primary" onClick={loadData}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-page">
      <div className="container">
        <div className="page-header">
          <h1>📚 All Categories</h1>
          <p>Choose your learning path</p>
          <p className="course-count">Total: {courses.length} courses in {categories.length} categories</p>
        </div>

        <div className="categories-grid">
          {categories.map((category, index) => {
            const count = getCategoryCount(category.id);
            return (
              <div
                key={category.id}
                className="category-card card"
                onClick={() => count > 0 && navigate(`/categories/${category.id}`)}
                style={{ 
                  opacity: count === 0 ? 0.6 : 1, 
                  cursor: count === 0 ? 'not-allowed' : 'pointer' 
                }}
              >
                {category.imageUrl ? (
                  <div className="category-image" style={{ backgroundImage: `url(${category.imageUrl})` }}>
                    <div className="category-overlay">
                      <span className="category-emoji">{getCategoryIcon(category.id)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="category-icon" style={{ background: getCategoryColor(index) }}>
                    <span>{getCategoryIcon(category.id)}</span>
                  </div>
                )}
                <h3>{category.name}</h3>
                <p>{count > 0 ? `${count} courses →` : 'Coming soon'}</p>
              </div>
            );
          })}
        </div>

        <div style={{ height: '100px' }}></div>
      </div>
    </div>
  );
};

export default Categories;
