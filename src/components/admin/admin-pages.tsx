
'use client';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  getPagesAdmin,
  reorderPages,
  updatePage,
  deletePage,
  createPage,
  type Page,
} from '@/firebase/services/pages';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit, Trash2, Eye, EyeOff, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CardContent, CardFooter } from '@/components/ui/card';
import { AdminPageEditor } from './admin-page-editor';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const pageFormSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  slug: z.string().min(1, 'Slug is required.').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens.'),
});

type PageFormValues = z.infer<typeof pageFormSchema>;

function SortablePageItem({ page, onUpdate }: { page: Page; onUpdate: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: page.id });
  const [editorOpen, setEditorOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const { toast } = useToast();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleToggleVisibility = async () => {
    try {
      await updatePage(page.id, { visible: !page.visible });
      toast({ title: 'Success', description: `Page ${page.visible ? 'hidden' : 'shown'}.` });
      onUpdate();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update page visibility.' });
    }
  };

  const handleDelete = async () => {
    try {
      await deletePage(page.id);
      toast({ title: 'Success', description: 'Page deleted successfully.' });
      onUpdate();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete page.' });
    } finally {
      setDeleteConfirmOpen(false);
    }
  };
  
  const PROTECTED_SLUGS = ['home', 'departments', 'activities', 'faculty', 'admissions', 'gallery', 'events', 'contact'];
  const isContentManagedExternally = PROTECTED_SLUGS.includes(page.slug);
  const isDeleteDisabled = PROTECTED_SLUGS.includes(page.slug);


  return (
    <>
      <div ref={setNodeRef} style={style} className="flex items-center gap-4 rounded-lg border bg-background p-3 shadow-sm">
        <div {...attributes} {...listeners} className="cursor-grab p-2">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-grow font-medium">{page.title}</div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleToggleVisibility} title={page.visible ? 'Hide page' : 'Show page'}>
            {page.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setEditorOpen(true)} title="Edit page contents" disabled={isContentManagedExternally}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleteConfirmOpen(true)} title="Delete page" disabled={isDeleteDisabled}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>

      {!isContentManagedExternally && (
        <AdminPageEditor page={page} open={editorOpen} onOpenChange={setEditorOpen} onUpdate={onUpdate} />
      )}

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this page?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the page "{page.title}" and all its content blocks. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function NewPageDialog({ onPageCreated }: { onPageCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageFormSchema),
    defaultValues: { title: '', slug: '' }
  });

  const generateSlug = (title: string) => title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue('title', title);
    form.setValue('slug', generateSlug(title));
  };

  const onSubmit = async (values: PageFormValues) => {
    setIsSubmitting(true);
    try {
      await createPage(values);
      toast({ title: 'Success', description: 'Page created successfully.' });
      onPageCreated();
      setOpen(false);
      form.reset();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to create page.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New Page
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Page</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Page Title</FormLabel>
                  <FormControl>
                    <Input {...field} onChange={handleTitleChange} placeholder="e.g., About Us" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Page URL (Slug)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., about-us" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Page
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


export function AdminPages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const fetchPages = async () => {
    setIsLoading(true);
    try {
      const pagesData = await getPagesAdmin();
      setPages(pagesData);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load pages.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = pages.findIndex((p) => p.id === active.id);
      const newIndex = pages.findIndex((p) => p.id === over.id);
      const newPages = arrayMove(pages, oldIndex, newIndex);

      setPages(newPages); // Optimistic update

      const reorderPayload = newPages.map((p, index) => ({ id: p.id, order_position: index }));

      try {
        await reorderPages(reorderPayload);
        toast({ title: 'Success', description: 'Page order saved.' });
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to save new order.' });
        fetchPages(); // Revert on failure
      }
    }
  };

  return (
    <>
      <CardContent>
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={pages.map(p => p.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {pages.map((page) => (
                  <SortablePageItem key={page.id} page={page} onUpdate={fetchPages} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CardContent>
      <CardFooter className="border-t pt-6 flex justify-center">
        <NewPageDialog onPageCreated={fetchPages} />
      </CardFooter>
    </>
  );
}
