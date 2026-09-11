import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import outlines from './q-shape.json';
import { signalPose } from './signal-pose';
import type { RefObject } from 'react';

// Geometry follows the alpha contours of SONIQCX's supplied Q submark.
// The mark stays intact; the scroll journey separates duplicate depth slices.
export function mountSignal(
  host: HTMLElement,
  progress: RefObject<number>,
  pointer: RefObject<{ x: number; y: number }>,
  motion: boolean,
  onReady: (ready: boolean) => void,
) {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch { return () => {}; }
  const compact = innerWidth < 760;
  renderer.setPixelRatio(Math.min(devicePixelRatio, compact ? 1.3 : 1.75));
  renderer.setClearColor(0x070a0c, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x070a0c, .028);
  const camera = new THREE.PerspectiveCamera(37, 1, .1, 100);
  camera.position.set(0, 0, 12);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, .04);
  scene.environment = environment.texture;
  room.dispose(); pmrem.dispose();
  scene.add(new THREE.AmbientLight(0xb6d6df, 1.5));
  const key = new THREE.DirectionalLight(0xd7f6ff, 5.5); key.position.set(-3, 5, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0x61abbc, 7); rim.position.set(4, -1, 3); scene.add(rim);
  const back = new THREE.PointLight(0x82bccb, 65, 18); back.position.set(-4, 1, -2); scene.add(back);

  const shape = new THREE.Shape(outlines[0].map(p => new THREE.Vector2(p[0], p[1])));
  for (const outline of outlines.slice(1)) shape.holes.push(new THREE.Path(outline.map(p => new THREE.Vector2(p[0], p[1]))));
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: .19, bevelEnabled: true, bevelThickness: .033, bevelSize: .018, bevelSegments: 3, curveSegments: 12, steps: 1 });
  geometry.translate(0, 0, -.095);
  const edgeGeometry = new THREE.EdgesGeometry(geometry, 34);
  const assembly = new THREE.Group(); scene.add(assembly);
  const slices: THREE.Mesh[] = [];
  const edges: THREE.LineSegments[] = [];
  for (let i = 0; i < 9; i++) {
    const material = new THREE.MeshPhysicalMaterial({
      color: i === 0 ? 0x81b2bd : i % 3 === 0 ? 0x92b4ba : 0x2d5965,
      metalness: .91, roughness: .23, clearcoat: .8, clearcoatRoughness: .12,
      transparent: true, opacity: i === 0 ? 1 : .88,
      envMapIntensity: 1.4,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = -i * .23;
    const edge = new THREE.LineSegments(edgeGeometry, new THREE.LineBasicMaterial({ color: 0x8bdaeb, transparent: true, opacity: i === 0 ? .13 : .07 }));
    mesh.add(edge); assembly.add(mesh); slices.push(mesh); edges.push(edge);
  }
  // Architectural registration lines ground the brand geometry in depth.
  const floorGeometry = new THREE.BufferGeometry();
  const vertices: number[] = [];
  for (let i = -10; i <= 10; i++) { vertices.push(i * 1.7, -3.1, -18, i * 1.7, -3.1, 8); vertices.push(-17, -3.1, i * 1.7, 17, -3.1, i * 1.7); }
  floorGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  const grid = new THREE.LineSegments(floorGeometry, new THREE.LineBasicMaterial({ color: 0x49727d, transparent: true, opacity: .14 })); scene.add(grid);

  // Signal traces: purposeful layers rather than decorative particles.
  const traceGroup = new THREE.Group(); assembly.add(traceGroup);
  const traceMaterials: THREE.LineBasicMaterial[] = [];
  const traceGeometries: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 7; i++) {
    const points = Array.from({ length: 94 }, (_, j) => {
      const x = j / 93 * 9 - 4.5;
      const envelope = Math.exp(-x * x * .32);
      return new THREE.Vector3(x, Math.sin(x * 7.5 + i * .8) * envelope * .35 + (i - 3) * .085, -i * .36);
    });
    const g = new THREE.BufferGeometry().setFromPoints(points); traceGeometries.push(g);
    const m = new THREE.LineBasicMaterial({ color: i === 3 ? 0xc2f4ff : 0x61abbc, transparent: true, opacity: 0 }); traceMaterials.push(m);
    traceGroup.add(new THREE.Line(g, m));
  }

  let w = 0, h = 0;
  const resize = () => { w = host.clientWidth; h = host.clientHeight; renderer.setSize(w, h); camera.aspect = w / Math.max(1, h); camera.updateProjectionMatrix(); };
  const observer = new ResizeObserver(resize); observer.observe(host); resize();
  let frame = 0, disposed = false, visible = true, contextLost = false, time = 0, last = 0, p = progress.current;
  let px = 0, py = 0;
  const interpolate = THREE.MathUtils.lerp;
  const smooth = (a: number, b: number, value: number) => THREE.MathUtils.smoothstep(value, a, b);
  const render = (stamp: number) => {
    if (disposed || !visible || document.hidden || contextLost) { frame = 0; return; }
    const delta = Math.min((stamp - last) / 1000 || .016, .05); last = stamp;
    if (motion) time += delta;
    p = motion ? interpolate(p, progress.current, 1 - Math.exp(-delta * 9)) : 0;
    px = interpolate(px, motion ? pointer.current.x : 0, .035);
    py = interpolate(py, motion ? pointer.current.y : 0, .035);
    const pose = signalPose(p);
    const value = (key: keyof typeof pose) => pose[key];
    const mobile = w < 760;
    assembly.position.set(mobile ? .35 : value('x'), value('y') + (mobile ? -1.48 : 0), value('z'));
    assembly.rotation.set(value('rx') + py * .055 + Math.sin(time * .31) * .025, value('ry') + px * .10 + Math.sin(time * .27) * .09, value('rz'));
    assembly.scale.setScalar(value('scale') * (mobile ? .58 : 1));
    slices.forEach((mesh, i) => {
      mesh.position.z = -i * value('gap');
      mesh.position.x = Math.sin(i * .34 + time * .33) * .15 * smooth(.20, .5, p) * (1 - smooth(.65, .8, p));
      mesh.rotation.z = Math.sin(i * .25 + time * .15) * .018 * smooth(.18, .45, p);
      const m = mesh.material as THREE.MeshPhysicalMaterial;
      m.opacity = i === 0 ? 1 : .88;
    });
    const signalAlpha = smooth(.2, .38, p) * (1 - smooth(.7, .84, p));
    traceMaterials.forEach((m, i) => m.opacity = signalAlpha * (i === 3 ? .6 : .22));
    traceGroup.position.z = .4; traceGroup.rotation.z = Math.sin(time * .18) * .035;
    grid.material.opacity = .14 * (1 - smooth(.75, 1, p));
    camera.position.x = px * .06; camera.position.y = -py * .04;
    host.dataset.scVerifyState = [assembly.position.x.toFixed(2), assembly.rotation.y.toFixed(2), slices[8].position.z.toFixed(2), assembly.scale.x.toFixed(2)].join('|');
    renderer.render(scene, camera);
    if (motion) frame = requestAnimationFrame(render); else frame = 0;
  };
  const resume = () => { if (!disposed && !frame && visible && !document.hidden && !contextLost) { last = performance.now(); frame = requestAnimationFrame(render); } };
  const intersection = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) resume(); }, { rootMargin: '120px' }); intersection.observe(host);
  const visibility = () => { if (!document.hidden) resume(); };
  const lost = (event: Event) => { event.preventDefault(); contextLost = true; onReady(false); };
  const restored = () => { contextLost = false; onReady(true); resume(); };
  const refresh = () => { resize(); resume(); };
  renderer.domElement.addEventListener('webglcontextlost', lost);
  renderer.domElement.addEventListener('webglcontextrestored', restored);
  document.addEventListener('visibilitychange', visibility); addEventListener('resize', refresh);
  render(performance.now()); onReady(true);
  return () => {
    disposed = true; cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect();
    document.removeEventListener('visibilitychange', visibility); removeEventListener('resize', refresh);
    renderer.domElement.removeEventListener('webglcontextlost', lost); renderer.domElement.removeEventListener('webglcontextrestored', restored);
    slices.forEach(mesh => (mesh.material as THREE.Material).dispose());
    edges.forEach(edge => (edge.material as THREE.Material).dispose());
    traceMaterials.forEach(m => m.dispose()); traceGeometries.forEach(g => g.dispose());
    geometry.dispose(); edgeGeometry.dispose(); floorGeometry.dispose(); grid.material.dispose(); environment.dispose();
    renderer.dispose(); renderer.domElement.remove();
  };
}
