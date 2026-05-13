import { getEvents } from '@/firebase/services/events';
import { EventsCalendar } from './events-calendar';
import { PageHeader } from '@/components/layout/page-header';
import { getAppearanceSettings } from '@/firebase/services/settings';

export const revalidate = 3600; // Revalidate every hour

export default async function EventsPage() {
  const [allEvents, appearance] = await Promise.all([
    getEvents(),
    getAppearanceSettings(),
  ]);

  const theme = appearance?.theme;

  return (
    <div>
      <PageHeader 
        eyebrow="Happening Now"
        title="Campus Events" 
        description="Stay up-to-date with all the academic and extracurricular activities happening at Modern School."
        theme={theme}
      />
      <div className="container mx-auto px-4 py-12 md:px-6">
        <EventsCalendar allEvents={allEvents} theme={theme} />
      </div>
    </div>
  );
}
