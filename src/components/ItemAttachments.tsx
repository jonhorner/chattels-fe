import React, { useState, useRef } from 'react';
import { Paperclip, Upload, Trash2, FileText, Image as ImageIcon, X } from 'lucide-react';
import { useItemAttachments, useUploadAttachment, useDeleteAttachment } from '../hooks/useAttachments';
import { getAttachmentUrl } from '../services/attachments';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { ConfirmDialog } from './ui/ConfirmDialog';
import type { Attachment } from '../types';

interface ItemAttachmentsProps {
  itemId: number;
  isExpanded: boolean;
  onToggle: () => void;
}

export const ItemAttachments: React.FC<ItemAttachmentsProps> = ({ itemId, isExpanded, onToggle }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const { data: attachmentsData, isLoading } = useItemAttachments(isExpanded ? itemId : null);
  const uploadMutation = useUploadAttachment();
  const deleteMutation = useDeleteAttachment();
  
  const attachments = attachmentsData?.data || [];

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setUploadError(null);
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Only PDF and image files (JPEG, PNG, GIF, WebP) are allowed');
      return;
    }
    
    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB');
      return;
    }
    
    try {
      await uploadMutation.mutateAsync({ itemId, file });
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setUploadError('Failed to upload file');
    }
  };

  const handleDeleteClick = (attachment: Attachment) => {
    setSelectedAttachment(attachment);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedAttachment) return;
    
    try {
      await deleteMutation.mutateAsync({ 
        attachmentId: selectedAttachment.id, 
        itemId 
      });
      setIsDeleteDialogOpen(false);
      setSelectedAttachment(null);
    } catch (error) {
      console.error('Failed to delete attachment:', error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType === 'application/pdf') {
      return <FileText className="h-5 w-5 text-red-600" />;
    }
    return <ImageIcon className="h-5 w-5 text-blue-600" />;
  };

  return (
    <div className="border-t border-gray-200">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-2 text-gray-700">
          <Paperclip className="h-4 w-4" />
          <span className="text-sm font-medium">
            Attachments ({attachments.length})
          </span>
        </div>
        <span className="text-gray-400 text-sm">
          {isExpanded ? 'Hide' : 'Show'}
        </span>
      </button>

      {/* Attachments Panel */}
      {isExpanded && (
        <div className="px-6 pb-4 space-y-3">
          {/* Upload Button */}
          <div className="flex items-center space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadMutation.isPending}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {uploadMutation.isPending ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>Upload File</span>
                </>
              )}
            </button>
            <span className="text-xs text-gray-500">
              PDF or images (max 10MB)
            </span>
          </div>

          {/* Error Message */}
          {uploadError && (
            <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-3">
              <span className="text-sm text-red-700">{uploadError}</span>
              <button
                onClick={() => setUploadError(null)}
                className="text-red-400 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center py-4">
              <LoadingSpinner size="sm" />
            </div>
          )}

          {/* Attachments List */}
          {!isLoading && attachments.length === 0 && (
            <div className="text-center py-6 text-gray-500 text-sm">
              No attachments yet
            </div>
          )}

          {!isLoading && attachments.length > 0 && (
            <div className="space-y-2">
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {getFileIcon(attachment.mimeType)}
                    <div className="flex-1 min-w-0">
                      <a
                        href={getAttachmentUrl(attachment.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 truncate block"
                      >
                        {attachment.originalName}
                      </a>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(attachment.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteClick(attachment)}
                    disabled={deleteMutation.isPending}
                    className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedAttachment(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Attachment"
        message={`Are you sure you want to delete "${selectedAttachment?.originalName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
