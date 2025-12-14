import type { PresetExplanation } from '../constants/presets';

interface ExplanationPanelProps {
  explanation: PresetExplanation;
  onClose: () => void;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  explanation,
  onClose,
}) => {
  return (
    <div className="absolute right-4 top-4 w-72 glass-heavy rounded-2xl shadow-glass-lg border border-white/40 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500/80 to-purple-500/80 backdrop-blur-xl px-4 py-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-white">{explanation.title}</h3>
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
