import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { librarySections } from '../utils/htmlLibraryData';
import './HtmlViewer.css';

const HtmlViewer = () => {
  const navigate = useNavigate();
  const { section, fileName } = useParams();

  const files = librarySections[section] || [];
  const selectedFile = files.find((item) => item.fileName === fileName);

  if (!selectedFile) {
    return (
      <div className="html-viewer-page">
        <div className="container">
          <div className="error-state">
            <h2>File not found</h2>
            <p>The requested HTML file is not available in this section.</p>
            <button className="btn-primary" onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filePath = `/content/${section}/${selectedFile.fileName}`;
  const sectionTitle = section === 'projects' ? 'Projects' : 'Cheatsheets';

  return (
    <div className="html-viewer-page">
      <div className="container">
        <div className="viewer-toolbar card">
          <div>
            <p className="viewer-section">{sectionTitle}</p>
            <h1 className="viewer-title">{selectedFile.title}</h1>
          </div>
          <div className="viewer-actions">
            <button className="btn-secondary" onClick={() => navigate(`/${section}`)}>
              Back to {sectionTitle}
            </button>
            <a
              className="viewer-open-btn"
              href={filePath}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in New Tab
            </a>
          </div>
        </div>

        <iframe
          className="viewer-frame"
          src={filePath}
          title={selectedFile.title}
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default HtmlViewer;
