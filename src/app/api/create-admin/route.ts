import { NextResponse } from 'next/server';
import { createManagedUser } from '@/lib/supabase-auth';

export async function POST() {
  try {
    await createManagedUser({
      email: 'ekbotesushilendr0@gmail.com',
      password: 'sushil3011',
      role: 'admin',
      fullName: 'Admin User',
    });
    return NextResponse.json({ message: 'Admin user created successfully!' });
  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json({ error: 'Failed to create admin user' }, { status: 500 });
  }
}
