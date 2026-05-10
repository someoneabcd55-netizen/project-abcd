'use client';

import { useState } from 'react';
import type { TeamMember } from '@/firebase/services/team';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FacultySearchProps {
    faculty: TeamMember[];
}

export function FacultySearch({ faculty }: FacultySearchProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredFaculty = faculty.filter(
        (member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.expertise && member.expertise.some(e => e.toLowerCase().includes(searchTerm.toLowerCase())))
    );

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
