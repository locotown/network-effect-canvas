// Node types - Share Economy services
export type NodeType = 'locokau' | 'homestay' | 'carshare' | 'skillshare';

// Integration level types
export type IntegrationLevel = 'simple' | 'moderate' | 'full';

// Synergy level types
export type SynergyLevel = 'standard' | 'good' | 'excellent';

// Position on canvas
export interface Position {
  x: number;
  y: number;
}

// Node on canvas
export interface FlowNode {
  id: string;
  type: NodeType;
  position: Position;
  userCount: number;
  activeRate: number; // 0-1 (e.g., 0.6 = 60%)
}

// Connection between nodes
export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  synergy: SynergyLevel;
}

// Complete flow state
export interface FlowState {
  nodes: FlowNode[];
  connections: Connection[];
}

// Node configuration - extensible for new node types
export interface NodeConfig {
  type: NodeType;
  label: string;
  icon: string;
  color: string;
  defaultUsers: number;
  defaultActiveRate: number;
}

// Integration level configuration
export interface IntegrationConfig {
  level: IntegrationLevel;
  label: string;
  description: string;
  coefficient: number;
}

// Synergy level configuration
export interface SynergyConfig {
  level: SynergyLevel;
  label: string;
  coefficient: number;
}

// Network value calculation result
export interface NetworkValue {
  standaloneValue: number;
  connectedValue: number;
  multiplier: number;
}
