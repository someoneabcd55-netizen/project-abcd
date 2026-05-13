import { LoginForm } from '@/components/auth/login-form';
import { getAppearanceSettings } from '@/firebase/services/settings';
import { GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default async function LoginPage() {
  const appearance = await getAppearanceSettings();
  const isTheme2 = appearance?.theme === 'theme2';

  if (isTheme2) {
    return (
      <div className="flex min-h-screen bg-[#0a0f1e]">
        {/* Left Panel: Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[var(--surface)] items-center justify-center p-12">
            <div className="absolute top-[-10%] left-[-10%] w-full h-full bg-indigo-600/10 rounded-full blur-[120px]" />
            <div className="relative z-10 max-w-md space-y-8">
                <Link href="/" className="flex items-center gap-3">
                    <GraduationCap className="h-10 w-10 text-indigo-500" />
                    <span className="text-3xl font-bold text-white font-headline tracking-tight">Modern School</span>
                </Link>
                <div className="space-y-4">
                    <div className="text-[var(--accent)] text-xs font-bold tracking-[0.3em] uppercase">Portal Access</div>
                    <h1 className="text-5xl font-bold text-white font-headline leading-tight">Welcome Back to Excellence.</h1>
                    <p className="text-[var(--text-secondary)] font-body text-lg leading-relaxed">
                        Sign in to manage your academic profile, access course materials, and stay connected with the campus community.
                    </p>
                </div>
                <div className="pt-8 border-t border-white/10 flex gap-12">
                    <div>
                        <p className="text-white font-bold text-2xl font-headline">5k+</p>
                        <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest">Students</p>
                    </div>
                    <div>
                        <p className="text-white font-bold text-2xl font-headline">250+</p>
                        <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest">Faculty</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Panel: Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12">
            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="lg:hidden text-center mb-8">
                    <GraduationCap className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-white font-headline">Modern School</h2>
                </div>
                <LoginForm theme="theme2" />
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <LoginForm />
    </div>
  );
}

