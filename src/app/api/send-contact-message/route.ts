import { NextResponse } from 'next/server';

const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_CONTACT_SCRIPT_URL;

interface ContactData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export async function POST(request: Request) {
  try {
    const body: ContactData = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate environment variable
    if (!GOOGLE_SCRIPT_URL) {
      console.error('GOOGLE_SCRIPT_URL environment variable is not set');
      return NextResponse.json(
        { message: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Send data to Google Apps Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: body.name,
        email: body.email,
        phone: body.phone || 'Not provided',
        subject: body.subject,
        message: body.message,
        type: 'contact_form' // Add type to distinguish from consultation form
      }),
    });

    // Check if the Google Script request was successful
    if (!response.ok) {
      throw new Error('Failed to send contact message');
    }

    const result = await response.json();

    return NextResponse.json({
      message: 'Contact message sent successfully',
      data: result
    });

  } catch (error) {
    console.error('Error sending contact message:', error);
    return NextResponse.json(
      {
        message: 'Failed to send contact message',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}