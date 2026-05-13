'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';

import {
    getTeamMembers,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    type TeamMember
} from '@/firebase/services/team';

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
import { useToast } from '@/hooks/use-toast';
import { Edit, Loader2, Plus, Trash2, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AdminImageUploadField } from './admin-image-upload-field';


const teamMemberFormSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  title: z.string().min(3, 'Title is required'),
  email: z.string().email('A valid email is required'),
  department: z.enum(['Bachelor of Commerce', 'Bachelor of Arts', 'Administration', 'ANO', 'Instructors']),
  expertise: z.array(z.string().min(1, "Expertise cannot be empty")).default([]),
  imageUrl: z.string().url('A valid image URL is required').or(z.literal('')),
});

type TeamMemberFormValues = z.infer<typeof teamMemberFormSchema>;

const defaultFormValues: TeamMemberFormValues = {
    name: '',
    title: '',
    email: '',
    department: 'Bachelor of Commerce',
    expertise: [],
    imageUrl: ''
};

export function AdminTeam() {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
    const [newExpertise, setNewExpertise] = useState('');
    const { toast } = useToast();

    const form = useForm<TeamMemberFormValues>({
        resolver: zodResolver(teamMemberFormSchema),
        defaultValues: defaultFormValues
    });

    const { fields: expertiseFields, append: appendExpertise, remove: removeExpertise } = useFieldArray({
        control: form.control,
        name: "expertise" as never,
    });

    const fetchTeam = async () => {
        setIsLoading(true);
        const data = await getTeamMembers();
        setTeamMembers(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchTeam();
    }, []);
    
    const handleDialogClose = () => {
        setDialogOpen(false);
        setEditingMember(null);
        form.reset(defaultFormValues);
    }

    const handleEditClick = (member: TeamMember) => {
        setEditingMember(member);
        form.reset({
            ...member,
            department: member.department as TeamMemberFormValues['department'],
            expertise: member.expertise || [],
        });
        setDialogOpen(true);
    };
    
    const handleNewClick = () => {
        setEditingMember(null);
        form.reset(defaultFormValues);
        setDialogOpen(true);
    }

    const handleDeleteClick = (member: TeamMember) => {
        setMemberToDelete(member);
        setDeleteConfirmOpen(true);
    }

    const confirmDelete = async () => {
        if (!memberToDelete) return;
        setIsSubmitting(true);
        try {
            await deleteTeamMember(memberToDelete.id);
            toast({ title: 'Success', description: 'Team member deleted.' });
            await fetchTeam();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: `Failed to delete team member. ${error instanceof Error ? error.message : ''}` });
        } finally {
            setIsSubmitting(false);
            setDeleteConfirmOpen(false);
            setMemberToDelete(null);
        }
    };


    const onSubmit = async (values: TeamMemberFormValues) => {
        setIsSubmitting(true);
        try {
            if (editingMember) {
                await updateTeamMember(editingMember.id, values);
                toast({ title: 'Success', description: 'Team member updated.' });
            } else {
                await addTeamMember(values);
                toast({ title: 'Success', description: 'Team member added.' });
            }
            await fetchTeam();
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
                ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {teamMembers.map((member) => (
                    <Card key={member.id} className="flex flex-col">
                        <CardHeader className="flex-row items-center gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={member.imageUrl} alt={member.name} data-ai-hint="person" />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                             <div>
                                <CardTitle>{member.name}</CardTitle>
                                <CardDescription>{member.title}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                             <p className="text-sm text-muted-foreground">{member.department}</p>
                             <p className="text-sm text-muted-foreground">{member.email}</p>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                             <Button variant="outline" size="sm" onClick={() => handleEditClick(member)}>
                                <Edit className="h-4 w-4 mr-2" /> Edit
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(member)}>
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </Button>
                        </CardFooter>
                    </Card>
                    ))}
                </div>
                )}
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-center">
                <Button onClick={handleNewClick}>
                    <Plus className="mr-2 h-4 w-4" /> Add New Team Member
                </Button>
            </CardFooter>

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingMember ? 'Edit' : 'Add'} Team Member</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="title" render={({ field }) => (
                                <FormItem><FormLabel>Title / Role</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="department" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Department</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select a department" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="Bachelor of Commerce">Bachelor of Commerce</SelectItem>
                                            <SelectItem value="Bachelor of Arts">Bachelor of Arts</SelectItem>
                                            <SelectItem value="Administration">Administration</SelectItem>
                                            <SelectItem value="ANO">ANO</SelectItem>
                                            <SelectItem value="Instructors">Instructors</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            
                            <div>
                                <FormLabel>Areas of Expertise</FormLabel>
                                <div className="flex items-center gap-2 mt-1">
                                    <Input value={newExpertise} onChange={(e) => setNewExpertise(e.target.value)} placeholder="e.g., Accounting" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if(newExpertise.trim()){ appendExpertise(newExpertise.trim() as never); setNewExpertise(''); }}}}/>
                                    <Button type="button" size="sm" onClick={() => { if(newExpertise.trim()){ appendExpertise(newExpertise.trim() as never); setNewExpertise(''); }}}>Add</Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {expertiseFields.map((field, index) => (
                                        <Badge key={field.id} variant="secondary" className="flex items-center gap-1">
                                            {form.getValues(`expertise.${index}`)}
                                            <button type="button" onClick={() => removeExpertise(index)}><X className="h-3 w-3" /></button>
                                        </Badge>
                                    ))}
                                </div>
                                {form.formState.errors.expertise && <FormMessage className="mt-2">{form.formState.errors.expertise.message || form.formState.errors.expertise.root?.message}</FormMessage>}
                            </div>
                            
                             <FormField control={form.control} name="imageUrl" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Profile Image</FormLabel>
                                    {field.value && (
                                        <div className="mb-2">
                                            <Avatar className="h-20 w-20">
                                                <AvatarImage src={field.value} alt={form.getValues("name")} />
                                                <AvatarFallback>{form.getValues("name")?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                    )}
                                    <AdminImageUploadField
                                      value={field.value}
                                      onChange={field.onChange}
                                      previewAlt={form.getValues("name") || 'Team member preview'}
                                      folder="college-portal/team"
                                    />
                                    <FormMessage />
                                </FormItem>
                             )} />

                            <DialogFooter>
                                <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
            
            {/* Delete Confirmation Dialog */}
             <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the profile for <span className="font-semibold">{memberToDelete?.name}</span>.
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

