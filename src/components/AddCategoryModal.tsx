import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { useCreateCategory } from '../hooks/useCategories';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const createCategoryMutation = useCreateCategory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;

    try {
      await createCategoryMutation.mutateAsync({ name: name.trim() });
      setName('');
      onClose();
    } catch (error) {
      // Error is handled by the mutation hook
      console.error('Failed to create category:', error);
    }
  };

  const handleClose = () => {
    setName('');
    createCategoryMutation.reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Category">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-2">
            Category Name
          </label>
          <input
            id="categoryName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={createCategoryMutation.isPending}
          />
        </div>

        {createCategoryMutation.isError && (
          <div className="text-red-600 text-sm">
            {createCategoryMutation.error?.message || 'Failed to create category'}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            disabled={createCategoryMutation.isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim() || createCategoryMutation.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {createCategoryMutation.isPending && <LoadingSpinner size="sm" />}
            <span>Add Category</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};