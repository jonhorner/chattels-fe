import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { useCreateItem } from '../hooks/useItems';
import { useCategories, useLocations } from '../hooks';
import { LoadingSpinner } from './ui/LoadingSpinner';
import type { CreateItem } from '../types';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<CreateItem>({
    name: '',
    description: '',
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
      // Convert string value to number if provided
      const itemData: CreateItem = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
        value: formData.value ? Number(formData.value) : undefined,
      };

      await createItemMutation.mutateAsync(itemData);
      handleClose();
    } catch (error) {
      console.error('Failed to create item:', error);
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
    createItemMutation.reset();
    onClose();
  };

  const handleInputChange = (field: keyof CreateItem, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const categories = categoriesData?.data || [];
  const locations = locationsData?.data || [];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Item">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-2">
            Name *
          </label>
          <input
            id="itemName"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter item name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={createItemMutation.isPending}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="itemDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="itemDescription"
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter item description"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={createItemMutation.isPending}
          />
        </div>

        {/* Value */}
        <div>
          <label htmlFor="itemValue" className="block text-sm font-medium text-gray-700 mb-2">
            Value ($)
          </label>
          <input
            id="itemValue"
            type="number"
            min="0"
            step="0.01"
            value={formData.value || ''}
            onChange={(e) => handleInputChange('value', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="Enter item value"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={createItemMutation.isPending}
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="itemCategory" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="itemCategory"
            value={formData.categoryId || ''}
            onChange={(e) => handleInputChange('categoryId', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={createItemMutation.isPending}
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
          <label htmlFor="itemLocation" className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <select
            id="itemLocation"
            value={formData.locationId || ''}
            onChange={(e) => handleInputChange('locationId', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={createItemMutation.isPending}
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
        {createItemMutation.isError && (
          <div className="text-red-600 text-sm">
            {createItemMutation.error?.message || 'Failed to create item'}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            disabled={createItemMutation.isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!formData.name.trim() || createItemMutation.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {createItemMutation.isPending && <LoadingSpinner size="sm" />}
            <span>Add Item</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};