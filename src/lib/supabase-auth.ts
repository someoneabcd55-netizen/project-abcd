export type AppRole = 'super_admin' | 'admin' | 'teacher' | 'student';

export interface SupabaseProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: AppRole;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SupabaseAuthUser {
  id: string;
  email?: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: SupabaseAuthUser;
}

function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getSupabaseUrl(): string {
  return getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL');
}

function getSupabaseAnonKey(): string {
  return getRequiredEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

function getSupabaseServiceRoleKey(): string {
  return getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY');
}

function buildUrl(path: string): string {
  return `${getSupabaseUrl()}${path}`;
}

async function parseError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    return data?.msg || data?.message || data?.error_description || data?.error || response.statusText;
  } catch {
    return response.statusText;
  }
}

async function requestJson<T>(
  path: string,
  init: RequestInit & {
    accessToken?: string;
    serviceRole?: boolean;
    prefer?: string;
  } = {}
): Promise<T> {
  const { accessToken, serviceRole = false, prefer, headers, ...rest } = init;
  const apiKey = serviceRole ? getSupabaseServiceRoleKey() : getSupabaseAnonKey();
  const response = await fetch(buildUrl(path), {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      apikey: apiKey,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(prefer ? { Prefer: prefer } : {}),
      ...headers,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function isAdminRole(role?: AppRole | null): boolean {
  return role === 'super_admin' || role === 'admin';
}

export async function loginWithPassword(email: string, password: string): Promise<LoginResponse> {
  return requestJson<LoginResponse>('/auth/v1/token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function refreshAdminSession(refreshToken: string): Promise<LoginResponse> {
  return requestJson<LoginResponse>('/auth/v1/token?grant_type=refresh_token', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
}

export async function getUserForAccessToken(accessToken: string): Promise<SupabaseAuthUser> {
  return requestJson<SupabaseAuthUser>('/auth/v1/user', {
    method: 'GET',
    accessToken,
  });
}

export async function getProfileForAccessToken(accessToken: string): Promise<SupabaseProfile | null> {
  const user = await getUserForAccessToken(accessToken);
  const params = new URLSearchParams({
    select: 'id,email,full_name,role,is_active,created_at,updated_at',
    id: `eq.${user.id}`,
    limit: '1',
  });

  const profiles = await requestJson<SupabaseProfile[]>(`/rest/v1/profiles?${params.toString()}`, {
    method: 'GET',
    accessToken,
  });

  return profiles[0] || null;
}

export async function getAdminSession(accessToken: string): Promise<{ user: SupabaseAuthUser; profile: SupabaseProfile | null }> {
  const user = await getUserForAccessToken(accessToken);
  const params = new URLSearchParams({
    select: 'id,email,full_name,role,is_active,created_at,updated_at',
    id: `eq.${user.id}`,
    limit: '1',
  });

  const profiles = await requestJson<SupabaseProfile[]>(`/rest/v1/profiles?${params.toString()}`, {
    method: 'GET',
    accessToken,
  });
  const profile = profiles[0] || null;
  return { user, profile };
}

export async function createManagedUser(input: {
  email: string;
  password: string;
  role: AppRole;
  fullName?: string;
}): Promise<void> {
  const created = await requestJson<{ id: string; email?: string }>('/auth/v1/admin/users', {
    method: 'POST',
    serviceRole: true,
    body: JSON.stringify({
      email: input.email,
      password: input.password,
      email_confirm: true,
      user_metadata: input.fullName ? { full_name: input.fullName } : {},
    }),
  });

  await requestJson<SupabaseProfile[]>('/rest/v1/profiles?on_conflict=id', {
    method: 'POST',
    serviceRole: true,
    prefer: 'resolution=merge-duplicates,return=minimal',
    body: JSON.stringify([
      {
        id: created.id,
        email: input.email,
        full_name: input.fullName || null,
        role: input.role,
        is_active: true,
      },
    ]),
  });
}

export async function listManagedUsers(): Promise<SupabaseProfile[]> {
  const params = new URLSearchParams({
    select: 'id,email,full_name,role,is_active,created_at,updated_at',
    order: 'created_at.desc',
  });

  return requestJson<SupabaseProfile[]>(`/rest/v1/profiles?${params.toString()}`, {
    method: 'GET',
    serviceRole: true,
  });
}

export async function updateManagedUser(input: {
  id: string;
  role: AppRole;
  is_active: boolean;
  full_name?: string | null;
}): Promise<void> {
  const params = new URLSearchParams({
    id: `eq.${input.id}`,
  });

  await requestJson<void>(`/rest/v1/profiles?${params.toString()}`, {
    method: 'PATCH',
    serviceRole: true,
    prefer: 'return=minimal',
    body: JSON.stringify({
      role: input.role,
      is_active: input.is_active,
      full_name: input.full_name ?? null,
      updated_at: new Date().toISOString(),
    }),
  });
}

