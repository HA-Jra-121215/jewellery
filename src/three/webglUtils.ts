import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { METAL_FINISHES } from '../data/catalog';
import { MetalFinishId } from '../types/jewellery';

export function detectSoftwareWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      (canvas.getContext('webgl2') as WebGL2RenderingContext | null) ||
      (canvas.getContext('webgl') as WebGLRenderingContext | null);
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    if (gl && 'getExtension' in gl) {
      (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context')?.loseContext();
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function createStudioEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  const envScene = new RoomEnvironment();
  const renderTarget = pmremGenerator.fromScene(envScene, 0.035);
  pmremGenerator.dispose();
  return renderTarget.texture;
}

export function createGoldMaterial(
  metalId: MetalFinishId,
  variant: 'polished' | 'satin' = 'polished',
): THREE.MeshPhysicalMaterial {
  const spec = METAL_FINISHES[metalId];
  const isSatin = variant === 'satin';
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(spec.pbrHex),
    metalness: spec.metalness,
    roughness: isSatin ? Math.min(spec.roughness + 0.24, 0.44) : spec.roughness,
    anisotropy: isSatin ? 0.85 : 0.45,
    anisotropyRotation: isSatin ? Math.PI * 0.25 : 0,
    clearcoat: isSatin ? 0.12 : 0.35,
    clearcoatRoughness: isSatin ? 0.28 : 0.08,
    envMapIntensity: 1.85,
  });
}

export function updateGoldMaterialColor(
  material: THREE.MeshPhysicalMaterial,
  metalId: MetalFinishId,
  variant: 'polished' | 'satin' = 'polished',
) {
  const spec = METAL_FINISHES[metalId];
  material.color.set(spec.pbrHex);
  material.metalness = spec.metalness;
  material.roughness =
    variant === 'satin' ? Math.min(spec.roughness + 0.24, 0.44) : spec.roughness;
  material.needsUpdate = true;
}

export function createDiamondMaterial(isSoftwareGl: boolean): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#ffffff'),
    metalness: 0.02,
    roughness: 0.02,
    ior: 2.417,
    reflectivity: 1.0,
    specularIntensity: 1.0,
    specularColor: new THREE.Color('#ffffff'),
    clearcoat: 1.0,
    clearcoatRoughness: 0.01,
    envMapIntensity: 3.4,
    transmission: isSoftwareGl ? 0 : 0.92,
    thickness: 1.4,
    attenuationDistance: 2.8,
    attenuationColor: new THREE.Color('#fbf8f3'),
    transparent: true,
    opacity: isSoftwareGl ? 0.88 : 1.0,
    flatShading: true,
  });
}

export function createPearlMaterial(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#f7efe0'),
    metalness: 0.06,
    roughness: 0.16,
    clearcoat: 0.95,
    clearcoatRoughness: 0.07,
    iridescence: 0.72,
    iridescenceIOR: 1.38,
    iridescenceThicknessRange: [140, 420],
    sheen: 0.4,
    sheenColor: new THREE.Color('#fff7eb'),
    envMapIntensity: 1.45,
  });
}

/**
 * Generates a faceted brilliant-cut diamond BufferGeometry with crisp flat facets:
 * table -> star/crown bezel ring -> upper girdle -> lower girdle -> pavilion -> culet.
 */
export function createBrilliantDiamondGeometry(
  radius = 0.42,
  totalHeight = 0.56,
  ovalRatioX = 1.0,
  ovalRatioZ = 1.0,
  segments = 16,
): THREE.BufferGeometry {
  const tableR = radius * 0.54;
  const starR = radius * 0.78;
  const girdleR = radius;
  const midPavR = radius * 0.52;

  const yTable = totalHeight * 0.32;
  const yStar = totalHeight * 0.21;
  const yGirdleTop = totalHeight * 0.04;
  const yGirdleBot = -totalHeight * 0.02;
  const yMidPav = -totalHeight * 0.34;
  const yCulet = -totalHeight * 0.68;

  const positions: number[] = [];

  const pushTri = (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3) => {
    positions.push(
      a.x * ovalRatioX,
      a.y,
      a.z * ovalRatioZ,
      b.x * ovalRatioX,
      b.y,
      b.z * ovalRatioZ,
      c.x * ovalRatioX,
      c.y,
      c.z * ovalRatioZ,
    );
  };

  const ringPoint = (r: number, y: number, idx: number, offset = 0) => {
    const angle = ((idx + offset) / segments) * Math.PI * 2;
    return new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r);
  };

  const tableCenter = new THREE.Vector3(0, yTable, 0);
  const culetPoint = new THREE.Vector3(0, yCulet, 0);

  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;

    // 1. Table facets
    const t0 = ringPoint(tableR, yTable, i);
    const t1 = ringPoint(tableR, yTable, next);
    pushTri(tableCenter, t1, t0);

    // 2. Crown star facets
    const s0 = ringPoint(starR, yStar, i, 0.5);
    const sPrev = ringPoint(starR, yStar, (i - 1 + segments) % segments, 0.5);
    pushTri(t0, t1, s0);

    // 3. Upper bezel & kite facets
    const g0 = ringPoint(girdleR, yGirdleTop, i);
    const g1 = ringPoint(girdleR, yGirdleTop, next);
    pushTri(t0, s0, g0);
    pushTri(s0, t1, g1);
    pushTri(s0, g1, g0);
    void sPrev;

    // 4. Thin girdle band
    const gb0 = ringPoint(girdleR, yGirdleBot, i);
    const gb1 = ringPoint(girdleR, yGirdleBot, next);
    pushTri(g0, g1, gb1);
    pushTri(g0, gb1, gb0);

    // 5. Pavilion upper facets
    const p0 = ringPoint(midPavR, yMidPav, i, 0.5);
    pushTri(gb0, gb1, p0);

    // 6. Pavilion lower main facets to culet
    const pNext = ringPoint(midPavR, yMidPav, next, 0.5);
    pushTri(gb1, pNext, p0);
    pushTri(p0, pNext, culetPoint);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

/**
 * Procedural soft radial golden particle sprite texture (zero external file dependency).
 */
export function createGoldSparkleSpriteTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const half = size / 2;

  const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
  grad.addColorStop(0, 'rgba(255, 248, 224, 1)');
  grad.addColorStop(0.28, 'rgba(229, 193, 118, 0.85)');
  grad.addColorStop(0.65, 'rgba(200, 162, 90, 0.22)');
  grad.addColorStop(1, 'rgba(200, 162, 90, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Procedural soft contact shadow plane directly beneath suspended or pedestal jewellery.
 */
export function createContactShadowPlane(radius = 2.6, opacity = 0.42): THREE.Mesh {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const half = size / 2;

  const grad = ctx.createRadialGradient(half, half, 4, half, half, half);
  grad.addColorStop(0, 'rgba(10, 3, 6, 0.88)');
  grad.addColorStop(0.45, 'rgba(18, 5, 10, 0.38)');
  grad.addColorStop(1, 'rgba(18, 5, 10, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(radius * 2, radius * 2),
    new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      depthWrite: false,
      opacity,
    }),
  );
  plane.rotation.x = -Math.PI / 2;
  return plane;
}

export function disposeObject3D(root: THREE.Object3D) {
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
      obj.geometry?.dispose();
      const mat = obj.material;
      if (Array.isArray(mat)) {
        mat.forEach((m) => disposeMaterialTextures(m));
      } else if (mat) {
        disposeMaterialTextures(mat);
      }
    }
  });
}

function disposeMaterialTextures(material: THREE.Material) {
  const m = material as unknown as Record<string, unknown>;
  for (const key of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'envMap', 'alphaMap']) {
    const tex = m[key];
    if (tex instanceof THREE.Texture) {
      tex.dispose();
    }
  }
  material.dispose();
}
