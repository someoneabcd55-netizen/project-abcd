import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Shield } from 'lucide-react';
import { getActivities } from '@/firebase/services/activities';
import Image from 'next/image';
import { PageHeader } from '@/components/layout/page-header';
import { getAppearanceSettings } from '@/firebase/services/settings';
import { cn } from '@/lib/utils';

export const revalidate = 3600;

export default async function ActivitiesPage() {
    const [activities, appearance] = await Promise.all([
        getActivities(),
        getAppearanceSettings(),
    ]);

    const theme = appearance?.theme;
    const isTheme2 = theme === 'theme2';
    const isTheme3 = theme === 'theme3';

    return (
        <div>
            <PageHeader 
                eyebrow={isTheme3 ? "Training & Development" : "Beyond Academics"}
                title={isTheme3 ? "Cadet Activities" : "Student Activities"} 
                description="Explore the various extracurricular and co-curricular activities offered at our college."
                theme={theme}
            />
            <div className="container mx-auto px-4 py-16 md:px-6">
                <div className={cn(
                    "grid gap-8",
                    isTheme3 ? "sm:grid-cols-2 lg:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
                )}>
                    {activities.map((activity) => (
                    <Link key={activity.slug} href={`/activities/${activity.slug}`} className="group block">
                        {isTheme2 ? (
                            <div className="relative h-[400px] rounded-2xl overflow-hidden border border-[var(--border)] group-hover:border-[var(--accent)] transition-all duration-500 shadow-xl group-hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                                {activity.imageurl ? (
                                    <Image
                                        src={activity.imageurl}
                                        alt={activity.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-[var(--surface-2)] flex items-center justify-center">
                                        <Shield className="h-16 w-16 text-[var(--text-muted)]" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                                
                                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                    <span className="text-[var(--accent)] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">Activity</span>
                                    <h2 className="text-3xl font-bold text-white font-headline mb-4 transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">{activity.name}</h2>
                                    <p className="text-[var(--text-secondary)] font-body text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                                        {activity.shortdescription}
                                    </p>
                                    <div className="mt-6 flex items-center text-white text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                                        Learn More <ArrowRight className="ml-2 h-4 w-4 text-[var(--accent)]" />
                                    </div>
                                </div>
                            </div>
                        ) : isTheme3 ? (
                            <div className="flex flex-col md:flex-row bg-white border border-gray-100 overflow-hidden group hover:border-navy transition-all duration-500 shadow-sm hover:shadow-2xl">
                                <div className="relative w-full md:w-2/5 aspect-video md:aspect-auto">
                                    {activity.imageurl ? (
                                        <Image
                                            src={activity.imageurl}
                                            alt={activity.name}
                                            fill
                                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                                            <Shield className="h-12 w-12 text-gray-200" />
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#cc2936]" />
                                </div>
                                <div className="w-full md:w-3/5 p-8 flex flex-col justify-center bg-white relative">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 -translate-y-1/2 translate-x-1/2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span className="text-[#cc2936] text-[10px] font-bold uppercase tracking-[0.3em] block mb-2">NCC Activity</span>
                                    <h2 className="text-3xl font-bold text-navy font-headline uppercase leading-tight group-hover:text-[#cc2936] transition-colors">{activity.name}</h2>
                                    <p className="mt-4 text-gray-500 font-body text-sm line-clamp-2">
                                        {activity.shortdescription}
                                    </p>
                                    <div className="mt-8 flex items-center text-navy text-xs font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                                        Join Unit <ArrowRight className="h-4 w-4 text-[#cc2936]" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Card className="h-full transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl overflow-hidden">
                                <div className="relative h-48 w-full bg-secondary flex items-center justify-center">
                                    {activity.imageurl ? (
                                        <Image
                                            src={activity.imageurl}
                                            alt={activity.name}
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
                        )}
                    </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

