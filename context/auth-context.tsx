"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  authService,
  type AuthUser,
  type SendOtpResponse,
  type VerifyOtpResponse,
  type ResendOtpResponse,
} from "@/services/AuthService";

const STORAGE_KEYS = {
  ACCESS_TOKEN: "bytecode_access_token",
  REFRESH_TOKEN: "bytecode_refresh_token",
  USER: "bytecode_auth_user",
};

interface AuthContextType {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: { accessToken: string; refreshToken?: string; user?: AuthUser }) => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  sendOtp: (mobile: string) => Promise<SendOtpResponse>;
  verifyOtp: (mobile: string, otp: string) => Promise<VerifyOtpResponse>;
  resendOtp: (mobile: string, retrytype?: "text" | "voice") => Promise<ResendOtpResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const storedAccess = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const storedRefresh = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

      if (storedAccess) {
        setAccessToken(storedAccess);
      }
      if (storedRefresh) {
        setRefreshToken(storedRefresh);
      }
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      // Verify active session with backend
      if (storedAccess) {
        authService
          .getSession(storedAccess)
          .then((res) => {
            if (res.success && res.user) {
              setUser(res.user);
              localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.user));
            } else if (storedRefresh) {
              // Attempt refresh if access token expired
              authService.refresh(storedRefresh).then((refreshRes) => {
                if (refreshRes.success && refreshRes.accessToken) {
                  setAccessToken(refreshRes.accessToken);
                  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, refreshRes.accessToken);
                  if (refreshRes.user) {
                    setUser(refreshRes.user);
                    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(refreshRes.user));
                  }
                } else {
                  // Session invalid
                  logoutLocal();
                }
              });
            }
          })
          .catch(() => {
            // Keep local data for offline, or try refresh
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
      }
    } catch {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    (data: { accessToken: string; refreshToken?: string; user?: AuthUser }) => {
      setAccessToken(data.accessToken);
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);

      if (data.refreshToken) {
        setRefreshToken(data.refreshToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
      }

      if (data.user) {
        setUser(data.user);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
      }
    },
    []
  );

  const logoutLocal = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch {
      // ignore
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (accessToken) {
        await authService.logout(accessToken);
      }
    } catch {
      // ignore
    } finally {
      logoutLocal();
    }
  }, [accessToken, logoutLocal]);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    const currentRefresh = refreshToken || localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!currentRefresh) return false;

    const res = await authService.refresh(currentRefresh);
    if (res.success && res.accessToken) {
      setAccessToken(res.accessToken);
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, res.accessToken);
      if (res.user) {
        setUser(res.user);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.user));
      }
      return true;
    }
    return false;
  }, [refreshToken]);

  const sendOtp = useCallback(async (mobile: string): Promise<SendOtpResponse> => {
    return authService.sendOtp({ mobile });
  }, []);

  const verifyOtp = useCallback(
    async (mobile: string, otp: string): Promise<VerifyOtpResponse> => {
      const res = await authService.verifyOtp(mobile, otp);
      if (res.success && res.accessToken) {
        login({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          user: res.user,
        });
      }
      return res;
    },
    [login]
  );

  const resendOtp = useCallback(
    async (mobile: string, retrytype: "text" | "voice" = "text"): Promise<ResendOtpResponse> => {
      return authService.resendOtp(mobile, retrytype);
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        isAuthenticated: Boolean(accessToken && user),
        isLoading,
        login,
        logout,
        refreshSession,
        sendOtp,
        verifyOtp,
        resendOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

