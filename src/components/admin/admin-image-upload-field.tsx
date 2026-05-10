'use client';

import { useEffect, useMemo, useState } from 'react';
import { ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AdminImageUploadFieldProps {
  value?: string;
  onChange: (value: string) => void;
  previewAlt: string;
  folder?: string;
  placeholder?: string;
}

export function AdminImageUploadField({
  value,
  onChange,
  previewAlt,
  folder = 'college-portal/uploads',
  placeholder = 'https://example.com/image.png',
}: AdminImageUploadFieldProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!selectedFile) {
      setLocalPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setLocalPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const previewSrc = useMemo(() => localPreview || value || '', [localPreview, value]);

  const handleFileChange = async (file: File | null) => {
    setSelectedFile(file);

    if (!file) {
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/upload/cloudinary', {
        method: 'POST',
        body: formData,
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || 'Upload failed.');
      }

      onChange(payload.secureUrl);
      toast({
        title: 'Image Uploaded',
        description: 'Cloudinary upload finished successfully.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-dashed p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium">
          <ImagePlus className="h-4 w-4 text-primary" />
          Upload image file
        </div>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        />
        <p className="mt-2 text-sm text-muted-foreground">
          Choose a file to upload to Cloudinary, or paste an image URL below.
        </p>
      </div>

      {previewSrc ? (
        <div className="rounded-lg border p-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-medium">Preview</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedFile(null);
                onChange('');
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
          <div className="overflow-hidden rounded-md border bg-muted/30">
            <img
              src={previewSrc}
              alt={previewAlt}
              className="h-48 w-full object-cover"
            />
          </div>
        </div>
      ) : null}

      <div className="space-y-2">
        <Input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        {isUploading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading to Cloudinary...
          </div>
        ) : null}
      </div>
    </div>
  );
}
