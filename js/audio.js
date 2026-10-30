// Bunyi comel disintesis dengan Web Audio — tiada fail audio, ringan & offline.
let ctx = null;
let master = null;
let enabled = true;

function ensure() {
  if (!enabled) return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function setSound(on) { enabled = on; }
export function soundOn() { return enabled; }
export function unlockAudio() { ensure(); }

// Nada lembut ala kotak muzik / bell
function tone(freq, start, dur, { type = 'sine', vol = 0.25, slide = 0, attack = 0.008 } = {}) {
  const c = ensure(); if (!c) return;
  const t = c.currentTime + start;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq * slide), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(master);
  o.start(t); o.stop(t + dur + 0.02);
  // harmonik halus supaya bunyi "ting" lebih comel
  if (type === 'sine' && vol > 0.08) {
    const o2 = c.createOscillator(); const g2 = c.createGain();
    o2.type = 'sine'; o2.frequency.setValueAtTime(freq * 2.01, t);
    g2.gain.setValueAtTime(0.0001, t);
    g2.gain.exponentialRampToValueAtTime(vol * 0.18, t + attack);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.6);
    o2.connect(g2); g2.connect(master); o2.start(t); o2.stop(t + dur);
  }
}

function noise(start, dur, vol = 0.15, hp = 3000) {
  const c = ensure(); if (!c) return;
  const t = c.currentTime + start;
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const src = c.createBufferSource(); src.buffer = buf;
  const f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp;
  const g = c.createGain(); g.gain.value = vol;
  src.connect(f); f.connect(g); g.connect(master);
  src.start(t);
}

const N = { C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880, C6: 1046.5, E6: 1318.5, G6: 1568, G4: 392, E4: 329.6, C4: 261.6 };

export const sfx = {
  tap()     { tone(N.A5, 0, 0.09, { vol: 0.12, slide: 1.3, type: 'triangle' }); },
  pop()     { tone(500, 0, 0.12, { vol: 0.2, slide: 2.2, type: 'sine' }); },
  correct() { tone(N.E5, 0, 0.18, { vol: 0.22 }); tone(N.A5, 0.09, 0.3, { vol: 0.22 }); },
  wrong()   { tone(N.E4, 0, 0.16, { vol: 0.16, type: 'triangle', slide: 0.85 }); tone(N.C4, 0.12, 0.25, { vol: 0.14, type: 'triangle', slide: 0.85 }); },
  coin()    { [N.C6, N.E6, N.G6].forEach((f, i) => tone(f, i * 0.06, 0.18, { vol: 0.12 })); },
  step()    { tone(180 + Math.random() * 40, 0, 0.05, { vol: 0.05, type: 'triangle', slide: 0.7 }); },
  round()   { [N.G5, N.C6, N.E6].forEach((f, i) => tone(f, i * 0.1, 0.35, { vol: 0.18 })); },
  badge()   {
    [N.C5, N.E5, N.G5, N.C6].forEach((f, i) => tone(f, i * 0.09, 0.3, { vol: 0.2 }));
    tone(N.E6, 0.42, 0.7, { vol: 0.18 }); tone(N.G6, 0.42, 0.7, { vol: 0.1 });
    noise(0.4, 0.4, 0.05, 6000);
  },
  snip()    { noise(0, 0.06, 0.25, 4000); tone(1800, 0, 0.05, { vol: 0.08, type: 'square', slide: 0.5 }); },
  whoosh()  { noise(0, 0.25, 0.08, 1200); },
  levelup() { [N.C5, N.D5, N.E5, N.G5, N.A5, N.C6].forEach((f, i) => tone(f, i * 0.07, 0.25, { vol: 0.17 })); }
};
