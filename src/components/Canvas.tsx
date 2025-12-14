import { useRef } from 'react';
import type { FlowNode, Connection, Position, SynergyLevel } from '../types/flow';
import type { Preset } from '../constants/presets';
import { Node } from './Node';
import { ConnectionLine } from './ConnectionLine';
import { ExplanationPanel } from './ExplanationPanel';
import { NetworkIcon } from './icons/ServiceIcons';

interface CanvasProps {
  nodes: FlowNode[];
  connections: Connection[];
  connectingFrom: string | null;
  pendingNode: { input: any } | null;
  currentPreset: Preset | null;
  onDropNode: (position: Position) => void;
  onUpdateNodePosition: (id: string, position: Position) => void;
  onUpdateNodeValue: (id: string, value: number) => void;
  onUpdateNodeActiveRate: (id: string, activeRate: number) => void;
  onStartConnection: (id: string) => void;
  onCompleteConnection: (id: string) => void;
  onCancelConnection: () => void;
  onDeleteNode: (id: string) => void;
  onDeleteConnection: (id: string) => void;
  onUpdateConnectionSynergy: (id: string, synergy: SynergyLevel) => void;
  onClearPreset: () => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  nodes,
  connections,
  connectingFrom,
  pendingNode,
  currentPreset,
  onDropNode,
  onUpdateNodePosition,
  onUpdateNodeValue,
  onUpdateNodeActiveRate,
  onStartConnection,
  onCompleteConnection,
  onCancelConnection,
  onDeleteNode,
  onDeleteConnection,
  onUpdateConnectionSynergy,
  onClearPreset,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (connectingFrom) {
      onCancelConnection();
      return;
    }

    // If there's a pending node, place it where clicked
    if (pendingNode && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const position = {
        x: e.clientX - rect.left - 120, // Center the node
        y: e.clientY - rect.top - 60,
      };
      onDropNode(position);
    }
  };

  return (
    <div
      ref={canvasRef}
      onClick={handleCanvasClick}
      className={`flex-1 relative overflow-hidden ${pendingNode ? 'cursor-crosshair' : ''}`}
      style={{
        background: 'linear-gradient(135deg, #e0e7ff 0%, #fce7f3 35%, #dbeafe 65%, #f3e8ff 100%)',
      }}
    >
      {/* Subtle dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(148, 163, 184, 0.3) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* SVG layer for connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <g className="pointer-events-auto">
          {connections.map((connection) => (
            <ConnectionLine
              key={connection.id}
              connection={connection}
              nodes={nodes}
              onDelete={onDeleteConnection}
              onSynergyChange={onUpdateConnectionSynergy}
            />
          ))}
        </g>
      </svg>

      {/* Nodes layer */}
      {nodes.map((node) => (
        <Node
          key={node.id}
          node={node}
          isConnecting={!!connectingFrom}
          isConnectionSource={connectingFrom === node.id}
          onPositionChange={onUpdateNodePosition}
          onValueChange={onUpdateNodeValue}
          onActiveRateChange={onUpdateNodeActiveRate}
          onStartConnection={onStartConnection}
          onCompleteConnection={onCompleteConnection}
          onDelete={onDeleteNode}
        />
      ))}

      {/* Empty state - glass card */}
      {nodes.length === 0 && !pendingNode && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="glass rounded-xl shadow-glass text-center" style={{ padding: '24px 32px' }}>
            <div className="mx-auto rounded-xl bg-white/50 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-sm" style={{ width: '48px', height: '48px', marginBottom: '12px' }}>
              <NetworkIcon style={{ width: '24px', height: '24px' }} className="text-slate-500" />
            </div>
            <p className="text-sm font-semibold text-slate-700" style={{ marginBottom: '6px' }}>
              ノードを追加しましょう
            </p>
            <p className="text-xs text-slate-500">
              左メニューから「新規ノードを追加」をクリック
            </p>
          </div>
        </div>
      )}

      {/* Pending node indicator */}
      {pendingNode && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="glass-heavy rounded-xl shadow-glass-lg text-center animate-pulse" style={{ padding: '16px 24px' }}>
            <p className="text-sm font-medium text-slate-700">
              キャンバスをクリックしてノードを配置
            </p>
          </div>
        </div>
      )}

      {/* Connection mode indicator - glass pill */}
      {connectingFrom && (
        <div className="absolute left-1/2 -translate-x-1/2 glass-heavy rounded-full shadow-glass-lg flex items-center text-xs font-medium" style={{ bottom: '12px', padding: '8px 16px', gap: '8px' }}>
          <span className="rounded-full bg-blue-500 animate-pulse" style={{ width: '6px', height: '6px' }}></span>
          <span className="text-slate-700">接続先のノードをクリック</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-400">キャンバスクリックでキャンセル</span>
        </div>
      )}

      {/* Explanation Panel for presets */}
      {currentPreset && (
        <ExplanationPanel
          explanation={currentPreset.explanation}
          onClose={onClearPreset}
        />
      )}
    </div>
  );
};
