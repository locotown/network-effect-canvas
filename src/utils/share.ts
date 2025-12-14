import html2canvas from 'html2canvas';
import type { FlowState, FlowNode } from '../types/flow';

/**
 * Calculate bounding box of all nodes
 */
const calculateNodesBoundingBox = (nodes: FlowNode[], padding = 50, nodeWidth = 240, nodeHeight = 200) => {
  if (nodes.length === 0) {
    return { x: 0, y: 0, width: 800, height: 600 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const node of nodes) {
    minX = Math.min(minX, node.position.x);
    minY = Math.min(minY, node.position.y);
    maxX = Math.max(maxX, node.position.x + nodeWidth);
    maxY = Math.max(maxY, node.position.y + nodeHeight);
  }

  return {
    x: Math.max(0, minX - padding),
    y: Math.max(0, minY - padding),
    width: maxX - minX + nodeWidth + padding * 2,
    height: maxY - minY + nodeHeight + padding * 2,
  };
};

/**
 * Export canvas as PNG image
 */
export const exportCanvasAsImage = async (
  element: HTMLElement | null,
  flowState: FlowState,
  filename?: string
): Promise<boolean> => {
  if (!element) {
    console.error('Export failed: element is null');
    return false;
  }

  if (flowState.nodes.length === 0) {
    alert('エクスポートするノードがありません');
    return false;
  }

  try {
    // Calculate the bounding box of nodes
    const bounds = calculateNodesBoundingBox(flowState.nodes);
    const scale = 2;

    // Capture the full canvas
    const fullCanvas = await html2canvas(element, {
      backgroundColor: '#e8ecf4',
      scale: scale,
      useCORS: true,
      logging: false,
      allowTaint: true,
      onclone: (clonedDoc) => {
        // Helper to check if a color string contains unsupported functions
        const hasUnsupportedColor = (value: string): boolean => {
          if (!value) return false;
          const unsupported = ['oklab', 'oklch', 'lab', 'lch', 'color(', 'color-mix'];
          return unsupported.some(fn => value.toLowerCase().includes(fn));
        };

        // Helper to convert computed color to safe RGB
        const getSafeColor = (el: Element, prop: string): string | null => {
          const computed = window.getComputedStyle(el);
          const value = computed.getPropertyValue(prop);
          if (hasUnsupportedColor(value)) {
            // Return fallback colors based on property
            if (prop.includes('background')) return 'rgba(255, 255, 255, 0.9)';
            if (prop.includes('border')) return 'rgba(200, 200, 200, 0.5)';
            if (prop.includes('color')) return '#334155'; // slate-700
            return null;
          }
          return null;
        };

        // Fix unsupported color functions by replacing with fallback colors
        const allElements = clonedDoc.querySelectorAll('*');
        allElements.forEach((el) => {
          const htmlEl = el as HTMLElement;
          const computed = window.getComputedStyle(el as Element);

          // Remove backdrop-filter completely
          if (computed.backdropFilter && computed.backdropFilter !== 'none') {
            htmlEl.style.backdropFilter = 'none';
            (htmlEl.style as unknown as Record<string, string>).webkitBackdropFilter = 'none';
          }

          // Check and fix color properties
          const colorProps = [
            'color',
            'background-color',
            'border-color',
            'border-top-color',
            'border-right-color',
            'border-bottom-color',
            'border-left-color',
            'outline-color',
            'box-shadow',
            'text-shadow',
          ];

          for (const prop of colorProps) {
            const safeColor = getSafeColor(el, prop);
            if (safeColor) {
              htmlEl.style.setProperty(prop, safeColor);
            }
          }

          // Handle background (might contain gradients with oklab)
          const bg = computed.background;
          if (hasUnsupportedColor(bg)) {
            htmlEl.style.background = 'rgba(255, 255, 255, 0.9)';
          }

          // Ensure solid backgrounds for glassmorphism elements
          if (htmlEl.classList.contains('glass') || htmlEl.classList.contains('glass-heavy')) {
            htmlEl.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            htmlEl.style.backdropFilter = 'none';
          }

          // Handle nodes with specific background colors
          if (htmlEl.classList.contains('bg-blue-500') || htmlEl.classList.contains('bg-blue-500/80')) {
            htmlEl.style.backgroundColor = 'rgba(59, 130, 246, 0.9)';
          }
          if (htmlEl.classList.contains('bg-emerald-500') || htmlEl.classList.contains('bg-emerald-500/80')) {
            htmlEl.style.backgroundColor = 'rgba(16, 185, 129, 0.9)';
          }
          if (htmlEl.classList.contains('bg-red-500') || htmlEl.classList.contains('bg-red-500/90')) {
            htmlEl.style.backgroundColor = 'rgba(239, 68, 68, 0.9)';
          }
        });
      },
    });

    // Create a cropped canvas
    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = bounds.width * scale;
    croppedCanvas.height = bounds.height * scale;

    const ctx = croppedCanvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Draw the cropped region
    ctx.drawImage(
      fullCanvas,
      bounds.x * scale,
      bounds.y * scale,
      bounds.width * scale,
      bounds.height * scale,
      0,
      0,
      bounds.width * scale,
      bounds.height * scale
    );

    const link = document.createElement('a');
    link.download = filename || `network-canvas-${Date.now()}.png`;
    link.href = croppedCanvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  } catch (error) {
    console.error('Failed to export canvas as image:', error);
    alert('画像の保存に失敗しました');
    return false;
  }
};

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

  const url = new URL(window.location.href);
  url.searchParams.set('state', encoded);
  return url.toString();
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
 * Parse URL for shared state
 */
export const parseUrlState = (): FlowState | null => {
  const params = new URLSearchParams(window.location.search);
  const stateParam = params.get('state');

  if (!stateParam) return null;

  return decodeFlowState(stateParam);
};

/**
 * Clear state parameter from URL without reload
 */
export const clearUrlState = (): void => {
  const url = new URL(window.location.href);
  url.searchParams.delete('state');
  window.history.replaceState({}, '', url.toString());
};
