import React from 'react';
import { useNavigate } from 'react-router-dom';
import { projectFiles } from '../utils/htmlLibraryData';
import './HtmlLibrary.css';

const Projects = () => {
  const navigate = useNavigate();

  return (
    <div className="html-library-page">
      <div className="container">
        <div className="page-header">
          <h1>Projects</h1>
          <p>Open NotesAura Web project HTML files directly in your React website.</p>
        </div>

        <div className="library-grid">
          {projectFiles.map((item) => (
            <article className="library-card card" key={item.fileName}>
              <div className="library-card-body">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="library-filename">{item.fileName}</span>
              </div>
              <div className="library-actions">
                <button
                  className="btn-primary"
                  onClick={() => navigate(`/library/projects/${item.fileName}`)}
                >
                  View in App
                </button>
                <a
                  className="library-link-btn"
                  href={`/content/projects/${item.fileName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open HTML
                </a>
              </div>
            </article>
          ))}
        </div>

        <div style={{ height: '90px' }}></div>
      </div>
    </div>
  );
};

export default Projects;
