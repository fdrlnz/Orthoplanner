# ⚕ OrthoPlanner

**Open Source Orthognathic Surgery Planning Software**

OrthoPlanner è un software open source per la pianificazione di interventi di chirurgia ortognatica. Nasce dall'esigenza clinica di avere uno strumento accessibile, modulare e trasparente, sviluppato da chirurghi per chirurghi.

## ✨ Funzionalità (Roadmap)

- 📂 **DICOM Viewer** — Importazione e visualizzazione CBCT (MPR + 3D)
- 🦷 **STL Manager** — Gestione scansioni intraorali
- ✂️ **Segmentazione** — Isolamento mascella, mandibola, denti
# OrthoPlanner

OrthoPlanner is an open-source application for preoperative orthognathic (jaw) surgery planning. It provides a modular interface to import medical images (DICOM), perform segmentation, and generate 3D models for visualization and planning.

This repository contains the Phase 0 implementation with a DICOM import wizard, a basic segmentation pipeline, and 3D viewport integration using Three.js and React.

## Highlights (Phase 0)

- DICOM import wizard: load DICOM series from local files and inspect basic metadata.
- Volume construction: stack 2D DICOM slices into a 3D voxel volume with spacing and origin.
- Threshold segmentation: simple threshold-based segmentation and a Marching Cubes mesh extractor.
- 3D viewport: interactive visualization with orbit controls, grid, and anatomy axes using `@react-three/fiber` and `three`.

## Quick start (developer)

1. Install dependencies:

```bash
npm install
```

2. Start the renderer + electron (development):

```bash
npm run dev
```

3. In the app UI: open the `DICOM` module, select `.dcm` files, click `Load`, adjust threshold and `Segment` to generate a 3D mesh.

## Project Structure

- `src/core/dicom-engine` — DICOM parsing and volume construction.
- `src/core/mesh-engine` — Mesh extraction (Marching Cubes) and helpers.
- `src/core/scene-manager` — Three.js viewport and scene composition.
- `src/ui` — React UI components including the `DICOMWizard`.
- `src/store` — Global state (Zustand) for volumes and meshes.
- `docs/` — Additional documentation (architecture, developer guide, DICOM wizard usage).

## Next steps (recommended)

- Improve segmentation via `itk-wasm` and GPU-accelerated steps.
- Refine Marching Cubes performance (indexed vertex deduplication, spatial decimation).
- Multi-series handling, registration between STL and CBCT, measurement/annotation tools.

For more details see the `docs/` folder.

## 🏗️ Architettura

OrthoPlanner utilizza un'architettura **core + plugin**:
- **Plugin**: moduli specialistici che si agganciano al core via Plugin API

Questo permette alla community di estendere il software con nuovi moduli (es. pianificazione impianti, distrazioni, analisi vie aeree).

## 🛠️ Tech Stack
- **WebAssembly** — Operazioni computazionalmente intensive

## 🚀 Quick Start

### Prerequisiti
- [Python](https://python.org) 3.12+

### Installazione

```bash
git clone https://github.com/YOUR_USERNAME/orthoplanner.git
cd orthoplanner
npm install
npm run dev
```

L'applicazione si aprirà come finestra Electron con il viewport 3D.

## 📋 Stato del Progetto

🟡 **Fase 0 — Setup Progetto** (in corso)

Il progetto è nelle prime fasi di sviluppo. Contributi, feedback e suggerimenti sono benvenuti!

## 📄 Licenza

[Apache License 2.0](LICENSE) — Libero per uso personale e commerciale, con protezione brevetti.

## 🤝 Come Contribuire

Le contribuzioni sono benvenute! Consulta la guida [CONTRIBUTING.md](docs/CONTRIBUTING.md) per iniziare.
---

*Sviluppato con ❤️ dalla community CMF (cranio-maxillo-facciale)*
