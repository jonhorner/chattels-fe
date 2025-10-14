import React, { useState, useEffect } from "react";
import {
  Modal,
  TextInput,
  Button,
  Group,
  Stack,
  Alert,
  Text,
} from "@mantine/core";
import {
  IconEdit,
  IconAlertCircle,
  IconDeviceFloppy,
  IconMapPin,
} from "@tabler/icons-react";
import { useUpdateLocation } from "../hooks/useLocations";
import type { Location, UpdateLocation } from "../types";

interface EditLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: Location | null;
}

export const EditLocationModalMantine: React.FC<EditLocationModalProps> = ({
  isOpen,
  onClose,
  location,
}) => {
  const [name, setName] = useState("");
  const updateLocationMutation = useUpdateLocation();

  // Update form data when location changes
  useEffect(() => {
    if (location) {
      setName(location.name || "");
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!location || !name.trim()) return;

    try {
      const locationData: UpdateLocation = {
        name: name.trim(),
      };

      await updateLocationMutation.mutateAsync({
        id: location.id,
        location: locationData,
      });
      handleClose();
    } catch (error) {
      console.error("Failed to update location:", error);
    }
  };

  const handleClose = () => {
    setName("");
    updateLocationMutation.reset();
    onClose();
  };

  if (!location) return null;

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      title={
        <Group gap="sm">
          <IconMapPin size={24} color="#e03131" />
          <Text size="xl" fw={600}>
            Edit Location
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
            disabled={updateLocationMutation.isPending}
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
          {updateLocationMutation.isError && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="red"
              variant="light"
              radius="md"
            >
              {updateLocationMutation.error?.message ||
                "Failed to update location"}
            </Alert>
          )}

          {/* Action Buttons */}
          <Group justify="flex-end" gap="sm" pt="md">
            <Button
              variant="light"
              color="gray"
              onClick={handleClose}
              disabled={updateLocationMutation.isPending}
              radius="md"
              size="md"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient"
              gradient={{ from: "red.6", to: "red.8" }}
              disabled={!name.trim() || updateLocationMutation.isPending}
              loading={updateLocationMutation.isPending}
              leftSection={<IconDeviceFloppy size={16} />}
              radius="md"
              size="md"
            >
              Save Changes
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
