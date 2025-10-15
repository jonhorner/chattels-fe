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
  IconMapPin,
  IconEdit,
  IconTrash,
  IconAlertCircle,
} from '@tabler/icons-react';
import { useLocations, useDeleteLocation } from '../hooks';
import { AddLocationModalMantine } from '../components/AddLocationModalMantine';
import { EditLocationModalMantine } from '../components/EditLocationModalMantine';
import { ConfirmDialogMantine } from '../components/ConfirmDialogMantine';
import type { Location } from '../types';

export const LocationsPageMantine: React.FC = () => {
  const [page, setPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [locationToDelete, setLocationToDelete] = useState<Location | null>(null);
  const limit = 12;

  const { data: locationsData, isLoading, error } = useLocations({ page, limit });
  const deleteLocationMutation = useDeleteLocation();

  const locations = locationsData?.data || [];
  const pagination = locationsData?.pagination;

  if (isLoading) {
    return (
      <Center h={400}>
        <Stack align="center">
          <Loader size="xl" color="blue" />
          <Text size="lg" c="dimmed">Loading locations...</Text>
        </Stack>
      </Center>
    );
  }

  if (error) {
    return (
      <Alert variant="light" color="blue" title="Error loading locations" icon={<IconAlertCircle />}>
        {error.message}
      </Alert>
    );
  }

  const handleEditLocation = (location: Location) => {
    setSelectedLocation(location);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (location: Location) => {
    setLocationToDelete(location);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!locationToDelete) return;
    try {
      await deleteLocationMutation.mutateAsync(locationToDelete.id);
      setIsDeleteDialogOpen(false);
      setLocationToDelete(null);
    } catch (error) {
      console.error('Failed to delete location:', error);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setLocationToDelete(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedLocation(null);
  };

  return (
    <Stack gap="xl">
      {/* Header */}
      <Group justify="space-between" align="center">
        <Title order={1} size="h1" c="white">
          Locations
        </Title>
        <Button
          leftSection={<IconPlus size={20} />}
          onClick={() => setIsAddModalOpen(true)}
          size="lg"
          radius="md"
          variant="gradient"
          gradient={{ from: 'blue.4', to: 'blue.8' }}
        >
          Add Location
        </Button>
      </Group>

      {/* Locations Grid */}
      {locations.length === 0 ? (
        <Card shadow="lg" padding="xl" radius="lg" withBorder style={{
          background: 'linear-gradient(135deg, rgb(1, 13, 23) 0%, rgb(26, 26, 26) 100%)',
          border: '1px solid #92bbe3'
        }}>
          <Center py="xl">
            <Stack align="center" gap="md">
              <IconMapPin size={64} color="gray" />
              <Title order={3} c="white">No locations found</Title>
              <Text c="dimmed" size="lg">Get started by adding your first location.</Text>
            </Stack>
          </Center>
        </Card>
      ) : (
        <>
          {/* Responsive Card Grid */}
          <Grid gutter="lg">
            {locations.map((location) => (
              <Grid.Col key={location.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                <Card
                  shadow="xl"
                  padding="lg"
                  radius="lg"
                  withBorder
                  h="100%"
                  style={{
                    background: 'linear-gradient(135deg, rgb(1, 13, 23) 0%, rgb(26, 26, 26) 100%)',
                    border: '1px solid #92bbe3',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  className="card-hover"
                >
                  {/* Location Icon and Name */}
                  <Stack align="center" gap="md" h="100%" justify="space-between">
                    <Stack align="center" gap="sm" style={{ flex: 1 }} justify="center">
                      <ActionIcon
                        size={60}
                        radius="xl"
                        variant="gradient"
                        gradient={{ from: 'blue.4', to: 'blue.8' }}
                      >
                        <IconMapPin size={30} />
                      </ActionIcon>
                      
                      <Title 
                        order={4} 
                        size="h4" 
                        c="white" 
                        ta="center"
                        style={{ wordBreak: 'break-word' }}
                      >
                        {location.name || 'Unnamed Location'}
                      </Title>
                    </Stack>

                    {/* Action Buttons */}
                    <Group gap="xs" justify="center" w="100%">
                      <Button
                        leftSection={<IconEdit size={16} />}
                        variant="gradient"
                        gradient={{ from: 'blue.4', to: 'blue.8' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditLocation(location);
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
                          handleDeleteClick(location);
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
              background: 'linear-gradient(135deg, rgb(1, 13, 23) 0%, rgb(26, 26, 26) 100%)',
              border: '1px solid #92bbe3'
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
                  color="blue"
                  radius="md"
                  size="sm"
                />
              </Group>
            </Paper>
          )}
        </>
      )}

      {/* Modals */}
      <AddLocationModalMantine 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      
      <EditLocationModalMantine 
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        location={selectedLocation}
      />
      
      <ConfirmDialogMantine
        isOpen={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Location"
        message={`Are you sure you want to delete "${locationToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteLocationMutation.isPending}
      />
    </Stack>
  );
};