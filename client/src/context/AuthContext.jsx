import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

const TOKEN_KEY = 'prepwise_token';
const USER_KEY = 'prepwise_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  const persistSession = useCallback((token, userData) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const register = useCallback(
    async ({ name, email, password }) => {
      const { data } = await api.post('/auth/register', { name, email, password });
      persistSession(data.token, data.user);
      return data.user;
    },
    [persistSession]
  );

  const login = useCallback(
    async ({ email, password }) => {
      const { data } = await api.post('/auth/login', { email, password });
      persistSession(data.token, data.user);
      return data.user;
    },
    [persistSession]
  );

  const loginAsGuest = useCallback(async () => {
    const { data } = await api.post('/auth/guest');
    persistSession(data.token, data.user);
    return data.user;
  }, [persistSession]);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get('/auth/me')
      .then(({ data }) => {
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        setUser(data.user);
      })
      .catch(() => {
        logout();
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isGuest: !!user?.isGuest,
    loading,
    register,
    login,
    loginAsGuest,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
