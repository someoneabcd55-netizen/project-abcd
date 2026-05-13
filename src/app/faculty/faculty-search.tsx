'use client';

import { useState } from 'react';
import type { TeamMember } from '@/firebase/services/team';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface FacultySearchProps {
    faculty: TeamMember[];
}

export function FacultySearch({ faculty, theme }: FacultySearchProps & { theme?: string }) {
    const [searchTerm, setSearchTerm] = useState('');
    const isTheme2 = theme === 'theme2';
    const isTheme3 = theme === 'theme3';

    const filteredFaculty = faculty.filter(
        (member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.expertise && member.expertise.some(e => e.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    if (isTheme3) {
        return (
            <>
                <div className="relative mt-12 mb-20 max-w-2xl mx-auto px-4">
                    <span className="text-[#cc2936] text-[10px] font-bold uppercase tracking-[0.3em] block mb-4 text-center">Search Directory</span>
                    <div className="relative group">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#cc2936] transition-colors" />
                        <Input
                            type="text"
                            placeholder="Find an officer or instructor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 border-t-0 border-x-0 border-b-2 border-gray-100 rounded-none bg-transparent h-16 text-navy placeholder:text-gray-300 focus-visible:ring-0 focus-visible:border-[#cc2936] transition-all text-lg font-body"
                        />
                    </div>
                </div>

                <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4 border-l border-t border-gray-100">
                    {filteredFaculty.map((member: TeamMember) => (
                    <div key={member.id} id={member.id} className="group bg-white border-r border-b border-gray-100 p-8 hover:bg-navy transition-all duration-500 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 -translate-y-1/2 translate-x-1/2 rounded-full opacity-0 group-hover:opacity-10 transition-opacity" />
                        
                        <div className="relative mb-8">
                            <div className="aspect-square w-full relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                                <Image
                                    src={member.imageUrl}
                                    alt={member.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#cc2936]" />
                        </div>

                        <div className="space-y-4">
                            <h2 className="font-headline text-2xl font-bold text-navy group-hover:text-white uppercase leading-none transition-colors">{member.name}</h2>
                            <p className="text-[#cc2936] text-[10px] font-bold uppercase tracking-widest leading-none">{member.title}</p>
                            <p className="text-gray-400 text-xs font-body group-hover:text-gray-300 transition-colors">{member.department}</p>
                            
                            <div className="pt-4 flex flex-wrap gap-2">
                                {member.expertise && member.expertise.slice(0,2).map((area) => (
                                    <Badge key={area} className="bg-navy group-hover:bg-white/10 text-white rounded-none border-none text-[8px] font-bold uppercase tracking-widest px-2 py-1 transition-colors">
                                        {area}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-50 group-hover:border-white/10 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all">
                           <span className="text-white text-[10px] font-bold uppercase tracking-widest">{member.email}</span>
                           <ArrowRight className="h-4 w-4 text-[#cc2936]" />
                        </div>
                    </div>
                    ))}
                </div>
                {filteredFaculty.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 border border-gray-100 mt-12">
                        <span className="text-[#cc2936] text-[10px] font-bold uppercase tracking-[0.3em] block mb-2">No Results</span>
                        <p className="text-navy font-headline text-2xl uppercase">Personnel not found in directory</p>
                    </div>
                )}
            </>
        );
    }

    if (isTheme2) {
        return (
            <>
                <div className="relative mt-12 mb-16 max-w-xl mx-auto">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
                    <Input
                        type="text"
                        placeholder="Search Faculty..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-14 h-16 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:ring-indigo-500 focus:border-indigo-500 shadow-2xl"
                    />
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {filteredFaculty.map((member: TeamMember) => (
                    <div key={member.id} id={member.id} className="group relative rounded-[2.5rem] bg-white/5 border border-white/10 p-8 hover:bg-white/[0.08] transition-all duration-500 overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        
                        <div className="flex flex-col items-center text-center space-y-6">
                            <Avatar className="h-40 w-40 ring-4 ring-white/5 ring-offset-4 ring-offset-indigo-900 shadow-2xl transition-transform duration-500 group-hover:scale-105">
                                <AvatarImage src={member.imageUrl} alt={member.name} />
                                <AvatarFallback className="text-4xl bg-indigo-600">{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>

                            <div className="space-y-2">
                                <h2 className="font-headline text-2xl font-bold text-white tracking-tight">{member.name}</h2>
                                <p className="text-indigo-400 font-bold uppercase text-xs tracking-widest">{member.title}</p>
                                <p className="text-[var(--text-muted)] text-sm font-body">{member.department}</p>
                            </div>

                            <div className="flex flex-wrap justify-center gap-2 pt-2">
                                {member.expertise && member.expertise.slice(0,3).map((area) => (
                                    <Badge key={area} className="bg-white/5 text-indigo-200 border-white/10 rounded-lg px-3 py-1">
                                        {area}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
            </>
        );
    }

    return (
        <>
            <div className="relative mt-12 mb-8 max-w-lg mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                type="text"
                placeholder="Search by name, department, or expertise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                />
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredFaculty.map((member: TeamMember) => (
                <Card key={member.id} id={member.id} className="group overflow-hidden transition-shadow hover:shadow-xl">
                    <CardContent className="p-0 text-center">
                    <div className="relative h-48 w-full bg-secondary">
                        <Avatar className="h-32 w-32 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 border-4 border-background rounded-full transition-transform duration-300 group-hover:scale-110">
                            <AvatarImage src={member.imageUrl} alt={member.name} data-ai-hint="person" />
                            <AvatarFallback className="text-4xl">{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="pt-12 pb-6 px-6">
                        <h2 className="font-headline text-xl font-semibold">{member.name}</h2>
                        <p className="text-primary">{member.title}</p>
                        <p className="text-muted-foreground text-sm">{member.department}</p>
                        
                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                            {member.expertise && member.expertise.slice(0,3).map((area) => (
                                <Badge key={area} variant="outline">{area}</Badge>
                            ))}
                        </div>

                        <p className="mt-4 text-sm text-muted-foreground">{member.email}</p>
                    </div>
                    </CardContent>
                </Card>
                ))}
            </div>
            {filteredFaculty.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                    <p>No faculty members found matching your search.</p>
                </div>
            )}
        </>
    );
}

