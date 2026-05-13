
import Link from 'next/link';
import { Button } from '../ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, ArrowRight } from 'lucide-react';
import { getEventsPublic } from '@/firebase/services/events';
import { format } from 'date-fns';

export async function DualSection({ leftTitle = "Upcoming Events", rightTitle = "Our Activities" }: any) {
    const events = await getEventsPublic(3);
    // The right section for "Our Departments" is removed as the data was incorrect.
    // It can be replaced with another module, like "Activities" when ready.

  return (
     <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-1">
          {/* Upcoming Events */}
          <section>
            <h2 className="font-headline mb-8 text-center text-3xl font-bold md:text-4xl">
              {leftTitle}
            </h2>
            <div className="space-y-6">
              {events.length > 0 ? (
                events.map((event, index) => (
                  <Card key={index} className="transition-transform hover:scale-[1.02] hover:shadow-lg">
                    <CardContent className="flex items-center gap-4 p-4">
                      <Calendar className="h-8 w-8 text-accent" />
                      <div>
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(event.date), 'PPP')} - {event.location}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center text-muted-foreground">No upcoming events to display.</p>
              )}
              <Button asChild variant="link" className="float-right text-primary">
                <Link href="/events">View All Events <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
  );
}

