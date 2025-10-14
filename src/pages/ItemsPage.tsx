import React, { useState } from 'react';
import { Plus, Package, Filter } from 'lucide-react';
import { useItems, useCategories, useLocations, useDeleteItem } from '../hooks';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { AddItemModal } from '../components/AddItemModal';
import { EditItemModal } from '../components/EditItemModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { ItemAttachments } from '../components/ItemAttachments';
import type { Item } from '../types';

export const ItemsPage: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const [expandedAttachments, setExpandedAttachments] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<number | undefined>(undefined);
  const [locationFilter, setLocationFilter] = useState<number | undefined>(undefined);
  const limit = 10;

  const { data: itemsData, isLoading: itemsLoading, error: itemsError } = useItems({ 
    page, 
    limit,
    categoryId: categoryFilter,
    locationId: locationFilter
  });
  const { data: categoriesData } = useCategories({ limit: 100 }); // Get all categories for lookup
  const { data: locationsData } = useLocations({ limit: 100 }); // Get all locations for lookup
  const deleteItemMutation = useDeleteItem();

  // Create lookup maps for efficient rendering
  const categoriesMap = React.useMemo(() => {
    if (!categoriesData?.data) {
      return new Map();
    }
    return new Map(categoriesData.data.map(cat => [cat.id, cat]));
  }, [categoriesData]);

  const locationsMap = React.useMemo(() => {
    if (!locationsData?.data) {
      return new Map();
    }
    return new Map(locationsData.data.map(loc => [loc.id, loc]));
  }, [locationsData]);

  // Derived state - must be before conditional returns
  const items = itemsData?.data || [];
  const pagination = itemsData?.pagination;
  const categories = categoriesData?.data || [];
  const locations = locationsData?.data || [];

  // Calculate total value of all items on current page
  const totalValue = React.useMemo(() => {
    return items.reduce((sum, item) => {
      return sum + (item.value || 0);
    }, 0);
  }, [items]);

  if (itemsLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-800 border border-red-600 rounded-lg shadow-lg">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (itemsError) {
    return (
      <div className="text-center py-12 bg-gray-800 border border-red-600 rounded-lg shadow-lg">
        <div className="text-red-400 text-lg">Error loading items</div>
        <div className="text-gray-400 mt-2">{itemsError.message}</div>
      </div>
    );
  }

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value ? Number(value) : undefined);
    setPage(1); // Reset to first page when filter changes
  };

  const handleLocationFilterChange = (value: string) => {
    setLocationFilter(value ? Number(value) : undefined);
    setPage(1); // Reset to first page when filter changes
  };

  const clearFilters = () => {
    setCategoryFilter(undefined);
    setLocationFilter(undefined);
    setPage(1);
  };

  const handleEditItem = (item: Item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedItem(null);
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

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
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

  const hasActiveFilters = categoryFilter !== undefined || locationFilter !== undefined;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Items</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Total Value Card */}
      <div className="bg-gray-800 border border-red-600 rounded-lg p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-300 mb-1">Total Value</p>
            <p className="text-3xl font-bold text-white">£{totalValue.toFixed(2)}</p>
            <p className="text-sm text-gray-400 mt-1">
              {items.length} {items.length === 1 ? 'item' : 'items'} on this page
            </p>
          </div>
          <div className="bg-red-600 rounded-full p-3 shadow-lg">
            <Package className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 border border-red-600 p-4 rounded-lg shadow-lg">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2 text-gray-300">
            <Filter className="h-5 w-5" />
            <span className="font-medium">Filters:</span>
          </div>
          
          {/* Category Filter */}
          <div className="flex-1 min-w-48">
            <select
              value={categoryFilter || ''}
              onChange={(e) => handleCategoryFilterChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name || 'Unnamed Category'}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div className="flex-1 min-w-48">
            <select
              value={locationFilter || ''}
              onChange={(e) => handleLocationFilterChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name || 'Unnamed Location'}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>


      {items.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 border border-red-600 rounded-lg shadow-lg">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-white">No items found</h3>
          <p className="mt-1 text-sm text-gray-400">Get started by adding your first item.</p>
        </div>
      ) : (
        <>
          {/* Modern Responsive Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => {
              const category = item.categoryId ? categoriesMap.get(item.categoryId) : null;
              const location = item.locationId ? locationsMap.get(item.locationId) : null;
              
              return (
                <div key={item.id} className="bg-gray-800 border border-red-600 rounded-lg shadow-lg card-hover transition-all">
                  <div className="p-5">
                    {/* Item Header */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-white mb-2 truncate">{item.name}</h3>
                      {item.value && (
                        <div className="inline-block bg-green-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                          £{item.value.toFixed(2)}
                        </div>
                      )}
                    </div>
                    
                    {/* Description */}
                    {item.description && (
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{item.description}</p>
                    )}
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {category && (
                        <span className="inline-block bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                          {category.name}
                        </span>
                      )}
                      {location && (
                        <span className="inline-block bg-gray-600 text-gray-200 text-xs px-2 py-1 rounded-full">
                          {location.name}
                        </span>
                      )}
                    </div>
                    
                    {/* Updated Date */}
                    {item.updatedAt && (
                      <p className="text-gray-400 text-xs mb-4">Updated: {item.updatedAt}</p>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t border-gray-700">
                      <button 
                        onClick={() => handleEditItem(item)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(item)}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium py-2 px-3 rounded transition-colors border border-gray-600"
                      >
                        Delete
                      </button>
                    </div>
                    
                    {/* Attachments Toggle */}
                    <button
                      onClick={() => toggleAttachments(item.id)}
                      className="w-full mt-2 text-gray-400 hover:text-white text-sm py-2 transition-colors"
                    >
                      {expandedAttachments.has(item.id) ? 'Hide' : 'Show'} Attachments
                    </button>
                  </div>
                  
                  {/* Attachments Section */}
                  {expandedAttachments.has(item.id) && (
                    <div className="border-t border-gray-700 bg-gray-900">
                      <ItemAttachments
                        itemId={item.id}
                        isExpanded={expandedAttachments.has(item.id)}
                        onToggle={() => toggleAttachments(item.id)}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination && pagination.total > limit && (
            <div className="flex items-center justify-between bg-gray-800 border border-red-600 px-4 py-3 rounded-lg shadow-lg">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="bg-gray-700 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  disabled={page >= Math.ceil(pagination.total / limit)}
                  onClick={() => setPage(page + 1)}
                  className="bg-gray-700 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-300">
                    Showing <span className="font-medium text-white">{(page - 1) * limit + 1}</span> to{' '}
                    <span className="font-medium text-white">
                      {Math.min(page * limit, pagination.total)}
                    </span>{' '}
                    of <span className="font-medium text-white">{pagination.total}</span> results
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="bg-gray-700 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    disabled={page >= Math.ceil(pagination.total / limit)}
                    onClick={() => setPage(page + 1)}
                    className="bg-gray-700 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      <AddItemModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      
      <EditItemModal 
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        item={selectedItem}
      />
      
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Item"
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteItemMutation.isPending}
      />
    </div>
  );
};
