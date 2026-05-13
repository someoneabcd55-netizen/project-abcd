import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Facebook, Twitter, Linkedin, Github, Instagram, Mail, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const SocialIcons = {
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
  instagram: Instagram,
};

export function TeamShowcaseBlock({ title, subtitle, items, theme }: any) {
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const isTheme2 = theme === 'theme2';
  const isTheme3 = theme === 'theme3';

  const displayItems = items || [];

  return (
    <section className={cn(
      "py-20 md:py-32",
      isTheme2 ? "bg-[#0a0f1e]" : isTheme3 ? "bg-white" : "bg-background"
    )}>
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="text-center mb-24 space-y-4">
            <h2 className={cn(
              "text-4xl md:text-7xl font-bold tracking-tight font-headline",
              isTheme2 ? "text-white" : isTheme3 ? "text-navy uppercase" : "text-foreground"
            )}>
              {title || 'Meet Our Visionaries'}
            </h2>
            {subtitle && <p className="max-w-2xl mx-auto text-lg opacity-80">{subtitle}</p>}
          </div>
        )}

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {displayItems.map((member: any, i: number) => (
            <div 
              key={i} 
              className="group text-center cursor-pointer"
              onClick={() => setSelectedMember(member)}
            >
              <div className={cn(
                "relative aspect-[4/5] overflow-hidden mb-6 rounded-3xl transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2",
                isTheme3 && "rounded-none grayscale group-hover:grayscale-0"
              )}>
                <Image 
                  src={member.photoUrl || 'https://picsum.photos/seed/person/400/500'} 
                  alt={member.name} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white/90 text-navy px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform">View Profile</span>
                </div>
              </div>
              <h3 className={cn("text-2xl font-bold", isTheme3 && "uppercase font-headline")}>{member.name}</h3>
              <p className="text-sm font-bold uppercase text-primary tracking-widest">{member.designation}</p>
              {member.department && (
                <p className="text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-tighter">
                  {member.department}
                </p>
              )}
              {member.bio && <p className="text-sm text-muted-foreground mt-4 line-clamp-2 italic">"{member.bio}"</p>}
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden border-none shadow-3xl bg-white rounded-3xl">
          <DialogHeader className="sr-only">
            <DialogTitle>{selectedMember?.name || 'Member Profile'}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col md:flex-row h-full">
            <div className="md:w-2/5 relative h-64 md:h-auto min-h-[400px]">
              <Image 
                src={selectedMember?.photoUrl || 'https://picsum.photos/seed/person/400/500'} 
                alt={selectedMember?.name || 'Faculty Member'} 
                fill 
                className="object-cover"
              />
            </div>
            <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center bg-white">
              <div className="space-y-6">
                <div>
                  <h2 className="text-4xl font-black text-navy uppercase tracking-tight leading-none mb-2">{selectedMember?.name}</h2>
                  <p className="text-lg font-bold text-primary uppercase tracking-widest">{selectedMember?.designation}</p>
                  {selectedMember?.department && (
                    <p className="text-sm font-semibold text-muted-foreground mt-1 uppercase">
                      {selectedMember.department}
                    </p>
                  )}
                </div>

                <div className="w-12 h-1 bg-primary/20 rounded-full" />

                {selectedMember?.bio && (
                  <p className="text-muted-foreground leading-relaxed text-lg italic">
                    "{selectedMember.bio}"
                  </p>
                )}

                {selectedMember?.expertise && selectedMember.expertise.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Specialization</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.expertise.map((tag: string, tid: number) => (
                        <span key={tid} className="px-3 py-1 bg-muted text-navy text-xs font-bold rounded-lg uppercase tracking-tight">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedMember?.email && (
                  <a 
                    href={`mailto:${selectedMember.email}`} 
                    className="inline-flex items-center gap-3 text-navy font-bold hover:text-primary transition-colors bg-muted/30 p-4 rounded-2xl w-full"
                  >
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Email Contact</span>
                      <span className="text-sm">{selectedMember.email}</span>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

