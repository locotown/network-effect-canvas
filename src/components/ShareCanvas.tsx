import type { FlowState, FlowNode, Connection } from '../types/flow';
import { CANVAS_CONFIG, SYNERGY_CONFIGS } from '../constants/nodes';
import { formatNumber, formatPercent, getEffectiveValue, calculateNetworkValue } from '../utils/metcalfe';
import { UsersIcon, BoltIcon, NetworkIcon } from './icons/ServiceIcons';

interface ShareCanvasProps {
  flowState: FlowState;
}

// Generate lighter background color from node color
const getLighterColor = (hexColor: string, opacity: number = 0.15): string => {
  return `${hexColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
};

// Read-only node component
const ReadOnlyNode: React.FC<{ node: FlowNode }> = ({ node }) => {
  const effectiveValue = getEffectiveValue(node);

  return (
    <div
      className="absolute backdrop-blur-xl border rounded-2xl shadow-glass"
      style={{
        left: node.position.x,
        top: node.position.y,
        width: CANVAS_CONFIG.nodeWidth,
        backgroundColor: getLighterColor(node.color, 0.15),
        borderColor: getLighterColor(node.color, 0.4),
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      }}
    >
      {/* Header */}
      <div
        className="rounded-t-2xl border-b border-white/30"
        style={{
          padding: '12px 16px',
          backgroundColor: getLighterColor(node.color, 0.25),
        }}
      >
        <div className="flex items-center" style={{ gap: '10px' }}>
          <div
            className="rounded-lg bg-white/60 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-sm flex-shrink-0"
            style={{ width: '32px', height: '32px' }}
          >
            <span className="text-lg">{node.icon}</span>
          </div>
          <span className="text-sm font-semibold text-slate-800 truncate">
            {node.name}
          </span>
        </div>
      </div>

      {/* Content area */}
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Value row */}
        <div>
          <label className="text-xs text-slate-500 block" style={{ marginBottom: '6px' }}>
            {node.valueLabel}
          </label>
          <div className="flex items-center text-sm text-slate-700" style={{ gap: '8px' }}>
            <div
              className="rounded-md bg-white/60 backdrop-blur-sm border border-white/40 flex items-center justify-center flex-shrink-0"
              style={{ width: '24px', height: '24px' }}
            >
              <UsersIcon style={{ width: '12px', height: '12px' }} className="text-slate-400" />
            </div>
            <span className="font-medium">{formatNumber(node.value)}</span>
          </div>
        </div>

        {/* Active rate display */}
        <div>
          <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
            <label className="text-xs text-slate-500 flex items-center" style={{ gap: '8px' }}>
              <div
                className="rounded-md bg-white/60 backdrop-blur-sm border border-white/40 flex items-center justify-center flex-shrink-0"
                style={{ width: '24px', height: '24px' }}
              >
                <BoltIcon style={{ width: '12px', height: '12px' }} className="text-slate-400" />
              </div>
              アクティブ率
            </label>
            <span
              className="text-xs font-semibold text-slate-700 bg-white/60 backdrop-blur-sm rounded-md border border-white/40"
              style={{ padding: '4px 10px' }}
            >
              {formatPercent(node.activeRate)}
            </span>
          </div>
          {/* Progress bar instead of slider */}
          <div className="w-full h-2 bg-white/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-400/60 rounded-full"
              style={{ width: `${node.activeRate * 100}%` }}
            />
          </div>
        </div>

        {/* Effective value display */}
        <div
          className="text-xs text-slate-500 border-t border-white/30 flex items-center justify-between"
          style={{ paddingTop: '12px' }}
        >
          <span>有効値</span>
          <span
            className="font-semibold text-slate-700 bg-white/60 backdrop-blur-sm rounded-md border border-white/40"
            style={{ padding: '4px 10px' }}
          >
            {formatNumber(effectiveValue)}
          </span>
        </div>
      </div>
    </div>
  );
};

// Read-only connection line component
const ReadOnlyConnectionLine: React.FC<{ connection: Connection; nodes: FlowNode[] }> = ({
  connection,
  nodes,
}) => {
  const sourceNode = nodes.find((n) => n.id === connection.sourceId);
  const targetNode = nodes.find((n) => n.id === connection.targetId);

  if (!sourceNode || !targetNode) return null;

  // Calculate node centers
  const sourceCenterX = sourceNode.position.x + CANVAS_CONFIG.nodeWidth / 2;
  const sourceCenterY = sourceNode.position.y + CANVAS_CONFIG.nodeHeight / 2;
  const targetCenterX = targetNode.position.x + CANVAS_CONFIG.nodeWidth / 2;
  const targetCenterY = targetNode.position.y + CANVAS_CONFIG.nodeHeight / 2;

  // Calculate direction
  const deltaX = targetCenterX - sourceCenterX;
  const deltaY = targetCenterY - sourceCenterY;

  type Edge = 'top' | 'bottom' | 'left' | 'right';
  let sourceEdge: Edge;
  let targetEdge: Edge;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0) {
      sourceEdge = 'right';
      targetEdge = 'left';
    } else {
      sourceEdge = 'left';
      targetEdge = 'right';
    }
  } else {
    if (deltaY > 0) {
      sourceEdge = 'bottom';
      targetEdge = 'top';
    } else {
      sourceEdge = 'top';
      targetEdge = 'bottom';
    }
  }

  const getEdgePoint = (node: FlowNode, edge: Edge) => {
    const x = node.position.x;
    const y = node.position.y;
    const w = CANVAS_CONFIG.nodeWidth;
    const h = CANVAS_CONFIG.nodeHeight;

    switch (edge) {
      case 'top':
        return { x: x + w / 2, y: y };
      case 'bottom':
        return { x: x + w / 2, y: y + h };
      case 'left':
        return { x: x, y: y + h / 2 };
      case 'right':
        return { x: x + w, y: y + h / 2 };
    }
  };

  const sourcePoint = getEdgePoint(sourceNode, sourceEdge);
  const targetPoint = getEdgePoint(targetNode, targetEdge);

  const sourceX = sourcePoint.x;
  const sourceY = sourcePoint.y;
  const targetX = targetPoint.x;
  const targetY = targetPoint.y;

  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;

  const isHorizontal = sourceEdge === 'left' || sourceEdge === 'right';
  const distance = Math.sqrt(Math.pow(targetX - sourceX, 2) + Math.pow(targetY - sourceY, 2));
  const controlOffset = Math.min(distance * 0.4, 80);

  const synergyConfig = SYNERGY_CONFIGS[connection.synergy];

  const getColor = () => {
    switch (connection.synergy) {
      case 'excellent': return '#10B981';
      case 'good': return '#3B82F6';
      default: return '#94a3b8';
    }
  };

  const color = getColor();
  const gradientId = `gradient-${connection.id}`;

  let ctrl1X: number, ctrl1Y: number, ctrl2X: number, ctrl2Y: number;

  if (isHorizontal) {
    const dir = sourceEdge === 'right' ? 1 : -1;
    ctrl1X = sourceX + controlOffset * dir;
    ctrl1Y = sourceY;
    ctrl2X = targetX - controlOffset * dir;
    ctrl2Y = targetY;
  } else {
    const dir = sourceEdge === 'bottom' ? 1 : -1;
    ctrl1X = sourceX;
    ctrl1Y = sourceY + controlOffset * dir;
    ctrl2X = targetX;
    ctrl2Y = targetY - controlOffset * dir;
  }

  const pathD = `M ${sourceX} ${sourceY} C ${ctrl1X} ${ctrl1Y}, ${ctrl2X} ${ctrl2Y}, ${targetX} ${targetY}`;

  let arrowRotation = 0;
  switch (targetEdge) {
    case 'left': arrowRotation = 0; break;
    case 'right': arrowRotation = 180; break;
    case 'top': arrowRotation = 90; break;
    case 'bottom': arrowRotation = -90; break;
  }

  return (
    <g>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="50%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Glow path */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.15"
      />

      {/* Main path */}
      <path
        d={pathD}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Arrow head */}
      <polygon
        points="0,0 -10,-5 -10,5"
        fill={color}
        opacity="0.8"
        transform={`translate(${targetX}, ${targetY}) rotate(${arrowRotation})`}
      />

      {/* Synergy badge */}
      <foreignObject x={midX - 22} y={midY - 10} width="44" height="20">
        <div
          className="w-full h-full flex items-center justify-center bg-white/70 backdrop-blur-md border border-white/50 rounded-full shadow-sm"
          style={{
            backdropFilter: 'blur(12px) saturate(180%)',
            WebkitBackdropFilter: 'blur(12px) saturate(180%)',
          }}
        >
          <span className="text-[10px] font-semibold" style={{ color }}>
            {synergyConfig.coefficient.toFixed(1)}x
          </span>
        </div>
      </foreignObject>
    </g>
  );
};

// Calculate canvas size from nodes
const calculateCanvasSize = (nodes: FlowNode[]) => {
  if (nodes.length === 0) {
    return { width: 800, height: 600 };
  }

  let maxX = 0;
  let maxY = 0;

  for (const node of nodes) {
    maxX = Math.max(maxX, node.position.x + CANVAS_CONFIG.nodeWidth + 100);
    maxY = Math.max(maxY, node.position.y + CANVAS_CONFIG.nodeHeight + 100);
  }

  return { width: Math.max(800, maxX), height: Math.max(600, maxY) };
};

export const ShareCanvas: React.FC<ShareCanvasProps> = ({ flowState }) => {
  const { nodes, connections } = flowState;
  const canvasSize = calculateCanvasSize(nodes);
  const networkValue = calculateNetworkValue(nodes, connections, 'simple');

  return (
    <div className="flex flex-col h-full">
      {/* Stats header */}
      <div className="glass-heavy border-b border-white/30 shadow-glass-sm" style={{ padding: '12px 20px' }}>
        <div className="flex items-center justify-center" style={{ gap: '16px' }}>
          <div className="flex items-center" style={{ gap: '8px' }}>
            <div className="rounded-lg bg-white/50 backdrop-blur-sm border border-white/40 flex items-center justify-center shadow-sm" style={{ width: '32px', height: '32px' }}>
              <NetworkIcon style={{ width: '16px', height: '16px' }} className="text-slate-600" />
            </div>
            <div>
              <div className="text-xs text-slate-500">ネットワーク</div>
              <div className="text-sm font-semibold text-slate-800">
                {nodes.length} ノード / {connections.length} 接続
              </div>
            </div>
          </div>

          {connections.length > 0 && networkValue.multiplier > 1 && (
            <div className="flex items-center rounded-xl shadow-sm bg-emerald-500/80 backdrop-blur-xl border border-emerald-400/50" style={{ padding: '8px 16px' }}>
              <div className="text-lg font-bold text-white">
                {networkValue.multiplier.toFixed(1)}x
              </div>
              <span className="text-[10px] font-medium text-emerald-100 ml-2">ネットワーク効果</span>
            </div>
          )}
        </div>
      </div>

      {/* Canvas area */}
      <div
        className="flex-1 overflow-auto"
        style={{
          background: 'linear-gradient(135deg, #e0e7ff 0%, #fce7f3 35%, #dbeafe 65%, #f3e8ff 100%)',
        }}
      >
        <div
          className="relative"
          style={{
            width: canvasSize.width,
            height: canvasSize.height,
            minWidth: '100%',
            minHeight: '100%',
          }}
        >
          {/* Dot pattern */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(148, 163, 184, 0.3) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* SVG layer for connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {connections.map((connection) => (
              <ReadOnlyConnectionLine
                key={connection.id}
                connection={connection}
                nodes={nodes}
              />
            ))}
          </svg>

          {/* Nodes layer */}
          {nodes.map((node) => (
            <ReadOnlyNode key={node.id} node={node} />
          ))}

          {/* Empty state */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="glass rounded-xl shadow-glass text-center" style={{ padding: '24px 32px' }}>
                <p className="text-sm text-slate-600">
                  共有されたキャンバスにノードがありません
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
