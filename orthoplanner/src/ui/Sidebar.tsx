import React from 'react';
import { useAppStore } from '../store/appStore';

const sidebarStyle: React.CSSProperties = {
  width: 'var(--sidebar-width)',
  backgroundColor: 'var(--color-bg-panel)',
  borderRight: '1px solid var(--color-border)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const headerStyle: React.CSSProperties = {
  padding: '16px',
  borderBottom: '1px solid var(--color-border)',
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--color-accent)',
  textTransform: 'uppercase',
  letterSpacing: '1px',
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  padding: '16px',
  overflowY: 'auto',
  fontSize: '13px',
  lineHeight: '1.6',
  color: 'var(--color-text-secondary)',
};

const infoBoxStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-bg-secondary)',
  borderRadius: '8px',
  padding: '12px',
  marginBottom: '12px',
  border: '1px solid var(--color-border)',
};

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--color-text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '4px',
};

const valueStyle: React.CSSProperties = {
  fontSize: '13px',
  color: 'var(--color-text-primary)',
  fontWeight: 500,
};

const moduleInfo: Record<string, { title: string; description: string }> = {
  home: {
    title: 'Benvenuto',
    description: 'OrthoPlanner - Software open source per la pianificazione di chirurgia ortognatica. Seleziona un modulo dalla toolbar per iniziare.',
  },
  dicom: {
    title: 'DICOM Viewer',
    description: 'Importa e visualizza file DICOM da CBCT. Viste assiale, coronale, sagittale e ricostruzione 3D.',
  },
  stl: {
    title: 'STL Manager',
    description: 'Importa e gestisci scansioni intraorali in formato STL, PLY o OBJ.',
  },
  segment: {
    title: 'Segmentazione',
    description: 'Segmenta la CBCT per isolare mascella, mandibola e denti come mesh 3D separate.',
  },
  register: {
    title: 'Registrazione',
    description: 'Allinea le scansioni STL alla ricostruzione CBCT con algoritmo ICP.',
  },
  ceph: {
    title: 'Cefalometria 3D',
    description: 'Posiziona landmarks cefalometrici e calcola le misure automaticamente.',
  },
  osteotomy: {
    title: 'Simulatore Osteotomie',
    description: 'Pianifica Le Fort I, BSSO, genioplastica e altre osteotomie con feedback numerico.',
  },
  softtissue: {
    title: 'Tessuti Molli',
    description: 'Simula il profilo facciale post-operatorio basandosi sui movimenti ossei.',
  },
  export: {
    title: 'Export & Splint',
    description: 'Genera splint chirurgici e guide di taglio per stampa 3D.',
  },
};

export default function Sidebar() {
  const { activeModule, currentPatient } = useAppStore();
  const info = moduleInfo[activeModule] || moduleInfo.home;

  return (
    <div style={sidebarStyle}>
      <div style={headerStyle}>{info.title}</div>
      <div style={contentStyle}>
        {/* Info paziente */}
        <div style={infoBoxStyle}>
          <div style={labelStyle}>Paziente</div>
          <div style={valueStyle}>
            {currentPatient || 'Nessun paziente caricato'}
          </div>
        </div>

        {/* Info modulo */}
        <div style={infoBoxStyle}>
          <div style={labelStyle}>Modulo attivo</div>
          <div style={valueStyle}>{info.title}</div>
          <div style={{ ...labelStyle, marginTop: '8px', marginBottom: '0' }}>
            {info.description}
          </div>
        </div>

        {/* Versione */}
        <div style={infoBoxStyle}>
          <div style={labelStyle}>Versione</div>
          <div style={valueStyle}>0.1.0-alpha</div>
          <div style={{ ...labelStyle, marginTop: '4px', marginBottom: '0' }}>
            Fase 0 — Setup Progetto
          </div>
        </div>

        {/* Istruzioni 3D */}
        <div style={infoBoxStyle}>
          <div style={labelStyle}>Controlli 3D</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>
            🖱️ Tasto sinistro: ruota<br />
            🖱️ Tasto destro: sposta<br />
            🖱️ Rotellina: zoom<br />
          </div>
        </div>
      </div>
    </div>
  );
}
