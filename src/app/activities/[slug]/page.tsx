
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getActivityBySlug, getActivities } from '@/firebase/services/activities';
import { getTeamMembersByDepartment } from '@/firebase/services/team';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Target, Users, Shield } from 'lucide-react';
import type { Course } from '@/firebase/services/activities';

export const revalidate = 3600;

export async function generateStaticParams() {
  const activities = await getActivities();
  return activities.map((activity) => ({
    slug: activity.slug,
  }));
}

export default async function ActivityDetailPage({ params }: { params: { slug: string } }) {
  const activity = await getActivityBySlug(params.slug);

  if (!activity) {
    notFound();
  }
  
  const faculty = await getTeamMembersByDepartment(activity.faculty_department);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[40vh] w-full">
        {activity.imageurl && (
            <Image
              src={activity.imageurl}
              alt={`Image for ${activity.name}`}
              data-ai-hint={activity.dataaihint}
              fill
              className="object-cover"
            />
        )}
        <div className="absolute inset-0 bg-primary/70" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-primary-foreground">
          <Shield className="h-16 w-16 mb-4" />
          <h1 className="font-headline text-4xl font-bold md:text-6xl">
            {activity.name}
          </h1>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
        <p className="text-center text-lg text-muted-foreground md:text-xl">
          {activity.longdescription}
        </p>

        <div className="mt-16 grid gap-12 lg:grid-cols-3 lg:gap-8">
          {/* Faculty Section */}
          <div className="lg:col-span-2">
            <h2 className="font-headline mb-6 flex items-center gap-3 text-3xl font-bold">
              <Users className="h-8 w-8 text-primary" /> Team
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {(faculty || []).map((member) => (
                <Card key={member.id} className="flex items-center p-4 gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={member.imageUrl} alt={member.name} data-ai-hint="person" />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.title}</p>
                     <Link href={`/faculty#${member.id}`} className="text-sm text-primary hover:underline">View Profile</Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Focus Areas */}
          <div>
            <h2 className="font-headline mb-6 flex items-center gap-3 text-3xl font-bold">
              <Target className="h-8 w-8 text-primary" /> Key Focus Areas
            </h2>
            <div className="flex flex-wrap gap-2">
              {(activity.focusareas || []).map((area) => (
                <Badge key={area} variant="secondary" className="text-sm">{area}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div className="mt-16">
          <h2 className="font-headline mb-6 flex items-center gap-3 text-3xl font-bold">
            <BookOpen className="h-8 w-8 text-primary" /> Training Activities
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(activity.courses || []).map((course: Course, index: number) => (
              <Card key={`${course.id}-${index}`}>
                <CardHeader>
                  <CardTitle>{course.name}</CardTitle>
                  <p className="text-sm font-mono text-muted-foreground pt-1">{course.id}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{course.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
