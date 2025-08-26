import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../lib/AuthContext';
import withAuth from '../lib/withAuth';

function MyLibrary() {
  const [purchasedBooks, setPurchasedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAudience, setSelectedAudience] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchPurchasedBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/user/library');
        
        if (!response.ok) {
          throw new Error('Failed to fetch library');
        }
        
        const booksData = await response.json();
        setPurchasedBooks(booksData);
      } catch (error) {
        console.error('Failed to load library:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPurchasedBooks();
    }
  }, [user]);

  // Filter books based on audience and search term
  const filteredBooks = purchasedBooks.filter(book => {
    const matchesAudience = selectedAudience === 'all' || book.targetAudience === selectedAudience;
    const matchesSearch = !searchTerm || 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesAudience && matchesSearch;
  });

  const handleReadBook = (book) => {
    if (book.digitalContent && book.digitalContent.hasContent) {
      // Route to the book reader/viewer
      if (book.digitalContent.contentType === 'doi') {
        // Open DOI link in new tab
        window.open(`https://doi.org/${book.digitalContent.doiNumber}`, '_blank');
      } else if (book.digitalContent.contentType === 'external' || book.digitalContent.contentType === 'link') {
        // Open external link in new tab
        window.open(book.digitalContent.externalLink, '_blank');
      } else {
        // Route to internal PDF/document viewer
        window.open(`/reader/${book._id}`, '_blank');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your library...</p>
      </div>
    );
  }

  return (
    <div className="library-page">
      <div className="container">
        <div className="library-header">
          <h1>📚 My Library</h1>
          <p>Your collection of purchased books and resources</p>
        </div>

        {purchasedBooks.length === 0 ? (
          <div className="empty-library">
            <div className="empty-icon">📖</div>
            <h2>Your library is empty</h2>
            <p>Start building your digital library by purchasing books from our catalog.</p>
            <Link href="/catalog">
              <button className="btn-primary">Browse Books</button>
            </Link>
          </div>
        ) : (
          <>
            {/* Filters and Search */}
            <div className="library-controls">
              <div className="search-section">
                <input
                  type="text"
                  placeholder="Search your library..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <div className="filter-section">
                <label htmlFor="audience-filter">Filter by audience:</label>
                <select
                  id="audience-filter"
                  value={selectedAudience}
                  onChange={(e) => setSelectedAudience(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Books</option>
                  <option value="kids">Kids</option>
                  <option value="adults">Adults</option>
                  <option value="higher-education">Higher Education</option>
                </select>
              </div>
            </div>

            {/* Library Stats */}
            <div className="library-stats">
              <div className="stat-card">
                <div className="stat-number">{purchasedBooks.length}</div>
                <div className="stat-label">Total Books</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">
                  {purchasedBooks.filter(book => book.digitalContent?.hasContent).length}
                </div>
                <div className="stat-label">Digital Books</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">
                  {purchasedBooks.filter(book => book.targetAudience === 'kids').length}
                </div>
                <div className="stat-label">Kids Books</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">
                  {purchasedBooks.filter(book => book.targetAudience === 'adults').length}
                </div>
                <div className="stat-label">Adult Books</div>
              </div>
            </div>

            {/* Books Grid */}
            <div className="books-grid">
              {filteredBooks.map((book) => (
                <div key={book._id} className="book-card">
                  <div className="book-cover">
                    <img 
                      src={book.coverImage || 'https://via.placeholder.com/200x300?text=No+Cover'} 
                      alt={book.title}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200x300?text=No+Cover';
                      }}
                    />
                    <div className="book-overlay">
                      {book.digitalContent?.hasContent && (
                        <button 
                          className="read-button"
                          onClick={() => handleReadBook(book)}
                        >
                          📖 Read Now
                        </button>
                      )}
                      <Link href={`/product/${book._id}`}>
                        <button className="details-button">
                          ℹ️ Details
                        </button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="book-info">
                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-author">by {book.author}</p>
                    
                    <div className="book-meta">
                      <span className={`audience-badge ${book.targetAudience}`}>
                        {book.targetAudience === 'higher-education' ? 'Academic' : 
                         book.targetAudience.charAt(0).toUpperCase() + book.targetAudience.slice(1)}
                      </span>
                      
                      {book.digitalContent?.hasContent && (
                        <span className="digital-badge">
                          {book.digitalContent.contentType.toUpperCase()}
                        </span>
                      )}
                    </div>
                    
                    {book.category && (
                      <p className="book-category">{book.category}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredBooks.length === 0 && (
              <div className="no-results">
                <p>No books found matching your filters.</p>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        .library-page {
          min-height: 100vh;
          padding: 2rem 0;
          background: var(--bg-color);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .library-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .library-header h1 {
          font-size: 2.5rem;
          color: var(--text-color);
          margin-bottom: 0.5rem;
        }

        .library-header p {
          font-size: 1.1rem;
          color: var(--text-color);
          opacity: 0.7;
        }

        .empty-library {
          text-align: center;
          padding: 4rem 2rem;
          background: var(--card-bg);
          border-radius: 16px;
          box-shadow: 0 4px 20px var(--shadow-color);
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-library h2 {
          color: var(--text-color);
          margin-bottom: 1rem;
        }

        .empty-library p {
          color: var(--text-color);
          opacity: 0.7;
          margin-bottom: 2rem;
        }

        .library-controls {
          display: flex;
          gap: 2rem;
          margin-bottom: 2rem;
          padding: 1rem;
          background: var(--card-bg);
          border-radius: 8px;
          box-shadow: 0 2px 8px var(--shadow-color);
        }

        .search-section {
          flex: 1;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          background: var(--bg-color);
          color: var(--text-color);
          font-size: 1rem;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px rgba(var(--accent-rgb), 0.2);
        }

        .filter-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-section label {
          font-size: 0.9rem;
          color: var(--text-color);
          font-weight: 500;
        }

        .filter-select {
          padding: 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          background: var(--bg-color);
          color: var(--text-color);
          min-width: 180px;
        }

        .library-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: var(--card-bg);
          padding: 1.5rem;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 2px 8px var(--shadow-color);
        }

        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          color: var(--primary-color);
        }

        .stat-label {
          font-size: 0.9rem;
          color: var(--text-color);
          opacity: 0.7;
          margin-top: 0.25rem;
        }

        .books-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .book-card {
          background: var(--card-bg);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px var(--shadow-color);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .book-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px var(--shadow-color);
        }

        .book-cover {
          position: relative;
          height: 300px;
          overflow: hidden;
        }

        .book-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .book-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .book-card:hover .book-overlay {
          opacity: 1;
        }

        .read-button, .details-button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }

        .read-button {
          background: var(--primary-color);
          color: white;
        }

        .read-button:hover {
          background: var(--primary-dark);
        }

        .details-button {
          background: var(--secondary-color);
          color: white;
        }

        .details-button:hover {
          background: #1976D2;
        }

        .book-info {
          padding: 1rem;
        }

        .book-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-color);
          margin: 0 0 0.5rem 0;
          line-height: 1.3;
        }

        .book-author {
          font-size: 0.9rem;
          color: var(--text-color);
          opacity: 0.7;
          margin: 0 0 0.75rem 0;
        }

        .book-meta {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
        }

        .audience-badge, .digital-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
        }

        .audience-badge.kids {
          background: #FFE0B2;
          color: #E65100;
        }

        .audience-badge.adults {
          background: #E1F5FE;
          color: #0277BD;
        }

        .audience-badge.higher-education {
          background: #F3E5F5;
          color: #7B1FA2;
        }

        .digital-badge {
          background: #E8F5E8;
          color: #2E7D32;
        }

        .book-category {
          font-size: 0.8rem;
          color: var(--text-color);
          opacity: 0.6;
          margin: 0;
        }

        .no-results {
          text-align: center;
          padding: 3rem;
          color: var(--text-color);
          opacity: 0.7;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          gap: 1rem;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid var(--border-color);
          border-top: 4px solid var(--primary-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .library-controls {
            flex-direction: column;
            gap: 1rem;
          }

          .library-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .books-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1rem;
          }

          .library-header h1 {
            font-size: 2rem;
          }
        }

        @media (max-width: 480px) {
          .library-stats {
            grid-template-columns: 1fr;
          }

          .books-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default withAuth(MyLibrary);
