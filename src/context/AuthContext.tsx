// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthError, Session } from '@supabase/supabase-js';
import { authService, AuthSubscription } from '../services/authService';

interface AuthContextValue {
  session: Session | null;
  loading: boolean;
  signInWithOtp: (phone: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscription: AuthSubscription | null = null;

    const init = async () => {
      const { data, error } = await authService.getSession();
      if (error) {
        console.warn('getSession failed', error.message);
      }
      setSession(data.session ?? null);
      setLoading(false);
    };
    void init();

    const { data } = authService.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    subscription = data.subscription;

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signInWithOtp = async (phone: string) => {
    // 简化：可以先用邮箱密码登录，后面再换成手机号 OTP
    const { error } = await authService.signInWithOtp(phone);
    return { error };
  };

  const signOut = async () => {
    await authService.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, loading, signInWithOtp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
