# Architecture Overview

This document describes the high-level architecture of OrthoPlanner Phase 0.

## Core Concepts

- Core modules: provide essential functionality such as DICOM parsing, mesh generation, scene management, and state management.
- Plugins: optional modules that can extend functionality (cephalometry, export-splint, orthognathic workflows).
- UI: React components that present a wizard-based workflow for clinical tasks.

## Main Components

- `src/core/dicom-engine` — Reads DICOM files, naturalizes metadata, groups instances by series, and builds a 3D `Volume3D`.
- `src/core/mesh-engine` — Converts volumetric data into `THREE.BufferGeometry` using Marching Cubes and produces mesh objects for the scene.
- `src/core/scene-manager` — React + Three.js scene composition and viewport. Renders either demo geometry or the generated mesh.
- `src/ui/DICOMWizard.tsx` — Guided import UI for loading DICOM files, running segmentation, and creating meshes.
- `src/store/appStore.ts` — Global state using `zustand`, holds the current `Volume3D`, generated mesh, and UI state.

## Data Flow

1. User selects `.dcm` files in the `DICOMWizard`.
2. Files are parsed by `dicom-engine`, producing `DICOMInstance` objects.
3. Instances are grouped into a `DICOMSeries` and stacked into a `Volume3D`.
4. `mesh-engine` runs Marching Cubes (or a placeholder algorithm) on the volume to extract an isosurface at a chosen threshold.
5. The resulting `THREE.BufferGeometry` is wrapped into a `THREE.Mesh` and stored in the global store.
6. `scene-manager` subscribes to the store and adds the mesh to the Three.js scene for interactive viewing.

## Extension Points

- Replace threshold segmentation with `itk-wasm` pipelines for advanced segmentation.
- Add vertex deduplication and indexed mesh generation to reduce memory and improve rendering.
- Plugin API enables new panels and export capabilities.

## Performance Notes

- Marching Cubes is CPU-bound for large volumes; consider WebAssembly or web workers for heavy computation.
- Use indexed BufferGeometry and GPU frustum culling to minimize rendering overhead.
