import React, { useState } from 'react';
import Viewport3D from './core/scene-manager/Viewport3D';

// ═══════════════════════════════════════════
// OrthoPlanner - Componente Principale
// ═══════════════════════════════════════════

// Definizione dei moduli nella sidebar
const modules = [
  { id: 'dicom', label: '📂 DICOM Viewer', description: 'Import e visualizzazione CBCT' },
  { id: 'stl', label: '🦷 STL Manager', description: 'Scansioni intraorali' },
  { id: 'segment', label: '✂️ Segmentazione', description: 'Isolamento strutture' },
  { id: 'register', label: '🔗 Registrazione', description: 'Fusione STL-CBCT' },
  { id: 'ceph', label: '📐 Cefalometria', description: 'Analisi cefalometrica 3D' },
  { id: 'osteotomy', label: '🔪 Osteotomie', description: 'Pianificazione tagli' },
  { id: 'softtissue', label: '👤 Tessuti Molli', description: 'Simulazione profilo' },
  { id: 'export', label: '🖨️ Export & Splint', description: 'Generazione splint 3D' },
];

function App() {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [meshCount] = useState(0);
  const [vertexCount] = useState(0);

  return (
    <div className="app-layout">
      {/* ─── Toolbar superiore ─── */}
      <div className="app-toolbar">
        <span className="logo">⚕ OrthoPlanner</span>
        <span className="version">v0.1.0-alpha</span>
        <div style={{ flex: 1 }} />
        <button className="btn" onClick={() => setActiveModule(null)}>
          🏠 Home
        </button>
      </div>

      {/* ─── Area principale: sidebar + viewport ─── */}
      <div className="app-content">
        {/* Sidebar con moduli */}
        <div className="app-sidebar">
          <div className="sidebar-section">
            <h3>Moduli</h3>
            {modules.map((mod) => (
              <div
                key={mod.id}
                className={`sidebar-item ${activeModule === mod.id ? 'active' : ''}`}
                onClick={() => setActiveModule(mod.id)}
                title={mod.description}
              >
                {mod.label}
              </div>
            ))}
          </div>

          <div className="sidebar-section">
            <h3>Paziente</h3>
            <div style={{ color: 'var(--text-muted)', fontSize: '12px', padding: '8px 12px' }}>
              Nessun paziente caricato.
              <br />
              Importa un DICOM per iniziare.
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Plugin</h3>
            <div style={{ color: 'var(--text-muted)', fontSize: '12px', padding: '8px 12px' }}>
              Nessun plugin aggiuntivo installato.
            </div>
          </div>
        </div>

        {/* Viewport 3D */}
        <div className="app-viewport">
          <Viewport3D activeModule={activeModule} />
        </div>
      </div>

      {/* ─── Status bar inferiore ─── */}
      <div className="app-statusbar">
        <span>Meshes: {meshCount}</span>
        <span>Vertici: {vertexCount}</span>
        <span>Modulo: {activeModule ? modules.find(m => m.id === activeModule)?.label : 'Nessuno'}</span>
        <div style={{ flex: 1 }} />
        <span>OrthoPlanner v0.1.0 | Apache 2.0 | Open Source</span>
      </div>
    </div>
  );
}

export default App;
