import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import { motion, useAnimationControls } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';

// --- Inner scene component: useFrame must run INSIDE <Canvas> ---
const BlackHoleScene: React.FC<{
  cursorRef: React.MutableRefObject<{ x: number; y: number }>;
  blackHoleCoreRef: React.RefObject<THREE.Mesh | null>;
  accretionDiskRef: React.RefObject<THREE.Group | null>;
  particlesRef: React.RefObject<THREE.Points | null>;
}> = ({ cursorRef, blackHoleCoreRef, accretionDiskRef, particlesRef }) => {
  const clock = useRef(new THREE.Clock());

  const orbitPositions = useMemo(() => {
    const arr = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      const radius = 2 + Math.random() * 3;
      const angle = Math.random() * Math.PI * 2;
      arr[i * 3] = radius * Math.cos(angle);
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      arr[i * 3 + 2] = radius * Math.sin(angle);
    }
    return arr;
  }, []);

  const starPositions = useMemo(() => {
    const arr = new Float32Array(8000 * 3);
    for (let i = 0; i < 8000 * 3; i++) {
      arr[i] = (Math.random() - 0.5) * 30;
    }
    return arr;
  }, []);

  useFrame(() => {
    const elapsed = clock.current.getElapsedTime();
    const cursor = cursorRef.current;

    if (blackHoleCoreRef.current) {
      blackHoleCoreRef.current.rotation.y = elapsed * 0.1;
      blackHoleCoreRef.current.rotation.x = cursor.y * 0.1;
      blackHoleCoreRef.current.rotation.z = cursor.x * 0.1;
    }

    if (accretionDiskRef.current) {
      accretionDiskRef.current.rotation.z = elapsed * 0.2;
      accretionDiskRef.current.rotation.x = cursor.y * 0.05;
    }

    if (particlesRef.current?.geometry) {
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        const time = elapsed * 0.5 + i * 0.1;
        const radius = 1.5 + Math.sin(time) * 0.5;
        positions[i] = Math.cos(time) * radius;
        positions[i + 1] = Math.sin(time * 0.7) * 0.3;
        positions[i + 2] = Math.sin(time) * radius;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 5]} intensity={2} color="#00ffff" decay={2} />

      <mesh ref={blackHoleCoreRef}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color="#000000"
          roughness={0.05}
          metalness={0.95}
          emissive="#000000"
          emissiveIntensity={0.3}
        />
      </mesh>

      <group ref={accretionDiskRef} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <torusGeometry args={[1.5, 0.2, 16, 100]} />
          <meshStandardMaterial
            color="#ff00ff"
            roughness={0.2}
            metalness={0.9}
            emissive="#ff00ff"
            emissiveIntensity={3}
            transparent
            opacity={0.7}
          />
        </mesh>
      </group>

      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[orbitPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial color="#ffffff" size={0.015} transparent opacity={0.5} sizeAttenuation />
      </points>

      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[starPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial color="#ffffff" size={0.008} transparent opacity={0.2} />
      </points>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.1}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
};

const LoginPage: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const cursorRef = useRef({ x: 0, y: 0 });

  const blackHoleCoreRef = useRef<THREE.Mesh>(null);
  const accretionDiskRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  useAnimationControls();

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      cursorRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      cursorRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleEnterClick = () => {
    setIsButtonPressed(true);

    setTimeout(() => {
      setIsButtonPressed(false);

      const core = blackHoleCoreRef.current;
      const disk = accretionDiskRef.current;
      if (!core || !disk) {
        onEnter();
        return;
      }

      const timeline = gsap.timeline({
        onComplete: () => setIsExiting(true),
      });

      timeline
        .to(core.scale, { x: 3, y: 3, z: 3, duration: 1.5, ease: 'power4.out' }, 'start')
        .to(
          core.material as THREE.MeshStandardMaterial,
          { emissiveIntensity: 2, duration: 1.5 },
          'start'
        )
        .to(disk.rotation, { z: '+=' + Math.PI * 4, duration: 2, ease: 'power2.out' }, 'start')
        .to({}, { duration: 1, onComplete: () => onEnter() }, 'start+=2');
    }, 150);
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <Canvas
        style={{ position: 'absolute', inset: 0 }}
        camera={{ position: [0, 0, 8], fov: 60 }}
      >
        <BlackHoleScene
          cursorRef={cursorRef}
          blackHoleCoreRef={blackHoleCoreRef}
          accretionDiskRef={accretionDiskRef}
          particlesRef={particlesRef}
        />
      </Canvas>

      <motion.div
        className="flex flex-col items-center gap-8 text-center text-white"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 1, ease: 'easeOut' } }}
        exit={{ y: -20, opacity: 0, transition: { duration: 1, ease: 'easeIn' } }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#ff00ff] to-[#00ffff]">
          ENTER VIJESH'S PORTFOLIO
        </h1>
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseLeave={() => setIsButtonPressed(false)}
            onClick={handleEnterClick}
            className="px-8 py-4 bg-gradient-to-r from-[#ff00ff] to-[#00ffff] bg-clip-text text-transparent font-bold rounded-lg backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all duration-300 relative overflow-hidden"
          >
            {isButtonPressed ? 'ENTERING...' : 'ENTER'}
            <span className="absolute inset-0 bg-gradient-to-r from-[#ff00ff] to-[#00ffff] opacity-0 hover:opacity-20 transition-opacity duration-300" />
          </motion.button>
          <p className="text-sm text-white/60">or continue to portfolio</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoginPage;