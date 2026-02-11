import React, { useState } from 'react';
import { importDICOMVolume } from '../core/dicom-engine/index';
import { generateMeshFromVolume, createThreeMesh } from '../core/mesh-engine/index';
import { useAppStore } from '../store/appStore';

const panelStyle: React.CSSProperties = {
  position: 'absolute',
  left: '12px',
  top: '12px',
  width: '380px',
  maxHeight: '80vh',
  overflowY: 'auto',
  padding: '14px',
  background: 'rgba(10,10,20,0.95)',
  color: 'white',
  borderRadius: '8px',
  boxShadow: '0 6px 24px rgba(0,0,0,0.6)',
  zIndex: 20,
  fontFamily: 'system-ui, -apple-system, sans-serif',
};

const buttonStyle: React.CSSProperties = {
  padding: '8px 12px',
  marginRight: '6px',
  marginBottom: '6px',
  borderRadius: '4px',
  border: '1px solid #4fc3f7',
  backgroundColor: 'transparent',
  color: '#4fc3f7',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: 500,
  transition: 'all 0.2s ease',
};

const buttonHoverStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#4fc3f7',
  color: '#0a0a1a',
};

const infoStyle: React.CSSProperties = {
  fontSize: '12px',
  opacity: 0.85,
  marginBottom: '10px',
  lineHeight: '1.4',
  padding: '8px',
  backgroundColor: 'rgba(79, 195, 247, 0.1)',
  borderLeft: '2px solid #4fc3f7',
};

export default function DICOMWizard() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [info, setInfo] = useState<string>('Seleziona i file DICOM per iniziare');
  const [isLoading, setIsLoading] = useState(false);
  const [threshold, setThreshold] = useState(100);
  const [seriesCount, setSeriesCount] = useState<number | null>(null);

  const { setDICOMVolume, setCurrentMesh, updateMeshStats, patient, setPatient } = useAppStore();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFiles(e.target.files);
    setInfo(`${e.target.files?.length || 0} file(s) selezionato(i). Pronto per il caricamento.`);
    setSeriesCount(null);
  }

  async function handleLoad() {
    if (!files || files.length === 0) {
      setInfo('❌ Seleziona i file DICOM prima di caricare.');
      return;
    }

    setIsLoading(true);
    setInfo('⏳ Caricamento in corso...');

    try {
      const result = await importDICOMVolume(files);
      const { volume, series, instances } = result;

      setDICOMVolume(volume);
      setSeriesCount(series.instances.length);
      setInfo(
        `✅ Caricati ${instances.length} file in ${series.instances.length} slice(s).\n` +
        `Volume: ${volume.dimensions[0]}×${volume.dimensions[1]}×${volume.dimensions[2]} voxel\n` +
        `Ora segmenta per generare il mesh 3D.`
      );

      // Update patient info if not set
      if (!patient) {
        setPatient({
          id: series.seriesInstanceUID.substring(0, 8),
          name: instances[0].patientName || 'Unknown',
          dateOfBirth: '2000-01-01',
          dicomLoaded: true,
          stlFiles: [],
        });
      }
    } catch (err: any) {
      console.error(err);
      setInfo(`❌ Errore: ${err.message || 'Impossibile leggere i file DICOM'}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSegment() {
    const volume = useAppStore.getState().dicomVolume;
    if (!volume) {
      setInfo('❌ Carica prima i file DICOM.');
      return;
    }

    setIsLoading(true);
    setInfo('⏳ Segmentazione in corso (soglia: ' + threshold + ')...');

    try {
      const generated = generateMeshFromVolume(volume, threshold);
      const threeMesh = createThreeMesh(generated);

      setCurrentMesh(threeMesh);
      updateMeshStats(1, generated.vertexCount);

      setInfo(
        `✅ Segmentazione completata!\n` +
        `Mesh: ${generated.vertexCount} vertici, ${generated.faceCount} facce\n` +
        `Ruota la vista per ispezionare il modello 3D.`
      );
    } catch (err: any) {
      console.error(err);
      setInfo(`❌ Errore nella segmentazione: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={panelStyle}>
      <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '16px' }}>
        📁 DICOM Import Wizard
      </h3>

      <div style={infoStyle}>{info}</div>

      <label style={{ display: 'block', marginBottom: '12px', fontSize: '12px' }}>
        <strong>1. Seleziona file DICOM (multiselect):</strong>
        <input
          type="file"
          multiple
          accept=".dcm,.DCM,application/dicom"
          onChange={handleFileChange}
          style={{ display: 'block', marginTop: '6px', width: '100%' }}
        />
      </label>

      <div style={{ marginBottom: '12px' }}>
        <button
          onClick={handleLoad}
          disabled={isLoading}
          onMouseEnter={(e) => !isLoading && Object.assign(e.currentTarget.style, buttonHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
          style={buttonStyle}
        >
          {isLoading ? '⏳ Carica' : '📂 Carica DICOM'}
        </button>
      </div>

      <label
        style={{
          display: 'block',
          marginBottom: '12px',
          fontSize: '12px',
          opacity: useAppStore.getState().dicomVolume ? 1 : 0.5,
        }}
      >
        <strong>2. Soglia di segmentazione:</strong>
        <input
          type="range"
          min="0"
          max="500"
          value={threshold}
          onChange={(e) => setThreshold(parseInt(e.target.value))}
          style={{ display: 'block', marginTop: '6px', width: '100%' }}
          disabled={!useAppStore.getState().dicomVolume}
        />
        <span style={{ fontSize: '11px', opacity: 0.8 }}>Valore: {threshold}</span>
      </label>

      <div style={{ marginBottom: '12px' }}>
        <button
          onClick={handleSegment}
          disabled={isLoading || !useAppStore.getState().dicomVolume}
          onMouseEnter={(e) => !isLoading && Object.assign(e.currentTarget.style, buttonHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
          style={buttonStyle}
        >
          {isLoading ? '⏳ Segmenta' : '✂️ Segmenta'}
        </button>
      </div>

      {seriesCount !== null && (
        <div style={{ marginTop: '10px', fontSize: '12px', opacity: 0.8 }}>
          <strong>Serie:</strong> {seriesCount} slice
        </div>
      )}

      <div style={{ marginTop: '14px', fontSize: '11px', opacity: 0.7, lineHeight: '1.5' }}>
        <strong>Flusso:</strong>
        <br />
        1️⃣ Carica i tuoi file DICOM (CBCT, CT, MRI)
        <br />
        2️⃣ Regola la soglia per la segmentazione
        <br />
        3️⃣ Genera il mesh 3D
        <br />
        <br />
        💡 <em>Usa il mouse per ruotare e zoomare il mesh nella viewport.</em>
      </div>
    </div>
  );
}
