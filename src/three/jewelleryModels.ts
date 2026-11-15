import * as THREE from 'three';
import { MetalFinishId, Model3DType } from '../types/jewellery';
import {
  createBrilliantDiamondGeometry,
  createDiamondMaterial,
  createGoldMaterial,
  createPearlMaterial,
  disposeObject3D,
  updateGoldMaterialColor,
} from './webglUtils';

export interface JewelleryModelHandle {
  group: THREE.Group;
  updateMetal: (metalId: MetalFinishId) => void;
  dispose: () => void;
}

/**
 * Helper to create a curved gold prong claw via TubeGeometry.
 */
function createProngClaw(
  start: THREE.Vector3,
  mid: THREE.Vector3,
  tip: THREE.Vector3,
  radiusBase: number,
  material: THREE.Material,
): THREE.Mesh {
  const curve = new THREE.QuadraticBezierCurve3(start, mid, tip);
  const geo = new THREE.TubeGeometry(curve, 14, radiusBase, 10, false);
  const mesh = new THREE.Mesh(geo, material);
  mesh.castShadow = true;
  return mesh;
}

/**
 * Builds a multi-part sculpted Cathedral Diamond Solitaire Ring (Hero & Solitaire PDP).
 */
export function buildSolitaireRingModel(
  metalId: MetalFinishId,
  isSoftwareGl: boolean,
): JewelleryModelHandle {
  const group = new THREE.Group();
  const polishedGold = createGoldMaterial(metalId, 'polished');
  const satinGold = createGoldMaterial(metalId, 'satin');
  const diamondMat = createDiamondMaterial(isSoftwareGl);

  // 1. Primary Shank (sculpted torus with inner comfort profile)
  const shankGeo = new THREE.TorusGeometry(1.02, 0.115, 28, 96);
  const shank = new THREE.Mesh(shankGeo, polishedGold);
  shank.castShadow = true;
  shank.receiveShadow = true;
  group.add(shank);

  // 2. Inner satin comfort-fit sleeve (varied roughness for authentic layered metallurgy)
  const innerRimGeo = new THREE.TorusGeometry(0.955, 0.042, 16, 80);
  const innerRim = new THREE.Mesh(innerRimGeo, satinGold);
  group.add(innerRim);

  // 3. Cathedral shoulder sweeps rising toward the gallery
  for (const side of [-1, 1]) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.92, 0.45, 0),
      new THREE.Vector3(side * 0.62, 0.94, 0),
      new THREE.Vector3(side * 0.34, 1.15, 0),
    ]);
    const shoulderGeo = new THREE.TubeGeometry(curve, 24, 0.068, 12, false);
    const shoulder = new THREE.Mesh(shoulderGeo, polishedGold);
    shoulder.castShadow = true;
    group.add(shoulder);
  }

  // 4. Gallery Under-Bezel Collet Ring
  const galleryGeo = new THREE.TorusGeometry(0.32, 0.04, 14, 48);
  const gallery = new THREE.Mesh(galleryGeo, polishedGold);
  gallery.rotation.x = Math.PI / 2;
  gallery.position.set(0, 1.16, 0);
  gallery.castShadow = true;
  group.add(gallery);

  // 5. Lower Basket Collar Seat
  const seatGeo = new THREE.CylinderGeometry(0.24, 0.14, 0.18, 24);
  const seat = new THREE.Mesh(seatGeo, satinGold);
  seat.position.set(0, 1.04, 0);
  group.add(seat);

  // 6. Six Sculpted Tapered Prong Claws
  const prongCount = 6;
  for (let i = 0; i < prongCount; i++) {
    const angle = (i / prongCount) * Math.PI * 2;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const claw = createProngClaw(
      new THREE.Vector3(cos * 0.2, 1.0, sin * 0.2),
      new THREE.Vector3(cos * 0.42, 1.24, sin * 0.42),
      new THREE.Vector3(cos * 0.35, 1.43, sin * 0.35),
      0.036,
      polishedGold,
    );
    group.add(claw);

    // Prong tip bead
    const tipBead = new THREE.Mesh(new THREE.SphereGeometry(0.038, 12, 12), polishedGold);
    tipBead.position.set(cos * 0.35, 1.43, sin * 0.35);
    group.add(tipBead);
  }

  // 7. Faceted Brilliant-Cut Centerpiece Diamond
  const mainGemGeo = createBrilliantDiamondGeometry(0.46, 0.58, 1, 1, 16);
  const mainGem = new THREE.Mesh(mainGemGeo, diamondMat);
  mainGem.position.set(0, 1.35, 0);
  mainGem.castShadow = true;
  group.add(mainGem);

  // 8. Shoulder Pavé Micro-Diamonds (InstancedMesh)
  const paveGeo = createBrilliantDiamondGeometry(0.048, 0.06, 1, 1, 8);
  const paveCount = 14;
  const paveInstanced = new THREE.InstancedMesh(paveGeo, diamondMat, paveCount);
  const dummy = new THREE.Object3D();
  let idx = 0;
  for (const side of [-1, 1]) {
    for (let k = 0; k < 7; k++) {
      const t = 0.2 + k * 0.095;
      const theta = Math.PI / 2 - side * t;
      const rx = Math.cos(theta) * 1.125;
      const ry = Math.sin(theta) * 1.125;
      dummy.position.set(rx, ry, 0);
      dummy.rotation.set(0, 0, theta - Math.PI / 2);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      paveInstanced.setMatrixAt(idx++, dummy.matrix);
    }
  }
  paveInstanced.instanceMatrix.needsUpdate = true;
  paveInstanced.computeBoundingSphere();
  group.add(paveInstanced);

  group.position.y = -0.18;

  return {
    group,
    updateMetal: (newMetal) => {
      updateGoldMaterialColor(polishedGold, newMetal, 'polished');
      updateGoldMaterialColor(satinGold, newMetal, 'satin');
    },
    dispose: () => disposeObject3D(group),
  };
}

/**
 * Builds the Aurora Oval Engagement Ring (oval center diamond, 4 talon claws, hidden halo, French-cut pavé band).
 */
export function buildAuroraRingModel(
  metalId: MetalFinishId,
  isSoftwareGl: boolean,
): JewelleryModelHandle {
  const group = new THREE.Group();
  const polishedGold = createGoldMaterial(metalId, 'polished');
  const satinGold = createGoldMaterial(metalId, 'satin');
  const diamondMat = createDiamondMaterial(isSoftwareGl);

  // 1. Delicate slender shank
  const shank = new THREE.Mesh(new THREE.TorusGeometry(1.02, 0.095, 26, 96), polishedGold);
  shank.castShadow = true;
  group.add(shank);

  // 2. Oval Gallery Halo Rail
  const haloRing = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.034, 14, 48), satinGold);
  haloRing.rotation.x = Math.PI / 2;
  haloRing.scale.set(0.84, 1.24, 1);
  haloRing.position.set(0, 1.18, 0);
  group.add(haloRing);

  // 3. Four Eagle-Talon Prongs
  const angles = [Math.PI * 0.23, Math.PI * 0.77, Math.PI * 1.23, Math.PI * 1.77];
  angles.forEach((a) => {
    const cos = Math.cos(a) * 0.85;
    const sin = Math.sin(a) * 1.22;
    const claw = createProngClaw(
      new THREE.Vector3(cos * 0.22, 1.02, sin * 0.22),
      new THREE.Vector3(cos * 0.41, 1.25, sin * 0.41),
      new THREE.Vector3(cos * 0.34, 1.44, sin * 0.34),
      0.032,
      polishedGold,
    );
    group.add(claw);
  });

  // 4. Elongated Oval Brilliant Center Stone
  const ovalGem = new THREE.Mesh(
    createBrilliantDiamondGeometry(0.45, 0.56, 0.85, 1.25, 16),
    diamondMat,
  );
  ovalGem.position.set(0, 1.36, 0);
  ovalGem.castShadow = true;
  group.add(ovalGem);

  // 5. Hidden Halo Diamonds + Shoulder Pavé
  const microGeo = createBrilliantDiamondGeometry(0.044, 0.055, 1, 1, 8);
  const totalMicro = 26;
  const microMesh = new THREE.InstancedMesh(microGeo, diamondMat, totalMicro);
  const dummy = new THREE.Object3D();
  let idx = 0;

  // 12 hidden halo stones
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    dummy.position.set(Math.cos(a) * 0.31, 1.18, Math.sin(a) * 0.44);
    dummy.rotation.set(Math.sin(a) * 1.1, 0, -Math.cos(a) * 1.1);
    dummy.updateMatrix();
    microMesh.setMatrixAt(idx++, dummy.matrix);
  }
  // 14 shoulder stones
  for (const side of [-1, 1]) {
    for (let k = 0; k < 7; k++) {
      const t = 0.22 + k * 0.1;
      const theta = Math.PI / 2 - side * t;
      dummy.position.set(Math.cos(theta) * 1.11, Math.sin(theta) * 1.11, 0);
      dummy.rotation.set(0, 0, theta - Math.PI / 2);
      dummy.updateMatrix();
      microMesh.setMatrixAt(idx++, dummy.matrix);
    }
  }
  microMesh.instanceMatrix.needsUpdate = true;
  microMesh.computeBoundingSphere();
  group.add(microMesh);

  group.position.y = -0.18;

  return {
    group,
    updateMetal: (newMetal) => {
      updateGoldMaterialColor(polishedGold, newMetal, 'polished');
      updateGoldMaterialColor(satinGold, newMetal, 'satin');
    },
    dispose: () => disposeObject3D(group),
  };
}

/**
 * Builds the Eternal Gold Necklace (articulated satin curb-link collar + pavé diamond bar clasp).
 */
export function buildEternalNecklaceModel(
  metalId: MetalFinishId,
  isSoftwareGl: boolean,
): JewelleryModelHandle {
  const group = new THREE.Group();
  const polishedGold = createGoldMaterial(metalId, 'polished');
  const satinGold = createGoldMaterial(metalId, 'satin');
  const diamondMat = createDiamondMaterial(isSoftwareGl);

  // 1. Sculpted Necklace Collar Chain Links along an elliptical curve
  const linkCount = 34;
  const linkGeo = new THREE.TorusGeometry(0.115, 0.036, 12, 24);
  const links = new THREE.InstancedMesh(linkGeo, satinGold, linkCount);
  const dummy = new THREE.Object3D();

  for (let i = 0; i < linkCount; i++) {
    // Leave small gap at front bottom for the diamond bar clasp
    const t = 0.08 + (i / (linkCount - 1)) * (Math.PI * 2 - 0.16);
    const angle = Math.PI / 2 + t;
    const x = Math.cos(angle) * 1.18;
    const y = Math.sin(angle) * 1.12;
    const z = Math.sin(angle) * 0.22;
    dummy.position.set(x, y, z);
    dummy.rotation.set(
      i % 2 === 0 ? 0.45 : -0.45,
      angle,
      Math.PI / 2 + (i % 2 === 0 ? 0.25 : -0.25),
    );
    dummy.scale.set(1.25, 0.85, 1);
    dummy.updateMatrix();
    links.setMatrixAt(i, dummy.matrix);
  }
  links.instanceMatrix.needsUpdate = true;
  links.computeBoundingSphere();
  group.add(links);

  // 2. Central Architectural Bar Clasp
  const barShape = new THREE.BoxGeometry(0.68, 0.16, 0.16);
  const barMesh = new THREE.Mesh(barShape, polishedGold);
  barMesh.position.set(0, 1.12, 0.22);
  barMesh.castShadow = true;
  group.add(barMesh);

  // 3. Bevel End Caps on Clasp
  for (const side of [-1, 1]) {
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.06, 16), satinGold);
    cap.rotation.z = Math.PI / 2;
    cap.position.set(side * 0.36, 1.12, 0.22);
    group.add(cap);
  }

  // 4. Nine Pavé Diamonds along the Central Bar
  const paveGeo = createBrilliantDiamondGeometry(0.044, 0.05, 1, 1, 8);
  const barDiamonds = new THREE.InstancedMesh(paveGeo, diamondMat, 9);
  for (let i = 0; i < 9; i++) {
    dummy.position.set(-0.26 + i * 0.065, 1.12, 0.305);
    dummy.rotation.set(Math.PI / 2, 0, 0);
    dummy.scale.setScalar(1);
    dummy.updateMatrix();
    barDiamonds.setMatrixAt(i, dummy.matrix);
  }
  barDiamonds.instanceMatrix.needsUpdate = true;
  barDiamonds.computeBoundingSphere();
  group.add(barDiamonds);

  // Tilt collar forward slightly so it faces viewer like a museum bust display
  group.rotation.x = Math.PI * 0.72;
  group.position.set(0, 0.15, 0);

  return {
    group,
    updateMetal: (newMetal) => {
      updateGoldMaterialColor(polishedGold, newMetal, 'polished');
      updateGoldMaterialColor(satinGold, newMetal, 'satin');
    },
    dispose: () => disposeObject3D(group),
  };
}

/**
 * Builds the Heritage Gold Pendant (fine chain arc, sculpted bail, engraved-style medallion, bezel diamond).
 */
export function buildHeritagePendantModel(
  metalId: MetalFinishId,
  isSoftwareGl: boolean,
): JewelleryModelHandle {
  const group = new THREE.Group();
  const polishedGold = createGoldMaterial(metalId, 'polished');
  const satinGold = createGoldMaterial(metalId, 'satin');
  const diamondMat = createDiamondMaterial(isSoftwareGl);

  // 1. Medallion Coin Core (Satin Gold)
  const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.09, 48), satinGold);
  coin.rotation.x = Math.PI / 2;
  coin.castShadow = true;
  group.add(coin);

  // 2. Concentric Beveled Outer Rim (Polished Gold)
  const outerRim = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.055, 18, 64), polishedGold);
  outerRim.castShadow = true;
  group.add(outerRim);

  // 3. Inner Engraved-Look Ornamental Collar Ring
  const innerCollar = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.022, 12, 48), polishedGold);
  innerCollar.position.z = 0.048;
  group.add(innerCollar);

  // 4. Center Flush Bezel Setting + Diamond
  const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.036, 14, 32), polishedGold);
  bezel.position.z = 0.05;
  group.add(bezel);

  const centerGem = new THREE.Mesh(
    createBrilliantDiamondGeometry(0.17, 0.22, 1, 1, 16),
    diamondMat,
  );
  centerGem.rotation.x = Math.PI / 2;
  centerGem.position.z = 0.06;
  group.add(centerGem);

  // 5. Sculpted Bail Loop at Top
  const bail = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.038, 14, 28), polishedGold);
  bail.position.set(0, 0.84, 0);
  bail.rotation.y = Math.PI / 2;
  group.add(bail);

  // 6. Delicate Chain Arc Rising Upward
  const chainCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.72, 1.55, -0.15),
    new THREE.Vector3(-0.34, 1.1, -0.04),
    new THREE.Vector3(0, 0.94, 0),
    new THREE.Vector3(0.34, 1.1, -0.04),
    new THREE.Vector3(0.72, 1.55, -0.15),
  ]);
  const chain = new THREE.Mesh(new THREE.TubeGeometry(chainCurve, 48, 0.026, 10, false), polishedGold);
  group.add(chain);

  group.position.y = -0.22;

  return {
    group,
    updateMetal: (newMetal) => {
      updateGoldMaterialColor(polishedGold, newMetal, 'polished');
      updateGoldMaterialColor(satinGold, newMetal, 'satin');
    },
    dispose: () => disposeObject3D(group),
  };
}

/**
 * Builds the Royal Pearl Earrings (matched pair with diamond filigree studs and luminous South Sea pearls).
 */
export function buildPearlEarringsModel(
  metalId: MetalFinishId,
  isSoftwareGl: boolean,
): JewelleryModelHandle {
  const group = new THREE.Group();
  const polishedGold = createGoldMaterial(metalId, 'polished');
  const satinGold = createGoldMaterial(metalId, 'satin');
  const diamondMat = createDiamondMaterial(isSoftwareGl);
  const pearlMat = createPearlMaterial();

  const buildSingleEarring = (offsetX: number, tiltZ: number) => {
    const ear = new THREE.Group();

    // 1. Filigree Crest Stud Plate
    const crest = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.042, 14, 32), polishedGold);
    crest.scale.set(0.78, 1.25, 1);
    crest.position.set(0, 0.65, 0);
    ear.add(crest);

    const innerScroll = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.028, 12, 24), satinGold);
    innerScroll.position.set(0, 0.65, 0.02);
    ear.add(innerScroll);

    // 2. Stud Accent Diamonds
    const studGemGeo = createBrilliantDiamondGeometry(0.068, 0.09, 1, 1, 10);
    for (const dy of [0.78, 0.65, 0.52]) {
      const gem = new THREE.Mesh(studGemGeo, diamondMat);
      gem.rotation.x = Math.PI / 2;
      gem.position.set(0, dy, 0.045);
      ear.add(gem);
    }

    // 3. Articulated Drop Link Ring
    const link = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.02, 10, 20), polishedGold);
    link.position.set(0, 0.31, 0);
    ear.add(link);

    // 4. Pearl Bail Cap
    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.12, 20), polishedGold);
    cap.position.set(0, 0.18, 0);
    ear.add(cap);

    // 5. Luminous South Sea Pearl Drop
    const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.38, 36, 36), pearlMat);
    pearl.scale.set(0.96, 1.08, 0.96);
    pearl.position.set(0, -0.2, 0);
    pearl.castShadow = true;
    ear.add(pearl);

    ear.position.set(offsetX, 0, 0);
    ear.rotation.z = tiltZ;
    return ear;
  };

  group.add(buildSingleEarring(-0.56, 0.05));
  group.add(buildSingleEarring(0.56, -0.05));
  group.position.y = -0.1;

  return {
    group,
    updateMetal: (newMetal) => {
      updateGoldMaterialColor(polishedGold, newMetal, 'polished');
      updateGoldMaterialColor(satinGold, newMetal, 'satin');
    },
    dispose: () => disposeObject3D(group),
  };
}

/**
 * Builds the Celestial Diamond Bracelet (hinged elliptical gold bangle with 28 channel-set brilliant diamonds).
 */
export function buildCelestialBraceletModel(
  metalId: MetalFinishId,
  isSoftwareGl: boolean,
): JewelleryModelHandle {
  const group = new THREE.Group();
  const polishedGold = createGoldMaterial(metalId, 'polished');
  const satinGold = createGoldMaterial(metalId, 'satin');
  const diamondMat = createDiamondMaterial(isSoftwareGl);

  // 1. Elliptical Gold Bangle Body
  const bangle = new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.095, 24, 96), polishedGold);
  bangle.scale.set(1.15, 0.88, 1);
  bangle.castShadow = true;
  group.add(bangle);

  // 2. Inner Satin Comfort Liner
  const innerBangle = new THREE.Mesh(new THREE.TorusGeometry(1.13, 0.045, 16, 80), satinGold);
  innerBangle.scale.set(1.15, 0.88, 1);
  group.add(innerBangle);

  // 3. Hinge & Clasp Collar Accent on Left/Right Sides
  for (const side of [-1, 1]) {
    const clasp = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.12, 18), satinGold);
    clasp.position.set(side * 1.35, 0, 0);
    clasp.rotation.z = Math.PI / 2;
    group.add(clasp);
  }

  // 4. 28 Channel-Set Brilliant Diamonds along Upper Arc
  const stoneGeo = createBrilliantDiamondGeometry(0.088, 0.11, 1, 1, 10);
  const count = 28;
  const stones = new THREE.InstancedMesh(stoneGeo, diamondMat, count);
  const dummy = new THREE.Object3D();

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const x = Math.cos(angle) * 1.18 * 1.15;
    const y = Math.sin(angle) * 1.18 * 0.88;
    dummy.position.set(x * 1.07, y * 1.07, 0);
    dummy.rotation.set(0, 0, angle - Math.PI / 2);
    dummy.scale.setScalar(1);
    dummy.updateMatrix();
    stones.setMatrixAt(i, dummy.matrix);
  }
  stones.instanceMatrix.needsUpdate = true;
  stones.computeBoundingSphere();
  group.add(stones);

  group.rotation.x = Math.PI * 0.34;
  group.rotation.y = Math.PI * 0.14;

  return {
    group,
    updateMetal: (newMetal) => {
      updateGoldMaterialColor(polishedGold, newMetal, 'polished');
      updateGoldMaterialColor(satinGold, newMetal, 'satin');
    },
    dispose: () => disposeObject3D(group),
  };
}

export function buildProduct3DModel(
  modelType: Model3DType,
  metalId: MetalFinishId,
  isSoftwareGl: boolean,
): JewelleryModelHandle {
  switch (modelType) {
    case 'solitaire-ring':
      return buildSolitaireRingModel(metalId, isSoftwareGl);
    case 'aurora-ring':
      return buildAuroraRingModel(metalId, isSoftwareGl);
    case 'eternal-necklace':
      return buildEternalNecklaceModel(metalId, isSoftwareGl);
    case 'heritage-pendant':
      return buildHeritagePendantModel(metalId, isSoftwareGl);
    case 'pearl-earrings':
      return buildPearlEarringsModel(metalId, isSoftwareGl);
    case 'celestial-bracelet':
      return buildCelestialBraceletModel(metalId, isSoftwareGl);
  }
}
