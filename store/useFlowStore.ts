import { create } from 'zustand';
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
} from 'reactflow';

export interface FlowStep {
  id: string;
  title: string;
  description: string;
  components: string[];
}

interface FlowState {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setSteps: (steps: FlowStep[]) => void;
  resetFlow: () => void;
  loadFlow: (flowData: { steps: FlowStep[] }) => void;
  updateNode: (id: string, data: FlowStep) => void;
  deleteNode: (id: string) => void;
  addNode: (sourceId: string) => void;
}

// Constants for node positioning
const NODE_SPACING_X = 400; // Horizontal spacing between nodes
const NODE_INITIAL_X = 50; // Initial X position
const NODE_INITIAL_Y = 50; // Initial Y position

const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge({
        ...connection,
        type: 'smoothstep',
        animated: true,
        style: { 
          strokeWidth: 2,
          stroke: '#0e7490',
        },
      }, get().edges),
    });
  },
  setSteps: (steps: FlowStep[]) => {
    const nodes: Node[] = steps.map((step, index) => ({
      id: step.id,
      type: 'flowNode',
      position: { 
        x: NODE_INITIAL_X + (NODE_SPACING_X * index), 
        y: NODE_INITIAL_Y + (Math.sin(index * 0.5) * 50) // Slight vertical variation
      },
      data: {
        title: step.title,
        description: step.description,
        components: step.components,
      },
    }));

    const edges: Edge[] = steps.slice(1).map((step, index) => ({
      id: `e${index}`,
      source: steps[index].id,
      target: step.id,
      type: 'smoothstep',
      animated: true,
      style: { 
        strokeWidth: 2,
        stroke: '#0e7490',
      },
    }));

    set({ nodes, edges });
  },
  resetFlow: () => {
    set({ nodes: [], edges: [] });
  },
  loadFlow: (flowData: { steps: FlowStep[] }) => {
    get().setSteps(flowData.steps);
  },
  updateNode: (id: string, data: FlowStep) => {
    const { nodes } = get();
    const updatedNodes = nodes.map((node) =>
      node.id === id
        ? {
            ...node,
            data: {
              title: data.title,
              description: data.description,
              components: data.components,
            },
          }
        : node
    );
    set({ nodes: updatedNodes });
  },
  deleteNode: (id: string) => {
    const { nodes, edges } = get();
    const updatedNodes = nodes.filter((node) => node.id !== id);
    const updatedEdges = edges.filter(
      (edge) => edge.source !== id && edge.target !== id
    );
    
    // Reposition remaining nodes
    const repositionedNodes = updatedNodes.map((node, index) => ({
      ...node,
      position: {
        x: NODE_INITIAL_X + (NODE_SPACING_X * index),
        y: NODE_INITIAL_Y + (Math.sin(index * 0.5) * 50),
      },
    }));
    
    set({ nodes: repositionedNodes, edges: updatedEdges });
  },
  addNode: (sourceId: string) => {
    const { nodes, edges } = get();
    const sourceNode = nodes.find((node) => node.id === sourceId);
    
    if (!sourceNode) return;

    const newNodeId = `step${nodes.length + 1}`;
    const newNodeIndex = nodes.length;
    
    const newNode: Node = {
      id: newNodeId,
      type: 'flowNode',
      position: {
        x: sourceNode.position.x + NODE_SPACING_X,
        y: NODE_INITIAL_Y + (Math.sin(newNodeIndex * 0.5) * 50),
      },
      data: {
        title: 'New Step',
        description: 'Add description here',
        components: ['New Component'],
      },
    };

    const newEdge: Edge = {
      id: `e${edges.length}`,
      source: sourceId,
      target: newNodeId,
      type: 'smoothstep',
      animated: true,
      style: { 
        strokeWidth: 2,
        stroke: '#0e7490',
      },
    };

    set({
      nodes: [...nodes, newNode],
      edges: [...edges, newEdge],
    });
  },
}));

export default useFlowStore; 