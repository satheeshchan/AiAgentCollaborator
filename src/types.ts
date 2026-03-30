export interface Agent {
  id: string;
  name: string;
  persona: string;
  history?: string;
  apiKey?: string;
  baseUrl?: string;
  isOrchestrator?: boolean;
}

export interface Message {
  agentName: string;
  content: string;
  timestamp: number;
}

export interface SimulationStatus {
  message: string;
  agentId?: string;
}
