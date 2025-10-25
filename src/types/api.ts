// Base entity types matching the API schema
export interface User {
  ID: number;
  name?: string;
}

export interface Category {
  id: number;
  name?: string;
}

export interface Location {
  id: number;
  name?: string;
}

export interface Item {
  id: number;
  name: string;
  description?: string;
  value?: number;
  locationId?: number;
  categoryId?: number;
  url?: string;
  serialNumber?: string;
  purchaseDate?: string;
  updatedAt?: string;
}

export interface Attachment {
  id: number;
  itemId: number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  uploadedAt: string;
}

// Create/Update types (for POST/PUT requests)
export interface CreateUser {
  name?: string;
}

export interface UpdateUser {
  name?: string;
}

export interface CreateCategory {
  name?: string;
}

export interface UpdateCategory {
  name?: string;
}

export interface CreateLocation {
  name?: string;
}

export interface UpdateLocation {
  name?: string;
}

export interface CreateItem {
  name: string;
  description?: string;
  value?: number;
  locationId?: number;
  categoryId?: number;
  url?: string;
  serialNumber?: string;
  purchaseDate?: string;
  updatedAt?: string;
}

export interface UpdateItem {
  name?: string;
  description?: string;
  value?: number;
  locationId?: number;
  categoryId?: number;
  url?: string;
  serialNumber?: string;
  purchaseDate?: string;
  updatedAt?: string;
}

// API Response types
export interface ApiError {
  error: string;
  message?: string;
  details?: any;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

// Query parameters for list endpoints
export interface PaginationParams {
  page?: number;
  limit?: number;
  categoryId?: number;
  locationId?: number;
  search?: string;
}

// Extended item type with populated relations (for display purposes)
export interface ItemWithRelations extends Item {
  category?: Category;
  location?: Location;
}
