import { create } from 'zustand';
import {
  Node,
  Edge,
  Connection,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from 'reactflow';

export type FlowStep = {
  id: string;
  title: string;
  description: string;
  components: string[];
};

type FlowStore = {
  nodes: Node[];
  edges: Edge[];
  steps: FlowStep[];
  setSteps: (steps: FlowStep[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  updateNodeData: (nodeId: string, data: any) => void;
  resetFlow: () => void;
};

const useFlowStore = create<FlowStore>((set, get) => ({
  nodes: [],
  edges: [],
  steps: [],
  setSteps: (steps) => {
    // Convert steps to nodes
    const nodes = steps.map((step, index) => ({
      id: step.id,
      type: 'flowNode',
      position: { x: 250 * index, y: 100 },
      data: { ...step },
    }));

    // Create edges connecting consecutive nodes
    const edges = steps.slice(0, -1).map((step, index) => ({
      id: `e${step.id}-${steps[index + 1].id}`,
      source: step.id,
      target: steps[index + 1].id,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#0e7490', strokeWidth: 2 },
    }));

    set({ nodes, edges, steps });
  },
  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    }));
  },
  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }));
  },
  onConnect: (connection) => {
    set((state) => ({
      edges: addEdge({
        ...connection,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#0e7490', strokeWidth: 2 },
      }, state.edges),
    }));
  },
  updateNodeData: (nodeId, data) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      ),
    }));
  },
  resetFlow: () => {
    set({ nodes: [], edges: [], steps: [] });
  },
}));

export default useFlowStore; 