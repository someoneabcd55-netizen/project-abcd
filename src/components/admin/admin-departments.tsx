'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';

import {
  getDepartments,
  updateDepartment,
  addDepartment,
  deleteDepartment,
  type Department,
} from '@/firebase/services/departments';

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
import { Edit, Loader2, Building2, X, Plus, Trash2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import Image from 'next/image';
import { AdminImageUploadField } from './admin-image-upload-field';

const courseSchema = z.object({
    id: z.string().min(1, "Course ID is required"),
    name: z.string().min(1, "Course name is required"),
    description: z.string().min(1, "Course description is required"),
});

const departmentFormSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  slug: z.string().min(3, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens.'),
  shortdescription: z.string().min(10, 'Short description is required'),
  longdescription: z.string().min(20, 'Long description is required'),
  imageurl: z.string().url('A valid image URL is required'),
  dataaihint: z.string().min(3, 'AI hint is required'),
  researchareas: z.array(z.string().min(1, "Research area cannot be empty")).min(1, 'At least one research area is required'),
  courses: z.array(courseSchema).min(1, 'At least one course is required'),
});

type DepartmentFormValues = z.infer<typeof departmentFormSchema>;

export function AdminDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);
  const [newResearchArea, setNewResearchArea] = useState('');
  const { toast } = useToast();

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
  });
  
  const generateSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const { fields: researchAreaFields, append: appendResearchArea, remove: removeResearchArea } = useFieldArray({
    control: form.control,
    name: "researchareas",
  });
  
  const { fields: courseFields, append: appendCourse, remove: removeCourse } = useFieldArray({
    control: form.control,
    name: "courses",
  });

  const fetchDepartments = async () => {
    setIsLoading(true);
    const data = await getDepartments();
    setDepartments(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleEditOpen = (department: Department) => {
    setEditingDepartment(department);
    form.reset({
        ...department,
        researchareas: department.researchareas || [],
        courses: department.courses || [],
    });
    setDialogOpen(true);
  };

  const handleNewOpen = () => {
    setEditingDepartment(null);
    form.reset({
        name: '',
        slug: '',
        shortdescription: '',
        longdescription: '',
        imageurl: '',
        dataaihint: '',
        researchareas: [],
        courses: [],
    });
    setDialogOpen(true);
  }

  const handleDeleteOpen = (department: Department) => {
    setDepartmentToDelete(department);
    setDeleteConfirmOpen(true);
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingDepartment(null);
    form.reset();
  }
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue('name', name);
    if (!editingDepartment) { // Only auto-generate slug for new departments
        form.setValue('slug', generateSlug(name));
    }
  }

  const confirmDelete = async () => {
    if (!departmentToDelete) return;
    setIsSubmitting(true);
    try {
        await deleteDepartment(departmentToDelete.id);
        toast({ title: 'Success', description: 'Department deleted successfully.' });
        await fetchDepartments();
    } catch(e) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete department.' });
    }
    setIsSubmitting(false);
    setDeleteConfirmOpen(false);
  }

  const onSubmit = async (values: DepartmentFormValues) => {
    setIsSubmitting(true);
    try {
        if(editingDepartment) {
            await updateDepartment(editingDepartment.id, values);
            toast({ title: 'Success', description: 'Department updated successfully.' });
        } else {
            await addDepartment(values);
            toast({ title: 'Success', description: 'New department created.' });
        }
      await fetchDepartments();
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
            {departments.map((dept) => (
                <Card key={dept.id} className="flex flex-col">
                  <div className="relative h-40 w-full">
                      <Image src={dept.imageurl} alt={dept.name} fill className="object-cover rounded-t-lg" />
                  </div>
                  <CardHeader>
                      <CardTitle className="truncate">{dept.name}</CardTitle>
                      <CardDescription className="line-clamp-2">{dept.shortdescription}</CardDescription>
                  </CardHeader>
                  <CardFooter className="mt-auto flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditOpen(dept)}>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteOpen(dept)}>
                          <Trash2 className="h-4 w-4" />
                      </Button>
                  </CardFooter>
                </Card>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-6 flex justify-center">
        <Button onClick={handleNewOpen}>
            <Plus className="mr-2 h-4 w-4" /> Add New Department
        </Button>
      </CardFooter>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                 <DialogHeader>
                    <DialogTitle>{editingDepartment ? `Edit: ${editingDepartment.name}` : 'Create New Department'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} onChange={handleNameChange} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="slug" render={({ field }) => (
                            <FormItem><FormLabel>Slug (URL Path)</FormLabel><FormControl><Input {...field} disabled={!!editingDepartment} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="shortdescription" render={({ field }) => (
                            <FormItem><FormLabel>Short Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="longdescription" render={({ field }) => (
                            <FormItem><FormLabel>Long Description</FormLabel><FormControl><Textarea className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="imageurl" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Department Image</FormLabel>
                              <AdminImageUploadField
                                value={field.value}
                                onChange={field.onChange}
                                previewAlt={form.getValues('name') || 'Department preview'}
                                folder="college-portal/departments"
                              />
                              <FormMessage />
                            </FormItem>
                        )} />
                         <FormField control={form.control} name="dataaihint" render={({ field }) => (
                            <FormItem><FormLabel>Image AI Hint</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        
                        <div>
                            <FormLabel>Research Areas</FormLabel>
                            <div className="flex items-center gap-2 mt-1">
                                <Input value={newResearchArea} onChange={(e) => setNewResearchArea(e.target.value)} placeholder="e.g., Artificial Intelligence" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (newResearchArea.trim()) { appendResearchArea(newResearchArea.trim()); setNewResearchArea('') }}}} />
                                <Button type="button" size="sm" onClick={() => { if(newResearchArea.trim()){ appendResearchArea(newResearchArea.trim()); setNewResearchArea(''); }}}>Add</Button>
                            </div>
                             <div className="flex flex-wrap gap-2 mt-2">
                                {researchAreaFields.map((field, index) => (
                                    <Badge key={field.id} variant="secondary" className="flex items-center gap-1">
                                        {form.getValues(`researchareas.${index}`)}
                                        <button type="button" onClick={() => removeResearchArea(index)}><X className="h-3 w-3" /></button>
                                    </Badge>
                                ))}
                            </div>
                             <FormMessage>{form.formState.errors.researchareas?.message}</FormMessage>
                        </div>
                        
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <FormLabel>Featured Courses</FormLabel>
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
                                                        <FormControl><Input {...field} placeholder="e.g. CS101" /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                            )}/>
                                            <FormField
                                                control={form.control}
                                                name={`courses.${index}.name`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">Course Name</FormLabel>
                                                        <FormControl><Input {...field} placeholder="e.g. Intro to Programming" /></FormControl>
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
                        This will permanently delete the department: <span className="font-semibold">{departmentToDelete?.name}</span> and all its related content.
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
