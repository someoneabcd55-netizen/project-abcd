import { getAnnouncementsPublic } from '@/firebase/services/announcements';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Newspaper, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';


export async function AnnouncementsSection({ title = 'Announcements & News', limit = 3, theme }: any) {
  const announcements = await getAnnouncementsPublic(limit);
  const isTheme2 = theme === 'theme2';
  const isTheme3 = theme === 'theme3';
  
  return (
    <section className={cn(
      "container mx-auto px-4 py-12 md:px-6 lg:py-16",
      (isTheme2 || isTheme3) && "max-w-7xl"
    )}>
      <div className="flex flex-col items-center mb-12 text-center">
         {(isTheme2 || isTheme3) && (
            <div className={cn(
              "mb-4 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase",
              isTheme2 ? "bg-indigo-500/10 border border-indigo-500/20 text-indigo-400" : 
              isTheme3 ? "bg-navy/5 border border-navy/10 text-navy" : ""
            )}>
                Stay Updated
            </div>
         )}
          <h2 className={cn(
            "font-headline text-3xl font-bold md:text-4xl", 
            isTheme2 ? "text-white" : isTheme3 ? "text-navy uppercase tracking-tight" : ""
          )}>
              {title}
          </h2>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {announcements.length === 0 ? <p className="text-center col-span-3 text-muted-foreground">No announcements to display.</p>
          : announcements.map((item: any) => (
            <Card key={item.id} className={cn(
              "flex flex-col group transition-all duration-300",
              isTheme2 ? "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--border-accent)] hover:-translate-y-2 shadow-xl" : 
              isTheme3 ? "bg-white border-gray-200 hover:border-navy hover:-translate-y-1 shadow-sm hover:shadow-md rounded-none" : ""
            )}>
                <CardHeader className={cn(isTheme3 && "pb-4")}>
                <div className="flex justify-between items-center mb-4">
                     {(isTheme2 || isTheme3) && (
                        <div className="flex gap-2">
                             {item.isPinned && (
                               <span className={cn(
                                 "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                 isTheme2 ? "bg-red-500 text-white" : "bg-[#cc2936] text-white"
                               )}>
                                 Pinned
                               </span>
                             )}
                             <span className={cn(
                               "px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider",
                               isTheme2 ? "border-[var(--border)] text-[var(--text-muted)]" : 
                               isTheme3 ? "border-navy/20 text-navy" : ""
                             )}>
                               Notice
                             </span>
                        </div>
                     )}
                     {!isTheme2 && !isTheme3 && <Newspaper className="h-6 w-6 text-primary" />}
                     <CardDescription className={cn(
                       (isTheme2 || isTheme3) && "text-xs font-body",
                       isTheme2 ? "text-[var(--text-muted)]" : isTheme3 ? "text-gray-400" : ""
                     )}>
                        {format(new Date(item.date), 'PPP')}
                     </CardDescription>
                </div>
                <CardTitle className={cn(
                  "flex items-start gap-3", 
                  isTheme2 ? "text-white font-headline text-xl leading-snug" : 
                  isTheme3 ? "text-navy font-headline text-2xl uppercase leading-tight" : ""
                )}>
                    <span className="flex-1">{item.title}</span>
                </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                    <p className={cn(
                      "line-clamp-3", 
                      isTheme2 ? "text-[var(--text-secondary)] font-body text-sm leading-relaxed" : 
                      isTheme3 ? "text-gray-500 font-body text-sm leading-relaxed" : ""
                    )}>
                        {item.description}
                    </p>
                    {(isTheme2 || isTheme3) && (
                         <div className="pt-2">
                            <Link href={`/announcements/${item.id}`} className={cn(
                              "inline-flex items-center font-bold text-sm group/link",
                              isTheme2 ? "text-[var(--accent)]" : isTheme3 ? "text-[#cc2936] uppercase tracking-widest" : ""
                            )}>
                                Read more 
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                            </Link>
                         </div>
                    )}
                </CardContent>
            </Card>
          ))
        }
      </div>
    </section>
  );
}

