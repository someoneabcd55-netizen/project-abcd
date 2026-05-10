'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';

import {
  getActivities,
  updateActivity,
  addActivity,
  deleteActivity,
  type Activity,
} from '@/firebase/services/activities';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Edit, Loader2, X, Plus, Trash2, ImageIcon } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import Image from 'next/image';
import { AdminImageUploadField } from './admin-image-upload-field';

const courseSchema = z.object({
    id: z.string().min(1, "Course ID is required"),
    name: z.string().min(1, "Course name is required"),
    description: z.string().min(1, "Course description is required"),
});

const activityFormSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  slug: z.string().min(3, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens.'),
  shortdescription: z.string().min(10, 'Short description is required'),
  longdescription: z.string().min(20, 'Long description is required'),
  imageurl: z.string().url('A valid image URL is required'),
  dataaihint: z.string().min(3, 'AI hint is required'),
  faculty_department: z.enum(['ANO', 'Instructors']),
  focusareas: z.array(z.string().min(1, "Focus area cannot be empty")).min(1, 'At least one focus area is required'),
  courses: z.array(courseSchema).min(1, 'At least one training activity is required'),
});

type ActivityFormValues = z.infer<typeof activityFormSchema>;

export function AdminActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(null);
  const [newFocusArea, setNewFocusArea] = useState('');
  const { toast } = useToast();

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
  });

  const generateSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const { fields: focusAreaFields, append: appendFocusArea, remove: removeFocusArea } = useFieldArray({
    control: form.control,
    name: "focusareas",
  });
  
  const { fields: courseFields, append: appendCourse, remove: removeCourse } = useFieldArray({
    control: form.control,
    name: "courses",
  });

  const fetchActivities = async () => {
    setIsLoading(true);
    const data = await getActivities();
    setActivities(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleEditOpen = (activity: Activity) => {
    setEditingActivity(activity);
    form.reset({
        ...activity,
        focusareas: activity.focusareas || [],
        courses: activity.courses || [],
    });
    setDialogOpen(true);
  };
  
  const handleNewOpen = () => {
    setEditingActivity(null);
    form.reset({
        name: '',
        slug: '',
        shortdescription: '',
        longdescription: '',
        imageurl: '',
        dataaihint: '',
        faculty_department: 'ANO',
        focusareas: [],
        courses: [],
    });
    setDialogOpen(true);
  }

  const handleDeleteOpen = (activity: Activity) => {
    setActivityToDelete(activity);
    setDeleteConfirmOpen(true);
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingActivity(null);
    form.reset();
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue('name', name);
    if (!editingActivity) { // Only auto-generate slug for new activities
        form.setValue('slug', generateSlug(name));
    }
  }

  const confirmDelete = async () => {
    if (!activityToDelete) return;
    setIsSubmitting(true);
    try {
        await deleteActivity(activityToDelete.id);
        toast({ title: 'Success', description: 'Activity deleted successfully.' });
        await fetchActivities();
    } catch(e) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete activity.' });
    }
    setIsSubmitting(false);
    setDeleteConfirmOpen(false);
  }


  const onSubmit = async (values: ActivityFormValues) => {
    setIsSubmitting(true);
    try {
        if(editingActivity) {
            await updateActivity(editingActivity.id, values);
            toast({ title: 'Success', description: 'Activity updated successfully.' });
        } else {
            await addActivity(values);
            toast({ title: 'Success', description: 'New activity created.' });
        }
      await fetchActivities();
      handleDialogClose();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: `An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}` });
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
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {activities.map((activity) => {
                return (
                    <Card key={activity.id} className="flex flex-col">
                      <div className="relative h-40 w-full bg-secondary rounded-t-lg flex items-center justify-center">
                          {activity.imageurl ? (
                              <Image src={activity.imageurl} alt={activity.name} fill className="object-cover rounded-t-lg" />
                          ) : (
                              <ImageIcon className="h-10 w-10 text-muted-foreground" />
                          )}
                      </div>
                      <CardHeader>
                          <CardTitle className="truncate">{activity.name}</CardTitle>
                          <CardDescription className="line-clamp-2">{activity.shortdescription}</CardDescription>
                      </CardHeader>
                      <CardFooter className="mt-auto flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditOpen(activity)}>
                              <Edit className="h-4 w-4 mr-2" /> Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteOpen(activity)}>
                              <Trash2 className="h-4 w-4" />
                          </Button>
                      </CardFooter>
                    </Card>
                )
            })}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-6 flex justify-center">
        <Button onClick={handleNewOpen}>
            <Plus className="mr-2 h-4 w-4" /> Add New Activity
        </Button>
      </CardFooter>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                 <DialogHeader>
                    <DialogTitle>{editingActivity ? `Edit: ${editingActivity.name}`: 'Create New Activity'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} onChange={handleNameChange} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="slug" render={({ field }) => (
                            <FormItem><FormLabel>Slug (URL Path)</FormLabel><FormControl><Input {...field} disabled={!!editingActivity} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="shortdescription" render={({ field }) => (
                            <FormItem><FormLabel>Short Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="longdescription" render={({ field }) => (
                            <FormItem><FormLabel>Long Description</FormLabel><FormControl><Textarea className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="imageurl" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Activity Image</FormLabel>
                              <AdminImageUploadField
                                value={field.value}
                                onChange={field.onChange}
                                previewAlt={form.getValues('name') || 'Activity preview'}
                                folder="college-portal/activities"
                              />
                              <FormMessage />
                            </FormItem>
                        )} />
                         <FormField control={form.control} name="dataaihint" render={({ field }) => (
                            <FormItem><FormLabel>Image AI Hint</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="faculty_department" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Team Responsible</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a team" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="ANO">ANO</SelectItem>
                                        <SelectItem value="Instructors">Instructors</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        
                        <div>
                            <FormLabel>Key Focus Areas</FormLabel>
                            <div className="flex items-center gap-2 mt-1">
                                <Input value={newFocusArea} onChange={(e) => setNewFocusArea(e.target.value)} placeholder="e.g., Leadership" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (newFocusArea.trim()) { appendFocusArea(newFocusArea.trim()); setNewFocusArea('') }}}} />
                                <Button type="button" size="sm" onClick={() => { if(newFocusArea.trim()){ appendFocusArea(newFocusArea.trim()); setNewFocusArea(''); }}}>Add</Button>
                            </div>
                             <div className="flex flex-wrap gap-2 mt-2">
                                {focusAreaFields.map((field, index) => (
                                    <Badge key={field.id} variant="secondary" className="flex items-center gap-1">
                                        {form.getValues(`focusareas.${index}`)}
                                        <button type="button" onClick={() => removeFocusArea(index)}><X className="h-3 w-3" /></button>
                                    </Badge>
                                ))}
                            </div>
                             <FormMessage>{form.formState.errors.focusareas?.message}</FormMessage>
                        </div>
                        
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <FormLabel>Training Activities (Courses)</FormLabel>
                                <Button type="button" size="sm" variant="outline" onClick={() => appendCourse({id: '', name: '', description: ''})}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Course
                                </Button>
                            </div>
                            <div className="space-y-4">
                                {courseFields.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-[1fr_auto] gap-2 items-start border p-3 rounded-md">
                                        <div className="space-y-2">
                                            <FormField
                                                control={form.control}
                                                name={`courses.${index}.id`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">Course ID</FormLabel>
                                                        <FormControl><Input {...field} placeholder="e.g., TRN-01" /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                            )}/>
                                            <FormField
                                                control={form.control}
                                                name={`courses.${index}.name`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">Course Name</FormLabel>
                                                        <FormControl><Input {...field} placeholder="e.g. Drill & Parade" /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                            )}/>
                                            <FormField
                                                control={form.control}
                                                name={`courses.${index}.description`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">Course Description</FormLabel>
                                                        <FormControl><Textarea {...field} placeholder="Description..." /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                            )}/>
                                        </div>
                                        <Button type="button" size="icon" variant="ghost" onClick={() => removeCourse(index)} className="mt-6">
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <FormMessage className="mt-2">{form.formState.errors.courses?.message || form.formState.errors.courses?.root?.message}</FormMessage>
                        </div>


                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="ghost">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
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
                        This will permanently delete the activity: <span className="font-semibold">{activityToDelete?.name}</span> and all its related content.
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
