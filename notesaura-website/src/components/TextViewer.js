import React, { useState, useEffect } from 'react';
import './TextViewer.css';

const TextViewer = ({ url }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Convert GitHub blob URLs to raw URLs
        let processedUrl = url;
        if (url.includes('github.com') && url.includes('/blob/')) {
          processedUrl = url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
        }

        const response = await fetch(processedUrl);
        if (!response.ok) throw new Error('Failed to load content');
        const text = await response.text();
        setContent(text);
      } catch (err) {
        console.error('Error loading text:', err);
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [url]);

  const formatContent = (text) => {
    let html = text;

    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');

    // Images
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    // Headings
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold and Italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Lists
    html = html.replace(/^\* (.+)$/gim, '<li>$1</li>');
    html = html.replace(/^- (.+)$/gim, '<li>$1</li>');
    html = html.replace(/^(\d+)\. (.+)$/gim, '<li>$2</li>');

    // Wrap lists
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Quotes
    html = html.replace(/^&gt; (.+)$/gim, '<blockquote>$1</blockquote>');
    html = html.replace(/^> (.+)$/gim, '<blockquote>$1</blockquote>');

    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';

    return html;
  };

  if (loading) {
    return (
      <div className="text-viewer-loading">
        <div className="spinner">📄</div>
        <p>Loading content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-viewer-error">
        <div className="error-icon">⚠️</div>
        <h3>{error}</h3>
        <p>Please check the URL and try again</p>
      </div>
    );
  }

  return (
    <div className="text-viewer">
      <div 
        className="text-content"
        dangerouslySetInnerHTML={{ __html: formatContent(content) }}
      />
    </div>
  );
};

export default TextViewer;
