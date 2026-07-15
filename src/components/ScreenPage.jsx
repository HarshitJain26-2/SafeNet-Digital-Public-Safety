import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ScreenPage({ screens }) {
  const { '*': splat } = useParams();
  const { user, roleLabel } = useAuth();
  const screen = screens.find((s) => s.path === splat);

  if (!screen) {
    return (
      <div className="screen-page-empty">
        <span className="material-symbols-outlined" style={{ fontSize: 48, opacity: 0.3 }}>error_outline</span>
        <h3>Module Not Found</h3>
        <p>The requested intelligence module could not be located.</p>
      </div>
    );
  }

  // Same-origin style injection to strip nested sidebars/headers and margin adjustments
  const handleIframeLoad = (e) => {
    try {
      const iframeDoc = e.target.contentDocument || e.target.contentWindow.document;
      if (iframeDoc) {
        // Inject styles directly into the iframe's head
        const style = iframeDoc.createElement('style');
        style.innerHTML = `
          /* Hide nested sidebar, headers, and footer */
          aside { display: none !important; }
          header { display: none !important; }
          footer { display: none !important; }
          
          /* Remove layout left margins/paddings from main container */
          main { 
            margin-left: 0 !important; 
            padding-left: 0 !important; 
            min-height: 100vh !important;
          }
          
          /* Override Tailwind ml-[280px] utility if applied explicitly */
          .ml-\\[280px\\] {
            margin-left: 0 !important;
          }
          
          /* Adjust layout padding to fit beautifully */
          .px-10 {
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
          .py-8 {
            padding-top: 16px !important;
            padding-bottom: 16px !important;
          }
        `;
        iframeDoc.head.appendChild(style);
      }
    } catch (err) {
      console.warn("Could not modify iframe layout: ", err);
    }
  };

  // Render mock pages with premium styling
  if (screen.isMock) {
    if (screen.mockType === 'profile') {
      return (
        <div className="mock-page-container fade-in">
          <div className="mock-glass-card">
            <div className="profile-header-large">
              <div className="avatar-huge">{user?.avatar || 'U'}</div>
              <div className="profile-titles">
                <h2>{user?.name || 'User Name'}</h2>
                <div className="badge-wrapper">
                  <span className="clearance-badge">{roleLabel}</span>
                  <span className="status-dot-active">Active Node</span>
                </div>
              </div>
            </div>
            
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Assigned Station / Unit</span>
                <span className="info-val">{user?.unit || 'General Division'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Security Protocol clearance</span>
                <span className="info-val">Level 5 (Directives Isolation)</span>
              </div>
              <div className="info-item">
                <span className="info-label">Active Node Connection</span>
                <span className="info-val">{window.location.hostname}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Encryption Protocol</span>
                <span className="info-val">AES-GCM-256 (Quantum Resistant)</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (screen.mockType === 'notifications') {
      const mockAlerts = [
        { id: 1, type: 'critical', time: '10 Mins Ago', title: '🚨 Phishing Advisory', text: 'UPI spoofing campaign flagged matching registrar patterns in NCR district. Automated blocklist updated.' },
        { id: 2, type: 'info', time: '1 Hour Ago', title: '📢 Model Synchronization', text: 'Spoofing voice classifier model v4.9 telemetry verified. System response times reduced by 14%.' },
        { id: 3, type: 'warning', time: '4 Hours Ago', title: '⚠️ Suspicious Node', text: 'Multiple failed API connections detected from registrar subnet. Security firewall active.' },
      ];

      return (
        <div className="mock-page-container fade-in">
          <div className="mock-glass-card">
            <h2>Platform Operational Feeds</h2>
            <p className="subtitle">Real-time threat feeds and platform logs</p>
            
            <div className="alert-list">
              {mockAlerts.map(alert => (
                <div key={alert.id} className={`alert-item type-${alert.type}`}>
                  <div className="alert-header">
                    <span className="alert-title">{alert.title}</span>
                    <span className="alert-time">{alert.time}</span>
                  </div>
                  <p className="alert-text">{alert.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (screen.mockType === 'settings') {
      return (
        <div className="mock-page-container fade-in">
          <div className="mock-glass-card">
            <h2>Settings & Gateway Controls</h2>
            <p className="subtitle">Configure portal preferences and security clearance options</p>
            
            <div className="settings-list">
              <div className="setting-row">
                <div className="setting-desc">
                  <h4>Push Incident Dispatches</h4>
                  <p>Send active notifications when citizen complaints are assigned.</p>
                </div>
                <input type="checkbox" defaultChecked className="toggle-switch" />
              </div>
              
              <div className="setting-row">
                <div className="setting-desc">
                  <h4>Automated Threat Intelligence Sharing</h4>
                  <p>Exchange anonymized IP/Domain threat databases with partner node relays.</p>
                </div>
                <input type="checkbox" defaultChecked className="toggle-switch" />
              </div>

              <div className="setting-row">
                <div className="setting-desc">
                  <h4>Quantum Resistance Isolation</h4>
                  <p>Enforce end-to-end token validation with multi-party encryption.</p>
                </div>
                <input type="checkbox" className="toggle-switch" />
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="screen-page">
      <iframe
        className="screen-page-iframe"
        src={`/screens/${screen.filename}`}
        title={screen.title}
        onLoad={handleIframeLoad}
      />
    </div>
  );
}
