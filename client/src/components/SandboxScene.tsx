/**
 * Instrument Panel Noir — a restrained interactive WebGL sandbox: graphite alloy,
 * smoked glass, steel-blue instrument lights, and direct inspection through drag rotation.
 */
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type SandboxSceneProps = {
  scrollProgress: number;
  resetSignal: number;
};

export default function SandboxScene({ scrollProgress, resetSignal }: SandboxSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(scrollProgress);
  const resetRef = useRef(resetSignal);
  const [unavailable, setUnavailable] = useState(false);

  scrollRef.current = scrollProgress;
  resetRef.current = resetSignal;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      setUnavailable(true);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 100);
    camera.position.set(0.1, 0.15, 8.6);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
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
    let baseY = root.rotation.y;
    let baseX = root.rotation.x;
    let targetY = root.rotation.y;
    let targetX = root.rotation.x;
    let lastReset = resetRef.current;

    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      startX = event.clientX;
      startY = event.clientY;
      baseY = targetY;
      baseX = targetX;
      renderer.domElement.setPointerCapture(event.pointerId);
      renderer.domElement.style.cursor = "grabbing";
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      targetY = baseY + (event.clientX - startX) * 0.008;
      targetX = THREE.MathUtils.clamp(baseX + (event.clientY - startY) * 0.006, -0.65, 0.33);
    };
    const onPointerUp = (event: PointerEvent) => {
      dragging = false;
      renderer.domElement.releasePointerCapture(event.pointerId);
      renderer.domElement.style.cursor = "grab";
    };
    renderer.domElement.style.cursor = "grab";
    renderer.domElement.setAttribute("aria-label", "Interactive isolated sandbox model. Drag to rotate.");
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointercancel", onPointerUp);

    let animationFrame = 0;
    const draw = (time: number) => {
      if (lastReset !== resetRef.current) {
        lastReset = resetRef.current;
        targetY = -0.56;
        targetX = -0.16;
      }
      if (!dragging && !reduceMotion) targetY += 0.0014;
      root.rotation.y += (targetY - root.rotation.y) * 0.08;
      root.rotation.x += (targetX - root.rotation.x) * 0.08;
      const depth = scrollRef.current;
      camera.position.z += ((8.6 - depth * 1.4) - camera.position.z) * 0.06;
      camera.position.y += ((0.15 + depth * 0.18) - camera.position.y) * 0.06;
      lights.children.forEach((node, index) => { node.scale.setScalar(0.85 + Math.sin(time * 0.0022 + index) * 0.12); });
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
        if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.LineSegments) {
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
