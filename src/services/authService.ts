// src/services/authService.ts
import {
  AuthChangeEvent,
  AuthError,
  AuthResponse,
  OAuthResponse,
  SSOResponse,
  Session,
} from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

export type AuthSubscription = ReturnType<
  typeof supabase.auth.onAuthStateChange
>['data']['subscription'];

/**
 * Auth 相关封装，避免在 UI 层直接操作 supabase 实例。
 */
export const authService = {
  getSession: async (): Promise<SSOResponse> => supabase.auth.getSession(),

  onAuthStateChange: (
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) => supabase.auth.onAuthStateChange(callback),

  signInWithOtp: async (phone: string): Promise<OAuthResponse> =>
    supabase.auth.signInWithOtp({
      phone,
      options: {
        channel: 'sms',
        shouldCreateUser: true,
      },
    }),

  signInWithPassword: async (
    email: string,
    password: string
  ): Promise<AuthResponse> =>
    supabase.auth.signInWithPassword({
      email,
      password,
    }),

  signUpWithEmail: async (
    email: string,
    password: string,
    metadata?: Record<string, string>
  ): Promise<AuthResponse> =>
    supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    }),

  signOut: async (): Promise<{ error: AuthError | null }> =>
    supabase.auth.signOut(),
};

/**
 * 示例：
 * await authService.signInWithOtp('+8613812345678')
 * const { data } = await authService.getSession()
 */
