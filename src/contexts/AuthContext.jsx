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

  const value = {
    user,
    role: user?.role || null,
    isAuthenticated: !!user,
    login,
    logout,
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
