import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProfileMenu from './ProfileMenu';

export default function PortalLayout({ portalName, portalSubtitle, portalIcon, screens, basePath }) {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const location = useLocation();

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

      {/* Left Sidebar */}
      <aside className="sidebar glass-panel">
        <div className="sidebar-header">
          <div className="logo-container">
            <span className="material-symbols-outlined">{portalIcon}</span>
          </div>
          <div>
            <h1 className="brand-title">SafeNet AI</h1>
            <p className="brand-subtitle">{portalSubtitle}</p>
          </div>
        </div>

        {/* Search */}
        <div className="sidebar-search">
          <div className="search-wrapper">
            <span className="material-symbols-outlined">search</span>
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
                      <span className="material-symbols-outlined">{screen.icon}</span>
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
              <span className="breadcrumbs-sep">/</span>
              <span>{portalName}</span>
              <span className="breadcrumbs-sep">/</span>
              <span>{activeScreen.title}</span>
            </div>
            <h2 className="current-title">{activeScreen.title}</h2>
          </div>

          <div className="header-right">
            <button className="action-btn" title="Notifications">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="action-btn" title="Settings">
              <span className="material-symbols-outlined">settings</span>
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
