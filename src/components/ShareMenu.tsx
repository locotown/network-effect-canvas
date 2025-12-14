import { useRef, useState } from 'react';
import type { FlowState } from '../types/flow';
import {
  exportCanvasAsImage,
  copyShareUrl,
  downloadAsJSON,
  importFromJSON,
} from '../utils/share';

interface ShareMenuProps {
  isOpen: boolean;
  onClose: () => void;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  flowState: FlowState;
  onImport: (state: FlowState) => void;
}

type ToastType = 'success' | 'error';

export const ShareMenu: React.FC<ShareMenuProps> = ({
  isOpen,
  onClose,
  canvasRef,
  flowState,
  onImport,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleExportImage = async () => {
    setIsProcessing(true);
    onClose(); // Close menu first to allow canvas to be visible

    // Small delay to ensure menu is closed before capturing
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const success = await exportCanvasAsImage(canvasRef.current, flowState);
      if (!success) {
        // Error already shown via alert in exportCanvasAsImage
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('画像の保存に失敗しました');
    }
    setIsProcessing(false);
  };

  const handleCopyUrl = async () => {
    setIsProcessing(true);
    try {
      const success = await copyShareUrl(flowState);
      if (success) {
        showToast('URLをコピーしました', 'success');
      } else {
        showToast('URLのコピーに失敗しました', 'error');
      }
    } catch {
      showToast('URLのコピーに失敗しました', 'error');
    }
    setIsProcessing(false);
    onClose();
  };

  const handleDownloadJSON = () => {
    try {
      const success = downloadAsJSON(flowState);
      if (success) {
        showToast('JSONを保存しました', 'success');
      } else {
        showToast('JSONの保存に失敗しました', 'error');
      }
    } catch {
      showToast('JSONの保存に失敗しました', 'error');
    }
    onClose();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const state = await importFromJSON(file);
      if (state) {
        onImport(state);
        showToast('JSONを読み込みました', 'success');
      } else {
        showToast('無効なファイル形式です', 'error');
      }
    } catch {
      showToast('ファイルの読み込みに失敗しました', 'error');
    }
    setIsProcessing(false);
    onClose();

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Menu */}
      <div
        className="absolute right-0 top-full mt-2 z-50 glass-heavy rounded-xl shadow-glass-lg border border-white/40 overflow-hidden"
        style={{ minWidth: '180px' }}
      >
        <div className="flex flex-col">
          {/* Export Image */}
          <button
            onClick={handleExportImage}
            disabled={isProcessing}
            className="flex items-center text-left text-sm text-slate-700 hover:bg-white/40 transition-colors disabled:opacity-50"
            style={{ padding: '12px 16px', gap: '10px' }}
          >
            <span className="text-base">📷</span>
            <span>画像を保存</span>
          </button>

          {/* Copy URL */}
          <button
            onClick={handleCopyUrl}
            disabled={isProcessing}
            className="flex items-center text-left text-sm text-slate-700 hover:bg-white/40 transition-colors disabled:opacity-50"
            style={{ padding: '12px 16px', gap: '10px' }}
          >
            <span className="text-base">🔗</span>
            <span>URLをコピー</span>
          </button>

          {/* Divider */}
          <div className="border-t border-white/30" />

          {/* Download JSON */}
          <button
            onClick={handleDownloadJSON}
            disabled={isProcessing}
            className="flex items-center text-left text-sm text-slate-700 hover:bg-white/40 transition-colors disabled:opacity-50"
            style={{ padding: '12px 16px', gap: '10px' }}
          >
            <span className="text-base">📁</span>
            <span>JSONを保存</span>
          </button>

          {/* Import JSON */}
          <button
            onClick={handleImportClick}
            disabled={isProcessing}
            className="flex items-center text-left text-sm text-slate-700 hover:bg-white/40 transition-colors disabled:opacity-50"
            style={{ padding: '12px 16px', gap: '10px' }}
          >
            <span className="text-base">📂</span>
            <span>JSONを読込</span>
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 rounded-xl shadow-glass-lg border backdrop-blur-xl transition-all duration-300 ${
            toast.type === 'success'
              ? 'bg-emerald-500/90 border-emerald-400/50 text-white'
              : 'bg-red-500/90 border-red-400/50 text-white'
          }`}
          style={{ padding: '10px 20px' }}
        >
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}
    </>
  );
};
