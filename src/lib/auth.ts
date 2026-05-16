import { api, AuthUser, tokenStorage } from './api';
import { SignInDto, SignUpTalentDto, SignUpEmployerDto } from '../types/auth';

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
  };
}

export const authApi = {
  signIn: async (dto: SignInDto): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/signin', dto);
    const { accessToken, refreshToken, user } = res.data.data;
    tokenStorage.setSession(accessToken, refreshToken, user);
    return res.data;
  },

  signUpTalent: async (dto: SignUpTalentDto): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/signup/talent', dto);
    // Do NOT store session — user must verify email first
    return res.data;
  },

  signUpEmployer: async (dto: SignUpEmployerDto): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/signup/employer', dto);
    // Do NOT store session — user must verify email first
    return res.data;
  },

  signOut: async () => {
    try {
      await api.post('/auth/signout');
    } finally {
      tokenStorage.clearSession();
      window.location.href = '/signin';
    }
  },

  getMe: async () => {
    const res = await api.get<any>('/users/me');
    return res.data.data;
  },

  updateProfile: async (dto: any) => {
    const res = await api.patch<any>('/users/profile', dto);
    return res.data.data;
  },

  forgotPassword: async (email: string) => {
    const res = await api.post<{ message: string }>('/auth/forgot-password', { email });
    return res.data;
  },

  resetPassword: async (dto: { token: string; newPassword: string }) => {
    const res = await api.post<{ message: string }>('/auth/reset-password', dto);
    return res.data;
  },

  verifyEmail: async (token: string) => {
    const res = await api.get<{ success: boolean; message: string; data?: any }>(`/auth/verify-email?token=${token}`);
    return res.data;
  },

  resendVerification: async () => {
    const res = await api.post<{ message: string }>('/auth/resend-verification');
    return res.data;
  },

  addResume: async (dto: { fileName: string; fileUrl: string; isDefault?: boolean }) => {
    const res = await api.post<any>('/users/resumes', dto);
    return res.data.data;
  },

  setDefaultResume: async (resumeId: string) => {
    const res = await api.patch<any>(`/users/resumes/${resumeId}/default`);
    return res.data.data;
  },

  deleteResume: async (resumeId: string) => {
    const res = await api.delete<any>(`/users/resumes/${resumeId}`);
    return res.data.data;
  },
};
