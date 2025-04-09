import { NextResponse } from 'next/server';
import { z } from 'zod';

// Validate flow data schema
const flowSchema = z.object({
  steps: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    components: z.array(z.string())
  }))
});

// GET /api/flows/[flowId]
export async function GET(
  request: Request,
  { params }: { params: { flowId: string } }
) {
  try {
    // Here you would typically fetch the flow data from your database
    // For now, we'll return a mock response
    const mockFlow = {
      steps: [
        {
          id: "step1",
          title: "Welcome Screen",
          description: "Initial landing page for users",
          components: ["Hero Section", "CTA Button"]
        }
      ]
    };

    return NextResponse.json(mockFlow);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch flow" },
      { status: 500 }
    );
  }
}

// PUT /api/flows/[flowId]
export async function PUT(
  request: Request,
  { params }: { params: { flowId: string } }
) {
  try {
    const body = await request.json();
    const validatedData = flowSchema.parse(body);

    // Here you would typically update the flow in your database
    // For now, we'll just return the validated data
    return NextResponse.json(validatedData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update flow" },
      { status: 500 }
    );
  }
} 