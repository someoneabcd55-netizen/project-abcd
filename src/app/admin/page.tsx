'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminPages } from '@/components/admin/admin-pages';
import { AdminFooter } from '@/components/admin/admin-footer';
import { AdminHomepage } from '@/components/admin/admin-homepage';
import { AdminDepartments } from '@/components/admin/admin-departments';
import { AdminActivities } from '@/components/admin/admin-activities';
import { AdminGallery } from '@/components/admin/admin-gallery';
import { AdminEvents } from '@/components/admin/admin-events';
import { AdminTeam } from '@/components/admin/admin-team';
import { AdminUserManagement } from '@/components/admin/admin-user-management';
import { LayoutGrid, Milestone, Home, Building2, ToyBrick, ImageIcon, Calendar, UserSquare, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();

  const handleGalleryUpdate = () => {
    // A simple way to trigger a re-fetch on the gallery page is to refresh.
    // This is useful if the public page uses static generation.
    router.refresh();
  };

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
       <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
              Admin Dashboard
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
              Manage your website content, users, and settings here.
          </p>
        </div>
       </div>
      
      <Tabs defaultValue="homepage" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-9">
          <TabsTrigger value="homepage">
            <Home className="mr-2 h-4 w-4" />
            Homepage
          </TabsTrigger>
          <TabsTrigger value="pages">
            <LayoutGrid className="mr-2 h-4 w-4" />
            Pages
          </TabsTrigger>
           <TabsTrigger value="faculty">
            <UserSquare className="mr-2 h-4 w-4" />
            Faculty
          </TabsTrigger>
          <TabsTrigger value="departments">
            <Building2 className="mr-2 h-4 w-4" />
            Departments
          </TabsTrigger>
          <TabsTrigger value="activities">
            <ToyBrick className="mr-2 h-4 w-4" />
            Activities
          </TabsTrigger>
           <TabsTrigger value="events">
            <Calendar className="mr-2 h-4 w-4" />
            Events
          </TabsTrigger>
           <TabsTrigger value="gallery">
            <ImageIcon className="mr-2 h-4 w-4" />
            Gallery
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="footer">
            <Milestone className="mr-2 h-4 w-4" />
            Footer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="homepage">
            <Card>
                <CardHeader>
                    <CardTitle>Homepage Content</CardTitle>
                    <CardDescription>
                        Add, remove, and reorder the content blocks for your homepage.
                    </CardDescription>
                </CardHeader>
                <AdminHomepage />
            </Card>
        </TabsContent>
        <TabsContent value="pages">
            <Card>
                <CardHeader>
                    <CardTitle>Website Pages</CardTitle>
                    <CardDescription>
                        Drag and drop to reorder pages in the navigation. Click the edit icon to manage a page's content blocks.
                    </CardDescription>
                </CardHeader>
                <AdminPages />
            </Card>
        </TabsContent>
         <TabsContent value="faculty">
            <Card>
                <CardHeader>
                    <CardTitle>Faculty & Team</CardTitle>
                    <CardDescription>
                       Manage all faculty and team members.
                    </CardDescription>
                </CardHeader>
                <AdminTeam />
            </Card>
        </TabsContent>
        <TabsContent value="departments">
             <Card>
                <CardHeader>
                    <CardTitle>Academic Departments</CardTitle>
                    <CardDescription>
                        Manage the content for each academic department page.
                    </CardDescription>
                </CardHeader>
                <AdminDepartments />
            </Card>
        </TabsContent>
         <TabsContent value="activities">
             <Card>
                <CardHeader>
                    <CardTitle>College Activities</CardTitle>
                    <CardDescription>
                        Manage content for activity pages like NCC, NSS, and Sports.
                    </CardDescription>
                </CardHeader>
                <AdminActivities />
            </Card>
        </TabsContent>
         <TabsContent value="events">
            <Card>
                <CardHeader>
                    <CardTitle>Campus Events</CardTitle>
                    <CardDescription>
                        Manage all academic and extracurricular events.
                    </CardDescription>
                </CardHeader>
                <AdminEvents />
            </Card>
        </TabsContent>
         <TabsContent value="gallery">
            <Card>
                <CardHeader>
                    <CardTitle>Website Gallery</CardTitle>
                    <CardDescription>
                        Manage the images displayed on the public gallery page.
                    </CardDescription>
                </CardHeader>
                 <AdminGallery onGalleryUpdate={handleGalleryUpdate} />
            </Card>
        </TabsContent>
        <TabsContent value="users">
            <Card>
                <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                        Create students, teachers, admins, and super admins from one place.
                    </CardDescription>
                </CardHeader>
                <AdminUserManagement />
            </Card>
        </TabsContent>
        <TabsContent value="footer">
            <Card>
                <CardHeader>
                    <CardTitle>Footer Content</CardTitle>
                    <CardDescription>
                        Edit the links, social media, and copyright text in your website's footer.
                    </CardDescription>
                </CardHeader>
                <AdminFooter />
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
