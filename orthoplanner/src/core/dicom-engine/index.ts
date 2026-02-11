/**
 * DICOM Engine - Core Module for OrthoPlanner
 * Handles DICOM file parsing, volume building, and metadata extraction
 */

import * as dcmjs from 'dcmjs';

/** Represents a single DICOM instance */
export interface DICOMInstance {
  sopInstanceUID: string;
  seriesInstanceUID: string;
  studyInstanceUID: string;
  patientName?: string;
  sliceLocation?: number;
  sliceThickness?: number;
  pixelSpacing?: [number, number];
  imagePositionPatient?: [number, number, number];
  rows: number;
  columns: number;
  pixelData: Uint16Array | Uint8Array;
}

/** Represents a DICOM series (collection of 2D slices) */
export interface DICOMSeries {
  seriesInstanceUID: string;
  seriesNumber?: number;
  modality?: string;
  instances: DICOMInstance[];
  sortedByLocation: boolean;
}

/** Represents a 3D volume extracted from a DICOM series */
export interface Volume3D {
  data: Uint16Array | Uint8Array;
  dimensions: [number, number, number]; // [width, height, depth]
  spacing: [number, number, number]; // [x, y, z] spacing in mm
  origin: [number, number, number]; // [x, y, z] origin in mm
  dataType: 'uint8' | 'uint16';
}

/**
 * Parse a single DICOM file (ArrayBuffer) into a DICOMInstance
 */
export function parseDICOMFile(arrayBuffer: ArrayBuffer, fileName: string): DICOMInstance | null {
  try {
    const dicomData = dcmjs.data.DicomMessage.readFile(new Uint8Array(arrayBuffer));
    const dataset = dcmjs.data.DicomMetaDictionary.naturalizeDataset(dicomData.dict);

    const sopInstanceUID = dataset.SOPInstanceUID || fileName;
    const seriesInstanceUID = dataset.SeriesInstanceUID || 'default';
    const studyInstanceUID = dataset.StudyInstanceUID || 'default';
    const patientName = dataset.PatientName?.Alphabetic || undefined;
    const sliceLocation = dataset.SliceLocation ? parseFloat(dataset.SliceLocation) : undefined;
    const sliceThickness = dataset.SliceThickness ? parseFloat(dataset.SliceThickness) : undefined;

    // Extract pixel spacing (in-plane resolution)
    let pixelSpacing: [number, number] = [1, 1];
    if (dataset.PixelSpacing) {
      const ps = Array.isArray(dataset.PixelSpacing)
        ? dataset.PixelSpacing
        : [dataset.PixelSpacing];
      pixelSpacing = [parseFloat(ps[0]) || 1, parseFloat(ps[1]) || 1];
    }

    // Extract image position (origin of the slice in 3D space)
    let imagePositionPatient: [number, number, number] = [0, 0, 0];
    if (dataset.ImagePositionPatient) {
      const ipp = Array.isArray(dataset.ImagePositionPatient)
        ? dataset.ImagePositionPatient
        : [dataset.ImagePositionPatient];
      imagePositionPatient = [
        parseFloat(ipp[0]) || 0,
        parseFloat(ipp[1]) || 0,
        parseFloat(ipp[2]) || 0,
      ];
    }

    const rows = parseInt(dataset.Rows) || 512;
    const columns = parseInt(dataset.Columns) || 512;

    // Extract pixel data
    let pixelData = dataset.PixelData;
    if (!pixelData) {
      console.warn(`No PixelData in file ${fileName}`);
      return null;
    }

    // Convert to typed array if needed
    if (!(pixelData instanceof Uint16Array || pixelData instanceof Uint8Array)) {
      const bitsAllocated = parseInt(dataset.BitsAllocated) || 16;
      pixelData =
        bitsAllocated === 16
          ? new Uint16Array(pixelData)
          : new Uint8Array(pixelData);
    }

    return {
      sopInstanceUID,
      seriesInstanceUID,
      studyInstanceUID,
      patientName,
      sliceLocation,
      sliceThickness,
      pixelSpacing,
      imagePositionPatient,
      rows,
      columns,
      pixelData,
    };
  } catch (error) {
    console.error(`Error parsing DICOM file ${fileName}:`, error);
    return null;
  }
}

/**
 * Load and parse multiple DICOM files from a FileList
 */
export async function loadDICOMFiles(files: FileList): Promise<DICOMInstance[]> {
  const instances: DICOMInstance[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      const arrayBuffer = await file.arrayBuffer();
      const instance = parseDICOMFile(arrayBuffer, file.name);
      if (instance) {
        instances.push(instance);
      }
    } catch (error) {
      console.error(`Error loading file ${file.name}:`, error);
    }
  }

  return instances;
}

/**
 * Group DICOM instances by SeriesInstanceUID
 */
export function groupBySeries(instances: DICOMInstance[]): DICOMSeries[] {
  const seriesMap = new Map<string, DICOMSeries>();

  for (const instance of instances) {
    if (!seriesMap.has(instance.seriesInstanceUID)) {
      seriesMap.set(instance.seriesInstanceUID, {
        seriesInstanceUID: instance.seriesInstanceUID,
        instances: [],
        sortedByLocation: false,
      });
    }
    seriesMap.get(instance.seriesInstanceUID)!.instances.push(instance);
  }

  // Sort instances by slice location within each series
  for (const series of seriesMap.values()) {
    const hasLocations = series.instances.every((inst) => inst.sliceLocation !== undefined);
    if (hasLocations) {
      series.instances.sort((a, b) => (a.sliceLocation || 0) - (b.sliceLocation || 0));
      series.sortedByLocation = true;
    }
  }

  return Array.from(seriesMap.values());
}

/**
 * Convert a DICOM series into a 3D volume
 * Stacks 2D slices along the Z-axis
 */
export function seriesToVolume(series: DICOMSeries): Volume3D {
  const { instances } = series;
  if (instances.length === 0) {
    throw new Error('Cannot create volume from empty series');
  }

  const firstInstance = instances[0];
  const width = firstInstance.columns;
  const height = firstInstance.rows;
  const depth = instances.length;

  // Determine if data is uint8 or uint16
  const isUint16 = firstInstance.pixelData instanceof Uint16Array;
  const totalVoxels = width * height * depth;
  const volumeData = isUint16 ? new Uint16Array(totalVoxels) : new Uint8Array(totalVoxels);

  // Stack slices
  for (let z = 0; z < depth; z++) {
    const instance = instances[z];
    const sliceData = instance.pixelData;
    const offset = z * width * height;
    volumeData.set(sliceData, offset);
  }

  // Compute spacing and origin
  const pixelSpacing = firstInstance.pixelSpacing || [1, 1];
  const sliceThickness = firstInstance.sliceThickness || 1;
  const spacing: [number, number, number] = [pixelSpacing[0], pixelSpacing[1], sliceThickness];

  const origin = firstInstance.imagePositionPatient || [0, 0, 0];

  return {
    data: volumeData,
    dimensions: [width, height, depth],
    spacing,
    origin,
    dataType: isUint16 ? 'uint16' : 'uint8',
  };
}

/**
 * Main entry point: Load DICOM files and convert to 3D volume
 */
export async function importDICOMVolume(files: FileList): Promise<{
  volume: Volume3D;
  series: DICOMSeries;
  instances: DICOMInstance[];
}> {
  // Load and parse files
  const instances = await loadDICOMFiles(files);
  if (instances.length === 0) {
    throw new Error('No valid DICOM files found in selection');
  }

  // Group by series
  const seriesList = groupBySeries(instances);
  if (seriesList.length === 0) {
    throw new Error('No DICOM series found');
  }

  // Use the first (largest) series
  const series = seriesList.reduce((a, b) =>
    a.instances.length > b.instances.length ? a : b
  );

  // Create volume
  const volume = seriesToVolume(series);

  return { volume, series, instances };
}
