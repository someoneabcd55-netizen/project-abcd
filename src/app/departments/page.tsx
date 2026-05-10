import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { getDepartments } from '@/firebase/services/departments';
import Image from 'next/image';

export const revalidate = 3600;

export default async function DepartmentsPage() {
    const departments = await getDepartments();

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
        <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
            Academic Departments
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Explore our diverse range of departments, each a center of excellence in its field.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((dept) => (
            <Link key={dept.slug} href={`/departments/${dept.slug}`} className="group block">
                <Card className="h-full transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl overflow-hidden">
                    <div className="relative h-48 w-full">
                        <Image
                            src={dept.imageurl}
                            alt={`Image for ${dept.name}`}
                            data-ai-hint={dept.dataaihint}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <CardContent className="p-6">
                        <h2 className="font-headline text-xl font-semibold">{dept.name}</h2>
                        <p className="mt-2 flex-grow text-sm text-muted-foreground">{dept.shortdescription}</p>
                        <div className="mt-4 flex items-center text-sm font-semibold text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            Learn More <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                    </CardContent>
                </Card>
            </Link>
            ))}
        </div>
        </div>
    );
}
