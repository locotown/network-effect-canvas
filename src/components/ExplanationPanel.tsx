import type { PresetExplanation } from '../constants/presets';
import { useDraggable } from '../hooks/useDraggable';

interface ExplanationPanelProps {
  explanation: PresetExplanation;
  onClose: () => void;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  explanation,
  onClose,
}) => {
  const { position, isDragging, panelRef, handleMouseDown } = useDraggable({
    storageKey: 'network-effect-canvas-explanation-position',
    defaultPosition: { x: window.innerWidth - 304, y: 16 }, // right-4 = 16px from right
  });

  return (
    <div
      ref={panelRef}
      className={`absolute w-72 glass-heavy rounded-2xl shadow-glass-lg border border-white/40 overflow-hidden ${isDragging ? 'cursor-grabbing' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        zIndex: isDragging ? 100 : 10,
      }}
    >
      {/* Header - Draggable */}
      <div
        className={`bg-gradient-to-r from-blue-500/80 to-purple-500/80 backdrop-blur-xl px-4 py-3 flex items-center justify-between cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <svg className="w-3 h-3 text-white/60" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM14 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM14 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
          </svg>
          <h3 className="text-sm font-bold text-white select-none">{explanation.title}</h3>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Summary */}
        <p className="text-xs text-slate-600 leading-relaxed">
          {explanation.summary}
        </p>

        {/* Points */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-700">ポイント</p>
          <ul className="space-y-1.5">
            {explanation.points.map((point, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-slate-600">
                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold mt-0.5">
                  {index + 1}
                </span>
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Network Effect Type */}
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-3 border border-emerald-200/50">
          <p className="text-[10px] font-semibold text-emerald-700 mb-1">ネットワーク効果のタイプ</p>
          <p className="text-xs text-emerald-600 leading-relaxed">
            {explanation.networkEffect}
          </p>
        </div>
      </div>
    </div>
  );
};
