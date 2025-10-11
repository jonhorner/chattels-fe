import React, { useState } from 'react';
import { Plus, Package } from 'lucide-react';
import { useItems, useCategories, useLocations } from '../hooks';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { AddItemModal } from '../components/AddItemModal';

export const ItemsPage: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: itemsData, isLoading: itemsLoading, error: itemsError } = useItems({ page, limit });
  const { data: categoriesData } = useCategories({ limit: 100 }); // Get all categories for lookup
  const { data: locationsData } = useLocations({ limit: 100 }); // Get all locations for lookup

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

  if (itemsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (itemsError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg">Error loading items</div>
        <div className="text-gray-500 mt-2">{itemsError.message}</div>
      </div>
    );
  }

  const items = itemsData?.data || [];
  const pagination = itemsData?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Items</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Item</span>
        </button>
      </div>


      {items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding your first item.</p>
        </div>
      ) : (
        <>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {items.map((item) => {
                const category = item.categoryId ? categoriesMap.get(item.categoryId) : null;
                const location = item.locationId ? locationsMap.get(item.locationId) : null;
                
                return (
                  <li key={item.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                          {item.value && (
                            <span className="text-green-600 font-semibold">
                              ${item.value.toFixed(2)}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-gray-500 mt-1">{item.description}</p>
                        )}
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          {category && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {category.name}
                            </span>
                          )}
                          {location && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {location.name}
                            </span>
                          )}
                          {item.updatedAt && (
                            <span>Updated: {item.updatedAt}</span>
                          )}
                        </div>
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
                );
              })}
            </ul>
          </div>

          {/* Pagination */}
          {pagination && pagination.total > limit && (
            <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6 rounded-lg shadow">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  disabled={page >= Math.ceil(pagination.total / limit)}
                  onClick={() => setPage(page + 1)}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(page * limit, pagination.total)}
                    </span>{' '}
                    of <span className="font-medium">{pagination.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage(page - 1)}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      disabled={page >= Math.ceil(pagination.total / limit)}
                      onClick={() => setPage(page + 1)}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
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
    </div>
  );
};
