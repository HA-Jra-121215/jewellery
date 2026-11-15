import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { ChevronDown, ChevronUp, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { buildProduct3DModel, JewelleryModelHandle } from '../../three/jewelleryModels';
import {
  createContactShadowPlane,
  createStudioEnvironment,
  detectSoftwareWebGL,
  isWebGLAvailable,
} from '../../three/webglUtils';
import { CameraAngleId, CameraAnglePreset, MetalFinishId, Model3DType } from '../../types/jewellery';

export const CAMERA_PRESETS: CameraAnglePreset[] = [
  { id: 'hero', label: 'Showroom', position: [0, 0.9, 4.4], target: [0, 0.15, 0] },
  { id: 'profile', label: 'Profile', position: [4.2, 0.5, 0.4], target: [0, 0.2, 0] },
  { id: 'macro', label: 'Macro Gem', position: [0.8, 1.35, 2.2], target: [0, 0.72, 0] },
  { id: 'top', label: 'Crown', position: [0.05, 4.1, 1.2], target: [0, 0.25, 0] },
];

interface ProductShowroom3DProps {
  modelType: Model3DType;
  metalFinish: MetalFinishId;
  productName: string;
  fallbackImage: string;
}

const _camGoalPos = new THREE.Vector3();
const _camGoalTarget = new THREE.Vector3();

export function ProductShowroom3D({
  modelType,
  metalFinish,
  productName,
  fallbackImage,
}: ProductShowroom3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [fallbackActive, setFallbackActive] = useState(false);
  const [activeAngle, setActiveAngle] = useState<CameraAngleId>('hero');
  const [autoRotate, setAutoRotate] = useState(true);
  const [dockOpen, setDockOpen] = useState(true);

  const modelHandleRef = useRef<JewelleryModelHandle | null>(null);
  const metalRef = useRef<MetalFinishId>(metalFinish);
  const modelTypeRef = useRef<Model3DType>(modelType);
  const autoRotateRef = useRef<boolean>(autoRotate);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const transitionActiveRef = useRef(false);
  const requestRenderRef = useRef<() => void>(() => {});
  const rebuildModelRef = useRef<(type: Model3DType, metal: MetalFinishId) => void>(() => {});

  useEffect(() => {
    metalRef.current = metalFinish;
    if (modelHandleRef.current) {
      modelHandleRef.current.updateMetal(metalFinish);
      requestRenderRef.current();
    }
  }, [metalFinish]);

  useEffect(() => {
    modelTypeRef.current = modelType;
    rebuildModelRef.current(modelType, metalRef.current);
  }, [modelType]);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
      requestRenderRef.current();
    }
  }, [autoRotate]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    if (!isWebGLAvailable()) {
      setFallbackActive(true);
      return;
    }

    const isSoftwareGl = detectSoftwareWebGL();
    const width = container.clientWidth || 640;
    const height = container.clientHeight || 540;

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
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const envTex = createStudioEnvironment(renderer);
    scene.environment = envTex;

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 60);
    camera.position.set(0, 0.9, 4.4);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 1.9;
    controls.maxDistance = 7.5;
    controls.minPolarAngle = 0.18;
    controls.maxPolarAngle = Math.PI - 0.35;
    controls.target.set(0, 0.15, 0);
    controls.autoRotate = !isSoftwareGl && autoRotateRef.current;
    controls.autoRotateSpeed = 1.15;
    controlsRef.current = controls;

    // 3-point luxury showroom studio lighting
    const hemi = new THREE.HemisphereLight(0xfff6e9, 0x2c0a16, 0.95);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xffe9c7, 2.5);
    keyLight.position.set(4, 6, 4);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xeef2ff, 0.9);
    fillLight.position.set(-4, 2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xf3d192, 1.85);
    rimLight.position.set(-3.5, 3, -4);
    scene.add(rimLight);

    if (!isSoftwareGl) {
      RectAreaLightUniformsLib.init();
      const softbox = new THREE.RectAreaLight(0xfff4df, 3.6, 4, 2);
      softbox.position.set(0, 4.2, 2.2);
      softbox.lookAt(0, 0, 0);
      scene.add(softbox);
    }

    // Subtle Museum Pedestal Disc (Grounded visual anchor)
    const plinthGeo = new THREE.CylinderGeometry(1.75, 1.85, 0.12, 48);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#230710'),
      roughness: 0.72,
      metalness: 0.15,
    });
    const plinth = new THREE.Mesh(plinthGeo, plinthMat);
    plinth.position.set(0, -1.45, 0);
    plinth.receiveShadow = true;
    scene.add(plinth);

    const plinthGoldRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.76, 0.012, 12, 64),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#c8a25a'),
        metalness: 0.95,
        roughness: 0.22,
      }),
    );
    plinthGoldRing.rotation.x = Math.PI / 2;
    plinthGoldRing.position.set(0, -1.39, 0);
    scene.add(plinthGoldRing);

    const contactShadow = createContactShadowPlane(1.65, 0.45);
    contactShadow.position.set(0, -1.37, 0);
    scene.add(contactShadow);

    let frameId = 0;
    let disposed = false;
    let renderBusy = false;
    let renderDirty = false;
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

    function requestRender() {
      if (disposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame(() => {
        if (disposed) return;
        renderDirty = false;
        const dt = Math.min(clock.getDelta(), 0.08);

        if (transitionActiveRef.current) {
          const factor = 1 - Math.exp(-7 * dt);
          camera.position.lerp(_camGoalPos, factor);
          controls.target.lerp(_camGoalTarget, factor);
          if (
            camera.position.distanceTo(_camGoalPos) < 0.02 &&
            controls.target.distanceTo(_camGoalTarget) < 0.02
          ) {
            camera.position.copy(_camGoalPos);
            controls.target.copy(_camGoalTarget);
            transitionActiveRef.current = false;
          } else {
            renderDirty = true;
          }
        }

        controls.update();
        renderer.render(scene, camera);

        const done = () => {
          renderBusy = false;
          if (renderDirty || (!isSoftwareGl && autoRotateRef.current)) {
            requestRender();
          }
        };

        if (isSoftwareGl) {
          afterDraw(done);
        } else {
          done();
        }
      });
    }

    requestRenderRef.current = requestRender;

    // Mount active 3D product model
    const modelContainer = new THREE.Group();
    scene.add(modelContainer);

    const loadModel = (type: Model3DType, metal: MetalFinishId) => {
      if (modelHandleRef.current) {
        modelContainer.remove(modelHandleRef.current.group);
        modelHandleRef.current.dispose();
      }
      const handle = buildProduct3DModel(type, metal, isSoftwareGl);
      modelHandleRef.current = handle;
      modelContainer.add(handle.group);
      requestRender();
    };

    rebuildModelRef.current = loadModel;
    loadModel(modelTypeRef.current, metalRef.current);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const onControlsStart = () => {
      transitionActiveRef.current = false;
      requestRender();
    };
    const onControlsChange = () => {
      requestRender();
    };
    controls.addEventListener('start', onControlsStart);
    controls.addEventListener('change', onControlsChange);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 540;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    };
    window.addEventListener('resize', onResize);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setFallbackActive(true);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);

    requestRender();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      controls.removeEventListener('start', onControlsStart);
      controls.removeEventListener('change', onControlsChange);
      controls.dispose();
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      modelHandleRef.current?.dispose();
      plinthGeo.dispose();
      plinthMat.dispose();
      plinthGoldRing.geometry.dispose();
      (plinthGoldRing.material as THREE.Material).dispose();
      contactShadow.geometry.dispose();
      (contactShadow.material as THREE.MeshBasicMaterial).map?.dispose();
      (contactShadow.material as THREE.Material).dispose();
      envTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const selectPreset = (preset: CameraAnglePreset) => {
    setActiveAngle(preset.id);
    _camGoalPos.set(...preset.position);
    _camGoalTarget.set(...preset.target);
    transitionActiveRef.current = true;
    requestRenderRef.current();
  };

  const adjustZoom = (direction: 'in' | 'out') => {
    const cam = cameraRef.current;
    const ctrls = controlsRef.current;
    if (!cam || !ctrls) return;
    const offset = cam.position.clone().sub(ctrls.target);
    const scale = direction === 'in' ? 0.8 : 1.25;
    const nextLen = THREE.MathUtils.clamp(offset.length() * scale, 1.9, 7.4);
    offset.setLength(nextLen);
    _camGoalPos.copy(ctrls.target).add(offset);
    _camGoalTarget.copy(ctrls.target);
    transitionActiveRef.current = true;
    requestRenderRef.current();
  };

  if (fallbackActive) {
    return (
      <div className="relative flex h-full w-full items-center justify-center bg-[#18050B]">
        <img
          src={fallbackImage}
          alt={productName}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full select-none overflow-hidden bg-[radial-gradient(circle_at_50%_40%,#320A18_0%,#17040A_68%,#0B0305_100%)]">
      {/* Top-Left Minimal Instruction Caption */}
      <div className="pointer-events-none absolute left-5 top-5 z-10">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#D8B979]">
          Interactive 3D Showroom
        </p>
        <p className="mt-1 text-xs text-[#FAF7F2]/65">
          Drag to inspect facets · Scroll or use dock to zoom
        </p>
      </div>

      {/* Isolated WebGL Mount Container */}
      <div ref={mountRef} className="h-full w-full cursor-grab active:cursor-grabbing" />

      {/* Collapsible Bottom Inspection Dock (zero viewport occlusion, solid rgba backing) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex flex-col items-center px-3">
        <button
          type="button"
          onClick={() => setDockOpen((v) => !v)}
          className="pointer-events-auto mb-1.5 inline-flex items-center gap-1.5 rounded-t border border-b-0 border-[#C8A25A]/25 bg-[#19050B]/95 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#E3CB98] transition-colors hover:text-[#FAF7F2]"
        >
          {dockOpen ? (
            <>
              <ChevronDown className="h-3.5 w-3.5" />
              <span>Hide Studio Dock</span>
            </>
          ) : (
            <>
              <ChevronUp className="h-3.5 w-3.5" />
              <span>Show Studio Dock</span>
            </>
          )}
        </button>

        {dockOpen && (
          <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2 border border-[#C8A25A]/25 bg-[#150409]/95 px-3 py-2 shadow-2xl">
            <div className="flex items-center gap-1 border-r border-[#C8A25A]/20 pr-2">
              {CAMERA_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => selectPreset(preset)}
                  className={`whitespace-nowrap px-2.5 py-1.5 text-[11px] uppercase tracking-[0.14em] transition-colors ${
                    activeAngle === preset.id
                      ? 'bg-[#C8A25A] font-medium text-[#140409]'
                      : 'text-[#FAF7F2]/75 hover:bg-[#FAF7F2]/10 hover:text-[#FAF7F2]'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => adjustZoom('in')}
                aria-label="Zoom in"
                className="flex h-8 w-8 items-center justify-center text-[#FAF7F2]/80 transition-colors hover:bg-[#FAF7F2]/10 hover:text-[#FAF7F2]"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => adjustZoom('out')}
                aria-label="Zoom out"
                className="flex h-8 w-8 items-center justify-center text-[#FAF7F2]/80 transition-colors hover:bg-[#FAF7F2]/10 hover:text-[#FAF7F2]"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setAutoRotate((v) => !v)}
                className={`ml-1 inline-flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1.5 text-[11px] uppercase tracking-[0.14em] transition-colors ${
                  autoRotate
                    ? 'border border-[#C8A25A]/45 text-[#E3CB98]'
                    : 'border border-white/15 text-[#FAF7F2]/65 hover:text-[#FAF7F2]'
                }`}
              >
                <RotateCcw className="h-3 w-3" />
                <span>{autoRotate ? 'Orbit On' : 'Orbit Off'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
