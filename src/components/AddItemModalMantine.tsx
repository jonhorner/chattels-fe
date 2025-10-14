import React, { useState } from "react";
import {
  Modal,
  TextInput,
  Textarea,
  NumberInput,
  Select,
  Button,
  Group,
  Stack,
  Alert,
  Text,
} from "@mantine/core";
import { IconPlus, IconAlertCircle } from "@tabler/icons-react";
import { useCreateItem } from "../hooks/useItems";
import { useCategories, useLocations } from "../hooks";
import type { CreateItem } from "../types";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddItemModalMantine: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState<CreateItem>({
    name: "",
    description: "",
    value: undefined,
    categoryId: undefined,
    locationId: undefined,
  });

  const createItemMutation = useCreateItem();
  const { data: categoriesData } = useCategories({ limit: 100 });
  const { data: locationsData } = useLocations({ limit: 100 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) return;

    try {
      const itemData: CreateItem = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
        value: formData.value || undefined,
      };

      await createItemMutation.mutateAsync(itemData);
      handleClose();
    } catch (error) {
      console.error("Failed to create item:", error);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      value: undefined,
      categoryId: undefined,
      locationId: undefined,
    });
    createItemMutation.reset();
    onClose();
  };

  const categories = categoriesData?.data || [];
  const locations = locationsData?.data || [];

  const categoryOptions = categories.map((cat) => ({
    value: cat.id.toString(),
    label: cat.name || "Unnamed Category",
  }));

  const locationOptions = locations.map((loc) => ({
    value: loc.id.toString(),
    label: loc.name || "Unnamed Location",
  }));

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      title={
        <Group gap="sm">
          <IconPlus size={24} color="#e03131" />
          <Text size="xl" fw={600}>
            Add New Item
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
            label="Name *"
            placeholder="Enter item name"
            value={formData.name}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                name: event.currentTarget.value,
              }))
            }
            disabled={createItemMutation.isPending}
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

          {/* Description */}
          <Textarea
            label="Description"
            placeholder="Enter item description"
            value={formData.description || ""}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                description: event.currentTarget.value,
              }))
            }
            disabled={createItemMutation.isPending}
            rows={3}
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

          {/* Value */}
          <NumberInput
            label="Value (£)"
            placeholder="Enter item value"
            value={formData.value}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, value: value || undefined }))
            }
            disabled={createItemMutation.isPending}
            min={0}
            decimalScale={2}
            fixedDecimalScale
            prefix="£"
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

          {/* Category */}
          <Select
            label="Category"
            placeholder="Select a category"
            data={categoryOptions}
            value={formData.categoryId?.toString() || null}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                categoryId: value ? Number(value) : undefined,
              }))
            }
            disabled={createItemMutation.isPending}
            clearable
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
              },
              dropdown: {
                backgroundColor: "#2d2d2d",
                borderColor: "#666",
                border: "1px solid #666",
              },
              option: {
                color: "#ffffff",
                backgroundColor: "transparent",
                "&[data-selected]": {
                  backgroundColor: "#e03131",
                  color: "#ffffff",
                },
                "&[data-hovered]": {
                  backgroundColor: "rgba(224, 49, 49, 0.1)",
                },
              },
            }}
          />

          {/* Location */}
          <Select
            label="Location"
            placeholder="Select a location"
            data={locationOptions}
            value={formData.locationId?.toString() || null}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                locationId: value ? Number(value) : undefined,
              }))
            }
            disabled={createItemMutation.isPending}
            clearable
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
              },
              dropdown: {
                backgroundColor: "#2d2d2d",
                borderColor: "#666",
                border: "1px solid #666",
              },
              option: {
                color: "#ffffff",
                backgroundColor: "transparent",
                "&[data-selected]": {
                  backgroundColor: "#e03131",
                  color: "#ffffff",
                },
                "&[data-hovered]": {
                  backgroundColor: "rgba(224, 49, 49, 0.1)",
                },
              },
            }}
          />

          {/* Error Display */}
          {createItemMutation.isError && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="red"
              variant="light"
              radius="md"
            >
              {createItemMutation.error?.message || "Failed to create item"}
            </Alert>
          )}

          {/* Action Buttons */}
          <Group justify="flex-end" gap="sm" pt="md">
            <Button
              variant="light"
              color="gray"
              onClick={handleClose}
              disabled={createItemMutation.isPending}
              radius="md"
              size="md"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient"
              gradient={{ from: "red.6", to: "red.8" }}
              disabled={!formData.name.trim() || createItemMutation.isPending}
              loading={createItemMutation.isPending}
              leftSection={<IconPlus size={16} />}
              radius="md"
              size="md"
            >
              Add Item
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
