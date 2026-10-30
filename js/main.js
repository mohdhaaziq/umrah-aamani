import { DOA, STAGES, KENALI_KAD, KENALI_KUIZ, IHRAM_LANGKAH, LARANGAN, SELEPAS_TAWAF, SYARAT_TAWAF, KUIZ_AKHIR, BADGES, LEVELS, MASKOT_TIPS } from './content.js';
import { sfx, setSound, unlockAudio } from './audio.js';

// ================= Keadaan & simpanan =================
const KEY = 'jomUmrah.v1';
const fresh = () => ({ name: '', gender: 'm', points: 0, badges: {}, done: {}, stars: {}, doa: {}, hafal: {}, sound: true, vibe: true, onboarded: false, tip: 0 });
let S = load();
function load() { try { return { ...fresh(), ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { return fresh(); } }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} }
setSound(S.sound);

const $ = (sel, root = document) => root.querySelector(sel);
const app = $('#app');
const esc = (t) => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const vibe = (p = 12) => { if (S.vibe && navigator.vibrate) try { navigator.vibrate(p); } catch {} };

// ================= Gamifikasi =================
function levelOf(p) { let l = 0; LEVELS.forEach((L, i) => { if (p >= L.min) l = i; }); return l; }
function addPoints(n, from) {
  if (!n) return;
  const before = levelOf(S.points);
  S.points += n; save();
  floatPoints(n, from);
  sfx.coin();
  updateHeader();
  const after = levelOf(S.points);
  if (after > before) setTimeout(() => showLevelUp(after), 500);
}
function giveBadge(id) {
  if (!id || S.badges[id]) return false;
  S.badges[id] = Date.now(); save();
  const b = BADGES.find(x => x.id === id);
  setTimeout(() => showBadge(b), 350);
  return true;
}
function unlockDoa(...ids) {
  ids.forEach(id => { S.doa[id] = true; });
  save();
  if (Object.keys(DOA).every(k => S.doa[k])) giveBadge('doa');
}
function stageUnlocked(i) { return i === 0 || !!S.done[STAGES[i - 1].id]; }
function completeStage(id, stars) {
  const first = !S.done[id];
  S.done[id] = true;
  S.stars[id] = Math.max(S.stars[id] || 0, stars);
  save();
  return first;
}

// ================= Komponen UI =================
const ico = (id, cls = '', alt = '') => `<img class="ico ${cls}" src="./assets/icons/${id}.webp" alt="${alt}" draggable="false" decoding="async">`;
const mascotSVG = (size = 64, ceria = false) => `<img class="mascot" src="./assets/icons/${ceria ? 'mascot-jamal-ceria' : 'mascot-jamal'}.webp" width="${size}" height="${size}" alt="" draggable="false">`;
const starIco = () => ico('mata-bintang', 'star', 'mata');

function header() {
  const lv = levelOf(S.points);
  const cur = LEVELS[lv].min, nxt = LEVELS[lv + 1]?.min;
  const pct = nxt ? Math.round(((S.points - cur) / (nxt - cur)) * 100) : 100;
  return `<header class="topbar">
    <div class="who">
      <div class="avatar ${S.gender}">${ico(S.gender === 'f' ? 'avatar-perempuan' : 'avatar-lelaki')}</div>
      <div><div class="hello">Assalamualaikum,</div><div class="pname">${esc(S.name || 'Tetamu')}</div></div>
    </div>
    <div class="pts" id="ptsBox">${starIco()}<b id="ptsVal">${S.points}</b></div>
  </header>
  <div class="lvl"><span class="lvl-name" id="lvlName">Tahap ${lv + 1} · ${LEVELS[lv].nama}</span>
    <div class="bar"><i id="lvlBar" style="width:${pct}%"></i></div>
    <span class="lvl-next" id="lvlNext">${nxt ? `${nxt - S.points} lagi` : 'Maksimum!'}</span></div>`;
}
function updateHeader() {
  const v = $('#ptsVal'); if (!v) return;
  v.textContent = S.points;
  $('#ptsBox')?.classList.remove('bump'); void $('#ptsBox')?.offsetWidth; $('#ptsBox')?.classList.add('bump');
  if (!$('#lvlName')) return;
  const lv = levelOf(S.points); const cur = LEVELS[lv].min, nxt = LEVELS[lv + 1]?.min;
  $('#lvlName').textContent = `Tahap ${lv + 1} · ${LEVELS[lv].nama}`;
  $('#lvlBar').style.width = (nxt ? Math.round(((S.points - cur) / (nxt - cur)) * 100) : 100) + '%';
  $('#lvlNext').textContent = nxt ? `${nxt - S.points} lagi` : 'Maksimum!';
  $('#ptsBox')?.classList.remove('bump'); void $('#ptsBox')?.offsetWidth; $('#ptsBox')?.classList.add('bump');
}

function floatPoints(n, from) {
  const el = document.createElement('div');
  el.className = 'floatpts'; el.innerHTML = `+${n} ${starIco()}`;
  let x = window.innerWidth / 2, y = window.innerHeight * 0.4;
  if (from?.getBoundingClientRect) { const r = from.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top; }
  el.style.left = x + 'px'; el.style.top = y + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1100);
}

function toast(msg) {
  const el = document.createElement('div'); el.className = 'toast'; el.textContent = msg;
  document.body.appendChild(el); setTimeout(() => el.remove(), 2400);
}

function modal(html, { onClose, cls = '' } = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'modal-wrap';
  wrap.innerHTML = `<div class="modal ${cls}" role="dialog" aria-modal="true">${html}</div>`;
  document.body.appendChild(wrap);
  requestAnimationFrame(() => wrap.classList.add('in'));
  const close = () => { wrap.classList.remove('in'); setTimeout(() => wrap.remove(), 220); onClose?.(); };
  wrap.addEventListener('click', e => { if (e.target === wrap || e.target.closest('[data-close]')) { sfx.tap(); close(); } });
  return { el: wrap, close };
}

// Barisan pop-up supaya lencana / naik tahap muncul satu demi satu
const popQ = []; let popBusy = false;
function enqueue(fn) { popQ.push(fn); if (!popBusy) nextPop(); }
function nextPop() { const fn = popQ.shift(); if (!fn) { popBusy = false; return; } popBusy = true; fn(() => setTimeout(nextPop, 150)); }
function showBadge(b) { enqueue(done => _showBadge(b, done)); }
function showLevelUp(lv) { enqueue(done => _showLevelUp(lv, done)); }
function _showBadge(b, done) {
  sfx.badge(); vibe([20, 40, 20]); confetti();
  modal(`<div class="badge-big pop">${ico(b.ikon)}</div><div class="eyebrow">Lencana baharu!</div>
    <h2>${b.nama}</h2><p>${b.desc}</p><button class="btn primary" data-close>Alhamdulillah!</button>`, { cls: 'center', onClose: done });
}
function _showLevelUp(lv, done) {
  sfx.levelup(); confetti();
  modal(`<div class="badge-big pop plain">${ico('naik-tahap')}</div><div class="eyebrow">Naik tahap!</div>
    <h2>Tahap ${lv + 1}: ${LEVELS[lv].nama}</h2><p>Teruskan perjalanan, tetamu Allah!</p><button class="btn primary" data-close>Yeay!</button>`, { cls: 'center', onClose: done });
}

function doaCard(d, { compact = false } = {}) {
  return `<div class="doa ${compact ? 'compact' : ''}">
    <div class="doa-t">${d.tajuk}</div>
    <div class="arab" lang="ar" dir="rtl">${d.arab}</div>
    <div class="rumi">${d.rumi}</div>
    ${compact ? '' : `<div class="maksud">${d.maksud}</div>`}
  </div>`;
}

// Konfeti pastel
function confetti() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = document.createElement('canvas'); c.className = 'confetti';
  c.width = innerWidth * devicePixelRatio; c.height = innerHeight * devicePixelRatio;
  document.body.appendChild(c);
  const g = c.getContext('2d'); g.scale(devicePixelRatio, devicePixelRatio);
  const cols = ['#F7BFD0', '#D7C9F3', '#A8E6CB', '#CDE5F8', '#FBE7A8', '#F8D7B8'];
  const P = Array.from({ length: 90 }, () => ({ x: innerWidth / 2 + (Math.random() - 0.5) * 120, y: innerHeight * 0.35, vx: (Math.random() - 0.5) * 9, vy: -Math.random() * 10 - 4, r: Math.random() * 6 + 4, c: cols[Math.floor(Math.random() * cols.length)], a: Math.random() * 6, s: Math.random() < 0.5 }));
  let t = 0;
  const step = () => {
    t++; g.clearRect(0, 0, innerWidth, innerHeight);
    P.forEach(p => { p.vy += 0.28; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.a += 0.15;
      g.save(); g.translate(p.x, p.y); g.rotate(p.a); g.fillStyle = p.c;
      if (p.s) { g.beginPath(); g.arc(0, 0, p.r / 1.6, 0, 7); g.fill(); } else g.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2);
      g.restore(); });
    if (t < 140) requestAnimationFrame(step); else c.remove();
  };
  step();
}

// ================= Router =================
let cleanup = null;
function go(view, arg) {
  if (cleanup) { try { cleanup(); } catch {} cleanup = null; }
  window.scrollTo(0, 0);
  app.className = '';
  const views = { home, onboard, doaPage, badgePage, settings, stage: openStage };
  (views[view] || home)(arg);
}

function nav(active) {
  const items = [['home', 'tab-peta', 'Peta'], ['doaPage', 'tab-doa', 'Kitab Doa'], ['badgePage', 'tab-lencana', 'Lencana'], ['settings', 'tab-tetapan', 'Tetapan']];
  return `<nav class="tabbar">${items.map(([v, i, l]) => `<button class="tab ${v === active ? 'on' : ''}" data-go="${v}">${ico(i, 'tab-ic')}${l}</button>`).join('')}</nav>`;
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-go]');
  if (b) { sfx.tap(); go(b.dataset.go); }
});

// ================= Skrin: Onboarding =================
function onboard() {
  let g = S.gender || 'm';
  app.innerHTML = `<section class="screen onboard">
    <div class="ob-hero">${mascotSVG(120)}<div class="bubble">Assalamualaikum! Saya <b>Jamal</b>. Jom kita belajar umrah langkah demi langkah!</div></div>
    <h1 class="logo">Umrah <span>Aamani</span></h1>
    <label class="field" for="nm">Nama anda<input id="nm" maxlength="18" placeholder="cth: Aisyah" value="${esc(S.name)}"></label>
    <div class="field">Pilih watak</div>
    <div class="pick">
      <button class="pick-c ${g === 'm' ? 'on' : ''}" data-g="m">${ico('avatar-lelaki')}Lelaki<small>2 helai kain ihram</small></button>
      <button class="pick-c ${g === 'f' ? 'on' : ''}" data-g="f">${ico('avatar-perempuan')}Perempuan<small>Telekung putih</small></button>
    </div>
    <button class="btn primary big" id="startBtn">Mula Perjalanan ✨</button>
    <p class="fine">Rujukan ringkas mengikut Mazhab Syafie. Sahkan dengan guru dan panduan Lembaga Tabung Haji.</p>
  </section>`;
  app.querySelectorAll('[data-g]').forEach(b => b.onclick = () => {
    sfx.pop(); g = b.dataset.g; app.querySelectorAll('[data-g]').forEach(x => x.classList.toggle('on', x === b));
  });
  $('#startBtn').onclick = () => {
    unlockAudio(); sfx.correct();
    S.name = ($('#nm').value || '').trim() || 'Tetamu'; S.gender = g;
    const first = !S.onboarded; S.onboarded = true; save();
    go('home');
    if (first) { giveBadge('mula'); addPoints(10); }
  };
}

// ================= Skrin: Peta (Home) =================
function home() {
  const tip = MASKOT_TIPS[S.tip % MASKOT_TIPS.length];
  const nodes = STAGES.map((st, i) => {
    const open = stageUnlocked(i), done = !!S.done[st.id], stars = S.stars[st.id] || 0;
    const cls = done ? 'done' : open ? 'open' : 'locked';
    const next = open && !done;
    return `<li class="node ${cls} ${i % 2 ? 'r' : 'l'} ${next ? 'next' : ''}">
      <button class="node-btn" data-stage="${st.id}" style="--c:${st.warna}" ${open ? '' : 'aria-disabled="true"'}>
        ${ico(open ? st.icon : 'stage-terkunci', 'node-ic')}
      </button>
      <div class="node-info"><div class="node-no">Peringkat ${st.no}</div><div class="node-name">${st.nama}</div><div class="node-sub">${st.sub}</div>
      <div class="stars">${[1, 2, 3].map(k => `<span class="${k <= stars ? 'on' : ''}">★</span>`).join('')}</div></div>
      ${next ? '<span class="here">Di sini!</span>' : ''}
    </li>`;
  }).join('');
  app.innerHTML = `<section class="screen home">
    ${header()}
    <div class="guide" id="guide">${mascotSVG(58)}<div class="bubble small">${tip}</div></div>
    <div class="map-title"><h2>Peta Umrah</h2><span class="chip">${Object.keys(S.done).length}/${STAGES.length} selesai</span></div>
    <ol class="journey">${nodes}</ol>
    <button class="haji" id="hajiCard">${ico('haji-akan-datang', 'haji-ic')}<div><b>Modul Haji</b><small>Mina, Arafah, Muzdalifah — akan datang</small></div>${ico('stage-terkunci', 'lock')}</button>
    <div id="installBox"></div>
  </section>${nav('home')}`;
  app.querySelectorAll('[data-stage]').forEach(b => b.onclick = () => {
    const i = STAGES.findIndex(s => s.id === b.dataset.stage);
    if (!stageUnlocked(i)) { sfx.wrong(); vibe(30); toast('Ikut tertib! Siapkan peringkat sebelumnya dahulu.'); return; }
    sfx.pop(); go('stage', b.dataset.stage);
  });
  $('#guide').onclick = () => { sfx.pop(); S.tip++; save(); $('#guide .bubble').textContent = MASKOT_TIPS[S.tip % MASKOT_TIPS.length]; };
  $('#hajiCard').onclick = () => { sfx.tap(); toast('Modul Haji sedang dibina. Nantikan! 🛠️'); };
  renderInstall();
}

// ================= Peringkat =================
function openStage(id) {
  const st = STAGES.find(s => s.id === id);
  ({ learn: stageLearn, ihram: stageIhram, tawaf: stageTawaf, sai: stageSai, tahallul: stageTahallul, final: stageFinal })[st.jenis](st);
}

function stageShell(st, inner, { step = '', pct = 0 } = {}) {
  app.className = 'stage-mode';
  app.innerHTML = `<section class="screen stage" style="--c:${st.warna}">
    <div class="stage-top">
      <button class="icon-btn" data-go="home" aria-label="Kembali ke peta">✕</button>
      <div class="stage-prog"><i style="width:${pct}%"></i></div>
      <div class="pts mini">${starIco()}<b id="ptsVal">${S.points}</b></div>
    </div>
    <div class="stage-head"><span class="eyebrow">Peringkat ${st.no}${step ? ' · ' + step : ''}</span><h1>${ico(st.icon, 'h-ic')}<span>${st.nama}</span></h1></div>
    <div class="stage-body">${inner}</div>
  </section>`;
}

function stageResult(st, { stars, lines = [], extra = '' }) {
  const first = completeStage(st.id, stars);
  const pts = first ? 50 : 10;
  sfx.round(); confetti();
  stageShell(st, `<div class="result">
      <div class="res-mascot">${mascotSVG(110, stars >= 2)}</div>
      <div class="res-stars">${[1, 2, 3].map(k => `<span class="${k <= stars ? 'on' : ''}" style="animation-delay:${k * 0.18}s">★</span>`).join('')}</div>
      <h2>${stars === 3 ? 'Hebat!' : stars === 2 ? 'Bagus!' : 'Syabas, cuba lagi untuk 3 bintang!'}</h2>
      ${lines.map(l => `<p>${l}</p>`).join('')}
      ${extra}
      <div class="row"><button class="btn ghost" id="again">Ulang</button><button class="btn primary" data-go="home">${ico('tab-peta', 'in lg')}Ke Peta</button></div>
    </div>`, { step: 'Selesai', pct: 100 });
  $('#again').onclick = () => { sfx.tap(); go('stage', st.id); };
  setTimeout(() => addPoints(pts, $('.res-stars')), 400);
  giveBadge(st.id === 'kuiz' ? (stars === 3 ? 'juara' : null) : st.id);
}

// Kuiz generik
function runQuiz(st, qs, { step, onDone, startPct = 0, spanPct = 100 }) {
  let i = 0, right = 0;
  const render = () => {
    const q = qs[i];
    const order = shuffle(q.p.map((t, k) => ({ t, k })));
    stageShell(st, `<div class="quiz">
      <div class="q-count">Soalan ${i + 1} / ${qs.length}</div>
      <div class="q-card">${mascotSVG(48)}<p>${q.s}</p></div>
      <div class="opts">${order.map(o => `<button class="opt" data-k="${o.k}">${o.t}</button>`).join('')}</div>
      <div class="q-note" id="qnote" hidden></div>
      <button class="btn primary" id="qnext" hidden>${i + 1 < qs.length ? 'Seterusnya →' : 'Lihat keputusan'}</button>
    </div>`, { step, pct: startPct + (spanPct * i) / qs.length });
    app.querySelectorAll('.opt').forEach(b => b.onclick = () => {
      if (app.querySelector('.opt.lock')) return;
      app.querySelectorAll('.opt').forEach(x => x.classList.add('lock'));
      const k = +b.dataset.k;
      app.querySelector(`.opt[data-k="${q.j}"]`).classList.add('ok');
      const note = $('#qnote');
      if (k === q.j) { right++; sfx.correct(); vibe(10); addPoints(10, b); note.textContent = q.nota || 'Betul! MasyaAllah 🌟'; note.className = 'q-note good'; }
      else { b.classList.add('bad'); sfx.wrong(); vibe([30, 30, 30]); note.textContent = q.nota || `Jawapan betul: ${q.p[q.j]}`; note.className = 'q-note'; }
      note.hidden = false; $('#qnext').hidden = false;
    });
    $('#qnext') && ($('#qnext').onclick = () => { sfx.tap(); i++; i < qs.length ? render() : onDone(right); });
  };
  render();
}

// ---------- 1. Kenali Umrah ----------
function stageLearn(st) {
  let i = 0;
  const render = () => {
    const k = KENALI_KAD[i];
    stageShell(st, `<div class="learn">
      <div class="lcard pop">${ico(k.ikon, 'l-ic')}<h2>${k.tajuk}</h2><p>${k.isi}</p>
      ${k.senarai ? `<ol class="pill-list">${k.senarai.map(s => `<li>${s}</li>`).join('')}</ol>` : ''}</div>
      <div class="dots">${KENALI_KAD.map((_, j) => `<i class="${j === i ? 'on' : ''}"></i>`).join('')}</div>
      <div class="row">${i > 0 ? '<button class="btn ghost" id="prev">← Balik</button>' : '<span></span>'}
      <button class="btn primary" id="next">${i < KENALI_KAD.length - 1 ? 'Seterusnya →' : 'Jom kuiz! 🧠'}</button></div></div>`,
      { step: 'Belajar', pct: (i / KENALI_KAD.length) * 50 });
    $('#next').onclick = () => { sfx.pop(); if (i < KENALI_KAD.length - 1) { i++; render(); } else quiz(); };
    $('#prev') && ($('#prev').onclick = () => { sfx.tap(); i--; render(); });
  };
  const quiz = () => runQuiz(st, KENALI_KUIZ, { step: 'Kuiz', startPct: 50, spanPct: 50, onDone: (r) => {
    const stars = r === 4 ? 3 : r >= 3 ? 2 : 1;
    stageResult(st, { stars, lines: [`Anda jawab <b>${r}/4</b> dengan betul.`, 'Ingat: <b>Rukun</b> mesti dibuat. <b>Wajib</b> jika tertinggal, kena dam.'] });
  } });
  render();
}

// ---------- 2. Ihram di Miqat ----------
function stageIhram(st) {
  // A: susun langkah ikut tertib
  const partA = () => {
    let nextIdx = 0, mistakes = 0;
    const pool = shuffle(IHRAM_LANGKAH);
    stageShell(st, `<div class="order">
      <div class="q-card">${mascotSVG(48)}<p>Tiba di miqat! Tekan langkah persediaan ihram <b>mengikut susunan</b>.</p></div>
      <ol class="slots">${IHRAM_LANGKAH.map((_, j) => `<li class="slot" id="slot${j}"><span>${j + 1}</span></li>`).join('')}</ol>
      <div class="chips">${pool.map(p => `<button class="chipbtn" data-id="${p.id}">${ico(p.ikon, 'chip-ic')}${p.label}</button>`).join('')}</div>
    </div>`, { step: 'Persediaan', pct: 5 });
    app.querySelectorAll('.chipbtn').forEach(b => b.onclick = () => {
      const want = IHRAM_LANGKAH[nextIdx];
      if (b.dataset.id === want.id) {
        sfx.correct(); vibe(10);
        const slot = $('#slot' + nextIdx); slot.classList.add('filled'); slot.innerHTML = `<span>${nextIdx + 1}</span>${ico(want.ikon, 'chip-ic')}${want.label}`;
        b.remove(); nextIdx++;
        if (nextIdx === IHRAM_LANGKAH.length) { addPoints(mistakes === 0 ? 30 : 15, slot); setTimeout(partB, 700); }
      } else { mistakes++; sfx.wrong(); vibe(30); b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 400); }
    });
  };
  // B: niat & talbiah
  const partB = () => {
    unlockDoa('niat', 'labbaik', 'talbiah');
    const steps = [DOA.niat, DOA.labbaik, DOA.talbiah];
    let i = 0;
    const r = () => {
      const d = steps[i];
      stageShell(st, `<div class="learn">
        <div class="lcard pop">${doaCard(d)}<p class="bila">${ico('ikon-masa', 'in')}${d.bila}</p></div>
        <div class="row"><span></span><button class="btn primary" id="next">${i < steps.length - 1 ? 'Saya dah baca ✓' : 'Labbaik! ✓'}</button></div></div>`,
        { step: 'Niat & Talbiah', pct: 30 + i * 10 });
      $('#next').onclick = () => { sfx.correct(); addPoints(5, $('#next')); i++; i < steps.length ? r() : partC(); };
    };
    r();
  };
  // C: boleh atau larangan
  const partC = () => {
    const items = shuffle(LARANGAN).slice(0, 8);
    let i = 0, right = 0;
    const r = () => {
      const it = items[i];
      stageShell(st, `<div class="sorter">
        <div class="q-card">${mascotSVG(48)}<p>Semasa dalam ihram, perkara ini <b>boleh</b> atau <b>larangan</b>?</p></div>
        <div class="sort-card pop">${ico(it.ikon, 's-ic')}<div class="s-t">${it.t}</div><div class="s-n">${i + 1}/${items.length}</div></div>
        <div class="row two"><button class="btn ok big" data-a="b">${ico('jawapan-boleh', 'in lg')}Boleh</button><button class="btn no big" data-a="l">${ico('jawapan-larangan', 'in lg')}Larangan</button></div>
      </div>`, { step: 'Larangan Ihram', pct: 60 + (i / items.length) * 40 });
      app.querySelectorAll('[data-a]').forEach(b => b.onclick = () => {
        const card = $('.sort-card');
        if (card.classList.contains('lock')) return; card.classList.add('lock');
        const ok = b.dataset.a === it.a;
        if (ok) { right++; sfx.correct(); vibe(10); addPoints(5, b); card.classList.add('good'); }
        else { sfx.wrong(); vibe([30, 30, 30]); card.classList.add('bad'); }
        card.insertAdjacentHTML('beforeend', `<div class="s-ans">${it.a === 'l' ? ico('jawapan-larangan', 'in') + 'Larangan ihram' : ico('jawapan-boleh', 'in') + 'Dibolehkan'}</div>`);
        setTimeout(() => { i++; i < items.length ? r() : finish(); }, 1100);
      });
    };
    const finish = () => {
      if (right === items.length) giveBadge('larangan');
      const stars = right === items.length ? 3 : right >= 6 ? 2 : 1;
      stageResult(st, { stars, lines: [`Larangan ihram: <b>${right}/${items.length}</b> betul.`, 'Talbiah terus dibaca sehingga anda mula tawaf.'] });
    };
    r();
  };
  partA();
}

// ---------- 3. Tawaf 3D ----------
function stageTawaf(st) {
  unlockDoa('masukMasjid', 'istilam', 'rabbana');
  stageShell(st, `<div class="learn">
    <div class="lcard pop">${doaCard(DOA.masukMasjid)}<p class="bila">${ico('ikon-kaki-kanan', 'in')}Masuk dengan kaki kanan.</p></div>
    <div class="lcard"><h3>Syarat sah tawaf</h3><ul class="checks">${SYARAT_TAWAF.map(s => `<li>${s}</li>`).join('')}</ul></div>
    <div class="row"><span></span><button class="btn primary big" id="go3d">${ico('stage-tawaf', 'in lg')}Mula Tawaf 3D</button></div></div>`, { step: 'Masuk Masjidil Haram', pct: 5 });
  $('#go3d').onclick = () => { sfx.whoosh(); play3D(st, 'tawaf'); };
}

// ---------- 4. Sa'i 3D ----------
function stageSai(st) {
  unlockDoa('safa', 'lampuHijau');
  stageShell(st, `<div class="learn">
    <div class="lcard pop">${ico('stage-sai', 'l-ic')}<h2>Apa itu Sa'i?</h2>
      <p>Berjalan antara Bukit Safa dan Bukit Marwah sebanyak <b>7 laluan</b>, mengenang Siti Hajar mencari air untuk anaknya, Nabi Ismail.</p>
      <ol class="pill-list"><li>Mula di Safa, tamat di Marwah</li><li>Safa → Marwah = 1 laluan</li><li>Lelaki berlari-lari anak antara lampu hijau</li></ol></div>
    <div class="row"><span></span><button class="btn primary big" id="go3d">${ico('stage-sai', 'in lg')}Mula Sa'i 3D</button></div></div>`, { step: 'Persediaan', pct: 5 });
  $('#go3d').onclick = () => { sfx.whoosh(); play3D(st, 'sai'); };
}

async function play3D(st, kind) {
  app.className = 'play-mode';
  app.innerHTML = `<section class="play">
    <div id="stage3d" class="stage3d"></div>
    <div class="hud-top">
      <button class="icon-btn" id="quit" aria-label="Keluar">✕</button>
      <div class="hud-pill"><b id="hudMain">${kind === 'tawaf' ? 'Sedia untuk tawaf' : 'Di Bukit Safa'}</b><small id="hudSub">${kind === 'tawaf' ? 'Jalan ke garisan hijau Hajar Aswad' : "Baca doa sebelum mula sa'i"}</small></div>
      <div class="pts mini">${starIco()}<b id="ptsVal">${S.points}</b></div>
    </div>
    <div class="rounds" id="rounds">${Array.from({ length: 7 }, (_, i) => `<i data-r="${i + 1}">${i + 1}</i>`).join('')}</div>
    <div class="banner" id="banner" hidden></div>
    <div class="hud-bottom">
      <button class="side-btn" id="autoBtn" aria-pressed="false">${ico('hud-auto')}<small>Auto</small></button>
      <button class="walk-btn" id="walkBtn">${ico('hud-jalan', 'walk-ic')}Tekan & tahan untuk berjalan</button>
      <button class="side-btn" id="runBtn" hidden>${ico('hud-lari')}<small>Lari anak</small></button>
    </div>
    <div class="sheet" id="sheet" hidden></div>
    <div class="loading" id="loading">${mascotSVG(80)}<p>Menyediakan ${kind === 'tawaf' ? 'Masjidil Haram' : "Mas'a"}…</p></div>
  </section>`;

  let mod;
  try {
    mod = kind === 'tawaf' ? await import('./scene-tawaf.js') : await import('./scene-sai.js');
  } catch (err) {
    $('#loading').innerHTML = `<p>Maaf, 3D tidak dapat dimuatkan pada peranti ini.</p><button class="btn primary" data-go="home">Kembali</button>`;
    return;
  }
  const stats = { istilam: 0, aamiin: new Set(), run: new Set() };
  const sheet = $('#sheet'), banner = $('#banner');
  let walking = false, auto = false;
  const setWalk = (b) => { walking = b; game.setWalking(walking || auto); $('#walkBtn').classList.toggle('on', walking || auto); };

  const showSheet = (html, btns) => {
    setWalk(false);
    sheet.innerHTML = `<div class="sheet-in pop">${html}<div class="row two">${btns.map((b, i) => `<button class="btn ${b.cls || 'primary'}" data-i="${i}">${b.t}</button>`).join('')}</div></div>`;
    sheet.hidden = false;
    sheet.querySelectorAll('[data-i]').forEach(el => el.onclick = () => { sheet.hidden = true; btns[+el.dataset.i].fn(el); });
  };
  const showBanner = (html, btn) => {
    banner.innerHTML = `<div class="banner-in">${html}${btn ? `<button class="mini-btn" id="bannerBtn">${btn.t}</button>` : ''}</div>`;
    banner.hidden = false;
    if (btn) $('#bannerBtn').onclick = (e) => { btn.fn(e.currentTarget); };
  };
  const hideBanner = () => { banner.hidden = true; };
  const markRound = (n, cls = 'on') => { const el = app.querySelector(`.rounds [data-r="${n}"]`); el && el.classList.add(cls); };

  const onEvent = kind === 'tawaf' ? (type, d) => {
    if (type === 'istilam') {
      sfx.round(); vibe(20);
      const first = d.index === 0, last = d.index === 7;
      if (!first) markRound(d.index, 'done');
      const title = first ? 'Mula Tawaf! ✋' : last ? 'Pusingan ke-7 selesai! 🎉' : `Pusingan ${d.index} selesai!`;
      const note = first ? 'Berhenti membaca talbiah. Hadap Hajar Aswad, angkat tangan kanan, dan kucup tangan.' : last ? 'Istilam terakhir menandakan tawaf anda lengkap.' : `Teruskan ke pusingan ${d.index + 1}. Hadap Hajar Aswad dan istilam.`;
      showSheet(`<div class="eyebrow">Garisan Hajar Aswad</div><h2>${title}</h2><p>${note}</p>${doaCard(DOA.istilam, { compact: true })}`, [
        { t: 'Teruskan', cls: 'ghost', fn: () => game.resume() },
        { t: `${ico('badge-istilam', 'in lg')}Istilam +10`, fn: (el) => { stats.istilam++; addPoints(10, el); sfx.correct(); game.resume(); } }
      ]);
    } else if (type === 'round') {
      markRound(d.round);
      $('#hudMain').textContent = `Pusingan ${d.round} / 7`;
      $('#hudSub').textContent = S.gender === 'm' && d.round <= 3 ? 'Sunat ramal: langkah pendek & cergas 💪' : 'Kaabah di sebelah kiri anda';
    } else if (type === 'zone') {
      if (d.zone === 'rabbana') {
        const got = stats.aamiin.has(d.round);
        showBanner(`<b>Rukun Yamani → Hajar Aswad</b><span class="arab sm" lang="ar" dir="rtl">${DOA.rabbana.arab}</span><small>${DOA.rabbana.rumi}</small>`,
          got ? null : { t: 'Aamiin +5', fn: (el) => { stats.aamiin.add(d.round); addPoints(5, el); sfx.correct(); el.remove(); } });
      } else if (d.zone === 'pintu') {
        showBanner(`<b>Melintasi Multazam & Pintu Kaabah</b><small>Berzikir dan berdoa dengan bahasa sendiri pun boleh 🤲</small>`);
      } else hideBanner();
    } else if (type === 'progress') {
      const el = app.querySelector(`.rounds [data-r="${d.round}"]`);
      el && el.style.setProperty('--p', Math.round(d.frac * 100) + '%');
    } else if (type === 'done') {
      hideBanner(); markRound(7, 'done'); game.celebrate();
      finishTawaf(st, stats);
    }
  } : (type, d) => {
    if (type === 'arrive') {
      sfx.round(); vibe(20); markRound(d.laluan, 'done');
      const atM = d.at === 'marwah';
      const last = d.laluan === 7;
      showSheet(`<div class="eyebrow">Laluan ${d.laluan} selesai</div><h2>Sampai di ${atM ? 'Marwah' : 'Safa'}! ${last ? '🎉' : ''}</h2>
        <p>${last ? "Alhamdulillah, 7 laluan sa'i lengkap dan berakhir di Marwah." : `Naik sedikit ke bukit, hadap Kaabah, angkat tangan dan berdoa. Kemudian ke ${atM ? 'Safa' : 'Marwah'}.`}</p>`, [
        { t: last ? "Selesai Sa'i ✓" : `Ke ${atM ? 'Safa' : 'Marwah'} →`, fn: () => game.resume() }
      ]);
    } else if (type === 'laluan') {
      markRound(d.laluan);
      const toM = d.laluan % 2 === 1;
      $('#hudMain').textContent = `Laluan ${d.laluan} / 7`;
      $('#hudSub').textContent = toM ? 'Safa → Marwah' : 'Marwah → Safa';
    } else if (type === 'green') {
      if (d.inside) {
        const got = stats.aamiin.has(d.laluan);
        showBanner(`<b>${ico('badge-hijau', 'in')}Antara dua lampu hijau</b><span class="arab sm" lang="ar" dir="rtl">${DOA.lampuHijau.arab}</span><small>${S.gender === 'm' ? 'Lelaki: tekan butang Lari anak untuk lari-lari anak' : 'Wanita berjalan seperti biasa 🌸'}</small>`,
          got ? null : { t: 'Aamiin +5', fn: (el) => { stats.aamiin.add(d.laluan); addPoints(5, el); sfx.correct(); el.remove(); } });
        if (S.gender === 'm') $('#runBtn').hidden = false;
      } else { hideBanner(); $('#runBtn').hidden = true; $('#runBtn').classList.remove('on'); game.setRun(false); }
    } else if (type === 'progress') {
      const el = app.querySelector(`.rounds [data-r="${d.laluan}"]`);
      el && el.style.setProperty('--p', Math.round(d.frac * 100) + '%');
    } else if (type === 'done') {
      hideBanner(); game.celebrate();
      finishSai(st, stats);
    }
  };

  const game = mod[kind === 'tawaf' ? 'createTawaf' : 'createSai']($('#stage3d'), { gender: S.gender, onEvent });
  $('#loading').remove();
  cleanup = () => game.dispose();

  const wb = $('#walkBtn');
  const down = (e) => { e.preventDefault(); unlockAudio(); if (sheet.hidden) setWalk(true); };
  const up = () => setWalk(false);
  wb.addEventListener('pointerdown', down);
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => wb.addEventListener(ev, up));
  wb.addEventListener('contextmenu', e => e.preventDefault());
  const keyD = (e) => { if ((e.code === 'Space' || e.code === 'ArrowUp') && sheet.hidden) { e.preventDefault(); setWalk(true); } };
  const keyU = (e) => { if (e.code === 'Space' || e.code === 'ArrowUp') setWalk(false); };
  addEventListener('keydown', keyD); addEventListener('keyup', keyU);
  const prevCleanup = cleanup;
  cleanup = () => { removeEventListener('keydown', keyD); removeEventListener('keyup', keyU); prevCleanup(); };

  $('#autoBtn').onclick = (e) => { sfx.tap(); auto = !auto; e.currentTarget.classList.toggle('on', auto); e.currentTarget.setAttribute('aria-pressed', auto); setWalk(walking); };
  $('#runBtn').onclick = (e) => {
    sfx.pop(); const on = !e.currentTarget.classList.contains('on');
    e.currentTarget.classList.toggle('on', on); game.setRun(on);
    const lal = +($('#hudMain').textContent.match(/\d+/) || [0])[0];
    if (on && !stats.run.has(lal)) { stats.run.add(lal); addPoints(5, e.currentTarget); }
  };
  $('#quit').onclick = () => {
    sfx.tap();
    modal(`<h2>Keluar dari ${kind === 'tawaf' ? 'tawaf' : "sa'i"}?</h2><p>Kemajuan peringkat ini tidak disimpan.</p>
      <div class="row two"><button class="btn ghost" data-close>Teruskan main</button><button class="btn no" id="reallyQuit">Keluar</button></div>`, { cls: 'center' });
    $('#reallyQuit').onclick = () => { document.querySelector('.modal-wrap')?.remove(); go('home'); };
  };

  if (kind === 'sai') {
    showSheet(`<div class="eyebrow">Di atas Bukit Safa</div><h2>Hadap Kaabah & berdoa</h2>${doaCard(DOA.safa)}`, [
      { t: "Mula Sa'i ✓", fn: (el) => { addPoints(10, el); game.resume(); } }
    ]);
  }
}

function finishTawaf(st, stats) {
  setTimeout(() => {
    if (stats.istilam >= 8) giveBadge('istilam');
    const a = stats.aamiin.size;
    const stars = stats.istilam >= 8 && a >= 7 ? 3 : stats.istilam >= 4 || a >= 4 ? 2 : 1;
    cleanupNow();
    stageResult(st, {
      stars,
      lines: [`Istilam: <b>${stats.istilam}/8</b> · Doa Rabbana: <b>${a}/7</b>`],
      extra: `<h3 class="sub-h">Selepas tawaf</h3><div class="mini-cards">${SELEPAS_TAWAF.map(c => `<div class="mc">${ico(c.ikon, 'mc-ic')}<b>${c.tajuk}</b><small>${c.isi}</small></div>`).join('')}</div>`
    });
  }, 1200);
}
function finishSai(st, stats) {
  setTimeout(() => {
    if (stats.aamiin.size >= 7) giveBadge('hijau');
    const a = stats.aamiin.size;
    const stars = a >= 7 ? 3 : a >= 4 ? 2 : 1;
    cleanupNow();
    stageResult(st, { stars, lines: [`Doa lampu hijau: <b>${a}/7</b>`, 'Seterusnya: bergunting atau bercukur untuk bertahallul.'] });
  }, 1200);
}
function cleanupNow() { if (cleanup) { try { cleanup(); } catch {} cleanup = null; } }

// ---------- 5. Tahallul ----------
function stageTahallul(st) {
  const choose = () => {
    stageShell(st, `<div class="learn">
      <div class="q-card">${mascotSVG(48)}<p>Rukun terakhir! Pilih cara bertahallul. Minimum <b>3 helai rambut</b>.</p></div>
      <div class="pick">
        ${S.gender === 'm' ? `<button class="pick-c" data-m="cukur">${ico('tahallul-cukur')}Bercukur<small>Afdal untuk lelaki</small></button>` : ''}
        <button class="pick-c" data-m="gunting">${ico('tahallul-gunting')}Bergunting<small>${S.gender === 'f' ? 'Hujung rambut sekadar seruas jari' : 'Sekurang-kurangnya 3 helai'}</small></button>
      </div></div>`, { step: 'Pilih cara', pct: 10 });
    app.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { sfx.pop(); snip(b.dataset.m); });
  };
  const snip = (method) => {
    const N = 11; let cut = 0;
    const strands = Array.from({ length: N }, (_, i) => {
      const x = 40 + i * 22, sway = (i % 2 ? 8 : -8);
      return `<g class="strand" data-i="${i}"><path d="M${x} 30 C ${x + sway} 90, ${x - sway} 150, ${x + sway / 2} 210" /><circle cx="${x + sway / 2}" cy="210" r="5"/></g>`;
    }).join('');
    stageShell(st, `<div class="snip">
      <p class="hint">${method === 'cukur' ? 'Ketuk rambut untuk mencukur' : 'Ketuk helaian rambut untuk menggunting'}</p>
      <div class="hair-box"><svg viewBox="0 0 300 240" class="hair ${S.gender}" role="img" aria-label="Helaian rambut">
        <rect x="18" y="8" width="264" height="30" rx="15" class="scalp"/>${strands}</svg></div>
      <div class="count"><b id="cut">0</b> / 3 helai minimum</div>
      <button class="btn primary big" id="doneSnip" disabled>Selesai Tahallul 🎉</button>
    </div>`, { step: method === 'cukur' ? 'Bercukur' : 'Bergunting', pct: 40 });
    app.querySelectorAll('.strand').forEach(s => s.addEventListener('click', () => {
      if (s.classList.contains('cut')) return;
      s.classList.add('cut'); cut++; sfx.snip(); vibe(8);
      $('#cut').textContent = cut;
      if (cut <= 5) addPoints(5, s);
      if (cut >= 3) $('#doneSnip').disabled = false;
    }));
    $('#doneSnip').onclick = () => {
      const umrahAll = ['kenali', 'ihram', 'tawaf', 'sai'].every(id => S.done[id]);
      if (umrahAll) setTimeout(() => giveBadge('umrah'), 1600);
      stageResult(st, { stars: 3, lines: ['Alhamdulillah! Umrah anda <b>selesai</b>. 🕋', 'Semua larangan ihram kini terangkat.'],
        extra: `<div class="lcard soft"><b>Tertib rukun umrah</b><ol class="pill-list"><li>Niat ihram</li><li>Tawaf</li><li>Sa'i</li><li>Bercukur / bergunting</li></ol></div>` });
    };
  };
  choose();
}

// ---------- 6. Kuiz Juara ----------
function stageFinal(st) {
  const qs = shuffle(KUIZ_AKHIR).slice(0, 10);
  runQuiz(st, qs, { step: 'Kuiz', onDone: (r) => {
    const stars = r === 10 ? 3 : r >= 7 ? 2 : 1;
    const tarikh = new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });
    stageResult(st, { stars, lines: [`Skor anda: <b>${r}/10</b>`],
      extra: `<div class="cert"><div class="cert-in"><div class="eyebrow">Sijil Penghargaan</div><div class="cert-name">${esc(S.name)}</div>
        <p>telah menamatkan perjalanan <b>Umrah Aamani</b> dengan skor ${r}/10</p><div class="cert-foot"><span>${tarikh}</span><span>${ico('kad-apa-umrah', 'in')}${LEVELS[levelOf(S.points)].nama}</span></div></div></div>` });
  } });
}

// ================= Kitab Doa =================
const DOA_SRC = { niat: 'Ihram di Miqat', labbaik: 'Ihram di Miqat', talbiah: 'Ihram di Miqat', masukMasjid: 'Tawaf 3D', istilam: 'Tawaf 3D', rabbana: 'Tawaf 3D', safa: "Sa'i 3D", lampuHijau: "Sa'i 3D" };
function doaPage() {
  const list = Object.values(DOA);
  const n = list.filter(d => S.doa[d.id]).length;
  app.innerHTML = `<section class="screen">
    ${header()}
    <div class="map-title"><h2>Kitab Doa</h2><span class="chip">${n}/${list.length} dibuka</span></div>
    <div class="doa-list">${list.map(d => S.doa[d.id]
      ? `<button class="doa-item" data-d="${d.id}"><span class="arab sm" lang="ar" dir="rtl">${d.arab.split('،')[0]}</span><b>${d.tajuk}</b>${S.hafal[d.id] ? `<span class="hafal">${starIco()} Hafal</span>` : ''}</button>`
      : `<div class="doa-item locked">${ico('stage-terkunci', 'lk')}<b>${d.tajuk}</b><small>Buka di ${DOA_SRC[d.id]}</small></div>`).join('')}</div>
  </section>${nav('doaPage')}`;
  app.querySelectorAll('[data-d]').forEach(b => b.onclick = () => {
    sfx.pop(); const d = DOA[b.dataset.d];
    const m = modal(`${doaCard(d)}<p class="bila">${ico('ikon-masa', 'in')}${d.bila}</p>
      <div class="row two"><button class="btn ghost" data-close>Tutup</button>
      ${S.hafal[d.id] ? `<button class="btn ok" disabled>${starIco()} Sudah hafal</button>` : '<button class="btn primary" id="hafalBtn">Saya dah hafal! +15</button>'}</div>`);
    const hb = $('#hafalBtn', m.el);
    hb && (hb.onclick = () => { S.hafal[d.id] = true; save(); addPoints(15, hb); sfx.correct(); m.close(); doaPage(); });
  });
}

// ================= Lencana =================
function badgePage() {
  const n = BADGES.filter(b => S.badges[b.id]).length;
  app.innerHTML = `<section class="screen">
    ${header()}
    <div class="map-title"><h2>Lencana</h2><span class="chip">${n}/${BADGES.length}</span></div>
    <div class="badge-grid">${BADGES.map(b => `<button class="badge ${S.badges[b.id] ? 'got' : ''}" data-b="${b.id}">${ico(b.ikon, 'b-ic')}<b>${b.nama}</b></button>`).join('')}</div>
  </section>${nav('badgePage')}`;
  app.querySelectorAll('[data-b]').forEach(el => el.onclick = () => {
    sfx.pop(); const b = BADGES.find(x => x.id === el.dataset.b); const got = S.badges[b.id];
    modal(`<div class="badge-big ${got ? '' : 'dim'}">${ico(b.ikon)}</div><h2>${b.nama}</h2><p>${b.desc}</p>
      <p class="fine">${got ? 'Diperoleh ' + new Date(got).toLocaleDateString('ms-MY') : 'Belum diperoleh'}</p><button class="btn primary" data-close>OK</button>`, { cls: 'center' });
  });
}

// ================= Tetapan =================
function settings() {
  app.innerHTML = `<section class="screen">
    ${header()}
    <div class="map-title"><h2>Tetapan</h2></div>
    <div class="set-list">
      <label class="set"><span>${ico('tetapan-bunyi', 'set-ic')}Bunyi</span><input type="checkbox" id="sSound" ${S.sound ? 'checked' : ''}><i class="sw"></i></label>
      <label class="set"><span>${ico('tetapan-getar', 'set-ic')}Getaran</span><input type="checkbox" id="sVibe" ${S.vibe ? 'checked' : ''}><i class="sw"></i></label>
      <button class="set" id="sProfile"><span>${ico(S.gender === 'f' ? 'avatar-perempuan' : 'avatar-lelaki', 'set-ic')}Tukar nama & watak</span><b>›</b></button>
      <div id="installBox"></div>
      <button class="set danger" id="sReset"><span>${ico('tetapan-reset', 'set-ic')}Mula semula dari awal</span><b>›</b></button>
    </div>
    <div class="about"><b>Tentang Umrah Aamani</b><p>Permainan rujukan umrah untuk keluarga. Kandungan ringkas mengikut Mazhab Syafie. Sila sahkan dengan guru, ustaz dan panduan rasmi Lembaga Tabung Haji.</p><p class="fine">Versi 1.0 · Modul Haji akan datang</p></div>
  </section>${nav('settings')}`;
  $('#sSound').onchange = (e) => { S.sound = e.target.checked; setSound(S.sound); save(); if (S.sound) sfx.correct(); };
  $('#sVibe').onchange = (e) => { S.vibe = e.target.checked; save(); vibe(20); };
  $('#sProfile').onclick = () => { sfx.tap(); go('onboard'); };
  $('#sReset').onclick = () => {
    sfx.tap();
    const m = modal(`<h2>Padam semua kemajuan?</h2><p>Mata, lencana dan bintang akan dipadam.</p>
      <div class="row two"><button class="btn ghost" data-close>Batal</button><button class="btn no" id="yesReset">Padam</button></div>`, { cls: 'center' });
    $('#yesReset', m.el).onclick = () => { S = fresh(); save(); setSound(true); m.close(); go('onboard'); };
  };
  renderInstall();
}

// ================= PWA =================
let deferredPrompt = null;
addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; renderInstall(); });
function renderInstall() {
  const box = $('#installBox'); if (!box) return;
  const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  if (standalone) { box.innerHTML = ''; return; }
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (deferredPrompt) {
    box.innerHTML = `<button class="install" id="instBtn">${ico('pasang-app', 'inst-ic')}<span><b>Pasang Umrah Aamani</b><small>Main tanpa internet, terus dari skrin utama</small></span></button>`;
    $('#instBtn').onclick = async () => { deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; renderInstall(); };
  } else if (ios) {
    box.innerHTML = `<div class="install">${ico('pasang-app', 'inst-ic')}<span><b>Pasang di iPhone</b><small>Tekan butang Kongsi, kemudian "Add to Home Screen"</small></span></div>`;
  } else box.innerHTML = '';
}
if ('serviceWorker' in navigator && location.protocol === 'https:' || location.hostname === 'localhost') {
  try { navigator.serviceWorker?.register('./sw.js').catch(() => {}); } catch {}
}

// mulakan audio pada sentuhan pertama
addEventListener('pointerdown', () => unlockAudio(), { once: true });

go(S.onboarded ? 'home' : 'onboard');
