import { create } from "zustand";
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import { saveFlow, getFlowById } from "@/lib/flowStorage";
import type { Flow as StorageFlow } from "@/types/flow";

export interface FlowStep {
  id: string;
  title: string;
  description: string;
  components: string[];
  previewHtml?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface FlowState {
  nodes: Node<FlowStep>[];
  edges: Edge[];
  currentFlowId: string | null;
  currentFlowName: string;
  currentFolderId?: string;
  isStoreInitialized: boolean;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setSteps: (steps: FlowStep[]) => void;
  resetFlow: () => void;
  updateNode: (id: string, data: Partial<FlowStep>) => void;
  deleteNode: (id: string) => void;
  addNode: (sourceId: string) => void;
  setNodePreview: (id: string, html: string) => void;
  persistCurrentFlow: () => void;
  loadFlowFromStorage: (flowId: string) => void;
  setCurrentFlowId: (flowId: string | null) => void;
  setFlowName: (name: string) => void;
}

// Constants for node positioning
const NODE_SPACING_X = 400; // Horizontal spacing between nodes
const NODE_INITIAL_X = 50; // Initial X position
const NODE_INITIAL_Y = 50; // Initial Y position

// --- Helper to convert store state to storage format ---
const convertStateToStorageFlows = (nodes: Node<FlowStep>[]): StorageFlow[] => {
  return nodes.map((node) => ({
    id: node.id,
    name: node.data.title, // Use node title as flow name for simplicity here
    steps: [node.data], // In this model, each node represents a step
    createdAt: node.data.createdAt || new Date().toISOString(), // Need createdAt/updatedAt if storing individually
    updatedAt: new Date().toISOString(),
    previewHtml: node.data.previewHtml, // Persist previewHtml
    // Note: This conversion assumes a flat list of flows, not folders for now
    // and that each node IS a flow step. Adjust if your model differs.
  }));
};
// --------------------------------------------------------

const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  currentFlowId: null,
  currentFlowName: "Untitled Flow",
  currentFolderId: undefined,
  isStoreInitialized: false,
  onNodesChange: (changes: NodeChange[]) => {
    set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) }));
    if (get().isStoreInitialized) get().persistCurrentFlow();
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set((state) => ({ edges: applyEdgeChanges(changes, state.edges) }));
    if (get().isStoreInitialized) get().persistCurrentFlow();
  },
  onConnect: (connection: Connection) => {
    set((state) => ({
      edges: addEdge(
        {
          ...connection,
          type: "smoothstep",
          animated: true,
          style: { strokeWidth: 2, stroke: "#0e7490" },
        },
        state.edges
      ),
    }));
    if (get().isStoreInitialized) get().persistCurrentFlow();
  },
  setSteps: (steps: FlowStep[]) => {
    const nodes: Node<FlowStep>[] = steps.map((step, index) => ({
      id: step.id,
      type: "flowNode",
      position: {
        x: NODE_INITIAL_X + NODE_SPACING_X * index,
        y: NODE_INITIAL_Y + Math.sin(index * 0.5) * 50,
      },
      data: step,
    }));

    const edges: Edge[] = steps.slice(0, -1).map((step, index) => ({
      id: `e${step.id}-${steps[index + 1].id}`,
      source: step.id,
      target: steps[index + 1].id,
      type: "smoothstep",
      animated: true,
      style: {
        strokeWidth: 2,
        stroke: "#0e7490",
      },
    }));

    set({ nodes, edges });
  },
  resetFlow: () => {
    set({
      nodes: [],
      edges: [],
      currentFlowId: null,
      currentFlowName: "Untitled Flow",
      currentFolderId: undefined,
      isStoreInitialized: true,
    });
  },
  updateNode: (id: string, data: Partial<FlowStep>) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                ...data,
                updatedAt: new Date().toISOString(),
              },
            }
          : node
      ),
    }));
    if (get().isStoreInitialized) get().persistCurrentFlow();
  },
  deleteNode: (id: string) => {
    set((state) => {
      const updatedNodes = state.nodes.filter((node) => node.id !== id);
      const updatedEdges = state.edges.filter(
        (edge) => edge.source !== id && edge.target !== id
      );
      const repositionedNodes = updatedNodes.map((node, index) => ({
        ...node,
        position: {
          x: NODE_INITIAL_X + NODE_SPACING_X * index,
          y: NODE_INITIAL_Y + Math.sin(index * 0.5) * 50,
        },
      }));
      return { nodes: repositionedNodes, edges: updatedEdges };
    });
    if (get().isStoreInitialized) get().persistCurrentFlow();
  },
  addNode: (sourceId: string) => {
    const { nodes, currentFlowId } = get();
    if (!currentFlowId) return;

    const sourceNode = nodes.find((node) => node.id === sourceId);
    if (!sourceNode) return;

    const newNodeIndex = nodes.findIndex((n) => n.id === sourceId) + 1;
    const newNodeId = `flowstep_${Date.now()}`;
    const now = new Date().toISOString();

    const newNodeData: FlowStep = {
      id: newNodeId,
      title: "New Step",
      description: "Add description here",
      components: [],
      previewHtml: undefined,
      createdAt: now,
      updatedAt: now,
    };

    const newNode: Node<FlowStep> = {
      id: newNodeId,
      type: "flowNode",
      position: {
        x: sourceNode.position.x + NODE_SPACING_X,
        y: sourceNode.position.y,
      },
      data: newNodeData,
    };

    const newEdge: Edge = {
      id: `e${sourceNode.id}-${newNodeId}`,
      source: sourceNode.id,
      target: newNodeId,
      type: "smoothstep",
      animated: true,
      style: { strokeWidth: 2, stroke: "#0e7490" },
    };

    set((state) => {
      const newNodes = [...state.nodes];
      newNodes.splice(newNodeIndex, 0, newNode);

      const newEdges: Edge[] = [];
      for (let i = 0; i < newNodes.length - 1; i++) {
        newEdges.push({
          id: `e${newNodes[i].id}-${newNodes[i + 1].id}`,
          source: newNodes[i].id,
          target: newNodes[i + 1].id,
          type: "smoothstep",
          animated: true,
          style: { strokeWidth: 2, stroke: "#0e7490" },
        });
      }
      return { nodes: newNodes, edges: newEdges };
    });
    if (get().isStoreInitialized) get().persistCurrentFlow();
  },
  setNodePreview: (id: string, html: string) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                previewHtml: html,
                updatedAt: new Date().toISOString(),
              },
            }
          : node
      ),
    }));
    if (get().isStoreInitialized) get().persistCurrentFlow();
  },
  persistCurrentFlow: () => {
    const { currentFlowId, nodes, currentFlowName, currentFolderId } = get();
    if (!currentFlowId || typeof window === "undefined") return;

    const steps = nodes.map((node) => node.data);

    const existingFlowData = getFlowById(currentFlowId);
    const createdAt =
      existingFlowData?.flow.createdAt || new Date().toISOString();

    const flowToSave: StorageFlow = {
      id: currentFlowId,
      name: currentFlowName,
      steps: steps,
      createdAt: createdAt,
      updatedAt: new Date().toISOString(),
    };

    try {
      console.log("Persisting Flow:", flowToSave);
      saveFlow(flowToSave, currentFolderId);
    } catch (error) {
      console.error(`Failed to save flow ${currentFlowId} to storage:`, error);
    }
  },
  loadFlowFromStorage: (flowId: string) => {
    if (typeof window === "undefined") {
      set({ isStoreInitialized: true });
      return;
    }

    console.log("Attempting to load flow from storage:", flowId);
    set({ isStoreInitialized: false });
    const storedData = getFlowById(flowId);

    if (storedData) {
      console.log("Found stored flow:", storedData);
      set({
        currentFlowId: storedData.flow.id,
        currentFlowName: storedData.flow.name,
        currentFolderId: storedData.folderId,
      });
      get().setSteps(storedData.flow.steps);
    } else {
      console.log("No stored flow found for ID:", flowId, "Resetting flow.");
      set({
        nodes: [],
        edges: [],
        currentFlowId: flowId,
        currentFlowName: "Untitled Flow",
        currentFolderId: undefined,
      });
    }
    set({ isStoreInitialized: true });
  },
  setCurrentFlowId: (flowId: string | null) => {
    set({ currentFlowId: flowId, isStoreInitialized: true });
  },
  setFlowName: (name: string) => {
    set({ currentFlowName: name });
    get().persistCurrentFlow();
  },
}));

export default useFlowStore;
