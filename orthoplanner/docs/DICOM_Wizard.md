# DICOM Wizard — User Guide

This guide explains how to use the DICOM Import Wizard to create 3D models from DICOM series (CBCT/CT).

## Steps

1. Open the application and click the `DICOM` module in the toolbar.
2. In the DICOM Wizard panel, click the file selector and choose your `.dcm` files. You may select an entire series (multiple files).
3. Click `Load` to parse the selected files. The wizard will report how many slices were read and which series were detected.
4. Adjust the segmentation threshold using the slider. Lower values include more tissue; higher values include denser structures (bone).
5. Click `Segment` to run the extraction. The wizard will produce a mesh and add it to the 3D viewport.
6. Inspect the mesh in the viewport (rotate, pan, zoom). If the mesh is noisy, adjust the threshold and re-run.

## Notes and Limitations (Phase 0)

- Segmentation is a simple threshold-based approach and may not separate tissues reliably for all datasets.
- Mesh extraction uses Marching Cubes; for large volumes performance may be limited.
- Future versions will add advanced segmentation (`itk-wasm`), smoothing, and decimation options.

## Troubleshooting

- If no mesh appears, confirm that the `Load` step reported valid slices and that the threshold includes some voxels.
- For very large CBCT volumes, the browser may become slow—consider sampling or running segmentation on a worker.
