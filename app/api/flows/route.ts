import { NextRequest, NextResponse } from "next/server";
import { getAllFlows, createFlow, moveFlowToFolder } from "@/lib/db-flow";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";

// GET handler for retrieving all flows for the authenticated user
export async function GET() {
  try {
    // Get authenticated user
    const currentUser = await auth.api.getSession({
      headers: await headers(),
    });

    // Use a default user ID if no user is authenticated (for testing)
    const userId = currentUser?.user?.id || "test-user-id";

    const flows = await getAllFlows(userId);

    // Return the flows
    return NextResponse.json(flows);
  } catch (error) {
    console.error("Failed to fetch flows:", error);
    return NextResponse.json(
      { error: "Failed to fetch flows. Please try again." },
      { status: 500 }
    );
  }
}

// POST handler for creating a new flow
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const currentUser = await auth.api.getSession({
      headers: await headers(),
    });

    // Use a default user ID if no user is authenticated (for testing)
    const userId = currentUser?.user?.id || "test-user-id";

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error("Invalid request format:", error);
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }

    const { name, steps = [], folderId } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: "Flow name is required" },
        { status: 400 }
      );
    }

    // Ensure steps are properly formatted
    const validSteps = Array.isArray(steps) 
      ? steps.map(step => ({
          id: step.id || `step-${uuidv4()}`,
          title: step.title || "Untitled Step",
          description: step.description || "",
          components: Array.isArray(step.components) ? step.components : [],
        }))
      : [];

    // Create the flow in the database
    try {
      console.log("Creating flow in database:", {
        userId,
        name: name.trim(),
        stepsCount: validSteps.length,
      });

      const newFlow = await createFlow(
        userId,
        name.trim() || "Untitled Flow",
        validSteps
      );

      console.log("Flow created successfully:", newFlow.id);

      // If folder ID is provided, move the flow to that folder
      if (folderId) {
        await moveFlowToFolder(userId, newFlow.id, folderId);
      }

      // Revalidate the flows route to refresh caches
      revalidatePath("/dashboard");
      revalidatePath("/api/flows");

      return NextResponse.json(newFlow, { status: 201 });
    } catch (error) {
      console.error("Database error creating flow:", error);
      return NextResponse.json(
        { error: "Failed to create flow in database" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Unexpected error creating flow:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
