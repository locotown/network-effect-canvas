// Integration level types
export type IntegrationLevel = 'simple' | 'moderate' | 'full';

// Synergy level types
export type SynergyLevel = 'standard' | 'good' | 'excellent';

// Position on canvas
export interface Position {
  x: number;
  y: number;
}

// Generic node on canvas
export interface FlowNode {
  id: string;
  name: string;           // User-defined name (e.g., "東京エリア", "決済機能")
  icon: string;           // Emoji or icon identifier
  color: string;          // Node color (hex)
  position: Position;
  value: number;          // Primary value metric
  valueLabel: string;     // Label for value (e.g., "ユーザー数", "売上", "面積")
  activeRate: number;     // 0-1 (e.g., 0.6 = 60%)
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
  name?: string;  // キャンバス名（オプショナル、既存データ互換のため）
  nodes: FlowNode[];
  connections: Connection[];
}

// Available icon options
export interface IconOption {
  icon: string;
  label: string;
  category: string;
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

// Node creation input
export interface NodeInput {
  name: string;
  icon: string;
  color: string;
  value: number;
  valueLabel: string;
  activeRate: number;
}
