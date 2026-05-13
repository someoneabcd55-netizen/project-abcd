'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';

import {
    getEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    type AppEvent
} from '@/firebase/services/events';

import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit, Loader2, Plus, Trash2, Calendar as CalendarIconLucide } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const eventFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  description: z.string().min(10, 'Description is required.'),
  location: z.string().min(3, 'Location is required.'),
  type: z.enum(['Academic', 'Extracurricular']),
  date: z.date({ required_error: "A date is required." }),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

export function AdminEvents() {
    const [events, setEvents] = useState<AppEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<AppEvent | null>(null);
    const [eventToDelete, setEventToDelete] = useState<AppEvent | null>(null);
    const { toast } = useToast();

    const form = useForm<EventFormValues>({
        resolver: zodResolver(eventFormSchema),
    });

    const fetchEvents = async () => {
        setIsLoading(true);
        const data = await getEvents();
        setEvents(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchEvents();
    }, []);
    
    const handleDialogClose = () => {
        setDialogOpen(false);
        setEditingEvent(null);
        form.reset();
    }

    const handleEditClick = (event: AppEvent) => {
        setEditingEvent(event);
        form.reset({
            ...event,
            date: new Date(event.date)
        });
        setDialogOpen(true);
    };
    
    const handleNewClick = () => {
        setEditingEvent(null);
        form.reset({ title: '', description: '', location: '', type: 'Academic', date: new Date() });
        setDialogOpen(true);
    }

    const handleDeleteClick = (event: AppEvent) => {
        setEventToDelete(event);
        setDeleteConfirmOpen(true);
    }

    const confirmDelete = async () => {
        if (!eventToDelete) return;
        setIsSubmitting(true);
        try {
            await deleteEvent(eventToDelete.id);
            toast({ title: 'Success', description: 'Event deleted.' });
            await fetchEvents();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete event.' });
        } finally {
            setIsSubmitting(false);
            setDeleteConfirmOpen(false);
            setEventToDelete(null);
        }
    };


    const onSubmit = async (values: EventFormValues) => {
        setIsSubmitting(true);
        const formattedData = {
            ...values,
            date: format(values.date, 'yyyy-MM-dd')
        };

        try {
            if (editingEvent) {
                await updateEvent(editingEvent.id, formattedData);
                toast({ title: 'Success', description: 'Event updated.' });
            } else {
                await addEvent(formattedData);
                toast({ title: 'Success', description: 'Event added.' });
            }
            await fetchEvents();
            handleDialogClose();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An unknown error occurred.';
            toast({ variant: 'destructive', title: 'Error', description: message });
        } finally {
            setIsSubmitting(false);
        }
    };
    

    return (
        <>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-48">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : events.length === 0 ? (
                     <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">No events scheduled yet.</p>
                    </div>
                ) : (
                <div className="space-y-4">
                    {events.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 rounded-lg border p-3">
                        <div className="flex-shrink-0 text-center w-16">
                            <p className="text-sm text-primary">{format(new Date(item.date), 'MMM')}</p>
                            <p className="text-2xl font-bold">{format(new Date(item.date), 'd')}</p>
                        </div>
                        <div className="flex-grow">
                            <p className="font-semibold">{item.title}</p>
                            <p className="text-sm text-muted-foreground">{item.location} - <span className="text-xs font-semibold">{item.type}</span></p>
                        </div>
                        <div className="flex gap-2">
                             <Button variant="outline" size="sm" onClick={() => handleEditClick(item)}>
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(item)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-center">
                <Button onClick={handleNewClick}>
                    <Plus className="mr-2 h-4 w-4" /> Add New Event
                </Button>
            </CardFooter>

            <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>{editingEvent ? 'Edit' : 'Add'} Event</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                            <FormField control={form.control} name="title" render={({ field }) => (
                                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="description" render={({ field }) => (
                                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="location" render={({ field }) => (
                                <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="type" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="Academic">Academic</SelectItem>
                                                <SelectItem value="Extracurricular">Extracurricular</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="date" render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                    <FormLabel>Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                            variant={"outline"}
                                            className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                            >
                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            <CalendarIconLucide className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                    </FormItem>
                                )} />
                             </div>
                            <DialogFooter>
                                <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
            
             <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete the event: <span className="font-semibold">{eventToDelete?.title}</span>.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmDelete} disabled={isSubmitting} className="bg-destructive hover:bg-destructive/90">
                         {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Delete'}
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

