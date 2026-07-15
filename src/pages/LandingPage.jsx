import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { landingScreen } from '../screens';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, portalPath } = useAuth();

  return (
    <div className="landing-page">
      {/* Ambient glows */}
      <div className="ambient-glow-1"></div>
      <div className="ambient-glow-2"></div>

      {/* Top nav overlay */}
      <nav className="landing-nav glass-panel">
        <div className="landing-nav-left">
          <div className="logo-container" style={{ width: 36, height: 36 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>security</span>
          </div>
          <span className="brand-title" style={{ fontSize: 17 }}>SafeNet AI</span>
        </div>
        <div className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#technology">Technology</a>
          <a href="#about">About</a>
        </div>
        <div className="landing-nav-right">
          {isAuthenticated ? (
            <button className="landing-btn-primary" onClick={() => navigate(portalPath)}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>dashboard</span>
              Go to Portal
            </button>
          ) : (
            <>
              <button className="landing-btn-secondary" onClick={() => navigate('/login')}>
                Sign In
              </button>
              <button className="landing-btn-primary" onClick={() => navigate('/login')}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>login</span>
                Access Portal
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Full-page Stitch landing screen */}
      <iframe
        className="landing-iframe"
        src={`/screens/${landingScreen.filename}`}
        title={landingScreen.title}
      />
    </div>
  );
}
