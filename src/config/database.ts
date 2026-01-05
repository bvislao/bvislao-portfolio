import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';

/**
 * Environment variable schema validation
 */
const envSchema = z.object({
  PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
});

/**
 * Parsed and validated environment variables
 */
export const env = envSchema.parse(import.meta.env);

/**
 * Centralized Supabase client instance
 * This ensures single instance across the application
 */
export const supabase: SupabaseClient = createClient(
  env.PUBLIC_SUPABASE_URL,
  env.PUBLIC_SUPABASE_ANON_KEY
);

/**
 * Database configuration
 */
export const dbConfig = {
  tables: {
    PROJECTS: 'projects',
    BLOG_POSTS: 'blog_posts',
    CONTACT_MESSAGES: 'contact_messages'
  },
  pageSize: {
    DEFAULT: 10,
    MAX: 100
  }
} as const;

/**
 * Application URLs
 */
export const appUrls = {
  get current() {
    return typeof window !== 'undefined' 
      ? window.location.origin 
      : import.meta.env.PUBLIC_SITE_URL || 'http://localhost:4321';
  },
  get admin() {
    return `${this.current}/admin`;
  },
  get api() {
    return `${this.current}/api`;
  }
} as const;

export type Env = z.infer<typeof envSchema>;