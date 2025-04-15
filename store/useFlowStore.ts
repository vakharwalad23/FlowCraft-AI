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
import type { Flow as StorageFlow, FlowStep } from "@/types/flow";

interface FlowState {
  nodes: Node<FlowStep>[];
  edges: Edge[];
  currentFlowId: string | null;
  currentFlowName: string;
  currentFolderId?: string;
  isStoreInitialized: boolean;
  isLoading: boolean;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setSteps: (steps: FlowStep[]) => void;
  resetFlow: () => void;
  updateNode: (id: string, data: Partial<FlowStep>) => void;
  deleteNode: (id: string) => void;
  addNode: (sourceId: string, isAfter?: boolean) => string | undefined;
  setNodePreview: (id: string, html: string) => void;
  persistCurrentFlow: () => Promise<void>;
  loadFlowFromApi: (flowId: string) => Promise<void>;
  createNewFlow: (
    name: string,
    folderId?: string
  ) => Promise<{ id: string; name: string; steps: FlowStep[] }>;
  deleteCurrentFlow: () => Promise<void>;
  setCurrentFlowId: (flowId: string | null) => void;
  setFlowName: (name: string) => void;
}

// Constants for node positioning
const NODE_SPACING_X = 400; // Horizontal spacing between nodes
const NODE_INITIAL_X = 50; // Initial X position
const NODE_INITIAL_Y = 50; // Initial Y position

// --- Helper to convert store state to flow format ---
const convertStateToStorageFlow = (
  nodes: Node<FlowStep>[],
  name: string,
  flowId: string
): StorageFlow => {
  const steps = nodes.map((node) => node.data);

  return {
    id: flowId,
    name,
    steps,
    createdAt: steps[0]?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};
// --------------------------------------------------------

const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  currentFlowId: null,
  currentFlowName: "Untitled Flow",
  currentFolderId: undefined,
  isStoreInitialized: false,
  isLoading: false,
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
          style: { strokeWidth: 2, stroke: "#6366f1" },
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
        stroke: "#6366f1",
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
  addNode: (sourceId: string, isAfter = true) => {
    const { nodes, currentFlowId } = get();
    if (!currentFlowId) return;

    const sourceNode = nodes.find((node) => node.id === sourceId);
    if (!sourceNode) return;

    // Find the index based on whether we want to insert after or before the source node
    const sourceIndex = nodes.findIndex((n) => n.id === sourceId);
    const newNodeIndex = isAfter ? sourceIndex + 1 : sourceIndex;

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
        x: sourceNode.position.x + (isAfter ? NODE_SPACING_X : -NODE_SPACING_X),
        y: sourceNode.position.y,
      },
      data: newNodeData,
    };

    set((state) => {
      const newNodes = [...state.nodes];
      newNodes.splice(newNodeIndex, 0, newNode);

      // Reposition all nodes to maintain even spacing
      const repositionedNodes = newNodes.map((node, index) => ({
        ...node,
        position: {
          x: NODE_INITIAL_X + NODE_SPACING_X * index,
          y: NODE_INITIAL_Y + Math.sin(index * 0.5) * 50,
        },
      }));

      // Recreate all edges to ensure proper connections
      const newEdges: Edge[] = [];
      for (let i = 0; i < repositionedNodes.length - 1; i++) {
        newEdges.push({
          id: `e${repositionedNodes[i].id}-${repositionedNodes[i + 1].id}`,
          source: repositionedNodes[i].id,
          target: repositionedNodes[i + 1].id,
          type: "smoothstep",
          animated: true,
          style: { strokeWidth: 2, stroke: "#6366f1" },
        });
      }

      return {
        nodes: repositionedNodes,
        edges: newEdges,
      };
    });

    if (get().isStoreInitialized) get().persistCurrentFlow();

    // Return the ID of the new node to make it easier to reference
    return newNodeId;
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
  persistCurrentFlow: async () => {
    const {
      currentFlowId,
      nodes,
      currentFlowName,
      currentFolderId,
      isStoreInitialized,
    } = get();
    if (!currentFlowId || !isStoreInitialized || typeof window === "undefined")
      return;

    try {
      const flowToSave = convertStateToStorageFlow(
        nodes,
        currentFlowName,
        currentFlowId
      );

      // Use the API to save the flow
      const response = await fetch(`/api/flows/${currentFlowId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: flowToSave.name,
          steps: flowToSave.steps,
          folderId: currentFolderId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save flow: ${response.statusText}`);
      }

      console.log("Flow saved successfully");
    } catch (error) {
      console.error(`Failed to save flow ${currentFlowId}:`, error);
    }
  },
  loadFlowFromApi: async (flowId: string) => {
    set({ isLoading: true, isStoreInitialized: false });

    try {
      console.log("Fetching flow from API:", flowId);
      const response = await fetch(`/api/flows/${flowId}`);

      if (!response.ok) {
        throw new Error(`Failed to load flow: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Flow data loaded:", data);

      set({
        currentFlowId: data.flow.id,
        currentFlowName: data.flow.name,
        currentFolderId: data.folderId,
      });

      get().setSteps(data.flow.steps);
    } catch (error) {
      console.error(`Failed to load flow ${flowId}:`, error);
      set({
        nodes: [],
        edges: [],
        currentFlowId: flowId,
        currentFlowName: "Untitled Flow",
        currentFolderId: undefined,
      });
    } finally {
      set({ isLoading: false, isStoreInitialized: true });
    }
  },
  createNewFlow: async (name: string, folderId?: string) => {
    set({ isLoading: true });
    console.log(
      "Creating new flow with name:",
      name,
      "in folder:",
      folderId || "none"
    );

    const now = new Date().toISOString();

    try {
      const response = await fetch("/api/flows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          steps: [],
          createdAt: now,
          updatedAt: now,
          folderId: folderId || undefined,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`Failed to create flow: Status ${response.status}`);
      }

      const newFlow = await response.json();
      console.log("Flow created successfully:", newFlow);

      set({
        currentFlowId: newFlow.id,
        currentFlowName: name,
        currentFolderId: folderId,
        nodes: [],
        edges: [],
        isStoreInitialized: true,
      });

      return newFlow;
    } catch (error) {
      console.error("Failed to create flow:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  deleteCurrentFlow: async () => {
    const { currentFlowId } = get();
    if (!currentFlowId) return;

    set({ isLoading: true });

    try {
      const response = await fetch(`/api/flows/${currentFlowId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete flow: ${response.statusText}`);
      }

      set({
        nodes: [],
        edges: [],
        currentFlowId: null,
        currentFlowName: "Untitled Flow",
        currentFolderId: undefined,
      });
    } catch (error) {
      console.error(`Failed to delete flow ${currentFlowId}:`, error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
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
