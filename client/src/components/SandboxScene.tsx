/**
 * Instrument Panel Noir — a restrained interactive WebGL sandbox: graphite alloy,
 * smoked glass, steel-blue instrument lights, and direct inspection through drag rotation.
 */
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type SandboxSceneProps = {
  scrollProgress: number;
  resetSignal: number;
  performanceMode: ScenePerformanceMode;
  runProgress: number;
  executionStage: number;
  activeHotspot: SandboxHotspotId | null;
  onHotspotSelect: (hotspot: SandboxHotspotId) => void;
  showHotspots?: boolean;
};

export type ScenePerformanceMode = "balanced" | "efficient";
export type SandboxHotspotId = "runtime" | "network" | "receipt";

export default function SandboxScene({ scrollProgress, resetSignal, performanceMode, runProgress, executionStage, activeHotspot, onHotspotSelect, showHotspots = true }: SandboxSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(scrollProgress);
  const resetRef = useRef(resetSignal);
  const performanceRef = useRef<ScenePerformanceMode>(performanceMode);
  const progressRef = useRef(runProgress);
  const stageRef = useRef(executionStage);
  const activeHotspotRef = useRef<SandboxHotspotId | null>(activeHotspot);
  const onHotspotSelectRef = useRef(onHotspotSelect);
  const [unavailable, setUnavailable] = useState(false);

  scrollRef.current = scrollProgress;
  resetRef.current = resetSignal;
  performanceRef.current = performanceMode;
  progressRef.current = runProgress;
  stageRef.current = executionStage;
  activeHotspotRef.current = activeHotspot;
  onHotspotSelectRef.current = onHotspotSelect;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "default" });
    } catch {
      setUnavailable(true);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 100);
    camera.position.set(0.1, 0.15, 11.4);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, performanceMode === "efficient" ? 1 : 1.65));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const root = new THREE.Group();
    root.rotation.set(-0.16, -0.56, 0);
    scene.add(root);

    const graphite = new THREE.MeshStandardMaterial({ color: 0x16232c, metalness: 0.78, roughness: 0.31 });
    const graphiteDark = new THREE.MeshStandardMaterial({ color: 0x0a1117, metalness: 0.9, roughness: 0.22 });
    const steel = new THREE.MeshStandardMaterial({ color: 0x7793a1, metalness: 0.88, roughness: 0.24 });
    const strut = new THREE.MeshStandardMaterial({ color: 0x587582, metalness: 0.92, roughness: 0.19 });
    const board = new THREE.MeshStandardMaterial({ color: 0x112b38, metalness: 0.48, roughness: 0.44 });
    const glass = new THREE.MeshPhysicalMaterial({ color: 0x718c99, metalness: 0.08, roughness: 0.08, transmission: 0.08, transparent: true, opacity: 0.16, side: THREE.DoubleSide });
    const signal = new THREE.MeshStandardMaterial({ color: 0xc3d3da, emissive: 0x355260, emissiveIntensity: 1.3, roughness: 0.3 });

    const base = new THREE.Mesh(new THREE.BoxGeometry(3.7, 0.32, 2.65), graphiteDark);
    base.position.y = -1.38;
    root.add(base);
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(3.28, 0.17, 2.22), graphite);
    plinth.position.y = -1.12;
    root.add(plinth);

    const innerBoard = new THREE.Mesh(new THREE.BoxGeometry(2.67, 0.09, 1.64), board);
    innerBoard.position.set(0, -0.99, 0);
    root.add(innerBoard);
    const coreHousing = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.42, 0.58), graphiteDark);
    coreHousing.position.set(-0.55, -0.72, 0.34);
    root.add(coreHousing);
    const corePlate = new THREE.Mesh(new THREE.BoxGeometry(0.59, 0.03, 0.46), steel);
    corePlate.position.set(-0.55, -0.49, 0.34);
    root.add(corePlate);
    const processor = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.12, 0.62), graphite);
    processor.position.set(0.24, -0.87, 0.03);
    root.add(processor);
    const rack = new THREE.Mesh(new THREE.BoxGeometry(1.84, 0.11, 0.63), graphite);
    rack.position.set(-0.39, -0.87, -0.46);
    root.add(rack);

    const frameGroup = new THREE.Group();
    const edgeLines = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(3.35, 2.55, 2.35)), new THREE.LineBasicMaterial({ color: 0x98b2be, transparent: true, opacity: 0.68 }));
    frameGroup.add(edgeLines);
    [[-1.67, 0, -1.17], [-1.67, 0, 1.17], [1.67, 0, -1.17], [1.67, 0, 1.17]].forEach(([x, y, z]) => {
      const support = new THREE.Mesh(new THREE.BoxGeometry(0.075, 2.55, 0.075), strut);
      support.position.set(x, y, z);
      frameGroup.add(support);
    });
    const frontGlass = new THREE.Mesh(new THREE.PlaneGeometry(3.19, 2.4), glass);
    frontGlass.position.set(0, 0.02, 1.18);
    frameGroup.add(frontGlass);
    const sideGlass = new THREE.Mesh(new THREE.PlaneGeometry(2.19, 2.4), glass);
    sideGlass.position.set(1.68, 0.02, 0);
    sideGlass.rotation.y = Math.PI / 2;
    frameGroup.add(sideGlass);
    frameGroup.position.y = 0.05;
    root.add(frameGroup);

    const shelfMaterial = new THREE.MeshStandardMaterial({ color: 0x324955, metalness: 0.73, roughness: 0.29 });
    [-0.22, 0.58].forEach((height) => {
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(2.95, 0.065, 2.02), shelfMaterial);
      shelf.position.y = height;
      root.add(shelf);
    });
    [-0.98, -0.72, -0.46, -0.2, 0.06].forEach((x) => {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.27, 0.5), steel);
      fin.position.set(x, -0.68, 0.46);
      root.add(fin);
    });

    const traceMaterial = new THREE.LineBasicMaterial({ color: 0x9bb3bd, transparent: true, opacity: 0.66 });
    const tracePoints = [[[-1.1, -0.79, 0.58], [-0.64, -0.79, 0.58], [-0.33, -0.79, 0.18], [0.24, -0.79, 0.18]], [[-1.23, -0.78, -0.53], [-0.65, -0.78, -0.53], [-0.41, -0.78, -0.19], [0.17, -0.78, -0.19]], [[0.76, -0.78, -0.51], [1.14, -0.78, -0.51], [1.14, -0.78, 0.33]]];
    tracePoints.forEach((points) => root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points.map(([x, y, z]) => new THREE.Vector3(x, y, z))), traceMaterial)));

    const streamPaths = tracePoints.map((points) => points.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
    const maxParticles = 56;
    const streamPositions = new Float32Array(maxParticles * 3);
    const streamGeometry = new THREE.BufferGeometry();
    streamGeometry.setAttribute("position", new THREE.BufferAttribute(streamPositions, 3));
    const streamMaterial = new THREE.PointsMaterial({ color: 0xc7e0e8, size: 0.092, sizeAttenuation: true, transparent: true, opacity: 0.96, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false });
    const streamParticles = new THREE.Points(streamGeometry, streamMaterial);
    streamParticles.renderOrder = 5;
    root.add(streamParticles);

    const hotspotNodes: Array<{ id: SandboxHotspotId; group: THREE.Group; material: THREE.MeshStandardMaterial }> = [];
    const createHotspot = (id: SandboxHotspotId, position: [number, number, number]) => {
      const group = new THREE.Group();
      group.position.set(...position);
      const markerMaterial = new THREE.MeshStandardMaterial({ color: 0xd7e6ec, emissive: 0x3d7186, emissiveIntensity: 1.25, metalness: 0.25, roughness: 0.28 });
      const marker = new THREE.Mesh(new THREE.SphereGeometry(0.072, 16, 16), markerMaterial);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.128, 0.008, 8, 26), new THREE.MeshBasicMaterial({ color: 0x9ab7c4, transparent: true, opacity: 0.76 }));
      ring.rotation.x = Math.PI / 2;
      const stem = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0.06, 0), new THREE.Vector3(0, 0.29, 0)]), new THREE.LineBasicMaterial({ color: 0x94b1bd, transparent: true, opacity: 0.68 }));
      [marker, ring, stem].forEach((object) => { object.userData.hotspot = id; group.add(object); });
      group.userData.hotspot = id;
      group.renderOrder = 6;
      root.add(group);
      hotspotNodes.push({ id, group, material: markerMaterial });
    };
    if (showHotspots) {
      createHotspot("runtime", [-0.55, -0.46, 0.34]);
      createHotspot("network", [1.1, -0.61, 0.28]);
      createHotspot("receipt", [0.46, 0.66, 0.18]);
    }

    const lights = new THREE.Group();
    [[-0.95, -0.7, 0.58], [0.46, -0.7, 0.18], [1.14, -0.7, 0.33], [-0.61, -0.7, -0.53]].forEach(([x, y, z]) => {
      const node = new THREE.Mesh(new THREE.SphereGeometry(0.052, 16, 16), signal);
      node.position.set(x, y, z);
      lights.add(node);
    });
    root.add(lights);

    const ambient = new THREE.HemisphereLight(0xaec2cc, 0x061015, 2.3);
    const key = new THREE.DirectionalLight(0xd8e2e6, 3.2);
    key.position.set(3.5, 5.2, 5.8);
    const rim = new THREE.PointLight(0x789eae, 7.5, 12);
    rim.position.set(-3, 1.8, -2.7);
    scene.add(ambient, key, rim);

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshStandardMaterial({ color: 0x071016, roughness: 0.94, metalness: 0.14 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.56;
    scene.add(floor);

    let width = 1;
    let height = 1;
    const setQuality = (mode: ScenePerformanceMode) => {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, mode === "efficient" ? 1 : 1.65));
      renderer.setSize(width, height, false);
      streamMaterial.size = mode === "efficient" ? 0.068 : 0.092;
      streamMaterial.opacity = mode === "efficient" ? 0.72 : 0.96;
    };
    const resize = () => {
      const bounds = host.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let baseY = 0;
    let baseX = 0;
    let dragYaw = 0;
    let dragPitch = 0;
    let targetY = root.rotation.y;
    let targetX = root.rotation.x;
    let lastReset = resetRef.current;
    let lastPerformanceMode = performanceRef.current;
    const sequenceStartedAt = performance.now();

    const pointOnStream = (path: THREE.Vector3[], position: number) => {
      const scaled = position * (path.length - 1);
      const start = Math.min(path.length - 2, Math.floor(scaled));
      return path[start].clone().lerp(path[start + 1], scaled - start);
    };

    const updateStreams = (time: number, mode: ScenePerformanceMode, frozen: boolean, progress: number, stage: number) => {
      const maximum = mode === "efficient" ? 16 : maxParticles;
      const count = Math.max(mode === "efficient" ? 4 : 8, Math.round(maximum * (0.16 + progress * 0.84)));
      streamGeometry.setDrawRange(0, count);
      streamParticles.visible = progress > 0.03;
      streamMaterial.opacity = (mode === "efficient" ? 0.72 : 0.96) * (0.35 + progress * 0.65);
      const activePathCount = Math.min(streamPaths.length, Math.max(1, stage + 1));
      const speed = frozen ? 0 : 0.000035 + progress * 0.00018;
      for (let index = 0; index < count; index += 1) {
        const path = streamPaths[index % activePathCount];
        const offset = ((index / count) + (frozen ? 0.28 : time * speed) + (index % activePathCount) * 0.13) % 1;
        const point = pointOnStream(path, offset);
        const ripple = frozen ? 0 : Math.sin(time * (0.002 + progress * 0.003) + index) * (0.009 + progress * 0.026);
        streamPositions[index * 3] = point.x;
        streamPositions[index * 3 + 1] = point.y + ripple;
        streamPositions[index * 3 + 2] = point.z;
      }
      streamGeometry.attributes.position.needsUpdate = true;
    };

    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      startX = event.clientX;
      startY = event.clientY;
      baseY = dragYaw;
      baseX = dragPitch;
      renderer.domElement.setPointerCapture(event.pointerId);
      renderer.domElement.style.cursor = "grabbing";
    };
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const getHotspotAtPointer = (event: PointerEvent) => {
      const bounds = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(hotspotNodes.map((hotspot) => hotspot.group), true).find((candidate) => candidate.object.userData.hotspot) ?? null;
      return hit?.object.userData.hotspot as SandboxHotspotId | undefined;
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) {
        renderer.domElement.style.cursor = getHotspotAtPointer(event) ? "pointer" : "grab";
        return;
      }
      dragYaw = baseY + (event.clientX - startX) * 0.008;
      dragPitch = THREE.MathUtils.clamp(baseX + (event.clientY - startY) * 0.006, -0.52, 0.38);
    };
    const onPointerUp = (event: PointerEvent) => {
      const moved = Math.hypot(event.clientX - startX, event.clientY - startY);
      dragging = false;
      renderer.domElement.releasePointerCapture(event.pointerId);
      const hotspot = moved < 8 ? getHotspotAtPointer(event) : undefined;
      if (hotspot) onHotspotSelectRef.current(hotspot);
      renderer.domElement.style.cursor = hotspot ? "pointer" : "grab";
    };
    renderer.domElement.style.cursor = "grab";
    renderer.domElement.setAttribute("aria-label", "Interactive isolated sandbox model. Drag to rotate.");
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointercancel", onPointerUp);

    let animationFrame = 0;
    const draw = (time: number) => {
      if (lastPerformanceMode !== performanceRef.current) {
        lastPerformanceMode = performanceRef.current;
        setQuality(lastPerformanceMode);
      }
      if (lastReset !== resetRef.current) {
        lastReset = resetRef.current;
        dragYaw = 0;
        dragPitch = 0;
      }
      const depth = scrollRef.current;
      const easedDepth = depth * depth * (3 - 2 * depth);
      const introProgress = reduceMotion ? 1 : Math.min(1, (time - sequenceStartedAt) / 1500);
      const introEase = 1 - Math.pow(1 - introProgress, 3);
      const idleYaw = reduceMotion ? 0 : Math.sin(time * 0.00034) * (lastPerformanceMode === "efficient" ? 0.028 : 0.052);
      targetY = -0.56 + easedDepth * 1.38 + idleYaw + dragYaw;
      targetX = -0.16 + easedDepth * 0.12 + dragPitch;
      root.rotation.y += (targetY - root.rotation.y) * 0.08;
      root.rotation.x += (targetX - root.rotation.x) * 0.08;
      const entryDistance = THREE.MathUtils.lerp(11.4, 9.55, introEase) - easedDepth * 8.5;
      camera.position.z += (entryDistance - camera.position.z) * 0.075;
      camera.position.y += ((0.15 + easedDepth * 0.24) - camera.position.y) * 0.075;
      camera.lookAt(0, -0.27 + easedDepth * 0.2, -0.08);
      const runIntensity = progressRef.current;
      lights.children.forEach((node, index) => { node.scale.setScalar(0.72 + runIntensity * 0.36 + (reduceMotion ? 0 : Math.sin(time * 0.0022 + index) * 0.1)); });
      hotspotNodes.forEach((hotspot, index) => {
        const selected = hotspot.id === activeHotspotRef.current;
        hotspot.material.emissiveIntensity = selected ? 3.2 : 1.05 + runIntensity * 0.72;
        hotspot.group.scale.setScalar(selected ? 1.25 : 0.9 + (reduceMotion ? 0 : Math.sin(time * 0.002 + index) * 0.06));
      });
      updateStreams(time, lastPerformanceMode, reduceMotion, runIntensity, stageRef.current);
      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(draw);
    };
    animationFrame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointercancel", onPointerUp);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.LineSegments || object instanceof THREE.Points) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  if (unavailable) return <div className="sandbox-fallback" role="img" aria-label="Interactive 3D sandbox unavailable"><span>3D scene unavailable</span><small>Your browser does not support the required graphics features.</small></div>;
  return <div ref={hostRef} className="sandbox-webgl" role="application" aria-label="Interactive Workflo isolated sandbox model" />;
}
