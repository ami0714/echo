import { createContext, useState, useContext, useEffect } from 'react';
import { post,get } from '../utils/apiHelper';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Semak token sedia ada (refresh page)
  useEffect(() => {
  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      try {
        const res = await get('/user');
        setUser(res.data);
      } catch (error) {
        console.log('Gagal mendapatkan pengguna:', error);
        // Token mungkin tidak sah, buangnya
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  fetchUser();
}, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);


     const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      try {
        const res = await get('/user');
        setUser(res.data);
      } catch (error) {
        console.log('Gagal mendapatkan pengguna:', error);
        // Token mungkin tidak sah, buangnya
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  fetchUser();

  }
  const logout = async  () => {
    const token = localStorage.getItem('token');
    if(!token){
      setUser(null);
      return;
    }

    try {
      post('/logout')
    } catch (error) {
      console.error('Logout gagal:', err);
    } finally{
      localStorage.removeItem('token');
    setUser(null);
    }
    
  };

  const value = { user, login, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}