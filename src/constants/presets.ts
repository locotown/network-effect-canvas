import type { FlowState, SynergyLevel, PresetExplanation } from '../types/flow';

// Re-export for convenience
export type { PresetExplanation };

export interface Preset {
  id: string;
  name: string;
  description: string;
  icon: string;
  explanation: PresetExplanation;
  data: FlowState;
}

// LINE: メッセージングプラットフォームのネットワーク効果
const linePreset: Preset = {
  id: 'line',
  name: 'LINE',
  description: 'メッセージングアプリのネットワーク効果',
  icon: '💬',
  explanation: {
    title: 'LINEのネットワーク効果',
    summary: '「直接ネットワーク効果」の典型例です。同じタイプのユーザー（メッセージ送受信者）が増えるほど、各ユーザーにとっての価値が高まります。理論的には価値は V ∝ n(n-1)/2 で増加します。',
    points: [
      '【直接効果】ユーザー数nの増加で、可能な接続数は n(n-1)/2 で増加',
      '【補完財】グループチャット、スタンプはネットワーク価値を補完',
      '【エコシステム】LINE Payは決済プラットフォームとして独自の両面市場を形成',
      '※このツールでは複合的なエコシステムを簡略化して表示',
    ],
    networkEffect: '直接ネットワーク効果（Same-side effects）：同じタイプのユーザーが直接つながることで価値が生まれる。電話ネットワークと同じ原理。',
  },
  data: {
    name: 'LINE ネットワーク効果',
    description: 'LINEの直接ネットワーク効果を可視化。ユーザーが増えるほど連絡できる相手が増え、グループチャット・スタンプ・LINE Payなどのエコシステム全体の価値が高まります。',
    nodes: [
      {
        id: 'line-users',
        name: 'ユーザー',
        icon: '👥',
        color: '#06C755',
        position: { x: 80, y: 180 },
        value: 95000000,
        valueLabel: 'ユーザー数',
        activeRate: 0.7,
      },
      {
        id: 'line-groups',
        name: 'グループ',
        icon: '💬',
        color: '#00B900',
        position: { x: 420, y: 50 },
        value: 50000000,
        valueLabel: 'グループ数',
        activeRate: 0.6,
      },
      {
        id: 'line-stickers',
        name: 'スタンプ',
        icon: '🎨',
        color: '#FFE033',
        position: { x: 420, y: 350 },
        value: 1000000,
        valueLabel: 'クリエイター数',
        activeRate: 0.4,
      },
      {
        id: 'line-pay',
        name: 'LINE Pay',
        icon: '💳',
        color: '#1DB446',
        position: { x: 760, y: 180 },
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
  explanation: {
    title: 'メルカリの両面市場効果',
    summary: '「間接ネットワーク効果」と「両面市場」の典型例です。出品者（供給側）と購入者（需要側）という異なるグループが存在し、片方が増えるともう片方にとっての価値が高まります。V ∝ n₁ × n₂ の関係。',
    points: [
      '【間接効果】出品者↔購入者：異なるグループ間で相互に価値を高める（クロスサイド効果）',
      '【マッチング】商品数の増加がマッチング確率を向上させ、両側の価値を増加',
      '【プラットフォーム拡張】メルカリ便・メルペイは取引コストを下げ、ネットワーク価値を補完',
      '※同じユーザーが出品者・購入者を兼ねるため、実際にはより複雑なダイナミクス',
    ],
    networkEffect: '間接ネットワーク効果（Cross-side effects）：出品者が増えると購入者にとっての価値が上がり、購入者が増えると出品者にとっての価値が上がる。',
  },
  data: {
    name: 'メルカリ 両面市場効果',
    description: 'メルカリの間接ネットワーク効果（両面市場）を可視化。出品者が増えると商品が増え購入者が集まり、購入者が増えると出品者も増える好循環が生まれます。',
    nodes: [
      {
        id: 'mercari-sellers',
        name: '出品者',
        icon: '🏪',
        color: '#FF0211',
        position: { x: 80, y: 50 },
        value: 20000000,
        valueLabel: '出品者数',
        activeRate: 0.5,
      },
      {
        id: 'mercari-buyers',
        name: '購入者',
        icon: '🛍️',
        color: '#4A90D9',
        position: { x: 80, y: 350 },
        value: 23000000,
        valueLabel: '購入者数',
        activeRate: 0.6,
      },
      {
        id: 'mercari-listings',
        name: '商品',
        icon: '📦',
        color: '#FF6B6B',
        position: { x: 420, y: 200 },
        value: 2500000000,
        valueLabel: '累計出品数',
        activeRate: 0.8,
      },
      {
        id: 'mercari-logistics',
        name: 'メルカリ便',
        icon: '🚚',
        color: '#00C2B8',
        position: { x: 760, y: 50 },
        value: 170000,
        valueLabel: '取扱店舗数',
        activeRate: 0.9,
      },
      {
        id: 'mercari-payment',
        name: 'メルペイ',
        icon: '💰',
        color: '#FF4655',
        position: { x: 760, y: 350 },
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
  explanation: {
    title: 'Uberの両面市場効果',
    summary: '複数の「両面市場」が重なる複合プラットフォームの例です。ライドシェア（ドライバー↔乗客）とUber Eats（配達員↔注文者↔レストラン）が供給側リソース（ドライバー）を共有することで、規模の経済を実現しています。',
    points: [
      '【間接効果】ドライバー↔乗客：密度が高まると待ち時間短縮→需要増→収入増→供給増',
      '【リソース共有】ライドシェアとUber Eatsでドライバーを共有し、稼働率を最適化',
      '【3面市場】Uber Eatsは配達員・注文者・レストランの3者をマッチング',
      '※地理的密度が重要：同じエリア内での供給・需要のバランスが価値を左右',
    ],
    networkEffect: '間接ネットワーク効果 + 供給側エコノミー：複数の両面市場で供給側リソースを共有し、各市場の効率性を向上させるプラットフォーム戦略。',
  },
  data: {
    name: 'Uber ライドシェア効果',
    description: 'Uberの間接ネットワーク効果とプラットフォーム拡張を可視化。ドライバーが増えると待ち時間短縮→乗客増加→収入増→ドライバー増加の好循環。さらにUber Eatsでドライバーを共有活用。',
    nodes: [
      {
        id: 'uber-drivers',
        name: 'ドライバー',
        icon: '🚘',
        color: '#000000',
        position: { x: 80, y: 180 },
        value: 5000000,
        valueLabel: 'ドライバー数',
        activeRate: 0.6,
      },
      {
        id: 'uber-riders',
        name: '乗客',
        icon: '🧑',
        color: '#276EF1',
        position: { x: 420, y: 50 },
        value: 130000000,
        valueLabel: 'ユーザー数',
        activeRate: 0.4,
      },
      {
        id: 'uber-eats',
        name: 'Uber Eats',
        icon: '🍔',
        color: '#06C167',
        position: { x: 420, y: 350 },
        value: 900000,
        valueLabel: '加盟店数',
        activeRate: 0.7,
      },
      {
        id: 'uber-merchants',
        name: 'レストラン',
        icon: '🍽️',
        color: '#FF5A5F',
        position: { x: 760, y: 180 },
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
  explanation: {
    title: '電話ネットワークとメトカーフの法則',
    summary: 'メトカーフの法則の古典的な例です。n人の参加者がいる場合、可能な接続数は n(n-1)/2 となり、ネットワーク全体の価値はこれに比例します。nが大きくなると近似的に n² に比例します。',
    points: [
      '【接続数の計算】n=4都市で n(n-1)/2 = 6 通りの接続が可能',
      '【直接効果】各都市（ノード）は他のすべての都市と通話可能',
      '【価値の増加】参加者が2倍になると、接続数（＝潜在的価値）は約4倍',
      '※実際の価値は接続の利用頻度や品質にも依存（このツールでは均一と仮定）',
    ],
    networkEffect: 'メトカーフの法則 V ∝ n(n-1)/2 ≈ n²：参加者全員が互いに接続可能な場合の直接ネットワーク効果の理論的モデル。',
  },
  data: {
    name: '電話ネットワーク メトカーフの法則',
    description: 'メトカーフの法則（V = n²）の古典的な例。電話は1人では価値がありませんが、接続される人が増えるほど通話可能な相手が増え、ネットワークの価値は参加者数の2乗に比例して増加します。',
    nodes: [
      {
        id: 'phone-tokyo',
        name: '東京',
        icon: '📍',
        color: '#E53935',
        position: { x: 150, y: 50 },
        value: 14000000,
        valueLabel: '人口',
        activeRate: 0.8,
      },
      {
        id: 'phone-osaka',
        name: '大阪',
        icon: '🏙️',
        color: '#1E88E5',
        position: { x: 550, y: 50 },
        value: 8800000,
        valueLabel: '人口',
        activeRate: 0.75,
      },
      {
        id: 'phone-nagoya',
        name: '名古屋',
        icon: '🌆',
        color: '#43A047',
        position: { x: 150, y: 350 },
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
