'use server';

import { revalidatePath } from 'next/cache';
import {
  type AppRole,
  createManagedUser,
  listManagedUsers,
  updateManagedUser,
} from '@/lib/supabase-auth';

export async function getManagedUsersAction() {
  return listManagedUsers();
}

export async function createManagedUserAction(input: {
  email: string;
  password: string;
  role: AppRole;
  fullName?: string;
}) {
  const email = input.email.trim().toLowerCase();
  const password = input.password.trim();
  const fullName = input.fullName?.trim();

  if (!email || !password) {
    return { ok: false, error: 'Email and password are required.' };
  }

  if (password.length < 8) {
    return { ok: false, error: 'Password must be at least 8 characters long.' };
  }

  try {
    await createManagedUser({
      email,
      password,
      role: input.role,
      fullName,
    });
    revalidatePath('/admin');
    return { ok: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create user.';
    return { ok: false, error: message };
  }
}

export async function updateManagedUserAction(input: {
  id: string;
  role: AppRole;
  isActive: boolean;
  fullName?: string | null;
}) {
  try {
    await updateManagedUser({
      id: input.id,
      role: input.role,
      is_active: input.isActive,
      full_name: input.fullName ?? null,
    });
    revalidatePath('/admin');
    return { ok: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update user.';
    return { ok: false, error: message };
  }
}

