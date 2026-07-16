import { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProfileMenu from './ProfileMenu';

const INDIAN_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
];

export default function PortalLayout({ portalName, portalSubtitle, portalIcon, screens, basePath }) {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, language, changeLanguage } = useAuth();
  const location = useLocation();

  // Language state
  const currentLang = INDIAN_LANGUAGES.find((lang) => lang.code === language) || INDIAN_LANGUAGES[0];
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const langMenuRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (lang) => {
    changeLanguage(lang.code);
    setLangDropdownOpen(false);
    setToastMessage(`Localization engine updated: Switched to ${lang.name} (${lang.native}).`);
    setToastVisible(true);

    const timer = setTimeout(() => {
      setToastVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  };

  // Derive sections from screen data
  const sections = [...new Set(screens.map((s) => s.section))];

  // Filter screens by search
  const filteredScreens = screens.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group filtered screens by section
  const groupedScreens = sections
    .map((section) => ({
      section,
      items: filteredScreens.filter((s) => s.section === section),
    }))
    .filter((g) => g.items.length > 0);

  // Find the currently active screen for breadcrumbs / footer
  const currentPath = location.pathname.replace(basePath + '/', '');
  const activeScreen = screens.find((s) => s.path === currentPath) || screens[0];

  return (
    <div className="app-container">
      {/* Ambient background decorations */}
      <div className="ambient-glow-1"></div>
      <div className="ambient-glow-2"></div>

      {/* Translation synchronization toast */}
      {toastVisible && (
        <div className="translation-toast fade-in shadow-lg">
          <span className="material-symbols-outlined spin-sync notranslate" translate="no">sync</span>
          <div className="toast-text-content">
            <span className="toast-title">Language Engine Synchronized</span>
            <span className="toast-desc">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Left Sidebar */}
      <aside className="sidebar glass-panel">
        <div className="sidebar-header">
          <div className="logo-container">
            <span className="material-symbols-outlined notranslate" translate="no">{portalIcon}</span>
          </div>
          <div>
            <h1 className="brand-title">SafeNet AI</h1>
            <p className="brand-subtitle">{portalSubtitle}</p>
          </div>
        </div>

        {/* Search */}
        <div className="sidebar-search">
          <div className="search-wrapper">
            <span className="material-symbols-outlined notranslate" translate="no">search</span>
            <input
              type="text"
              className="search-input"
              placeholder={`Search ${portalName.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Screen list grouped by section */}
        <div className="screen-list">
          {groupedScreens.length > 0 ? (
            groupedScreens.map((group) => (
              <div key={group.section}>
                <div className="nav-section-label">{group.section}</div>
                {group.items.map((screen) => (
                  <NavLink
                    key={screen.id}
                    to={`${basePath}/${screen.path}`}
                    className={({ isActive }) => `screen-item ${isActive ? 'active' : ''}`}
                  >
                    <div className="screen-icon-box">
                      <span className="material-symbols-outlined notranslate" translate="no">{screen.icon}</span>
                    </div>
                    <div className="screen-info">
                      <h4 className="screen-title">{screen.title}</h4>
                    </div>
                  </NavLink>
                ))}
              </div>
            ))
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
              No modules matched your query.
            </div>
          )}
        </div>
      </aside>

      {/* Main Display Area */}
      <main className="main-canvas">
        {/* Header Navigation */}
        <header className="header-nav glass-panel">
          <div className="header-left">
            <div className="breadcrumbs">
              <span>SafeNet AI</span>
              <span className="breadcrumbs-sep notranslate" translate="no">/</span>
              <span>{portalName}</span>
              <span className="breadcrumbs-sep notranslate" translate="no">/</span>
              <span>{activeScreen.title}</span>
            </div>
            <h2 className="current-title">{activeScreen.title}</h2>
          </div>

          <div className="header-right">
            {/* Language Selector Dropdown */}
            <div className="lang-selector-container notranslate" translate="no" ref={langMenuRef}>
              <button
                type="button"
                className="lang-trigger action-btn"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                title="Switch Language"
              >
                <span className="material-symbols-outlined notranslate" translate="no">language</span>
                <span className="lang-code-label">{currentLang.code.toUpperCase()}</span>
              </button>

              {langDropdownOpen && (
                <div className="lang-dropdown glass-card">
                  <div className="lang-dropdown-header">
                    <span className="lang-dropdown-title">System Language</span>
                    <span className="lang-dropdown-subtitle">12 Regional Options</span>
                  </div>
                  <div className="lang-dropdown-divider" />
                  <div className="lang-list">
                    {INDIAN_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        className={`lang-item ${currentLang.code === lang.code ? 'active' : ''}`}
                        onClick={() => handleLanguageChange(lang)}
                      >
                        <div className="lang-text-group">
                          <span className="lang-native">{lang.native}</span>
                          <span className="lang-english">{lang.name}</span>
                        </div>
                        {currentLang.code === lang.code && (
                          <span className="material-symbols-outlined check-icon notranslate" translate="no">check</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button className="action-btn" title="Notifications">
              <span className="material-symbols-outlined notranslate" translate="no">notifications</span>
            </button>
            <button className="action-btn" title="Settings">
              <span className="material-symbols-outlined notranslate" translate="no">settings</span>
            </button>
            <ProfileMenu />
          </div>
        </header>

        {/* Page Content — renders the matched child route */}
        <div className="portal-content">
          <Outlet />
        </div>

        {/* Details Footer */}
        <footer className="details-footer">
          <div className="details-footer-left">
            <span className="details-footer-title">{activeScreen.title}</span>
            <p className="details-footer-desc">{activeScreen.description}</p>
          </div>
          <div className="details-footer-right">
            <div className="meta-pill">{portalName}</div>
            <div className="meta-pill">{activeScreen.section}</div>
          </div>
        </footer>
      </main>
    </div>
  );
}
