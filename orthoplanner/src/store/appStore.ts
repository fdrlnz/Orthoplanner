import { create } from 'zustand';
import type { Volume3D } from '../core/dicom-engine/index';

// ═══════════════════════════════════════════
// OrthoPlanner - State Management (Zustand)
// Store globale dell'applicazione
// ═══════════════════════════════════════════

interface PatientData {
  id: string;
  name: string;
  dateOfBirth: string;
  dicomLoaded: boolean;
  stlFiles: string[];
}

interface AppState {
  // Modulo attivo
  activeModule: string | null;
  setActiveModule: (module: string | null) => void;

  // Dati paziente
  patient: PatientData | null;
  setPatient: (patient: PatientData | null) => void;

  // Stato 3D
  meshCount: number;
  vertexCount: number;
  updateMeshStats: (meshes: number, vertices: number) => void;

  // Plugin caricati
  loadedPlugins: string[];
  registerPlugin: (pluginId: string) => void;

  // DICOM volume data
  dicomVolume: Volume3D | null;
  setDICOMVolume: (volume: Volume3D | null) => void;

  // Three.js mesh
  currentMesh: any | null;
  setCurrentMesh: (mesh: any | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Modulo attivo
  activeModule: null,
  setActiveModule: (module) => set({ activeModule: module }),

  // Dati paziente
  patient: null,
  setPatient: (patient) => set({ patient }),

  // Stato 3D
  meshCount: 0,
  vertexCount: 0,
  updateMeshStats: (meshCount, vertexCount) => set({ meshCount, vertexCount }),

  // Plugin
  loadedPlugins: [],
  registerPlugin: (pluginId) =>
    set((state) => ({
      loadedPlugins: [...state.loadedPlugins, pluginId],
    })),

  // DICOM volume
  dicomVolume: null,
  setDICOMVolume: (volume) => set({ dicomVolume: volume }),

  // Three.js mesh
  currentMesh: null,
  setCurrentMesh: (mesh) => set({ currentMesh: mesh }),
}));
