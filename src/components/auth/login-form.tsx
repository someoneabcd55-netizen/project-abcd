'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Lock, User, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '@/app/login/actions';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function LoginForm({ theme }: { theme?: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'admin' | 'student'>('admin');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const isTheme2 = theme === 'theme2';
  const isTheme3 = theme === 'theme3';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
        toast({
            variant: 'destructive',
            title: 'Email And Password Required',
            description: 'Please enter your credentials.',
        });
        return;
    }
    setIsLoading(true);
    const result = await loginAdmin(email, password);
    setIsLoading(true); // Keep loading state until redirect

    if (!result.ok) {
      setIsLoading(false);
      toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: result.error || 'Invalid credentials or unauthorized account.',
      });
      return;
    }

    toast({ title: "Login Successful", description: "Redirecting to admin dashboard..." });
    router.push('/admin');
    router.refresh();
  };

  if (isTheme3) {
    return (
      <div className="w-full max-w-5xl bg-white shadow-2xl flex flex-col md:flex-row overflow-hidden min-h-[600px] animate-in fade-in zoom-in-95 duration-700">
        {/* Left Panel */}
        <div className="md:w-5/12 bg-[#0d1b3e] p-12 text-white relative flex flex-col justify-between">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
           <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-white" />
                 </div>
                 <span className="font-headline font-bold text-2xl tracking-tight uppercase">Modern School</span>
              </div>
              <div>
                 <span className="text-[#cc2936] text-[10px] font-bold tracking-[0.3em] uppercase block mb-4">Official Portal</span>
                 <h2 className="text-4xl font-bold font-headline uppercase leading-tight">Welcome to the <br />Institutional Gateway</h2>
                 <p className="mt-6 text-gray-400 font-body text-sm leading-relaxed max-w-xs">
                    Access your personalized dashboard, grades, and academic resources.
                 </p>
              </div>
           </div>
           
           <div className="relative z-10 p-6 bg-white/5 border border-white/10 rounded-none">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#cc2936] mb-2">Notice</p>
              <div className="space-y-1 text-xs text-gray-400 font-body">
                 <p>Only authorized personnel and students may access this portal. All activities are logged.</p>
              </div>
           </div>
        </div>

        {/* Right Panel: Form */}
        <div className="md:w-7/12 p-12 md:p-20 flex flex-col justify-center">
           <form onSubmit={handleSubmit} className="space-y-10">
              <div className="space-y-6">
                 <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0d1b3e]">Login as</p>
                 <div className="flex p-1 bg-gray-100 rounded-none w-fit">
                    <button 
                      type="button"
                      onClick={() => setUserType('admin')}
                      className={cn(
                        "px-8 py-2 text-xs font-bold uppercase tracking-widest transition-all",
                        userType === 'admin' ? "bg-[#0d1b3e] text-white shadow-lg" : "text-gray-400 hover:text-[#0d1b3e]"
                      )}
                    >
                      Administrator
                    </button>
                    <button 
                      type="button"
                      onClick={() => setUserType('student')}
                      className={cn(
                        "px-8 py-2 text-xs font-bold uppercase tracking-widest transition-all",
                        userType === 'student' ? "bg-[#0d1b3e] text-white shadow-lg" : "text-gray-400 hover:text-[#0d1b3e]"
                      )}
                    >
                      Cadet/Student
                    </button>
                 </div>
              </div>

              <div className="space-y-8">
                 <div className="relative group">
                    <User className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#cc2936] transition-colors" />
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Institutional Email" 
                      required 
                      className="w-full pl-10 border-t-0 border-x-0 border-b-2 border-gray-100 rounded-none bg-transparent h-14 text-[#0d1b3e] placeholder:text-gray-300 focus:outline-none focus:border-[#cc2936] transition-all font-body"
                    />
                 </div>
                 <div className="relative group">
                    <Lock className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#cc2936] transition-colors" />
                    <input 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password" 
                      required 
                      className="w-full pl-10 border-t-0 border-x-0 border-b-2 border-gray-100 rounded-none bg-transparent h-14 text-[#0d1b3e] placeholder:text-gray-300 focus:outline-none focus:border-[#cc2936] transition-all font-body"
                    />
                 </div>
              </div>

              <div className="flex items-center justify-between">
                 <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded-none border-gray-300 text-[#cc2936] focus:ring-[#cc2936]" />
                    <span className="text-xs text-gray-500 font-body">Keep me logged in</span>
                 </label>
                 <Link href="#" className="text-xs font-bold text-[#cc2936] uppercase tracking-widest hover:underline">Forgot Password?</Link>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-16 bg-[#cc2936] hover:bg-[#b0232d] text-white rounded-none uppercase font-bold tracking-[0.2em] shadow-lg transition-all hover:translate-y-[-2px] border-none"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Access Portal"}
              </Button>
           </form>
        </div>
      </div>
    );
  }

  if (isTheme2) {
    return (
      <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="mb-10 flex p-1 bg-white/5 rounded-full border border-white/10">
          <button 
            onClick={() => setUserType('admin')}
            className={cn(
              "flex-1 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
              userType === 'admin' ? "bg-indigo-600 text-white shadow-lg" : "text-[var(--text-muted)] hover:text-white"
            )}
          >
            Admin
          </button>
          <button 
            onClick={() => setUserType('student')}
            className={cn(
              "flex-1 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
              userType === 'student' ? "bg-indigo-600 text-white shadow-lg" : "text-[var(--text-muted)] hover:text-white"
            )}
          >
            Student
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
           <div className="space-y-6">
              <div className="group relative">
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full bg-transparent border-b border-white/10 py-4 pl-8 pr-1 text-white placeholder:text-gray-700 focus:outline-none focus:border-[var(--accent)] transition-all font-body"
                  required
                />
              </div>

              <div className="group relative">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-transparent border-b border-white/10 py-4 pl-8 pr-1 text-white placeholder:text-gray-700 focus:outline-none focus:border-[var(--accent)] transition-all font-body"
                  required
                />
              </div>
           </div>

           <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[var(--text-secondary)] cursor-pointer">
                <input type="checkbox" className="accent-[var(--accent)]" />
                Remember me
              </label>
              <Link href="#" className="text-[var(--accent)] hover:underline">Forgot password?</Link>
           </div>

           <Button type="submit" disabled={isLoading} className="w-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 h-14 text-lg font-bold shadow-[0_0_20px_rgba(99,102,241,0.3)] border-none hover:scale-[1.02] transition-transform">
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Sign In'}
           </Button>
        </form>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Admin Login</CardTitle>
        <CardDescription>Sign in with your admin account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Login'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

