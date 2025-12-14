import { useState } from 'react';
import type { FlowNode, Connection, SynergyLevel } from '../types/flow';
import { CANVAS_CONFIG, SYNERGY_CONFIGS, SYNERGY_LEVELS } from '../constants/nodes';

interface ConnectionLineProps {
  connection: Connection;
  nodes: FlowNode[];
  onDelete: (id: string) => void;
  onSynergyChange: (id: string, synergy: SynergyLevel) => void;
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({
  connection,
  nodes,
  onDelete,
  onSynergyChange,
}) => {
  const [showSynergyMenu, setShowSynergyMenu] = useState(false);
  const sourceNode = nodes.find((n) => n.id === connection.sourceId);
  const targetNode = nodes.find((n) => n.id === connection.targetId);

  if (!sourceNode || !targetNode) return null;

  // Calculate node centers
  const sourceCenterX = sourceNode.position.x + CANVAS_CONFIG.nodeWidth / 2;
  const sourceCenterY = sourceNode.position.y + CANVAS_CONFIG.nodeHeight / 2;
  const targetCenterX = targetNode.position.x + CANVAS_CONFIG.nodeWidth / 2;
  const targetCenterY = targetNode.position.y + CANVAS_CONFIG.nodeHeight / 2;

  // Calculate direction from source to target
  const deltaX = targetCenterX - sourceCenterX;
  const deltaY = targetCenterY - sourceCenterY;

  // Determine connection points based on relative position
  type Edge = 'top' | 'bottom' | 'left' | 'right';
  let sourceEdge: Edge;
  let targetEdge: Edge;

  // Use the axis with greater distance to determine primary direction
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Horizontal connection
    if (deltaX > 0) {
      sourceEdge = 'right';
      targetEdge = 'left';
    } else {
      sourceEdge = 'left';
      targetEdge = 'right';
    }
  } else {
    // Vertical connection
    if (deltaY > 0) {
      sourceEdge = 'bottom';
      targetEdge = 'top';
    } else {
      sourceEdge = 'top';
      targetEdge = 'bottom';
    }
  }

  // Calculate actual connection points
  const getEdgePoint = (node: typeof sourceNode, edge: Edge) => {
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

  // Calculate midpoint for synergy badge and delete button
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;

  // Calculate control points for bezier curve based on connection direction
  const isHorizontal = sourceEdge === 'left' || sourceEdge === 'right';
  const distance = Math.sqrt(Math.pow(targetX - sourceX, 2) + Math.pow(targetY - sourceY, 2));
  const controlOffset = Math.min(distance * 0.4, 80);

  const synergyConfig = SYNERGY_CONFIGS[connection.synergy];

  // Color based on synergy level
  const getColor = () => {
    switch (connection.synergy) {
      case 'excellent': return '#10B981'; // emerald
      case 'good': return '#3B82F6'; // blue
      default: return '#94a3b8'; // slate-400
    }
  };

  const color = getColor();
  const gradientId = `gradient-${connection.id}`;

  const handleSynergyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSynergyMenu(!showSynergyMenu);
  };

  const handleSynergySelect = (synergy: SynergyLevel) => {
    onSynergyChange(connection.id, synergy);
    setShowSynergyMenu(false);
  };

  return (
    <g className="group">
      {/* Gradient definition */}
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="50%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0.4" />
        </linearGradient>
        {/* Glass effect filter */}
        <filter id={`glow-${connection.id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Calculate bezier control points based on direction */}
      {(() => {
        let ctrl1X: number, ctrl1Y: number, ctrl2X: number, ctrl2Y: number;

        if (isHorizontal) {
          // Horizontal: control points extend horizontally
          const dir = sourceEdge === 'right' ? 1 : -1;
          ctrl1X = sourceX + controlOffset * dir;
          ctrl1Y = sourceY;
          ctrl2X = targetX - controlOffset * dir;
          ctrl2Y = targetY;
        } else {
          // Vertical: control points extend vertically
          const dir = sourceEdge === 'bottom' ? 1 : -1;
          ctrl1X = sourceX;
          ctrl1Y = sourceY + controlOffset * dir;
          ctrl2X = targetX;
          ctrl2Y = targetY - controlOffset * dir;
        }

        const pathD = `M ${sourceX} ${sourceY} C ${ctrl1X} ${ctrl1Y}, ${ctrl2X} ${ctrl2Y}, ${targetX} ${targetY}`;

        // Calculate arrow rotation based on target edge
        let arrowRotation = 0;
        switch (targetEdge) {
          case 'left': arrowRotation = 0; break;
          case 'right': arrowRotation = 180; break;
          case 'top': arrowRotation = 90; break;
          case 'bottom': arrowRotation = -90; break;
        }

        return (
          <>
            {/* Glow path (behind) */}
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
              className="transition-colors duration-300"
            />

            {/* Arrow head */}
            <polygon
              points="0,0 -10,-5 -10,5"
              fill={color}
              opacity="0.8"
              className="transition-colors duration-300"
              transform={`translate(${targetX}, ${targetY}) rotate(${arrowRotation})`}
            />
          </>
        );
      })()}

      {/* Synergy badge - glass style using foreignObject */}
      <foreignObject x={midX - 22} y={midY - 10} width="44" height="20">
        <div
          onClick={handleSynergyClick}
          className="w-full h-full flex items-center justify-center bg-white/70 backdrop-blur-md border border-white/50 rounded-full shadow-sm cursor-pointer hover:bg-white/85 hover:shadow-glass transition-all duration-300"
          style={{
            backdropFilter: 'blur(12px) saturate(180%)',
            WebkitBackdropFilter: 'blur(12px) saturate(180%)',
          }}
        >
          <span
            className="text-[10px] font-semibold"
            style={{ color }}
          >
            {synergyConfig.coefficient.toFixed(1)}x
          </span>
        </div>
      </foreignObject>

      {/* Synergy selection menu - glass style */}
      {showSynergyMenu && (
        <foreignObject x={midX - 60} y={midY + 14} width="120" height="110">
          <div
            className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-xl shadow-glass-lg overflow-hidden"
            style={{
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            }}
          >
            <div className="px-3 py-1.5 bg-white/30 border-b border-white/30">
              <span className="text-[10px] font-medium text-slate-600">シナジーレベル</span>
            </div>
            {SYNERGY_LEVELS.map((level) => (
              <button
                key={level.level}
                onClick={() => handleSynergySelect(level.level)}
                className={`w-full px-3 py-1.5 text-[10px] text-left flex items-center justify-between transition-all duration-200 ${
                  connection.synergy === level.level
                    ? 'bg-blue-500/20 text-blue-700'
                    : 'text-slate-600 hover:bg-white/50'
                }`}
              >
                <span className="font-medium">{level.label}</span>
                <span className={`font-semibold px-1.5 py-0.5 rounded ${
                  connection.synergy === level.level
                    ? 'bg-blue-500/20'
                    : 'bg-white/50'
                }`}>
                  {level.coefficient.toFixed(1)}x
                </span>
              </button>
            ))}
          </div>
        </foreignObject>
      )}

      {/* Delete button - glass style */}
      <foreignObject x={midX + 26} y={midY - 9} width="18" height="18">
        <div
          onClick={() => onDelete(connection.id)}
          className="w-full h-full flex items-center justify-center bg-white/70 backdrop-blur-md border border-white/50 rounded-full shadow-sm cursor-pointer opacity-0 group-hover:opacity-100 hover:bg-red-500/80 hover:border-red-400/50 transition-all duration-300"
          style={{
            backdropFilter: 'blur(8px) saturate(180%)',
            WebkitBackdropFilter: 'blur(8px) saturate(180%)',
          }}
        >
          <svg className="w-2.5 h-2.5 text-slate-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </foreignObject>
    </g>
  );
};
