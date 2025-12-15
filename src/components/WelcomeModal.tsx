import { useState } from 'react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenHelp: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  onOpenHelp,
}) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('network-effect-canvas-welcome-dismissed', 'true');
    }
    onClose();
  };

  const handleOpenHelp = () => {
    if (dontShowAgain) {
      localStorage.setItem('network-effect-canvas-welcome-dismissed', 'true');
    }
    onOpenHelp();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <span className="text-4xl">👋</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            ネットワーク効果キャンバスへようこそ！
          </h2>
          <p className="text-blue-100 text-sm">
            メトカーフの法則でネットワーク効果を可視化
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="bg-slate-50 rounded-xl p-4 mb-4">
            <p className="text-sm text-slate-600 leading-relaxed">
              このツールでは、ノードを作成して接続することで、
              <strong className="text-blue-600">ネットワーク効果</strong>
              がどのように価値を高めるかを視覚的に確認できます。
            </p>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-amber-500 mt-0.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <p className="text-xs text-amber-700 leading-relaxed">
                <strong>教育・概念理解を目的としたツール</strong>です。
                計算モデルは簡略化されており、実際のビジネス意思決定の定量的根拠としては使用しないでください。
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={handleOpenHelp}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors shadow-sm"
            >
              <span>📖</span>
              <span>使い方を見る</span>
            </button>
            <button
              onClick={handleClose}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white text-slate-700 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <span>▶️</span>
              <span>今すぐ始める</span>
            </button>
          </div>

          {/* Don't show again checkbox */}
          <label className="flex items-center justify-center gap-2 text-sm text-slate-500 cursor-pointer">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-400"
            />
            <span>次回から表示しない</span>
          </label>
        </div>
      </div>
    </div>
  );
};
