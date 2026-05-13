
-- Enable Row Level Security
alter table "storage"."objects" enable row level security;

-- Create Policies for public read access on storage
create policy "Public Read on public-assets"
on "storage"."objects" for select
using ( bucket_id = 'public-assets' );

-- Generic function to grant public read access to a table
create or replace function grant_public_read(table_name text)
returns void as $$
begin
  -- First, enable Row Level Security on the table
  execute format('alter table public.%I enable row level security', table_name);
  
  -- Drop the policy if it already exists
  execute format('drop policy if exists "Public Read on %I" on public.%I', table_name, table_name);

  -- Create a new policy for public read access (SELECT)
  execute format('create policy "Public Read on %I" on public.%I for select using (true)', table_name, table_name);
end;
$$ language plpgsql;

-- BLOCKS TABLE for dynamic homepage content
create table if not exists public.blocks (
    id uuid default gen_random_uuid() primary key,
    page_id text not null default 'homepage',
    parent_block uuid references public.blocks(id) on delete cascade,
    order_position integer not null default 0,
    type text not null,
    visible boolean not null default true,
    data jsonb,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now()
);
select grant_public_read('blocks');

-- Function to bulk update block order
create or replace function bulk_update_block_order(updates jsonb)
returns void as $$
declare
    item jsonb;
begin
    for item in select * from jsonb_array_elements(updates)
    loop
        update public.blocks
        set order_position = (item->>'order_position')::integer
        where id = (item->>'id')::uuid;
    end loop;
end;
$$ language plpgsql;

-- TEAM (FACULTY) TABLE
create table if not exists public.team (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    title text not null,
    department text not null,
    email text not null,
    expertise text[],
    "imageUrl" text,
    created_at timestamp with time zone not null default now()
);
select grant_public_read('team');

-- DEPARTMENTS TABLE
create table if not exists public.departments (
    id uuid default gen_random_uuid() primary key,
    slug text not null unique,
    name text not null,
    shortdescription text,
    longdescription text,
    courses jsonb,
    researchareas text[],
    imageurl text,
    dataaihint text
);
select grant_public_read('departments');

-- ACTIVITIES TABLE
create table if not exists public.activities (
    id uuid default gen_random_uuid() primary key,
    slug text not null unique,
    name text not null,
    shortdescription text,
    longdescription text,
    imageurl text,
    dataaihint text,
    faculty_department text,
    focusareas text[],
    courses jsonb
);
select grant_public_read('activities');

-- ANNOUNCEMENTS TABLE
create table if not exists public.announcements (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    description text,
    date date not null,
    created_at timestamp with time zone not null default now()
);
select grant_public_read('announcements');

-- EVENTS TABLE
create table if not exists public.events (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    date date not null,
    location text,
    type text,
    description text,
    created_at timestamp with time zone not null default now()
);
select grant_public_read('events');

-- GALLERY TABLE
create table if not exists public.gallery (
    id uuid default gen_random_uuid() primary key,
    src text not null,
    alt text,
    "dataAiHint" text,
    created_at timestamp with time zone not null default now()
);
select grant_public_read('gallery');

-- CONTACT INFO TABLE (SINGLETON)
create table if not exists public.contact_info (
    id text primary key,
    generalphone text,
    generalemail text,
    address text
);
select grant_public_read('contact_info');

-- FOOTER CONTENT TABLE (SINGLETON)
create table if not exists public.footer_content (
    id text primary key,
    content jsonb
);
select grant_public_read('footer_content');


-- SEED DATA --

-- Seed Homepage Blocks
insert into public.blocks(page_id, order_position, type, visible, data)
values
    ('homepage', 0, 'hero', true, '{"title": "Welcome to Modern School", "subtitle": "Excellence in Arts and Commerce Education since 2020.", "imageurl": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=6000", "primaryCta": {"label": "Apply Now", "url": "/admissions"}, "secondaryCta": {"label": "Our Programs", "url": "/departments"}}'),
    ('homepage', 1, 'announcements', true, '{"title": "College Announcements", "limit": 3}'),
    ('homepage', 2, 'dual-section', true, '{}')
on conflict do nothing;

-- Seed Team Members
insert into public.team (name, title, department, email, expertise, "imageUrl")
values
    ('Dr. Suresh Kumar', 'Principal & Head of Commerce', 'Commerce', 's.kumar@gvhcollege.edu', '{"Financial Accounting", "Corporate Law", "Taxation"}', 'https://picsum.photos/200/200?random=1'),
    ('Prof. Priya Sharma', 'Associate Professor', 'Commerce', 'p.sharma@gvhcollege.edu', '{"Business Statistics", "Marketing Management", "Auditing"}', 'https://picsum.photos/200/200?random=2'),
    ('Dr. Ramesh Patil', 'Head of Arts', 'Arts', 'r.patil@gvhcollege.edu', '{"Indian History", "Political Science", "Sociology"}', 'https://picsum.photos/200/200?random=3'),
    ('Prof. Anita Desai', 'Assistant Professor', 'Arts', 'a.desai@gvhcollege.edu', '{"Kannada Literature", "Indian Constitution", "Economics"}', 'https://picsum.photos/200/200?random=4')
on conflict do nothing;

-- Seed Departments
insert into public.departments (slug, name, shortdescription, longdescription, courses, researchareas, imageurl, dataaihint)
values
    ('bachelor-of-commerce', 'Bachelor of Commerce', 'Fostering future leaders in business, finance, and enterprise.', 'The Bachelor of Commerce (B.Com) program provides a strong foundation in commerce and business. The curriculum covers a wide range of subjects including accounting, finance, economics, taxation, and business law, preparing students for careers in the corporate world and for higher studies.', '[{"id": "BCOM101", "name": "Financial Accounting", "description": "Fundamentals of accounting principles and practices."}, {"id": "BCOM201", "name": "Business Law", "description": "Understanding the legal framework governing businesses."}, {"id": "BCOM301", "name": "Corporate Taxation", "description": "Exploring direct and indirect taxes applicable to corporations."}]', '{"Corporate Finance", "Marketing Management", "Human Resource Management", "Entrepreneurship"}', 'https://picsum.photos/1200/800?random=3', 'business meeting'),
    ('bachelor-of-arts', 'Bachelor of Arts', 'Exploring human culture, society, and creative expression.', 'The Bachelor of Arts (B.A.) program offers a rich exploration of human expression, society, and experience. Through the study of literature, history, political science, and sociology, students develop invaluable skills in critical analysis, creative thinking, and effective communication, preparing them for diverse careers in civil services, journalism, and academia.', '[{"id": "BA101", "name": "History of India", "description": "A survey of Indian history from ancient to modern times."}, {"id": "BA201", "name": "Political Science Concepts", "description": "Introduction to key concepts in political theory."}, {"id": "BA301", "name": "Sociology & Society", "description": "Understanding the structure and functioning of society."}]', '{"Modern Indian History", "International Relations", "Social Stratification", "Kannada Literature"}', 'https://picsum.photos/1200/800?random=4', 'art gallery')
on conflict (slug) do nothing;

-- Seed Announcements
insert into public.announcements (title, description, date)
values
    ('Admissions for 2024-2025 Open', 'Online applications for B.A. and B.Com courses are now available on the website.', '2024-05-15'),
    ('Annual Sports Day', 'Join us for a day of fun and competition at the college grounds.', '2024-08-20'),
    ('Guest Lecture on Indian Economy', 'Renowned economist Dr. Arjun Mehta will be speaking at our auditorium.', '2024-09-05')
on conflict do nothing;

-- Seed Events
insert into public.events (title, date, location, type, description)
values
    ('Independence Day Celebration', '2024-08-15', 'College Grounds', 'Extracurricular', 'Flag hoisting ceremony followed by cultural programs.'),
    ('Internal Assessment Exams', '2024-09-10', 'Respective Classrooms', 'Academic', 'Mid-term exams for all semesters.'),
    ('Inter-College Debate Competition', '2024-09-25', 'Main Auditorium', 'Extracurricular', 'Students from various colleges will compete for the championship trophy.')
on conflict do nothing;

-- Seed Gallery
insert into public.gallery (src, alt, "dataAiHint")
values
    ('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop', 'Students during a graduation ceremony', 'graduation ceremony'),
    ('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop', 'Students studying together in the library', 'students library'),
    ('https://images.unsplash.com/photo-1571260899104-6a16195e25f1?q=80&w=2070&auto=format&fit=crop', 'College main building exterior', 'college building'),
    ('https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1986&auto=format&fit=crop', 'A classroom lecture in progress', 'classroom lecture')
on conflict do nothing;

-- Seed Contact Info
insert into public.contact_info (id, generalphone, generalemail, address)
values
    ('singleton', '+91 94489 21783', 'gvhdegreecollege@gmail.com', 'Modern School,\nHosaritti, Haveri,\nKarnataka, 581110')
on conflict (id) do update set
    generalphone = excluded.generalphone,
    generalemail = excluded.generalemail,
    address = excluded.address;

-- Seed Footer Content
insert into public.footer_content (id, content)
values
    ('singleton', '{"copyrightText": "© {year} Modern School. All Rights Reserved.", "socialLinks": [{"platform": "Facebook", "url": "https://facebook.com"}, {"platform": "Instagram", "url": "https://instagram.com"}, {"platform": "YouTube", "url": "https://youtube.com"}], "linkColumns": [{"title": "Quick Links", "links": [{"label": "Admissions", "url": "/admissions"}, {"label": "Departments", "url": "/departments"}, {"label": "Faculty", "url": "/faculty"}, {"label": "Events", "url": "/events"}]}, {"title": "Resources", "links": [{"label": "Gallery", "url": "/gallery"}, {"label": "Contact Us", "url": "/contact"}, {"label": "Admin Login", "url": "/login"}]}]}')
on conflict (id) do update set
    content = excluded.content;

-- Seed Activities
insert into public.activities (slug, name, shortdescription, longdescription, imageurl, dataaihint, faculty_department, focusareas, courses)
values
('training', 'Parade & Training', 'Discipline and precision in every step.', 'Our core training includes drill, parade, weapon handling, and map reading. Cadets develop physical fitness, mental toughness, and impeccable discipline through weekly sessions led by experienced instructors.', 'https://images.unsplash.com/photo-1611868358452-9658c1561533?q=80&w=2070&auto=format&fit=crop', 'military parade', 'Instructors', '{"Drill & Marching", "Weapon Handling", "Map Reading", "Field Craft"}', '[{"name": "Basic Drill", "description": "Learning fundamental marching techniques and commands."}, {"name": "Rifle Training", "description": "Safe handling and firing of .22 rifles."}, {"name": "Navigation", "description": "Using maps and compasses for cross-country navigation."}]'),
('camps-adventures', 'Camps & Adventures', 'Building resilience and camaraderie.', 'Annual training camps are the highlight of the NCC experience. Cadets participate in trekking, rock climbing, and obstacle courses, fostering teamwork, leadership, and a spirit of adventure in challenging outdoor environments.', 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=2070&auto=format&fit=crop', 'adventure camp', 'ANO', '{"Trekking", "Rock Climbing", "Obstacle Course", "Survival Skills"}', '[{"name": "Annual Training Camp", "description": "A 10-day camp covering all major aspects of NCC training."}, {"name": "Trekking Expedition", "description": "Multi-day treks in scenic and challenging terrains."}, {"name": "Leadership Camp", "description": "Focused training to develop leadership and decision-making skills."}]'),
('social-service', 'Social Service', 'Service before self, for the community.', 'We are deeply committed to community service. Our cadets actively participate in blood donation drives, tree plantation campaigns, disaster relief efforts, and awareness programs on social issues, instilling a sense of civic duty.', 'https://images.unsplash.com/photo-1618423223687-f837d55ce8a2?q=80&w=1925&auto=format&fit=crop', 'community service', 'ANO', '{"Blood Donation", "Environmental Awareness", "Disaster Relief", "Community Health"}', '[{"name": "Blood Donation Drive", "description": "Organizing and participating in drives to support local blood banks."}, {"name": "Tree Plantation", "description": "Contributing to a greener environment through mass plantation events."}, {"name": "Swachh Bharat Abhiyan", "description": "Participating in cleanliness drives in the local community."}]')
on conflict (slug) do nothing;
