import type { NetworkValue, IntegrationLevel } from '../types/flow';
import { formatValue } from '../utils/metcalfe';
import { INTEGRATION_CONFIGS, INTEGRATION_LEVELS } from '../constants/nodes';
import { NetworkIcon, ChartIcon } from './icons/ServiceIcons';

interface HeaderProps {
  nodeCount: number;
  connectionCount: number;
  networkValue: NetworkValue;
  integrationLevel: IntegrationLevel;
  onIntegrationLevelChange: (level: IntegrationLevel) => void;
  onHelpClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  nodeCount,
  connectionCount,
  networkValue,
  integrationLevel,
  onIntegrationLevelChange,
  onHelpClick,
}) => {
  const hasNodes = nodeCount > 0;
  const hasConnections = connectionCount > 0;
  const showMultiplier = hasNodes && hasConnections && networkValue.multiplier > 1;
  const currentIntegration = INTEGRATION_CONFIGS[integrationLevel];

  return (
    <header className="glass-heavy border-b border-white/30 shadow-glass-sm relative">
      {/* Top row: Title and stats */}
      <div className="flex items-center justify-between" style={{ height: '52px', padding: '0 20px' }}>
        <div className="flex items-center" style={{ gap: '10px' }}>
          <div className="rounded-lg bg-white/50 backdrop-blur-sm border border-white/40 flex items-center justify-center shadow-sm flex-shrink-0" style={{ width: '32px', height: '32px' }}>
            <NetworkIcon style={{ width: '16px', height: '16px' }} className="text-slate-600" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-slate-800 leading-tight">
              ネットワーク効果キャンバス
            </h1>
            <span className="text-[11px] text-slate-500 leading-tight">
              戦略的ネットワーク可視化ツール
            </span>
          </div>
        </div>

        <div className="flex items-center" style={{ gap: '12px' }}>
          {/* Integration Level Selector */}
          <div className="flex items-center" style={{ gap: '8px' }}>
            <span className="text-xs text-slate-600">統合レベル</span>
            <select
              value={integrationLevel}
              onChange={(e) => onIntegrationLevelChange(e.target.value as IntegrationLevel)}
              className="text-xs font-medium bg-white/60 backdrop-blur-sm text-slate-700 border border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent cursor-pointer shadow-sm transition-all duration-300 hover:bg-white/80"
              style={{ padding: '6px 10px' }}
            >
              {INTEGRATION_LEVELS.map((level) => (
                <option key={level.level} value={level.level}>
                  {level.label} ({level.coefficient.toFixed(1)}x)
                </option>
              ))}
            </select>
          </div>

          {/* Stats badges - glass pill style */}
          <div className="flex items-center" style={{ gap: '8px' }}>
            <span className="flex items-center text-xs text-slate-700 bg-white/50 backdrop-blur-sm border border-white/40 rounded-full shadow-sm" style={{ gap: '6px', padding: '4px 10px' }}>
              <span className="rounded-full bg-blue-500" style={{ width: '5px', height: '5px' }}></span>
              {nodeCount} ノード
            </span>
            <span className="flex items-center text-xs text-slate-700 bg-white/50 backdrop-blur-sm border border-white/40 rounded-full shadow-sm" style={{ gap: '6px', padding: '4px 10px' }}>
              <span className="rounded-full bg-emerald-500" style={{ width: '5px', height: '5px' }}></span>
              {connectionCount} 接続
            </span>
          </div>

          {/* Help button */}
          <button
            onClick={onHelpClick}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-white/50 backdrop-blur-sm border border-white/40 rounded-lg hover:bg-white/70 hover:text-blue-600 transition-all duration-300 shadow-sm"
            style={{ padding: '6px 12px' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            ヘルプ
          </button>
        </div>
      </div>

      {/* Bottom row: Network value display */}
      {hasNodes && (
        <div className="bg-white/20 border-t border-white/30" style={{ padding: '12px 20px' }}>
          <div className="flex items-center justify-center" style={{ gap: '12px' }}>
            {/* Standalone Value - glass card */}
            <div className="glass rounded-xl shadow-sm" style={{ padding: '10px 20px' }}>
              <div className="text-xs font-medium text-slate-500">単体価値</div>
              <div className="text-[10px] text-slate-400" style={{ marginBottom: '2px' }}>規模の指標</div>
              <div className="text-lg font-semibold text-slate-800">
                {formatValue(networkValue.standaloneValue)}
              </div>
            </div>

            {/* Arrow */}
            {hasConnections && (
              <div className="flex items-center text-slate-400/60" style={{ gap: '4px' }}>
                <div className="bg-gradient-to-r from-slate-300/50 to-slate-400/50" style={{ width: '16px', height: '1px' }}></div>
                <div className="rounded-full bg-white/40 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-sm" style={{ width: '24px', height: '24px' }}>
                  <ChartIcon className="text-slate-500" style={{ width: '12px', height: '12px' }} />
                </div>
                <div className="bg-gradient-to-l from-slate-300/50 to-slate-400/50" style={{ width: '16px', height: '1px' }}></div>
              </div>
            )}

            {/* Connected Value - glass card with blue tint */}
            {hasConnections && (
              <div className="rounded-xl shadow-sm bg-blue-500/80 backdrop-blur-xl border border-blue-400/50" style={{ padding: '10px 20px' }}>
                <div className="text-xs font-medium text-blue-100" style={{ marginBottom: '2px' }}>
                  接続価値 x{currentIntegration.coefficient.toFixed(1)}
                </div>
                <div className="text-lg font-semibold text-white">
                  {formatValue(networkValue.connectedValue)}
                </div>
              </div>
            )}

            {/* Multiplier - glass card with green tint */}
            {showMultiplier && (
              <div className="flex flex-col items-center rounded-xl shadow-sm bg-emerald-500/80 backdrop-blur-xl border border-emerald-400/50" style={{ padding: '8px 16px' }}>
                <div className="text-lg font-bold text-white">
                  {networkValue.multiplier.toFixed(1)}x
                </div>
                <span className="text-[10px] font-medium text-emerald-100">ネットワーク効果</span>
              </div>
            )}

            {/* No connections hint */}
            {!hasConnections && (
              <div className="flex items-center text-xs text-slate-500 bg-white/30 backdrop-blur-sm rounded-full border border-white/40" style={{ padding: '6px 12px', gap: '4px' }}>
                <span>ノードを接続してネットワーク効果を確認</span>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
