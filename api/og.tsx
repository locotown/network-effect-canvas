import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

interface FlowState {
  nodes: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
    value: number;
    activeRate: number;
  }>;
  connections: Array<{
    id: string;
    sourceId: string;
    targetId: string;
    synergy: string;
  }>;
}

// Decode Base64 state
const decodeFlowState = (encoded: string): FlowState | null => {
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    const state = JSON.parse(json) as FlowState;

    if (!Array.isArray(state.nodes) || !Array.isArray(state.connections)) {
      return null;
    }

    return state;
  } catch {
    return null;
  }
};

// Calculate network multiplier (simplified)
const calculateMultiplier = (nodes: FlowState['nodes'], connections: FlowState['connections']): number => {
  if (nodes.length === 0 || connections.length === 0) return 1;

  const n = nodes.length;
  const potentialConnections = (n * (n - 1)) / 2;
  const actualConnections = connections.length;
  const connectivity = potentialConnections > 0 ? actualConnections / potentialConnections : 0;

  return 1 + connectivity * (n - 1);
};

export default async function handler(request: Request) {
  const { searchParams } = new URL(request.url);
  const stateParam = searchParams.get('state');

  // Default OGP for no state
  if (!stateParam) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #e0e7ff 0%, #fce7f3 35%, #dbeafe 65%, #f3e8ff 100%)',
            fontFamily: 'sans-serif',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 120,
              height: 120,
              borderRadius: 24,
              background: 'rgba(255, 255, 255, 0.7)',
              marginBottom: 32,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <span style={{ fontSize: 64 }}>🌐</span>
          </div>
          <h1
            style={{
              fontSize: 48,
              fontWeight: 'bold',
              color: '#1e293b',
              margin: 0,
              marginBottom: 16,
            }}
          >
            ネットワーク効果キャンバス
          </h1>
          <p
            style={{
              fontSize: 24,
              color: '#64748b',
              margin: 0,
            }}
          >
            戦略的ネットワーク可視化ツール
          </p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }

  // Parse state
  const state = decodeFlowState(stateParam);

  if (!state) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
            fontFamily: 'sans-serif',
          }}
        >
          <p style={{ fontSize: 32, color: '#991b1b' }}>無効な共有データ</p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }

  const { nodes, connections } = state;
  const multiplier = calculateMultiplier(nodes, connections);
  const topNodes = nodes.slice(0, 5);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #e0e7ff 0%, #fce7f3 35%, #dbeafe 65%, #f3e8ff 100%)',
          fontFamily: 'sans-serif',
          padding: 48,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 32,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 64,
                height: 64,
                borderRadius: 16,
                background: 'rgba(255, 255, 255, 0.7)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              }}
            >
              <span style={{ fontSize: 32 }}>🌐</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1 style={{ fontSize: 32, fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
                ネットワーク効果キャンバス
              </h1>
              <p style={{ fontSize: 18, color: '#64748b', margin: 0 }}>
                共有されたキャンバス
              </p>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 16 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                background: 'rgba(255, 255, 255, 0.7)',
                borderRadius: 24,
                fontSize: 18,
                color: '#334155',
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: 4, background: '#3b82f6' }} />
              {nodes.length} ノード
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                background: 'rgba(255, 255, 255, 0.7)',
                borderRadius: 24,
                fontSize: 18,
                color: '#334155',
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: 4, background: '#10b981' }} />
              {connections.length} 接続
            </div>
          </div>
        </div>

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 48,
          }}
        >
          {/* Node icons */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              maxWidth: 600,
              justifyContent: 'center',
            }}
          >
            {topNodes.map((node, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: 16,
                  background: `${node.color}20`,
                  borderRadius: 16,
                  border: `2px solid ${node.color}40`,
                  minWidth: 100,
                }}
              >
                <span style={{ fontSize: 40, marginBottom: 8 }}>{node.icon}</span>
                <span style={{ fontSize: 14, color: '#334155', fontWeight: 600 }}>
                  {node.name.length > 8 ? node.name.slice(0, 8) + '...' : node.name}
                </span>
              </div>
            ))}
            {nodes.length > 5 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 16,
                  background: 'rgba(255, 255, 255, 0.5)',
                  borderRadius: 16,
                  minWidth: 100,
                  height: 100,
                }}
              >
                <span style={{ fontSize: 24, color: '#64748b' }}>+{nodes.length - 5}</span>
              </div>
            )}
          </div>

          {/* Multiplier badge */}
          {connections.length > 0 && multiplier > 1 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '24px 48px',
                background: 'rgba(16, 185, 129, 0.85)',
                borderRadius: 24,
                boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
              }}
            >
              <span style={{ fontSize: 64, fontWeight: 'bold', color: 'white' }}>
                {multiplier.toFixed(1)}x
              </span>
              <span style={{ fontSize: 20, color: 'rgba(255, 255, 255, 0.9)' }}>
                ネットワーク効果
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 24,
          }}
        >
          <p style={{ fontSize: 16, color: '#94a3b8' }}>
            network-effect-canvas.ideandtity.com
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
