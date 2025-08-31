import React, { useState } from 'react';
import { Plus, FolderOpen } from 'lucide-react';
import { useCategories } from '../hooks';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const CategoriesPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: categoriesData, isLoading, error } = useCategories({ page, limit });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg">Error loading categories</div>
        <div className="text-gray-500 mt-2">{error.message}</div>
      </div>
    );
  }

  const categories = categoriesData?.data || [];
  const pagination = categoriesData?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding your first category.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {categories.map((category) => (
              <li key={category.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{category.name || 'Unnamed Category'}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-900 text-sm font-medium">
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
