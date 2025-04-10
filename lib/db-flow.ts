import { v4 as uuidv4 } from "uuid";
import { db } from "@/db";
import { flow, flowFolder, flowFolderRelation } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import type { Flow, FlowFolder, FlowStep } from "@/types/flow";

// Create a new flow
export const createFlow = async (
  userId: string,
  name: string,
  steps: FlowStep[]
): Promise<Flow> => {
  try {
    // Validate arguments
    if (!userId || typeof userId !== 'string') {
      throw new Error("Invalid user ID");
    }
    
    if (!name || typeof name !== 'string') {
      name = "Untitled Flow";
    }

    const now = new Date();
    const id = uuidv4();

    // Validate and normalize steps
    const validatedSteps = (steps || []).map(step => {
      if (!step || typeof step !== 'object') {
        return {
          id: `step-${uuidv4()}`,
          title: "Untitled Step",
          description: "Step Description",
          components: [],
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        };
      }
      
      return {
        id: step.id || `step-${uuidv4()}`,
        title: step.title || "Untitled Step", 
        description: step.description || "",
        components: Array.isArray(step.components) ? step.components : [],
        createdAt: step.createdAt || now.toISOString(),
        updatedAt: step.updatedAt || now.toISOString(),
      };
    });

    const newFlow = {
      id,
      name,
      steps: validatedSteps,
      userId,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(flow).values(newFlow);

    return {
      id,
      name,
      steps: validatedSteps,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
  } catch (error) {
    console.error("Error creating flow:", error);
    throw new Error(`Failed to create flow: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Save (update) a flow
export const saveFlow = async (
  userId: string,
  flowData: Flow,
  folderId?: string
): Promise<void> => {
  const now = new Date();

  // Update the flow
  await db
    .update(flow)
    .set({
      name: flowData.name,
      steps: flowData.steps,
      updatedAt: now,
    })
    .where(and(eq(flow.id, flowData.id), eq(flow.userId, userId)));

  // If folder ID is provided, update the folder relation
  if (folderId) {
    // Check if relation exists
    const existing = await db
      .select()
      .from(flowFolderRelation)
      .where(eq(flowFolderRelation.flowId, flowData.id))
      .limit(1);

    if (existing.length === 0) {
      // Create new relation
      await db.insert(flowFolderRelation).values({
        id: uuidv4(),
        flowId: flowData.id,
        folderId,
        createdAt: now,
        updatedAt: now,
      });
    } else {
      // Update existing relation
      await db
        .update(flowFolderRelation)
        .set({
          folderId,
          updatedAt: now,
        })
        .where(eq(flowFolderRelation.flowId, flowData.id));
    }
  } else {
    // If no folder ID, remove any existing relation
    await db
      .delete(flowFolderRelation)
      .where(eq(flowFolderRelation.flowId, flowData.id));
  }
};

// Create a new folder
export const createFolder = async (
  userId: string,
  name: string
): Promise<FlowFolder> => {
  const now = new Date();
  const id = uuidv4();

  await db.insert(flowFolder).values({
    id,
    name,
    userId,
    createdAt: now,
    updatedAt: now,
  });

  return {
    id,
    name,
    flows: [],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
};

// Move a flow to a folder
export const moveFlowToFolder = async (
  userId: string,
  flowId: string,
  targetFolderId: string | null
): Promise<void> => {
  const now = new Date();

  // Check if the flow exists and belongs to the user
  const flowExists = await db
    .select({ id: flow.id })
    .from(flow)
    .where(and(eq(flow.id, flowId), eq(flow.userId, userId)))
    .limit(1);

  if (flowExists.length === 0) {
    throw new Error("Flow not found or unauthorized");
  }

  // Delete existing folder relation
  await db
    .delete(flowFolderRelation)
    .where(eq(flowFolderRelation.flowId, flowId));

  // If a target folder is specified, create a new relation
  if (targetFolderId) {
    // Check if folder exists and belongs to user
    const folderExists = await db
      .select({ id: flowFolder.id })
      .from(flowFolder)
      .where(
        and(eq(flowFolder.id, targetFolderId), eq(flowFolder.userId, userId))
      )
      .limit(1);

    if (folderExists.length === 0) {
      throw new Error("Target folder not found or unauthorized");
    }

    // Create new relation
    await db.insert(flowFolderRelation).values({
      id: uuidv4(),
      flowId,
      folderId: targetFolderId,
      createdAt: now,
      updatedAt: now,
    });
  }
};

// Delete a flow
export const deleteFlow = async (
  userId: string,
  flowId: string
): Promise<void> => {
  // Check if the flow exists and belongs to the user
  const flowExists = await db
    .select({ id: flow.id })
    .from(flow)
    .where(and(eq(flow.id, flowId), eq(flow.userId, userId)))
    .limit(1);

  if (flowExists.length === 0) {
    throw new Error("Flow not found or unauthorized");
  }

  // Delete folder relations first (foreign key constraint)
  await db
    .delete(flowFolderRelation)
    .where(eq(flowFolderRelation.flowId, flowId));

  // Delete the flow
  await db.delete(flow).where(eq(flow.id, flowId));
};

// Delete a folder
export const deleteFolder = async (
  userId: string,
  folderId: string
): Promise<void> => {
  // Check if the folder exists and belongs to the user
  const folderExists = await db
    .select({ id: flowFolder.id })
    .from(flowFolder)
    .where(and(eq(flowFolder.id, folderId), eq(flowFolder.userId, userId)))
    .limit(1);

  if (folderExists.length === 0) {
    throw new Error("Folder not found or unauthorized");
  }

  // Delete folder relations first (foreign key constraint)
  await db
    .delete(flowFolderRelation)
    .where(eq(flowFolderRelation.folderId, folderId));

  // Delete the folder
  await db.delete(flowFolder).where(eq(flowFolder.id, folderId));
};

// Get all flows for a user (organized and unorganized)
export const getAllFlows = async (
  userId: string
): Promise<{ folders: FlowFolder[]; unorganizedFlows: Flow[] }> => {
  // Get all folders for the user
  const folders = await db
    .select()
    .from(flowFolder)
    .where(eq(flowFolder.userId, userId));

  // Get all folder relations
  const relations = await db
    .select()
    .from(flowFolderRelation)
    .innerJoin(flow, eq(flowFolderRelation.flowId, flow.id))
    .where(eq(flow.userId, userId));

  // Get all flows for the user
  const allFlows = await db.select().from(flow).where(eq(flow.userId, userId));

  // Organize flows into folders
  const folderMap = new Map<string, FlowFolder>();

  // Initialize folders
  folders.forEach((folder) => {
    folderMap.set(folder.id, {
      id: folder.id,
      name: folder.name,
      flows: [],
      createdAt: folder.createdAt.toISOString(),
      updatedAt: folder.updatedAt.toISOString(),
    });
  });

  // Track flows in folders
  const flowsInFolders = new Set<string>();

  // Add flows to folders
  relations.forEach((relation) => {
    const folderId = relation.flow_folder_relation.folderId;
    const folder = folderMap.get(folderId);

    if (folder) {
      const flowData = relation.flow;
      flowsInFolders.add(flowData.id);

      folder.flows.push({
        id: flowData.id,
        name: flowData.name,
        steps: flowData.steps as FlowStep[],
        createdAt: flowData.createdAt.toISOString(),
        updatedAt: flowData.updatedAt.toISOString(),
      });
    }
  });

  // Find unorganized flows (not in any folder)
  const unorganizedFlows = allFlows
    .filter((f) => !flowsInFolders.has(f.id))
    .map((f) => ({
      id: f.id,
      name: f.name,
      steps: f.steps as FlowStep[],
      createdAt: f.createdAt.toISOString(),
      updatedAt: f.updatedAt.toISOString(),
    }));

  return {
    folders: Array.from(folderMap.values()),
    unorganizedFlows,
  };
};

// Get a specific flow by ID
export const getFlowById = async (
  userId: string,
  flowId: string
): Promise<{ flow: Flow; folderId?: string } | null> => {
  // Get the flow
  const flows = await db
    .select()
    .from(flow)
    .where(and(eq(flow.id, flowId), eq(flow.userId, userId)))
    .limit(1);

  if (flows.length === 0) {
    return null;
  }

  const flowData = flows[0];

  // Check if the flow is in a folder
  const relations = await db
    .select()
    .from(flowFolderRelation)
    .where(eq(flowFolderRelation.flowId, flowId))
    .limit(1);

  const folderId = relations.length > 0 ? relations[0].folderId : undefined;

  return {
    flow: {
      id: flowData.id,
      name: flowData.name,
      steps: flowData.steps as FlowStep[],
      createdAt: flowData.createdAt.toISOString(),
      updatedAt: flowData.updatedAt.toISOString(),
    },
    folderId,
  };
};
