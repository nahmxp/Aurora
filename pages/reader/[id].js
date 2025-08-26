import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import withAuth from '../../lib/withAuth';

function BookReader() {
  const router = useRouter();
  const { id } = router.query;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (id && user) {
      checkAccessAndLoadBook();
    }
  }, [id, user]);

  const checkAccessAndLoadBook = async () => {
    try {
      setLoading(true);
      
      // Check if user has access to this book
      const accessResponse = await fetch(`/api/books/${id}/access`);
      
      if (!accessResponse.ok) {
        if (accessResponse.status === 403) {
          setError('You need to purchase this book to read it.');
        } else if (accessResponse.status === 404) {
          setError('Book not found.');
        } else {
          setError('Failed to verify access to this book.');
        }
        setLoading(false);
        return;
      }

      const accessData = await accessResponse.json();
      setHasAccess(accessData.hasAccess);
      setBook(accessData.book);
      
    } catch (error) {
      console.error('Error checking book access:', error);
      setError('Failed to load book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="reader-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading book...</p>
        </div>
      </div>
    );
  }

  if (error || !hasAccess) {
    return (
      <div className="reader-container">
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h2>Access Denied</h2>
          <p>{error || 'You do not have access to this book.'}</p>
          <div className="error-actions">
            <button onClick={() => router.push('/my-library')} className="btn-secondary">
              Back to Library
            </button>
            <button onClick={() => router.push(`/product/${id}`)} className="btn-primary">
              View Book Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!book || !book.digitalContent?.hasContent) {
    return (
      <div className="reader-container">
        <div className="error-container">
          <div className="error-icon">📚</div>
          <h2>No Digital Content</h2>
          <p>This book doesn't have digital content available for reading.</p>
          <div className="error-actions">
            <button onClick={() => router.push('/my-library')} className="btn-primary">
              Back to Library
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reader-container">
      {/* Reader Header */}
      <div className="reader-header">
        <div className="book-info">
          <h1>{book.title}</h1>
          <p>by {book.author}</p>
        </div>
        
        <div className="reader-controls">
          <button 
            onClick={() => router.push('/my-library')} 
            className="btn-secondary"
          >
            📚 Back to Library
          </button>
          
          <button 
            onClick={() => window.print()} 
            className="btn-outline"
          >
            🖨️ Print
          </button>
        </div>
      </div>

      {/* Content Viewer */}
      <div className="reader-content">
        {book.digitalContent.contentType === 'pdf' && (
          <div className="pdf-viewer">
            <iframe
              src={book.digitalContent.contentUrl}
              width="100%"
              height="100%"
              title={`${book.title} - PDF Viewer`}
              frameBorder="0"
            />
          </div>
        )}

        {['doc', 'docx'].includes(book.digitalContent.contentType) && (
          <div className="document-viewer">
            <div className="document-notice">
              <h3>📄 Document File</h3>
              <p>Click the link below to download and view the document:</p>
              <a 
                href={book.digitalContent.contentUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="download-link"
              >
                📥 Download {book.digitalContent.fileName || `${book.title}.${book.digitalContent.contentType}`}
              </a>
            </div>
          </div>
        )}

        {book.digitalContent.contentType === 'epub' && (
          <div className="epub-viewer">
            <div className="epub-notice">
              <h3>📖 EPUB Book</h3>
              <p>Click the link below to download the EPUB file:</p>
              <a 
                href={book.digitalContent.contentUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="download-link"
              >
                📥 Download EPUB
              </a>
              <p className="epub-help">
                <small>You'll need an EPUB reader app to view this book on your device.</small>
              </p>
            </div>
          </div>
        )}

        {book.digitalContent.contentType === 'txt' && (
          <div className="text-viewer">
            <iframe
              src={book.digitalContent.contentUrl}
              width="100%"
              height="100%"
              title={`${book.title} - Text Viewer`}
              frameBorder="0"
            />
          </div>
        )}

        {(book.digitalContent.contentType === 'link' || book.digitalContent.contentType === 'external') && (
          <div className="external-link-viewer">
            <div className="link-notice">
              <h3>🔗 External Resource</h3>
              <p>{book.digitalContent.linkDescription || 'This book links to an external resource.'}</p>
              <a 
                href={book.digitalContent.externalLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="external-link"
              >
                🌐 Open External Resource
              </a>
            </div>
          </div>
        )}

        {book.digitalContent.contentType === 'doi' && (
          <div className="doi-viewer">
            <div className="doi-notice">
              <h3>🎓 Academic Paper</h3>
              <p>This is an academic paper with DOI: <strong>{book.digitalContent.doiNumber}</strong></p>
              <a 
                href={`https://doi.org/${book.digitalContent.doiNumber}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="doi-link"
              >
                📖 View on Publisher's Site
              </a>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .reader-container {
          min-height: 100vh;
          background: var(--bg-color);
          display: flex;
          flex-direction: column;
        }

        .reader-header {
          background: var(--card-bg);
          padding: 1rem 2rem;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 4px var(--shadow-color);
        }

        .book-info h1 {
          margin: 0;
          font-size: 1.5rem;
          color: var(--text-color);
        }

        .book-info p {
          margin: 0.25rem 0 0 0;
          color: var(--text-color);
          opacity: 0.7;
        }

        .reader-controls {
          display: flex;
          gap: 1rem;
        }

        .reader-content {
          flex: 1;
          padding: 0;
          background: white;
        }

        .pdf-viewer, .text-viewer {
          height: calc(100vh - 100px);
          width: 100%;
        }

        .pdf-viewer iframe, .text-viewer iframe {
          border: none;
        }

        .document-viewer, .epub-viewer, .external-link-viewer, .doi-viewer {
          display: flex;
          align-items: center;
          justify-content: center;
          height: calc(100vh - 100px);
          background: var(--bg-color);
        }

        .document-notice, .epub-notice, .link-notice, .doi-notice {
          background: var(--card-bg);
          padding: 3rem;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 4px 20px var(--shadow-color);
          max-width: 500px;
        }

        .document-notice h3, .epub-notice h3, .link-notice h3, .doi-notice h3 {
          color: var(--text-color);
          margin-bottom: 1rem;
        }

        .document-notice p, .epub-notice p, .link-notice p, .doi-notice p {
          color: var(--text-color);
          margin-bottom: 1.5rem;
        }

        .download-link, .external-link, .doi-link {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          background: var(--primary-color);
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 500;
          transition: background 0.3s ease;
        }

        .download-link:hover, .external-link:hover, .doi-link:hover {
          background: var(--primary-dark);
        }

        .epub-help {
          margin-top: 1rem;
          color: var(--text-color);
          opacity: 0.6;
        }

        .loading-container, .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          text-align: center;
          padding: 2rem;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid var(--border-color);
          border-top: 4px solid var(--primary-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .error-container h2 {
          color: var(--text-color);
          margin-bottom: 1rem;
        }

        .error-container p {
          color: var(--text-color);
          opacity: 0.7;
          margin-bottom: 2rem;
        }

        .error-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-primary, .btn-secondary, .btn-outline {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: var(--primary-color);
          color: white;
        }

        .btn-primary:hover {
          background: var(--primary-dark);
        }

        .btn-secondary {
          background: var(--secondary-color);
          color: white;
        }

        .btn-secondary:hover {
          background: #1976D2;
        }

        .btn-outline {
          background: transparent;
          color: var(--text-color);
          border: 1px solid var(--border-color);
        }

        .btn-outline:hover {
          background: var(--border-color);
        }

        @media (max-width: 768px) {
          .reader-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .reader-controls {
            align-self: stretch;
          }

          .reader-controls button {
            flex: 1;
          }

          .document-notice, .epub-notice, .link-notice, .doi-notice {
            margin: 1rem;
            padding: 2rem;
          }

          .error-actions {
            flex-direction: column;
          }

          .error-actions button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default withAuth(BookReader);
