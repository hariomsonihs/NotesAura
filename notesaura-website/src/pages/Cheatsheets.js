import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cheatsheetFiles } from '../utils/htmlLibraryData';
import './HtmlLibrary.css';

const Cheatsheets = () => {
  const navigate = useNavigate();

  return (
    <div className="html-library-page">
      <div className="container">
        <div className="page-header">
          <h1>Cheatsheets</h1>
          <p>Open NotesAura Web cheatsheet HTML files directly in your React website.</p>
        </div>

        <div className="library-grid">
          {cheatsheetFiles.map((item) => (
            <article className="library-card card" key={item.fileName}>
              <div className="library-card-body">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="library-filename">{item.fileName}</span>
              </div>
              <div className="library-actions">
                <button
                  className="btn-primary"
                  onClick={() => navigate(`/library/cheatsheets/${item.fileName}`)}
                >
                  View in App
                </button>
                <a
                  className="library-link-btn"
                  href={`/content/cheatsheets/${item.fileName}`}
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

export default Cheatsheets;
