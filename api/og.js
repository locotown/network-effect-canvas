import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

// Convert URL-safe Base64 back to standard Base64
function fromUrlSafeBase64(urlSafe) {
  let base64 = urlSafe.replace(/-/g, '+').replace(/_/g, '/');
  // Add padding if needed
  const padding = base64.length % 4;
  if (padding) {
    base64 += '='.repeat(4 - padding);
  }
  return base64;
}

// Decode Base64 state
function decodeFlowState(encoded) {
  try {
    // Convert from URL-safe Base64 to standard Base64
    const base64 = fromUrlSafeBase64(encoded);
    const json = decodeURIComponent(escape(atob(base64)));
    const state = JSON.parse(json);

    if (!Array.isArray(state.nodes) || !Array.isArray(state.connections)) {
      return null;
    }

    return state;
  } catch {
    return null;
  }
}

// Calculate network multiplier (simplified)
function calculateMultiplier(nodes, connections) {
  if (nodes.length === 0 || connections.length === 0) return 1;

  const n = nodes.length;
  const potentialConnections = (n * (n - 1)) / 2;
  const actualConnections = connections.length;
  const connectivity = potentialConnections > 0 ? actualConnections / potentialConnections : 0;

  return 1 + connectivity * (n - 1);
}

export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  const stateParam = searchParams.get('state');

  // Default OGP for no state
  if (!stateParam) {
    return new ImageResponse(
      {
        type: 'div',
        props: {
          style: {
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #e0e7ff 0%, #fce7f3 35%, #dbeafe 65%, #f3e8ff 100%)',
            fontFamily: 'sans-serif',
          },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 120,
                  height: 120,
                  borderRadius: 24,
                  background: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: 32,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                },
                children: {
                  type: 'span',
                  props: {
                    style: { fontSize: 64 },
                    children: '🌐',
                  },
                },
              },
            },
            {
              type: 'h1',
              props: {
                style: {
                  fontSize: 48,
                  fontWeight: 'bold',
                  color: '#1e293b',
                  margin: 0,
                  marginBottom: 16,
                },
                children: 'ネットワーク効果キャンバス',
              },
            },
            {
              type: 'p',
              props: {
                style: {
                  fontSize: 24,
                  color: '#64748b',
                  margin: 0,
                },
                children: '戦略的ネットワーク可視化ツール',
              },
            },
          ],
        },
      },
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
      {
        type: 'div',
        props: {
          style: {
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
            fontFamily: 'sans-serif',
          },
          children: {
            type: 'p',
            props: {
              style: { fontSize: 32, color: '#991b1b' },
              children: '無効な共有データ',
            },
          },
        },
      },
      {
        width: 1200,
        height: 630,
      }
    );
  }

  const { name, nodes, connections } = state;
  const canvasName = name || 'マイキャンバス';
  const multiplier = calculateMultiplier(nodes, connections);
  const topNodes = nodes.slice(0, 5);

  const nodeElements = topNodes.map((node, i) => ({
    type: 'div',
    key: i,
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 16,
        background: `${node.color}20`,
        borderRadius: 16,
        border: `2px solid ${node.color}40`,
        minWidth: 100,
      },
      children: [
        {
          type: 'span',
          props: {
            style: { fontSize: 40, marginBottom: 8 },
            children: node.icon,
          },
        },
        {
          type: 'span',
          props: {
            style: { fontSize: 14, color: '#334155', fontWeight: 600 },
            children: node.name.length > 8 ? node.name.slice(0, 8) + '...' : node.name,
          },
        },
      ],
    },
  }));

  if (nodes.length > 5) {
    nodeElements.push({
      type: 'div',
      key: 'more',
      props: {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          background: 'rgba(255, 255, 255, 0.5)',
          borderRadius: 16,
          minWidth: 100,
          height: 100,
        },
        children: {
          type: 'span',
          props: {
            style: { fontSize: 24, color: '#64748b' },
            children: `+${nodes.length - 5}`,
          },
        },
      },
    });
  }

  const contentChildren = [
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          maxWidth: 600,
          justifyContent: 'center',
        },
        children: nodeElements,
      },
    },
  ];

  if (connections.length > 0 && multiplier > 1) {
    contentChildren.push({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '24px 48px',
          background: 'rgba(16, 185, 129, 0.85)',
          borderRadius: 24,
          boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
        },
        children: [
          {
            type: 'span',
            props: {
              style: { fontSize: 64, fontWeight: 'bold', color: 'white' },
              children: `${multiplier.toFixed(1)}x`,
            },
          },
          {
            type: 'span',
            props: {
              style: { fontSize: 20, color: 'rgba(255, 255, 255, 0.9)' },
              children: 'ネットワーク効果',
            },
          },
        ],
      },
    });
  }

  return new ImageResponse(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #e0e7ff 0%, #fce7f3 35%, #dbeafe 65%, #f3e8ff 100%)',
          fontFamily: 'sans-serif',
          padding: 48,
        },
        children: [
          // Header
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 32,
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', alignItems: 'center', gap: 16 },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 64,
                            height: 64,
                            borderRadius: 16,
                            background: 'rgba(255, 255, 255, 0.7)',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: { fontSize: 32 },
                              children: '🌐',
                            },
                          },
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: { display: 'flex', flexDirection: 'column' },
                          children: [
                            {
                              type: 'h1',
                              props: {
                                style: { fontSize: 32, fontWeight: 'bold', color: '#1e293b', margin: 0 },
                                children: canvasName,
                              },
                            },
                            {
                              type: 'p',
                              props: {
                                style: { fontSize: 18, color: '#64748b', margin: 0 },
                                children: 'ネットワーク効果キャンバス',
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', gap: 16 },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '8px 16px',
                            background: 'rgba(255, 255, 255, 0.7)',
                            borderRadius: 24,
                            fontSize: 18,
                            color: '#334155',
                          },
                          children: [
                            {
                              type: 'span',
                              props: {
                                style: { width: 8, height: 8, borderRadius: 4, background: '#3b82f6' },
                              },
                            },
                            `${nodes.length} ノード`,
                          ],
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '8px 16px',
                            background: 'rgba(255, 255, 255, 0.7)',
                            borderRadius: 24,
                            fontSize: 18,
                            color: '#334155',
                          },
                          children: [
                            {
                              type: 'span',
                              props: {
                                style: { width: 8, height: 8, borderRadius: 4, background: '#10b981' },
                              },
                            },
                            `${connections.length} 接続`,
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          // Main content
          {
            type: 'div',
            props: {
              style: {
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 48,
              },
              children: contentChildren,
            },
          },
          // Footer
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'center',
                marginTop: 24,
              },
              children: {
                type: 'p',
                props: {
                  style: { fontSize: 16, color: '#94a3b8' },
                  children: 'network-effect-canvas.ideandtity.com',
                },
              },
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
    }
  );
}
