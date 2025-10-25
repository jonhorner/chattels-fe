import React, { useState, useEffect } from 'react';
import {
  Title,
  Button,
  Card,
  Text,
  Badge,
  Group,
  Stack,
  Grid,
  Select,
  Paper,
  Center,
  Loader,
  Alert,
  ActionIcon,
  Flex,
  Box,
  Divider,
  Pagination,
  NumberFormatter,
  TextInput,
} from '@mantine/core';
import {
  IconPlus,
  IconPackage,
  IconFilter,
  IconEdit,
  IconTrash,
  IconFilterX,
  IconChevronDown,
  IconChevronUp,
  IconAlertCircle,
  IconSearch,
  IconX,
  IconExternalLink,
  IconArrowUp,
  IconArrowDown,
} from '@tabler/icons-react';
import { useItems, useCategories, useLocations, useDeleteItem } from '../hooks';
import { AddItemModalMantine } from '../components/AddItemModalMantine';
import { EditItemModalMantine } from '../components/EditItemModalMantine';
import { ConfirmDialogMantine } from '../components/ConfirmDialogMantine';
import { ItemAttachmentsMantine } from '../components/ItemAttachmentsMantine';
import type { Item } from '../types';

export const ItemsPageMantine: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const [expandedAttachments, setExpandedAttachments] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const limit = 12;

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(1); // Reset to first page when search changes
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: itemsData, isLoading: itemsLoading, error: itemsError } = useItems({ 
    page, 
    limit,
    categoryId: categoryFilter ? Number(categoryFilter) : undefined,
    locationId: locationFilter ? Number(locationFilter) : undefined,
    search: debouncedSearchQuery || undefined
  });
  const { data: categoriesData } = useCategories({ limit: 100 });
  const { data: locationsData } = useLocations({ limit: 100 });
  const deleteItemMutation = useDeleteItem();

  const categoriesMap = React.useMemo(() => {
    if (!categoriesData?.data) return new Map();
    return new Map(categoriesData.data.map(cat => [cat.id, cat]));
  }, [categoriesData]);

  const locationsMap = React.useMemo(() => {
    if (!locationsData?.data) return new Map();
    return new Map(locationsData.data.map(loc => [loc.id, loc]));
  }, [locationsData]);

  let items = itemsData?.data || [];
  const pagination = itemsData?.pagination;
  const categories = categoriesData?.data || [];
  const locations = locationsData?.data || [];

  // Client-side sorting
  items = React.useMemo(() => {
    const sorted = [...items].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          break;
        case 'value':
          aValue = a.value || 0;
          bValue = b.value || 0;
          break;
        case 'purchaseDate':
          aValue = a.purchaseDate ? new Date(a.purchaseDate).getTime() : 0;
          bValue = b.purchaseDate ? new Date(b.purchaseDate).getTime() : 0;
          break;
        case 'updatedAt':
          aValue = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          bValue = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          break;
        case 'category':
          const aCat = a.categoryId ? categoriesMap.get(a.categoryId)?.name?.toLowerCase() : '';
          const bCat = b.categoryId ? categoriesMap.get(b.categoryId)?.name?.toLowerCase() : '';
          aValue = aCat || '';
          bValue = bCat || '';
          break;
        case 'location':
          const aLoc = a.locationId ? locationsMap.get(a.locationId)?.name?.toLowerCase() : '';
          const bLoc = b.locationId ? locationsMap.get(b.locationId)?.name?.toLowerCase() : '';
          aValue = aLoc || '';
          bValue = bLoc || '';
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [items, sortBy, sortOrder, categoriesMap, locationsMap]);

  const totalValue = React.useMemo(() => {
    return items.reduce((sum, item) => sum + (item.value || 0), 0);
  }, [items]);

  if (itemsLoading) {
    return (
      <Center h={400}>
        <Stack align="center">
          <Loader size="xl" color="blue" />
          <Text size="lg" c="dimmed">Loading items...</Text>
        </Stack>
      </Center>
    );
  }

  if (itemsError) {
    return (
      <Alert variant="light" color="blue" title="Error loading items" icon={<IconAlertCircle />}>
        {itemsError.message}
      </Alert>
    );
  }

  const handleEditItem = (item: Item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (item: Item) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteItemMutation.mutateAsync(itemToDelete.id);
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const toggleAttachments = (itemId: number) => {
    setExpandedAttachments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const clearFilters = () => {
    setCategoryFilter('');
    setLocationFilter('');
    setSearchQuery('');
    setSortBy('name');
    setSortOrder('asc');
    setPage(1);
  };

  const hasActiveFilters = categoryFilter !== '' || locationFilter !== '' || searchQuery !== '' || sortBy !== 'name' || sortOrder !== 'asc';

  const categoryOptions = categories.map(cat => ({
    value: cat.id.toString(),
    label: cat.name || 'Unnamed Category'
  }));

  const locationOptions = locations.map(loc => ({
    value: loc.id.toString(),
    label: loc.name || 'Unnamed Location'
  }));

  return (
    <Stack gap="xl">
      {/* Header */}
      <Group justify="space-between" align="center">
        <Title order={1} size="h1" c="white">
          Items
        </Title>
        <Button
          leftSection={<IconPlus size={20} />}
          onClick={() => setIsAddModalOpen(true)}
          size="lg"
          radius="md"
          variant="gradient"
          gradient={{ from: 'blue.4', to: 'blue.8' }}
        >
          Add Item
        </Button>
      </Group>

      {/* Total Value Card */}
      <Card shadow="xl" padding="xl" radius="lg" withBorder style={{ 
        background: 'linear-gradient(135deg, #010d17 0%, #1a1a1a 100%)',
        border: '1px solid #92bbe3'
      }}>
        <Group justify="space-between" align="center">
          <Box>
            <Text size="sm" c="dimmed" fw={500} mb={4}>
              Total Value
            </Text>
            <Title order={2} size="h1" c="white" mb={4}>
              <NumberFormatter prefix="£" value={totalValue} decimalScale={2} />
            </Title>
            <Text size="sm" c="dimmed">
              {items.length} {items.length === 1 ? 'item' : 'items'} on this page
            </Text>
          </Box>
          <ActionIcon
            size={80}
            radius="xl"
            variant="gradient"
            gradient={{ from: 'blue.4', to: 'blue.8' }}
          >
            <IconPackage size={40} />
          </ActionIcon>
        </Group>
      </Card>

      {/* Filters */}
      <Paper shadow="lg" radius="lg" p="lg" withBorder style={{
        background: 'linear-gradient(135deg, #010d17 0%, #1a1a1a 100%)',
        border: '1px solid #92bbe3'
      }}>
        <Stack gap="md">
          <Group gap="xs" c="dimmed">
            <IconFilter size={20} />
            <Text fw={500}>Search & Filters:</Text>
          </Group>
          
          {/* Search Input */}
          <TextInput
            placeholder="Search items by name or description..."
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
            }}
            leftSection={<IconSearch size={18} />}
            rightSection={
              searchQuery ? (
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  color="gray"
                  onClick={() => {
                    setSearchQuery('');
                    setPage(1);
                  }}
                >
                  <IconX size={16} />
                </ActionIcon>
              ) : null
            }
            radius="md"
            size="md"
            styles={{
              input: {
                backgroundColor: '#134168',
                borderColor: '#92bbe3',
                color: '#ffffff',
                '&:focus': {
                  borderColor: '#92bbe3',
                  boxShadow: '0 0 0 2px rgba(146, 187, 227, 0.2)',
                },
                '&::placeholder': {
                  color: '#b3d9ff',
                },
              },
              section: {
                color: '#92bbe3',
              },
            }}
          />
          
          <Group align="center" gap="md" wrap="wrap">
            <Select
            placeholder="All Categories"
            data={categoryOptions}
            value={categoryFilter}
            onChange={(value) => {
              setCategoryFilter(value || '');
              setPage(1);
            }}
            clearable
            style={{ minWidth: 200 }}
            radius="md"
            styles={{
              input: {
                backgroundColor: '#134168',
                borderColor: '#92bbe3',
                color: '#ffffff',
                '&:focus': {
                  borderColor: '#92bbe3',
                  boxShadow: '0 0 0 2px rgba(146, 187, 227, 0.2)',
                },
                '&::placeholder': {
                  color: '#b3d9ff',
                },
              },
              dropdown: {
                backgroundColor: '#134168',
                borderColor: '#92bbe3',
                border: '1px solid #92bbe3',
              },
              option: {
                color: '#ffffff',
              },
            }}
          />

          <Select
            placeholder="All Locations"
            data={locationOptions}
            value={locationFilter}
            onChange={(value) => {
              setLocationFilter(value || '');
              setPage(1);
            }}
            clearable
            style={{ minWidth: 200 }}
            radius="md"
            styles={{
              input: {
                backgroundColor: '#134168',
                borderColor: '#92bbe3',
                color: '#ffffff',
                '&:focus': {
                  borderColor: '#92bbe3',
                  boxShadow: '0 0 0 2px rgba(146, 187, 227, 0.2)',
                },
                '&::placeholder': {
                  color: '#b3d9ff',
                },
              },
              dropdown: {
                backgroundColor: '#134168',
                borderColor: '#92bbe3',
                border: '1px solid #92bbe3',
              },
              option: {
                color: '#ffffff',
              },
            }}
          />

          <Select
            placeholder="Sort by"
            data={[
              { value: 'name', label: 'Name' },
              { value: 'value', label: 'Value' },
              { value: 'purchaseDate', label: 'Purchase Date' },
              { value: 'updatedAt', label: 'Updated Date' },
              { value: 'category', label: 'Category' },
              { value: 'location', label: 'Location' },
            ]}
            value={sortBy}
            onChange={(value) => setSortBy(value || 'name')}
            style={{ minWidth: 180 }}
            radius="md"
            styles={{
              input: {
                backgroundColor: '#134168',
                borderColor: '#92bbe3',
                color: '#ffffff',
                '&:focus': {
                  borderColor: '#92bbe3',
                  boxShadow: '0 0 0 2px rgba(146, 187, 227, 0.2)',
                },
                '&::placeholder': {
                  color: '#b3d9ff',
                },
              },
              dropdown: {
                backgroundColor: '#134168',
                borderColor: '#92bbe3',
                border: '1px solid #92bbe3',
              },
              option: {
                color: '#ffffff',
              },
            }}
          />

          <ActionIcon
            size="lg"
            variant="light"
            color="blue"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            radius="md"
            title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          >
            {sortOrder === 'asc' ? <IconArrowUp size={20} /> : <IconArrowDown size={20} />}
          </ActionIcon>

          {hasActiveFilters && (
            <Button
              leftSection={<IconFilterX size={16} />}
              variant="light"
              color="blue"
              onClick={clearFilters}
              radius="md"
            >
              Clear All
            </Button>
          )}
          </Group>
        </Stack>
      </Paper>

      {/* Items Grid */}
      {items.length === 0 ? (
        <Card shadow="lg" padding="xl" radius="lg" withBorder style={{
          background: 'linear-gradient(135deg, #010d17 0%, #1a1a1a 100%)',
          border: '1px solid #92bbe3'
        }}>
          <Center py="xl">
            <Stack align="center" gap="md">
              <IconPackage size={64} color="gray" />
              <Title order={3} c="white">No items found</Title>
              <Text c="dimmed" size="lg">Get started by adding your first item.</Text>
            </Stack>
          </Center>
        </Card>
      ) : (
        <>
          <Grid gutter="lg">
            {items.map((item) => {
              const category = item.categoryId ? categoriesMap.get(item.categoryId) : null;
              const location = item.locationId ? locationsMap.get(item.locationId) : null;
              
              return (
                <Grid.Col key={item.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
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
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 20px 40px rgba(146, 187, 227, 0.3)',
                      }
                    }}
                  >
                    <Card.Section inheritPadding py="xs">
                      <Group justify="space-between" align="flex-start">
                        <Title order={4} size="h4" c="white" lineClamp={2} style={{ flex: 1 }}>
                          {item.name}
                        </Title>
                        {item.value && (
                          <Badge
                            variant="gradient"
                            gradient={{ from: 'green.6', to: 'green.8' }}
                            size="lg"
                            radius="xl"
                          >
                            £{item.value.toFixed(2)}
                          </Badge>
                        )}
                      </Group>
                    </Card.Section>

                    {item.description && (
                      <>
                        <Text size="sm" c="dimmed" lineClamp={2} mt="sm">
                          {item.description}
                        </Text>
                        <Divider my="sm" color="dark.4" />
                      </>
                    )}

                    {(category || location || item.url) && (
                      <Group gap="xs" mt="sm">
                        {category && (
                          <Badge variant="light" color="blue" size="sm">
                            {category.name}
                          </Badge>
                        )}
                        {location && (
                          <Badge variant="light" color="gray" size="sm">
                            {location.name}
                          </Badge>
                        )}
                        {item.url && (
                          <ActionIcon
                            component="a"
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="light"
                            color="blue"
                            size="sm"
                            title="Open URL"
                          >
                            <IconExternalLink size={16} />
                          </ActionIcon>
                        )}
                      </Group>
                    )}

                    {item.serialNumber && (
                      <Text size="xs" c="dimmed" mt="sm" style={{ fontFamily: 'monospace' }}>
                        S/N: {item.serialNumber}
                      </Text>
                    )}

                    {item.purchaseDate && (
                      <Text size="xs" c="dimmed" mt="sm">
                        Purchased: {item.purchaseDate}
                      </Text>
                    )}

                    {item.updatedAt && (
                      <Text size="xs" c="dimmed" mt="sm">
                        Updated: {item.updatedAt}
                      </Text>
                    )}

                    <Divider my="md" color="dark.4" />

                    <Group gap="xs" grow>
                      <Button
                        leftSection={<IconEdit size={16} />}
                        variant="gradient"
                        gradient={{ from: 'blue.4', to: 'blue.8' }}
                        onClick={() => handleEditItem(item)}
                        size="sm"
                        radius="md"
                      >
                        Edit
                      </Button>
                      <Button
                        leftSection={<IconTrash size={16} />}
                        variant="light"
                        color="gray"
                        onClick={() => handleDeleteClick(item)}
                        size="sm"
                        radius="md"
                      >
                        Delete
                      </Button>
                    </Group>

                    <Button
                      fullWidth
                      variant="subtle"
                      color="blue"
                      size="sm"
                      mt="xs"
                      rightSection={
                        expandedAttachments.has(item.id) ? 
                        <IconChevronUp size={16} /> : 
                        <IconChevronDown size={16} />
                      }
                      onClick={() => toggleAttachments(item.id)}
                      styles={{
                        root: {
                          color: '#92bbe3',
                          '&:hover': {
                            backgroundColor: 'rgba(146, 187, 227, 0.1)',
                          },
                        },
                      }}
                    >
                      {expandedAttachments.has(item.id) ? 'Hide' : 'Show'} Attachments
                    </Button>

                    {expandedAttachments.has(item.id) && (
                      <Card.Section mt="md" pt="md" style={{ borderTop: '1px solid #2d2d2d' }}>
                        <ItemAttachmentsMantine
                          itemId={item.id}
                          isExpanded={expandedAttachments.has(item.id)}
                          onToggle={() => toggleAttachments(item.id)}
                        />
                      </Card.Section>
                    )}
                  </Card>
                </Grid.Col>
              );
            })}
          </Grid>

          {/* Pagination */}
          {pagination && pagination.total > limit && (
            <Paper shadow="lg" radius="lg" p="lg" withBorder style={{
              background: 'linear-gradient(135deg, #010d17 0%, #1a1a1a 100%)',
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
      <AddItemModalMantine 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      
      <EditItemModalMantine 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
      />
      
      <ConfirmDialogMantine
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Item"
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteItemMutation.isPending}
      />
    </Stack>
  );
};