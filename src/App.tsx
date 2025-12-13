import { useMemo, useState } from 'react';
import { Header, Sidebar, Canvas } from './components';
import { useFlowState } from './hooks/useFlowState';
import { calculateNetworkValue } from './utils/metcalfe';
import type { IntegrationLevel } from './types/flow';

function App() {
  const {
    nodes,
    connections,
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
  } = useFlowState();

  // Integration level state (global setting)
  const [integrationLevel, setIntegrationLevel] = useState<IntegrationLevel>('simple');

  // Calculate network value using extended Metcalfe's Law
  const networkValue = useMemo(
    () => calculateNetworkValue(nodes, connections, integrationLevel),
    [nodes, connections, integrationLevel]
  );

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-200">
      <Header
        nodeCount={nodes.length}
        connectionCount={connections.length}
        networkValue={networkValue}
        integrationLevel={integrationLevel}
        onIntegrationLevelChange={setIntegrationLevel}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar onClear={clearAll} />
        <Canvas
          nodes={nodes}
          connections={connections}
          connectingFrom={connectingFrom}
          onAddNode={addNode}
          onUpdateNodePosition={updateNodePosition}
          onUpdateNodeUserCount={updateNodeUserCount}
          onUpdateNodeActiveRate={updateNodeActiveRate}
          onStartConnection={startConnection}
          onCompleteConnection={completeConnection}
          onCancelConnection={cancelConnection}
          onDeleteNode={deleteNode}
          onDeleteConnection={deleteConnection}
          onUpdateConnectionSynergy={updateConnectionSynergy}
        />
      </div>

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
            Network Value Canvasは<br />
            タブレットまたはデスクトップで<br />
            ご利用ください。
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
