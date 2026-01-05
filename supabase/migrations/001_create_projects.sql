-- Projects table for managing portfolio projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  badge TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  highlights TEXT[] DEFAULT '{}',
  stack TEXT[] DEFAULT '{}',
  links JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'draft')),
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated users can read
CREATE POLICY "Anyone can read active projects" ON projects
  FOR SELECT USING (status = 'active');

-- Policy: Only allowed user can insert/update/delete
CREATE POLICY "Only allowed user can manage projects" ON projects
  FOR ALL USING (
    auth.uid() = author_id OR 
    auth.jwt() ->> 'email' = 'bvislao95@gmail.com'
  );

-- Indexes for performance
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_projects_sort_order ON projects(sort_order);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_projects_updated_at 
  BEFORE UPDATE ON projects 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO projects (name, badge, tagline, description, highlights, stack, links, status, featured, sort_order, author_id) VALUES
(
  'PAYKI',
  'Proyecto final (UTP)',
  'PWA de pagos de transporte público (Perú)',
  'PWA para pagos en transporte público: el conductor genera QR, el pasajero paga escaneando. Administración de operadores, flotas, vehículos, choferes, tarifas y notificaciones.',
  ARRAY['Supabase: Postgres + RLS, Auth, Edge Functions (Deno)', 'Next.js (PWA) consumiendo PostgREST/RPC/Edge Functions', 'Web Push (VAPID) para notificaciones'],
  ARRAY['Next.js', 'Supabase', 'Postgres', 'RLS', 'Edge Functions', 'Web Push'],
  '{"repo": "https://github.com/bvislao/payki"}',
  'active',
  true,
  1,
  (SELECT id FROM auth.users WHERE email = 'bvislao95@gmail.com' LIMIT 1)
),
(
  'Anti-Phishing Perú',
  'Seguridad',
  'Extensión anti-phishing (Bancos & Financieras)',
  'Detecta señales de phishing en sitios que imitan a bancos/financieras del Perú. Alertas en página, badge y Modo Estricto que bloquea inputs sensibles en dominios no oficiales.',
  ARRAY['Heurísticas locales (sin enviar tus datos)', 'Detección: punycode/homógrafos, look-alike, forms a otro dominio', 'Modo Estricto: bloqueo temporal de inputs sensibles'],
  ARRAY['Browser Extension', 'Heurísticas', 'Security UX'],
  '{"repo": "https://github.com/bvislao/antiphishing-peru-ext"}',
  'active',
  true,
  2,
  (SELECT id FROM auth.users WHERE email = 'bvislao95@gmail.com' LIMIT 1)
),
(
  'Aliases Git',
  'Utilidad',
  'Guía para productividad con alias en Git',
  'Guía práctica para configurar alias de Git y mejorar productividad en el día a día.',
  ARRAY['Atajos útiles', 'Buenas prácticas', 'Setup rápido'],
  ARRAY['Git'],
  '{"repo": "https://github.com/bvislao/aliases-git"}',
  'active',
  false,
  3,
  (SELECT id FROM auth.users WHERE email = 'bvislao95@gmail.com' LIMIT 1)
);