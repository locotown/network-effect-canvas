import { useRef, useState } from 'react';
import type { FlowNode, NodeType } from '../types/flow';
import { NODE_CONFIGS, CANVAS_CONFIG } from '../constants/nodes';
import { formatUserCount, formatPercent, getEffectiveUsers } from '../utils/metcalfe';
import { ServiceIcon, UsersIcon, BoltIcon, ArrowRightIcon } from './icons/ServiceIcons';

interface NodeProps {
  node: FlowNode;
  isConnecting: boolean;
  isConnectionSource: boolean;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onUserCountChange: (id: string, userCount: number) => void;
  onActiveRateChange: (id: string, activeRate: number) => void;
  onStartConnection: (id: string) => void;
  onCompleteConnection: (id: string) => void;
  onDelete: (id: string) => void;
}

// Service-specific background colors (pastel glass)
const getServiceBackground = (type: NodeType) => {
  switch (type) {
    case 'locokau':
      return 'bg-red-50/70';
    case 'homestay':
      return 'bg-rose-50/70';
    case 'carshare':
      return 'bg-emerald-50/70';
    case 'skillshare':
      return 'bg-amber-50/70';
    default:
      return 'bg-white/55';
  }
};

// Service-specific header colors (slightly darker)
const getServiceHeaderBg = (type: NodeType) => {
  switch (type) {
    case 'locokau':
      return 'bg-red-100/60';
    case 'homestay':
      return 'bg-rose-100/60';
    case 'carshare':
      return 'bg-emerald-100/60';
    case 'skillshare':
      return 'bg-amber-100/60';
    default:
      return 'bg-white/40';
  }
};

// Service-specific border colors
const getServiceBorder = (type: NodeType) => {
  switch (type) {
    case 'locokau':
      return 'border-red-200/60';
    case 'homestay':
      return 'border-rose-200/60';
    case 'carshare':
      return 'border-emerald-200/60';
    case 'skillshare':
      return 'border-amber-200/60';
    default:
      return 'border-white/40';
  }
};

export const Node: React.FC<NodeProps> = ({
  node,
  isConnecting,
  isConnectionSource,
  onPositionChange,
  onUserCountChange,
  onActiveRateChange,
  onStartConnection,
  onCompleteConnection,
  onDelete,
}) => {
  const config = NODE_CONFIGS[node.type];
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.userCount.toString());
  const dragOffset = useRef({ x: 0, y: 0 });

  const effectiveUsers = getEffectiveUsers(node);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || isEditing) return;
    if ((e.target as HTMLElement).tagName === 'INPUT') return;
    e.preventDefault();

    const rect = nodeRef.current?.getBoundingClientRect();
    if (!rect) return;

    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setIsDragging(true);

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = nodeRef.current?.parentElement;
      if (!canvas) return;

      const canvasRect = canvas.getBoundingClientRect();
      const x = Math.max(0, Math.min(
        e.clientX - canvasRect.left - dragOffset.current.x,
        canvasRect.width - CANVAS_CONFIG.nodeWidth
      ));
      const y = Math.max(0, Math.min(
        e.clientY - canvasRect.top - dragOffset.current.y,
        canvasRect.height - CANVAS_CONFIG.nodeHeight
      ));

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

  const handleUserCountClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditValue(node.userCount.toString());
  };

  const handleUserCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleUserCountBlur = () => {
    const newValue = parseInt(editValue, 10);
    if (!isNaN(newValue) && newValue > 0) {
      onUserCountChange(node.id, newValue);
    } else {
      setEditValue(node.userCount.toString());
    }
    setIsEditing(false);
  };

  const handleUserCountKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUserCountBlur();
    } else if (e.key === 'Escape') {
      setEditValue(node.userCount.toString());
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
        ${getServiceBackground(node.type)} backdrop-blur-xl
        border ${getServiceBorder(node.type)} rounded-2xl
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
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      }}
    >
      {/* Header - with service-specific color */}
      <div
        className={`${getServiceHeaderBg(node.type)} rounded-t-2xl border-b border-white/30`}
        style={{ padding: '12px 16px' }}
      >
        <div className="flex items-center justify-between" style={{ gap: '12px' }}>
          <div className="flex items-center min-w-0 flex-1" style={{ gap: '10px' }}>
            <div
              className="rounded-lg bg-white/60 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-sm flex-shrink-0"
              style={{ width: '32px', height: '32px' }}
            >
              <ServiceIcon type={node.type} style={{ width: '16px', height: '16px' }} className="text-slate-600" />
            </div>
            <span className="text-sm font-semibold text-slate-800 truncate">
              {config.label}
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
        {/* User count row */}
        <div>
          <label className="text-xs text-slate-500 block" style={{ marginBottom: '6px' }}>Users</label>
          {isEditing ? (
            <input
              type="number"
              value={editValue}
              onChange={handleUserCountChange}
              onBlur={handleUserCountBlur}
              onKeyDown={handleUserCountKeyDown}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              autoFocus
              className="w-full text-sm bg-white/60 backdrop-blur-sm border border-blue-400/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 shadow-sm"
              style={{ padding: '6px 12px' }}
            />
          ) : (
            <button
              onClick={handleUserCountClick}
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
              <span className="font-medium">{formatUserCount(node.userCount)}</span>
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
              Active Rate
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

        {/* Effective users display */}
        <div
          className="text-xs text-slate-500 border-t border-white/30 flex items-center justify-between"
          style={{ paddingTop: '12px' }}
        >
          <span>Effective</span>
          <span
            className="font-semibold text-slate-700 bg-white/60 backdrop-blur-sm rounded-md border border-white/40"
            style={{ padding: '4px 10px' }}
          >
            {formatUserCount(effectiveUsers)}
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
