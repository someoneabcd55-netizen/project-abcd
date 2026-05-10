-- 1. Enable UUID helper
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Pages table (one row per logical page)
CREATE TABLE IF NOT EXISTS pages (
  id TEXT PRIMARY KEY,                       -- 'homepage', 'admissions', 'alumni'
  title TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Blocks table (core CMS)
CREATE TABLE IF NOT EXISTS blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id TEXT NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  order_position INT DEFAULT 0,
  type TEXT NOT NULL,                        -- 'hero','announcements','dual-section','text','image', etc.
  visible BOOLEAN DEFAULT TRUE,
  title TEXT,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blocks_page ON blocks(page_id);
CREATE INDEX IF NOT EXISTS idx_blocks_order_position ON blocks(order_position);

-- 4. Announcements
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  date DATE,
  visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Events
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date DATE,
  location TEXT,
  type TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Gallery (URL-based)
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  src TEXT NOT NULL,                    -- only URL
  alt TEXT,
  dataAiHint TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Team / Faculty
CREATE TABLE IF NOT EXISTS team (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT,
  department TEXT,
  email TEXT,
  expertise TEXT[],
  imageUrl TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Contact info (singleton)
CREATE TABLE IF NOT EXISTS contact_info (
  id INT PRIMARY KEY DEFAULT 1,
  generalPhone TEXT,
  generalEmail TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Footer content (singleton)
CREATE TABLE IF NOT EXISTS footer_content (
  id INT PRIMARY KEY DEFAULT 1,
  linkColumns JSONB,
  socialLinks JSONB,
  copyrightText TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Departments
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    shortDescription TEXT,
    longDescription TEXT,
    courses JSONB,
    researchAreas TEXT[],
    imageUrl TEXT,
    dataAiHint TEXT
);

-- 11. Activities
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    shortDescription TEXT,
    longDescription TEXT,
    faculty_department TEXT,
    courses JSONB,
    focusAreas TEXT[],
    imageUrl TEXT,
    dataAiHint TEXT
);

-- SEED DATA --

-- create homepage row if not exists
INSERT INTO pages (id, title, description)
VALUES ('homepage', 'Homepage', 'Site homepage')
ON CONFLICT (id) DO NOTHING;

-- sample hero block (order_position = 1)
INSERT INTO blocks (page_id, order_position, type, visible, title, data)
VALUES (
  'homepage',
  1,
  'hero',
  true,
  'Main Hero',
  jsonb_build_object(
    'imageUrl', 'https://klesnc.edu.in/wp-content/uploads/2023/10/banner-6.jpg',
    'title', 'G. V. Hallikeri College, Hosaritti',
    'subtitle', 'Fostering holistic development through quality education.',
    'primaryCta', jsonb_build_object('label','Apply Now','url','/admissions'),
    'secondaryCta', jsonb_build_object('label','Our Departments','url','/departments')
  )
) ON CONFLICT DO NOTHING;

INSERT INTO blocks (page_id, order_position, type, visible, title, data)
VALUES (
    'homepage',
    2,
    'announcements',
    true,
    'Announcements Section',
    '{"title": "Latest News & Announcements", "limit": 3}'
) ON CONFLICT DO NOTHING;

INSERT INTO blocks (page_id, order_position, type, visible, title, data)
VALUES (
    'homepage',
    3,
    'dual-section',
    true,
    'Events and Departments',
    '{}'
) ON CONFLICT DO NOTHING;


-- Seed departments
INSERT INTO departments (slug, name, shortDescription, longDescription, courses, researchAreas, imageUrl, dataAiHint) VALUES
('bachelor-of-commerce', 'Bachelor of Commerce', 'Fostering future leaders in business, finance, and enterprise.', 'The Bachelor of Commerce (B.Com) program provides a strong foundation in commerce and business. The curriculum covers a wide range of subjects including accounting, finance, economics, taxation, and business law, preparing students for careers in the corporate world and for higher studies.', '[{"id": "BCOM101", "name": "Financial Accounting", "description": "Fundamentals of accounting principles and practices."}, {"id": "BCOM201", "name": "Business Law", "description": "Understanding the legal framework governing businesses."}, {"id": "BCOM301", "name": "Corporate Taxation", "description": "Exploring direct and indirect taxes applicable to corporations."}]', '{"Corporate Finance", "Marketing Management", "Human Resource Management", "Entrepreneurship"}', 'https://picsum.photos/1200/800?random=3', 'business meeting'),
('bachelor-of-arts', 'Bachelor of Arts', 'Exploring human culture, society, and creative expression.', 'The Bachelor of Arts (B.A.) program offers a rich exploration of human expression, society, and experience. Through the study of literature, history, political science, and sociology, students develop invaluable skills in critical analysis, creative thinking, and effective communication, preparing them for diverse careers in civil services, journalism, and academia.', '[{"id": "BA101", "name": "History of India", "description": "A survey of Indian history from ancient to modern times."}, {"id": "BA201", "name": "Political Science Concepts", "description": "Introduction to key concepts in political theory."}, {"id": "BA301", "name": "Sociology & Society", "description": "Understanding the structure and functioning of society."}]', '{"Modern Indian History", "International Relations", "Social Stratification", "Kannada Literature"}', 'https://picsum.photos/1200/800?random=4', 'art gallery')
ON CONFLICT (slug) DO NOTHING;

-- Seed contact info
INSERT INTO contact_info (id, generalPhone, generalEmail, address) VALUES
(1, '+91 94489 19901', 'gvhc.hosaritti@gmail.com', 'G. V. Hallikeri College,
Hosaritti, Haveri,
Karnataka, 581110')
ON CONFLICT (id) DO NOTHING;


-- Seed footer content
INSERT INTO footer_content (id, linkColumns, socialLinks, copyrightText) VALUES
(1, 
    '[
        {"title": "Quick Links", "links": [
            {"text": "Admissions", "href": "/admissions"},
            {"text": "Departments", "href": "/departments"},
            {"text": "Faculty", "href": "/faculty"},
            {"text": "Events", "href": "/events"}
        ]},
        {"title": "Resources", "links": [
            {"text": "Gallery", "href": "/gallery"},
            {"text": "Contact Us", "href": "/contact"},
            {"text": "Student Portal", "href": "#"},
            {"text": "Library", "href": "#"}
        ]}
    ]',
    '[
        {"platform": "Facebook", "href": "https://facebook.com"},
        {"platform": "Twitter", "href": "https://twitter.com"},
        {"platform": "LinkedIn", "href": "https://linkedin.com"}
    ]',
    '© {year} G. V. Hallikeri College. All Rights Reserved.'
) ON CONFLICT (id) DO NOTHING;

-- Seed team members
INSERT INTO team (name, title, department, email, expertise, imageUrl) VALUES
('Dr. Suresh Kumar', 'Principal & Head of Commerce', 'Commerce', 's.kumar@gvhcollege.edu', '{"Financial Accounting", "Corporate Law", "Taxation"}', 'https://picsum.photos/200/200?random=1'),
('Prof. Priya Sharma', 'Associate Professor', 'Commerce', 'p.sharma@gvhcollege.edu', '{"Business Statistics", "Marketing Management", "Auditing"}', 'https://picsum.photos/200/200?random=2'),
('Dr. Ramesh Patil', 'Head of Arts', 'Arts', 'r.patil@gvhcollege.edu', '{"Indian History", "Political Science", "Sociology"}', 'https://picsum.photos/200/200?random=3'),
('Prof. Anita Desai', 'Assistant Professor', 'Arts', 'a.desai@gvhcollege.edu', '{"Kannada Literature", "Indian Constitution", "Economics"}', 'https://picsum.photos/200/200?random=4')
ON CONFLICT DO NOTHING;
