import React from 'react';
import './CourseCard.css';

const CourseCard = ({ course, onClick }) => {
  const getGradient = (category) => {
    const gradients = {
      'Programming': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'Web Development': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'App Development': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'Data Science': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'default': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    };
    return gradients[category] || gradients.default;
  };

  return (
    <div className="course-card" onClick={() => onClick(course)}>
      <div 
        className="course-image" 
        style={{ 
          background: course.imageUrl 
            ? `url(${course.imageUrl}) center/cover` 
            : getGradient(course.category)
        }}
      >
        <div className="course-badge">{course.difficulty || 'Beginner'}</div>
      </div>
      <div className="course-content">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-description">
          {course.description?.substring(0, 80)}...
        </p>
        <div className="course-meta">
          <span>📚 {course.exercises?.length || 0} Lessons</span>
          <span>⭐ {course.rating || '4.5'}</span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
