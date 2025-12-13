import type { NodeConfig, NodeType, IntegrationConfig, IntegrationLevel, SynergyConfig, SynergyLevel } from '../types/flow';

// Node configurations - Share Economy services
export const NODE_CONFIGS: Record<NodeType, NodeConfig> = {
  locokau: {
    type: 'locokau',
    label: 'ロコカウ',
    icon: '🌍',
    color: '#FF6B6B',
    defaultUsers: 10000,
    defaultActiveRate: 0.6,
  },
  homestay: {
    type: 'homestay',
    label: '民泊サービスA',
    icon: '🏠',
    color: '#FF5A5F',
    defaultUsers: 50000,
    defaultActiveRate: 0.4,
  },
  carshare: {
    type: 'carshare',
    label: 'カーシェアB',
    icon: '🚗',
    color: '#00A699',
    defaultUsers: 30000,
    defaultActiveRate: 0.5,
  },
  skillshare: {
    type: 'skillshare',
    label: 'スキルシェアC',
    icon: '💡',
    color: '#FFB400',
    defaultUsers: 20000,
    defaultActiveRate: 0.3,
  },
};

// Get all node types as array
export const NODE_TYPES = Object.values(NODE_CONFIGS);

// Integration level configurations
export const INTEGRATION_CONFIGS: Record<IntegrationLevel, IntegrationConfig> = {
  simple: {
    level: 'simple',
    label: '単純統合',
    description: '相互送客のみ',
    coefficient: 1.0,
  },
  moderate: {
    level: 'moderate',
    label: '中庸統合',
    description: '認証・決済共通化',
    coefficient: 1.3,
  },
  full: {
    level: 'full',
    label: '完全統合',
    description: 'システム完全統合',
    coefficient: 1.5,
  },
};

export const INTEGRATION_LEVELS = Object.values(INTEGRATION_CONFIGS);

// Synergy level configurations
export const SYNERGY_CONFIGS: Record<SynergyLevel, SynergyConfig> = {
  standard: {
    level: 'standard',
    label: '標準',
    coefficient: 1.0,
  },
  good: {
    level: 'good',
    label: '良好',
    coefficient: 1.2,
  },
  excellent: {
    level: 'excellent',
    label: '最高',
    coefficient: 1.5,
  },
};

export const SYNERGY_LEVELS = Object.values(SYNERGY_CONFIGS);

// Canvas dimensions
export const CANVAS_CONFIG = {
  nodeWidth: 240,
  nodeHeight: 220,
  gridSize: 24,
};
