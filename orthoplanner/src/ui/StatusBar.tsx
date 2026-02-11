import React from 'react';

const statusBarStyle: React.CSSProperties = {
  height: 'var(--statusbar-height)',
  backgroundColor: 'var(--color-bg-secondary)',
  borderTop: '1px solid var(--color-border)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 16px',
  fontSize: '11px',
  color: 'var(--color-text-secondary)',
  userSelect: 'none',
};

const dotStyle = (color: string): React.CSSProperties => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: color,
  display: 'inline-block',
  marginRight: '6px',
});

export default function StatusBar() {
  return (
    <div style={statusBarStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span>
          <span style={dotStyle('var(--color-success)')} />
          Pronto
        </span>
        <span>Nessun dato caricato</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span>Apache 2.0</span>
        <span>OrthoPlanner v0.1.0</span>
      </div>
    </div>
  );
}
