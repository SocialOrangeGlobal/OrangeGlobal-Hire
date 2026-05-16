import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, tokenStorage } from '../lib/api';
import { authApi } from '../lib/auth';
import { store } from '../store';
import { updateProfileSuccess } from '../store/slices/authSlice';

interface AuthContextType {
  user: AuthUser | null;
  role: 'TALENT' | 'EMPLOYER' | null;
  loading: boolean;
  setUser: (user: AuthUser | null) => void;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<AuthUser | null>(tokenStorage.getUser());
  const [role, setRole] = useState<'TALENT' | 'EMPLOYER' | null>(tokenStorage.getRole());
  const [loading, setLoading] = useState(true);

  const setUser = (newUser: AuthUser | null) => {
    setUserState(newUser);
    setRole(newUser?.role ?? null);
  };

  const refreshUser = async () => {
    if (!tokenStorage.getAccess()) {
      setLoading(false);
      return;
    }
    try {
      const userData = await authApi.getMe();
      setUser(userData);
      store.dispatch(updateProfileSuccess({
        fullName: userData.fullName,
        avatarUrl: userData.avatarUrl,
      }));
    } catch (err) {
      console.error('Failed to fetch user profile', err);
      // If 401, axios interceptor will handle it, but if it fails completely:
      // setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshUser();
  }, []);

  const signOut = async () => {
    await authApi.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, setUser, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
