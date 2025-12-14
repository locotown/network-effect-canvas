import type { IconOption, IntegrationConfig, IntegrationLevel, SynergyConfig, SynergyLevel } from '../types/flow';

// Available icons for node creation
export const ICON_OPTIONS: IconOption[] = [
  // Areas / Locations
  { icon: '📍', label: 'ロケーション', category: 'エリア' },
  { icon: '🏙️', label: '都市', category: 'エリア' },
  { icon: '🗾', label: '地域', category: 'エリア' },
  { icon: '🌍', label: 'グローバル', category: 'エリア' },

  // Services
  { icon: '🏠', label: '宿泊', category: 'サービス' },
  { icon: '🚗', label: '移動', category: 'サービス' },
  { icon: '💡', label: 'スキル', category: 'サービス' },
  { icon: '🛒', label: '購買', category: 'サービス' },
  { icon: '🍽️', label: '飲食', category: 'サービス' },

  // Functions / Features
  { icon: '💳', label: '決済', category: '機能' },
  { icon: '👤', label: 'ユーザー', category: '機能' },
  { icon: '🔐', label: '認証', category: '機能' },
  { icon: '⭐', label: 'レビュー', category: '機能' },
  { icon: '🔔', label: '通知', category: '機能' },

  // Products
  { icon: '📦', label: 'プロダクト', category: '製品' },
  { icon: '📱', label: 'アプリ', category: '製品' },
  { icon: '💻', label: 'システム', category: '製品' },

  // Generic
  { icon: '⚡', label: 'エネルギー', category: 'その他' },
  { icon: '🎯', label: 'ターゲット', category: 'その他' },
  { icon: '🔗', label: '連携', category: 'その他' },
];

// Color palette for nodes
export const NODE_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FFEAA7', // Yellow
  '#DDA0DD', // Plum
  '#98D8C8', // Mint
  '#F7DC6F', // Gold
  '#BB8FCE', // Purple
  '#85C1E9', // Sky
];

// Default values for new nodes
export const DEFAULT_NODE_VALUES = {
  value: 10000,
  valueLabel: 'ユーザー数',
  activeRate: 0.5,
  color: '#4ECDC4',
  icon: '📍',
};

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
