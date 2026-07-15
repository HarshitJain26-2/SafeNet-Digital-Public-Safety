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

  // If already authenticated, redirect to portal
  if (isAuthenticated) {
    navigate(portalPath, { replace: true });
    return null;
  }

  const handleLogin = (role) => {
    const redirectPath = login(role);
    navigate(redirectPath);
  };

  return (
    <div className="login-page">
      {/* Ambient glows */}
      <div className="ambient-glow-1"></div>
      <div className="ambient-glow-2"></div>

      <div className="login-container">
        {/* Header */}
        <div className="login-header">
          <div className="logo-container">
            <span className="material-symbols-outlined">security</span>
          </div>
          <h1 className="login-title">SafeNet AI</h1>
          <p className="login-subtitle">Digital Public Safety Intelligence Platform</p>
          <p className="login-instruction">Select your access level to continue</p>
        </div>

        {/* Role Cards */}
        <div className="login-cards">
          {ROLES.map((r) => (
            <button
              key={r.role}
              className="role-card glass-card"
              onClick={() => handleLogin(r.role)}
              style={{ '--card-accent': r.accent }}
            >
              <div className="role-card-icon" style={{ background: r.accent + '20', color: r.accent }}>
                <span className="material-symbols-outlined">{r.icon}</span>
              </div>
              <div className="role-card-body">
                <h3 className="role-card-title">{r.title}</h3>
                <span className="role-card-subtitle">{r.subtitle}</span>
                <p className="role-card-desc">{r.description}</p>
              </div>
              <div className="role-card-arrow">
                <span className="material-symbols-outlined">arrow_forward</span>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="login-footer">
          <button className="login-back-link" onClick={() => navigate('/')}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
            Back to Landing Page
          </button>
        </div>
      </div>
    </div>
  );
}
