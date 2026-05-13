'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Loader2, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAppearanceSettings, updateTheme, type Theme } from '@/firebase/services/settings';
import { cn } from '@/lib/utils';

export function AdminTheme() {
  const [activeTheme, setActiveTheme] = useState<Theme>('theme1');
  const [selectedTheme, setSelectedTheme] = useState<Theme>('theme1');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function loadSettings() {
      const settings = await getAppearanceSettings();
      setActiveTheme(settings.theme);
      setSelectedTheme(settings.theme);
      setIsLoading(false);
    }
    loadSettings();
  }, []);

  const handleApplyTheme = async () => {
    setIsSaving(true);
    try {
      await updateTheme(selectedTheme);
      setActiveTheme(selectedTheme);
      toast({
        title: 'Theme Applied',
        description: `Successfully switched to ${selectedTheme === 'theme1' ? 'Classic Clean' : 'Professional Dark'}.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to apply theme settings.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <CardContent className="space-y-8 pt-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Theme 1 Card */}
        <div
          onClick={() => setSelectedTheme('theme1')}
          className={cn(
            'group relative cursor-pointer overflow-hidden rounded-xl border-2 transition-all hover:shadow-lg',
            selectedTheme === 'theme1' ? 'border-primary' : 'border-border hover:border-muted-foreground'
          )}
        >
          <div className="bg-white p-6 aspect-[16/10] flex flex-col gap-4">
             <div className="h-4 w-2/3 bg-slate-100 rounded" />
             <div className="space-y-2">
                <div className="h-8 w-full bg-slate-200 rounded" />
                <div className="h-4 w-full bg-slate-100 rounded" />
                <div className="h-4 w-3/4 bg-slate-100 rounded" />
             </div>
             <div className="mt-auto h-10 w-32 bg-slate-800 rounded-md" />
          </div>
          <div className="bg-muted p-4 flex items-center justify-between">
            <div>
                <p className="font-semibold">Classic Clean</p>
                <p className="text-xs text-muted-foreground">Standard school interface</p>
            </div>
            {selectedTheme === 'theme1' && (
              <div className="rounded-full bg-primary p-1 text-primary-foreground">
                <Check className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>

        {/* Theme 2 Card (Professional Dark) */}
        <div
          onClick={() => setSelectedTheme('theme2')}
          className={cn(
            'group relative cursor-pointer overflow-hidden rounded-xl border-2 transition-all hover:shadow-lg',
            selectedTheme === 'theme2' ? 'border-primary' : 'border-border hover:border-muted-foreground'
          )}
        >
          <div className="bg-[#0a0f1e] p-6 aspect-[16/10] flex flex-col gap-4 border-b border-white/5">
             <div className="h-4 w-2/3 bg-indigo-500/20 rounded border border-indigo-500/30" />
             <div className="space-y-2">
                <div className="h-8 w-full bg-white/10 rounded" />
                <div className="h-4 w-full bg-white/5 rounded" />
                <div className="h-4 w-3/4 bg-white/5 rounded" />
             </div>
             <div className="mt-auto h-10 w-32 bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.4)]" />
          </div>
          <div className="bg-[#111827] p-4 flex items-center justify-between text-white">
            <div>
                <p className="font-semibold text-white">Professional Dark</p>
                <p className="text-xs text-gray-400 font-body">Premium, bold aesthetic</p>
            </div>
            {selectedTheme === 'theme2' && (
              <div className="rounded-full bg-primary p-1 text-primary-foreground">
                <Check className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>

        {/* Theme 3 Card (Professional Light) */}
        <div
          onClick={() => setSelectedTheme('theme3')}
          className={cn(
            'group relative cursor-pointer overflow-hidden rounded-xl border-2 transition-all hover:shadow-lg',
            selectedTheme === 'theme3' ? 'border-primary' : 'border-border hover:border-muted-foreground'
          )}
        >
          <div className="bg-white p-6 aspect-[16/10] flex flex-col gap-4 border-b border-gray-100">
             <div className="flex gap-2">
                <div className="h-4 w-12 bg-red-500/10 rounded border border-red-500/20" />
                <div className="h-4 w-12 bg-navy/5 rounded" />
             </div>
             <div className="space-y-2">
                <div className="h-10 w-full bg-[#0d1b3e] rounded" />
                <div className="h-3 w-full bg-gray-100 rounded" />
                <div className="h-3 w-2/3 bg-gray-100 rounded" />
             </div>
             <div className="mt-auto h-10 w-32 bg-[#cc2936] rounded-md shadow-md" />
          </div>
          <div className="bg-[#f4f6f9] p-4 flex items-center justify-between">
            <div>
                <p className="font-semibold text-[#0d1b3e]">Professional Light</p>
                <p className="text-xs text-gray-500 font-body">NCC-inspired, impactful</p>
            </div>
            {selectedTheme === 'theme3' && (
              <div className="rounded-full bg-primary p-1 text-primary-foreground">
                <Check className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button 
          onClick={handleApplyTheme} 
          disabled={isSaving || selectedTheme === activeTheme}
          className="px-8"
        >
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Apply Theme
        </Button>
      </div>
    </CardContent>
  );
}
