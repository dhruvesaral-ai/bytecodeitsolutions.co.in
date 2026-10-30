import { get, post } from "@/lib/api-method";

export interface UserRole {
  id: string;
  name: string;
  slug: string;
}

export interface UserProfile {
  id: string;
  name?: string | null;
  email?: string | null;
  avatar?: string | null;
}

export interface AuthUser {
  id: string;
  username: string;
  status: string;
  role?: UserRole | null;
  profile?: UserProfile | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SendOtpPayload {
  mobile: string;
  callingFrom?: string;
  template_id?: string;
  otp_expiry?: number;
  otp_length?: number;
  params?: Record<string, unknown>;
}

export interface SendOtpResponse {
  success: boolean;
  message?: string;
  type?: string;
  mobile?: string;
  error?: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: AuthUser;
  error?: string;
}

export interface ResendOtpResponse {
  success: boolean;
  message?: string;
  type?: string;
  retrytype?: string;
  mobile?: string;
  error?: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: AuthUser;
  error?: string;
}

export interface SessionResponse {
  success: boolean;
  user?: AuthUser;
  refreshed?: boolean;
  error?: string;
}

export interface LogoutResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export const authService = {
  /**
   * Send an OTP via MSG91 to recipient mobile
   */
  async sendOtp(payload: SendOtpPayload): Promise<SendOtpResponse> {
    try {
      const res = await post<SendOtpResponse>("auth/send-otp", payload);
      return res ?? { success: false, error: "No response received" };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to send OTP";
      return { success: false, error: msg };
    }
  },

  /**
   * Verify entered OTP with MSG91 and obtain tokens/user
   */
  async verifyOtp(mobile: string, otp: string): Promise<VerifyOtpResponse> {
    try {
      const res = await post<VerifyOtpResponse>("auth/verify-otp", { mobile, otp });
      return res ?? { success: false, error: "No response received" };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to verify OTP";
      return { success: false, error: msg };
    }
  },

  /**
   * Resend / retry delivering OTP via SMS ('text') or voice call ('voice')
   */
  async resendOtp(mobile: string, retrytype: "text" | "voice" = "text"): Promise<ResendOtpResponse> {
    try {
      const res = await post<ResendOtpResponse>("auth/resend-otp", { mobile, retrytype });
      return res ?? { success: false, error: "No response received" };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to resend OTP";
      return { success: false, error: msg };
    }
  },

  /**
   * Refresh the access token using the stored refresh token
   */
  async refresh(refreshToken?: string, rotateRefreshToken: boolean = false): Promise<RefreshTokenResponse> {
    try {
      const headers = refreshToken ? { "x-refresh-token": refreshToken } : undefined;
      const res = await post<RefreshTokenResponse>(
        "auth/refresh",
        { refreshToken, rotateRefreshToken },
        headers
      );
      return res ?? { success: false, error: "No response received" };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Session expired or revoked";
      return { success: false, error: msg };
    }
  },

  /**
   * Validate current session and retrieve authenticated user
   */
  async getSession(accessToken?: string): Promise<SessionResponse> {
    try {
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;
      const res = await get<SessionResponse>("auth/session", headers);
      return res ?? { success: false, error: "No session found" };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "No active session";
      return { success: false, error: msg };
    }
  },

  /**
   * Revoke active AuthSession and clear session cookies
   */
  async logout(accessToken?: string): Promise<LogoutResponse> {
    try {
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;
      const res = await post<LogoutResponse>("auth/logout", {}, headers);
      return res ?? { success: true, message: "Logged out" };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to logout";
      return { success: false, error: msg };
    }
  },
};

