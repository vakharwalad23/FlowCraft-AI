import { v4 as uuidv4 } from 'uuid';
import type { Flow, FlowFolder, FlowStorage, FlowStep } from '@/types/flow';

const STORAGE_KEY = 'flowcraft_storage';

// Initialize storage with default structure
const initializeStorage = (): FlowStorage => ({
  folders: [],
  unorganizedFlows: [],
  lastUpdated: new Date().toISOString(),
});

// Get storage from localStorage
const getStorage = (): FlowStorage => {
  if (typeof window === 'undefined') return initializeStorage();
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const initial = initializeStorage();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  
  return JSON.parse(stored);
};

// Save storage to localStorage
const saveStorage = (storage: FlowStorage) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    ...storage,
    lastUpdated: new Date().toISOString(),
  }));
};

// Create a new flow
export const createFlow = (name: string, steps: FlowStep[]): Flow => {
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    name,
    steps,
    createdAt: now,
    updatedAt: now,
  };
};

// Save a flow (either in a folder or unorganized)
export const saveFlow = (flow: Flow, folderId?: string) => {
  const storage = getStorage();
  
  if (folderId) {
    const folderIndex = storage.folders.findIndex(f => f.id === folderId);
    if (folderIndex === -1) {
      throw new Error('Folder not found');
    }
    
    const existingFlowIndex = storage.folders[folderIndex].flows.findIndex(f => f.id === flow.id);
    if (existingFlowIndex === -1) {
      storage.folders[folderIndex].flows.push(flow);
    } else {
      storage.folders[folderIndex].flows[existingFlowIndex] = flow;
    }
  } else {
    const existingFlowIndex = storage.unorganizedFlows.findIndex(f => f.id === flow.id);
    if (existingFlowIndex === -1) {
      storage.unorganizedFlows.push(flow);
    } else {
      storage.unorganizedFlows[existingFlowIndex] = flow;
    }
  }
  
  saveStorage(storage);
};

// Create a new folder
export const createFolder = (name: string): FlowFolder => {
  const storage = getStorage();
  const now = new Date().toISOString();
  
  const newFolder: FlowFolder = {
    id: uuidv4(),
    name,
    flows: [],
    createdAt: now,
    updatedAt: now,
  };
  
  storage.folders.push(newFolder);
  saveStorage(storage);
  
  return newFolder;
};

// Move a flow to a folder
export const moveFlowToFolder = (flowId: string, targetFolderId: string | null) => {
  const storage = getStorage();
  let flowToMove: Flow | undefined;
  
  // First, remove the flow from its current location
  // Check unorganized flows
  const unorganizedIndex = storage.unorganizedFlows.findIndex(f => f.id === flowId);
  if (unorganizedIndex !== -1) {
    flowToMove = storage.unorganizedFlows[unorganizedIndex];
    storage.unorganizedFlows.splice(unorganizedIndex, 1);
  } else {
    // Check folders
    for (const folder of storage.folders) {
      const flowIndex = folder.flows.findIndex(f => f.id === flowId);
      if (flowIndex !== -1) {
        flowToMove = folder.flows[flowIndex];
        folder.flows.splice(flowIndex, 1);
        break;
      }
    }
  }
  
  if (!flowToMove) {
    throw new Error('Flow not found');
  }
  
  // Then, add it to the target location
  if (targetFolderId) {
    const targetFolder = storage.folders.find(f => f.id === targetFolderId);
    if (!targetFolder) {
      throw new Error('Target folder not found');
    }
    targetFolder.flows.push(flowToMove);
  } else {
    storage.unorganizedFlows.push(flowToMove);
  }
  
  saveStorage(storage);
};

// Delete a flow
export const deleteFlow = (flowId: string) => {
  const storage = getStorage();
  
  // Check unorganized flows
  const unorganizedIndex = storage.unorganizedFlows.findIndex(f => f.id === flowId);
  if (unorganizedIndex !== -1) {
    storage.unorganizedFlows.splice(unorganizedIndex, 1);
    saveStorage(storage);
    return;
  }
  
  // Check folders
  for (const folder of storage.folders) {
    const flowIndex = folder.flows.findIndex(f => f.id === flowId);
    if (flowIndex !== -1) {
      folder.flows.splice(flowIndex, 1);
      saveStorage(storage);
      return;
    }
  }
};

// Delete a folder
export const deleteFolder = (folderId: string) => {
  const storage = getStorage();
  const folderIndex = storage.folders.findIndex(f => f.id === folderId);
  
  if (folderIndex === -1) {
    throw new Error('Folder not found');
  }
  
  storage.folders.splice(folderIndex, 1);
  saveStorage(storage);
};

// Get all flows (organized and unorganized)
export const getAllFlows = (): { folders: FlowFolder[]; unorganizedFlows: Flow[] } => {
  const storage = getStorage();
  return {
    folders: storage.folders,
    unorganizedFlows: storage.unorganizedFlows,
  };
};

// Get a specific flow by ID
export const getFlowById = (flowId: string): { flow: Flow; folderId?: string } | null => {
  const storage = getStorage();
  
  // Check unorganized flows
  const unorganizedFlow = storage.unorganizedFlows.find(f => f.id === flowId);
  if (unorganizedFlow) {
    return { flow: unorganizedFlow };
  }
  
  // Check folders
  for (const folder of storage.folders) {
    const flow = folder.flows.find(f => f.id === flowId);
    if (flow) {
      return { flow, folderId: folder.id };
    }
  }
  
  return null;
}; 