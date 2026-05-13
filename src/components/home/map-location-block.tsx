'use client';

import { cn } from '@/lib/utils';
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';

interface MapLocationBlockProps {
  title?: string;
  address?: string;
  embedUrl?: string;
  phone?: string;
  email?: string;
  hours?: string;
  theme?: string;
}

export function MapLocationBlock({ 
  title, 
  address = '123 Academic Way, Education City, State 45678', 
  embedUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215266712345!2d-73.987844!3d40.748441!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1625123456789!5m2!1sen!2sus',
  phone = '+1 (555) 000-1234',
  email = 'admissions@modernschool.edu',
  hours = 'Mon - Fri: 8:00 AM - 6:00 PM',
  theme 
}: MapLocationBlockProps) {
  const isTheme2 = theme === 'theme2';
  const isTheme3 = theme === 'theme3';

  return (
    <section className={cn(
      "py-20 md:py-32",
      isTheme2 ? "bg-[#0a0f1e]" : isTheme3 ? "bg-white" : "bg-background"
    )}>
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-12 items-stretch">
          {/* Info Side */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-10">
            <div className="space-y-4">
              {isTheme3 && <span className="text-[#cc2936] text-[10px] font-bold uppercase tracking-[0.4em] block mb-2">Visit Our Campus</span>}
              <h2 className={cn(
                "text-4xl md:text-6xl font-bold tracking-tight leading-tight",
                isTheme2 ? "text-white font-headline" : isTheme3 ? "text-navy font-headline uppercase" : "font-headline"
              )}>
                {title || 'Find Us Here'}
              </h2>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6 group">
                 <div className={cn(
                   "p-4 rounded-2xl transition-all duration-300",
                   isTheme2 ? "bg-white/5 text-indigo-400 border border-white/10 group-hover:bg-indigo-500 group-hover:text-white" : 
                   isTheme3 ? "bg-gray-50 text-[#cc2936] rounded-none group-hover:bg-[#cc2936] group-hover:text-white" :
                   "bg-primary/10 text-primary"
                 )}>
                    <MapPin className="h-6 w-6" />
                 </div>
                 <div>
                    <h4 className={cn("text-xs font-bold uppercase tracking-widest mb-1", isTheme2 ? "text-indigo-400" : isTheme3 ? "text-[#cc2936]" : "text-primary")}>Address</h4>
                    <p className={cn("text-lg", isTheme2 ? "text-gray-300 font-body" : isTheme3 ? "text-navy font-body font-medium" : "text-foreground")}>{address}</p>
                 </div>
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <div className="flex items-start gap-6 group">
                   <div className={cn(
                     "p-3 rounded-xl transition-all duration-300",
                     isTheme2 ? "bg-white/5 text-indigo-400 border border-white/10 group-hover:bg-indigo-500 group-hover:text-white" : 
                     isTheme3 ? "bg-gray-50 text-[#cc2936] rounded-none group-hover:bg-[#cc2936] group-hover:text-white" :
                     "bg-primary/10 text-primary"
                   )}>
                      <Phone className="h-4 w-4" />
                   </div>
                   <div>
                      <h4 className={cn("text-xs font-bold uppercase tracking-widest mb-1", isTheme2 ? "text-indigo-400" : isTheme3 ? "text-[#cc2936]" : "text-primary")}>Call</h4>
                      <p className={cn("text-sm", isTheme2 ? "text-gray-400 font-body" : isTheme3 ? "text-navy font-body font-medium" : "text-muted-foreground")}>{phone}</p>
                   </div>
                </div>

                <div className="flex items-start gap-6 group">
                   <div className={cn(
                     "p-3 rounded-xl transition-all duration-300",
                     isTheme2 ? "bg-white/5 text-indigo-400 border border-white/10 group-hover:bg-indigo-500 group-hover:text-white" : 
                     isTheme3 ? "bg-gray-50 text-[#cc2936] rounded-none group-hover:bg-[#cc2936] group-hover:text-white" :
                     "bg-primary/10 text-primary"
                   )}>
                      <Mail className="h-4 w-4" />
                   </div>
                   <div>
                      <h4 className={cn("text-xs font-bold uppercase tracking-widest mb-1", isTheme2 ? "text-indigo-400" : isTheme3 ? "text-[#cc2936]" : "text-primary")}>Email</h4>
                      <p className={cn("text-sm", isTheme2 ? "text-gray-400 font-body" : isTheme3 ? "text-navy font-body font-medium" : "text-muted-foreground")}>{email}</p>
                   </div>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                 <div className={cn(
                   "p-4 rounded-2xl transition-all duration-300",
                   isTheme2 ? "bg-white/5 text-indigo-400 border border-white/10 group-hover:bg-indigo-500 group-hover:text-white" : 
                   isTheme3 ? "bg-gray-50 text-[#cc2936] rounded-none group-hover:bg-[#cc2936] group-hover:text-white" :
                   "bg-primary/10 text-primary"
                 )}>
                    <Clock className="h-6 w-6" />
                 </div>
                 <div>
                    <h4 className={cn("text-xs font-bold uppercase tracking-widest mb-1", isTheme2 ? "text-indigo-400" : isTheme3 ? "text-[#cc2936]" : "text-primary")}>Office Hours</h4>
                    <p className={cn("text-lg", isTheme2 ? "text-gray-300 font-body" : isTheme3 ? "text-navy font-body font-medium" : "text-foreground")}>{hours}</p>
                 </div>
              </div>
            </div>

            <div className="pt-10">
               <a 
                href={`https://www.google.com/maps/search/?api=1\u0026query=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-2 font-bold uppercase tracking-widest text-sm",
                  isTheme2 ? "text-indigo-400 hover:text-indigo-300" : 
                  isTheme3 ? "text-navy hover:text-[#cc2936]" :
                  "text-primary hover:underline"
                )}
               >
                  Get Directions <ExternalLink className="h-4 w-4" />
               </a>
            </div>
          </div>

          {/* Map Side */}
          <div className="lg:col-span-7">
            <div className={cn(
              "h-full min-h-[450px] overflow-hidden shadow-2xl relative",
              isTheme2 ? "rounded-[3rem] border border-white/10" : 
              isTheme3 ? "rounded-none border-8 border-[#f4f6f9]" :
              "rounded-3xl"
            )}>
               <iframe
                src={embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className={cn(
                  "grayscale group-hover:grayscale-0 transition-all duration-700",
                  isTheme2 ? "opacity-70 invert" : ""
                )}
               />
               
               {/* Overlay for Theme 2 to match aesthetic */}
               {isTheme2 && (
                 <div className="absolute inset-0 pointer-events-none border-[20px] border-[#0a0f1e] rounded-[3rem]" />
               )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
