'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { AppEvent } from '@/firebase/services/events';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Clock, MapPin, Users, Calendar as CalendarIcon, ArrowRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EventsCalendarProps {
    allEvents: AppEvent[];
    theme?: string;
}

export function EventsCalendar({ allEvents: events, theme }: EventsCalendarProps) {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const isTheme2 = theme === 'theme2';
    const isTheme3 = theme === 'theme3';

    const selectedDateEvents = events.filter(
        (event) => date && format(new Date(event.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );

    const upcomingEvents = events
        .filter(event => new Date(event.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const eventsToShow = date && selectedDateEvents.length > 0 ? selectedDateEvents : upcomingEvents;
    const eventDates = events.map(event => new Date(event.date));

    if (isTheme3) {
        return (
            <div className="grid gap-12 lg:grid-cols-12 items-start">
                {/* Calendar Column */}
                <Card className="lg:col-span-5 border-gray-100 shadow-xl rounded-none overflow-hidden sticky top-32">
                    <CardHeader className="bg-[#0d1b3e] text-white p-6">
                        <CardTitle className="font-headline text-2xl uppercase tracking-wider flex items-center gap-3">
                            <CalendarIcon className="h-6 w-6 text-[#cc2936]" />
                            Events Calendar
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="w-full flex justify-center"
                            classNames={{
                                day_today: "text-[#cc2936] font-bold ring-2 ring-[#cc2936] ring-offset-2",
                                day_selected: "bg-[#0d1b3e] text-white hover:bg-[#0d1b3e] hover:text-white rounded-full",
                            }}
                        />
                    </CardContent>
                </Card>

                {/* Events Column */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                        <h2 className="text-3xl font-bold text-[#0d1b3e] font-headline uppercase tracking-tight">
                            {date ? format(date, 'MMMM do, yyyy') : 'Select a date'}
                        </h2>
                        <Badge variant="outline" className="border-navy/20 text-navy font-bold rounded-none px-4 py-1 uppercase text-[10px] tracking-widest">
                            {selectedDateEvents.length} Events Found
                        </Badge>
                    </div>

                    {selectedDateEvents.length === 0 ? (
                        <div className="text-center py-24 bg-gray-50 border border-dashed border-gray-200">
                            <Info className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-body">No scheduled events for this date.</p>
                        </div>
                    ) : (
                        selectedDateEvents.map((event) => (
                            <Card key={event.id} className="border-gray-100 hover:border-[#0d1b3e] shadow-sm hover:shadow-lg transition-all rounded-none overflow-hidden group">
                                <div className="relative p-8 flex flex-col gap-6">
                                    {/* Status and Category */}
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex gap-2">
                                            <Badge className="bg-[#0d1b3e] text-white rounded-none border-none font-bold text-[10px] uppercase tracking-widest px-3">
                                                {event.type || 'Event'}
                                            </Badge>
                                        </div>
                                    </div>

                                    <h3 className="text-3xl font-bold text-[#0d1b3e] font-headline uppercase group-hover:text-[#cc2936] transition-colors leading-tight">
                                        {event.title}
                                    </h3>

                                    {/* Metadata Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-y border-gray-50">
                                        <div className="flex items-center gap-3 text-sm text-gray-500 font-body">
                                            <Clock className="h-4 w-4 text-[#cc2936]" />
                                            {format(new Date(event.date), 'p')}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-500 font-body">
                                            <MapPin className="h-4 w-4 text-[#cc2936]" />
                                            {event.location}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-500 font-body">
                                            <Users className="h-4 w-4 text-[#cc2936]" />
                                            Capacity
                                        </div>
                                    </div>

                                    {/* Capacity Progress */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[#0d1b3e]">
                                            <span>Registration Progress</span>
                                            <span>75% Full</span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-100 rounded-none overflow-hidden">
                                            <div className="h-full bg-[#0d1b3e] w-3/4" />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <Button className="flex-1 bg-[#0d1b3e] hover:bg-[#162347] text-white rounded-none uppercase font-bold tracking-widest h-12 border-none">
                                            Register
                                        </Button>
                                        <Button variant="outline" className="flex-1 border-navy/20 text-navy hover:bg-navy/5 rounded-none uppercase font-bold tracking-widest h-12">
                                            Details
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        );
    }

    if (isTheme2) {
        return (
            <div className="mt-12 grid gap-12 lg:grid-cols-12 items-start">
                {/* Left Column: Mini Calendar */}
                <div className="lg:col-span-4 sticky top-24">
                    <Card className="bg-[var(--surface)] border-[var(--border)] overflow-hidden shadow-2xl">
                        <div className="p-6 bg-indigo-500/10 border-b border-[var(--border)]">
                            <h3 className="font-headline text-white font-bold flex items-center gap-2">
                                <CalendarIcon className="h-5 w-5 text-[var(--accent)]" />
                                Event Calendar
                            </h3>
                        </div>
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="w-full text-white"
                            modifiers={{ event: eventDates }}
                            modifiersClassNames={{
                                event: 'text-[var(--accent)] font-bold underline decoration-2',
                            }}
                        />
                    </Card>
                    <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-[var(--border)]">
                        <p className="text-white font-headline font-bold mb-2">Need Help?</p>
                        <p className="text-[var(--text-secondary)] text-sm mb-4 font-body">Contact our event coordinator for group registrations.</p>
                        <Button variant="link" className="p-0 h-auto text-[var(--accent)] font-bold">Get in touch →</Button>
                    </div>
                </div>

                {/* Right Column: Event Cards */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-white font-headline">
                            {date && selectedDateEvents.length > 0 ? `Events on ${format(date, 'MMMM d')}` : 'Upcoming Events'}
                        </h2>
                        <span className="text-sm text-[var(--text-muted)] font-body">
                            Showing {eventsToShow.length} events
                        </span>
                    </div>

                    {eventsToShow.length > 0 ? (
                        <div className="space-y-6">
                            {eventsToShow.map((event: AppEvent) => (
                                <div key={event.id} className="group relative flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-[var(--border-accent)] transition-all duration-300 shadow-lg">
                                    <div className="flex flex-col md:flex-row">
                                        {/* Date/Time info */}
                                        <div className="md:w-48 bg-[var(--surface-2)] p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[var(--border)]">
                                            <span className="text-[var(--accent)] text-xs font-bold uppercase tracking-widest mb-1">{format(new Date(event.date), 'MMMM')}</span>
                                            <span className="text-4xl font-bold text-white font-headline">{format(new Date(event.date), 'dd')}</span>
                                            <span className="text-[var(--text-muted)] text-sm mt-1">{format(new Date(event.date), 'EEEE')}</span>
                                        </div>

                                        {/* Event Details */}
                                        <div className="flex-grow p-8">
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 uppercase text-[10px] tracking-widest px-3">{event.type}</Badge>
                                                <Badge variant="outline" className="text-[var(--text-muted)] border-[var(--border)] uppercase text-[10px] tracking-widest px-3">Open</Badge>
                                            </div>
                                            <h3 className="text-2xl font-bold text-white font-headline mb-4 group-hover:text-[var(--accent)] transition-colors">{event.title}</h3>
                                            
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                                <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm">
                                                    <Clock className="h-4 w-4 text-[var(--accent)]" />
                                                    {format(new Date(event.date), 'p')}
                                                </div>
                                                <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm">
                                                    <MapPin className="h-4 w-4 text-[var(--accent)]" />
                                                    {event.location}
                                                </div>
                                                <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm">
                                                    <Users className="h-4 w-4 text-[var(--accent)]" />
                                                    {Math.floor(Math.random() * 50) + 20} Registered
                                                </div>
                                            </div>

                                            {/* Capacity Progress Bar */}
                                            <div className="space-y-2 mb-8">
                                                <div className="flex justify-between text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-bold">
                                                    <span>Event Capacity</span>
                                                    <span>75% Full</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full w-[75%]" />
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-4">
                                                <Button className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:scale-105 transition-transform px-8 h-12 shadow-[0_0_15px_rgba(99,102,241,0.3)] border-none font-bold">
                                                    Register Now
                                                </Button>
                                                <Button variant="outline" className="rounded-full border-[var(--border)] text-white hover:bg-white hover:text-[#0a0f1e] px-8 h-12 font-bold transition-all">
                                                    <Info className="mr-2 h-4 w-4" />
                                                    Details
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Card className="bg-[var(--surface)] border-[var(--border)] p-12 text-center">
                            <p className="text-[var(--text-secondary)] font-body italic">
                                {date && selectedDateEvents.length === 0 ? 'No events scheduled for this day.' : 'No upcoming events found.'}
                            </p>
                        </Card>
                    )}
                </div>
            </div>
        );
    }

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

