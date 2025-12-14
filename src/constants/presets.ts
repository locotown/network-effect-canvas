import type { FlowState, SynergyLevel } from '../types/flow';

export interface Preset {
  id: string;
  name: string;
  description: string;
  icon: string;
  data: FlowState;
}

// LINE: メッセージングプラットフォームのネットワーク効果
const linePreset: Preset = {
  id: 'line',
  name: 'LINE',
  description: 'メッセージングアプリのネットワーク効果',
  icon: '💬',
  data: {
    nodes: [
      {
        id: 'line-users',
        name: 'ユーザー',
        icon: '👥',
        color: '#06C755',
        position: { x: 150, y: 200 },
        value: 95000000,
        valueLabel: 'ユーザー数',
        activeRate: 0.7,
      },
      {
        id: 'line-groups',
        name: 'グループ',
        icon: '💬',
        color: '#00B900',
        position: { x: 450, y: 100 },
        value: 50000000,
        valueLabel: 'グループ数',
        activeRate: 0.6,
      },
      {
        id: 'line-stickers',
        name: 'スタンプ',
        icon: '🎨',
        color: '#FFE033',
        position: { x: 450, y: 300 },
        value: 1000000,
        valueLabel: 'クリエイター数',
        activeRate: 0.4,
      },
      {
        id: 'line-pay',
        name: 'LINE Pay',
        icon: '💳',
        color: '#1DB446',
        position: { x: 700, y: 200 },
        value: 40000000,
        valueLabel: '登録者数',
        activeRate: 0.3,
      },
    ],
    connections: [
      { id: 'c1', sourceId: 'line-users', targetId: 'line-groups', synergy: 'excellent' as SynergyLevel },
      { id: 'c2', sourceId: 'line-users', targetId: 'line-stickers', synergy: 'good' as SynergyLevel },
      { id: 'c3', sourceId: 'line-groups', targetId: 'line-pay', synergy: 'good' as SynergyLevel },
      { id: 'c4', sourceId: 'line-stickers', targetId: 'line-pay', synergy: 'standard' as SynergyLevel },
    ],
  },
};

// メルカリ: 両面市場のネットワーク効果
const mercariPreset: Preset = {
  id: 'mercari',
  name: 'メルカリ',
  description: 'フリマアプリの両面市場効果',
  icon: '🛒',
  data: {
    nodes: [
      {
        id: 'mercari-sellers',
        name: '出品者',
        icon: '🏪',
        color: '#FF0211',
        position: { x: 150, y: 150 },
        value: 20000000,
        valueLabel: '出品者数',
        activeRate: 0.5,
      },
      {
        id: 'mercari-buyers',
        name: '購入者',
        icon: '🛍️',
        color: '#4A90D9',
        position: { x: 150, y: 350 },
        value: 23000000,
        valueLabel: '購入者数',
        activeRate: 0.6,
      },
      {
        id: 'mercari-listings',
        name: '商品',
        icon: '📦',
        color: '#FF6B6B',
        position: { x: 450, y: 250 },
        value: 2500000000,
        valueLabel: '累計出品数',
        activeRate: 0.8,
      },
      {
        id: 'mercari-logistics',
        name: 'メルカリ便',
        icon: '🚚',
        color: '#00C2B8',
        position: { x: 700, y: 150 },
        value: 170000,
        valueLabel: '取扱店舗数',
        activeRate: 0.9,
      },
      {
        id: 'mercari-payment',
        name: 'メルペイ',
        icon: '💰',
        color: '#FF4655',
        position: { x: 700, y: 350 },
        value: 15000000,
        valueLabel: '登録者数',
        activeRate: 0.4,
      },
    ],
    connections: [
      { id: 'c1', sourceId: 'mercari-sellers', targetId: 'mercari-listings', synergy: 'excellent' as SynergyLevel },
      { id: 'c2', sourceId: 'mercari-buyers', targetId: 'mercari-listings', synergy: 'excellent' as SynergyLevel },
      { id: 'c3', sourceId: 'mercari-listings', targetId: 'mercari-logistics', synergy: 'good' as SynergyLevel },
      { id: 'c4', sourceId: 'mercari-listings', targetId: 'mercari-payment', synergy: 'good' as SynergyLevel },
      { id: 'c5', sourceId: 'mercari-sellers', targetId: 'mercari-buyers', synergy: 'excellent' as SynergyLevel },
    ],
  },
};

// Uber: ライドシェアの両面市場効果
const uberPreset: Preset = {
  id: 'uber',
  name: 'Uber',
  description: 'ライドシェアの両面市場効果',
  icon: '🚗',
  data: {
    nodes: [
      {
        id: 'uber-drivers',
        name: 'ドライバー',
        icon: '🚘',
        color: '#000000',
        position: { x: 150, y: 200 },
        value: 5000000,
        valueLabel: 'ドライバー数',
        activeRate: 0.6,
      },
      {
        id: 'uber-riders',
        name: '乗客',
        icon: '🧑',
        color: '#276EF1',
        position: { x: 450, y: 100 },
        value: 130000000,
        valueLabel: 'ユーザー数',
        activeRate: 0.4,
      },
      {
        id: 'uber-eats',
        name: 'Uber Eats',
        icon: '🍔',
        color: '#06C167',
        position: { x: 450, y: 300 },
        value: 900000,
        valueLabel: '加盟店数',
        activeRate: 0.7,
      },
      {
        id: 'uber-merchants',
        name: 'レストラン',
        icon: '🍽️',
        color: '#FF5A5F',
        position: { x: 700, y: 200 },
        value: 900000,
        valueLabel: '加盟店数',
        activeRate: 0.65,
      },
    ],
    connections: [
      { id: 'c1', sourceId: 'uber-drivers', targetId: 'uber-riders', synergy: 'excellent' as SynergyLevel },
      { id: 'c2', sourceId: 'uber-drivers', targetId: 'uber-eats', synergy: 'excellent' as SynergyLevel },
      { id: 'c3', sourceId: 'uber-riders', targetId: 'uber-eats', synergy: 'good' as SynergyLevel },
      { id: 'c4', sourceId: 'uber-eats', targetId: 'uber-merchants', synergy: 'excellent' as SynergyLevel },
    ],
  },
};

// 電話ネットワーク: メトカーフの法則の基本例
const phonePreset: Preset = {
  id: 'phone',
  name: '電話ネットワーク',
  description: 'メトカーフの法則の古典的な例',
  icon: '📞',
  data: {
    nodes: [
      {
        id: 'phone-tokyo',
        name: '東京',
        icon: '📍',
        color: '#E53935',
        position: { x: 300, y: 150 },
        value: 14000000,
        valueLabel: '人口',
        activeRate: 0.8,
      },
      {
        id: 'phone-osaka',
        name: '大阪',
        icon: '🏙️',
        color: '#1E88E5',
        position: { x: 550, y: 150 },
        value: 8800000,
        valueLabel: '人口',
        activeRate: 0.75,
      },
      {
        id: 'phone-nagoya',
        name: '名古屋',
        icon: '🌆',
        color: '#43A047',
        position: { x: 300, y: 350 },
        value: 2300000,
        valueLabel: '人口',
        activeRate: 0.7,
      },
      {
        id: 'phone-fukuoka',
        name: '福岡',
        icon: '🌉',
        color: '#FB8C00',
        position: { x: 550, y: 350 },
        value: 1600000,
        valueLabel: '人口',
        activeRate: 0.65,
      },
    ],
    connections: [
      { id: 'c1', sourceId: 'phone-tokyo', targetId: 'phone-osaka', synergy: 'excellent' as SynergyLevel },
      { id: 'c2', sourceId: 'phone-tokyo', targetId: 'phone-nagoya', synergy: 'good' as SynergyLevel },
      { id: 'c3', sourceId: 'phone-osaka', targetId: 'phone-nagoya', synergy: 'good' as SynergyLevel },
      { id: 'c4', sourceId: 'phone-osaka', targetId: 'phone-fukuoka', synergy: 'good' as SynergyLevel },
      { id: 'c5', sourceId: 'phone-nagoya', targetId: 'phone-fukuoka', synergy: 'standard' as SynergyLevel },
      { id: 'c6', sourceId: 'phone-tokyo', targetId: 'phone-fukuoka', synergy: 'standard' as SynergyLevel },
    ],
  },
};

export const PRESETS: Preset[] = [
  linePreset,
  mercariPreset,
  uberPreset,
  phonePreset,
];
