import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, type RefObject } from 'react';
import * as THREE from 'three';

type SceneProps = {
  /** 0 = idle, 1 = fully warped into the hole. Driven by the intro timeline. */
  warpRef: RefObject<number>;
  /** Cursor multiplier that intensifies during the warp. */
  boostRef: RefObject<number>;
};

const STAR_COUNT_DESKTOP = 2600;
const STAR_COUNT_MOBILE = 900;

function isCoarsePointer() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
}

function makeGlowTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255, 236, 200, 0.9)');
  gradient.addColorStop(0.25, 'rgba(244, 182, 74, 0.45)');
  gradient.addColorStop(0.6, 'rgba(110, 231, 183, 0.10)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

function Stars({ warpRef, boostRef }: SceneProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = isCoarsePointer() ? STAR_COUNT_MOBILE : STAR_COUNT_DESKTOP;
  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      array[i * 3] = (Math.random() - 0.5) * 90;
      array[i * 3 + 1] = (Math.random() - 0.5) * 60;
      array[i * 3 + 2] = -70 + Math.random() * 76;
    }
    return array;
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const warp = warpRef.current ?? 0;
    const speed = (0.6 + warp * 150) * Math.min(delta, 0.05);
    const array = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 2; i < array.length; i += 3) {
      array[i] += speed;
      if (array[i] > 8) array[i] = -70;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    const material = pointsRef.current.material as THREE.PointsMaterial;
    material.size = 0.14 + warp * 0.24;
    pointsRef.current.rotation.y += delta * 0.006 * (boostRef.current ?? 1);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#dfe9ff" size={0.14} sizeAttenuation transparent opacity={0.85} depthWrite={false} />
    </points>
  );
}

function AccretionDisk({ warpRef, boostRef }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const count = isCoarsePointer() ? 380 : 850;

  const orbit = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const meta: { radius: number; angle: number; speed: number; y: number }[] = [];
    for (let i = 0; i < count; i += 1) {
      const radius = 2.3 + Math.random() * 3.4;
      const angle = Math.random() * Math.PI * 2;
      meta.push({ radius, angle, speed: 0.16 + Math.random() * 0.3, y: (Math.random() - 0.5) * 0.22 });
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = meta[i].y;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return { positions, meta };
  }, [count]);

  useFrame((_, delta) => {
    const warp = warpRef.current ?? 0;
    const boost = boostRef.current ?? 1;
    const d = Math.min(delta, 0.05);
    if (groupRef.current) groupRef.current.rotation.y += d * (0.22 + warp * 5.5) * boost;
    if (particlesRef.current) {
      const array = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const spin = d * (1 + warp * 9) * boost;
      for (let i = 0; i < orbit.meta.length; i += 1) {
        const node = orbit.meta[i];
        node.angle += spin * node.speed * (1 + (6 - node.radius) * 0.14);
        array[i * 3] = Math.cos(node.angle) * node.radius;
        array[i * 3 + 2] = Math.sin(node.angle) * node.radius;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group rotation={[Math.PI / 2 - 0.42, 0, 0]}>
      <group ref={groupRef}>
        <mesh>
          <torusGeometry args={[2.35, 0.34, 16, 128]} />
          <meshBasicMaterial color="#f4b64a" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <mesh>
          <torusGeometry args={[3.3, 0.24, 12, 128]} />
          <meshBasicMaterial color="#ff9d5c" transparent opacity={0.28} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <mesh>
          <torusGeometry args={[4.6, 0.3, 10, 128]} />
          <meshBasicMaterial color="#6ee7b7" transparent opacity={0.14} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[orbit.positions, 3]} />
          </bufferGeometry>
          <pointsMaterial color="#ffe9c4" size={0.05} sizeAttenuation transparent opacity={0.9} depthWrite={false} />
        </points>
      </group>
    </group>
  );
}

function Singularity({ warpRef }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const glowTexture = useMemo(() => makeGlowTexture(), []);
  useEffect(() => () => glowTexture.dispose(), [glowTexture]);

  useFrame(({ camera }, delta) => {
    if (!groupRef.current) return;
    const warp = warpRef.current ?? 0;
    const target = 1 + warp * warp * 2.4;
    const scale = THREE.MathUtils.lerp(groupRef.current.scale.x, target, Math.min(1, delta * 6));
    groupRef.current.scale.setScalar(scale);
    groupRef.current.quaternion.copy(camera.quaternion);
  });

  return (
    <group ref={groupRef}>
      <sprite scale={[16, 16, 1]}>
        <spriteMaterial map={glowTexture} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.85} />
      </sprite>
      <mesh>
        <sphereGeometry args={[1.5, 48, 48]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.62, 48, 48]} />
        <meshBasicMaterial color="#ffd9a0" transparent opacity={0.32} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

function CameraRig({ warpRef, boostRef }: SceneProps) {
  useFrame(({ camera, pointer }, delta) => {
    const warp = warpRef.current ?? 0;
    const boost = boostRef.current ?? 1;
    const ease = Math.min(1, delta * 3);
    const targetZ = 8.4 - warp * 7;
    camera.position.z += (targetZ - camera.position.z) * ease;
    camera.position.x += (pointer.x * 0.7 * boost - camera.position.x) * ease;
    camera.position.y += (pointer.y * 0.45 * boost - camera.position.y) * ease;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function Scene(props: SceneProps) {
  return (
    <>
      <color attach="background" args={['#04060a']} />
      <CameraRig {...props} />
      <Stars {...props} />
      <Singularity {...props} />
      <AccretionDisk {...props} />
    </>
  );
}

function CssFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#04060a]" aria-hidden="true">
      <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(244,182,74,0.35)_0%,rgba(110,231,183,0.10)_45%,transparent_70%)]" />
      <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black ring-1 ring-[rgba(255,217,160,0.35)]" />
    </div>
  );
}

/** Full-screen black-hole scene. Falls back to a static CSS scene without WebGL. */
export default function BlackHoleScene(props: SceneProps) {
  const supported = useMemo(() => {
    if (typeof window === 'undefined') return false;
    try {
      const canvas = document.createElement('canvas');
      return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
    } catch {
      return false;
    }
  }, []);

  if (!supported) return <CssFallback />;

  return (
    <Canvas
      className="absolute inset-0"
      dpr={[1, isCoarsePointer() ? 1.4 : 1.75]}
      camera={{ position: [0, 0, 8.4], fov: 55 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <Scene {...props} />
    </Canvas>
  );
}
