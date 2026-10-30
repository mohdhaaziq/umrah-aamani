import { THREE, Stage3D, PAL, mat, tex, texMat, makeCharacter, animateWalk, makeLabel, cloud, sparkleBurst } from './three-common.js';
import { sfx } from './audio.js';

const END = 15;           // Safa di x=-END, Marwah di x=+END
const GREEN = [-4, 4];    // kawasan lampu hijau
const SPEED = 3.6 * (Number(new URLSearchParams(location.search).get('laju')) || 1);

export function createSai(container, { gender = 'm', onEvent = () => {} } = {}) {
  const st = new Stage3D(container, { camDist: 9 });
  const { scene } = st;
  scene.fog.near = 28; scene.fog.far = 70;

  // Lantai Mas'a
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(46, 12), texMat('tex-lantai-masa', { repeat: [11.5, 3] }, { roughness: 0.45 }));
  const marbleM = texMat('tex-marmar', { repeat: [1, 1] }, { roughness: 0.5 });
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  const outer = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), mat('#F3E7DA', { roughness: 1 }));
  outer.rotation.x = -Math.PI / 2; outer.position.y = -0.02; scene.add(outer);
  // jalur jubin pastel
  // pembahagi laluan
  const divider = new THREE.Mesh(new THREE.BoxGeometry(32, 0.35, 0.25), mat(PAL.pink)); divider.position.set(0, 0.17, -0.6); scene.add(divider);

  // kawasan hijau
  const gz = new THREE.Mesh(new THREE.PlaneGeometry(GREEN[1] - GREEN[0], 9), new THREE.MeshStandardMaterial({ color: PAL.mint, transparent: true, opacity: 0.55, roughness: 0.6 }));
  gz.rotation.x = -Math.PI / 2; gz.position.set(0, 0.01, 0); scene.add(gz);

  // tiang & bumbung
  const glowMat = new THREE.MeshStandardMaterial({ color: PAL.mintGlow, emissive: PAL.mintGlow, emissiveIntensity: 1.3 });
  for (let x = -20; x <= 20; x += 2.5) {
    [-4.6, 4.6].forEach(z => {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.3, 4.2, 10), marbleM);
      p.position.set(x, 2.1, z); p.castShadow = true; scene.add(p);
      if (x >= GREEN[0] && x <= GREEN[1]) {
        const g = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.5, 10), glowMat); g.position.set(x, 3.3, z); scene.add(g);
      }
    });
    [-4.6, 4.6].forEach(z => {
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.42, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat(x % 5 === 0 ? PAL.pink : PAL.lilac));
      cap.position.set(x, 4.75, z); scene.add(cap);
    });
  }
  [-4.6, 4.6].forEach(z => {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(42, 0.35, 0.4), mat(PAL.peach)); rail.position.set(0, 4.55, z); scene.add(rail);
  });
  // lampu hijau besar di siling (Milain Akhdharain)
  GREEN.forEach(x => {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.25, 9.4), glowMat); bar.position.set(x, 4.15, 0); scene.add(bar);
  });

  // Bukit Safa & Marwah (batu low-poly)
  const rockA = texMat('tex-batu-bukit', { repeat: [1, 1] }, { flatShading: true, roughness: 0.9 });
  const hill = (x, tint) => {
    const rockB = texMat('tex-batu-bukit', { repeat: [1, 1] }, { flatShading: true, roughness: 0.9, color: tint });
    const g = new THREE.Group(); g.position.set(x, 0, 0);
    const rocks = [[0, 0.9, 0, 1.9], [0.9, 0.5, 1.6, 1.3], [-0.6, 0.5, -1.7, 1.25], [0.3, 1.9, 0.3, 1.0], [-0.9, 0.6, 1.3, 1.0], [0.8, 0.4, -1.1, 1.0]];
    rocks.forEach(([rx, ry, rz, r], i) => {
      const m = new THREE.Mesh(new THREE.DodecahedronGeometry(r, 0), i % 2 ? rockA : rockB);
      m.position.set(rx, ry, rz); m.rotation.set(i, i * 2, i * 0.5); m.castShadow = true; m.receiveShadow = true; g.add(m);
    });
    scene.add(g); return g;
  };
  hill(-END - 2.6, '#FFFFFF');
  hill(END + 2.6, '#FBE3EA');
  const lSafa = makeLabel('Bukit Safa', { bg: '#FCEBC0' }); lSafa.position.set(-END - 2.4, 4.3, 0); scene.add(lSafa);
  const lMarwah = makeLabel('Bukit Marwah', { bg: '#F8D3DE' }); lMarwah.position.set(END + 2.4, 4.3, 0); scene.add(lMarwah);
  const lHijau = makeLabel('Lampu Hijau', { bg: '#CFF3E1' }); lHijau.position.set(0, 5.4, 0); scene.add(lHijau);

  const clouds = [];
  for (let i = 0; i < 5; i++) {
    const c = cloud(); c.position.set(-30 + i * 14, 13 + Math.random() * 5, -14 - Math.random() * 10);
    c.scale.setScalar(1 + Math.random()); scene.add(c); clouds.push(c);
  }

  // orang ramai berjalan dua hala
  const crowd = [];
  const n = st.lowPower ? 18 : 30;
  for (let i = 0; i < n; i++) {
    const g = Math.random() < 0.45 ? 'f' : 'm';
    const ch = makeCharacter({ gender: g, simple: true, skin: Math.random() < 0.5 ? PAL.skin : PAL.skin2 });
    const dir = Math.random() < 0.5 ? 1 : -1;
    const z = dir === 1 ? 0.1 + Math.random() * 3.6 : -1.3 - Math.random() * 2.9;
    let zz = z; if (dir === 1 && Math.abs(zz - 1.6) < 0.5) zz += 1.0;
    ch.position.set(-END + Math.random() * END * 2, 0, zz);
    ch.rotation.y = dir === 1 ? Math.PI / 2 : -Math.PI / 2;
    scene.add(ch); crowd.push({ ch, dir, v: 1.4 + Math.random() * 1.0 });
  }

  // pemain
  const player = makeCharacter({ gender });
  const halo = new THREE.Mesh(new THREE.RingGeometry(0.5, 0.68, 32), new THREE.MeshBasicMaterial({ color: PAL.pink, transparent: true, opacity: 0.9 }));
  halo.rotation.x = -Math.PI / 2; halo.position.y = 0.02; player.add(halo);
  const me = makeLabel('Saya', { bg: PAL.pink, scale: 0.7 }); me.position.y = 2.0; player.add(me);
  scene.add(player);

  const LANE = 1.6;
  const s = { swing: 0, x: -END, dir: 1, laluan: 1, walking: false, paused: true, done: false, inGreen: false, run: 0, effects: [], gender };
  player.position.set(s.x, 0, LANE);
  player.rotation.y = -Math.PI / 2; // menghadap Kaabah di awal (doa di Safa)
  st.controls.target.set(s.x, 1, LANE);
  st.camera.position.set(s.x - 5, 8.5, LANE + 1.2);

  let stepT = 0;
  st.start((dt, t) => {
    for (const c of crowd) {
      c.ch.position.x += c.dir * c.v * dt;
      if (c.ch.position.x > END + 0.5) c.ch.position.x = -END - 0.5;
      if (c.ch.position.x < -END - 0.5) c.ch.position.x = END + 0.5;
      const ig = c.ch.position.x > GREEN[0] && c.ch.position.x < GREEN[1];
      animateWalk(c.ch, dt, true, ig ? 1.2 : 0.8);
    }
    halo.material.opacity = 0.65 + Math.sin(t * 4) * 0.25;
    glowMat.emissiveIntensity = 1.1 + Math.sin(t * 2.5) * 0.35;

    const moving = s.walking && !s.paused && !s.done;
    const inGreen = s.x > GREEN[0] && s.x < GREEN[1];
    if (inGreen !== s.inGreen) { s.inGreen = inGreen; onEvent('green', { inside: inGreen, laluan: s.laluan }); }
    if (!inGreen) s.run = 0;
    const mul = inGreen && s.run ? 1.6 : 1;
    if (moving) {
      s.x += s.dir * SPEED * mul * dt;
      const goal = s.dir === 1 ? END : -END;
      if ((s.dir === 1 && s.x >= goal) || (s.dir === -1 && s.x <= goal)) {
        s.x = goal; s.paused = true;
        onEvent('arrive', { at: s.dir === 1 ? 'marwah' : 'safa', laluan: s.laluan });
      }
      stepT += dt; if (stepT > 0.3 / mul) { stepT = 0; sfx.step(); }
    }
    player.position.set(s.x, 0, LANE);
    let face = s.dir === 1 ? Math.PI / 2 : -Math.PI / 2;
    if (s.paused) face = Math.PI; // menghadap Kaabah (arah -z) ketika berdoa
    const d = ((face - player.rotation.y + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
    player.rotation.y += d * Math.min(1, dt * 8);
    animateWalk(player, dt, moving, mul, s.paused && !s.done ? 0.8 : 0);
    if (s.swing > 0) {
      // pusing kamera ke belakang pemain bila arah bertukar
      const step = Math.min(s.swing, dt * Math.PI * 1.4);
      const off = st.camera.position.clone().sub(st.controls.target);
      off.applyAxisAngle(new THREE.Vector3(0, 1, 0), step);
      st.camera.position.copy(st.controls.target).add(off);
      s.swing -= step;
    }
    st.follow(player.position, 1);
    if (!s.done) onEvent('progress', { laluan: s.laluan, frac: s.dir === 1 ? (s.x + END) / (2 * END) : (END - s.x) / (2 * END) });
    s.effects = s.effects.filter(f => f(dt));
  });

  return {
    setWalking(b) { s.walking = b; },
    setRun(b) { s.run = b ? 1 : 0; },
    isPaused() { return s.paused; },
    // mula / sambung selepas doa di Safa atau Marwah
    resume() {
      if (!s.paused) return;
      s.effects.push(sparkleBurst(scene, player.position.clone().add(new THREE.Vector3(0, 1.6, 0))));
      if (s.x <= -END + 0.01 && s.dir === 1 && s.laluan === 1 && !s.started) { s.started = true; s.paused = false; onEvent('laluan', { laluan: 1 }); return; }
      if (s.laluan >= 7) { s.done = true; s.walking = false; onEvent('done', {}); return; }
      s.laluan += 1; s.dir *= -1; s.paused = false; s.swing = Math.PI;
      onEvent('laluan', { laluan: s.laluan });
    },
    celebrate() { s.effects.push(sparkleBurst(scene, player.position.clone().add(new THREE.Vector3(0, 1.6, 0)), PAL.mintGlow)); },
    dispose() { st.dispose(); }
  };
}
