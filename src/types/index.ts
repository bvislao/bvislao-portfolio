/**
 * Project entity interface
 */
export interface Project {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  highlights: string[];
  stack: string[];
  links: ProjectLinks;
  status: ProjectStatus;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  author_id?: string;
}

/**
 * Blog post entity interface
 */
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  author_id?: string;
}

/**
 * Contact message entity interface
 */
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

/**
 * Project status options
 */
export type ProjectStatus = 'active' | 'archived' | 'draft';

/**
 * Blog post status options
 */
export type BlogPostStatus = 'draft' | 'published';

/**
 * Project links interface
 */
export interface ProjectLinks {
  repo?: string;
  demo?: string;
  website?: string;
  docs?: string;
  [key: string]: string | undefined;
}

/**
 * Database response type
 */
export interface DatabaseResponse<T> {
  data: T[];
  error: any | null;
  count?: number;
}

/**
 * Database single response type
 */
export interface DatabaseSingleResponse<T> {
  data: T;
  error: any | null;
}

/**
 * Paginated response type
 */
export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Sort options
 */
export interface SortOptions {
  column: string;
  ascending: boolean;
}

/**
 * Filter options
 */
export interface FilterOptions {
  search?: string;
  status?: ProjectStatus | BlogPostStatus;
  limit?: number;
  offset?: number;
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  page?: number;
  pageSize?: number;
}

/**
 * Database query options combining all options
 */
export interface QueryOptions extends FilterOptions, SortOptions, PaginationOptions {}

/**
 * Admin user interface
 */
export interface AdminUser {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  role: 'admin' | 'editor' | 'viewer';
}

/**
 * Session interface
 */
export interface UserSession {
  user: AdminUser;
  access_token: string;
  refresh_token: string;
  expires_at: string;
}

/**
 * File upload interface
 */
export interface FileUpload {
  file: File;
  path: string;
  onProgress?: (progress: number) => void;
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
}

/**
 * Navigation menu item
 */
export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  badge?: number | string;
  external?: boolean;
}

/**
 * Theme configuration
 */
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  accentColor: string;
}

/**
 * Site metadata
 */
export interface SiteMetadata {
  title: string;
  description: string;
  url: string;
  image?: string;
  keywords?: string[];
  author: string;
  twitter?: string;
  github?: string;
}