import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { moveFlowToFolder } from "@/lib/db-flow";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ flowId: string }> }
) {
  try {
    const { flowId } = await params;

    // Get authenticated user
    const currentUser = await auth.api.getSession({
      headers: await headers(),
    });

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { folderId } = await request.json();

    // Move the flow to the specified folder (or remove from folder if folderId is null)
    await moveFlowToFolder(currentUser.user.id, flowId, folderId);

    // Revalidate paths to refresh cache
    revalidatePath("/dashboard");
    revalidatePath(`/api/flows`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to move flow:", error);
    return NextResponse.json(
      { error: "Failed to move flow" },
      { status: 500 }
    );
  }
}