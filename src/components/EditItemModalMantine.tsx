import React, { useState, useEffect, useRef } from "react";
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
import {
  IconEdit,
  IconAlertCircle,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import { useUpdateItem } from "../hooks/useItems";
import { useCategories, useLocations } from "../hooks";
import type { Item, UpdateItem } from "../types";

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item | null;
}

export const EditItemModalMantine: React.FC<EditItemModalProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  const [formData, setFormData] = useState<UpdateItem>({
    name: "",
    description: "",
    value: undefined,
    categoryId: undefined,
    locationId: undefined,
    url: "",
    serialNumber: "",
    purchaseDate: "",
  });

  const updateItemMutation = useUpdateItem();
  const { data: categoriesData } = useCategories({ limit: 100 });
  const { data: locationsData } = useLocations({ limit: 100 });
  const lastItemIdRef = useRef<number | null>(null);

  // Update form data only when a new item is opened
  useEffect(() => {
    if (item && isOpen && item.id !== lastItemIdRef.current) {
      lastItemIdRef.current = item.id;
      setFormData({
        name: item.name,
        description: item.description || "",
        value: item.value,
        categoryId: item.categoryId,
        locationId: item.locationId,
        url: item.url || "",
        serialNumber: item.serialNumber || "",
        purchaseDate: item.purchaseDate || "",
      });
    }
    if (!isOpen) {
      lastItemIdRef.current = null;
    }
  }, [item, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!item || !formData.name?.trim()) return;

    try {
      const itemData: UpdateItem = {
        ...formData,
        name: formData.name?.trim(),
        description: formData.description?.trim() || undefined,
        value: formData.value || undefined,
        url: formData.url?.trim() || undefined,
        serialNumber: formData.serialNumber?.trim() || undefined,
        purchaseDate: formData.purchaseDate?.trim() || undefined,
      };

      await updateItemMutation.mutateAsync({ id: item.id, item: itemData });
      handleClose();
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      value: undefined,
      categoryId: undefined,
      locationId: undefined,
      url: "",
      serialNumber: "",
      purchaseDate: "",
    });
    updateItemMutation.reset();
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

  if (!item) return null;

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      title={
        <Group gap="sm">
          <IconEdit size={24} color="#e03131" />
          <Text size="xl" fw={600}>
            Edit Item
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
            value={formData.name || ""}
            onChange={(event) => {
              const value = event.currentTarget.value;
              setFormData((prev) => ({
                ...prev,
                name: value,
              }));
            }}
            disabled={updateItemMutation.isPending}
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
            onChange={(event) => {
              const value = event.currentTarget.value;
              setFormData((prev) => ({
                ...prev,
                description: value,
              }));
            }}
            disabled={updateItemMutation.isPending}
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
                "&::placeholder": { color: "#999" },
              },
            }}
          />

          {/* URL */}
          <TextInput
            label="URL"
            placeholder="https://example.com"
            value={formData.url || ""}
            onChange={(event) => {
              const value = event.currentTarget.value;
              setFormData((prev) => ({
                ...prev,
                url: value,
              }));
            }}
            disabled={updateItemMutation.isPending}
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
                "&::placeholder": { color: "#999" },
              },
            }}
          />

          {/* Serial Number */}
          <TextInput
            label="Serial Number"
            placeholder="Enter serial number"
            value={formData.serialNumber || ""}
            onChange={(event) => {
              const value = event.currentTarget.value;
              setFormData((prev) => ({
                ...prev,
                serialNumber: value,
              }));
            }}
            disabled={updateItemMutation.isPending}
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
                "&::placeholder": { color: "#999" },
              },
            }}
          />

          {/* Purchase Date */}
          <TextInput
            label="Purchase Date"
            placeholder="MM/DD/YYYY"
            type="date"
            value={formData.purchaseDate || ""}
            onChange={(event) => {
              const value = event.currentTarget.value;
              setFormData((prev) => ({
                ...prev,
                purchaseDate: value,
              }));
            }}
            disabled={updateItemMutation.isPending}
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
                "&::placeholder": { color: "#999" },
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
            disabled={updateItemMutation.isPending}
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
                "&::placeholder": { color: "#999" },
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
            disabled={updateItemMutation.isPending}
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
            disabled={updateItemMutation.isPending}
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
              },
            }}
          />

          {/* Error Display */}
          {updateItemMutation.isError && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="red"
              variant="light"
              radius="md"
            >
              {updateItemMutation.error?.message || "Failed to update item"}
            </Alert>
          )}

          {/* Action Buttons */}
          <Group justify="flex-end" gap="sm" pt="md">
            <Button
              variant="light"
              color="gray"
              onClick={handleClose}
              disabled={updateItemMutation.isPending}
              radius="md"
              size="md"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient"
              gradient={{ from: "red.6", to: "red.8" }}
              disabled={!formData.name?.trim() || updateItemMutation.isPending}
              loading={updateItemMutation.isPending}
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
