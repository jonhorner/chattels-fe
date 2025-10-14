import React, { useState } from "react";
import {
  Modal,
  TextInput,
  Button,
  Group,
  Stack,
  Alert,
  Text,
} from "@mantine/core";
import { IconPlus, IconAlertCircle, IconMapPin } from "@tabler/icons-react";
import { useCreateLocation } from "../hooks/useLocations";

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddLocationModalMantine: React.FC<AddLocationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState("");
  const createLocationMutation = useCreateLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      await createLocationMutation.mutateAsync({ name: name.trim() });
      handleClose();
    } catch (error) {
      console.error("Failed to create location:", error);
    }
  };

  const handleClose = () => {
    setName("");
    createLocationMutation.reset();
    onClose();
  };

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      title={
        <Group gap="sm">
          <IconMapPin size={24} color="#e03131" />
          <Text size="xl" fw={600}>
            Add New Location
          </Text>
        </Group>
      }
      size="md"
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
      <form onSubmit={handleSubmit}>
        <Stack gap="lg">
          {/* Name Input */}
          <TextInput
            label="Location Name"
            placeholder="Enter location name"
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
            disabled={createLocationMutation.isPending}
            required
            radius="md"
            size="md"
            styles={{
              label: {
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 500,
                marginBottom: "8px",
              },
              input: {
                backgroundColor: "#2d2d2d",
                borderColor: "#666",
                color: "#ffffff",
                "&:focus": {
                  borderColor: "#e03131",
                  boxShadow: "0 0 0 2px rgba(224, 49, 49, 0.2)",
                },
                "&::placeholder": {
                  color: "#999",
                },
              },
            }}
          />

          {/* Error Display */}
          {createLocationMutation.isError && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="red"
              variant="light"
              radius="md"
            >
              {createLocationMutation.error?.message ||
                "Failed to create location"}
            </Alert>
          )}

          {/* Action Buttons */}
          <Group justify="flex-end" gap="sm" pt="md">
            <Button
              variant="light"
              color="gray"
              onClick={handleClose}
              disabled={createLocationMutation.isPending}
              radius="md"
              size="md"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient"
              gradient={{ from: "red.6", to: "red.8" }}
              disabled={!name.trim() || createLocationMutation.isPending}
              loading={createLocationMutation.isPending}
              leftSection={<IconPlus size={16} />}
              radius="md"
              size="md"
            >
              Add Location
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
