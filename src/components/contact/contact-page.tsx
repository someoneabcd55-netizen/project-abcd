'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin, ChevronDown, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function ContactPageContent({ theme }: { theme?: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const isTheme2 = theme === 'theme2';
  const isTheme3 = theme === 'theme3';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    toast({
      title: "Message Sent!",
      description: "We'll get back to you as soon as possible.",
    });
  };

  const directorates = [
    { name: "Andhra Pradesh & Telangana", location: "Secunderabad", email: "ncc.ap-ts@gov.in" },
    { name: "Bihar & Jharkhand", location: "Patna", email: "ncc.bih-jhar@gov.in" },
    { name: "Delhi", location: "Delhi", email: "ncc.delhi@gov.in" },
    { name: "Gujarat", location: "Ahmedabad", email: "ncc.guj@gov.in" },
    { name: "Jammu & Kashmir", location: "Srinagar", email: "ncc.jk@gov.in" },
    { name: "Karnataka & Goa", location: "Bengaluru", email: "ncc.kar-goa@gov.in" },
  ];

  if (isTheme3) {
    return (
      <div className="space-y-24">
        {/* HQ Contact Section */}
        <div className="grid gap-0 lg:grid-cols-2 shadow-2xl overflow-hidden">
          {/* Left Panel: Info Card */}
          <div className="bg-[#0d1b3e] p-12 md:p-20 text-white relative">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
             <div className="relative z-10 space-y-12">
                <div>
                   <span className="text-[#cc2936] text-xs font-bold tracking-[0.3em] uppercase block mb-6">Headquarters</span>
                   <h2 className="text-4xl md:text-5xl font-bold font-headline uppercase leading-tight">National Cadet Corps <br />Directorate General</h2>
                </div>
                
                <div className="space-y-8">
                   <div className="flex items-start gap-6">
                      <div className="h-12 w-12 rounded-none bg-[#cc2936] flex items-center justify-center shrink-0">
                         <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                         <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Address</p>
                         <p className="text-lg font-body">West Block-IV, R.K. Puram, New Delhi - 110066</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-6">
                      <div className="h-12 w-12 rounded-none bg-[#cc2936] flex items-center justify-center shrink-0">
                         <Phone className="h-6 w-6 text-white" />
                      </div>
                      <div>
                         <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Phone</p>
                         <p className="text-lg font-body">+91 11 26173000</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-6">
                      <div className="h-12 w-12 rounded-none bg-[#cc2936] flex items-center justify-center shrink-0">
                         <Mail className="h-6 w-6 text-white" />
                      </div>
                      <div>
                         <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Email</p>
                         <p className="text-lg font-body">hq.ncc@nic.in</p>
                      </div>
                   </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex items-center gap-6">
                   <Clock className="h-5 w-5 text-[#cc2936]" />
                   <div>
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Office Hours</p>
                      <p className="text-sm font-body">Mon - Fri: 09:00 AM - 05:30 PM</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Right Panel: Form */}
          <div className="bg-white p-12 md:p-20 flex items-center">
             <form onSubmit={handleSubmit} className="w-full space-y-10">
                <div className="grid gap-10 md:grid-cols-2">
                   <div className="relative group">
                      <Input 
                        placeholder="Full Name" 
                        required 
                        className="border-t-0 border-x-0 border-b-2 border-gray-100 rounded-none px-0 h-14 bg-transparent text-[#0d1b3e] placeholder:text-gray-300 focus-visible:ring-0 focus-visible:border-[#cc2936] transition-all"
                      />
                   </div>
                   <div className="relative group">
                      <Input 
                        type="email" 
                        placeholder="Email Address" 
                        required 
                        className="border-t-0 border-x-0 border-b-2 border-gray-100 rounded-none px-0 h-14 bg-transparent text-[#0d1b3e] placeholder:text-gray-300 focus-visible:ring-0 focus-visible:border-[#cc2936] transition-all"
                      />
                   </div>
                </div>
                <div className="relative group">
                   <Input 
                     placeholder="Subject" 
                     required 
                     className="border-t-0 border-x-0 border-b-2 border-gray-100 rounded-none px-0 h-14 bg-transparent text-[#0d1b3e] placeholder:text-gray-300 focus-visible:ring-0 focus-visible:border-[#cc2936] transition-all"
                   />
                </div>
                <div className="relative group">
                   <Textarea 
                     placeholder="How can we help you?" 
                     required 
                     className="min-h-[150px] border-t-0 border-x-0 border-b-2 border-gray-100 rounded-none px-0 bg-transparent text-[#0d1b3e] placeholder:text-gray-300 focus-visible:ring-0 focus-visible:border-[#cc2936] transition-all resize-none"
                   />
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-16 bg-[#cc2936] hover:bg-[#b0232d] text-white rounded-none uppercase font-bold tracking-[0.2em] shadow-lg transition-all hover:translate-y-[-2px]"
                >
                  {isSubmitting ? "Sending..." : "Submit Message"}
                </Button>
             </form>
          </div>
        </div>

        {/* State Directorates Section */}
        <div className="space-y-12">
           <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
              <span className="text-[#cc2936] text-xs font-bold tracking-[0.3em] uppercase block mb-4">Network</span>
              <h2 className="text-4xl font-bold font-headline uppercase text-[#0d1b3e]">State Directorates</h2>
              <div className="h-1 w-20 bg-[#cc2936] mt-4" />
           </div>

           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {directorates.map((dir, i) => (
                 <div key={i} className="p-8 bg-white border border-gray-100 group hover:border-[#0d1b3e] transition-all">
                    <h4 className="font-headline text-xl text-[#0d1b3e] uppercase mb-4">{dir.name}</h4>
                    <div className="space-y-2">
                       <div className="flex items-center gap-3 text-sm text-gray-500">
                          <MapPin className="h-4 w-4 text-[#cc2936]" />
                          {dir.location}
                       </div>
                       <div className="flex items-center gap-3 text-sm text-gray-500">
                          <Mail className="h-4 w-4 text-[#cc2936]" />
                          {dir.email}
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>
    );
  }

  if (isTheme2) {
    return (
        <div className="grid gap-12 lg:grid-cols-2">
            {/* Left Column: Info Cards */}
            <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
                <div className="p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <MapPin className="h-32 w-32" />
                    </div>
                    <div className="relative z-10 space-y-6">
                        <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
                            <MapPin className="h-6 w-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-white font-headline">Visit Us</h3>
                        <p className="text-[var(--text-secondary)] font-body leading-relaxed">
                            123 Education Drive, Academic City, <br />
                            ST 54321, United States
                        </p>
                    </div>
                </div>

                <div className="grid gap-8 sm:grid-cols-2">
                    <div className="p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xl relative overflow-hidden group">
                        <div className="relative z-10 space-y-6">
                            <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
                                <Phone className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-white font-headline">Call Us</h3>
                            <p className="text-[var(--text-secondary)] font-body">+1 (555) 123-4567</p>
                        </div>
                    </div>
                    <div className="p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xl relative overflow-hidden group">
                        <div className="relative z-10 space-y-6">
                            <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
                                <Mail className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-white font-headline">Email Us</h3>
                            <p className="text-[var(--text-secondary)] font-body">info@school.edu</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xl">
                    <div className="flex items-center gap-6">
                        <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-indigo-400">
                            <Clock className="h-6 w-6" />
                        </div>
                        <div>
                            <h4 className="text-white font-headline text-xl font-bold">Office Hours</h4>
                            <p className="text-[var(--text-muted)] font-body text-sm mt-1">Mon - Fri: 8:00 AM - 4:00 PM</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Form */}
            <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
                <Card className="p-8 md:p-12 rounded-[2rem] bg-white text-[#0a0f1e] shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    
                    <div className="relative z-10 space-y-8">
                        <div>
                            <h3 className="text-3xl font-bold font-headline mb-2">Send Message</h3>
                            <p className="text-gray-500 font-body">We'll get back to you within 24 hours.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Name</label>
                                    <Input placeholder="John Doe" required className="rounded-2xl border-gray-100 bg-gray-50 h-14 focus:border-indigo-500 focus:ring-indigo-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Email</label>
                                    <Input type="email" placeholder="john@example.com" required className="rounded-2xl border-gray-100 bg-gray-50 h-14 focus:border-indigo-500 focus:ring-indigo-500" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Subject</label>
                                <Input placeholder="How can we help?" required className="rounded-2xl border-gray-100 bg-gray-50 h-14 focus:border-indigo-500 focus:ring-indigo-500" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Message</label>
                                <Textarea placeholder="Type your message here..." required className="rounded-2xl border-gray-100 bg-gray-50 min-h-[150px] focus:border-indigo-500 focus:ring-indigo-500 pt-4" />
                            </div>
                            <Button type="submit" disabled={isSubmitting} className="w-full h-14 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg hover:scale-[1.02] transition-all shadow-xl shadow-indigo-500/20 border-none">
                                {isSubmitting ? "Sending..." : "Submit Request"}
                            </Button>
                        </form>
                    </div>
                </Card>
            </div>
        </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="flex flex-col items-center p-6 text-center">
            <Mail className="mb-4 h-8 w-8 text-primary" />
            <h3 className="font-semibold">Email Us</h3>
            <p className="mt-2 text-sm text-muted-foreground">info@school.edu</p>
          </Card>
          <Card className="flex flex-col items-center p-6 text-center">
            <Phone className="mb-4 h-8 w-8 text-primary" />
            <h3 className="font-semibold">Call Us</h3>
            <p className="mt-2 text-sm text-muted-foreground">+1 (555) 123-4567</p>
          </Card>
        </div>
        <Card className="flex flex-col items-center p-6 text-center">
          <MapPin className="mb-4 h-8 w-8 text-primary" />
          <h3 className="font-semibold">Visit Us</h3>
          <p className="mt-2 text-sm text-muted-foreground">123 Education Drive, Academic City, ST 54321</p>
        </Card>
        <Card className="flex flex-col items-center p-6 text-center">
          <Clock className="mb-4 h-8 w-8 text-primary" />
          <h3 className="font-semibold">Office Hours</h3>
          <p className="mt-2 text-sm text-muted-foreground">Mon - Fri: 8:00 AM - 4:00 PM</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="mb-6 text-2xl font-bold">Send us a Message</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <Input id="name" placeholder="Enter your name" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input id="email" type="email" placeholder="Enter your email" required />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium">Subject</label>
            <Input id="subject" placeholder="Enter subject" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">Message</label>
            <Textarea id="message" placeholder="Type your message here..." required className="min-h-[150px]" />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

