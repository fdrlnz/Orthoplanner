import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';
import DICOMWizard from '../../ui/DICOMWizard';
import { useAppStore } from '../../store/appStore';

// ═══════════════════════════════════════════
// Viewport 3D - Il cuore visivo di OrthoPlanner
// ═══════════════════════════════════════════

/**
 * Assi di riferimento anatomici
 * Mostra X (rosso/laterale), Y (verde/verticale), Z (blu/antero-posteriore)
 */
function AnatomicalAxes() {
  return (
    <group>
      {/* Asse X - Laterale (Rosso) */}
      <mesh position={[1.5, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 3, 8]} />
        <meshStandardMaterial color="#ef5350" />
      </mesh>
      {/* Asse Y - Verticale (Verde) */}
      <mesh position={[0, 1.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 3, 8]} />
        <meshStandardMaterial color="#66bb6a" />
      </mesh>
      {/* Asse Z - Antero-Posteriore (Blu) */}
      <mesh position={[0, 0, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 3, 8]} />
        <meshStandardMaterial color="#42a5f5" />
      </mesh>
      
      {/* Etichette assi */}
      <Html position={[3.2, 0, 0]} center><span style={{ color: '#ef5350', fontSize: '12px', fontWeight: 'bold' }}>X (Lat)</span></Html>
      <Html position={[0, 3.2, 0]} center><span style={{ color: '#66bb6a', fontSize: '12px', fontWeight: 'bold' }}>Y (Vert)</span></Html>
      <Html position={[0, 0, 3.2]} center><span style={{ color: '#42a5f5', fontSize: '12px', fontWeight: 'bold' }}>Z (AP)</span></Html>
    </group>
  );
}

/**
 * Modello demo: forma che ricorda un cranio stilizzato
 * Serve solo per verificare che il rendering 3D funzioni
 * Verrà sostituito con mesh reali dai DICOM
 */
function DemoSkull() {
  const groupRef = useRef<THREE.Group>(null);

  // Rotazione lenta per mostrare che il 3D è interattivo
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.5, 0]}>
      {/* Cranio (sfera schiacciata) */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color="#e8d5b7"
          roughness={0.7}
          metalness={0.1}
          wireframe={false}
        />
      </mesh>

      {/* Mascella superiore */}
      <mesh position={[0, 0.1, 0.6]}>
        <boxGeometry args={[1.2, 0.4, 0.8]} />
        <meshStandardMaterial
          color="#d4c5a0"
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>

      {/* Mandibola - parte che verrà "tagliata" nelle osteotomie */}
      <mesh position={[0, -0.4, 0.5]}>
        <boxGeometry args={[1.4, 0.5, 0.7]} />
        <meshStandardMaterial
          color="#c9b896"
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>

      {/* Indicatore: linea Le Fort I */}
      <mesh position={[0, 0.3, 1.05]}>
        <boxGeometry args={[1.3, 0.02, 0.02]} />
        <meshStandardMaterial color="#4fc3f7" emissive="#4fc3f7" emissiveIntensity={0.5} />
      </mesh>

      {/* Indicatore: linea BSSO bilaterale */}
      <mesh position={[-0.5, -0.2, 0.85]}>
        <boxGeometry args={[0.02, 0.6, 0.02]} />
        <meshStandardMaterial color="#ffa726" emissive="#ffa726" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.5, -0.2, 0.85]}>
        <boxGeometry args={[0.02, 0.6, 0.02]} />
        <meshStandardMaterial color="#ffa726" emissive="#ffa726" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

/**
 * Scene content that conditionally renders demo or loaded mesh
 */
function SceneContent({ activeModule }: { activeModule: string | null }) {
  const currentMesh = useAppStore((state) => state.currentMesh);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (groupRef.current && currentMesh) {
      // Clear existing children
      groupRef.current.clear();
      // Add the loaded mesh
      groupRef.current.add(currentMesh);
    }
  }, [currentMesh]);

  return (
    <group ref={groupRef}>
      {!currentMesh && <DemoSkull />}
    </group>
  );
}

/**
 * Componente Viewport3D principale
 * Contiene la scena Three.js con camera, luci, griglia e modello demo
 */
interface Viewport3DProps {
  activeModule: string | null;
}

function Viewport3D({ activeModule }: Viewport3DProps) {
  return (
    <>
      <Canvas
        camera={{
          position: [4, 3, 6],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Sfondo scuro */}
        <color attach="background" args={['#0a0a1a']} />

        {/* Illuminazione */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={0.8} castShadow />
        <directionalLight position={[-3, 4, -2]} intensity={0.3} />
        <pointLight position={[0, 2, 4]} intensity={0.4} color="#4fc3f7" />

        {/* Griglia di riferimento */}
        <Grid
          infiniteGrid
          cellSize={1}
          sectionSize={5}
          cellColor="#1a1a3e"
          sectionColor="#2a2a5e"
          fadeDistance={30}
          fadeStrength={1}
          position={[0, -1, 0]}
        />

        {/* Assi anatomici */}
        <AnatomicalAxes />

        {/* Scene content (demo skull or loaded mesh) */}
        <SceneContent activeModule={activeModule} />

        {/* Controlli orbita (ruota, zoom, pan con il mouse) */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={2}
          maxDistance={50}
          target={[0, 0.5, 0]}
        />
      </Canvas>

      {/* Overlay di benvenuto se nessun modulo attivo */}
      {activeModule === 'dicom' && <DICOMWizard />}

      {!activeModule && (
        <div className="welcome-overlay">
          <div className="welcome-text">
            <h2>⚕ OrthoPlanner</h2>
            <p>Seleziona un modulo dalla sidebar per iniziare</p>
            <p style={{ marginTop: '8px', fontSize: '12px', opacity: 0.6 }}>
              Usa il mouse per ruotare (click sinistro), zoomare (scroll) e spostare (click destro)
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Viewport3D;
