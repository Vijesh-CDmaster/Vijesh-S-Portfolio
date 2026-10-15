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

/** Radius (in world units) covered by the fiery swirl texture — plane half-size. */
const DISK_SPAN = 10;
/** Inner edge of the swirl, sitting just outside the event horizon (radius 1.5). */
const DISK_INNER = 1.52;

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

/** Brilliant lens-flare star that burns inside the event horizon. */
function makeStarburstTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const c = size / 2;

  // Hot core + halo.
  const halo = ctx.createRadialGradient(c, c, 0, c, c, c);
  halo.addColorStop(0, 'rgba(255,255,255,1)');
  halo.addColorStop(0.05, 'rgba(255,248,228,0.7)');
  halo.addColorStop(0.14, 'rgba(255,228,182,0.26)');
  halo.addColorStop(0.36, 'rgba(255,192,124,0.08)');
  halo.addColorStop(1, 'rgba(255,160,90,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, size, size);

  // Diffraction spikes — one long ray thrown to the lower left, like the flare.
  const spikes = [
    { a: Math.PI * 0.78, len: 0.46, w: 4.5, alpha: 1 },
    { a: 0, len: 0.34, w: 3, alpha: 0.85 },
    { a: Math.PI, len: 0.34, w: 3, alpha: 0.85 },
    { a: -Math.PI / 2, len: 0.3, w: 3, alpha: 0.8 },
    { a: Math.PI / 2, len: 0.3, w: 3, alpha: 0.8 },
    { a: -Math.PI / 4, len: 0.2, w: 2.4, alpha: 0.55 },
    { a: (Math.PI * 3) / 4, len: 0.2, w: 2.4, alpha: 0.55 },
    { a: Math.PI / 4, len: 0.18, w: 2.2, alpha: 0.5 },
    { a: (-Math.PI * 3) / 4, len: 0.18, w: 2.2, alpha: 0.5 },
  ];
  ctx.lineCap = 'round';
  for (const spike of spikes) {
    const x2 = c + Math.cos(spike.a) * spike.len * size;
    const y2 = c + Math.sin(spike.a) * spike.len * size;
    const gradient = ctx.createLinearGradient(c, c, x2, y2);
    gradient.addColorStop(0, `rgba(255,255,255,${spike.alpha})`);
    gradient.addColorStop(0.2, `rgba(255,246,224,${spike.alpha * 0.65})`);
    gradient.addColorStop(0.6, `rgba(255,226,178,${spike.alpha * 0.22})`);
    gradient.addColorStop(1, 'rgba(255,210,150,0)');
    ctx.strokeStyle = gradient;
    ctx.lineWidth = spike.w;
    ctx.beginPath();
    ctx.moveTo(c, c);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Thin anamorphic ray shot out of the flare across the swirl. */
function makeBeamTexture() {
  const w = 1024;
  const h = 128;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  const image = ctx.createImageData(w, h);
  const data = image.data;
  const cy = h / 2;
  for (let y = 0; y < h; y += 1) {
    const dy = (y - cy) / cy;
    for (let x = 0; x < w; x += 1) {
      const t = Math.abs((x - w / 2) / (w / 2));
      const along = Math.pow(Math.max(0, 1 - t), 2.6);
      const core = Math.exp(-(dy * dy) / 0.004);
      const glow = Math.exp(-(dy * dy) / 0.12) * 0.4;
      const a = Math.min(1, along * (core + glow) * 1.15);
      const i = (y * w + x) * 4;
      data[i] = 255;
      data[i + 1] = Math.round(250 - t * 58);
      data[i + 2] = Math.round(238 - t * 128);
      data[i + 3] = Math.round(a * 255);
    }
  }
  ctx.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Procedural Milky-Way style barred spiral that lives inside the event horizon. */
function makeGalaxyTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const c = size / 2;

  // Core + halo glow.
  const halo = ctx.createRadialGradient(c, c, 0, c, c, c);
  halo.addColorStop(0, 'rgba(255, 248, 232, 1)');
  halo.addColorStop(0.05, 'rgba(255, 226, 176, 0.7)');
  halo.addColorStop(0.15, 'rgba(198, 222, 255, 0.32)');
  halo.addColorStop(0.38, 'rgba(96, 150, 235, 0.16)');
  halo.addColorStop(0.72, 'rgba(40, 80, 160, 0.06)');
  halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, size, size);

  // Four spiral arms of stars, warm in the middle and blue at the rim.
  const arms = 4;
  const starCount = 7600;
  for (let i = 0; i < starCount; i += 1) {
    const t = Math.pow(Math.random(), 0.62); // radial distribution
    const arm = i % arms;
    const angle = (arm / arms) * Math.PI * 2 + t * 4.3 + (Math.random() - 0.5) * (0.22 + t * 0.55);
    const radius = (0.03 + t * 0.45) * size;
    const spread = 5 + t * 14;
    const x = c + Math.cos(angle) * radius + (Math.random() - 0.5) * spread;
    const y = c + Math.sin(angle) * radius * 0.86 + (Math.random() - 0.5) * spread;
    if (x < 0 || y < 0 || x >= size || y >= size) continue;

    const roll = Math.random();
    let rgb: string;
    if (t < 0.22) rgb = roll < 0.3 ? '255,214,150' : '255,240,216';
    else if (t < 0.6) rgb = roll < 0.18 ? '255,176,214' : roll < 0.6 ? '214,232,255' : '255,255,255';
    else rgb = roll < 0.45 ? '150,196,255' : roll < 0.8 ? '206,232,255' : '118,150,255';

    ctx.fillStyle = `rgba(${rgb},${((0.95 - t * 0.45) * (0.5 + Math.random() * 0.6)).toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(x, y, Math.random() * 1.7 + 0.35, 0, Math.PI * 2);
    ctx.fill();
  }

  // Warm nebula clouds close to the core.
  for (let i = 0; i < 14; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 0.14 * size;
    const x = c + Math.cos(angle) * radius;
    const y = c + Math.sin(angle) * radius * 0.86;
    const r = 14 + Math.random() * 26;
    const cloud = ctx.createRadialGradient(x, y, 0, x, y, r);
    cloud.addColorStop(0, 'rgba(255, 196, 140, 0.28)');
    cloud.addColorStop(1, 'rgba(255, 150, 120, 0)');
    ctx.fillStyle = cloud;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Fiery, turbulent accretion swirl that wraps the event horizon: seamless
 * polar fbm (wrapped angular lattice => no seam) sheared into logarithmic
 * spirals, hot at the inner edge and fading out into space.
 */
function makeDiskTexture() {
  const size = 768;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const image = ctx.createImageData(size, size);
  const data = image.data;
  const half = size / 2;

  const cells = 44; // angular lattice cells — integer keeps the swirl seamless
  const radialCells = 64;
  const swirl = 3.0; // how far the filaments wind over the radius of the disc

  const hash = (x: number, y: number) => {
    let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263)) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177) | 0;
    return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
  };
  const smooth = (t: number) => t * t * (3 - 2 * t);
  const noise = (u: number, v: number, period: number) => {
    const i0 = Math.floor(u);
    const j0 = Math.floor(v);
    const fu = smooth(u - i0);
    const fv = smooth(v - j0);
    const wrap = (i: number) => ((i % period) + period) % period;
    const a = hash(wrap(i0), j0);
    const b = hash(wrap(i0 + 1), j0);
    const c = hash(wrap(i0), j0 + 1);
    const d = hash(wrap(i0 + 1), j0 + 1);
    return (a + (b - a) * fu) * (1 - fv) + (c + (d - c) * fu) * fv;
  };
  const fbm = (u: number, v: number, period: number, octaves: number) => {
    let amp = 0.5;
    let sum = 0;
    let norm = 0;
    for (let o = 0; o < octaves; o += 1) {
      sum += noise(u, v, period) * amp;
      norm += amp;
      amp *= 0.5;
      u *= 2;
      v *= 2;
      period *= 2;
    }
    return sum / norm;
  };

  // dark ember → copper → orange → amber → white-hot
  const ramp: [number, [number, number, number]][] = [
    [0, [24, 6, 2]],
    [0.22, [120, 32, 8]],
    [0.45, [214, 96, 26]],
    [0.68, [255, 165, 74]],
    [0.85, [255, 214, 150]],
    [1, [255, 246, 232]],
  ];
  const colorAt = (t: number): [number, number, number] => {
    const clamped = Math.max(0, Math.min(1, t));
    for (let i = 1; i < ramp.length; i += 1) {
      if (clamped <= ramp[i][0]) {
        const [t0, c0] = ramp[i - 1];
        const [t1, c1] = ramp[i];
        const k = (clamped - t0) / (t1 - t0);
        return [c0[0] + (c1[0] - c0[0]) * k, c0[1] + (c1[1] - c0[1]) * k, c0[2] + (c1[2] - c0[2]) * k];
      }
    }
    return ramp[ramp.length - 1][1];
  };

  for (let y = 0; y < size; y += 1) {
    const dy = y - half;
    for (let x = 0; x < size; x += 1) {
      const dx = x - half;
      const r = Math.sqrt(dx * dx + dy * dy) / half;
      const theta = Math.atan2(dy, dx);
      const u =
        (theta / (Math.PI * 2) + 0.5) * cells +
        (swirl * Math.log(Math.max(r, 0.05)) * cells) / (Math.PI * 2);
      const n = fbm(u, r * radialCells, cells, 5);
      const radius = r * DISK_SPAN;
      const profile = Math.pow(Math.min(1, (DISK_INNER * 1.05) / Math.max(radius, DISK_INNER)), 1.2);
      const intensity = Math.min(1, profile * (0.1 + 1.5 * Math.pow(n, 1.7)));
      const [cr, cg, cb] = colorAt(intensity);
      const i = (y * size + x) * 4;
      data[i] = cr;
      data[i + 1] = cg;
      data[i + 2] = cb;
      data[i + 3] = Math.round(Math.min(1, intensity * 1.15) * 255);
    }
  }
  ctx.putImageData(image, 0, 0);

  // Glinting embers baked into the swirl so it sparkles as it turns.
  const speckCount = 240;
  for (let i = 0; i < speckCount; i += 1) {
    const a = Math.random() * Math.PI * 2;
    const rt = 0.2 + Math.pow(Math.random(), 1.6) * 0.72; // biased toward the hot inner edge
    const x = half + Math.cos(a) * rt * half;
    const y = half + Math.sin(a) * rt * half;
    const geoR = rt * DISK_SPAN;
    const profile = Math.pow(Math.min(1, (DISK_INNER * 1.05) / Math.max(geoR, DISK_INNER)), 1.2);
    const alpha = Math.max(0, Math.min(1, profile * (0.5 + Math.random() * 0.65)));
    if (alpha < 0.06) continue;
    const hot = Math.random();
    ctx.fillStyle = `rgba(255,${Math.round(212 + hot * 38)},${Math.round(164 + hot * 76)},${alpha.toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(x, y, 1 + Math.random() * 2.2, 0, Math.PI * 2);
    ctx.fill();
    if (hot > 0.86) {
      const len = 4 + Math.random() * 7;
      ctx.strokeStyle = `rgba(255,246,224,${(alpha * 0.7).toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - len, y);
      ctx.lineTo(x + len, y);
      ctx.moveTo(x, y - len);
      ctx.lineTo(x, y + len);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.center.set(0.5, 0.5);
  return texture;
}

/** Face-on swirling vortex around the hole: keeps the horizon clean while the
 *  outer part burns like an accretion flow, and it slowly rotates. */
function FieryDisk({ warpRef }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const texture = useMemo(() => makeDiskTexture(), []);
  useEffect(() => () => texture.dispose(), [texture]);

  useFrame(({ camera, clock }, delta) => {
    const warp = warpRef.current ?? 0;
    const d = Math.min(delta, 0.05);
    if (groupRef.current) groupRef.current.quaternion.copy(camera.quaternion);
    // The accretion flow turns over noticeably fast.
    texture.rotation -= d * (0.28 + warp * 1.8);
    if (materialRef.current) {
      materialRef.current.opacity = Math.min(1, 0.95 + Math.sin(clock.elapsedTime * 1.7) * 0.07 + warp * 0.08);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -0.35]} scale={[1, 0.9, 1]}>
      <mesh>
        <planeGeometry args={[DISK_SPAN * 2, DISK_SPAN * 2]} />
        <meshBasicMaterial
          ref={materialRef}
          map={texture}
          transparent
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

type SparkFieldProps = {
  warpRef: RefObject<number>;
  /** How many embers this layer draws. */
  count: number;
  /** Ribbon width at the head, world units. */
  width: number;
  /** Orbital speed multiplier — inner embers whip around fastest. */
  speed: number;
};

/** Cross-sections per spark ribbon: head → mid → tail. */
const SPARK_SECTIONS = 3;
/** How much travel (seconds) the tail stretches over. */
const SPARK_TRAIL = 0.32;

/**
 * Sparks thrown off the accretion flow, drawn as tapered ribbons that lie along
 * the orbit tangent — every spark reads as a streak following its trajectory
 * instead of a flat square sprite.
 */
function Sparks({ warpRef, count, width, speed }: SparkFieldProps) {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  const field = useMemo(() => {
    type Spark = { r0: number; r1: number; a: number; va: number; life: number; span: number; phase: number; tf: number; hot: number };
    const spawn = (life: number): Spark => {
      const r0 = DISK_INNER + 0.12 + Math.random() * 1.1;
      const reach = 2.2 + Math.random() * 4.4;
      const outward = Math.random() > 0.3;
      return {
        r0,
        r1: outward ? r0 + reach : Math.max(DISK_INNER + 0.1, r0 - reach * 0.5),
        a: Math.random() * Math.PI * 2,
        va: speed * (0.28 + 0.9 / r0),
        life,
        span: 3 + Math.random() * 6,
        phase: Math.random() * Math.PI * 2,
        tf: 3.5 + Math.random() * 7,
        hot: Math.random(),
      };
    };

    const perSpark = SPARK_SECTIONS * 2;
    const positions = new Float32Array(count * perSpark * 3);
    const colors = new Float32Array(count * perSpark * 3);
    const indices = new Uint16Array(count * (SPARK_SECTIONS - 1) * 6);
    let cursor = 0;
    for (let i = 0; i < count; i += 1) {
      const base = i * perSpark;
      for (let k = 0; k < SPARK_SECTIONS - 1; k += 1) {
        const v = base + k * 2;
        indices[cursor++] = v;
        indices[cursor++] = v + 1;
        indices[cursor++] = v + 2;
        indices[cursor++] = v + 2;
        indices[cursor++] = v + 1;
        indices[cursor++] = v + 3;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), DISK_SPAN * 2);

    const sparks: Spark[] = [];
    for (let i = 0; i < count; i += 1) sparks.push(spawn(Math.random())); // desynchronise on first paint
    return { sparks, spawn, positions, colors, geometry };
  }, [count, speed]);

  useEffect(() => () => field.geometry.dispose(), [field]);

  useFrame(({ camera }, delta) => {
    if (!groupRef.current) return;
    const d = Math.min(delta, 0.05);
    const warp = warpRef.current ?? 0;
    timeRef.current += d;
    const t = timeRef.current;
    const drive = 1 + warp * 4;
    groupRef.current.quaternion.copy(camera.quaternion);

    const pos = field.positions;
    const col = field.colors;
    const perSpark = SPARK_SECTIONS * 2;

    for (let i = 0; i < field.sparks.length; i += 1) {
      let s = field.sparks[i];
      s.life += (d / s.span) * drive;
      if (s.life >= 1) {
        s = field.spawn(0);
        field.sparks[i] = s;
      }
      s.a += s.va * d * drive;

      const r = s.r0 + (s.r1 - s.r0) * s.life;
      const drift = (s.r1 - s.r0) / s.span;
      const trailAngle = s.va * SPARK_TRAIL * drive;
      const trailRadius = drift * SPARK_TRAIL;
      const fade = Math.sin(Math.min(1, s.life) * Math.PI);
      const twinkle = 0.3 + 0.7 * Math.max(0, Math.sin(t * s.tf + s.phase));
      const b = fade * twinkle * (0.75 + warp * 0.6);
      const hot = s.hot * s.hot;
      const head = i * perSpark;

      for (let k = 0; k < SPARK_SECTIONS; k += 1) {
        const f = k / (SPARK_SECTIONS - 1); // 0 at the head, 1 at the tail
        const ang = s.a - trailAngle * f; // trailing behind along the orbit
        const rad = r - trailRadius * f;
        const cx = Math.cos(ang) * rad;
        const cy = Math.sin(ang) * rad;
        const tangentX = -Math.sin(ang); // orbit tangent (counter-clockwise)
        const tangentY = Math.cos(ang);
        const half = width * 0.5 * (1 - 0.75 * f);
        const offset = (head + k * 2) * 3;
        // width runs radially, so the ribbon lies along the trajectory
        pos[offset] = cx - tangentY * half;
        pos[offset + 1] = cy + tangentX * half;
        pos[offset + 2] = -0.3;
        pos[offset + 3] = cx + tangentY * half;
        pos[offset + 4] = cy - tangentX * half;
        pos[offset + 5] = -0.3;

        const kb = b * Math.pow(1 - f, 1.5);
        col[offset] = kb;
        col[offset + 1] = kb * (0.72 + 0.24 * hot);
        col[offset + 2] = kb * (0.38 + 0.5 * hot);
        col[offset + 3] = col[offset];
        col[offset + 4] = col[offset + 1];
        col[offset + 5] = col[offset + 2];
      }
    }

    field.geometry.attributes.position.needsUpdate = true;
    field.geometry.attributes.color.needsUpdate = true;
  });

  return (
    <group ref={groupRef} position={[0, 0, -0.3]}>
      <mesh geometry={field.geometry} frustumCulled={false}>
        <meshBasicMaterial
          vertexColors
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
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

function Singularity({ warpRef }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const glowTexture = useMemo(() => makeGlowTexture(), []);
  const galaxyTexture = useMemo(() => makeGalaxyTexture(), []);
  const burstTexture = useMemo(() => makeStarburstTexture(), []);
  const beamTexture = useMemo(() => makeBeamTexture(), []);
  const galaxyRef = useRef<THREE.SpriteMaterial>(null);
  const burstRef = useRef<THREE.SpriteMaterial>(null);
  const beamRef = useRef<THREE.SpriteMaterial>(null);
  useEffect(
    () => () => {
      glowTexture.dispose();
      galaxyTexture.dispose();
      burstTexture.dispose();
      beamTexture.dispose();
    },
    [glowTexture, galaxyTexture, burstTexture, beamTexture],
  );

  useFrame(({ camera, clock }, delta) => {
    if (!groupRef.current) return;
    const warp = warpRef.current ?? 0;
    const d = Math.min(delta, 0.05);
    const target = 1 + warp * warp * 2.4;
    const scale = THREE.MathUtils.lerp(groupRef.current.scale.x, target, Math.min(1, delta * 6));
    groupRef.current.scale.setScalar(scale);
    groupRef.current.quaternion.copy(camera.quaternion);
    const t = clock.elapsedTime;
    if (galaxyRef.current) {
      galaxyRef.current.rotation += d * 0.14 * (1 + warp * 8);
    }
    if (burstRef.current) {
      // The flare shimmers: slow wheel plus a hard twinkle.
      burstRef.current.rotation += d * 0.05;
      burstRef.current.opacity = 0.82 + Math.sin(t * 2.4) * 0.12 + Math.sin(t * 7.1) * 0.06;
    }
    if (beamRef.current) {
      beamRef.current.opacity = 0.38 + Math.sin(t * 1.9) * 0.1;
    }
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
        <sphereGeometry args={[1.55, 48, 48]} />
        <meshBasicMaterial color="#ffe9cc" transparent opacity={0.3} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.62, 48, 48]} />
        <meshBasicMaterial color="#ffd9a0" transparent opacity={0.32} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Milky Way suspended inside the event horizon, slowly turning. */}
      <sprite scale={[2.9, 2.9, 1]} renderOrder={3}>
        <spriteMaterial
          ref={galaxyRef}
          map={galaxyTexture}
          transparent
          opacity={0.95}
          depthTest={false}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
      {/* Spark: the blazing flare at the heart of the hole. */}
      <sprite scale={[3.8, 3.8, 1]} renderOrder={4}>
        <spriteMaterial
          ref={burstRef}
          map={burstTexture}
          transparent
          opacity={0.85}
          depthTest={false}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
      {/* Ray thrown out of the flare across the swirl. */}
      <sprite scale={[17, 1.4, 1]} renderOrder={4}>
        <spriteMaterial
          ref={beamRef}
          map={beamTexture}
          transparent
          opacity={0.38}
          rotation={-0.42}
          depthTest={false}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
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
      <FieryDisk {...props} />
      <Sparks warpRef={props.warpRef} count={isCoarsePointer() ? 90 : 210} width={0.075} speed={0.8} />
      <Sparks warpRef={props.warpRef} count={isCoarsePointer() ? 170 : 380} width={0.038} speed={1.3} />
      <Singularity {...props} />
    </>
  );
}

function CssFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#04060a]" aria-hidden="true">
      <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(244,182,74,0.35)_0%,rgba(110,231,183,0.10)_45%,transparent_70%)]" />
      <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black ring-1 ring-[rgba(255,217,160,0.35)]">
        <div className="absolute inset-1 rounded-full bg-[radial-gradient(circle,rgba(255,248,232,0.75)_0%,rgba(198,222,255,0.30)_35%,rgba(96,150,235,0.10)_65%,transparent_80%)]" />
      </div>
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
