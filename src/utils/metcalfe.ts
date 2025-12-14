import type { FlowNode, Connection, NetworkValue, IntegrationLevel } from '../types/flow';
import { INTEGRATION_CONFIGS, SYNERGY_CONFIGS } from '../constants/nodes';

/**
 * Union-Find to identify connected groups
 */
class UnionFind {
  private parent: Map<string, string>;

  constructor(nodes: FlowNode[]) {
    this.parent = new Map();
    nodes.forEach((node) => this.parent.set(node.id, node.id));
  }

  find(id: string): string {
    if (this.parent.get(id) !== id) {
      this.parent.set(id, this.find(this.parent.get(id)!));
    }
    return this.parent.get(id)!;
  }

  union(id1: string, id2: string) {
    const root1 = this.find(id1);
    const root2 = this.find(id2);
    if (root1 !== root2) {
      this.parent.set(root1, root2);
    }
  }

  getGroups(): string[][] {
    const groups = new Map<string, string[]>();
    this.parent.forEach((_, id) => {
      const root = this.find(id);
      if (!groups.has(root)) {
        groups.set(root, []);
      }
      groups.get(root)!.push(id);
    });
    return Array.from(groups.values());
  }
}

/**
 * Find connected groups of nodes based on connections
 */
export const findConnectedGroups = (
  nodes: FlowNode[],
  connections: Connection[]
): string[][] => {
  if (nodes.length === 0) return [];

  const uf = new UnionFind(nodes);

  connections.forEach((conn) => {
    uf.union(conn.sourceId, conn.targetId);
  });

  return uf.getGroups();
};

/**
 * Get effective value (considering active rate)
 */
export const getEffectiveValue = (node: FlowNode): number => {
  return node.value * node.activeRate;
};

/**
 * Calculate average synergy coefficient for a group
 */
const calculateGroupSynergy = (
  groupNodeIds: string[],
  connections: Connection[]
): number => {
  // Find all connections within this group
  const groupConnections = connections.filter(
    (conn) =>
      groupNodeIds.includes(conn.sourceId) &&
      groupNodeIds.includes(conn.targetId)
  );

  if (groupConnections.length === 0) {
    return 1.0;
  }

  // Calculate average synergy coefficient
  const totalSynergy = groupConnections.reduce((sum, conn) => {
    return sum + SYNERGY_CONFIGS[conn.synergy].coefficient;
  }, 0);

  return totalSynergy / groupConnections.length;
};

/**
 * Calculate network value using extended Metcalfe's Law
 *
 * Extended formula:
 * - Standalone value: Σ(effectiveValue²)
 * - Connected value: Σ((Σ effectiveValue)² × avgSynergy × integrationCoeff)
 */
export const calculateNetworkValue = (
  nodes: FlowNode[],
  connections: Connection[],
  integrationLevel: IntegrationLevel = 'simple'
): NetworkValue => {
  if (nodes.length === 0) {
    return { standaloneValue: 0, connectedValue: 0, multiplier: 1 };
  }

  const integrationCoeff = INTEGRATION_CONFIGS[integrationLevel].coefficient;

  // 1. Standalone value (each node independent, with active rate)
  const standaloneValue = nodes.reduce((sum, node) => {
    const effectiveValue = getEffectiveValue(node);
    return sum + Math.pow(effectiveValue, 2);
  }, 0);

  // 2. Find connected groups
  const groups = findConnectedGroups(nodes, connections);

  // 3. Calculate connected value for each group
  const connectedValue = groups.reduce((sum, groupNodeIds) => {
    // Sum effective values in group
    const totalEffectiveValue = groupNodeIds.reduce((s, nodeId) => {
      const node = nodes.find((n) => n.id === nodeId);
      return s + (node ? getEffectiveValue(node) : 0);
    }, 0);

    // Get average synergy for this group
    const avgSynergy = calculateGroupSynergy(groupNodeIds, connections);

    // Calculate group value
    // Only apply synergy and integration coefficients if group has connections
    const hasConnections = connections.some(
      (conn) =>
        groupNodeIds.includes(conn.sourceId) &&
        groupNodeIds.includes(conn.targetId)
    );

    if (hasConnections) {
      return sum + Math.pow(totalEffectiveValue, 2) * avgSynergy * integrationCoeff;
    } else {
      // Single node group - no synergy or integration bonus
      return sum + Math.pow(totalEffectiveValue, 2);
    }
  }, 0);

  // 4. Calculate multiplier
  const multiplier = standaloneValue > 0 ? connectedValue / standaloneValue : 1;

  return {
    standaloneValue,
    connectedValue,
    multiplier,
  };
};

/**
 * Format large numbers for display (e.g., 1,234,567 or 1.2B)
 */
export const formatValue = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return Math.round(value).toLocaleString();
};

/**
 * Format number for display
 */
export const formatNumber = (count: number): string => {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(0)}K`;
  }
  return count.toLocaleString();
};

/**
 * Format percentage for display
 */
export const formatPercent = (rate: number): string => {
  return `${Math.round(rate * 100)}%`;
};
