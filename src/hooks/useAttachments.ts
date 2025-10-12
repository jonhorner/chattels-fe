import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getItemAttachments,
  uploadAttachment,
  deleteAttachment,
} from '../services/attachments';

// Hook for fetching item attachments
export const useItemAttachments = (itemId: number | null) => {
  return useQuery({
    queryKey: ['attachments', itemId],
    queryFn: () => getItemAttachments(itemId!),
    enabled: !!itemId,
  });
};

// Hook for uploading attachments
export const useUploadAttachment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ itemId, file }: { itemId: number; file: File }) =>
      uploadAttachment(itemId, file),
    onSuccess: (data, variables) => {
      // Invalidate attachments query for this item
      queryClient.invalidateQueries({ queryKey: ['attachments', variables.itemId] });
    },
  });
};

// Hook for deleting attachments
export const useDeleteAttachment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ attachmentId, itemId }: { attachmentId: number; itemId: number }) =>
      deleteAttachment(attachmentId),
    onSuccess: (data, variables) => {
      // Invalidate attachments query for this item
      queryClient.invalidateQueries({ queryKey: ['attachments', variables.itemId] });
    },
  });
};
