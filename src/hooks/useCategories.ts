import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { 
  Category, 
  CreateCategory, 
  UpdateCategory, 
  PaginationParams 
} from '../types';
import { 
  getCategories, 
  getCategory, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../services/categories';

// Hook for fetching paginated categories
export const useCategories = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => getCategories(params),
  });
};

// Hook for fetching a single category
export const useCategory = (id: number) => {
  return useQuery({
    queryKey: ['categories', id],
    queryFn: () => getCategory(id),
    enabled: !!id,
  });
};

// Hook for creating categories
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (category: CreateCategory) => createCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

// Hook for updating categories
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, category }: { id: number; category: UpdateCategory }) => 
      updateCategory(id, category),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.setQueryData(['categories', variables.id], data);
    },
  });
};

// Hook for deleting categories
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};
