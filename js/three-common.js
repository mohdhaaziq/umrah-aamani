import * as THREE from 'three';
import { OrbitControls } from '../vendor/OrbitControls.js';

export { THREE };

export const PAL = {
  sky1: '#FBD9E6', sky2: '#CFE6FA', floor: '#FFF9F3', marble: '#F5EEE6',
  kiswah: '#2C2A38', gold: '#E9C46E', mint: '#9EE3C3', mintGlow: '#5ED39A',
  pink: '#F7BFD0', lilac: '#D7C9F3', peach: '#F8D7B8', sand: '#EAD2B0',
  skin: '#F2CDB0', skin2: '#D9A982', hair: '#4A3730', white: '#FFFFFF', ink: '#3B3550'
};

const mats = new Map();
export function mat(color, opts = {}) {
  const key = color + JSON.stringify(opts);
  if (!mats.has(key)) mats.set(key, new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness: 0, ...opts }));
  return mats.get(key);
}

// ---------- Tekstur (aset GPT Image) ----------
const _tl = new THREE.TextureLoader();
export function tex(name, { repeat = [1, 1], mirror = true, clampY = false } = {}) {
  const t = _tl.load(`./assets/tex/${name}.jpg`);
  t.colorSpace = THREE.SRGBColorSpace;
  // Mirrored repeat menyembunyikan sambungan tekstur yang belum seamless
  t.wrapS = mirror ? THREE.MirroredRepeatWrapping : THREE.RepeatWrapping;
  t.wrapT = clampY ? THREE.ClampToEdgeWrapping : t.wrapS;
  t.repeat.set(repeat[0], repeat[1]);
  t.anisotropy = 4;
  return t;
}
export function texMat(name, opts = {}, matOpts = {}) {
  return new THREE.MeshStandardMaterial({ map: tex(name, opts), color: '#FFFFFF', roughness: 0.75, metalness: 0, ...matOpts });
}
// Kubah langit: imej langit dibalut 3 kali mengelilingi pemain, dari bawah ufuk ke ~45° ke atas
function skyDome() {
  const t = tex('langit', { repeat: [3, 1], clampY: true });
  const top = Math.PI / 2 - 0.8, len = 0.8 + 0.22;
  const g = new THREE.SphereGeometry(95, 48, 12, 0, Math.PI * 2, top, len);
  const m = new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide, fog: false, depthWrite: false, toneMapped: false });
  const dome = new THREE.Mesh(g, m); dome.renderOrder = -1;
  return dome;
}

function skyTexture() {
  const c = document.createElement('canvas'); c.width = 4; c.height = 256;
  const g = c.getContext('2d');
  const grd = g.createLinearGradient(0, 0, 0, 256);
  grd.addColorStop(0, PAL.sky2); grd.addColorStop(0.55, '#E9E1FA'); grd.addColorStop(1, PAL.sky1);
  g.fillStyle = grd; g.fillRect(0, 0, 4, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

// Label "pil" comel yang terapung (sprite)
export function makeLabel(text, { bg = '#FFFFFF', fg = PAL.ink, scale = 1 } = {}) {
  const c = document.createElement('canvas');
  const g = c.getContext('2d');
  const font = '700 44px Fredoka, "Baloo 2", system-ui, sans-serif';
  g.font = font;
  const w = Math.ceil(g.measureText(text).width) + 56;
  c.width = w; c.height = 84;
  g.font = font;
  g.fillStyle = 'rgba(59,53,80,0.18)';
  roundRect(g, 4, 10, w - 8, 70, 35); g.fill();
  g.fillStyle = bg; roundRect(g, 4, 4, w - 8, 70, 35); g.fill();
  g.fillStyle = fg; g.textBaseline = 'middle'; g.textAlign = 'center';
  g.fillText(text, w / 2, 41);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: true, transparent: true }));
  s.scale.set((w / 84) * 0.55 * scale, 0.55 * scale, 1);
  s.renderOrder = 10;
  return s;
}
function roundRect(g, x, y, w, h, r) {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}

// ---------- Watak chibi ----------
const G = {
  head: new THREE.SphereGeometry(0.34, 24, 18),
  eye: new THREE.SphereGeometry(0.045, 10, 8),
  blush: new THREE.CircleGeometry(0.06, 14),
  body: new THREE.CylinderGeometry(0.26, 0.42, 0.78, 18),
  foot: new THREE.SphereGeometry(0.11, 12, 8),
  arm: new THREE.SphereGeometry(0.1, 12, 8),
  hairCap: new THREE.SphereGeometry(0.355, 22, 14, 0, Math.PI * 2, 0, Math.PI * 0.42),
  hood: new THREE.SphereGeometry(0.42, 22, 16),
  smile: new THREE.TorusGeometry(0.06, 0.014, 6, 12, Math.PI)
};

export function makeCharacter({ gender = 'm', skin = PAL.skin, shirt = PAL.white, simple = false } = {}) {
  const root = new THREE.Group();
  const bodyMat = mat(shirt, { roughness: 0.9 });
  const body = new THREE.Mesh(G.body, bodyMat); body.position.y = 0.52; body.castShadow = !simple;
  root.add(body);
  const head = new THREE.Group(); head.position.y = 1.18; root.add(head);
  const h = new THREE.Mesh(G.head, mat(skin)); h.castShadow = !simple; head.add(h);

  if (gender === 'f') {
    // telekung: tudung putih membalut kepala, muka terbuka
    const hood = new THREE.Mesh(G.hood, bodyMat);
    hood.scale.set(1, 1.02, 0.95); hood.position.set(0, 0.02, -0.09);
    head.add(hood);
    const cape = new THREE.Mesh(new THREE.ConeGeometry(0.52, 0.7, 18), bodyMat);
    cape.position.y = -0.33; head.add(cape);
  } else {
    const hair = new THREE.Mesh(G.hairCap, mat(PAL.hair)); hair.rotation.x = -0.25; head.add(hair);
    // idtiba': bahu kanan terdedah
    const sh = new THREE.Mesh(G.arm, mat(skin)); sh.position.set(-0.27, 0.78, 0.02); sh.scale.set(1.1, 0.9, 1);
    root.add(sh);
  }
  if (!simple) {
    const eyeM = mat(PAL.ink, { roughness: 0.3 });
    const e1 = new THREE.Mesh(G.eye, eyeM); e1.position.set(-0.11, 0.03, 0.31);
    const e2 = e1.clone(); e2.position.x = 0.11;
    const bM = new THREE.MeshBasicMaterial({ color: '#F6A6BC', transparent: true, opacity: 0.75 });
    const b1 = new THREE.Mesh(G.blush, bM); b1.position.set(-0.19, -0.07, 0.29); b1.rotation.y = -0.45;
    const b2 = new THREE.Mesh(G.blush, bM); b2.position.set(0.19, -0.07, 0.29); b2.rotation.y = 0.45;
    const sm = new THREE.Mesh(G.smile, eyeM); sm.position.set(0, -0.08, 0.325); sm.rotation.z = Math.PI;
    head.add(e1, e2, b1, b2, sm);
  }
  const armL = new THREE.Mesh(G.arm, mat(skin)); armL.position.set(0.36, 0.55, 0.05);
  const armR = new THREE.Mesh(G.arm, mat(skin)); armR.position.set(-0.36, 0.55, 0.05);
  root.add(armL, armR);
  const fL = new THREE.Mesh(G.foot, mat(PAL.skin2)); fL.position.set(0.13, 0.08, 0.04);
  const fR = new THREE.Mesh(G.foot, mat(PAL.skin2)); fR.position.set(-0.13, 0.08, 0.04);
  root.add(fL, fR);
  root.userData = { body, head, armL, armR, fL, fR, phase: Math.random() * 6 };
  return root;
}

// Animasi jalan comel (melompat kecil)
export function animateWalk(ch, dt, moving, speedMul = 1, raiseRight = 0) {
  const u = ch.userData;
  if (moving) u.phase += dt * 10 * speedMul;
  const s = moving ? Math.sin(u.phase) : 0;
  const bob = moving ? Math.abs(Math.sin(u.phase)) * 0.09 * speedMul : 0;
  u.body.position.y = 0.52 + bob; u.head.position.y = 1.18 + bob;
  u.head.rotation.z = s * 0.06;
  u.fL.position.z = 0.04 + s * 0.14; u.fR.position.z = 0.04 - s * 0.14;
  u.fL.position.y = 0.08 + Math.max(0, s) * 0.06; u.fR.position.y = 0.08 + Math.max(0, -s) * 0.06;
  u.armL.position.y = 0.55 + bob; u.armR.position.y = 0.55 + bob + raiseRight * 0.75;
  u.armR.position.z = 0.05 + raiseRight * 0.2;
}

// ---------- Pentas 3D asas ----------
export class Stage3D {
  constructor(container, { camDist = 9 } = {}) {
    this.container = container;
    this.lowPower = (navigator.hardwareConcurrency || 4) <= 4 || /Android [5-8]/.test(navigator.userAgent);
    this.renderer = new THREE.WebGLRenderer({ antialias: !this.lowPower, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.lowPower ? 1.5 : 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#A9D8FD');
    this.scene.add(skyDome());
    this.scene.fog = new THREE.Fog('#F6DDEE', 30, 75);

    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 220);
    this.camera.position.set(0, camDist * 0.6, camDist);

    const hemi = new THREE.HemisphereLight('#FFF4FA', '#E7D9C9', 1.6); this.scene.add(hemi);
    const sun = new THREE.DirectionalLight('#FFF1E0', 2.0);
    sun.position.set(10, 22, 8); sun.castShadow = true;
    sun.shadow.mapSize.set(this.lowPower ? 1024 : 2048, this.lowPower ? 1024 : 2048);
    const sc = sun.shadow.camera; sc.left = -22; sc.right = 22; sc.top = 22; sc.bottom = -22; sc.near = 1; sc.far = 60;
    sun.shadow.bias = -0.0005; sun.shadow.radius = 4;
    this.scene.add(sun); this.sun = sun;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enablePan = false;
    this.controls.enableDamping = true; this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 4.5; this.controls.maxDistance = 22;
    this.controls.maxPolarAngle = Math.PI * 0.46; this.controls.minPolarAngle = Math.PI * 0.12;

    this.clock = new THREE.Clock();
    this._raf = 0; this._alive = true;
    this._onResize = () => this.resize();
    window.addEventListener('resize', this._onResize);
    this._ro = new ResizeObserver(this._onResize); this._ro.observe(container);
    this.resize();
  }
  resize() {
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.fov = w < h ? 58 : 48;
    this.camera.updateProjectionMatrix();
  }
  // ikut pemain: gerakkan kamera & sasaran bersama delta kedudukan
  follow(pos, height = 1) {
    const t = this.controls.target;
    const dx = pos.x - t.x, dy = pos.y + height - t.y, dz = pos.z - t.z;
    t.x += dx; t.y += dy; t.z += dz;
    this.camera.position.x += dx; this.camera.position.y += dy; this.camera.position.z += dz;
  }
  start(update) {
    const loop = () => {
      if (!this._alive) return;
      this._raf = requestAnimationFrame(loop);
      const dt = Math.min(this.clock.getDelta(), 0.05);
      update(dt, this.clock.elapsedTime);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    this._raf = requestAnimationFrame(loop);
  }
  dispose() {
    this._alive = false; cancelAnimationFrame(this._raf);
    window.removeEventListener('resize', this._onResize);
    this._ro.disconnect();
    this.controls.dispose();
    this.scene.traverse(o => {
      if (o.isSprite) { o.material.map?.dispose(); o.material.dispose(); }
    });
    this.renderer.dispose();
    this.renderer.forceContextLoss?.();
    this.renderer.domElement.remove();
  }
}

export function marbleFloor(radius = 40, color = PAL.floor, material = null) {
  const g = new THREE.Group();
  const f = new THREE.Mesh(new THREE.CircleGeometry(radius, 64), material || mat(color, { roughness: 0.55 }));
  f.rotation.x = -Math.PI / 2; f.receiveShadow = true; g.add(f);
  return g;
}

export function minaret(h = 11) {
  const g = new THREE.Group();
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.55, h, 12), mat(PAL.marble)); shaft.position.y = h / 2;
  g.add(shaft);
  [0.35, 0.62, 0.85].forEach((k, i) => {
    const r = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.22, 14), mat(i % 2 ? PAL.pink : PAL.lilac));
    r.position.y = h * k; g.add(r);
  });
  const cap = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.6, 12), mat(PAL.gold, { metalness: 0.35, roughness: 0.4 }));
  cap.position.y = h + 0.8; g.add(cap);
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), mat(PAL.gold, { metalness: 0.4, roughness: 0.35 }));
  ball.position.y = h + 1.75; g.add(ball);
  return g;
}

export function cloud() {
  const g = new THREE.Group();
  const m = mat('#FFFFFF', { roughness: 1, emissive: '#FFFFFF', emissiveIntensity: 0.15 });
  [[0, 0, 0, 1.4], [1.3, -0.2, 0.2, 1.0], [-1.3, -0.25, 0, 1.05], [0.5, 0.5, -0.2, 0.9]].forEach(([x, y, z, r]) => {
    const s = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 10), m); s.position.set(x, y, z); g.add(s);
  });
  return g;
}

export function sparkleBurst(scene, pos, color = PAL.gold) {
  const group = new THREE.Group();
  const geo = new THREE.OctahedronGeometry(0.09, 0);
  const parts = [];
  for (let i = 0; i < 14; i++) {
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: i % 2 ? color : '#FFFFFF', transparent: true }));
    m.position.copy(pos);
    const v = new THREE.Vector3((Math.random() - 0.5) * 2, Math.random() * 2 + 1, (Math.random() - 0.5) * 2);
    parts.push({ m, v }); group.add(m);
  }
  scene.add(group);
  let t = 0;
  return (dt) => {
    t += dt;
    parts.forEach(p => { p.m.position.addScaledVector(p.v, dt); p.v.y -= dt * 3; p.m.rotation.y += dt * 6; p.m.material.opacity = Math.max(0, 1 - t / 0.9); });
    if (t > 0.9) { scene.remove(group); parts.forEach(p => p.m.material.dispose()); return false; }
    return true;
  };
}
