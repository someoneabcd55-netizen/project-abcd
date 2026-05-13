'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Facebook, Twitter, Linkedin, Github, Instagram } from 'lucide-react';

interface SocialLink {
  platform: 'facebook' | 'twitter' | 'linkedin' | 'github' | 'instagram';
  url: string;
}

interface TeamMember {
  name: string;
  designation: string;
  photoUrl: string;
  bio?: string;
  socials?: SocialLink[];
}

interface TeamShowcaseBlockProps {
  title?: string;
  subtitle?: string;
  items?: TeamMember[];
  theme?: string;
}

const SocialIcons = {
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
  instagram: Instagram,
};

export function TeamShowcaseBlock({ title, subtitle, items, theme }: TeamShowcaseBlockProps) {
  const isTheme2 = theme === 'theme2';
  const isTheme3 = theme === 'theme3';

  const defaultItems: TeamMember[] = [
    { 
      name: 'Dr. Robert Miller', 
      designation: 'Chief Academic Officer', 
      photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80\u0026w=800', 
      bio: 'Leading our academic strategy with over 20 years of experience in higher education.',
      socials: [{ platform: 'linkedin', url: '#' }, { platform: 'twitter', url: '#' }]
    },
    { 
      name: 'Sarah Peterson', 
      designation: 'Director of Student Affairs', 
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80\u0026w=800', 
      bio: 'Dedicated to creating a vibrant and supportive campus environment for all students.',
      socials: [{ platform: 'linkedin', url: '#' }, { platform: 'instagram', url: '#' }]
    },
    { 
      name: 'Col. James Wilson', 
      designation: 'Commandant of Cadets', 
      photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80\u0026w=800', 
      bio: 'Enforcing discipline and leadership excellence across our corps of cadets.',
      socials: [{ platform: 'linkedin', url: '#' }]
    },
    { 
      name: 'Dr. Linda White', 
      designation: 'Head of Research', 
      photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80\u0026w=800', 
      bio: 'Pioneering new frontiers in scientific research and innovation.',
      socials: [{ platform: 'linkedin', url: '#' }, { platform: 'github', url: '#' }]
    },
  ];

  const displayItems = items || defaultItems;

  return (
    <section className={cn(
      "py-20 md:py-32",
      isTheme2 ? "bg-[#0a0f1e]" : isTheme3 ? "bg-white" : "bg-background"
    )}>
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="text-center mb-24 space-y-4">
            {isTheme3 && <span className="text-[#cc2936] text-[10px] font-bold uppercase tracking-[0.4em] block mb-2">Our Leadership</span>}
            <h2 className={cn(
              "text-4xl md:text-7xl font-bold tracking-tight",
              isTheme2 ? "text-white font-headline" : isTheme3 ? "text-navy font-headline uppercase" : "font-headline"
            )}>
              {title || 'Meet Our Visionaries'}
            </h2>
            <p className={cn(
              "max-w-2xl mx-auto text-lg",
              isTheme2 ? "text-gray-400 font-body" : isTheme3 ? "text-navy/60 font-body" : "text-muted-foreground"
            )}>
              {subtitle || 'A diverse team of professionals dedicated to academic excellence and institutional growth.'}
            </p>
          </div>
        )}

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {displayItems.map((member, i) => (
            <div 
              key={i}
              className={cn(
                "group relative transition-all duration-500",
                isTheme2 ? "hover:-translate-y-4" : isTheme3 ? "rounded-none" : "hover:shadow-2xl rounded-3xl"
              )}
            >
              {/* Photo Area */}
              <div className={cn(
                "relative aspect-[4/5] overflow-hidden mb-6 transition-all duration-500",
                isTheme2 ? "rounded-[2.5rem] border border-white/10" : 
                isTheme3 ? "rounded-none grayscale group-hover:grayscale-0" :
                "rounded-3xl"
              )}>
                <Image 
                  src={member.photoUrl} 
                  alt={member.name} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Theme 2 Hover Overlay */}
                {isTheme2 && (
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-indigo-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                     <p className="text-white text-sm font-body leading-relaxed transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                        {member.bio}
                     </p>
                  </div>
                )}
                
                {/* Theme 3 Red Line */}
                {isTheme3 && (
                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#cc2936] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                )}
              </div>

              {/* Info Area */}
              <div className={cn(
                "space-y-2",
                isTheme3 ? "text-left" : "text-center"
              )}>
                <h3 className={cn(
                  "text-2xl font-bold transition-colors",
                  isTheme2 ? "text-white group-hover:text-indigo-400" : isTheme3 ? "text-navy font-headline uppercase leading-tight" : "text-foreground"
                )}>
                  {member.name}
                </h3>
                <p className={cn(
                  "text-sm font-bold uppercase tracking-widest",
                  isTheme2 ? "text-indigo-400" : isTheme3 ? "text-[#cc2936]" : "text-primary"
                )}>
                  {member.designation}
                </p>
                
                {/* Theme 3 Bio (visible always) */}
                {isTheme3 && member.bio && (
                  <p className="text-gray-500 text-sm font-body leading-relaxed pt-2 line-clamp-3">
                    {member.bio}
                  </p>
                )}

                {/* Social Links */}
                <div className={cn(
                  "flex items-center gap-4 pt-4",
                  isTheme3 ? "justify-start" : "justify-center"
                )}>
                  {member.socials?.map((social, si) => {
                    const Icon = SocialIcons[social.platform];
                    return (
                      <a 
                        key={si} 
                        href={social.url} 
                        className={cn(
                          "p-2 rounded-full transition-all duration-300",
                          isTheme2 ? "bg-white/5 text-gray-400 hover:bg-indigo-500 hover:text-white" : 
                          isTheme3 ? "text-navy hover:text-[#cc2936]" :
                          "bg-secondary text-secondary-foreground hover:bg-primary hover:text-white"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
