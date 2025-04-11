import { NextRequest, NextResponse } from "next/server";
import { getAllFlows, createFlow } from "@/lib/db-flow";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET handler for retrieving all flows for the authenticated user
export async function GET() {
  // Get authenticated user
  const currentUser = await auth.api.getSession({
    headers: await headers(),
  });

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const flows = await getAllFlows(currentUser.user.id);

    // Return the flows
    return NextResponse.json(flows);
  } catch (error) {
    console.error("Failed to fetch flows:", error);
    return NextResponse.json(
      { error: "Failed to fetch flows" },
      { status: 500 }
    );
  }
}

// POST handler for creating a new flow
export async function POST(request: NextRequest) {

  try {
    // Get authenticated user - handle auth errors gracefully
    let currentUser;
    try {
      currentUser = await auth.api.getSession({
        headers: await headers(),
      });
    } catch (authError) {
      console.error("Auth error:", authError);
      return NextResponse.json(
        { error: "Authentication error" },
        { status: 401 }
      );
    }

    if (!currentUser?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body safely
    let body;
    try {
      const text = await request.text();
      console.log("Raw request body:", text);
      body = JSON.parse(text);
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }

    const { name = "Untitled Flow", steps = [] } = body;

    const userId = currentUser.user.id;

    console.log(`Creating flow for user: ${userId} with name: ${name}`);

    try {
      

      // Create the flow in the database
      const newFlow = await createFlow(
        userId,
        name,
        Array.isArray(steps) ? steps : [],
       
      );

      console.log("Flow created successfully:", newFlow);

      // Revalidate paths
      revalidatePath("/dashboard");
      revalidatePath("/api/flows");

      return NextResponse.json(newFlow, { status: 201 });
    } catch (dbError) {
      console.error("Database error creating flow:", dbError);

      return NextResponse.json(
        {
          error:
            "Database error: " +
            (dbError instanceof Error ? dbError.message : "Unknown"),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Failed to create flow:", error);

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
