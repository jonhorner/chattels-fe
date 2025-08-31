import { api } from './api';
import type { 
  Location, 
  CreateLocation, 
  UpdateLocation, 
  PaginatedResponse, 
  PaginationParams 
} from '../types';

// Get all locations with pagination
export const getLocations = async (params?: PaginationParams): Promise<PaginatedResponse<Location>> => {
  const response = await api.get('/locations', { params });
  return response.data;
};

// Get single location by ID
export const getLocation = async (id: number): Promise<Location> => {
  const response = await api.get(`/locations/${id}`);
  return response.data;
};

// Create new location
export const createLocation = async (location: CreateLocation): Promise<Location> => {
  const response = await api.post('/locations', location);
  return response.data;
};

// Update existing location
export const updateLocation = async (id: number, location: UpdateLocation): Promise<Location> => {
  const response = await api.put(`/locations/${id}`, location);
  return response.data;
};

// Delete location
export const deleteLocation = async (id: number): Promise<void> => {
  await api.delete(`/locations/${id}`);
};
