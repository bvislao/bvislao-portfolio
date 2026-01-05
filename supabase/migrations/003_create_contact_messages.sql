-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  read boolean DEFAULT false
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages(read);

-- Enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow anyone to insert contact messages
CREATE POLICY "Anyone can submit contact messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- Allow only bvislao95@gmail.com to read messages
CREATE POLICY "Only admin can read contact messages" ON contact_messages
  FOR SELECT USING (auth.email() = 'bvislao95@gmail.com');

-- Allow only bvislao95@gmail.com to update messages (mark as read)
CREATE POLICY "Only admin can update contact messages" ON contact_messages
  FOR UPDATE USING (auth.email() = 'bvislao95@gmail.com');

-- Allow only bvislao95@gmail.com to delete messages
CREATE POLICY "Only admin can delete contact messages" ON contact_messages
  FOR DELETE USING (auth.email() = 'bvislao95@gmail.com');