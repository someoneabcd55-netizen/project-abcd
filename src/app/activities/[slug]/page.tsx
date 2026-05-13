
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getActivityBySlug, getActivities } from '@/firebase/services/activities';
import { getTeamMembersByDepartment } from '@/firebase/services/team';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Target, Users, Shield, Clock, MapPin } from 'lucide-react';
import type { Course } from '@/firebase/services/activities';
import { getAppearanceSettings } from '@/firebase/services/settings';
import { cn } from '@/lib/utils';

export const revalidate = 3600;

export async function generateStaticParams() {
  const activities = await getActivities();
  return activities.map((activity) => ({
    slug: activity.slug,
  }));
}

type ActivityPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ActivityDetailPage({ params }: ActivityPageProps) {
  const { slug } = await params;
  const [activity, appearance] = await Promise.all([
    getActivityBySlug(slug),
    getAppearanceSettings(),
  ]);

  if (!activity) {
    notFound();
  }
  
  const faculty = await getTeamMembersByDepartment(activity.faculty_department);
  const theme = appearance?.theme;
  const isTheme2 = theme === 'theme2';
  const isTheme3 = theme === 'theme3';

  return (
    <div className={cn(isTheme2 ? "bg-[#0a0f1e] min-h-screen text-white" : "bg-white min-h-screen")}>
      {/* Hero Section */}
      <section className={cn(
        "relative w-full overflow-hidden",
        isTheme2 ? "h-[60vh]" : isTheme3 ? "h-[50vh] bg-[#0d1b3e]" : "h-[40vh] bg-primary/70"
      )}>
        {activity.imageurl && (
            <Image
              src={activity.imageurl}
              alt={`Image for ${activity.name}`}
              data-ai-hint={activity.dataaihint}
              fill
              className={cn("object-cover", isTheme3 && "opacity-30")}
            />
        )}
        <div className={cn(
          "absolute inset-0",
          isTheme2 ? "bg-gradient-to-b from-indigo-900/50 via-[#0a0f1e]/80 to-[#0a0f1e]" : 
          isTheme3 ? "bg-gradient-to-r from-[#0d1b3e] via-transparent to-transparent" :
          "bg-primary/70"
        )} />
        
        <div className="container mx-auto px-4 h-full relative z-10">
          <div className={cn(
            "flex h-full flex-col justify-center",
            isTheme2 ? "items-center text-center" : isTheme3 ? "items-start text-left max-w-4xl" : "items-center text-center"
          )}>
            {isTheme3 ? (
              <div className="space-y-6">
                <span className="text-[#cc2936] text-sm font-bold tracking-[0.4em] uppercase block animate-in fade-in slide-in-from-left-4 duration-700">Official Unit</span>
                <h1 className="font-headline text-5xl md:text-8xl font-bold text-white uppercase leading-tight animate-in fade-in slide-in-from-left-8 duration-700 delay-100">
                  {activity.name}
                </h1>
                <div className="h-2 w-32 bg-[#cc2936] animate-in fade-in slide-in-from-left-12 duration-700 delay-200" />
              </div>
            ) : (
              <>
                <Shield className="h-16 w-16 mb-6 text-white opacity-80" />
                <h1 className={cn("font-headline text-4xl font-bold md:text-7xl", isTheme2 ? "bg-gradient-to-r from-white via-indigo-200 to-white bg-clip-text text-transparent" : "text-primary-foreground")}>
                  {activity.name}
                </h1>
              </>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 md:px-6 lg:py-24">
        <div className="max-w-4xl mx-auto mb-20">
          <p className={cn(
            "text-lg md:text-2xl leading-relaxed text-center",
            isTheme2 ? "text-indigo-100/80 font-body" : isTheme3 ? "text-navy font-body font-medium" : "text-muted-foreground"
          )}>
            {activity.longdescription}
          </p>
        </div>

        <div className="grid gap-16 lg:grid-cols-12">
          {/* Faculty Section */}
          <div className="lg:col-span-8 space-y-12">
            <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
               <Users className={cn("h-8 w-8", isTheme3 ? "text-[#cc2936]" : "text-primary")} />
               <h2 className={cn("text-3xl font-bold uppercase font-headline tracking-tight", isTheme3 ? "text-navy" : "")}>Leadership & Faculty</h2>
            </div>
            
            <div className="grid gap-8 sm:grid-cols-2">
              {(faculty || []).map((member) => (
                <div key={member.id} className={cn(
                  "p-6 flex items-center gap-6 transition-all duration-300",
                  isTheme2 ? "bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10" : 
                  isTheme3 ? "bg-white border border-gray-100 hover:border-navy shadow-sm hover:shadow-xl rounded-none" :
                  "border rounded-2xl hover:border-primary"
                )}>
                  <Avatar className="h-20 w-20 ring-4 ring-offset-2 ring-[#cc2936]/10">
                    <AvatarImage src={member.imageUrl} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className={cn("text-xl font-bold", isTheme3 ? "text-navy uppercase font-headline" : "")}>{member.name}</h3>
                    <p className={cn("text-sm mb-3", isTheme2 ? "text-indigo-400" : isTheme3 ? "text-[#cc2936] font-bold uppercase tracking-widest text-[10px]" : "text-muted-foreground")}>{member.title}</p>
                    <Link href={`/faculty#${member.id}`} className={cn("text-xs font-bold uppercase tracking-widest hover:underline", isTheme3 ? "text-navy" : "text-primary")}>Profile</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-12">
            {/* Focus Areas */}
            <div className="space-y-6">
              <h2 className={cn("text-2xl font-bold uppercase font-headline tracking-tight", isTheme3 ? "text-navy" : "")}>Strategic Focus</h2>
              <div className="flex flex-wrap gap-3">
                {(activity.focusareas || []).map((area) => (
                  <Badge key={area} className={cn(
                    "px-4 py-2 rounded-none font-bold uppercase text-[10px] tracking-widest",
                    isTheme2 ? "bg-indigo-600 text-white" : isTheme3 ? "bg-navy text-white border-none" : "bg-secondary text-secondary-foreground"
                  )}>
                    {area}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Quick Info (Theme 3 specialized) */}
            {isTheme3 && (
              <div className="bg-[#0d1b3e] p-8 text-white space-y-6">
                 <h3 className="text-xl font-bold font-headline uppercase tracking-wider text-[#cc2936]">Unit Information</h3>
                 <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm">
                       <Clock className="h-5 w-5 text-[#cc2936]" />
                       <span className="text-gray-300">Tues & Thurs: 16:00 — 18:00</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                       <MapPin className="h-5 w-5 text-[#cc2936]" />
                       <span className="text-gray-300">Ground A, Campus South</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                       <Shield className="h-5 w-5 text-[#cc2936]" />
                       <span className="text-gray-300">NCC 'C' Certificate Eligibility</span>
                    </div>
                 </div>
                 <Button className="w-full bg-[#cc2936] hover:bg-[#b0232d] text-white rounded-none uppercase font-bold tracking-widest h-12 border-none">
                    Enroll Now
                 </Button>
              </div>
            )}
          </div>
        </div>

        {/* Courses/Activities Section */}
        <div className="mt-24 space-y-12">
          <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
             <BookOpen className={cn("h-8 w-8", isTheme3 ? "text-[#cc2936]" : "text-primary")} />
             <h2 className={cn("text-3xl font-bold uppercase font-headline tracking-tight", isTheme3 ? "text-navy" : "")}>Specialized Training</h2>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {(activity.courses || []).map((course: Course, index: number) => (
              <div key={`${course.id}-${index}`} className={cn(
                "p-8 transition-all duration-300 group relative",
                isTheme2 ? "bg-white/5 border border-white/10 rounded-3xl" : 
                isTheme3 ? "bg-white border border-gray-100 hover:border-navy shadow-sm hover:shadow-xl rounded-none" :
                "border rounded-2xl"
              )}>
                {isTheme3 && (
                  <div className="absolute top-0 left-0 w-1 h-0 bg-[#cc2936] transition-all duration-300 group-hover:h-full" />
                )}
                <p className={cn("text-[10px] font-bold uppercase tracking-widest mb-4", isTheme2 ? "text-indigo-400" : isTheme3 ? "text-[#cc2936]" : "text-primary")}>{course.id}</p>
                <h3 className={cn("text-2xl font-bold mb-4", isTheme3 ? "text-navy uppercase font-headline" : "")}>{course.name}</h3>
                <p className={cn("text-sm leading-relaxed", isTheme2 ? "text-gray-400" : isTheme3 ? "text-gray-500 font-body" : "text-muted-foreground")}>{course.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
