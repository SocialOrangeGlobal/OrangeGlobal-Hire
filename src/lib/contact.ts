import { api } from './api';

export interface ContactMessageDto {
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
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
};
