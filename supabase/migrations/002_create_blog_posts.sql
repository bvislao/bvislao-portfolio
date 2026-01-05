-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text NOT NULL,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  author_id text REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published) WHERE published = true;
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow public read access to published posts
CREATE POLICY "Published posts are viewable by everyone" ON blog_posts
  FOR SELECT USING (published = true);

-- Allow authenticated users to read their own drafts
CREATE POLICY "Users can view their own drafts" ON blog_posts
  FOR SELECT USING (
    auth.uid() = author_id OR
    (auth.email() = 'bvislao95@gmail.com')
  );

-- Allow only bvislao95@gmail.com to insert posts
CREATE POLICY "Only admin can insert posts" ON blog_posts
  FOR INSERT WITH CHECK (auth.email() = 'bvislao95@gmail.com');

-- Allow only bvislao95@gmail.com to update posts
CREATE POLICY "Only admin can update posts" ON blog_posts
  FOR UPDATE USING (auth.email() = 'bvislao95@gmail.com');

-- Allow only bvislao95@gmail.com to delete posts
CREATE POLICY "Only admin can delete posts" ON blog_posts
  FOR DELETE USING (auth.email() = 'bvislao95@gmail.com');

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER handle_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Function to automatically generate slug from title
CREATE OR REPLACE FUNCTION generate_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(NEW.title, '[^a-zA-Z0-9\s]', '', 'g'));
    NEW.slug := regexp_replace(NEW.slug, '\s+', '-', 'g');
    NEW.slug := regexp_replace(NEW.slug, '-+', '-', 'g');
    NEW.slug := trim(NEW.slug, '-');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically generate slug from title
CREATE TRIGGER generate_blog_post_slug
  BEFORE INSERT ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION generate_slug();