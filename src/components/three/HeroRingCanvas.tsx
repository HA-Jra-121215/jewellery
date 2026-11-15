import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { buildSolitaireRingModel } from '../../three/jewelleryModels';
import {
  createContactShadowPlane,
  createGoldSparkleSpriteTexture,
  createStudioEnvironment,
  detectSoftwareWebGL,
  isWebGLAvailable,
} from '../../three/webglUtils';

const _targetVec = new THREE.Vector3();

export function HeroRingCanvas() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [fallbackActive, setFallbackActive] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isWebGLAvailable()) {
      setFallbackActive(true);
      return;
    }

    const isSoftwareGl = detectSoftwareWebGL();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setFallbackActive(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const envTex = createStudioEnvironment(renderer);
    scene.environment = envTex;

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 0.55, 6.2);

    // 3-Point Studio + Warm/Cool Contrast Lighting
    const hemi = new THREE.HemisphereLight(0xfff5e4, 0x2a0813, 0.85);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xffe7c2, 2.6);
    keyLight.position.set(4.5, 6, 4.5);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf3d49b, 1.9);
    rimLight.position.set(-4.5, 2.5, -4);
    scene.add(rimLight);

    // Cursor-reactive warm gold accent light
    const cursorLight = new THREE.PointLight(0xffdf9e, 6.5, 16, 1.8);
    cursorLight.position.set(2.2, 2.4, 3.2);
    scene.add(cursorLight);

    if (!isSoftwareGl) {
      RectAreaLightUniformsLib.init();
      const softboxTop = new THREE.RectAreaLight(0xfff1d6, 3.8, 4.5, 2.2);
      softboxTop.position.set(0, 4.6, 2.5);
      softboxTop.lookAt(0, 0, 0);
      scene.add(softboxTop);
    }

    // Build Multi-Part Sculpted Solitaire Ring
    const ringPivot = new THREE.Group();
    const ringModel = buildSolitaireRingModel('yellow-gold', isSoftwareGl);
    ringModel.group.scale.setScalar(1.28);
    ringModel.group.rotation.x = 0.24;
    ringModel.group.rotation.z = -0.14;
    ringPivot.add(ringModel.group);
    scene.add(ringPivot);

    // Contact shadow plane gently grounding the hero piece
    const shadowPlane = createContactShadowPlane(2.4, 0.32);
    shadowPlane.position.set(0, -1.75, 0);
    scene.add(shadowPlane);

    // Floating Golden Micro-Particles
    const particleCount = isSoftwareGl ? 65 : 130;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const phases = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 9.5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5.8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5.0 - 0.8;
      phases[i] = Math.random() * Math.PI * 2;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const sparkleTex = createGoldSparkleSpriteTexture();
    const particleMat = new THREE.PointsMaterial({
      size: 0.095,
      map: sparkleTex,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: new THREE.Color('#efd08d'),
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Pointer tracking
    const pointer = { x: 0, y: 0, smoothX: 0, smoothY: 0 };
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      // Pull camera slightly back on narrow mobile viewports so the ring fits hero framing
      camera.position.z = w < 640 ? 7.6 : w < 1024 ? 6.8 : 6.2;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    onResize();
    window.addEventListener('resize', onResize);

    let contextLost = false;
    const onContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
    };
    const onContextRestored = () => {
      contextLost = false;
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    let frameId = 0;
    let disposed = false;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || !gl.fenceSync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      if (!contextLost) {
        if (!prefersReducedMotion) {
          pointer.smoothX = THREE.MathUtils.damp(pointer.smoothX, pointer.x, 4.5, dt);
          pointer.smoothY = THREE.MathUtils.damp(pointer.smoothY, pointer.y, 4.5, dt);

          ringPivot.rotation.y = elapsed * 0.28 + pointer.smoothX * 0.35;
          ringPivot.rotation.x = THREE.MathUtils.damp(
            ringPivot.rotation.x,
            pointer.smoothY * 0.18,
            4.0,
            dt,
          );
          ringPivot.position.y = Math.sin(elapsed * 0.95) * 0.08;

          // Subtle cursor-driven cinematic key/rim highlight shift
          _targetVec.set(
            2.2 + pointer.smoothX * 2.6,
            2.0 + pointer.smoothY * 1.8,
            3.4,
          );
          cursorLight.position.lerp(_targetVec, 1 - Math.exp(-5 * dt));

          // Gentle upward drift on golden dust particles
          const posAttr = particleGeo.getAttribute('position') as THREE.BufferAttribute;
          for (let i = 0; i < particleCount; i++) {
            let y = posAttr.getY(i) + dt * 0.11;
            const x = posAttr.getX(i) + Math.sin(elapsed * 0.6 + phases[i]) * dt * 0.04;
            if (y > 2.9) y = -2.9;
            posAttr.setXY(i, x, y);
          }
          posAttr.needsUpdate = true;
        }

        renderer.render(scene, camera);
      }

      if (prefersReducedMotion) {
        return;
      }
      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      ringModel.dispose();
      shadowPlane.geometry.dispose();
      (shadowPlane.material as THREE.MeshBasicMaterial).map?.dispose();
      (shadowPlane.material as THREE.Material).dispose();
      particleGeo.dispose();
      sparkleTex.dispose();
      particleMat.dispose();
      envTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (fallbackActive) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_center,#3b0d1c_0%,#140409_55%,#090305_100%)]">
        <img
          src="/src/assets/images/product_solitaire_ring_1794736808054.jpg"
          alt="AURELLE Diamond Solitaire Ring"
          referrerPolicy="no-referrer"
          className="h-72 w-72 rounded-full object-cover opacity-80 shadow-2xl ring-1 ring-[#C8A25A]/30 md:h-96 md:w-96"
        />
      </div>
    );
  }

  return <div ref={mountRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
