import * as THREE from "three";

// Shared surface-detail helpers for the canvas objects.
//
// Both the tarot cards and the sketchbook were plain colour maps on
// MeshStandardMaterial, which makes them read as flat printed blocks: light
// lands evenly and the silhouette is the only 3D cue. These build normal +
// roughness maps from the same procedural noise so the surfaces catch light
// unevenly — paper tooth, card-stock grain, leather pebbling.

const MAP_SIZE = 512;

/** Deterministic value-noise sampler — same seed always yields the same surface. */
function makeNoise(seed: number) {
  let s = seed >>> 0;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };

  const G = 256;
  const grid = new Float32Array(G * G);
  for (let i = 0; i < grid.length; i++) grid[i] = rand();

  const at = (x: number, y: number) => {
    const xi = ((x % G) + G) % G;
    const yi = ((y % G) + G) % G;
    return grid[yi * G + xi];
  };

  // Smoothstep-interpolated bilinear sample
  return (x: number, y: number) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    const u = xf * xf * (3 - 2 * xf);
    const v = yf * yf * (3 - 2 * yf);

    const a = at(xi, yi);
    const b = at(xi + 1, yi);
    const c = at(xi, yi + 1);
    const d = at(xi + 1, yi + 1);

    return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
  };
}

/** Sum several octaves of value noise into a height field in [0,1]. */
function fbm(
  noise: (x: number, y: number) => number,
  x: number,
  y: number,
  octaves: number,
  lacunarity = 2,
  gain = 0.5,
) {
  let amp = 1;
  let freq = 1;
  let sum = 0;
  let norm = 0;
  for (let o = 0; o < octaves; o++) {
    sum += noise(x * freq, y * freq) * amp;
    norm += amp;
    amp *= gain;
    freq *= lacunarity;
  }
  return sum / norm;
}

export type SurfaceKind = "paper" | "cardstock" | "leather";

type SurfaceConfig = {
  /** Noise cells across the map — higher is finer grain. */
  scale: number;
  octaves: number;
  /** How strongly the height field perturbs the normal. */
  bump: number;
  /** Roughness range the height field maps into. */
  roughMin: number;
  roughMax: number;
  /** Optional directional fibre streaking, 0 = none. */
  fibre: number;
};

const SURFACES: Record<SurfaceKind, SurfaceConfig> = {
  // Soft, fibrous, quite matte — sketchbook pages. Finer and deeper than the
  // first pass: at the size the book renders, coarse paper noise averaged out
  // to flat grey rather than reading as tooth.
  paper: { scale: 96, octaves: 4, bump: 3.4, roughMin: 0.72, roughMax: 0.96, fibre: 0.45 },
  // Smoother and slightly glossier — printed tarot card faces
  cardstock: { scale: 58, octaves: 3, bump: 1.5, roughMin: 0.42, roughMax: 0.68, fibre: 0.18 },
  // Pebbled book-cloth grain. Kept fine and shallow — coarse, deep noise here
  // reads as slate or stucco instead of a bound cover.
  leather: { scale: 64, octaves: 4, bump: 1.9, roughMin: 0.58, roughMax: 0.86, fibre: 0.12 },
};

function heightField(kind: SurfaceKind, seed: number) {
  const cfg = SURFACES[kind];
  const noise = makeNoise(seed);
  const h = new Float32Array(MAP_SIZE * MAP_SIZE);

  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      const nx = (x / MAP_SIZE) * cfg.scale;
      const ny = (y / MAP_SIZE) * cfg.scale;
      let v = fbm(noise, nx, ny, cfg.octaves);

      // Stretched noise along X reads as fibre/grain direction
      if (cfg.fibre > 0) {
        v = v * (1 - cfg.fibre) + fbm(noise, nx * 0.25, ny * 3.5, 2) * cfg.fibre;
      }
      h[y * MAP_SIZE + x] = v;
    }
  }
  return { h, cfg };
}

function toTexture(data: Uint8Array) {
  const tex = new THREE.DataTexture(data, MAP_SIZE, MAP_SIZE, THREE.RGBAFormat);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Build a normal map and a roughness map that share one height field, so the
 * bumps and the shine variation line up instead of fighting each other.
 * Both are tileable and colour-space neutral (non-colour data).
 */
export function makeSurfaceMaps(kind: SurfaceKind, seed = 1) {
  const { h, cfg } = heightField(kind, seed);
  const normal = new Uint8Array(MAP_SIZE * MAP_SIZE * 4);
  const rough = new Uint8Array(MAP_SIZE * MAP_SIZE * 4);

  const sample = (x: number, y: number) =>
    h[(((y % MAP_SIZE) + MAP_SIZE) % MAP_SIZE) * MAP_SIZE + (((x % MAP_SIZE) + MAP_SIZE) % MAP_SIZE)];

  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      const i = (y * MAP_SIZE + x) * 4;

      // Central-difference slopes → tangent-space normal
      const dx = (sample(x + 1, y) - sample(x - 1, y)) * cfg.bump;
      const dy = (sample(x, y + 1) - sample(x, y - 1)) * cfg.bump;
      const len = Math.hypot(dx, dy, 1);
      normal[i] = ((-dx / len) * 0.5 + 0.5) * 255;
      normal[i + 1] = ((-dy / len) * 0.5 + 0.5) * 255;
      normal[i + 2] = (1 / len) * 0.5 * 255 + 127;
      normal[i + 3] = 255;

      // Peaks buff smoother, valleys stay matte
      const v = sample(x, y);
      const r = (cfg.roughMin + (cfg.roughMax - cfg.roughMin) * (1 - v)) * 255;
      rough[i] = r;
      rough[i + 1] = r;
      rough[i + 2] = r;
      rough[i + 3] = 255;
    }
  }

  return { normalMap: toTexture(normal), roughnessMap: toTexture(rough) };
}
