import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ProfileMenu() {
  const { user, logout, roleLabel } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="profile-menu-container" ref={menuRef}>
      <button className="profile-trigger" onClick={() => setOpen(!open)}>
        <div className="profile-avatar notranslate" translate="no">{user.avatar}</div>
        <div className="profile-info-mini">
          <span className="profile-name-mini">{user.name}</span>
          <span className="profile-role-mini">{roleLabel}</span>
        </div>
        <span className="material-symbols-outlined notranslate" translate="no" style={{ fontSize: 18, opacity: 0.5 }}>
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {open && (
        <div className="profile-dropdown glass-card">
          <div className="profile-dropdown-header">
            <div className="profile-avatar-lg notranslate" translate="no">{user.avatar}</div>
            <div>
              <div className="profile-dropdown-name">{user.name}</div>
              <div className="profile-dropdown-unit">{user.unit}</div>
            </div>
          </div>
          <div className="profile-dropdown-role-badge">
            <span className="material-symbols-outlined notranslate" translate="no" style={{ fontSize: 14 }}>verified_user</span>
            {roleLabel}
          </div>
          <div className="profile-dropdown-divider" />
          <button className="profile-dropdown-item" onClick={handleLogout}>
            <span className="material-symbols-outlined notranslate" translate="no">logout</span>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
