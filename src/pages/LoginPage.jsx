import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ROLES = [
  {
    role: 'citizen',
    title: 'Citizen',
    subtitle: 'Public Safety Portal',
    icon: 'shield_person',
    description: 'Access AI Fraud Shield, Scam Call Analyzer, Currency Detector, and file complaints.',
    accent: '#4edea3',
  },
  {
    role: 'officer',
    title: 'Law Enforcement',
    subtitle: 'Officer Portal',
    icon: 'local_police',
    description: 'Command Center, Case Management, Evidence, Crime Heatmap, and Fraud Network analysis.',
    accent: '#2563eb',
  },
  {
    role: 'admin',
    title: 'Super Admin',
    subtitle: 'Administrative Control',
    icon: 'security',
    description: 'Full system access — AI Models, Infrastructure, Security, API Management, and Audit Logs.',
    accent: '#c3c0ff',
  },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, portalPath } = useAuth();
  const iframeRef = useRef(null);

  const [selectedRole, setSelectedRole] = useState(null);
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup'

  // If already authenticated, redirect to portal
  if (isAuthenticated) {
    navigate(portalPath, { replace: true });
    return null;
  }

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setAuthMode('signin');
  };

  const handleBack = () => {
    setSelectedRole(null);
  };

  // Listen for postMessage from Stitch iframes
  useEffect(() => {
    const handleMessage = (event) => {
      const data = event.data;
      if (!data || !data.type) return;

      if (data.type === 'SAFENET_SIGNIN' && selectedRole) {
        // Sign in: use role defaults for name
        const redirectPath = login(selectedRole.role, null);
        // Send success back to iframe
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'SAFENET_AUTH_SUCCESS' }, '*');
        }
        setTimeout(() => navigate(redirectPath), 800);
      }

      if (data.type === 'SAFENET_SIGNUP' && selectedRole) {
        // Sign up: use the provided full name
        const redirectPath = login(selectedRole.role, data.fullName || null);
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'SAFENET_AUTH_SUCCESS' }, '*');
        }
        setTimeout(() => navigate(redirectPath), 800);
      }

      if (data.type === 'SAFENET_SWITCH_SIGNUP') {
        setAuthMode('signup');
      }

      if (data.type === 'SAFENET_SWITCH_SIGNIN') {
        setAuthMode('signin');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [selectedRole, login, navigate]);

  const iframeSrc = authMode === 'signin'
    ? '/screens/safenet_signin.html'
    : '/screens/safenet_signup.html';

  return (
    <div className="login-page">
      {/* Ambient glows */}
      <div className="ambient-glow-1"></div>
      <div className="ambient-glow-2"></div>

      <div className="login-container">
        {/* Header — only on role selection step */}
        {!selectedRole && (
          <div className="login-header">
            <div className="logo-container">
              <span className="material-symbols-outlined notranslate" translate="no">security</span>
            </div>
            <h1 className="login-title">SafeNet AI</h1>
            <p className="login-subtitle">Digital Public Safety Intelligence Platform</p>
            <p className="login-instruction">Select your access level to continue</p>
          </div>
        )}

        {/* ── Step 1: Role Selection ── */}
        {!selectedRole && (
          <div className="login-cards">
            {ROLES.map((r) => (
              <button
                key={r.role}
                className="role-card glass-card"
                onClick={() => handleRoleSelect(r)}
                style={{ '--card-accent': r.accent }}
              >
                <div className="role-card-icon" style={{ background: r.accent + '20', color: r.accent }}>
                  <span className="material-symbols-outlined notranslate" translate="no">{r.icon}</span>
                </div>
                <div className="role-card-body">
                  <h3 className="role-card-title">{r.title}</h3>
                  <span className="role-card-subtitle">{r.subtitle}</span>
                  <p className="role-card-desc">{r.description}</p>
                </div>
                <div className="role-card-arrow">
                  <span className="material-symbols-outlined notranslate" translate="no">arrow_forward</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ── Step 2: Stitch Auth Screen (iframe) ── */}
        {selectedRole && (
          <div className="auth-iframe-wrapper fade-in">
            {/* Role indicator pill */}
            <div className="auth-role-pill" style={{ '--pill-accent': selectedRole.accent }}>
              <div className="auth-role-pill-icon" style={{ background: selectedRole.accent + '25', color: selectedRole.accent }}>
                <span className="material-symbols-outlined notranslate" translate="no">{selectedRole.icon}</span>
              </div>
              <span className="auth-role-pill-label">{selectedRole.title} — {selectedRole.subtitle}</span>
            </div>
            <iframe
              ref={iframeRef}
              className="auth-stitch-iframe"
              src={iframeSrc}
              title={authMode === 'signin' ? 'SafeNet Sign In' : 'SafeNet Sign Up'}
              key={authMode} // force re-mount when switching modes
            />
          </div>
        )}

        {/* Footer */}
        <div className="login-footer">
          {selectedRole ? (
            <button className="login-back-link" onClick={handleBack}>
              <span className="material-symbols-outlined notranslate" translate="no" style={{ fontSize: 16 }}>arrow_back</span>
              Back to Role Selection
            </button>
          ) : (
            <button className="login-back-link" onClick={() => navigate('/')}>
              <span className="material-symbols-outlined notranslate" translate="no" style={{ fontSize: 16 }}>arrow_back</span>
              Back to Landing Page
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
