import { getAnnouncementsPublic } from '@/firebase/services/announcements';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';


export async function AnnouncementsSection({ title = 'Announcements & News', limit = 3 }: any) {
  const announcements = await getAnnouncementsPublic(limit);
  
  return (
    <section className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
      <h2 className="font-headline mb-8 text-center text-3xl font-bold md:text-4xl">
          {title}
      </h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {announcements.length === 0 ? <p className="text-center col-span-3 text-muted-foreground">No announcements to display.</p>
          : announcements.map((item: any) => (
            <Card key={item.id} className="flex flex-col">
                <CardHeader>
                <CardTitle className="flex items-start gap-3">
                    <Newspaper className="mt-1 h-6 w-6 text-primary" />
                    <span className="flex-1">{item.title}</span>
                </CardTitle>
                <CardDescription>{format(new Date(item.date), 'PPP')}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                <p>{item.description}</p>
                </CardContent>
            </Card>
          ))
        }
      </div>
    </section>
  );
}
