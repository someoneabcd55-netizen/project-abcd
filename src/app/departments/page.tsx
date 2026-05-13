import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { getDepartments } from '@/firebase/services/departments';
import Image from 'next/image';
import { PageHeader } from '@/components/layout/page-header';
import { getAppearanceSettings } from '@/firebase/services/settings';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const revalidate = 3600;

export default async function DepartmentsPage() {
    const [departments, appearance] = await Promise.all([
        getDepartments(),
        getAppearanceSettings(),
    ]);

    const theme = appearance?.theme;
    const isTheme2 = theme === 'theme2';
    const isTheme3 = theme === 'theme3';

    return (
        <div className="min-h-screen">
            <PageHeader 
                eyebrow={isTheme3 ? "Academic Excellence" : "Academic Departments"}
                title={isTheme3 ? "Schools of Training" : "Our Departments"} 
                description="Comprehensive academic programs designed for the future leaders."
                theme={theme}
            />
            
            <div className="container mx-auto px-4 py-20 md:px-6">
                <div className={cn(
                    "grid gap-12",
                    isTheme3 ? "max-w-6xl mx-auto" : (isTheme2 ? "lg:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3")
                )}>
                    {departments.map((dept, index) => (
                        <div key={dept.id}>
                            {isTheme2 ? (
                                <Link href={`/departments/${dept.slug}`} className="group block">
                                    <Card className="h-full bg-[var(--surface)] border-[var(--border)] rounded-2xl overflow-hidden hover:border-[var(--border-accent)] transition-all duration-300 shadow-lg">
                                        <div className="relative h-56 w-full">
                                            {dept.imageurl ? (
                                                <Image
                                                    src={dept.imageurl}
                                                    alt={dept.name}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-indigo-500/10 flex items-center justify-center">
                                                    <GraduationCap className="h-12 w-12 text-indigo-400 opacity-20" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent" />
                                            <div className="absolute top-4 left-4 p-2 bg-indigo-600 rounded-lg shadow-lg">
                                                <GraduationCap className="h-5 w-5 text-white" />
                                            </div>
                                        </div>
                                        <CardContent className="p-8">
                                            <h2 className="font-headline text-2xl font-bold text-white mb-3 group-hover:text-[var(--accent)] transition-colors">{dept.name}</h2>
                                            <p className="text-[var(--text-secondary)] font-body text-sm line-clamp-2 mb-6">{dept.shortdescription}</p>
                                            <div className="flex items-center text-white text-xs font-bold uppercase tracking-widest group-hover:gap-2 transition-all">
                                                Explore Department <ArrowRight className="ml-2 h-4 w-4 text-[var(--accent)]" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ) : isTheme3 ? (
                                <div className="bg-white border border-gray-100 flex flex-col md:flex-row overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group">
                                    {/* Left Side: Image */}
                                    <div className="relative w-full md:w-5/12 min-h-[300px]">
                                        {dept.imageurl ? (
                                            <Image 
                                                src={dept.imageurl} 
                                                alt={dept.name} 
                                                fill 
                                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                                                <GraduationCap className="h-16 w-16 text-gray-200" />
                                            </div>
                                        )}
                                        <div className="absolute top-6 left-6">
                                           <div className="bg-navy text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2">Department {index + 1}</div>
                                        </div>
                                    </div>
                                    {/* Right Side: Content */}
                                    <div className="w-full md:w-7/12 p-10 md:p-16 flex flex-col justify-center space-y-8">
                                        <div className="space-y-4">
                                           <div className="h-1.5 w-16 bg-[#cc2936]" />
                                           <h3 className="text-4xl font-bold text-navy font-headline uppercase leading-tight group-hover:text-[#cc2936] transition-colors">{dept.name}</h3>
                                           <p className="text-gray-500 font-body leading-relaxed">
                                              {dept.shortdescription}
                                           </p>
                                        </div>

                                        {/* Internal Stats Row */}
                                        <div className="grid grid-cols-3 gap-8 py-8 border-y border-gray-50">
                                           <div>
                                              <p className="text-2xl font-bold text-navy font-headline">12+</p>
                                              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Faculty</p>
                                           </div>
                                           <div>
                                              <p className="text-2xl font-bold text-navy font-headline">04</p>
                                              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Laboratories</p>
                                           </div>
                                           <div>
                                              <p className="text-2xl font-bold text-navy font-headline">85%</p>
                                              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Research</p>
                                           </div>
                                        </div>

                                        <div className="flex gap-4">
                                           <Button asChild className="bg-navy hover:bg-[#162347] text-white rounded-none px-8 h-12 uppercase font-bold tracking-widest transition-all hover:translate-y-[-2px] border-none">
                                              <Link href={`/departments/${dept.slug}`}>View Curriculum</Link>
                                           </Button>
                                           <Button variant="outline" className="border-navy/20 text-navy hover:bg-navy/5 rounded-none px-8 h-12 uppercase font-bold tracking-widest">
                                              Research
                                           </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link href={`/departments/${dept.slug}`} className="group block">
                                    <Card className="h-full transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl overflow-hidden">
                                        <div className="relative h-48 w-full">
                                            {dept.imageurl ? (
                                                <Image
                                                    src={dept.imageurl}
                                                    alt={dept.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-secondary flex items-center justify-center">
                                                    <GraduationCap className="h-12 w-12 text-muted-foreground" />
                                                </div>
                                            )}
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
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
