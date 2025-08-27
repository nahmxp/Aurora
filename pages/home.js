import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../lib/AuthContext';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const sections = [
    {
      id: 'kids',
      title: 'Kids Section',
      subtitle: 'Stories That Spark Imagination',
      description: 'Interactive books and e-books with AI-powered voice narration. Perfect for young minds to explore and learn.',
      icon: '📚',
      gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
      features: ['AI Voice Narration', 'Interactive Stories', 'Age-Appropriate Content', 'Visual Learning'],
      link: '/catalog?audience=kids'
    },
    {
      id: 'adults',
      title: 'Adults Section',
      subtitle: 'Expand Your Horizons',
      description: 'Diverse collection of books for personal growth, entertainment, and lifelong learning.',
      icon: '📖',
      gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
      features: ['Fiction & Non-Fiction', 'Self-Development', 'Digital & Physical', 'Personal Library'],
      link: '/catalog?audience=adults'
    },
    {
      id: 'education',
      title: 'Higher Education',
      subtitle: 'Research & Academic Excellence',
      description: 'Comprehensive academic resources, journals, and research tools for students and researchers.',
      icon: '🎓',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      features: ['Academic Journals', 'Research Papers', 'Citation Tools', 'Advanced Search'],
      link: '/catalog?audience=higher-education'
    }
  ];

  return (
    <div className="aurora-home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="aurora-animation"></div>
          <div className="floating-books">
            <div className="book book-1">📚</div>
            <div className="book book-2">📖</div>
            <div className="book book-3">📝</div>
            <div className="book book-4">🎓</div>
          </div>
        </div>
        
        <div className="hero-content">
          <div className="hero-text">
            <div className="logo-section">
              <div className="aurora-logo">
                <span className="aurora-icon">🌅</span>
                <h1>Aurora</h1>
              </div>
              <p className="tagline">Dawn of Knowledge</p>
            </div>
            
            <h2 className="hero-title">Welcome to Smart Read</h2>
            <p className="hero-description">
              Discover a world of knowledge across three specialized sections. 
              From children's interactive stories to academic research, 
              Aurora illuminates your path to learning.
            </p>
            
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Books</span>
              </div>
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Journals</span>
              </div>
              <div className="stat">
                <span className="stat-number">AI</span>
                <span className="stat-label">Narration</span>
              </div>
            </div>
            
            {!user && (
              <div className="hero-actions">
                <Link href="/signup">
                  <button className="btn-primary">Start Reading</button>
                </Link>
                <Link href="/login">
                  <button className="btn-outline">Sign In</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Three Main Sections */}
      <section className="main-sections">
        <div className="container">
          <div className="sections-header">
            <h2>Choose Your Reading Journey</h2>
            <p>Each section is specially curated for different learning needs and interests</p>
          </div>
          
          <div className="sections-grid">
            {sections.map((section) => (
              <div key={section.id} className="section-card">
                <div 
                  className="section-header"
                  style={{ background: section.gradient }}
                >
                  <div className="section-icon">{section.icon}</div>
                  <h3>{section.title}</h3>
                  <p className="section-subtitle">{section.subtitle}</p>
                </div>
                
                <div className="section-content">
                  <p className="section-description">{section.description}</p>
                  
                  <ul className="section-features">
                    {section.features.map((feature, index) => (
                      <li key={index}>
                        <span className="feature-check">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Link href={section.link}>
                    <button className="section-button">
                      Explore {section.title}
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Why Choose Aurora?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎧</div>
              <h3>AI Voice Narration</h3>
              <p>Listen to books with natural AI voices in multiple languages</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Read Anywhere</h3>
              <p>Access your library on any device, anytime</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Smart Search</h3>
              <p>Find exactly what you need with our advanced search engine</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Personalized</h3>
              <p>Content tailored to your age, interests, and reading level</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Begin Your Journey?</h2>
            <p>Join thousands of readers who have discovered the joy of learning with Aurora</p>
            {!user ? (
              <Link href="/signup">
                <button className="btn-primary large">Get Started Today</button>
              </Link>
            ) : (
              <Link href="/catalog">
                <button className="btn-primary large">Browse Library</button>
              </Link>
            )}
          </div>
        </div>
      </section>

      <style jsx>{`
        .aurora-home {
          min-height: 100vh;
        }

        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
        }

        .aurora-animation {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, 
            rgba(255, 107, 107, 0.3) 0%,
            rgba(255, 230, 109, 0.3) 25%,
            rgba(78, 205, 196, 0.3) 50%,
            rgba(102, 126, 234, 0.3) 75%,
            rgba(118, 75, 162, 0.3) 100%);
          animation: aurora 20s ease-in-out infinite;
        }

        @keyframes aurora {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(90deg) scale(1.1); }
          50% { transform: rotate(180deg) scale(1); }
          75% { transform: rotate(270deg) scale(1.1); }
        }

        .floating-books {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .book {
          position: absolute;
          font-size: 2rem;
          animation: float 6s ease-in-out infinite;
          opacity: 0.7;
        }

        .book-1 { top: 20%; left: 10%; animation-delay: 0s; }
        .book-2 { top: 60%; right: 15%; animation-delay: 2s; }
        .book-3 { bottom: 30%; left: 20%; animation-delay: 4s; }
        .book-4 { top: 40%; right: 25%; animation-delay: 1s; }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }

        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          color: white;
          max-width: 800px;
          padding: 2rem;
        }

        .logo-section {
          margin-bottom: 2rem;
        }

        .aurora-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }

        .aurora-icon {
          font-size: 3rem;
        }

        .aurora-logo h1 {
          font-size: 4rem;
          margin: 0;
          font-weight: 700;
          background: linear-gradient(45deg, #FFE66D, #FF6B6B);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .tagline {
          font-size: 1.2rem;
          margin: 0;
          opacity: 0.9;
          font-style: italic;
        }

        .hero-title {
          font-size: 2.5rem;
          margin: 2rem 0 1rem;
          font-weight: 600;
        }

        .hero-description {
          font-size: 1.2rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          opacity: 0.9;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin: 2rem 0;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 2rem;
          font-weight: bold;
          color: #FFE66D;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
        }

        .main-sections {
          padding: 4rem 0;
          background: var(--bg-color);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .sections-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .sections-header h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: var(--text-color);
        }

        .sections-header p {
          font-size: 1.1rem;
          color: var(--text-color);
          opacity: 0.7;
        }

        .sections-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .section-card {
          background: var(--card-bg);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px var(--shadow-color);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .section-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px var(--shadow-color);
        }

        .section-header {
          padding: 2rem;
          text-align: center;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .section-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: inherit;
          opacity: 0.9;
        }

        .section-header > * {
          position: relative;
          z-index: 1;
        }

        .section-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .section-header h3 {
          font-size: 1.8rem;
          margin: 0 0 0.5rem;
          font-weight: 600;
        }

        .section-subtitle {
          font-size: 1rem;
          margin: 0;
          opacity: 0.9;
        }

        .section-content {
          padding: 2rem;
        }

        .section-description {
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          color: var(--text-color);
        }

        .section-features {
          list-style: none;
          padding: 0;
          margin: 0 0 2rem;
        }

        .section-features li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          color: var(--text-color);
        }

        .feature-check {
          color: #4CAF50;
          font-weight: bold;
        }

        .section-button {
          width: 100%;
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .section-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .features-section {
          padding: 4rem 0;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }

        .features-section h2 {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 3rem;
          color: var(--text-color);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background: var(--card-bg);
          padding: 2rem;
          border-radius: 15px;
          text-align: center;
          box-shadow: 0 5px 20px var(--shadow-color);
          transition: transform 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
        }

        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .feature-card h3 {
          font-size: 1.3rem;
          margin-bottom: 1rem;
          color: var(--text-color);
        }

        .feature-card p {
          color: var(--text-color);
          opacity: 0.7;
          line-height: 1.5;
        }

        .cta-section {
          padding: 4rem 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .cta-content {
          text-align: center;
        }

        .cta-content h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .cta-content p {
          font-size: 1.1rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }

        .btn-primary {
          background: linear-gradient(45deg, #FF6B6B, #FFE66D);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
        }

        .btn-primary.large {
          padding: 1.2rem 3rem;
          font-size: 1.1rem;
        }

        .btn-outline {
          background: transparent;
          color: white;
          border: 2px solid white;
          padding: 1rem 2rem;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }

        .btn-outline:hover {
          background: white;
          color: #667eea;
        }

        @media (max-width: 768px) {
          .aurora-logo h1 {
            font-size: 2.5rem;
          }

          .hero-title {
            font-size: 2rem;
          }

          .hero-stats {
            gap: 2rem;
          }

          .hero-actions {
            flex-direction: column;
            align-items: center;
          }

          .sections-grid {
            grid-template-columns: 1fr;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
} 