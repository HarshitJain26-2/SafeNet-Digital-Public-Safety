import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const syncTranslation = (doc, langCode, retries = 30) => {
  if (!doc) return;
  try {
    const selectEl = doc.querySelector('.goog-te-combo');
    if (selectEl) {
      if (selectEl.value !== langCode) {
        selectEl.value = langCode;
        selectEl.dispatchEvent(new Event('change'));
      }
    } else if (retries > 0) {
      setTimeout(() => {
        syncTranslation(doc, langCode, retries - 1);
      }, 150);
    }
  } catch (err) {
    console.warn("Translation synchronization error: ", err);
  }
};

function ProfileScreen() {
  const { user, roleLabel, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [unit, setUnit] = useState(user?.unit || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setUnit(user.unit);
    }
  }, [user]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Profile name cannot be empty.');
      return;
    }
    if (name.trim().length < 3) {
      setError('Profile name must be at least 3 characters long.');
      return;
    }
    if (!unit.trim()) {
      setError('Assigned station / unit cannot be empty.');
      return;
    }
    setError('');
    setSaving(true);

    // Simulate high-speed database profile synchronization (800ms)
    setTimeout(() => {
      updateUser({ name: name.trim(), unit: unit.trim() });
      setSaving(false);
      setSuccess(true);
      setIsEditing(false);
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 800);
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setUnit(user?.unit || '');
    setError('');
    setIsEditing(false);
  };

  return (
    <div className="mock-page-container fade-in">
      <div className="mock-glass-card">
        {success && (
          <div className="profile-alert success fade-in">
            <span className="material-symbols-outlined alert-icon">check_circle</span>
            <div className="alert-content">
              <h4>Update Synchronized</h4>
              <p>Your platform identity credentials have been updated successfully.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="profile-alert error fade-in">
            <span className="material-symbols-outlined alert-icon">error</span>
            <div className="alert-content">
              <h4>Synchronization Failed</h4>
              <p>{error}</p>
            </div>
          </div>
        )}

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

        {isEditing ? (
          <form onSubmit={handleSave} className="profile-form">
            <div className="form-grid">
              <div className="form-item">
                <label className="form-label">Full Name / Identity</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  disabled={saving}
                />
              </div>

              <div className="form-item">
                <label className="form-label">Assigned Station / Unit</label>
                <input
                  type="text"
                  className="form-input"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="Enter station or unit name"
                  disabled={saving}
                />
              </div>

              <div className="form-item disabled-item">
                <label className="form-label">Security Protocol Clearance</label>
                <input
                  type="text"
                  className="form-input disabled"
                  value={roleLabel}
                  disabled
                />
                <span className="input-hint">Role clearance details are read-only</span>
              </div>

              <div className="form-item disabled-item">
                <label className="form-label">Encryption Protocol</label>
                <input
                  type="text"
                  className="form-input disabled"
                  value="AES-GCM-256 (Quantum Resistant)"
                  disabled
                />
                <span className="input-hint">Automatically enforced system-wide</span>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner"></span>
                    Syncing...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">sync</span>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div>
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

            <div className="form-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={() => setIsEditing(true)}
              >
                <span className="material-symbols-outlined">edit</span>
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ScreenPage({ screens }) {
  const { '*': splat } = useParams();
  const { user, roleLabel, language } = useAuth();
  const screen = screens.find((s) => s.path === splat);

  // Sync translation across parent/child document
  useEffect(() => {
    syncTranslation(document, language);

    const iframe = document.querySelector('.screen-page-iframe');
    if (iframe) {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        syncTranslation(iframeDoc, language);
      } catch (err) {
        console.warn("Could not sync iframe language directly on effect: ", err);
      }
    }
  }, [language, splat]);

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
      const iframeWindow = e.target.contentWindow;
      const iframeDoc = e.target.contentDocument || iframeWindow.document;
      if (iframeDoc) {
        // 1. Inject styles directly into the iframe's head
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

          /* Hide Google Translate UI elements inside iframe */
          .goog-te-banner-frame, .goog-te-balloon-frame {
            display: none !important;
          }
          body {
            top: 0 !important;
          }
          font {
            background-color: transparent !important;
            box-shadow: none !important;
          }
        `;
        iframeDoc.head.appendChild(style);

        // 2. Inject Google Translate elements and scripts inside the iframe
        if (!iframeDoc.getElementById('google_translate_element')) {
          const div = iframeDoc.createElement('div');
          div.id = 'google_translate_element';
          div.style.display = 'none';
          iframeDoc.body.appendChild(div);

          // Add initialization script
          const scriptInit = iframeDoc.createElement('script');
          scriptInit.innerHTML = `
            window.googleTranslateElementInit = function() {
              new window.google.translate.TranslateElement({
                pageLanguage: 'en',
                autoDisplay: false
              }, 'google_translate_element');
            }
          `;
          iframeDoc.head.appendChild(scriptInit);

          // Add source script
          const scriptSrc = iframeDoc.createElement('script');
          scriptSrc.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
          iframeDoc.head.appendChild(scriptSrc);
        }

        // 3. Immediately apply active language to iframe
        syncTranslation(iframeDoc, language);
      }
    } catch (err) {
      console.warn("Could not modify iframe layout or inject translation: ", err);
    }
  };

  // Render mock pages with premium styling
  if (screen.isMock) {
    if (screen.mockType === 'profile') {
      return <ProfileScreen />;
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
