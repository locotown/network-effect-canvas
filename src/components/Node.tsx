import { useRef, useState } from 'react';
import type { FlowNode } from '../types/flow';
import { CANVAS_CONFIG } from '../constants/nodes';
import { formatNumber, formatPercent, getEffectiveValue } from '../utils/metcalfe';
import { UsersIcon, BoltIcon, ArrowRightIcon } from './icons/ServiceIcons';

interface NodeProps {
  node: FlowNode;
  isConnecting: boolean;
  isConnectionSource: boolean;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onValueChange: (id: string, value: number) => void;
  onActiveRateChange: (id: string, activeRate: number) => void;
  onStartConnection: (id: string) => void;
  onCompleteConnection: (id: string) => void;
  onDelete: (id: string) => void;
  zoom?: number;
}

// Generate lighter background color from node color
const getLighterColor = (hexColor: string, opacity: number = 0.15): string => {
  return `${hexColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
};

export const Node: React.FC<NodeProps> = ({
  node,
  isConnecting,
  isConnectionSource,
  onPositionChange,
  onValueChange,
  onActiveRateChange,
  onStartConnection,
  onCompleteConnection,
  onDelete,
  zoom = 1,
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.value.toString());
  const dragOffset = useRef({ x: 0, y: 0 });

  const effectiveValue = getEffectiveValue(node);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || isEditing) return;
    if ((e.target as HTMLElement).tagName === 'INPUT') return;
    e.preventDefault();

    const rect = nodeRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Store offset in canvas coordinates (divide by zoom)
    dragOffset.current = {
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top) / zoom,
    };
    setIsDragging(true);

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = nodeRef.current?.parentElement;
      if (!canvas) return;

      const canvasRect = canvas.getBoundingClientRect();
      // Convert screen coordinates to canvas coordinates and subtract offset
      const x = Math.max(0, (e.clientX - canvasRect.left) / zoom - dragOffset.current.x);
      const y = Math.max(0, (e.clientY - canvasRect.top) / zoom - dragOffset.current.y);

      onPositionChange(node.id, { x, y });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isConnecting && !isConnectionSource) {
      onCompleteConnection(node.id);
    }
  };

  const handleConnectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStartConnection(node.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(node.id);
  };

  const handleValueClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditValue(node.value.toString());
  };

  const handleValueInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleValueBlur = () => {
    const newValue = parseInt(editValue, 10);
    if (!isNaN(newValue) && newValue > 0) {
      onValueChange(node.id, newValue);
    } else {
      setEditValue(node.value.toString());
    }
    setIsEditing(false);
  };

  const handleValueKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleValueBlur();
    } else if (e.key === 'Escape') {
      setEditValue(node.value.toString());
      setIsEditing(false);
    }
  };

  const handleActiveRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const newRate = parseInt(e.target.value, 10) / 100;
    onActiveRateChange(node.id, newRate);
  };

  return (
    <div
      ref={nodeRef}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      className={`
        absolute
        backdrop-blur-xl
        border rounded-2xl
        shadow-glass
        cursor-grab active:cursor-grabbing select-none
        transition-all duration-300 ease-glass
        group
        ${isDragging ? 'shadow-glass-lg scale-[1.02] z-50' : ''}
        ${!isDragging ? 'hover:shadow-glass-hover hover:-translate-y-0.5' : ''}
        ${isConnecting && !isConnectionSource ? 'ring-2 ring-blue-400/60 ring-offset-2 ring-offset-white/20' : ''}
        ${isConnectionSource ? 'ring-2 ring-blue-500/70 ring-offset-2 ring-offset-white/20' : ''}
      `}
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
        <div className="flex items-center justify-between" style={{ gap: '12px' }}>
          <div className="flex items-center min-w-0 flex-1" style={{ gap: '10px' }}>
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
          <button
            onClick={handleConnectClick}
            className="flex items-center justify-center rounded-lg bg-white/60 backdrop-blur-sm border border-white/40 text-slate-400 shadow-sm hover:bg-blue-500/80 hover:border-blue-400/50 hover:text-white transition-all duration-300 flex-shrink-0"
            style={{ width: '28px', height: '28px' }}
            title="Connect"
          >
            <ArrowRightIcon style={{ width: '14px', height: '14px' }} />
          </button>
        </div>
      </div>

      {/* Content area */}
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Value row */}
        <div>
          <label className="text-xs text-slate-500 block" style={{ marginBottom: '6px' }}>
            {node.valueLabel}
          </label>
          {isEditing ? (
            <input
              type="number"
              value={editValue}
              onChange={handleValueInputChange}
              onBlur={handleValueBlur}
              onKeyDown={handleValueKeyDown}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              autoFocus
              className="w-full text-sm bg-white/60 backdrop-blur-sm border border-blue-400/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 shadow-sm"
              style={{ padding: '6px 12px' }}
            />
          ) : (
            <button
              onClick={handleValueClick}
              className="flex items-center text-sm text-slate-700 hover:text-blue-600 transition-colors group/edit"
              style={{ gap: '8px' }}
              title="Click to edit"
            >
              <div
                className="rounded-md bg-white/60 backdrop-blur-sm border border-white/40 flex items-center justify-center group-hover/edit:bg-blue-50/50 transition-colors flex-shrink-0"
                style={{ width: '24px', height: '24px' }}
              >
                <UsersIcon style={{ width: '12px', height: '12px' }} className="text-slate-400" />
              </div>
              <span className="font-medium">{formatNumber(node.value)}</span>
            </button>
          )}
        </div>

        {/* Active rate slider */}
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
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={Math.round(node.activeRate * 100)}
            onChange={handleActiveRateChange}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full"
            title={`Active rate: ${formatPercent(node.activeRate)}`}
          />
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

      {/* Delete button - glass style */}
      <button
        onClick={handleDeleteClick}
        className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-white/50 text-slate-400 text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm hover:bg-red-500/80 hover:border-red-400/50 hover:text-white"
        title="Delete"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};
