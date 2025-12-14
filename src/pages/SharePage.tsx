import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ShareCanvas } from '../components/ShareCanvas';
import { NetworkIcon } from '../components/icons/ServiceIcons';
import { parseShareState, encodeFlowState } from '../utils/share';
import type { FlowState } from '../types/flow';

// Helper to update or create meta tag
const setMetaTag = (property: string, content: string) => {
  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
};

export const SharePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [flowState, setFlowState] = useState<FlowState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const state = parseShareState(searchParams);
    if (state) {
      setFlowState(state);
    } else {
      setError('共有データが見つかりませんでした');
    }
  }, [searchParams]);

  // Update document title and OGP meta tags based on state
  useEffect(() => {
    if (flowState) {
      const nodeCount = flowState.nodes.length;
      const connectionCount = flowState.connections.length;
      const title = `${nodeCount}ノード・${connectionCount}接続 | ネットワーク効果キャンバス`;
      const description = `ネットワーク効果を視覚化: ${nodeCount}つのノードと${connectionCount}つの接続で構成されたキャンバス`;
      const stateParam = encodeFlowState(flowState);
      const ogImageUrl = `${window.location.origin}/api/og?state=${stateParam}`;

      document.title = title;
      setMetaTag('og:title', title);
      setMetaTag('og:description', description);
      setMetaTag('og:image', ogImageUrl);
      setMetaTag('og:url', window.location.href);
      setMetaTag('og:type', 'website');
      setMetaTag('twitter:card', 'summary_large_image');
      setMetaTag('twitter:title', title);
      setMetaTag('twitter:description', description);
      setMetaTag('twitter:image', ogImageUrl);
    }
  }, [flowState]);

  if (error) {
    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-200">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="glass-heavy rounded-3xl p-10 shadow-glass-lg text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-100/50 backdrop-blur-xl flex items-center justify-center shadow-glass border border-red-200/50">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800 mb-3">
              {error}
            </h1>
            <p className="text-slate-600 text-sm mb-6">
              URLが正しくないか、共有データが破損している可能性があります。
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500/80 backdrop-blur-xl border border-blue-400/50 rounded-xl text-white font-medium hover:bg-blue-600/80 transition-all shadow-glass"
            >
              <NetworkIcon style={{ width: '16px', height: '16px' }} />
              新しいキャンバスを作成
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!flowState) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-200">
        <div className="glass-heavy rounded-2xl p-8 shadow-glass-lg">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-slate-600 text-sm mt-4">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-200">
      {/* Header */}
      <header className="glass-heavy border-b border-white/30 shadow-glass-sm">
        <div className="flex items-center justify-between" style={{ height: '52px', padding: '0 20px' }}>
          <div className="flex items-center" style={{ gap: '10px' }}>
            <div className="rounded-lg bg-white/50 backdrop-blur-sm border border-white/40 flex items-center justify-center shadow-sm flex-shrink-0" style={{ width: '32px', height: '32px' }}>
              <NetworkIcon style={{ width: '16px', height: '16px' }} className="text-slate-600" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-semibold text-slate-800 leading-tight">
                ネットワーク効果キャンバス
              </h1>
              <span className="text-[11px] text-slate-500 leading-tight">
                共有されたキャンバス
              </span>
            </div>
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/80 backdrop-blur-xl border border-blue-400/50 rounded-lg text-white text-sm font-medium hover:bg-blue-600/80 transition-all shadow-glass"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            自分で作成
          </Link>
        </div>
      </header>

      {/* Canvas area */}
      <div className="flex-1 overflow-hidden">
        <ShareCanvas flowState={flowState} />
      </div>

      {/* Footer */}
      <footer className="glass-heavy border-t border-white/30 shadow-glass-sm">
        <div className="flex items-center justify-center" style={{ height: '40px', padding: '0 20px' }}>
          <p className="text-xs text-slate-500">
            このキャンバスは閲覧専用です。
            <Link to="/" className="text-blue-600 hover:text-blue-700 ml-1">
              自分でキャンバスを作成
            </Link>
            して編集できます。
          </p>
        </div>
      </footer>
    </div>
  );
};
