import { api } from './api';

export interface ContactMessageDto {
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  type?: string;
  userId?: string;
}

export interface ContactReply {
  id: string;
  contactMessageId: string;
  senderId: string;
  senderRole: string;
  message: string;
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
};
