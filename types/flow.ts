export interface FlowStep {
  id: string;
  title: string;
  description: string;
  components: string[];
}

export interface Flow {
  id: string;
  name: string;
  steps: FlowStep[];
  createdAt: string;
  updatedAt: string;
  previewHtml?: string;
}

export interface FlowFolder {
  id: string;
  name: string;
  flows: Flow[];
  createdAt: string;
  updatedAt: string;
}

export interface FlowStorage {
  folders: FlowFolder[];
  unorganizedFlows: Flow[];
  lastUpdated: string;
}
