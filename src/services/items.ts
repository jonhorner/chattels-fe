import { api } from './api';
import type { 
  Item, 
  CreateItem, 
  UpdateItem, 
  PaginatedResponse, 
  PaginationParams 
} from '../types';

// Get all items with pagination
export const getItems = async (params?: PaginationParams): Promise<PaginatedResponse<Item>> => {
  const response = await api.get('/items', { params });
  return response.data;
};

// Get single item by ID
export const getItem = async (id: number): Promise<Item> => {
  const response = await api.get(`/items/${id}`);
  return response.data;
};

// Create new item
export const createItem = async (item: CreateItem): Promise<Item> => {
  const response = await api.post('/items', item);
  return response.data;
};

// Update existing item
export const updateItem = async (id: number, item: UpdateItem): Promise<Item> => {
  const response = await api.put(`/items/${id}`, item);
  return response.data;
};

// Delete item
export const deleteItem = async (id: number): Promise<void> => {
  await api.delete(`/items/${id}`);
};
