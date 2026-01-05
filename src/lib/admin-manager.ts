import { supabase } from '../config/database';
import type { BlogPost } from '../types';

/**
 * Simplified admin manager for refactored code
 */
export class AdminManager {
  private allowedEmails: string[];

  constructor() {
    this.allowedEmails = import.meta.env.ALLOWED_ADMINS?.split(',') || ['bvislao95@gmail.com'];
  }

  /**
   * Check if email is allowed
   */
  private isAllowedEmail(email: string): boolean {
    return this.allowedEmails.includes(email.trim().toLowerCase());
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Auth error:', error);
      return null;
    }

    return data.user || null;
  }

  /**
   * Require authentication
   */
  async requireAuth(): Promise<boolean> {
    const user = await this.getCurrentUser();
    const email = user?.email;

    if (!email) {
      console.log('Not authenticated');
      return false;
    }

    if (!this.isAllowedEmail(email)) {
      await supabase.auth.signOut();
      console.log('Access denied for:', email);
      return false;
    }

    return true;
  }

  /**
   * Load blog posts
   */
  async loadBlogPosts() {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id,title,slug,published,updated_at,created_at')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error loading posts:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Load posts error:', err);
      return [];
    }
  }

  /**
   * Load single blog post
   */
  async loadBlogPost(id: string) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error loading post:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Load post error:', err);
      return null;
    }
  }

  /**
   * Create blog post
   */
  async createBlogPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'author_id'>) {
    try {
      const user = await this.getCurrentUser();
      
      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          ...post,
          author_id: user?.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating post:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Create post error:', err);
      return null;
    }
  }

  /**
   * Update blog post
   */
  async updateBlogPost(id: string, updates: Partial<BlogPost>) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating post:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Update post error:', err);
      return null;
    }
  }

  /**
   * Delete blog post
   */
  async deleteBlogPost(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting post:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Delete post error:', err);
      return false;
    }
  }

  /**
   * Generate URL-safe slug
   */
  static slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  /**
   * Sign in with OAuth
   */
  async signInWithOAuth(provider: 'google') {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/admin`
        }
      });

      if (error) {
        console.error('OAuth error:', error);
      }

      return { data, error };
    } catch (err) {
      console.error('OAuth error:', err);
      return { error: err };
    }
  }

  /**
   * Get current session
   */
  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session error:', error);
      }

      return session;
    } catch (err) {
      console.error('Session error:', err);
      return null;
    }
  }

  /**
   * Sign out
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  }
}

/**
 * Export singleton instance
 */
export const adminManager = new AdminManager();