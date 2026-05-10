import { createManagedUser } from '../src/lib/supabase-auth.js';

async function createAdmin() {
  try {
    await createManagedUser({
      email: 'ekbotesushilendr0@gmail.com',
      password: 'sushil3011',
      role: 'admin',
      fullName: 'Admin User',
    });
    console.log('Admin user created successfully!');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdmin();