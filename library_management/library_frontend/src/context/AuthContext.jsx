import { createContext, useState, useContext, useEffect } from 'react';
import { logoutUser, fetchUserAccount } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load user from localStorage if available
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user account data to validate and refresh user state
    const initializeUser = async () => {
      if (user) {
        try {
          const userAccount = await fetchUserAccount();
          setUser(userAccount);
          localStorage.setItem('user', JSON.stringify(userAccount));
        } catch (error) {
          console.error('Failed to fetch user account:', error);
          setUser(null);
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initializeUser();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData)); // Save user to localStorage
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      localStorage.removeItem('user'); // Remove user from localStorage
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
