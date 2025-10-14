import React from "react";
import { Modal, Text, Button, Group, Stack, ThemeIcon } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export const ConfirmDialogMantine: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
}) => {
  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={
        <Group gap="sm">
          <IconAlertTriangle size={24} color="#e03131" />
          <Text size="xl" fw={600}>
            {title}
          </Text>
        </Group>
      }
      size="sm"
      radius="lg"
      centered
      overlayProps={{
        backgroundOpacity: 0.7,
        blur: 4,
      }}
      styles={{
        modal: {
          backgroundColor: "#1a1a1a",
          border: "2px solid #e03131",
          boxShadow: "0 25px 50px -12px rgba(224, 49, 49, 0.25)",
        },
        close: {
          color: "#e03131",
          backgroundColor: "transparent",
          "&:hover": {
            backgroundColor: "rgba(224, 49, 49, 0.1)",
            color: "#ff4d4d",
          },
        },
        body: {
          backgroundColor: "#1a1a1a",
        },
      }}
    >
      <Stack gap="lg">
        {/* Warning Icon and Message */}
        <Group align="flex-start" gap="md">
          <ThemeIcon
            size={50}
            radius="xl"
            variant="light"
            color="red"
            style={{
              backgroundColor: "rgba(224, 49, 49, 0.1)",
              border: "1px solid #e03131",
            }}
          >
            <IconAlertTriangle size={24} />
          </ThemeIcon>
          <Text size="md" c="#ffffff" style={{ flex: 1, lineHeight: 1.5 }}>
            {message}
          </Text>
        </Group>

        {/* Action Buttons */}
        <Group justify="flex-end" gap="sm" pt="md">
          <Button
            variant="light"
            color="gray"
            onClick={onClose}
            disabled={isLoading}
            radius="md"
            size="md"
          >
            {cancelText}
          </Button>
          <Button
            variant="gradient"
            gradient={{ from: "red.6", to: "red.8" }}
            onClick={onConfirm}
            disabled={isLoading}
            loading={isLoading}
            radius="md"
            size="md"
          >
            {confirmText}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
