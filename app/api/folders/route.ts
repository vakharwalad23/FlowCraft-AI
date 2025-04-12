import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { flowFolder } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createFolder } from "@/lib/db-flow";
import { revalidatePath } from "next/cache";

// GET handler for retrieving all folders for the authenticated user
export async function GET() {
  try {
    // Get authenticated user
    const currentUser = await auth.api.getSession({
      headers: await headers(),
    });

    // Use a default user ID if no user is authenticated (for testing)
    const userId = currentUser?.user?.id || "test-user-id";

    // Get all folders for the user
    const folders = await db
      .select()
      .from(flowFolder)
      .where(eq(flowFolder.userId, userId));

    // Format response
    const formattedFolders = folders.map((folder) => ({
      id: folder.id,
      name: folder.name,
      createdAt: folder.createdAt.toISOString(),
      updatedAt: folder.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedFolders);
  } catch (error) {
    console.error("Failed to fetch folders:", error);
    return NextResponse.json(
      { error: "Failed to fetch folders" },
      { status: 500 }
    );
  }
}

// POST handler for creating a new folder
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const currentUser = await auth.api.getSession({
      headers: await headers(),
    });

    if (!currentUser?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await request.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Folder name is required" },
        { status: 400 }
      );
    }

    // Create the folder
    const folder = await createFolder(currentUser.user.id, name);

    // Revalidate paths
    revalidatePath("/dashboard");

    return NextResponse.json(folder, { status: 201 });
  } catch (error) {
    console.error("Failed to create folder:", error);
    return NextResponse.json(
      { error: "Failed to create folder" },
      { status: 500 }
    );
  }
}
