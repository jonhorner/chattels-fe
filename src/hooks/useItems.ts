import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { 
  Item, 
  CreateItem, 
  UpdateItem, 
  PaginationParams 
} from '../types';
import { 
  getItems, 
  getItem, 
  createItem, 
  updateItem, 
  deleteItem 
} from '../services/items';

// Hook for fetching paginated items
export const useItems = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['items', params],
    queryFn: () => getItems(params),
  });
};

// Hook for fetching a single item
export const useItem = (id: number) => {
  return useQuery({
    queryKey: ['items', id],
    queryFn: () => getItem(id),
    enabled: !!id,
  });
};

// Hook for creating items
export const useCreateItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (item: CreateItem) => createItem(item),
    onSuccess: () => {
      // Invalidate and refetch items list
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};

// Hook for updating items
export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, item }: { id: number; item: UpdateItem }) => 
      updateItem(id, item),
    onSuccess: (data, variables) => {
      // Invalidate list and update individual item cache
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.setQueryData(['items', variables.id], data);
    },
  });
};

// Hook for deleting items
export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => deleteItem(id),
    onSuccess: () => {
      // Invalidate items list
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};
