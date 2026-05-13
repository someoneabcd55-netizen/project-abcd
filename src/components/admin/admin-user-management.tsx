'use client';

import { useEffect, useState, useTransition } from 'react';
import { Loader2, Plus, Save, Shield, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  createManagedUserAction,
  getManagedUsersAction,
  updateManagedUserAction,
} from '@/app/admin/user-actions';
import type { AppRole, SupabaseProfile } from '@/lib/supabase-auth';

const roleOptions: AppRole[] = ['student', 'teacher', 'admin', 'super_admin'];

export function AdminUserManagement() {
  const [users, setUsers] = useState<SupabaseProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startSaving] = useTransition();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<AppRole>('student');
  const { toast } = useToast();

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getManagedUsersAction();
      setUsers(data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Could Not Load Users',
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const createUser = () => {
    startSaving(async () => {
      const result = await createManagedUserAction({
        email,
        password,
        fullName,
        role,
      });

      if (!result.ok) {
        toast({
          variant: 'destructive',
          title: 'User Not Created',
          description: result.error,
        });
        return;
      }

      toast({
        title: 'User Created',
        description: `${email} is ready with ${role} access.`,
      });
      setEmail('');
      setPassword('');
      setFullName('');
      setRole('student');
      await loadUsers();
    });
  };

  const updateUser = (user: SupabaseProfile) => {
    startSaving(async () => {
      const result = await updateManagedUserAction({
        id: user.id,
        role: user.role,
        isActive: user.is_active,
        fullName: user.full_name,
      });

      if (!result.ok) {
        toast({
          variant: 'destructive',
          title: 'Update Failed',
          description: result.error,
        });
        return;
      }

      toast({
        title: 'User Updated',
        description: `${user.email} was updated.`,
      });
      await loadUsers();
    });
  };

  const updateUserLocally = (id: string, patch: Partial<SupabaseProfile>) => {
    setUsers((current) => current.map((user) => (user.id === id ? { ...user, ...patch } : user)));
  };

  return (
    <>
      <CardContent className="space-y-8">
        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Create User</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="user-full-name">Full Name</Label>
              <Input
                id="user-full-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Teacher or student name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-email">Email</Label>
              <Input
                id="user-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="person@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-password">Password</Label>
              <Input
                id="user-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={(value) => setRole(value as AppRole)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={createUser} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Create User
            </Button>
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center gap-2">
            <UserRound className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Existing Users</h3>
          </div>
          {isLoading ? (
            <div className="flex h-24 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="rounded-lg border p-4">
                  <div className="grid gap-4 lg:grid-cols-[2fr_1fr_auto_auto] lg:items-end">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={user.full_name || ''}
                        onChange={(e) => updateUserLocally(user.id, { full_name: e.target.value })}
                        placeholder="Full name"
                      />
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Select
                        value={user.role}
                        onValueChange={(value) => updateUserLocally(user.id, { role: value as AppRole })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roleOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-3 rounded-md border px-3 py-2">
                      <Switch
                        checked={user.is_active}
                        onCheckedChange={(checked) => updateUserLocally(user.id, { is_active: checked })}
                      />
                      <span className="text-sm">{user.is_active ? 'Active' : 'Disabled'}</span>
                    </div>
                    <Button onClick={() => updateUser(user)} disabled={isSaving}>
                      {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      Save
                    </Button>
                  </div>
                </div>
              ))}
              {users.length === 0 && (
                <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                  No users yet.
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6 text-sm text-muted-foreground">
        Admins can create and manage teachers, students, and other admins from here.
      </CardFooter>
    </>
  );
}

