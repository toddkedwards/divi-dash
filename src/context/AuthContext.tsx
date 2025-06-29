import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, onAuthStateChanged } from "../lib/firebase";
import { User } from "firebase/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }
    
    // Check if auth is available before subscribing
    if (!auth) {
      setLoading(false);
      return;
    }
    
    // Check if auth is a mock object (for development)
    if (typeof auth.onAuthStateChanged !== 'function') {
      setLoading(false);
      return;
    }
    
    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.warn('Auth state change error:', error);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 