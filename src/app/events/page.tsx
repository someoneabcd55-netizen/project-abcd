
import { getEvents } from '@/firebase/services/events';
import { EventsCalendar } from './events-calendar';

export const revalidate = 3600; // Revalidate every hour

export default async function EventsPage() {
  const allEvents = await getEvents();

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
        Campus Events
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Stay up-to-date with all the academic and extracurricular activities happening at G V Hallikeri PU college.
      </p>
      <EventsCalendar allEvents={allEvents} />
    </div>
  );
}
