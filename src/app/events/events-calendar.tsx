'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { AppEvent } from '@/firebase/services/events';
import { format } from 'date-fns';

export function EventsCalendar({ allEvents }: { allEvents: AppEvent[] }) {
    const [date, setDate] = useState<Date | undefined>(new Date());

    const selectedDateEvents = allEvents.filter(event => 
        date && format(new Date(event.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );

    const upcomingEvents = allEvents
        .filter(event => new Date(event.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const eventsToShow = date && selectedDateEvents.length > 0 ? selectedDateEvents : upcomingEvents;

    const eventDates = allEvents.map(event => new Date(event.date));

    return (
        <div className="mt-12 grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                <CardTitle>
                    {date && selectedDateEvents.length > 0 ? `Events on ${format(date, 'PPP')}` : 'Upcoming & Recent Events'}
                </CardTitle>
                </CardHeader>
                <CardContent>
                {eventsToShow.length > 0 ? (
                    <div className="space-y-4">
                    {eventsToShow.map((event: AppEvent) => (
                        <div key={event.id} className="flex flex-col sm:flex-row gap-4 rounded-lg border p-4">
                        <div className="flex-shrink-0 text-center sm:w-24">
                            <p className="text-sm text-primary">{format(new Date(event.date), 'MMM')}</p>
                            <p className="text-3xl font-bold">{format(new Date(event.date), 'd')}</p>
                            <p className="text-sm text-muted-foreground">{format(new Date(event.date), 'yyyy')}</p>
                        </div>
                        <div>
                            <Badge variant="secondary" className="mb-2">{event.type}</Badge>
                            <h3 className="font-semibold text-lg">{event.title}</h3>
                            <p className="text-sm text-muted-foreground">{event.location}</p>
                            <p className="mt-2 text-sm">{event.description}</p>
                        </div>
                        </div>
                    ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground h-48 flex items-center justify-center">
                        {date && selectedDateEvents.length === 0 ? 'No events scheduled for this day.' : 'No upcoming events found.'}
                    </p>
                )}
                </CardContent>
            </Card>
            </div>
            
            <div className="row-start-1 lg:row-start-auto">
            <Card className="p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="w-full"
                    modifiers={{ event: eventDates }}
                    modifiersClassNames={{
                        event: 'bg-accent/30 rounded-full',
                    }}
                />
            </Card>
            </div>
        </div>
    );
}
