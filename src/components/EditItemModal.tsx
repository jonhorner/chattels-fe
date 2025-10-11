import React, { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { useUpdateItem } from '../hooks/useItems';
import { useCategories, useLocations } from '../hooks';
import { LoadingSpinner } from './ui/LoadingSpinner';
import type { Item, UpdateItem } from '../types';

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item | null;
}

export const EditItemModal: React.FC<EditItemModalProps> = ({ isOpen, onClose, item }) => {
  const [formData, setFormData] = useState<UpdateItem>({
    name: '',
    description: '',
    value: undefined,
    categoryId: undefined,
    locationId: undefined,
  });

  const updateItemMutation = useUpdateItem();
  const { data: categoriesData } = useCategories({ limit: 100 });
  const { data: locationsData } = useLocations({ limit: 100 });

  // Update form data when item changes
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description || '',
        value: item.value,
        categoryId: item.categoryId,
        locationId: item.locationId,
      });
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!item || !formData.name?.trim()) return;

    try {
      // Convert string value to number if provided
      const itemData: UpdateItem = {
        ...formData,
        name: formData.name?.trim(),
        description: formData.description?.trim() || undefined,
        value: formData.value ? Number(formData.value) : undefined,
      };

      await updateItemMutation.mutateAsync({ id: item.id, item: itemData });
      handleClose();
    } catch (error) {
      console.error('Failed to update item:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      value: undefined,
      categoryId: undefined,
      locationId: undefined,
    });
    updateItemMutation.reset();
    onClose();
  };

  const handleInputChange = (field: keyof UpdateItem, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const categories = categoriesData?.data || [];
  const locations = locationsData?.data || [];

  if (!item) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Item">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="editItemName" className="block text-sm font-medium text-gray-700 mb-2">
            Name *
          </label>
          <input
            id="editItemName"
            type="text"
            value={formData.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter item name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={updateItemMutation.isPending}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="editItemDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="editItemDescription"
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter item description"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={updateItemMutation.isPending}
          />
        </div>

        {/* Value */}
        <div>
          <label htmlFor="editItemValue" className="block text-sm font-medium text-gray-700 mb-2">
            Value (£)
          </label>
          <input
            id="editItemValue"
            type="number"
            min="0"
            step="0.01"
            value={formData.value || ''}
            onChange={(e) => handleInputChange('value', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="Enter item value"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={updateItemMutation.isPending}
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="editItemCategory" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="editItemCategory"
            value={formData.categoryId || ''}
            onChange={(e) => handleInputChange('categoryId', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={updateItemMutation.isPending}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name || 'Unnamed Category'}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="editItemLocation" className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <select
            id="editItemLocation"
            value={formData.locationId || ''}
            onChange={(e) => handleInputChange('locationId', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={updateItemMutation.isPending}
          >
            <option value="">Select a location</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name || 'Unnamed Location'}
              </option>
            ))}
          </select>
        </div>

        {/* Error Display */}
        {updateItemMutation.isError && (
          <div className="text-red-600 text-sm">
            {updateItemMutation.error?.message || 'Failed to update item'}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            disabled={updateItemMutation.isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!formData.name?.trim() || updateItemMutation.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {updateItemMutation.isPending && <LoadingSpinner size="sm" />}
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
