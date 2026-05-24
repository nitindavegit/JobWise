import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import apiClient from '../api/client';

const getStoredToken = () => localStorage.getItem('token') ?? null;
const getStoredUser = () => {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(getStoredToken);

  // Refresh user data from API on app load (keeps avatar, profile_completed, etc. in sync)
  useEffect(() => {
    if (token) {
      apiClient.get('/user/me')
        .then(res => {
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        })
        .catch(() => { /* token expired or invalid — ignore, user stays as-is */ });
    }
  }, [token]);

  const login = async (username, password) => {
    const response = await apiClient.post('/login', {
      user_name: username,
      user_password: password,
    });
    const { access_token } = response.data;

    // Save token BEFORE calling /user/me so the interceptor picks it up
    localStorage.setItem('token', access_token);
    setToken(access_token);

    const userResponse = await apiClient.get('/user/me');

    setUser(userResponse.data);
    localStorage.setItem('user', JSON.stringify(userResponse.data));

    return userResponse.data;
  };

  const signup = async (username, email, password, userType) => {
    await apiClient.post('/user/', {
      user_name: username,
      user_email: email,
      user_password: password,
      user_type: userType,
    });

    // Auto-login after signup
    return await login(username, password);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (data) => {
    setUser((prev) => {
      const updated = { ...prev, ...data };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};