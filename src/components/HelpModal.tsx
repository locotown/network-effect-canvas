import { useState, useEffect } from 'react';

export type HelpTabId = 'effect' | 'metcalfe' | 'relation' | 'guide' | 'about';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: HelpTabId;
}

const tabs: { id: HelpTabId; label: string; icon: string }[] = [
  { id: 'effect', label: 'ネットワーク効果', icon: '📈' },
  { id: 'metcalfe', label: 'メトカーフの法則', icon: '📐' },
  { id: 'relation', label: '両者の関係', icon: '🔗' },
  { id: 'guide', label: '使い方', icon: '📖' },
  { id: 'about', label: 'このツールについて', icon: 'ℹ️' },
];

// ノード接続図を描画するSVGコンポーネント
const NodeDiagram: React.FC<{ count: number; size?: number }> = ({ count, size = 60 }) => {
  const nodes: { x: number; y: number }[] = [];
  const center = size / 2;
  const radius = size / 2 - 10;

  for (let i = 0; i < count; i++) {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    nodes.push({
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    });
  }

  return (
    <svg width={size} height={size} className="flex-shrink-0">
      {/* 接続線 */}
      {nodes.map((node1, i) =>
        nodes.slice(i + 1).map((node2, j) => (
          <line
            key={`${i}-${i + j + 1}`}
            x1={node1.x}
            y1={node1.y}
            x2={node2.x}
            y2={node2.y}
            stroke="#94a3b8"
            strokeWidth="1.5"
          />
        ))
      )}
      {/* ノード */}
      {nodes.map((node, i) => (
        <circle
          key={i}
          cx={node.x}
          cy={node.y}
          r="6"
          fill="#3b82f6"
          stroke="white"
          strokeWidth="2"
        />
      ))}
    </svg>
  );
};

// 棒グラフコンポーネント
const BarChart: React.FC<{ data: { label: string; value: number; connections: number }[] }> = ({ data }) => {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="flex items-end justify-center gap-4" style={{ height: '120px' }}>
      {data.map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-1">
          <div className="text-xs font-semibold text-slate-700">{item.value}</div>
          <div
            className="w-10 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md transition-all duration-500"
            style={{ height: `${(item.value / maxValue) * 80}px` }}
          />
          <div className="text-xs text-slate-500">n={item.label}</div>
          <div className="text-[10px] text-slate-400">{item.connections}接続</div>
        </div>
      ))}
    </div>
  );
};

// サイクル図コンポーネント
const CycleDiagram: React.FC<{ items: string[] }> = ({ items }) => {
  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-xs font-medium text-blue-700">
            {item}
          </span>
          {i < items.length - 1 && (
            <span className="text-slate-400">→</span>
          )}
        </div>
      ))}
      <span className="text-slate-400">↻</span>
    </div>
  );
};

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, initialTab = 'effect' }) => {
  const [activeTab, setActiveTab] = useState<HelpTabId>(initialTab);

  // Sync activeTab with initialTab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/50 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-xl">💡</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">ヘルプ</h2>
              <p className="text-xs text-slate-500">ネットワーク効果とこのツールの使い方</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/60 hover:bg-white border border-slate-200/50 flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200/50 bg-slate-50/50 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-all relative ${
                activeTab === tab.id
                  ? 'text-blue-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Tab 1: ネットワーク効果とは */}
          {activeTab === 'effect' && (
            <div className="space-y-6">
              {/* 定義 */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">📈</div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">ネットワーク効果とは</h3>
                    <p className="text-slate-700 leading-relaxed">
                      <strong className="text-blue-600">「利用者が増えるほど、サービス全体の価値が加速度的に高まる現象」</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* 電話の例 */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <span>📞</span> 電話のネットワーク効果
                </h4>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { users: 1, value: '0', desc: '誰とも話せない', emoji: '😐' },
                    { users: 2, value: '1', desc: '1通話可能', emoji: '😊' },
                    { users: 5, value: '10', desc: '10通話可能', emoji: '😄' },
                    { users: 100, value: '4,950', desc: '4,950通話可能', emoji: '🌐' },
                  ].map((item) => (
                    <div key={item.users} className="text-center p-3 bg-slate-50 rounded-lg">
                      <div className="text-2xl mb-2">{item.emoji}</div>
                      <div className="text-xs text-slate-500">{item.users}人</div>
                      <div className="text-lg font-bold text-blue-600">{item.value}</div>
                      <div className="text-[10px] text-slate-400">{item.desc}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800 flex items-center gap-2">
                    <span>💡</span>
                    <strong>ユーザーが2倍になると、価値は約4倍に！</strong>
                  </p>
                </div>
              </div>

              {/* 身近な事例 */}
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-3">身近な事例</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <div className="text-2xl mb-2">📱</div>
                    <h5 className="font-semibold text-slate-800 mb-2">LINE</h5>
                    <CycleDiagram items={['ユーザー増', '連絡相手増', '利便性向上']} />
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <div className="text-2xl mb-2">🛒</div>
                    <h5 className="font-semibold text-slate-800 mb-2">メルカリ</h5>
                    <CycleDiagram items={['出品者増', '商品増', '購入者増']} />
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <div className="text-2xl mb-2">🚗</div>
                    <h5 className="font-semibold text-slate-800 mb-2">Uber</h5>
                    <CycleDiagram items={['ドライバー増', '待ち時間減', '乗客増']} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: メトカーフの法則 */}
          {activeTab === 'metcalfe' && (
            <div className="space-y-6">
              {/* 法則の説明 */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">📐</div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">メトカーフの法則</h3>
                    <div className="text-3xl font-mono font-bold text-purple-600 mb-2">V = n²</div>
                    <p className="text-slate-600 text-sm">
                      V: ネットワークの価値　/　n: ノード（参加者）数
                    </p>
                    <p className="text-slate-700 mt-2">
                      <strong>「ネットワークの価値は参加者数の2乗に比例する」</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* ノード数と接続数の関係 */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <h4 className="text-sm font-bold text-slate-700 mb-4">ノード数が増えると接続が爆発的に増える</h4>
                <div className="flex justify-center gap-8 mb-6">
                  {[2, 3, 4, 5].map((n) => (
                    <div key={n} className="text-center">
                      <NodeDiagram count={n} size={70} />
                      <div className="mt-2 text-xs text-slate-500">n = {n}</div>
                      <div className="text-xs text-slate-400">{(n * (n - 1)) / 2}接続</div>
                    </div>
                  ))}
                </div>

                {/* 棒グラフ */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h5 className="text-xs font-medium text-slate-600 mb-3 text-center">📊 ネットワーク価値の成長</h5>
                  <BarChart
                    data={[
                      { label: '2', value: 4, connections: 1 },
                      { label: '3', value: 9, connections: 3 },
                      { label: '4', value: 16, connections: 6 },
                      { label: '5', value: 25, connections: 10 },
                    ]}
                  />
                </div>
              </div>

              {/* なぜ2乗なのか */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h4 className="text-sm font-bold text-blue-800 mb-2">💡 なぜ2乗に比例するのか？</h4>
                <p className="text-sm text-blue-700">
                  各ノードは他のすべてのノードと接続可能です。<br />
                  接続数 = n(n-1)/2 ≈ n² / 2<br />
                  つまり、参加者が増えると接続パターンが<strong>指数関数的に</strong>増加します。
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: 両者の関係性 */}
          {activeTab === 'relation' && (
            <div className="space-y-6">
              {/* 関係図 */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span>🔗</span> ネットワーク効果とメトカーフの法則の関係
                </h3>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-full max-w-md bg-white rounded-xl p-4 border border-slate-200 shadow-sm text-center">
                    <div className="text-2xl mb-2">📈</div>
                    <h4 className="font-bold text-slate-800">ネットワーク効果</h4>
                    <p className="text-sm text-slate-500">現象（観察できる事実）</p>
                  </div>
                  <div className="text-2xl text-slate-400">↓</div>
                  <div className="text-sm text-slate-600 bg-white/80 px-4 py-2 rounded-lg">なぜ起きる？</div>
                  <div className="text-2xl text-slate-400">↓</div>
                  <div className="w-full max-w-md bg-white rounded-xl p-4 border border-slate-200 shadow-sm text-center">
                    <div className="text-2xl mb-2">📐</div>
                    <h4 className="font-bold text-slate-800">メトカーフの法則（V = n²）</h4>
                    <p className="text-sm text-slate-500">理論（数学的説明）</p>
                  </div>
                </div>
              </div>

              {/* つまり */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <h4 className="text-sm font-bold text-blue-800 mb-2">ネットワーク効果</h4>
                  <p className="text-sm text-blue-700">
                    = 現象<br />
                    「ユーザーが増えると価値が上がる」
                  </p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <h4 className="text-sm font-bold text-purple-800 mb-2">メトカーフの法則</h4>
                  <p className="text-sm text-purple-700">
                    = 法則<br />
                    「なぜ2乗で増えるかの数学的根拠」
                  </p>
                </div>
              </div>

              {/* 例え話 */}
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <h4 className="text-sm font-bold text-amber-800 mb-2">📌 例え話</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-amber-700">
                  <div>
                    <p>「りんごが落ちる」</p>
                    <p className="text-xs text-amber-600">= 現象（ネットワーク効果）</p>
                  </div>
                  <div>
                    <p>「万有引力の法則」</p>
                    <p className="text-xs text-amber-600">= 法則（メトカーフの法則）</p>
                  </div>
                </div>
              </div>

              {/* このツールでできること */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <span>🎯</span> このツールで何ができる？
                </h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="flex justify-center gap-2 mb-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500" />
                      <div className="w-4 h-4 rounded-full bg-blue-500" />
                      <div className="w-4 h-4 rounded-full bg-blue-500" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">基準スコア（バラバラ）</p>
                    <p className="text-xs text-slate-500">各ノードが独立した状態</p>
                    <p className="text-lg font-bold text-slate-600 mt-2">100</p>
                  </div>
                  <div className="text-center">
                    <NodeDiagram count={5} size={50} />
                    <p className="text-sm font-medium text-slate-700">ネットワークスコア</p>
                    <p className="text-xs text-slate-500">接続で価値が増大</p>
                    <p className="text-lg font-bold text-blue-600 mt-2">320 <span className="text-emerald-500">(+220%)</span></p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
                  <p className="text-sm text-emerald-800">
                    💰 <strong>接続するだけでスコアが3倍以上に！</strong>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: 使い方ガイド */}
          {activeTab === 'guide' && (
            <div className="space-y-4">
              {/* ステップ1 */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 mb-2">ノードを作成</h4>
                    <p className="text-sm text-slate-600 mb-3">
                      サイドバーの「新規ノードを追加」ボタンをクリックして、名前・アイコン・色・初期値を設定します。
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      新規ノードを追加
                    </div>
                  </div>
                </div>
              </div>

              {/* ステップ2 */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 mb-2">キャンバスに配置</h4>
                    <p className="text-sm text-slate-600 mb-3">
                      キャンバス上の好きな位置をクリックして、ノードを配置します。
                    </p>
                    <div className="inline-flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="px-3 py-2 bg-teal-100 border border-teal-300 rounded-lg">
                        <span className="text-lg">📍</span>
                        <span className="text-sm font-medium text-slate-700 ml-2">東京</span>
                      </div>
                      <span className="text-slate-400">← クリックして配置</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ステップ3 */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 mb-2">ノードを接続</h4>
                    <p className="text-sm text-slate-600 mb-3">
                      ノードの「→」ボタンをクリックしてから、接続先のノードをクリックします。
                    </p>
                    <div className="inline-flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="px-3 py-2 bg-teal-100 border border-teal-300 rounded-lg">
                        <span>📍 東京</span>
                      </div>
                      <span className="text-blue-500 text-xl">→</span>
                      <div className="px-3 py-2 bg-rose-100 border border-rose-300 rounded-lg">
                        <span>🏙️ 大阪</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ステップ4 */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 mb-2">効果を確認</h4>
                    <p className="text-sm text-slate-600 mb-3">
                      ヘッダーで「基準スコア」と「ネットワークスコア」を比較して、接続効果を確認します。
                    </p>
                    <div className="inline-flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="px-3 py-2 bg-white border border-slate-200 rounded-lg">
                        <span className="text-xs text-slate-500">基準スコア</span>
                        <span className="text-sm font-bold text-slate-700 ml-2">100</span>
                      </div>
                      <span className="text-slate-400">→</span>
                      <div className="px-3 py-2 bg-blue-500 rounded-lg">
                        <span className="text-xs text-blue-100">ネットワークスコア</span>
                        <span className="text-sm font-bold text-white ml-2">320</span>
                      </div>
                      <div className="px-2 py-1 bg-emerald-500 rounded-md">
                        <span className="text-xs font-bold text-white">+220%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 調整オプション */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h4 className="text-sm font-bold text-slate-700 mb-3">⚙️ 調整オプション</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-slate-700 mb-1">シナジーレベル</p>
                    <p className="text-slate-500">接続線をクリック → 標準/良好/最高</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700 mb-1">統合レベル</p>
                    <p className="text-slate-500">ヘッダーで選択 → 単純/中庸/完全</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: このツールについて */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              {/* 目的 */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">🎯</div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">このツールの目的</h3>
                    <p className="text-slate-700 leading-relaxed">
                      <strong className="text-amber-700">ネットワーク効果の概念を視覚的に理解するための教育ツール</strong>です。
                      ノード（参加者・サービス）を配置して接続することで、ネットワークの成長がもたらす価値の増大を体感できます。
                    </p>
                  </div>
                </div>
              </div>

              {/* 注意事項 */}
              <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                <h4 className="text-sm font-bold text-red-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  計算モデルの限界
                </h4>
                <ul className="space-y-3 text-sm text-red-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span>
                      <strong>簡略化されたモデル：</strong>
                      このツールの計算式は、メトカーフの法則を簡略化して適用しています。実際のネットワーク価値はより複雑な要因に影響されます。
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span>
                      <strong>係数は目安：</strong>
                      シナジーレベル（1.0x〜1.5x）や統合レベルの係数は、概念的な目安であり、学術的な根拠に基づく厳密な値ではありません。
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span>
                      <strong>定量的な意思決定には不適切：</strong>
                      投資判断やビジネス戦略の定量的根拠としては使用しないでください。
                    </span>
                  </li>
                </ul>
              </div>

              {/* 適切な使い方 */}
              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                <h4 className="text-sm font-bold text-emerald-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  適切な使い方
                </h4>
                <ul className="space-y-3 text-sm text-emerald-700">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span>ネットワーク効果の概念を学ぶ・説明する</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span>ビジネスモデルの構造を視覚化してブレインストーミングする</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span>プレゼンテーションや議論のきっかけとして使用する</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span>異なるネットワーク構造のパターンを比較する</span>
                  </li>
                </ul>
              </div>

              {/* 理論的背景 */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h4 className="text-sm font-bold text-blue-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  もっと学ぶには
                </h4>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>• <strong>直接ネットワーク効果</strong>：同種ユーザー間（例：電話、LINE）</li>
                  <li>• <strong>間接ネットワーク効果</strong>：異種ユーザー間の両面市場（例：メルカリ、Uber）</li>
                  <li>• <strong>参考文献</strong>：Metcalfe (2013), Rochet & Tirole (2003) など</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
