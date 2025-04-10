import { NextRequest, NextResponse } from "next/server";
import { getFlowById, saveFlow, deleteFlow } from "@/lib/db-flow";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET handler for retrieving a specific flow
export async function GET(
  request: NextRequest,
  { params }: { params: { flowId: string } }
) {
  // Get authenticated user
  const currentUser = await auth.api.getSession({
    headers: await headers(),
  });

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const flowData = await getFlowById(currentUser.user.id, params.flowId);

    if (!flowData) {
      return NextResponse.json({ error: "Flow not found" }, { status: 404 });
    }

    // Return the flow
    return NextResponse.json(flowData);
  } catch (error) {
    console.error(`Failed to fetch flow ${params.flowId}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch flow" },
      { status: 500 }
    );
  }
}

// PUT handler for updating a flow
export async function PUT(
  request: NextRequest,
  { params }: { params: { flowId: string } }
) {
  // Get authenticated user
  const currentUser = await auth.api.getSession({
    headers: await headers(),
  });

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, steps, folderId } = await request.json();

    // Check if the flow exists first
    const existingFlow = await getFlowById(currentUser.user.id, params.flowId);

    if (!existingFlow) {
      return NextResponse.json({ error: "Flow not found" }, { status: 404 });
    }

    // Update the flow
    const flowToUpdate = {
      id: params.flowId,
      name: name || existingFlow.flow.name,
      steps: steps || existingFlow.flow.steps,
      createdAt: existingFlow.flow.createdAt,
      updatedAt: new Date().toISOString(),
    };

    await saveFlow(currentUser.user.id, flowToUpdate, folderId);

    // Revalidate the flows route to refresh caches
    revalidatePath("/dashboard");
    revalidatePath(`/flow/${params.flowId}`);
    revalidatePath("/api/flows");

    return NextResponse.json({ success: true, flow: flowToUpdate });
  } catch (error) {
    console.error(`Failed to update flow ${params.flowId}:`, error);
    return NextResponse.json(
      { error: "Failed to update flow" },
      { status: 500 }
    );
  }
}

// DELETE handler for deleting a flow
export async function DELETE(
  request: NextRequest,
  { params }: { params: { flowId: string } }
) {
  // Get authenticated user
  const currentUser = await auth.api.getSession({
    headers: await headers(),
  });

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check if the flow exists first
    const existingFlow = await getFlowById(currentUser.user.id, params.flowId);

    if (!existingFlow) {
      return NextResponse.json({ error: "Flow not found" }, { status: 404 });
    }

    // Delete the flow
    await deleteFlow(currentUser.user.id, params.flowId);

    // Revalidate the flows route to refresh caches
    revalidatePath("/dashboard");
    revalidatePath("/api/flows");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Failed to delete flow ${params.flowId}:`, error);
    return NextResponse.json(
      { error: "Failed to delete flow" },
      { status: 500 }
    );
  }
}
