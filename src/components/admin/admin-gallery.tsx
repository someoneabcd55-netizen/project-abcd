'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import {
  getGlimpsesImages,
  addGlimpsesItem,
  deleteGlimpsesItem,
  updateGlimpsesItem,
  reorderGlimpsesImages,
  type GlimpsesImage,
} from '@/firebase/services/Glimpses';

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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2, Plus, Edit, Upload, X } from 'lucide-react';
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


const GlimpsesFormSchema = z.object({
  alt: z.string().min(1, 'Alt text is required'),
  src: z.string().url('A valid image URL is required').or(z.literal('')),
  dataAiHint: z.string().min(1, 'AI hint is required'),
});

type GlimpsesFormValues = z.infer<typeof GlimpsesFormSchema>;

function SortableImage({ image, onEdit, onDelete }: { image: GlimpsesImage, onEdit: () => void, onDelete: () => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: image.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="relative group aspect-square"
        >
            <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover rounded-md"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={onEdit}
                    title="Edit Image"
                >
                    <Edit className="h-4 w-4" />
                </Button>
                <Button
                    variant="destructive"
                    size="icon"
                    onClick={onDelete}
                    title="Delete Image"
                >
                    <Trash2 className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}

export function AdminGlimpses({ onGlimpsesUpdate }: { onGlimpsesUpdate: () => void }) {
  const [images, setImages] = useState<GlimpsesImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [imageToInteract, setImageToInteract] = useState<GlimpsesImage | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const { toast } = useToast();

  const addForm = useForm<GlimpsesFormValues>({
    resolver: zodResolver(GlimpsesFormSchema),
    defaultValues: { alt: '', src: '', dataAiHint: '' },
  });
  
  const editForm = useForm<GlimpsesFormValues>({
    resolver: zodResolver(GlimpsesFormSchema),
  });

  const fetchImages = async () => {
    setIsLoading(true);
    const data = await getGlimpsesImages();
    setImages(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (!uploadFile) {
      setUploadPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(uploadFile);
    setUploadPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [uploadFile]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 }}));

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
        const oldIndex = images.findIndex((img) => img.id === active.id);
        const newIndex = images.findIndex((img) => img.id === over.id);
        const newOrder = arrayMove(images, oldIndex, newIndex);
        setImages(newOrder); // Optimistic UI update

        try {
            const reorderPayload = newOrder.map((img, index) => ({ id: img.id, order_position: index }));
            await reorderGlimpsesImages(reorderPayload);
            toast({ title: 'Success', description: 'Glimpses order updated.' });
            onGlimpsesUpdate();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to update order.' });
            setImages(images); // Revert on failure
        }
    }
  };

  const handleDeleteClick = (image: GlimpsesImage) => {
    setImageToInteract(image);
    setDeleteConfirmOpen(true);
  };
  
  const handleEditClick = (image: GlimpsesImage) => {
    setImageToInteract(image);
    editForm.reset(image);
    setEditDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!imageToInteract) return;
    setIsSubmitting(true);
    try {
      await deleteGlimpsesItem(imageToInteract.id, imageToInteract.src, imageToInteract.publicId);
      toast({ title: 'Success', description: 'Image deleted.' });
      await fetchImages();
      onGlimpsesUpdate();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete image.' });
    } finally {
      setIsSubmitting(false);
      setDeleteConfirmOpen(false);
      setImageToInteract(null);
    }
  };

  const onAddSubmit = async (values: GlimpsesFormValues) => {
    setIsSubmitting(true);
    try {
        let src = values.src;
        let publicId: string | undefined;

        if (uploadFile) {
            setIsUploadingFile(true);
            const uploadFormData = new FormData();
            uploadFormData.append('file', uploadFile);

            const response = await fetch('/api/upload/cloudinary', {
                method: 'POST',
                body: uploadFormData,
            });

            const payload = await response.json();
            if (!response.ok) {
                throw new Error(payload?.error || 'Cloudinary upload failed.');
            }

            src = payload.secureUrl;
            publicId = payload.publicId;
        }

        if (!src) {
            throw new Error('Provide an image URL or upload an image file.');
        }

        const currentMaxOrder = images.reduce((max, img) => Math.max(max, img.order_position), -1);
        await addGlimpsesItem({
            ...values,
            src,
            publicId,
            order_position: currentMaxOrder + 1,
        });
        toast({ title: 'Success', description: 'Image added to Glimpses.' });
        await fetchImages();
        onGlimpsesUpdate();
        addForm.reset({ alt: '', src: '', dataAiHint: '' });
        setUploadFile(null);
        setUploadPreview(null);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        toast({ variant: 'destructive', title: 'Error', description: message });
    } finally {
        setIsUploadingFile(false);
        setIsSubmitting(false);
    }
  };
  
  const onEditSubmit = async (values: GlimpsesFormValues) => {
    if (!imageToInteract) return;
    setIsSubmitting(true);
    try {
        await updateGlimpsesItem(imageToInteract.id, values);
        toast({ title: 'Success', description: 'Image updated.' });
        await fetchImages();
        onGlimpsesUpdate();
        setEditDialogOpen(false);
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
        ) : images.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">The Glimpses is empty.</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={images} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {images.map((image) => (
                      <SortableImage 
                          key={image.id}
                          image={image}
                          onEdit={() => handleEditClick(image)}
                          onDelete={() => handleDeleteClick(image)}
                      />
                  ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CardContent>
      <CardFooter className="border-t pt-6">
        <div className="w-full">
            <h3 className="text-lg font-medium mb-4">Add New Image</h3>
             <Form {...addForm}>
                <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-6">
                    <div className="space-y-3 rounded-lg border border-dashed p-4">
                        <div className="flex items-center gap-2">
                            <Upload className="h-4 w-4 text-primary" />
                            <FormLabel htmlFor="Glimpses-file" className="m-0">Upload Image File</FormLabel>
                        </div>
                        <Input
                            id="Glimpses-file"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                        />
                        <p className="text-sm text-muted-foreground">
                            This uploads straight to Cloudinary. URL paste is optional below.
                        </p>
                        {uploadFile && (
                            <div className="rounded-md border bg-muted/40 p-3">
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium">{uploadFile.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setUploadFile(null)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                                {uploadPreview && (
                                    <div className="relative h-48 overflow-hidden rounded-md">
                                        <Image
                                            src={uploadPreview}
                                            alt="Upload preview"
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                     <FormField control={addForm.control} name="src" render={({ field }) => (
                        <FormItem><FormLabel>Image URL (Optional)</FormLabel><FormControl><Input {...field} placeholder="https://example.com/image.png" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField control={addForm.control} name="alt" render={({ field }) => (
                            <FormItem><FormLabel>Image Description (Alt Text)</FormLabel><FormControl><Input {...field} placeholder="e.g., Students at the annual sports day" /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={addForm.control} name="dataAiHint" render={({ field }) => (
                            <FormItem><FormLabel>AI Hint</FormLabel><FormControl><Input {...field} placeholder="e.g., campus event" /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                     <Button type="submit" disabled={isSubmitting}>
                        {(isSubmitting || isUploadingFile) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Plus className="mr-2 h-4 w-4" />
                        Upload to Glimpses
                    </Button>
                </form>
            </Form>
        </div>
      </CardFooter>
      
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Image Details</DialogTitle>
            </DialogHeader>
            <Form {...editForm}>
                 <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-6 py-4">
                    <FormField control={editForm.control} name="src" render={({ field }) => (
                        <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} readOnly disabled /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={editForm.control} name="alt" render={({ field }) => (
                        <FormItem><FormLabel>Image Description (Alt Text)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={editForm.control} name="dataAiHint" render={({ field }) => (
                        <FormItem><FormLabel>AI Hint</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
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
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the image from your Glimpses: <span className="font-semibold">{imageToInteract?.alt}</span>. This action cannot be undone.
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

