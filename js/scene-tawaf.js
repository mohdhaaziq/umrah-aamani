import { THREE, Stage3D, PAL, mat, tex, texMat, makeCharacter, animateWalk, makeLabel, marbleFloor, minaret, cloud, sparkleBurst } from './three-common.js';
import { sfx } from './audio.js';

const TAU = Math.PI * 2;
const R = 6;              // jejari laluan pemain
const SPEED = 3.0 * (Number(new URLSearchParams(location.search).get('laju')) || 1); // unit/saat

export function createTawaf(container, { gender = 'm', onEvent = () => {} } = {}) {
  const st = new Stage3D(container, { camDist: 9 });
  const { scene } = st;

  // ---------- Mataf & Masjidil Haram mini ----------
  const marbleM = texMat('tex-marmar', { repeat: [1, 1] }, { roughness: 0.5 });
  scene.add(marbleFloor(45, PAL.floor, texMat('tex-marmar', { repeat: [16, 16] }, { roughness: 0.45 })));
  // corak lantai: gelang pastel
  [3.6, 7.5, 11.5].forEach((r, i) => {
    const ring = new THREE.Mesh(new THREE.RingGeometry(r - 0.05, r + 0.05, 96), mat(i % 2 ? PAL.lilac : PAL.pink, { roughness: 0.6 }));
    ring.rotation.x = -Math.PI / 2; ring.position.y = 0.005; scene.add(ring);
  });

  // Kaabah (diputar 45° supaya penjuru menghala paksi)
  const kaabah = new THREE.Group(); kaabah.rotation.y = Math.PI / 4; scene.add(kaabah);
  const kiswahM = texMat('tex-kiswah', { repeat: [1, 1.2] }, { roughness: 0.85, color: '#C9C5D6' });
  const kbody = new THREE.Mesh(new THREE.BoxGeometry(3, 3.6, 3), kiswahM);
  kbody.position.y = 1.8; kbody.castShadow = true; kbody.receiveShadow = true; kaabah.add(kbody);
  const goldM = mat(PAL.gold, { metalness: 0.45, roughness: 0.35 });
  const bandM = texMat('tex-jalur-emas', { repeat: [6, 1] }, { metalness: 0.25, roughness: 0.45 });
  const band = new THREE.Mesh(new THREE.BoxGeometry(3.04, 0.5, 3.04), [bandM, bandM, goldM, goldM, bandM, bandM]);
  band.position.y = 2.7; kaabah.add(band);
  const base = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.22, 3.2), marbleM); base.position.y = 0.11; kaabah.add(base);

  // Pintu Kaabah pada dinding yang menghala θ=45° (antara Hajar Aswad & Rukun Iraqi)
  const n45 = new THREE.Vector3(Math.cos(Math.PI / 4), 0, -Math.sin(Math.PI / 4));
  const doorM = texMat('tex-pintu-kaabah', { mirror: false }, { metalness: 0.3, roughness: 0.4 });
  const door = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.3, 0.08), [goldM, goldM, goldM, goldM, doorM, goldM]);
  door.position.copy(n45.clone().multiplyScalar(1.53)); door.position.y = 1.6;
  door.rotation.y = Math.atan2(n45.x, n45.z); scene.add(door);

  // Hajar Aswad di penjuru +x
  const haGroup = new THREE.Group(); haGroup.position.set(2.13, 1.1, 0); scene.add(haGroup);
  const frame = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.06, 10, 20), mat('#D8DCE6', { metalness: 0.7, roughness: 0.25 }));
  frame.rotation.y = Math.PI / 2; haGroup.add(frame);
  const stone = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 10), mat('#1B1A22', { roughness: 0.4 })); haGroup.add(stone);

  // Garisan hijau permulaan tawaf
  const line = new THREE.Mesh(new THREE.PlaneGeometry(12, 0.16), new THREE.MeshBasicMaterial({ color: PAL.mintGlow }));
  line.rotation.x = -Math.PI / 2; line.position.set(2.2 + 6, 0.012, 0); scene.add(line);
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 12), new THREE.MeshStandardMaterial({ color: PAL.mintGlow, emissive: PAL.mintGlow, emissiveIntensity: 1.4 }));
  lamp.position.set(15.6, 3.0, 0); scene.add(lamp);

  // Hijir Ismail: dinding separuh bulatan di sisi θ=135°
  const hijir = new THREE.Group();
  const hdir = 3 * Math.PI / 4;
  hijir.position.set(Math.cos(hdir) * 1.5, 0, -Math.sin(hdir) * 1.5);
  hijir.rotation.y = hdir;
  const segs = 18;
  for (let i = 0; i <= segs; i++) {
    const a = -Math.PI / 2 + (Math.PI * i) / segs;
    const x = Math.cos(a) * 2.1, z = Math.sin(a) * 1.55;
    const seg = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.75, 0.32), marbleM);
    seg.position.set(x, 0.375, z); seg.rotation.y = -a; seg.castShadow = true; hijir.add(seg);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.34), mat(PAL.lilac)); cap.position.set(x, 0.79, z); cap.rotation.y = -a; hijir.add(cap);
  }
  scene.add(hijir);

  // Maqam Ibrahim di hadapan pintu
  const maqam = new THREE.Group();
  maqam.position.copy(n45.clone().multiplyScalar(3.6));
  const mb = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.42, 0.25, 8), marbleM); mb.position.y = 0.12;
  const mc = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.75, 8, 1, true), mat(PAL.gold, { metalness: 0.45, roughness: 0.3, side: THREE.DoubleSide, transparent: true, opacity: 0.92 }));
  mc.position.y = 0.62;
  const md = new THREE.Mesh(new THREE.SphereGeometry(0.31, 14, 10, 0, TAU, 0, Math.PI / 2), mat(PAL.gold, { metalness: 0.5, roughness: 0.3 })); md.position.y = 1.0;
  const mt = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.25, 8), mat(PAL.gold, { metalness: 0.5 })); mt.position.y = 1.42;
  maqam.add(mb, mc, md, mt); maqam.traverse(o => { if (o.isMesh) o.castShadow = true; }); scene.add(maqam);

  // Label tempat
  const labels = [
    ['Hajar Aswad', new THREE.Vector3(2.6, 4.4, 0), '#1F1D2A', '#FFFFFF'],
    ['Rukun Iraqi', new THREE.Vector3(0, 4.4, -2.6)],
    ['Rukun Syami', new THREE.Vector3(-2.6, 4.4, 0)],
    ['Rukun Yamani', new THREE.Vector3(0, 4.4, 2.6)],
    ['Hijir Ismail', new THREE.Vector3(Math.cos(hdir) * 3.9, 1.6, -Math.sin(hdir) * 3.9), PAL.lilac],
    ['Maqam Ibrahim', maqam.position.clone().add(new THREE.Vector3(0, 2.0, 0)), '#FCEBC0'],
    ['Pintu Kaabah', door.position.clone().add(new THREE.Vector3(0.5, 1.1, -0.5)), '#FCEBC0']
  ];
  labels.forEach(([t, p, bg = '#FFFFFF', fg]) => { const l = makeLabel(t, { bg, fg, scale: 0.85 }); l.position.copy(p); scene.add(l); });

  // Serambi tiang (colonnade) & menara
  const CR = 16, NP = 32;
  for (let i = 0; i < NP; i++) {
    const a = (i / NP) * TAU;
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 3.2, 10), marbleM);
    p.position.set(Math.cos(a) * CR, 1.6, Math.sin(a) * CR); p.castShadow = true; scene.add(p);
    const a2 = ((i + 0.5) / NP) * TAU;
    const span = 2 * CR * Math.sin(Math.PI / NP);
    const arch = new THREE.Mesh(new THREE.TorusGeometry(span / 2, 0.14, 8, 18, Math.PI), mat(i % 2 ? PAL.pink : PAL.lilac));
    arch.position.set(Math.cos(a2) * CR, 3.2, Math.sin(a2) * CR);
    arch.rotation.y = -a2 + Math.PI / 2; scene.add(arch);
  }
  const roof = new THREE.Mesh(new THREE.CylinderGeometry(CR + 0.6, CR + 0.6, 0.4, 64, 1, true), mat(PAL.peach, { side: THREE.DoubleSide }));
  roof.position.y = 4.3; scene.add(roof);
  [0.3, 1.9, 3.4, 4.8].forEach(a => { const m = minaret(12); m.position.set(Math.cos(a) * 21, 0, Math.sin(a) * 21); scene.add(m); });
  const clouds = [];
  for (let i = 0; i < 6; i++) {
    const c = cloud(); const a = Math.random() * TAU;
    c.position.set(Math.cos(a) * 30, 14 + Math.random() * 6, Math.sin(a) * 30); c.scale.setScalar(1 + Math.random());
    scene.add(c); clouds.push({ c, a, r: 30 + Math.random() * 6, s: 0.01 + Math.random() * 0.02 });
  }

  // ---------- Orang ramai ----------
  const crowd = [];
  const nCrowd = st.lowPower ? 26 : 44;
  for (let i = 0; i < nCrowd; i++) {
    const g = Math.random() < 0.45 ? 'f' : 'm';
    const ch = makeCharacter({ gender: g, simple: true, skin: Math.random() < 0.5 ? PAL.skin : PAL.skin2 });
    let r;
    do { r = 3.9 + Math.random() * 7.5; } while (r > 5.2 && r < 6.8);
    const a = Math.random() * TAU;
    ch.scale.setScalar(0.9 + Math.random() * 0.15);
    scene.add(ch);
    crowd.push({ ch, r, a, w: (1.1 + Math.random() * 0.9) / r });
  }

  // ---------- Pemain ----------
  const player = makeCharacter({ gender });
  scene.add(player);
  const halo = new THREE.Mesh(new THREE.RingGeometry(0.5, 0.68, 32), new THREE.MeshBasicMaterial({ color: PAL.pink, transparent: true, opacity: 0.9 }));
  halo.rotation.x = -Math.PI / 2; halo.position.y = 0.02; player.add(halo);
  const me = makeLabel('Saya', { bg: PAL.pink, scale: 0.7 }); me.position.y = 2.0; player.add(me);

  // ---------- Keadaan permainan ----------
  const s = {
    theta: -0.22, walking: false, paused: false, nextLine: 0, round: 0, done: false,
    zone: null, raise: 0, effects: [], gender
  };
  const posAt = (th) => new THREE.Vector3(Math.cos(th) * R, 0, -Math.sin(th) * R);

  // posisi kamera awal: di belakang & luar pemain
  const p0 = posAt(s.theta);
  st.controls.target.set(p0.x, 1, p0.z);
  st.camera.position.set(p0.x + 8, 6.5, p0.z + 3.5);
  player.position.copy(p0);

  let stepT = 0;
  st.start((dt, t) => {
    // orang ramai berlegar lawan arah jam
    for (const c of crowd) {
      c.a += c.w * dt;
      c.ch.position.set(Math.cos(c.a) * c.r, 0, -Math.sin(c.a) * c.r);
      c.ch.rotation.y = Math.atan2(-Math.sin(c.a), -Math.cos(c.a));
      animateWalk(c.ch, dt, true, 0.8);
    }
    clouds.forEach(o => { o.a += o.s * dt; o.c.position.x = Math.cos(o.a) * o.r; o.c.position.z = Math.sin(o.a) * o.r; });
    lamp.material.emissiveIntensity = 1.1 + Math.sin(t * 3) * 0.4;
    halo.material.opacity = 0.65 + Math.sin(t * 4) * 0.25;

    const moving = s.walking && !s.paused && !s.done;
    let dTheta = 0;
    if (moving) {
      dTheta = (SPEED / R) * dt;
      const lineTheta = s.nextLine * TAU;
      if (s.theta + dTheta >= lineTheta) {
        dTheta = lineTheta - s.theta;
        s.theta = lineTheta; s.paused = true;
        onEvent('istilam', { index: s.nextLine, round: s.round });
      } else s.theta += dTheta;
      stepT += dt; if (stepT > 0.32) { stepT = 0; sfx.step(); }
    }
    const pos = posAt(s.theta);
    player.position.copy(pos);
    if (s.paused) {
      // hadap Hajar Aswad & angkat tangan kanan
      const target = Math.atan2(-Math.cos(s.theta), Math.sin(s.theta));
      player.rotation.y = lerpAngle(player.rotation.y, target, Math.min(1, dt * 8));
      s.raise = Math.min(1, s.raise + dt * 4);
    } else {
      const target = Math.atan2(-Math.sin(s.theta), -Math.cos(s.theta));
      player.rotation.y = lerpAngle(player.rotation.y, target, Math.min(1, dt * 10));
      s.raise = Math.max(0, s.raise - dt * 4);
    }
    animateWalk(player, dt, moving, s.round <= 3 && s.gender === 'm' ? 1.25 : 1, s.raise);

    // kamera ikut & berpusing bersama pemain (kekalkan sudut pilihan pengguna)
    if (dTheta) {
      const off = st.camera.position.clone().sub(st.controls.target);
      off.applyAxisAngle(new THREE.Vector3(0, 1, 0), dTheta);
      st.camera.position.copy(st.controls.target).add(off);
    }
    st.follow(pos, 1);

    // zon doa
    if (s.round >= 1 && !s.done) {
      const phi = ((s.theta % TAU) + TAU) % TAU;
      let z = null;
      if (phi >= 1.5 * Math.PI - 0.12 && !s.paused) z = 'rabbana';
      else if (phi > 0.15 && phi < 0.9) z = 'pintu';
      if (z !== s.zone) { s.zone = z; onEvent('zone', { zone: z, round: s.round }); }
      onEvent('progress', { round: s.round, frac: phi / TAU });
    }
    s.effects = s.effects.filter(f => f(dt));
  });

  return {
    setWalking(b) { s.walking = b; },
    isPaused() { return s.paused; },
    // dipanggil selepas pemain menekan Istilam / Teruskan
    resume() {
      if (!s.paused) return;
      s.effects.push(sparkleBurst(scene, player.position.clone().add(new THREE.Vector3(0, 1.6, 0))));
      const idx = s.nextLine;
      s.paused = false;
      if (idx >= 7) { s.done = true; s.walking = false; onEvent('done', {}); return; }
      s.nextLine += 1;
      s.round = s.nextLine;
      onEvent('round', { round: s.round });
    },
    celebrate() { s.effects.push(sparkleBurst(scene, player.position.clone().add(new THREE.Vector3(0, 1.6, 0)), PAL.pink)); },
    dispose() { st.dispose(); }
  };
}

function lerpAngle(a, b, t) {
  let d = ((b - a + Math.PI) % TAU + TAU) % TAU - Math.PI;
  return a + d * t;
}
