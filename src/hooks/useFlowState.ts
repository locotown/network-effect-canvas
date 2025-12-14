import { useState, useCallback } from 'react';
import type { FlowState, Position, SynergyLevel, NodeInput } from '../types/flow';
import { DEFAULT_NODE_VALUES } from '../constants/nodes';
import { PRESETS } from '../constants/presets';

const STORAGE_KEY = 'network-effect-canvas';

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

    // Migrate old data format to new format
    const nodes = parsed.nodes.map((node: any) => ({
      id: node.id,
      name: node.name ?? node.type ?? 'ノード',
      icon: node.icon ?? DEFAULT_NODE_VALUES.icon,
      color: node.color ?? DEFAULT_NODE_VALUES.color,
      position: node.position,
      value: node.value ?? node.userCount ?? DEFAULT_NODE_VALUES.value,
      valueLabel: node.valueLabel ?? DEFAULT_NODE_VALUES.valueLabel,
      activeRate: node.activeRate ?? DEFAULT_NODE_VALUES.activeRate,
    }));

    // Migrate connections (add synergy if missing)
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
  const [currentPresetId, setCurrentPresetId] = useState<string | null>(null);

  // Add new node with custom values
  const addNode = useCallback((input: NodeInput, position: Position) => {
    setState((prev) => {
      const newState = {
        ...prev,
        nodes: [
          ...prev.nodes,
          {
            id: generateId(),
            name: input.name,
            icon: input.icon,
            color: input.color,
            position,
            value: input.value,
            valueLabel: input.valueLabel,
            activeRate: input.activeRate,
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

  // Update node name
  const updateNodeName = useCallback((id: string, name: string) => {
    setState((prev) => {
      const newState = {
        ...prev,
        nodes: prev.nodes.map((node) =>
          node.id === id ? { ...node, name } : node
        ),
      };
      saveState(newState);
      return newState;
    });
  }, []);

  // Update node value
  const updateNodeValue = useCallback((id: string, value: number) => {
    setState((prev) => {
      const newState = {
        ...prev,
        nodes: prev.nodes.map((node) =>
          node.id === id ? { ...node, value } : node
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

  // Load preset
  const loadPreset = useCallback((presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setState(preset.data);
      saveState(preset.data);
      setConnectingFrom(null);
      setCurrentPresetId(presetId);
    }
  }, []);

  // Clear current preset (called when user modifies the canvas)
  const clearCurrentPreset = useCallback(() => {
    setCurrentPresetId(null);
  }, []);

  // Get current state (for sharing)
  const getState = useCallback((): FlowState => {
    return state;
  }, [state]);

  // Import state from external source (JSON file, URL)
  const importState = useCallback((newState: FlowState) => {
    setState(newState);
    saveState(newState);
    setConnectingFrom(null);
    setCurrentPresetId(null);
  }, []);

  return {
    nodes: state.nodes,
    connections: state.connections,
    connectingFrom,
    currentPresetId,
    addNode,
    updateNodePosition,
    updateNodeName,
    updateNodeValue,
    updateNodeActiveRate,
    startConnection,
    completeConnection,
    cancelConnection,
    deleteNode,
    deleteConnection,
    updateConnectionSynergy,
    clearAll,
    reload,
    loadPreset,
    clearCurrentPreset,
    getState,
    importState,
  };
};
