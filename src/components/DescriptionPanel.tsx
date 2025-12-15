import { useState, useRef, useEffect } from 'react';
import { useDraggable } from '../hooks/useDraggable';

interface DescriptionPanelProps {
  description: string;
  onDescriptionChange: (description: string) => void;
  isReadOnly?: boolean;
}

export const DescriptionPanel: React.FC<DescriptionPanelProps> = ({
  description,
  onDescriptionChange,
  isReadOnly = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(description.length > 0);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(description);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { position, isDragging, panelRef, handleMouseDown } = useDraggable({
    storageKey: 'network-effect-canvas-memo-position',
    defaultPosition: { x: 16, y: 16 },
    enabled: !isReadOnly,
  });

  useEffect(() => {
    setEditValue(description);
    // Auto-expand if description has content
    if (description.length > 0) {
      setIsExpanded(true);
    }
  }, [description]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing]);

  const handleSave = () => {
    onDescriptionChange(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(description);
    setIsEditing(false);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  if (!isExpanded && !isReadOnly) {
    return (
      <div
        className="absolute"
        style={{ left: position.x, top: position.y, zIndex: 10 }}
      >
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 px-3 py-2 glass-heavy rounded-xl shadow-glass border border-white/40 text-sm text-slate-600 hover:bg-white/60 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          メモを追加
        </button>
      </div>
    );
  }

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
        className={`bg-gradient-to-r from-amber-500/80 to-orange-500/80 backdrop-blur-xl px-4 py-2.5 flex items-center justify-between ${!isReadOnly ? 'cursor-grab' : ''} ${isDragging ? 'cursor-grabbing' : ''}`}
        onMouseDown={!isReadOnly ? handleMouseDown : undefined}
      >
        <div className="flex items-center gap-2">
          {!isReadOnly && (
            <svg className="w-3 h-3 text-white/60" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM14 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM14 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
            </svg>
          )}
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <h3 className="text-sm font-bold text-white select-none">解説メモ</h3>
        </div>
        {!isReadOnly && (
          <div className="flex items-center gap-1">
            {/* Delete button */}
            {description && (
              <button
                onClick={() => {
                  onDescriptionChange('');
                  setIsExpanded(false);
                }}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-white/20 hover:bg-red-500/50 transition-colors"
                title="メモを削除"
              >
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
            {/* Collapse button */}
            <button
              onClick={() => setIsExpanded(false)}
              className="w-6 h-6 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              title="折りたたむ"
            >
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              ref={textareaRef}
              value={editValue}
              onChange={handleTextareaChange}
              placeholder="このキャンバスの解説やメモを入力..."
              className="w-full text-sm text-slate-700 bg-white/60 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none min-h-[100px]"
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  handleCancel();
                }
              }}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white/60 border border-slate-200 rounded-lg hover:bg-white/80 transition-all"
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1.5 text-xs font-medium text-white bg-amber-500/80 border border-amber-400/50 rounded-lg hover:bg-amber-600/80 transition-all"
              >
                保存
              </button>
            </div>
          </div>
        ) : (
          <div>
            {description ? (
              <div
                className={`text-sm text-slate-600 leading-relaxed whitespace-pre-wrap ${!isReadOnly ? 'cursor-pointer hover:bg-white/30 rounded-lg p-2 -m-2 transition-colors' : ''}`}
                onClick={() => !isReadOnly && setIsEditing(true)}
              >
                {description}
                {!isReadOnly && (
                  <span className="ml-2 text-xs text-slate-400">(クリックして編集)</span>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full text-sm text-slate-400 text-left py-2 hover:text-slate-600 transition-colors"
              >
                クリックしてメモを追加...
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
