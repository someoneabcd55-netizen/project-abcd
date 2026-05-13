'use client';

import { cn } from '@/lib/utils';
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';

export function MapLocationBlock({ 
  title, 
  address = '123 Academic Way', 
  embedUrl,
  phone = '+1 (555) 000-1234',
  email = 'admissions@modernschool.edu',
  hours = 'Mon - Fri: 8:00 AM - 6:00 PM',
  theme 
}: any) {
  const isTheme2 = theme === 'theme2';
  const isTheme3 = theme === 'theme3';

  const defaultEmbed = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215266712345!2d-73.987844!3d40.748441!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1625123456789!5m2!1sen!2sus';

  return (
    <section className={cn(
      "py-20 md:py-32",
      isTheme2 ? "bg-[#0a0f1e]" : isTheme3 ? "bg-white" : "bg-background"
    )}>
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-5 flex flex-col justify-center space-y-10 text-left">
            <h2 className={cn(
              "text-4xl md:text-6xl font-bold tracking-tight leading-tight font-headline",
              isTheme2 ? "text-white" : isTheme3 ? "text-navy uppercase" : "text-foreground"
            )}>
              {title || 'Find Us Here'}
            </h2>

            <div className="space-y-8">
              <ContactItem icon={<MapPin className="h-6 w-6" />} label="Address" value={address} theme={theme} />
              <div className="grid gap-8 sm:grid-cols-2">
                <ContactItem icon={<Phone className="h-4 w-4" />} label="Call" value={phone} theme={theme} size="sm" />
                <ContactItem icon={<Mail className="h-4 w-4" />} label="Email" value={email} theme={theme} size="sm" />
              </div>
              <ContactItem icon={<Clock className="h-6 w-6" />} label="Office Hours" value={hours} theme={theme} />
            </div>

            <div className="pt-6">
               <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-2 font-bold uppercase tracking-widest text-sm",
                  isTheme2 ? "text-indigo-400" : isTheme3 ? "text-navy" : "text-primary"
                )}
               >
                  Get Directions <ExternalLink className="h-4 w-4" />
               </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className={cn(
              "h-full min-h-[450px] overflow-hidden shadow-2xl relative",
              isTheme2 ? "rounded-[3rem]" : isTheme3 ? "rounded-none" : "rounded-3xl"
            )}>
               <iframe
                src={embedUrl || defaultEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                className={cn(
                  "transition-all duration-700",
                  isTheme2 ? "opacity-70 invert" : ""
                )}
               />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactItem({ icon, label, value, theme, size = 'md' }: any) {
    const isTheme2 = theme === 'theme2';
    const isTheme3 = theme === 'theme3';
    return (
        <div className="flex items-start gap-6 group">
            <div className={cn(
                "p-3 rounded-xl transition-all duration-300",
                isTheme2 ? "bg-white/5 text-indigo-400 border border-white/10" : 
                isTheme3 ? "bg-gray-50 text-[#cc2936] rounded-none" : "bg-primary/10 text-primary"
            )}>
                {icon}
            </div>
            <div>
                <h4 className={cn("text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-60")}>{label}</h4>
                <p className={cn(size === 'md' ? "text-lg" : "text-sm", isTheme2 ? "text-gray-300" : isTheme3 ? "text-navy" : "text-foreground")}>{value}</p>
            </div>
        </div>
    )
}
