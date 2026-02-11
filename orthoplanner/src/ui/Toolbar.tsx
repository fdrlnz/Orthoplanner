import React from 'react';
import { useAppStore } from '../store/appStore';

const toolbarStyle: React.CSSProperties = {
  height: 'var(--toolbar-height)',
  backgroundColor: 'var(--color-bg-secondary)',
  borderBottom: '1px solid var(--color-border)',
  display: 'flex',
  alignItems: 'center',
  padding: '0 16px',
  gap: '8px',
  userSelect: 'none',
};

const logoStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 700,
  color: 'var(--color-accent)',
  marginRight: '24px',
  letterSpacing: '0.5px',
};

const buttonStyle: React.CSSProperties = {
  padding: '6px 14px',
  borderRadius: '6px',
  border: '1px solid transparent',
  backgroundColor: 'transparent',
  color: 'var(--color-text-secondary)',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: 500,
  transition: 'all 0.15s ease',
};

const activeButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: 'var(--color-accent)',
  color: 'white',
};

const modules = [
  { id: 'home', label: '🏠 Home' },
  { id: 'dicom', label: '📁 DICOM' },
  { id: 'stl', label: '🦷 STL' },
  { id: 'segment', label: '✂️ Segmentazione' },
  { id: 'register', label: '🎯 Registrazione' },
  { id: 'ceph', label: '📐 Cefalometria' },
  { id: 'osteotomy', label: '🔪 Osteotomie' },
  { id: 'softtissue', label: '👤 Tessuti Molli' },
  { id: 'export', label: '💾 Export' },
];

export default function Toolbar() {
  const { activeModule, setActiveModule } = useAppStore();

  return (
    <div style={toolbarStyle}>
      <span style={logoStyle}>⚕️ OrthoPlanner</span>
      
      {modules.map((mod) => (
        <button
          key={mod.id}
          style={activeModule === mod.id ? activeButtonStyle : buttonStyle}
          onClick={() => setActiveModule(mod.id)}
          onMouseEnter={(e) => {
            if (activeModule !== mod.id) {
              e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
              e.currentTarget.style.color = 'var(--color-text-primary)';
            }
          }}
          onMouseLeave={(e) => {
            if (activeModule !== mod.id) {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }
          }}
        >
          {mod.label}
        </button>
      ))}
    </div>
  );
}
