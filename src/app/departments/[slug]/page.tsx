import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getDepartmentBySlug, getDepartments } from '@/firebase/services/departments';
import { getTeamMembersByDepartment } from '@/firebase/services/team';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FlaskConical, Users } from 'lucide-react';
import type { Course } from '@/firebase/services/departments';

export const revalidate = 3600;

export async function generateStaticParams() {
  const departments = await getDepartments();
  return departments.map((dept) => ({
    slug: dept.slug,
  }));
}

export default async function DepartmentDetailPage({ params }: { params: { slug: string } }) {
  const department = await getDepartmentBySlug(params.slug);

  if (!department) {
    notFound();
  }
  
  const faculty = await getTeamMembersByDepartment(department.name);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[40vh] w-full">
        <Image
          src={department.imageurl}
          alt={`Image for ${department.name}`}
          data-ai-hint={department.dataaihint}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-primary-foreground">
          <h1 className="font-headline text-4xl font-bold md:text-6xl">
            {department.name}
          </h1>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
        <p className="text-center text-lg text-muted-foreground md:text-xl">
          {department.longdescription}
        </p>

        <div className="mt-16 grid gap-12 lg:grid-cols-3 lg:gap-8">
          {/* Faculty Section */}
          <div className="lg:col-span-2">
            <h2 className="font-headline mb-6 flex items-center gap-3 text-3xl font-bold">
              <Users className="h-8 w-8 text-primary" /> Faculty
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {faculty.map((member) => (
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
          
          {/* Research Areas */}
          <div>
            <h2 className="font-headline mb-6 flex items-center gap-3 text-3xl font-bold">
              <FlaskConical className="h-8 w-8 text-primary" /> Research Areas
            </h2>
            <div className="flex flex-wrap gap-2">
              {department.researchareas.map((area) => (
                <Badge key={area} variant="secondary" className="text-sm">{area}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div className="mt-16">
          <h2 className="font-headline mb-6 flex items-center gap-3 text-3xl font-bold">
            <BookOpen className="h-8 w-8 text-primary" /> Featured Courses
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {department.courses.map((course: Course) => (
              <Card key={course.id}>
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
