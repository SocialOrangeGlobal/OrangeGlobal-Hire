import { api } from './api';

export interface ContactMessageDto {
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  type?: string;
  userId?: string;
  // Anti-bot honeypot fields
  website?: string;
  _formLoadedAt?: number;
}

export interface ContactReply {
  id: string;
  contactMessageId: string;
  senderId: string;
  senderRole: string;
  message: string;
  isRead?: boolean;
  readAt?: string;
  createdAt: string;
  sender: {
    email: string;
    role: string;
    adminProfile?: { firstName: string; lastName: string } | null;
    talentProfile?: { fullName: string } | null;
  };
}

export interface ContactMessageItem {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  type: string;
  status: string;
  notes?: string;
  createdAt: string;
  replies: ContactReply[];
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data: {
    message: string;
    id: string;
  };
}

export const contactApi = {
  submitMessage: async (dto: ContactMessageDto): Promise<ContactResponse> => {
    const res = await api.post<ContactResponse>('/contact', dto);
    return res.data;
  },
  getUserMessages: async (): Promise<ContactMessageItem[]> => {
    const res = await api.get<{ success: boolean; data: ContactMessageItem[] }>('/contact/my-messages');
    return res.data.data;
  },
  sendReply: async (id: string, replyMessage: string): Promise<ContactReply> => {
    const res = await api.post<{ success: boolean; data: ContactReply }>(`/contact/${id}/reply`, { message: replyMessage });
    return res.data.data;
  },
  markAsRead: async (id: string): Promise<{ success: boolean; count: number }> => {
    const res = await api.patch<{ success: boolean; count: number }>(`/contact/${id}/read`);
    return res.data;
  },
  triggerTyping: async (id: string, isTyping: boolean): Promise<{ success: boolean }> => {
    const res = await api.post<{ success: boolean }>(`/contact/${id}/typing`, { isTyping });
    return res.data;
  },
};
