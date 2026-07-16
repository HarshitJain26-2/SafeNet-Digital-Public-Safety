import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const ROLE_PORTALS = {
  citizen: '/citizen/dashboard',
  officer: '/officer/dashboard',
  admin: '/admin/dashboard',
};

const ROLE_LABELS = {
  citizen: 'Citizen',
  officer: 'Law Enforcement Officer',
  admin: 'Super Admin',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('safenet_user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('safenet_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('safenet_user');
    }
  }, [user]);

  const login = (role) => {
    const newUser = {
      role,
      name: role === 'citizen' ? 'Priya Sharma' : role === 'officer' ? 'Inspector Vikram Singh' : 'CIO Marcus Thorne',
      unit: role === 'citizen' ? 'NCR Region' : role === 'officer' ? 'Cyber Crime Unit 7' : 'Operations Unit 7',
      avatar: role === 'admin' ? 'MT' : role === 'officer' ? 'VS' : 'PS',
    };
    setUser(newUser);
    return ROLE_PORTALS[role];
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updates) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      if (updates.name && (!updates.avatar || updates.avatar === prev.avatar)) {
        const initials = updates.name
          .split(' ')
          .filter(Boolean)
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase();
        updated.avatar = initials || 'U';
      }
      return updated;
    });
  };

  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('safenet_language') || 'en';
  });

  const changeLanguage = (langCode) => {
    setLanguageState(langCode);
    localStorage.setItem('safenet_language', langCode);
  };

  const value = {
    user,
    role: user?.role || null,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
    language,
    changeLanguage,
    portalPath: user ? ROLE_PORTALS[user.role] : '/',
    roleLabel: user ? ROLE_LABELS[user.role] : '',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { ROLE_PORTALS, ROLE_LABELS };
