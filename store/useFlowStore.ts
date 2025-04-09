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
      edges: addEdge(connection, get().edges),
    });
  },
  setSteps: (steps: FlowStep[]) => {
    const nodes: Node[] = steps.map((step, index) => ({
      id: step.id,
      type: 'flowNode',
      position: { x: 250 * index, y: 0 },
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
    set({ nodes: updatedNodes, edges: updatedEdges });
  },
  addNode: (sourceId: string) => {
    const { nodes, edges } = get();
    const sourceNode = nodes.find((node) => node.id === sourceId);
    
    if (!sourceNode) return;

    const newNodeId = `step${nodes.length + 1}`;
    const position = sourceNode.position;
    
    const newNode: Node = {
      id: newNodeId,
      type: 'flowNode',
      position: {
        x: position.x + 300,
        y: position.y,
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
    };

    set({
      nodes: [...nodes, newNode],
      edges: [...edges, newEdge],
    });
  },
}));

export default useFlowStore; 