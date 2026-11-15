import { MutableRefObject, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  buildEternalNecklaceModel,
  buildSolitaireRingModel,
} from '../../three/jewelleryModels';
import {
  createStudioEnvironment,
  detectSoftwareWebGL,
  isWebGLAvailable,
} from '../../three/webglUtils';

interface StorytellingCanvasProps {
  scrollProgressRef: MutableRefObject<number>;
}

export function StorytellingCanvas({ scrollProgressRef }: StorytellingCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [fallbackActive, setFallbackActive] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    if (!isWebGLAvailable()) {
      setFallbackActive(true);
      return;
    }

    const isSoftwareGl = detectSoftwareWebGL();
    const width = container.clientWidth || 640;
    const height = container.clientHeight || 520;

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
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const envTex = createStudioEnvironment(renderer);
    scene.environment = envTex;

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 50);
    camera.position.set(0, 0.4, 5.6);

    const hemi = new THREE.HemisphereLight(0xfff5e4, 0x260711, 0.65);
    scene.add(hemi);

    // Sweeping golden beam that travels across the jewellery surface on scroll
    const sweepLight = new THREE.SpotLight(0xffe4ad, 18, 16, Math.PI / 5, 0.6, 1.4);
    sweepLight.position.set(-4, 3.5, 4);
    scene.add(sweepLight);
    scene.add(sweepLight.target);

    const rimLight = new THREE.DirectionalLight(0xf2d294, 1.8);
    rimLight.position.set(3.5, 2.5, -3.5);
    scene.add(rimLight);

    // 1. Gold Necklace emerging from darkness
    const necklaceHandle = buildEternalNecklaceModel('yellow-gold', isSoftwareGl);
    necklaceHandle.group.scale.setScalar(0.92);
    necklaceHandle.group.position.set(-0.55, 0.25, -1.6);
    necklaceHandle.group.rotation.x = Math.PI * 0.68;
    necklaceHandle.group.rotation.z = -0.18;
    scene.add(necklaceHandle.group);

    // 2. Diamond Solitaire Ring rotating into focus
    const ringHandle = buildSolitaireRingModel('yellow-gold', isSoftwareGl);
    ringHandle.group.scale.setScalar(0.88);
    ringHandle.group.position.set(0.85, -0.35, 0.4);
    ringHandle.group.rotation.x = 0.28;
    scene.add(ringHandle.group);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    let frameId = 0;
    let disposed = false;
    let smoothProgress = 0;
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
      const targetP = scrollProgressRef.current;
      smoothProgress = THREE.MathUtils.damp(smoothProgress, targetP, 5, dt);

      // Necklace emerges forward from shadow as progress goes 0 -> 0.55
      const emerge = THREE.MathUtils.smoothstep(smoothProgress, 0.05, 0.6);
      necklaceHandle.group.position.z = THREE.MathUtils.lerp(-2.2, 0.15, emerge);
      necklaceHandle.group.position.y = THREE.MathUtils.lerp(-0.35, 0.32, emerge);
      necklaceHandle.group.rotation.y = THREE.MathUtils.lerp(-0.45, 0.22, emerge);

      // Ring rotates smoothly into focus 0.25 -> 0.95
      const focus = THREE.MathUtils.smoothstep(smoothProgress, 0.2, 0.9);
      ringHandle.group.position.z = THREE.MathUtils.lerp(-0.8, 0.95, focus);
      ringHandle.group.position.x = THREE.MathUtils.lerp(1.45, 0.65, focus);
      ringHandle.group.rotation.y = THREE.MathUtils.lerp(-0.8, Math.PI * 1.15, smoothProgress);

      // Golden light travels across both jewellery surfaces
      sweepLight.position.x = THREE.MathUtils.lerp(-4.5, 4.5, smoothProgress);
      sweepLight.intensity = 10 + Math.sin(smoothProgress * Math.PI) * 18;
      hemi.intensity = THREE.MathUtils.lerp(0.45, 1.25, smoothProgress);

      renderer.render(scene, camera);

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
      window.removeEventListener('resize', onResize);
      necklaceHandle.dispose();
      ringHandle.dispose();
      envTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [scrollProgressRef]);

  if (fallbackActive) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <img
          src="/src/assets/images/product_eternal_necklace_1794736808812.jpg"
          alt="AURELLE Eternal Gold Necklace"
          referrerPolicy="no-referrer"
          className="h-80 w-full max-w-md object-cover shadow-2xl"
        />
      </div>
    );
  }

  return <div ref={mountRef} className="h-full w-full" aria-hidden="true" />;
}
