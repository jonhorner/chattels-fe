import React, { useState } from 'react';
import {
  Title,
  Button,
  Card,
  Text,
  Group,
  Stack,
  Grid,
  Paper,
  Center,
  Loader,
  Alert,
  ActionIcon,
  Pagination,
} from '@mantine/core';
import {
  IconPlus,
  IconFolder,
  IconEdit,
  IconTrash,
  IconAlertCircle,
} from '@tabler/icons-react';
import { useCategories, useDeleteCategory } from '../hooks';
import { AddCategoryModalMantine } from '../components/AddCategoryModalMantine';
import { EditCategoryModalMantine } from '../components/EditCategoryModalMantine';
import { ConfirmDialogMantine } from '../components/ConfirmDialogMantine';
import type { Category } from '../types';

export const CategoriesPageMantine: React.FC = () => {
  const [page, setPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const limit = 12;

  const { data: categoriesData, isLoading, error } = useCategories({ page, limit });
  const deleteCategoryMutation = useDeleteCategory();

  const categories = categoriesData?.data || [];
  const pagination = categoriesData?.pagination;

  if (isLoading) {
    return (
      <Center h={400}>
        <Stack align="center">
          <Loader size="xl" color="red" />
          <Text size="lg" c="dimmed">Loading categories...</Text>
        </Stack>
      </Center>
    );
  }

  if (error) {
    return (
      <Alert variant="light" color="red" title="Error loading categories" icon={<IconAlertCircle />}>
        {error.message}
      </Alert>
    );
  }

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategoryMutation.mutateAsync(categoryToDelete.id);
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCategory(null);
  };

  return (
    <Stack gap="xl">
      {/* Header */}
      <Group justify="space-between" align="center">
        <Title order={1} size="h1" c="white">
          Categories
        </Title>
        <Button
          leftSection={<IconPlus size={20} />}
          onClick={() => setIsAddModalOpen(true)}
          size="lg"
          radius="md"
          variant="gradient"
          gradient={{ from: 'red.6', to: 'red.8' }}
        >
          Add Category
        </Button>
      </Group>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <Card shadow="lg" padding="xl" radius="lg" withBorder style={{
          background: 'linear-gradient(135deg, #2d1b1b 0%, #1a1a1a 100%)',
          border: '1px solid #e03131'
        }}>
          <Center py="xl">
            <Stack align="center" gap="md">
              <IconFolder size={64} color="gray" />
              <Title order={3} c="white">No categories found</Title>
              <Text c="dimmed" size="lg">Get started by adding your first category.</Text>
            </Stack>
          </Center>
        </Card>
      ) : (
        <>
          {/* Responsive Card Grid */}
          <Grid gutter="lg">
            {categories.map((category) => (
              <Grid.Col key={category.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                <Card
                  shadow="xl"
                  padding="lg"
                  radius="lg"
                  withBorder
                  h="100%"
                  style={{
                    background: 'linear-gradient(135deg, #2d1b1b 0%, #1a1a1a 100%)',
                    border: '1px solid #e03131',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  className="card-hover"
                >
                  {/* Category Icon and Name */}
                  <Stack align="center" gap="md" h="100%" justify="space-between">
                    <Stack align="center" gap="sm" style={{ flex: 1 }} justify="center">
                      <ActionIcon
                        size={60}
                        radius="xl"
                        variant="gradient"
                        gradient={{ from: 'red.6', to: 'red.8' }}
                      >
                        <IconFolder size={30} />
                      </ActionIcon>
                      
                      <Title 
                        order={4} 
                        size="h4" 
                        c="white" 
                        ta="center"
                        style={{ wordBreak: 'break-word' }}
                      >
                        {category.name || 'Unnamed Category'}
                      </Title>
                    </Stack>

                    {/* Action Buttons */}
                    <Group gap="xs" justify="center" w="100%">
                      <Button
                        leftSection={<IconEdit size={16} />}
                        variant="gradient"
                        gradient={{ from: 'red.6', to: 'red.8' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCategory(category);
                        }}
                        size="sm"
                        radius="md"
                        flex={1}
                      >
                        Edit
                      </Button>
                      <Button
                        leftSection={<IconTrash size={16} />}
                        variant="light"
                        color="gray"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(category);
                        }}
                        size="sm"
                        radius="md"
                        flex={1}
                      >
                        Delete
                      </Button>
                    </Group>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>

          {/* Pagination */}
          {pagination && pagination.total > limit && (
            <Paper shadow="lg" radius="lg" p="lg" withBorder style={{
              background: 'linear-gradient(135deg, #2d1b1b 0%, #1a1a1a 100%)',
              border: '1px solid #e03131'
            }}>
              <Group justify="space-between" align="center">
                <Text size="sm" c="dimmed">
                  Showing <strong>{(page - 1) * limit + 1}</strong> to{' '}
                  <strong>{Math.min(page * limit, pagination.total)}</strong> of{' '}
                  <strong>{pagination.total}</strong> results
                </Text>
                
                <Pagination
                  value={page}
                  onChange={setPage}
                  total={Math.ceil(pagination.total / limit)}
                  color="red"
                  radius="md"
                  size="sm"
                />
              </Group>
            </Paper>
          )}
        </>
      )}

      {/* Modals */}
      <AddCategoryModalMantine 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      
      <EditCategoryModalMantine 
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        category={selectedCategory}
      />
      
      <ConfirmDialogMantine
        isOpen={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteCategoryMutation.isPending}
      />
    </Stack>
  );
};