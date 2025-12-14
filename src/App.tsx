import { useMemo, useState, useEffect, useRef } from 'react';
import { Header, Sidebar, Canvas, HelpModal, WelcomeModal } from './components';
import type { HelpTabId } from './components/HelpModal';
import { useFlowState } from './hooks/useFlowState';
import { calculateNetworkValue } from './utils/metcalfe';
import { parseUrlState, clearUrlState } from './utils/share';
import { PRESETS } from './constants/presets';
import type { IntegrationLevel, NodeInput, Position } from './types/flow';

const WELCOME_DISMISSED_KEY = 'network-effect-canvas-welcome-dismissed';

function App() {
  const {
    nodes,
    connections,
    connectingFrom,
    currentPresetId,
    addNode,
    updateNodePosition,
    updateNodeValue,
    updateNodeActiveRate,
    startConnection,
    completeConnection,
    cancelConnection,
    deleteNode,
    deleteConnection,
    updateConnectionSynergy,
    clearAll,
    loadPreset,
    clearCurrentPreset,
    importState,
    getState,
  } = useFlowState();

  // Canvas ref for screenshot functionality
  const canvasRef = useRef<HTMLDivElement>(null);

  // Get current preset object from ID
  const currentPreset = currentPresetId
    ? PRESETS.find((p) => p.id === currentPresetId) ?? null
    : null;

  // Integration level state (global setting)
  const [integrationLevel, setIntegrationLevel] = useState<IntegrationLevel>('simple');

  // Pending node state (waiting to be placed on canvas)
  const [pendingNode, setPendingNode] = useState<{ input: NodeInput } | null>(null);

  // Help modal state
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [helpInitialTab, setHelpInitialTab] = useState<HelpTabId>('effect');

  // Welcome modal state (show on first visit)
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);

  // Check for shared state in URL on initial load
  useEffect(() => {
    const sharedState = parseUrlState();
    if (sharedState) {
      importState(sharedState);
      clearUrlState();
    }
  }, [importState]);

  useEffect(() => {
    const dismissed = localStorage.getItem(WELCOME_DISMISSED_KEY);
    if (!dismissed) {
      setIsWelcomeOpen(true);
    }
  }, []);

  // Handle opening help with specific tab
  const handleOpenHelp = (tab: HelpTabId = 'effect') => {
    setHelpInitialTab(tab);
    setIsHelpOpen(true);
  };

  // Handle welcome modal actions
  const handleWelcomeClose = () => {
    setIsWelcomeOpen(false);
  };

  const handleWelcomeOpenHelp = () => {
    setIsWelcomeOpen(false);
    handleOpenHelp('guide');
  };

  // Calculate network value using extended Metcalfe's Law
  const networkValue = useMemo(
    () => calculateNetworkValue(nodes, connections, integrationLevel),
    [nodes, connections, integrationLevel]
  );

  // Handle node creation from sidebar
  const handleAddNode = (input: NodeInput) => {
    setPendingNode({ input });
  };

  // Handle node placement on canvas
  const handleDropNode = (position: Position) => {
    if (pendingNode) {
      addNode(pendingNode.input, position);
      setPendingNode(null);
    }
  };

  // Handle clear all (also clear pending node)
  const handleClearAll = () => {
    clearAll();
    setPendingNode(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-200">
      <Header
        nodeCount={nodes.length}
        connectionCount={connections.length}
        networkValue={networkValue}
        integrationLevel={integrationLevel}
        onIntegrationLevelChange={setIntegrationLevel}
        onHelpClick={() => handleOpenHelp()}
        canvasRef={canvasRef}
        flowState={getState()}
        onImportState={importState}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          onAddNode={handleAddNode}
          onClear={handleClearAll}
          onLoadPreset={loadPreset}
          onOpenHelp={handleOpenHelp}
        />
        <Canvas
          nodes={nodes}
          connections={connections}
          connectingFrom={connectingFrom}
          pendingNode={pendingNode}
          currentPreset={currentPreset}
          onDropNode={handleDropNode}
          onUpdateNodePosition={updateNodePosition}
          onUpdateNodeValue={updateNodeValue}
          onUpdateNodeActiveRate={updateNodeActiveRate}
          onStartConnection={startConnection}
          onCompleteConnection={completeConnection}
          onCancelConnection={cancelConnection}
          onDeleteNode={deleteNode}
          onDeleteConnection={deleteConnection}
          onUpdateConnectionSynergy={updateConnectionSynergy}
          onClearPreset={clearCurrentPreset}
          externalContentRef={canvasRef}
        />
      </div>

      {/* Welcome Modal */}
      <WelcomeModal
        isOpen={isWelcomeOpen}
        onClose={handleWelcomeClose}
        onOpenHelp={handleWelcomeOpenHelp}
      />

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        initialTab={helpInitialTab}
      />

      {/* Mobile warning - Liquid Glass style */}
      <div className="md:hidden fixed inset-0 bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 z-50 flex items-center justify-center p-8">
        <div className="glass-heavy text-center rounded-3xl p-10 shadow-glass-lg relative overflow-hidden">
          {/* Glass highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/40 backdrop-blur-xl flex items-center justify-center shadow-glass border border-white/50">
            <span className="text-4xl">💻</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-3">
            デスクトップ推奨
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            ネットワーク効果キャンバスは<br />
            タブレットまたはデスクトップで<br />
            ご利用ください。
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
