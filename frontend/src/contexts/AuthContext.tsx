import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { adminLogoutRequest, getCurrentAdmin } from '../services/api';
import type { CurrentAdminResponse } from '../types';

type CurrentAdmin = CurrentAdminResponse['user'];

interface AuthContextValue {
  admin: CurrentAdmin | null;
  isLoading: boolean;
  refreshAuth: () => Promise<CurrentAdmin | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<CurrentAdmin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getCurrentAdmin();
      const currentAdmin = response.data.user;
      setAdmin(currentAdmin);
      return currentAdmin;
    } catch {
      setAdmin(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await adminLogoutRequest();
    setAdmin(null);
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  const value = useMemo(
    () => ({ admin, isLoading, refreshAuth, logout }),
    [admin, isLoading, refreshAuth, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
