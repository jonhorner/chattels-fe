import { api } from './api';
import type { 
  Category, 
  CreateCategory, 
  UpdateCategory, 
  PaginatedResponse, 
  PaginationParams 
} from '../types';

// Get all categories with pagination
export const getCategories = async (params?: PaginationParams): Promise<PaginatedResponse<Category>> => {
  const response = await api.get('/categories', { params });
  return response.data;
};

// Get single category by ID
export const getCategory = async (id: number): Promise<Category> => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

// Create new category
export const createCategory = async (category: CreateCategory): Promise<Category> => {
  const response = await api.post('/categories', category);
  return response.data;
};

// Update existing category
export const updateCategory = async (id: number, category: UpdateCategory): Promise<Category> => {
  const response = await api.put(`/categories/${id}`, category);
  return response.data;
};

// Delete category
export const deleteCategory = async (id: number): Promise<void> => {
  await api.delete(`/categories/${id}`);
};
