import { NODE_TYPES } from '../constants/nodes';
import type { NodeType } from '../types/flow';
import { formatUserCount } from '../utils/metcalfe';
import { ServiceIcon } from './icons/ServiceIcons';

interface SidebarProps {
  onClear: () => void;
}

// Service-specific background colors
const getServiceBackground = (type: NodeType) => {
  switch (type) {
    case 'locokau':
      return 'bg-red-50/80 hover:bg-red-100/70';
    case 'homestay':
      return 'bg-rose-50/80 hover:bg-rose-100/70';
    case 'carshare':
      return 'bg-emerald-50/80 hover:bg-emerald-100/70';
    case 'skillshare':
      return 'bg-amber-50/80 hover:bg-amber-100/70';
    default:
      return 'bg-white/50 hover:bg-white/70';
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

export const Sidebar: React.FC<SidebarProps> = ({ onClear }) => {
  const handleDragStart = (e: React.DragEvent, type: NodeType) => {
    e.dataTransfer.setData('nodeType', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <aside className="w-[240px] glass-heavy border-r border-white/30 shadow-glass-sm flex flex-col relative" style={{ padding: '14px' }}>
      <div className="flex items-center gap-2 pb-2 border-b border-white/30" style={{ marginBottom: '10px' }}>
        <h2 className="text-xs font-semibold text-slate-700">
          Services
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {NODE_TYPES.map((config) => (
          <div
            key={config.type}
            draggable
            onDragStart={(e) => handleDragStart(e, config.type)}
            className={`
              flex items-center
              ${getServiceBackground(config.type)} backdrop-blur-lg
              border ${getServiceBorder(config.type)}
              rounded-xl cursor-grab active:cursor-grabbing
              transition-all duration-300 ease-glass
              hover:shadow-glass hover:-translate-y-0.5
              group
            `}
            style={{ padding: '6px 10px', gap: '8px' }}
          >
            {/* Service icon */}
            <div
              className="rounded-md bg-white/70 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-sm flex-shrink-0"
              style={{ width: '24px', height: '24px' }}
            >
              <ServiceIcon type={config.type} className="w-3 h-3 text-slate-600" />
            </div>

            {/* Service name */}
            <span className="text-xs font-medium text-slate-700 truncate flex-1">
              {config.label}
            </span>

            {/* User count */}
            <span className="text-[11px] text-slate-500 flex-shrink-0">
              {formatUserCount(config.defaultUsers)}
            </span>

            {/* Drag indicator */}
            <div className="text-slate-300 group-hover:text-slate-400 transition-colors flex-shrink-0">
              <svg style={{ width: '10px', height: '10px' }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"/>
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Tips card - glass style */}
      <div className="glass-light rounded-xl" style={{ marginTop: '16px', padding: '14px' }}>
        <p className="text-xs font-medium text-slate-600" style={{ marginBottom: '8px' }}>Quick Start</p>
        <div className="text-xs text-slate-500" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <p className="flex items-center" style={{ gap: '8px' }}>
            <span
              className="bg-white/70 backdrop-blur-sm rounded-md text-center text-slate-600 flex-shrink-0 border border-white/50"
              style={{ width: '18px', height: '18px', fontSize: '10px', lineHeight: '18px' }}
            >1</span>
            <span>Drag a service to canvas</span>
          </p>
          <p className="flex items-center" style={{ gap: '8px' }}>
            <span
              className="bg-white/70 backdrop-blur-sm rounded-md text-center text-slate-600 flex-shrink-0 border border-white/50"
              style={{ width: '18px', height: '18px', fontSize: '10px', lineHeight: '18px' }}
            >2</span>
            <span>Click arrow to connect</span>
          </p>
          <p className="flex items-center" style={{ gap: '8px' }}>
            <span
              className="bg-white/70 backdrop-blur-sm rounded-md text-center text-slate-600 flex-shrink-0 border border-white/50"
              style={{ width: '18px', height: '18px', fontSize: '10px', lineHeight: '18px' }}
            >3</span>
            <span>See network value grow</span>
          </p>
        </div>
      </div>

      {/* Clear button - glass style */}
      <div className="border-t border-white/30" style={{ paddingTop: '14px', marginTop: '14px' }}>
        <button
          onClick={onClear}
          className="w-full text-sm font-medium text-slate-500 bg-white/40 backdrop-blur-sm border border-white/40 rounded-xl hover:text-red-500 hover:bg-red-50/50 hover:border-red-200/50 transition-all duration-300 shadow-sm"
          style={{ padding: '10px 16px' }}
        >
          Clear All
        </button>
      </div>
    </aside>
  );
};
