import type { Activity } from './activities';
import type { AppEvent } from './events';
import type { Department } from './departments';
import type { FooterContent } from './footer';
import type { GlimpsesImage } from './glimpses';
import type { Page } from './pages';
import type { TeamMember } from './team';
import type { ContactInfo } from './contact';

export function shouldUseFallbackData() {
  return process.env.NEXT_PHASE === 'phase-production-build' || process.env.npm_lifecycle_event === 'build';
}

export const fallbackPages: Page[] = [
  { id: 'fallback-home', slug: 'home', title: 'Home', visible: true, order_position: 0, description: 'NCC Troop home page.' },
  { id: 'fallback-departments', slug: 'departments', title: 'Departments', visible: true, order_position: 1, description: 'Academic departments.' },
  { id: 'fallback-activities', slug: 'activities', title: 'Activities', visible: true, order_position: 2, description: 'NCC activities and training.' },
  { id: 'fallback-faculty', slug: 'faculty', title: 'Faculty', visible: true, order_position: 3, description: 'Faculty and NCC team.' },
  { id: 'fallback-admissions', slug: 'admissions', title: 'Admissions', visible: true, order_position: 4, description: 'Admissions and joining information.' },
  { id: 'fallback-events', slug: 'events', title: 'Events', visible: true, order_position: 6, description: 'Events and calendar.' },
  { id: 'fallback-Glimpses', slug: 'glimpses', title: 'Glimpses', visible: true, order_position: 7, description: 'Campus Glimpses.' },
  { id: 'fallback-contact', slug: 'contact', title: 'Contact', visible: true, order_position: 8, description: 'Contact information.' },
];

export const fallbackDepartments: Department[] = [
  {
    id: 'fallback-commerce',
    slug: 'bachelor-of-commerce',
    name: 'Bachelor of Commerce',
    shortdescription: 'A commerce program focused on accounting, finance, taxation, and business practice.',
    longdescription: 'The Bachelor of Commerce department prepares students for careers in accounting, financial services, entrepreneurship, and public administration through strong fundamentals and practical learning.',
    courses: [
      { id: 'COM-101', name: 'Financial Accounting', description: 'Foundations of accounting, statements, and business records.' },
      { id: 'COM-201', name: 'Business Management', description: 'Principles of management, enterprise, and organizational practice.' },
    ],
    researchareas: ['Accounting', 'Finance', 'Taxation', 'Entrepreneurship'],
    imageurl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644',
    dataaihint: 'students classroom',
  },
  {
    id: 'fallback-arts',
    slug: 'bachelor-of-arts',
    name: 'Bachelor of Arts',
    shortdescription: 'A humanities program developing communication, civic awareness, and analytical thinking.',
    longdescription: 'The Bachelor of Arts department builds strong foundations in language, social science, history, and public life, helping students grow as thoughtful communicators and community leaders.',
    courses: [
      { id: 'ART-101', name: 'Communication Skills', description: 'Writing, speaking, and presentation skills for academic and public settings.' },
      { id: 'ART-201', name: 'Social Sciences', description: 'Study of society, governance, and contemporary public issues.' },
    ],
    researchareas: ['Communication', 'History', 'Civics', 'Social Service'],
    imageurl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f',
    dataaihint: 'library study',
  },
];

export const fallbackActivities: Activity[] = [
  {
    id: 'fallback-ncc',
    slug: 'ncc',
    name: 'National Cadet Corps',
    shortdescription: 'Leadership, discipline, service, fitness, and adventure through structured NCC training.',
    longdescription: 'The NCC unit trains cadets through parade, drill, camps, social service, leadership exercises, and certificate preparation. Cadets develop confidence, teamwork, discipline, and a spirit of national service.',
    faculty_department: 'ANO',
    courses: [
      { id: 'NCC-01', name: 'Drill and Parade', description: 'Regular drill practice, parade discipline, and ceremonial training.' },
      { id: 'NCC-02', name: 'Camps and Service', description: 'Participation in camps, community service, and outdoor leadership activities.' },
      { id: 'NCC-03', name: 'Certificate Preparation', description: 'Guidance for NCC certificate exams and cadet progression.' },
    ],
    focusareas: ['Leadership', 'Discipline', 'Fitness', 'Service'],
    imageurl: 'https://images.unsplash.com/photo-1599059813005-11265ba4b4ce',
    dataaihint: 'cadets training',
  },
];

export const fallbackTeamMembers: TeamMember[] = [
  {
    id: 'fallback-ano',
    name: 'NCC Officer',
    title: 'Associate NCC Officer',
    department: 'ANO',
    email: 'ncc@example.edu',
    expertise: ['Drill', 'Leadership', 'Cadet Training'],
    imageUrl: '',
  },
];

export const fallbackEvents: AppEvent[] = [
  {
    id: 'fallback-enrolment',
    title: 'NCC Enrolment Orientation',
    date: '2026-06-15',
    location: 'College Auditorium',
    type: 'Extracurricular',
    description: 'Orientation for students interested in joining the NCC unit.',
  },
];

export const fallbackGlimpsesImages: GlimpsesImage[] = [
  {
    id: 'fallback-Glimpses-1',
    src: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f',
    alt: 'Students studying on campus',
    dataAiHint: 'students campus',
    createdAt: new Date().toISOString(),
    order_position: 0,
  },
];

export const fallbackFooterContent: FooterContent = {
  linkColumns: [
    {
      title: 'Explore',
      links: [
        { label: 'Departments', url: '/departments' },
        { label: 'Activities', url: '/activities' },
        { label: 'Admissions', url: '/admissions' },
      ],
    },
  ],
  socialLinks: [],
  copyrightText: `© ${new Date().getFullYear()} NCC Troop. All Rights Reserved.`,
};

export const fallbackContactInfo: ContactInfo = {
  generalphone: '+91 00000 00000',
  generalemail: 'info@example.edu',
  address: 'NCC Troop Office, College Campus',
};

