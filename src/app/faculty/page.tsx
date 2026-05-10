import { getTeamMembers } from '@/firebase/services/team';
import { FacultySearch } from './faculty-search';

export const revalidate = 3600; // Revalidate every hour

export default async function FacultyPage() {
  const faculty = await getTeamMembers();

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
          Our Faculty
        </h1>
        <p className="mt-4 mx-auto max-w-2xl text-lg text-muted-foreground">
          Meet the brilliant minds shaping the future of education and research at G V Hallikeri PU college.
        </p>
      </div>
      <FacultySearch faculty={faculty} />
    </div>
  );
}
