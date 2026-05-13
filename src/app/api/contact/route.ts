import { NextResponse } from 'next/server';
import { getContactInfo } from '@/firebase/services/contact';
import { getAdminDb } from '@/firebase/server-init';

// GET contact information
export async function GET() {
  try {
    const contactInfo = await getContactInfo();
    if (!contactInfo) {
      return NextResponse.json(
        { error: 'Contact information not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact information' },
      { status: 500 }
    );
  }
}

// POST submit contact message
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Store contact message in Firebase
    const adminDb = getAdminDb();
    const contactMessagesRef = adminDb.collection('contact_messages');
    
    await contactMessagesRef.add({
      name,
      email,
      phone: phone || '',
      subject,
      message,
      createdAt: new Date().toISOString(),
      read: false,
    });

    return NextResponse.json(
      { success: true, message: 'Contact message submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error submitting contact message:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact message' },
      { status: 500 }
    );
  }
}

