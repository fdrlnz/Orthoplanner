# Developer Guide

This guide helps contributors build, run, and extend OrthoPlanner.

## Requirements

- Node.js (LTS)
- npm
- Optional: Python 3 for optional scripts

## Install

```bash
npm install
```

## Run (development)

```bash
npm run dev
```

This runs the Vite renderer and an Electron shell. The renderer hosts the React UI and Three.js viewport.

## Project layout

- `src/core/dicom-engine` — Implement DICOM parsing. Key exports:
  - `importDICOMVolume(files: FileList)` → returns `{ volume, series, instances }`.
- `src/core/mesh-engine` — Implement mesh extraction. Key exports:
  - `generateMeshFromVolume(volume, isoLevel)` → `GeneratedMesh` (geometry, counts)
  - `createThreeMesh(generated)` → `THREE.Mesh`
- `src/core/scene-manager/Viewport3D.tsx` — Adds the mesh to the Three.js scene when available.
- `src/ui/DICOMWizard.tsx` — User flows for import and segmentation.

## Adding features

1. Add new UI components inside `src/ui` and wire them via `useAppStore`.
2. For heavy computation, create a web worker or use WebAssembly (`itk-wasm`).
3. Add unit tests under `tests/` and run with `npm test`.

## Code style

- TypeScript; follow existing style.
- Run linters via `npm run lint`.

## Testing

Use `vitest` for unit tests. Add tests under `tests/` and run:

```bash
npm test
```
