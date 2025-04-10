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
  // Get authenticated user
  const currentUser = await auth.api.getSession({
    headers: await headers(),
  });

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, steps } = await request.json();

    // Create the flow in the database
    const newFlow = await createFlow(
      currentUser.user.id,
      name || "Untitled Flow",
      steps || []
    );

    // Revalidate the flows route to refresh caches
    revalidatePath("/dashboard");
    revalidatePath("/api/flows");

    return NextResponse.json(newFlow, { status: 201 });
  } catch (error) {
    console.error("Failed to create flow:", error);
    return NextResponse.json(
      { error: "Failed to create flow" },
      { status: 500 }
    );
  }
}
