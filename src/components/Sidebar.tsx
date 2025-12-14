import { useState } from 'react';
import { ICON_OPTIONS, NODE_COLORS, DEFAULT_NODE_VALUES } from '../constants/nodes';
import { PRESETS } from '../constants/presets';
import type { NodeInput } from '../types/flow';
import type { HelpTabId } from './HelpModal';
import { formatNumber } from '../utils/metcalfe';

interface SidebarProps {
  onAddNode: (input: NodeInput) => void;
  onClear: () => void;
  onLoadPreset: (presetId: string) => void;
  onOpenHelp: (tab?: HelpTabId) => void;
}

const helpLinks: { id: HelpTabId; label: string; icon: string }[] = [
  { id: 'effect', label: 'ネットワーク効果とは', icon: '📈' },
  { id: 'metcalfe', label: 'メトカーフの法則', icon: '📐' },
  { id: 'relation', label: '両者の関係', icon: '🔗' },
  { id: 'guide', label: '使い方', icon: '📖' },
];

export const Sidebar: React.FC<SidebarProps> = ({ onAddNode, onClear, onLoadPreset, onOpenHelp }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [nodeName, setNodeName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(DEFAULT_NODE_VALUES.icon);
  const [selectedColor, setSelectedColor] = useState(DEFAULT_NODE_VALUES.color);
  const [nodeValue, setNodeValue] = useState(DEFAULT_NODE_VALUES.value.toString());
  const [valueLabel, setValueLabel] = useState(DEFAULT_NODE_VALUES.valueLabel);

  const resetForm = () => {
    setNodeName('');
    setSelectedIcon(DEFAULT_NODE_VALUES.icon);
    setSelectedColor(DEFAULT_NODE_VALUES.color);
    setNodeValue(DEFAULT_NODE_VALUES.value.toString());
    setValueLabel(DEFAULT_NODE_VALUES.valueLabel);
  };

  const handleSubmit = () => {
    if (!nodeName.trim()) return;

    const input: NodeInput = {
      name: nodeName.trim(),
      icon: selectedIcon,
      color: selectedColor,
      value: parseInt(nodeValue, 10) || DEFAULT_NODE_VALUES.value,
      valueLabel: valueLabel || DEFAULT_NODE_VALUES.valueLabel,
      activeRate: DEFAULT_NODE_VALUES.activeRate,
    };

    onAddNode(input);
    resetForm();
    setIsFormOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && nodeName.trim()) {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setIsFormOpen(false);
      resetForm();
    }
  };

  // Group icons by category
  const iconsByCategory = ICON_OPTIONS.reduce((acc, opt) => {
    if (!acc[opt.category]) {
      acc[opt.category] = [];
    }
    acc[opt.category].push(opt);
    return acc;
  }, {} as Record<string, typeof ICON_OPTIONS>);

  return (
    <aside className="w-[260px] glass-heavy border-r border-white/30 shadow-glass-sm flex flex-col relative" style={{ padding: '14px' }}>
      <div className="flex items-center gap-2 pb-2 border-b border-white/30" style={{ marginBottom: '10px' }}>
        <h2 className="text-xs font-semibold text-slate-700">
          ノード
        </h2>
      </div>

      {/* Add Node Button / Form */}
      {!isFormOpen ? (
        <button
          onClick={() => setIsFormOpen(true)}
          className="w-full flex items-center justify-center gap-2 text-sm font-medium text-blue-600 bg-blue-50/60 backdrop-blur-sm border border-blue-200/50 rounded-xl hover:bg-blue-100/60 hover:border-blue-300/50 transition-all duration-300 shadow-sm"
          style={{ padding: '12px 16px', marginBottom: '12px' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新規ノードを追加
        </button>
      ) : (
        <div
          className="glass rounded-xl border border-white/40 shadow-glass"
          style={{ padding: '14px', marginBottom: '12px' }}
        >
          {/* Node Name */}
          <div style={{ marginBottom: '12px' }}>
            <label className="text-xs text-slate-600 block" style={{ marginBottom: '6px' }}>
              ノード名 *
            </label>
            <input
              type="text"
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="例: 東京エリア"
              autoFocus
              className="w-full text-sm bg-white/60 backdrop-blur-sm border border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300"
              style={{ padding: '8px 12px' }}
            />
          </div>

          {/* Icon Selection */}
          <div style={{ marginBottom: '12px' }}>
            <label className="text-xs text-slate-600 block" style={{ marginBottom: '6px' }}>
              アイコン
            </label>
            <div className="max-h-32 overflow-y-auto bg-white/40 rounded-lg border border-white/50" style={{ padding: '8px' }}>
              {Object.entries(iconsByCategory).map(([category, icons]) => (
                <div key={category} style={{ marginBottom: '8px' }}>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider" style={{ marginBottom: '4px' }}>
                    {category}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {icons.map((opt) => (
                      <button
                        key={opt.icon}
                        onClick={() => setSelectedIcon(opt.icon)}
                        className={`w-7 h-7 flex items-center justify-center rounded-md transition-all duration-200
                          ${selectedIcon === opt.icon
                            ? 'bg-blue-500 text-white shadow-sm scale-110'
                            : 'bg-white/60 hover:bg-white/80 hover:scale-105'
                          }`}
                        title={opt.label}
                      >
                        {opt.icon}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div style={{ marginBottom: '12px' }}>
            <label className="text-xs text-slate-600 block" style={{ marginBottom: '6px' }}>
              カラー
            </label>
            <div className="flex flex-wrap gap-2">
              {NODE_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-6 h-6 rounded-full transition-all duration-200 border-2
                    ${selectedColor === color
                      ? 'border-slate-600 scale-110 shadow-sm'
                      : 'border-white/50 hover:scale-105'
                    }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Value Label */}
          <div style={{ marginBottom: '12px' }}>
            <label className="text-xs text-slate-600 block" style={{ marginBottom: '6px' }}>
              指標ラベル
            </label>
            <input
              type="text"
              value={valueLabel}
              onChange={(e) => setValueLabel(e.target.value)}
              placeholder="例: ユーザー数"
              className="w-full text-sm bg-white/60 backdrop-blur-sm border border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50"
              style={{ padding: '8px 12px' }}
            />
          </div>

          {/* Initial Value */}
          <div style={{ marginBottom: '14px' }}>
            <label className="text-xs text-slate-600 block" style={{ marginBottom: '6px' }}>
              初期値
            </label>
            <input
              type="number"
              value={nodeValue}
              onChange={(e) => setNodeValue(e.target.value)}
              min="1"
              className="w-full text-sm bg-white/60 backdrop-blur-sm border border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50"
              style={{ padding: '8px 12px' }}
            />
          </div>

          {/* Preview */}
          <div
            className="rounded-lg border border-white/50 flex items-center gap-2"
            style={{
              padding: '8px 12px',
              marginBottom: '14px',
              backgroundColor: `${selectedColor}20`,
            }}
          >
            <span className="text-lg">{selectedIcon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-700 truncate">
                {nodeName || '(名前を入力)'}
              </div>
              <div className="text-xs text-slate-500">
                {valueLabel}: {formatNumber(parseInt(nodeValue, 10) || 0)}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsFormOpen(false);
                resetForm();
              }}
              className="flex-1 text-sm text-slate-500 bg-white/50 border border-white/50 rounded-lg hover:bg-white/70 transition-all duration-200"
              style={{ padding: '8px' }}
            >
              キャンセル
            </button>
            <button
              onClick={handleSubmit}
              disabled={!nodeName.trim()}
              className={`flex-1 text-sm font-medium rounded-lg transition-all duration-200
                ${nodeName.trim()
                  ? 'text-white bg-blue-500 hover:bg-blue-600 shadow-sm'
                  : 'text-slate-400 bg-slate-100 cursor-not-allowed'
                }`}
              style={{ padding: '8px' }}
            >
              追加
            </button>
          </div>
        </div>
      )}

      {/* Sample Presets */}
      <div className="glass-light rounded-xl" style={{ padding: '14px', marginBottom: '12px' }}>
        <p className="text-xs font-medium text-slate-600" style={{ marginBottom: '10px' }}>
          サンプルを読み込む
        </p>
        <div className="flex flex-col" style={{ gap: '6px' }}>
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onLoadPreset(preset.id)}
              className="w-full flex items-center text-left text-xs bg-white/50 backdrop-blur-sm border border-white/40 rounded-lg hover:bg-white/70 hover:border-blue-200/50 transition-all duration-200 shadow-sm"
              style={{ padding: '8px 10px', gap: '8px' }}
            >
              <span className="text-base flex-shrink-0">{preset.icon}</span>
              <div className="min-w-0">
                <div className="font-medium text-slate-700 truncate">{preset.name}</div>
                <div className="text-[10px] text-slate-500 truncate">{preset.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Help links - glass style */}
      <div className="glass-light rounded-xl" style={{ padding: '14px', marginBottom: '12px' }}>
        <p className="text-xs font-medium text-slate-600" style={{ marginBottom: '10px' }}>
          📚 ヘルプ
        </p>
        <div className="flex flex-col" style={{ gap: '6px' }}>
          {helpLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onOpenHelp(link.id)}
              className="w-full flex items-center text-left text-xs bg-white/50 backdrop-blur-sm border border-white/40 rounded-lg hover:bg-white/70 hover:border-blue-200/50 transition-all duration-200 shadow-sm"
              style={{ padding: '8px 10px', gap: '8px' }}
            >
              <span className="text-base flex-shrink-0">{link.icon}</span>
              <span className="text-slate-700">{link.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Clear button - glass style */}
      <div className="border-t border-white/30" style={{ paddingTop: '14px', marginTop: '14px' }}>
        <button
          onClick={onClear}
          className="w-full text-sm font-medium text-slate-500 bg-white/40 backdrop-blur-sm border border-white/40 rounded-xl hover:text-red-500 hover:bg-red-50/50 hover:border-red-200/50 transition-all duration-300 shadow-sm"
          style={{ padding: '10px 16px' }}
        >
          すべてクリア
        </button>
      </div>
    </aside>
  );
};
