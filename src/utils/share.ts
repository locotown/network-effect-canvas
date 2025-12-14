import type { FlowState } from '../types/flow';

/**
 * Encode FlowState to Base64 string for URL sharing
 */
export const encodeFlowState = (state: FlowState): string => {
  try {
    const json = JSON.stringify(state);
    return btoa(unescape(encodeURIComponent(json)));
  } catch (error) {
    console.error('Failed to encode flow state:', error);
    return '';
  }
};

/**
 * Decode Base64 string to FlowState
 */
export const decodeFlowState = (encoded: string): FlowState | null => {
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    const state = JSON.parse(json) as FlowState;

    // Basic validation
    if (!Array.isArray(state.nodes) || !Array.isArray(state.connections)) {
      return null;
    }

    return state;
  } catch (error) {
    console.error('Failed to decode flow state:', error);
    return null;
  }
};

/**
 * Generate shareable URL with encoded state
 */
export const getShareUrl = (state: FlowState): string => {
  const encoded = encodeFlowState(state);
  if (!encoded) return '';

  const baseUrl = window.location.origin;
  return `${baseUrl}/share?state=${encoded}`;
};

/**
 * Copy share URL to clipboard
 */
export const copyShareUrl = async (state: FlowState): Promise<boolean> => {
  const url = getShareUrl(state);
  if (!url) return false;

  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch (error) {
    console.error('Failed to copy URL to clipboard:', error);
    return false;
  }
};

/**
 * Download FlowState as JSON file
 */
export const downloadAsJSON = (state: FlowState, filename?: string): boolean => {
  try {
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `network-canvas-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Failed to download JSON:', error);
    return false;
  }
};

/**
 * Import FlowState from JSON file
 */
export const importFromJSON = async (file: File): Promise<FlowState | null> => {
  try {
    const text = await file.text();
    const state = JSON.parse(text) as FlowState;

    // Basic validation
    if (!Array.isArray(state.nodes) || !Array.isArray(state.connections)) {
      throw new Error('Invalid file format');
    }

    // Validate nodes structure
    for (const node of state.nodes) {
      if (
        typeof node.id !== 'string' ||
        typeof node.name !== 'string' ||
        typeof node.position?.x !== 'number' ||
        typeof node.position?.y !== 'number'
      ) {
        throw new Error('Invalid node structure');
      }
    }

    return state;
  } catch (error) {
    console.error('Failed to import JSON:', error);
    return null;
  }
};

/**
 * Parse URL for shared state (for /share page)
 */
export const parseShareState = (searchParams: URLSearchParams): FlowState | null => {
  const stateParam = searchParams.get('state');
  if (!stateParam) return null;
  return decodeFlowState(stateParam);
};
