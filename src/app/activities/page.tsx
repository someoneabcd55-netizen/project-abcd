
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Shield } from 'lucide-react';
import { getActivities } from '@/firebase/services/activities';
import Image from 'next/image';

export const revalidate = 3600;

export default async function ActivitiesPage() {
    const activities = await getActivities();

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
        <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
            College Activities
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Explore the various extracurricular and co-curricular activities offered at our college.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => (
            <Link key={activity.slug} href={`/activities/${activity.slug}`} className="group block">
                <Card className="h-full transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl overflow-hidden">
                    <div className="relative h-48 w-full bg-secondary flex items-center justify-center">
                        {activity.imageurl ? (
                            <Image
                                src={activity.imageurl}
                                alt={`Image for ${activity.name}`}
                                data-ai-hint={activity.dataaihint}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <Shield className="h-12 w-12 text-muted-foreground" />
                        )}
                    </div>
                    <CardContent className="p-6">
                        <h2 className="font-headline text-xl font-semibold">{activity.name}</h2>
                        <p className="mt-2 flex-grow text-sm text-muted-foreground">{activity.shortdescription}</p>
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
