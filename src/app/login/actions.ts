'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  loginWithPassword,
  getProfileForAccessToken,
  isAdminRole,
} from '@/lib/supabase-auth';
import {
  ADMIN_ACCESS_TOKEN_COOKIE,
  ADMIN_REFRESH_TOKEN_COOKIE,
} from '@/lib/admin-session';

const SESSION_MAX_AGE = 60 * 60 * 8;

function getCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_MAX_AGE,
  };
}

export async function loginAdmin(
  email: string,
  password: string
): Promise<{ ok: boolean; error?: string }> {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const normalizedPassword = (password || '').trim();

  if (!normalizedEmail || !normalizedPassword) {
    return { ok: false, error: 'Email and password are required.' };
  }

  try {
    const session = await loginWithPassword(normalizedEmail, normalizedPassword);
    const profile = await getProfileForAccessToken(session.access_token);

    if (!profile || !profile.is_active || !isAdminRole(profile.role)) {
      return { ok: false, error: 'This account does not have admin access.' };
    }

    const cookieStore = await cookies();
    const cookieOptions = getCookieOptions();

    cookieStore.set(ADMIN_ACCESS_TOKEN_COOKIE, session.access_token, cookieOptions);
    cookieStore.set(ADMIN_REFRESH_TOKEN_COOKIE, session.refresh_token, cookieOptions);

    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed.';
    return { ok: false, error: message };
  }
}

export async function logoutAdmin(): Promise<never> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_ACCESS_TOKEN_COOKIE);
  cookieStore.delete(ADMIN_REFRESH_TOKEN_COOKIE);
  redirect('/login');
}
