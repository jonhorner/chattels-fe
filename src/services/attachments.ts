import { api } from './api';
import type { Attachment } from '../types';

// Get attachments for an item
export const getItemAttachments = async (itemId: number): Promise<{ data: Attachment[] }> => {
  const response = await api.get(`/items/${itemId}/attachments`);
  return response.data;
};

// Upload attachment
export const uploadAttachment = async (itemId: number, file: File): Promise<Attachment> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post(`/items/${itemId}/attachments`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Get attachment URL (for viewing/downloading)
export const getAttachmentUrl = (attachmentId: number): string => {
  return `${api.defaults.baseURL}/attachments/${attachmentId}`;
};

// Delete attachment
export const deleteAttachment = async (attachmentId: number): Promise<void> => {
  await api.delete(`/attachments/${attachmentId}`);
};
