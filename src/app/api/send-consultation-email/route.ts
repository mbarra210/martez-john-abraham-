import { NextResponse } from 'next/server';

// Replace with your actual Google Apps Script URL
const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL!;

interface ConsultationData {
  name: string;
  email: string;
  phone: string;
  caseType: string;
  description: string;
  preferredDate: string;
  preferredTime: string;
}

export async function POST(request: Request) {
  try {
    const body: ConsultationData = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.phone || !body.caseType) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Format case type for display
    const formatCaseType = (type: string) => {
      const types: { [key: string]: string } = {
        criminal: 'Criminal Defense',
        'personal-injury': 'Personal Injury',
        family: 'Family Law',
        business: 'Business Law',
        estate: 'Estate Planning',
        other: 'Other',
      };
      return types[type] || type;
    };

    // Send data to Google Apps Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: body.name,
        email: body.email,
        phone: body.phone,
        caseType: formatCaseType(body.caseType),
        description: body.description,
        preferredDate: body.preferredDate,
        preferredTime: body.preferredTime
      }),
    });

    // Check if the Google Script request was successful
    if (!response.ok) {
      throw new Error('Failed to send data to Google Apps Script');
    }

    const result = await response.json();

    return NextResponse.json({
      message: 'Consultation request sent successfully',
      data: result
    });

  } catch (error) {
    console.error('Error sending consultation request:', error);
    return NextResponse.json(
      {
        message: 'Failed to send consultation request',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}