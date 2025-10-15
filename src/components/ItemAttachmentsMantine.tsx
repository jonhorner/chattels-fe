import React, { useState, useRef } from 'react';
import {
  Card,
  Button,
  Group,
  Stack,
  Text,
  ActionIcon,
  Alert,
  Loader,
  Center,
  Divider,
  Badge,
  Anchor,
} from '@mantine/core';
import {
  IconPaperclip,
  IconUpload,
  IconTrash,
  IconFileText,
  IconPhoto,
  IconX,
  IconChevronUp,
  IconChevronDown,
  IconExternalLink,
} from '@tabler/icons-react';
import { useItemAttachments, useUploadAttachment, useDeleteAttachment } from '../hooks/useAttachments';
import { getAttachmentUrl } from '../services/attachments';
import { ConfirmDialogMantine } from './ConfirmDialogMantine';
import type { Attachment } from '../types';

interface ItemAttachmentsProps {
  itemId: number;
  isExpanded: boolean;
  onToggle: () => void;
}

export const ItemAttachmentsMantine: React.FC<ItemAttachmentsProps> = ({ 
  itemId, 
  isExpanded, 
  onToggle 
}) => {
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
      return <IconFileText size={20} color="#92bbe3" />;
    }
    return <IconPhoto size={20} color="#92bbe3" />;
  };

  const getFileTypeLabel = (mimeType: string) => {
    if (mimeType === 'application/pdf') return 'PDF';
    if (mimeType.startsWith('image/')) return 'Image';
    return 'File';
  };

  return (
    <Card
      padding="md"
      radius="md"
      style={{
        background: 'linear-gradient(135deg, rgb(1, 13, 23) 0%, rgb(26, 26, 26) 100%)',
        border: '1px solid #92bbe3',
        marginTop: '1rem',
      }}
    >
      {/* Header */}
      <Button
        variant="subtle"
        fullWidth
        onClick={onToggle}
        rightSection={
          isExpanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />
        }
        leftSection={<IconPaperclip size={16} />}
        color="blue"
        justify="space-between"
        size="sm"
        styles={{
          root: {
            color: '#92bbe3',
            '&:hover': {
              backgroundColor: 'rgba(146, 187, 227, 0.1)',
            },
          },
        }}
      >
        <Group gap="xs">
          <Text size="sm" fw={500}>
            Attachments
          </Text>
          <Badge variant="light" color="blue" size="sm">
            {attachments.length}
          </Badge>
        </Group>
      </Button>

      {/* Attachments Panel */}
      {isExpanded && (
        <>
          <Divider my="md" color="#92bbe3" opacity={0.3} />
          
          <Stack gap="md">
            {/* Upload Section */}
            <Card
              padding="sm"
              radius="md"
              style={{
                backgroundColor: '#134168',
                border: '1px solid #92bbe3',
              }}
            >
              <Group justify="space-between" align="center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <Button
                  leftSection={<IconUpload size={16} />}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadMutation.isPending}
                  loading={uploadMutation.isPending}
                  variant="gradient"
                  gradient={{ from: 'blue.4', to: 'blue.8' }}
                  size="sm"
                  radius="md"
                >
                  {uploadMutation.isPending ? 'Uploading...' : 'Upload File'}
                </Button>
                
                <Text size="xs" c="dimmed">
                  PDF or images (max 10MB)
                </Text>
              </Group>
            </Card>

            {/* Error Message */}
            {uploadError && (
              <Alert
                icon={<IconX size={16} />}
                color="red"
                variant="light"
                withCloseButton
                onClose={() => setUploadError(null)}
                radius="md"
              >
                {uploadError}
              </Alert>
            )}

            {/* Loading State */}
            {isLoading && (
              <Center py="md">
                <Loader size="sm" color="blue" />
              </Center>
            )}

            {/* Empty State */}
            {!isLoading && attachments.length === 0 && (
              <Center py="xl">
                <Stack align="center" gap="xs">
                  <IconPaperclip size={32} color="gray" />
                  <Text size="sm" c="dimmed" ta="center">
                    No attachments yet
                  </Text>
                </Stack>
              </Center>
            )}

            {/* Attachments List */}
            {!isLoading && attachments.length > 0 && (
              <Stack gap="xs">
                {attachments.map((attachment) => (
                  <Card
                    key={attachment.id}
                    padding="sm"
                    radius="md"
                    style={{
                      backgroundColor: '#134168',
                      border: '1px solid #92bbe3',
                      transition: 'all 0.2s ease',
                    }}
                    className="card-hover"
                  >
                    <Group justify="space-between" align="center">
                      <Group gap="md" style={{ flex: 1, minWidth: 0 }}>
                        {getFileIcon(attachment.mimeType)}
                        
                        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                          <Group gap="xs" align="center">
                            <Anchor
                              href={getAttachmentUrl(attachment.id)}
                              target="_blank"
                              size="sm"
                              fw={500}
                              c="#92bbe3"
                              style={{
                                textDecoration: 'none',
                                '&:hover': {
                                  color: '#b3d9ff',
                                  textDecoration: 'underline',
                                },
                              }}
                            >
                              {attachment.originalName}
                            </Anchor>
                            <ActionIcon
                              size="xs"
                              variant="subtle"
                              color="blue"
                              component="a"
                              href={getAttachmentUrl(attachment.id)}
                              target="_blank"
                            >
                              <IconExternalLink size={12} />
                            </ActionIcon>
                          </Group>
                          
                          <Group gap="xs">
                            <Badge variant="dot" color="blue" size="xs">
                              {getFileTypeLabel(attachment.mimeType)}
                            </Badge>
                            <Text size="xs" c="dimmed">
                              {formatFileSize(attachment.size)}
                            </Text>
                          </Group>
                        </Stack>
                      </Group>

                      <ActionIcon
                        onClick={() => handleDeleteClick(attachment)}
                        disabled={deleteMutation.isPending}
                        color="red"
                        variant="subtle"
                        size="sm"
                        radius="md"
                        style={{
                          '&:hover': {
                            backgroundColor: 'rgba(224, 49, 49, 0.1)',
                          },
                        }}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Card>
                ))}
              </Stack>
            )}
          </Stack>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialogMantine
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
    </Card>
  );
};