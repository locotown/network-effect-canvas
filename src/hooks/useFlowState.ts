import { useState, useCallback } from 'react';
import type { FlowState, NodeType, Position, SynergyLevel } from '../types/flow';
import { NODE_CONFIGS } from '../constants/nodes';

const STORAGE_KEY = 'network-value-canvas';

// Generate unique ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Initial state
const initialState: FlowState = {
  nodes: [],
  connections: [],
};

// Load from localStorage
const loadState = (): FlowState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialState;
    const parsed = JSON.parse(saved);
    // Migrate old data: add activeRate if missing
    const nodes = parsed.nodes.map((node: any) => ({
      ...node,
      activeRate: node.activeRate ?? NODE_CONFIGS[node.type as NodeType]?.defaultActiveRate ?? 0.5,
    }));
    // Migrate old data: add synergy if missing
    const connections = parsed.connections.map((conn: any) => ({
      ...conn,
      synergy: conn.synergy ?? 'standard',
    }));
    return { nodes, connections };
  } catch {
    return initialState;
  }
};

// Save to localStorage
const saveState = (state: FlowState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
};

export const useFlowState = () => {
  const [state, setState] = useState<FlowState>(loadState);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);

  // Add new node with default user count and active rate
  const addNode = useCallback((type: NodeType, position: Position) => {
    const config = NODE_CONFIGS[type];
    setState((prev) => {
      const newState = {
        ...prev,
        nodes: [
          ...prev.nodes,
          {
            id: generateId(),
            type,
            position,
            userCount: config.defaultUsers,
            activeRate: config.defaultActiveRate,
          },
        ],
      };
      saveState(newState);
      return newState;
    });
  }, []);

  // Update node position
  const updateNodePosition = useCallback((id: string, position: Position) => {
    setState((prev) => {
      const newState = {
        ...prev,
        nodes: prev.nodes.map((node) =>
          node.id === id ? { ...node, position } : node
        ),
      };
      saveState(newState);
      return newState;
    });
  }, []);

  // Update node user count
  const updateNodeUserCount = useCallback((id: string, userCount: number) => {
    setState((prev) => {
      const newState = {
        ...prev,
        nodes: prev.nodes.map((node) =>
          node.id === id ? { ...node, userCount } : node
        ),
      };
      saveState(newState);
      return newState;
    });
  }, []);

  // Update node active rate
  const updateNodeActiveRate = useCallback((id: string, activeRate: number) => {
    setState((prev) => {
      const newState = {
        ...prev,
        nodes: prev.nodes.map((node) =>
          node.id === id ? { ...node, activeRate } : node
        ),
      };
      saveState(newState);
      return newState;
    });
  }, []);

  // Start connecting from a node
  const startConnection = useCallback((nodeId: string) => {
    setConnectingFrom(nodeId);
  }, []);

  // Complete connection to a node (with default synergy)
  const completeConnection = useCallback((targetId: string) => {
    if (!connectingFrom || connectingFrom === targetId) {
      setConnectingFrom(null);
      return;
    }

    // Check if connection already exists
    setState((prev) => {
      const exists = prev.connections.some(
        (c) =>
          (c.sourceId === connectingFrom && c.targetId === targetId) ||
          (c.sourceId === targetId && c.targetId === connectingFrom)
      );

      if (exists) {
        return prev;
      }

      const newState = {
        ...prev,
        connections: [
          ...prev.connections,
          {
            id: generateId(),
            sourceId: connectingFrom,
            targetId,
            synergy: 'standard' as SynergyLevel,
          },
        ],
      };
      saveState(newState);
      return newState;
    });

    setConnectingFrom(null);
  }, [connectingFrom]);

  // Update connection synergy
  const updateConnectionSynergy = useCallback((id: string, synergy: SynergyLevel) => {
    setState((prev) => {
      const newState = {
        ...prev,
        connections: prev.connections.map((conn) =>
          conn.id === id ? { ...conn, synergy } : conn
        ),
      };
      saveState(newState);
      return newState;
    });
  }, []);

  // Cancel connection
  const cancelConnection = useCallback(() => {
    setConnectingFrom(null);
  }, []);

  // Delete node and its connections
  const deleteNode = useCallback((nodeId: string) => {
    setState((prev) => {
      const newState = {
        nodes: prev.nodes.filter((n) => n.id !== nodeId),
        connections: prev.connections.filter(
          (c) => c.sourceId !== nodeId && c.targetId !== nodeId
        ),
      };
      saveState(newState);
      return newState;
    });
  }, []);

  // Delete connection
  const deleteConnection = useCallback((connectionId: string) => {
    setState((prev) => {
      const newState = {
        ...prev,
        connections: prev.connections.filter((c) => c.id !== connectionId),
      };
      saveState(newState);
      return newState;
    });
  }, []);

  // Clear all
  const clearAll = useCallback(() => {
    setState(initialState);
    saveState(initialState);
    setConnectingFrom(null);
  }, []);

  // Reload from storage
  const reload = useCallback(() => {
    setState(loadState());
  }, []);

  return {
    nodes: state.nodes,
    connections: state.connections,
    connectingFrom,
    addNode,
    updateNodePosition,
    updateNodeUserCount,
    updateNodeActiveRate,
    startConnection,
    completeConnection,
    cancelConnection,
    deleteNode,
    deleteConnection,
    updateConnectionSynergy,
    clearAll,
    reload,
  };
};
