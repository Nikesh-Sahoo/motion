import { NextRequest, NextResponse } from 'next/server';
import { editorApplicationSchema } from '@/lib/validations/editor-application.schema';
import { withCollection, isMongoConfigured } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

/**
 * Health check & status endpoint
 * GET /api/editor-applications
 */
export async function GET() {
  const configured = isMongoConfigured();
  return NextResponse.json({
    status: 'ok',
    service: 'Motionxyne Editor Application API',
    mongoConfigured: configured,
    database: process.env.MONGODB_DB_NAME || 'motion',
    collection: 'editor_applications',
    timestamp: new Date().toISOString(),
  });
}

/**
 * Store editor application in MongoDB collection "editor_applications"
 * POST /api/editor-applications
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validationResult = editorApplicationSchema.safeParse(body);
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

    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const applicationDocument = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      location: data.location,
      experienceLevel: data.experienceLevel,
      primarySoftware: data.primarySoftware,
      portfolioUrl: data.portfolioUrl,
      sampleWorkUrl: data.sampleWorkUrl || null,
      preferredProjectType: data.preferredProjectType,
      weeklyAvailability: data.weeklyAvailability,
      motivation: data.motivation,
      source: 'editor_application_form',
      status: 'pending',
      clientIp,
      userAgent,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (isMongoConfigured()) {
      try {
        const insertResult = await withCollection('editor_applications', (collection) =>
          collection.insertOne(applicationDocument)
        );

        return NextResponse.json(
          {
            success: true,
            message: 'Application successfully saved to MongoDB database.',
            id: insertResult.insertedId,
            collection: 'editor_applications',
          },
          { status: 201 }
        );
      } catch (dbError: any) {
        console.error('[MongoDB Error] Failed to insert editor application:', dbError);
        return NextResponse.json(
          {
            success: false,
            error: 'Database error: Could not save application to MongoDB.',
            details: dbError?.message || 'Database connection failure',
          },
          { status: 500 }
        );
      }
    } else {
      console.warn(
        '[MongoDB Warning] MONGODB_URI is not configured in .env.local. Simulated application storage.'
      );
      return NextResponse.json(
        {
          success: true,
          message:
            'Application received. Note: MONGODB_URI is not set in .env.local yet; configure it to persist records in MongoDB.',
          simulated: true,
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error('[Editor Application API Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process editor application.',
        details: error?.message || 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
