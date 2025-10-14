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
  IconFolder,
} from "@tabler/icons-react";
import { useUpdateCategory } from "../hooks/useCategories";
import type { Category, UpdateCategory } from "../types";

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
}

export const EditCategoryModalMantine: React.FC<EditCategoryModalProps> = ({
  isOpen,
  onClose,
  category,
}) => {
  const [name, setName] = useState("");
  const updateCategoryMutation = useUpdateCategory();

  // Update form data when category changes
  useEffect(() => {
    if (category) {
      setName(category.name || "");
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !name.trim()) return;

    try {
      const categoryData: UpdateCategory = {
        name: name.trim(),
      };

      await updateCategoryMutation.mutateAsync({
        id: category.id,
        category: categoryData,
      });
      handleClose();
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  const handleClose = () => {
    setName("");
    updateCategoryMutation.reset();
    onClose();
  };

  if (!category) return null;

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      title={
        <Group gap="sm">
          <IconFolder size={24} color="#e03131" />
          <Text size="xl" fw={600}>
            Edit Category
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
            label="Category Name"
            placeholder="Enter category name"
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
            disabled={updateCategoryMutation.isPending}
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
          {updateCategoryMutation.isError && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="red"
              variant="light"
              radius="md"
            >
              {updateCategoryMutation.error?.message ||
                "Failed to update category"}
            </Alert>
          )}

          {/* Action Buttons */}
          <Group justify="flex-end" gap="sm" pt="md">
            <Button
              variant="light"
              color="gray"
              onClick={handleClose}
              disabled={updateCategoryMutation.isPending}
              radius="md"
              size="md"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient"
              gradient={{ from: "red.6", to: "red.8" }}
              disabled={!name.trim() || updateCategoryMutation.isPending}
              loading={updateCategoryMutation.isPending}
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
