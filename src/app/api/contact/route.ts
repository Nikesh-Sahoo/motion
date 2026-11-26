import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema } from '@/lib/validations/contact.schema';
import { getCollection, isMongoConfigured } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

/**
 * Health check & status endpoint
 * GET /api/contact
 */
export async function GET() {
  const configured = isMongoConfigured();
  return NextResponse.json({
    status: 'ok',
    service: 'Motionxyne Contact & Inquiry API',
    mongoConfigured: configured,
    database: process.env.MONGODB_DB_NAME || 'motion',
    collection: 'inquiries',
    timestamp: new Date().toISOString(),
  });
}

/**
 * Store project inquiry in MongoDB collection "inquiries"
 * POST /api/contact
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Validate payload using strict Zod schema
    const validationResult = contactFormSchema.safeParse(body);
    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // 2. Extract metadata
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const inquiryDocument = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone || null,
      companyName: data.companyName || null,
      serviceType: data.serviceType,
      platform: data.platform,
      approximateDuration: data.approximateDuration || null,
      numberOfVideos: data.numberOfVideos || null,
      budgetRange: data.budgetRange,
      deadline: data.deadline,
      projectDescription: data.projectDescription,
      referenceVideoUrl: data.referenceVideoUrl || null,
      additionalRequirements: data.additionalRequirements || null,
      source: 'website_contact_form',
      status: 'new',
      clientIp,
      userAgent,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 3. Store in MongoDB if configured
    if (isMongoConfigured()) {
      try {
        const inquiriesCollection = await getCollection('inquiries');
        const insertResult = await inquiriesCollection.insertOne(inquiryDocument);

        return NextResponse.json(
          {
            success: true,
            message: 'Inquiry successfully saved to MongoDB database.',
            id: insertResult.insertedId,
            collection: 'inquiries',
          },
          { status: 201 }
        );
      } catch (dbError: any) {
        console.error('[MongoDB Error] Failed to insert inquiry:', dbError);
        return NextResponse.json(
          {
            success: false,
            error: 'Database error: Could not save inquiry to MongoDB.',
            details: dbError?.message || 'Database connection failure',
          },
          { status: 500 }
        );
      }
    } else {
      // If MongoDB URI is not yet configured, log warning and return informative response
      console.warn(
        '[MongoDB Warning] MONGODB_URI is not configured in .env.local. Simulated inquiry storage.'
      );
      return NextResponse.json(
        {
          success: true,
          message:
            'Inquiry received. Note: MONGODB_URI is not set in .env.local yet; please configure it to persist records in MongoDB Atlas.',
          simulated: true,
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error('[Contact API Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process inquiry request.',
        details: error?.message || 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
