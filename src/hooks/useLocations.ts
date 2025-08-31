import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { 
  CreateLocation, 
  UpdateLocation, 
  PaginationParams 
} from '../types';
import { 
  getLocations, 
  getLocation, 
  createLocation, 
  updateLocation, 
  deleteLocation 
} from '../services/locations';

// Hook for fetching paginated locations
export const useLocations = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['locations', params],
    queryFn: () => getLocations(params),
  });
};

// Hook for fetching a single location
export const useLocation = (id: number) => {
  return useQuery({
    queryKey: ['locations', id],
    queryFn: () => getLocation(id),
    enabled: !!id,
  });
};

// Hook for creating locations
export const useCreateLocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (location: CreateLocation) => createLocation(location),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });
};

// Hook for updating locations
export const useUpdateLocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, location }: { id: number; location: UpdateLocation }) => 
      updateLocation(id, location),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      queryClient.setQueryData(['locations', variables.id], data);
    },
  });
};

// Hook for deleting locations
export const useDeleteLocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => deleteLocation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });
};
