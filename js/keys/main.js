/* «مَفَاتِيحُ بَطَلِ الْأَمَانِ» — scenario 5 (approved by the teacher, 27 Oct 2026).
   Start → rules → Level 1 (discover the safe behaviours, green key) → Level 2 (find the danger on the map, red key)
   → Level 3 (sort the 7 cards of «أفعل / لا أفعل» p43 on a smart board, golden key; the first attempt is the measure) → treasure chest and the medal.
   No sound: every word is a speech bubble of one named speaker (Salem, or the male teacher in level 3).
   Salem is the existing 3D render of the boy (k_* frames). Traffic lights are drawn in code so they always match the behaviour.
   Cars brake with constant deceleration and stop before the stop line. Nothing ever touches: dangers freeze before contact. */
import { state, save, TEACHER_PIN } from '../state.js';

// ------------------------------------------------------------------ stage
const cv = document.getElementById('cv'), ctx = cv.getContext('2d'), ui = document.getElementById('ui'), stage = document.getElementById('stage');
const W = 1280, H = 720, INK = '#1b1b1b';
let SCALE = 1;
function fit() { SCALE = Math.min(innerWidth / W, innerHeight / H); stage.style.transform = `translate(-50%,-50%) scale(${SCALE})`; }
addEventListener('resize', fit); fit();
const toStage = e => { const r = stage.getBoundingClientRect(); return { x: (e.clientX - r.left) / SCALE, y: (e.clientY - r.top) / SCALE }; };

// ------------------------------------------------------------------ assets (v5 pictures are optional: a fallback is drawn until they exist)
const IMG = {};
const MANIFEST = {
  bg_side: 'assets/arcade/bg/side.webp', bg_street: 'assets/arcade/bg/street.webp', bg_school: 'assets/arcade/bg/school.webp',
  bg_class: 'assets/arcade/bg/class.webp', bg_class3: 'assets/v6/class3.webp', boys_l: 'assets/v6/boys_l.webp', boys_r: 'assets/v6/boys_r.webp', bg_map: 'assets/v6/map2.webp', bg_gate: 'assets/arcade/bg/gate.webp',
  k_idle: 'assets/v6/salem_front.webp', k_wave: 'assets/arcade/char/k_wave.webp', k_cheer: 'assets/v6/salem_cheer.webp',
  k_front: 'assets/v6/salem_front.webp',   /* Salem's new pictures with natural arms (teacher, 28 Oct 2026) */ k_sit: 'assets/arcade/char/k_sitside.webp',
  car_base3: 'assets/v4/car_base3.jpg',
};
for (let i = 0; i < 8; i++) { MANIFEST[`k_wave${i}`] = `assets/arcade/char/k_wave${i}.webp`; }
for (let i = 0; i < 12; i++) MANIFEST[`k_wshield${i}`] = `assets/arcade/char/k_wshield${i}.webp`;
MANIFEST.bg_street2 = 'assets/v6/street_l2.webp'; MANIFEST.salem_bag = 'assets/v6/salem_bag2.webp'; MANIFEST.salem_back_bag = 'assets/v6/salem_back_bag.webp'; MANIFEST.pair_bag_class = 'assets/v6/pair_bag_class.webp'; MANIFEST.salem_lens_bag_nolens = 'assets/v6/salem_lens_bag_nolens.webp'; MANIFEST.lens3d = 'assets/v6/lens3d.webp'; ['hadi_hold_green_nolens', 'hadi_hold_red_nolens', 'hadi_hold_back_nolens', 'lens_rim', 'salem_lens_nolens'].forEach(k => { MANIFEST[k] = `assets/v6/${k}.webp`; }); ['o_ball', 'o_bike', 'o_nobelt', 'o_distract', 'o_door', 'o_run'].forEach(k => { MANIFEST[k] = `assets/v6/${k}.jpg`; }); MANIFEST.o_cross = 'assets/v6/o_cross.jpg'; MANIFEST.o_wait = 'assets/v6/o_wait.jpg';   /* the other boy, safe (Codex) */ MANIFEST.o_family = 'assets/v6/o_family.jpg'; MANIFEST.hadi_hold_off_nolens = 'assets/v6/hadi_hold_off_nolens.webp'; MANIFEST.pair_bag_off = 'assets/v6/pair_bag_off2.webp'; MANIFEST.salem_stand_bag = 'assets/v6/salem_stand_bag.webp'; MANIFEST.c_kerb = 'assets/v6/c_kerb.jpg'; MANIFEST.c_kerb_q = 'assets/v6/c_kerb_q.jpg';   /* his arms down: no finger near a box while the child sorts (committee r7) */ for (let i = 0; i < 4; i++) MANIFEST[`salem_bwalk${i}`] = `assets/v6/salem_bwalk${i}.webp`;   /* «هادي» with no light and a calm face; Salem walking with his bag (Codex, 29 Oct 2026) */ ['cross', 'bike', 'belt', 'run', 'signal', 'nobelt', 'distract'].forEach(k => { MANIFEST['n_' + k] = `assets/v6/n_${k}.jpg`; });   /* level 3: one neutral boy on all seven cards (Codex, 29 Oct 2026) */   /* for now: the boy belted on the back seat (no open door); Codex draws the family car */   /* the two safe stations (p47): for now the level-1 pictures; the other boy's pictures come from Codex */   /* level 2 on the street (teacher, 29 Oct 2026): another boy in each picture, Salem is the detective */
MANIFEST.k_bstand = 'assets/v6/salem_back_stand.webp'; MANIFEST.pair_back = 'assets/v6/pair_back.webp'; MANIFEST.emblem = 'assets/v5/emblem.webp'; MANIFEST.lammah_sign = 'assets/v5/lammah_sign.webp'; MANIFEST.salem_lammah = 'assets/v5/salem_lammah.webp'; MANIFEST.walk_street = 'assets/v5/walk_street.jpg'; MANIFEST.icon_medal = 'assets/v5/icon_medal.webp'; ['door_bronze', 'door_silver', 'door_gold'].forEach(k => { MANIFEST[k] = `assets/v5/${k}.webp`; }); ['rule_discover', 'rule_key', 'rule_medal'].forEach(k => { MANIFEST[k] = `assets/v5/${k}.jpg`; });
for (let i = 0; i < 4; i++) { MANIFEST[`k_walk${i}`] = `assets/v6/salem_walk${i}.webp`;   /* drawn again by Codex: one head of hair (committee r7) */ MANIFEST[`k_back${i}`] = `assets/v6/salem_back${i}.webp`;   /* Salem from behind with natural arms (teacher, 28 Oct 2026) */ MANIFEST[`k_run${i}`] = `assets/arcade/char/k_run${i}.webp`; }
['car_red', 'car_silver', 'car_blue', 'car_white', 'kid_bike_street', 'kid_reach'].forEach(k => { MANIFEST[k] = `assets/v4/${k}.webp`; });
// scenario 5 pictures (Codex)
['car_out', 'cabin', 'cabin_look', 'bg_park', 'c_cross', 'c_bike', 'c_belt', 'c_run'].forEach(k => { MANIFEST[k] = `assets/v5/${k}.jpg`; }); ['c_signal', 'c_nobelt', 'c_distract'].forEach(k => { MANIFEST[k] = `assets/v6/${k}.jpg`; });   /* the 3 new cards of «أفعل / لا أفعل» (p43, teacher 28 Oct 2026) */
['salem_bike', 'salem_reach', 'teacher', 'truck', 'chest', 'chest_open', 'medal', 'lammah_ok', 'lammah_stop', 'lammah_point', 'lammah_back', 'ped_sign', 'lammah_red', 'lammah_yellow', 'lammah_green', 'salem_talk', 'hadi_talk', 'hadi_talk_red', 'hadi_talk_yellow', 'hadi_talk_green', 'hadi_walk', 'salem_card'].forEach(k => { MANIFEST[k] = `assets/v5/${k}.webp`; });
const ready = im => im && im.complete && im.naturalWidth > 0;
const pick = (...ks) => ks.find(k => ready(IMG[k]));
function loadAll() {
  const keys = Object.keys(MANIFEST); let n = 0; const bar = document.querySelector('#load i');
  return Promise.all(keys.map(k => new Promise(res => { const im = new Image(); im.onload = im.onerror = () => { n++; bar.style.width = n / keys.length * 100 + '%'; res(); }; im.src = MANIFEST[k]; IMG[k] = im; })));
}

// ------------------------------------------------------------------ helpers
const $ = h => { const d = document.createElement('div'); d.innerHTML = h.trim(); return d.firstElementChild; };
/* every speech cloud is sized to its words, so no letter touches or leaves the cloud's edge (teacher, 29 Oct 2026).
   The cloud picture is stretched to the box; CLOUD_IN is its inner outline (the valleys between the puffs), in fractions of the box.
   Each line of words must sit inside it, a little in from the edge; the padding grows until it does. */
const CLOUD_IN = [[20, 64], [52, 33], [103, 25], [153, 33], [184, 63], [168, 99], [118, 105], [61, 105], [30, 98]].map(([x, y]) => [x / 200, y / 120]);
const inCloud = (x, y) => { x = .5 + (x - .5) / .92; y = .55 + (y - .55) / .9; let c = false;
  for (let i = 0, j = CLOUD_IN.length - 1; i < CLOUD_IN.length; j = i++) { const [xi, yi] = CLOUD_IN[i], [xj, yj] = CLOUD_IN[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; }
  return c; };
const cloudFits = b => { const br = b.getBoundingClientRect(), r = document.createRange(); r.selectNodeContents(b);
  for (const q of r.getClientRects()) { if (q.width < 2 || q.height < 2) continue;
    for (const [x, y] of [[q.left, q.top], [q.right, q.top], [q.left, q.bottom], [q.right, q.bottom]]) if (!inCloud((x - br.left) / br.width, (y - br.top) / br.height)) return false; }
  return true; };
function fitCloud(b) {
  if (!b.isConnected || b.classList.contains('duo')) return;
  const set = (t, x, bm) => b.style.setProperty('padding', `${t}px ${x}px ${bm}px`, 'important');
  set(0, 0, 0); const w = b.scrollWidth, h = b.scrollHeight;
  let px = Math.max(44, w * .2), pt = Math.max(30, h * .42), pb = Math.max(26, h * .3);
  for (let k = 0; k < 16; k++) { set(pt, px, pb); if (cloudFits(b)) return; px += w * .05 + 6; pt += h * .07 + 4; pb += h * .05 + 3; }
}
const add = h => { const e = $(h); ui.appendChild(e); if (e.matches?.('.bubble.cloud')) fitCloud(e); else e.querySelectorAll?.('.bubble.cloud').forEach(fitCloud); return e; };
const clearUI = () => { ui.innerHTML = ''; };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), rnd = (a, b) => a + Math.random() * (b - a);
const ease = t => 1 - Math.pow(1 - clamp(t, 0, 1), 3), easeIO = t => { t = clamp(t, 0, 1); return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const ar = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]).replace('.', '٫');   /* the Arabic decimal comma «٣٫٢» (committee r9) */
const esc = s => String(s).replace(/[<>&"]/g, '');
const pgT = p => `<span class="pg tw">✍️ صِيَاغَةُ الْمُعَلِّمِ – صُورَةُ ص${ar(p)}</span>`;   /* a sentence the teacher wrote for a book picture without a sentence */
const pg = (p, derived) => `<span class="pg" ${derived ? 'title="⚙️"' : ''}>📖 ${derived ? 'مِنْ ' : ''}ص${ar(p)}</span>`;   /* derived = a book sentence turned positive ("لا" removed) */
const calm = () => document.body.classList.contains('calm');
let K;                                         // data/keys.json
const SET = () => state.settings || (state.settings = {});
const K5 = () => state.k5 || (state.k5 = { first: null, picks: null, done: false });
const KEYCOL = { g: '#CD7F32', r: '#C6D0DA', y: '#F2B705' };   /* bronze → silver → gold (the teacher's choice); green and red stay for safe / unsafe */
const keySvg = c => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="20" cy="32" r="14" fill="${c}" stroke="#1b1b1b" stroke-width="4"/><circle cx="20" cy="32" r="5" fill="#fff" stroke="#1b1b1b" stroke-width="3"/><path d="M33 28h26v8h-5v8h-7v-8h-4v6h-6v-6h-4z" fill="${c}" stroke="#1b1b1b" stroke-width="4" stroke-linejoin="round"/></svg>`;

// ------------------------------------------------------------------ drawing
// backgrounds are scaled to 1280×720 once (not every frame): lab PCs without a graphics card draw them much faster
const FIT = {};
function fitted(key) {
  if (FIT[key]) return FIT[key]; const im = IMG[key]; if (!ready(im)) return null;
  const c = document.createElement('canvas'); c.width = W; c.height = H; const k = Math.max(W / im.naturalWidth, H / im.naturalHeight);
  c.getContext('2d').drawImage(im, (W - im.naturalWidth * k) / 2, (H - im.naturalHeight * k) / 2, im.naturalWidth * k, im.naturalHeight * k); return (FIT[key] = c);
}
function cover(key, dim = 0) {
  const c = fitted(key); if (!c) { ctx.fillStyle = '#EADFC8'; ctx.fillRect(0, 0, W, H); return; }
  ctx.drawImage(c, 0, 0);
  if (dim) { ctx.fillStyle = `rgba(255,247,230,${dim})`; ctx.fillRect(0, 0, W, H); }
}
// a sprite: x = centre, foot = ground line, h = height. o.flip mirrors, o.rot rotates about the foot (radians)
function sprite(key, x, foot, h, o = {}) {
  const im = IMG[key]; if (!ready(im)) return 0;
  const w = im.naturalWidth / im.naturalHeight * h;
  if (o.shadow !== false) { ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.beginPath(); ctx.ellipse(x, foot, w * .32, h * .035, 0, 0, 7); ctx.fill(); }
  ctx.save(); ctx.translate(x, foot); if (o.rot) ctx.rotate(o.rot); if (o.flip) ctx.scale(-1, 1); if (o.alpha != null) ctx.globalAlpha = o.alpha;
  ctx.drawImage(im, -w / 2, -h, w, h);
  const kim = HOLD === 'r' ? KEYIMG_S : !G.keys.includes('g') ? KEYIMG : null;
  if (HAND[key] && kim && !o.noKey && kim.complete) {   /* «هادي» holds the bronze key until he gives it to Salem; later the silver key for door 2 (teacher) */
    const [fx, fy, rot] = HAND[key], ks = h * (HOLD === 'r' ? .3 : key === 'salem_lammah' ? .19 : .27);
    ctx.translate(-w / 2 + w * fx, -h + h * fy); ctx.rotate(rot); ctx.shadowColor = '#FFD23F'; ctx.shadowBlur = 12;
    ctx.drawImage(kim, -ks * 20 / 64, -ks / 2, ks, ks);              /* the ring in his glove, the blade out */
  }
  ctx.restore(); return w;
}
/* where «هادي»'s glove is on each picture (fractions of the picture) and the key's angle there */
const SCARD = [.09, .56];   /* where Salem's hand is on the salem_card picture (fractions) */
const HAND = { lammah_ok: [.64, .64, -1.1], lammah_red: [.64, .64, -1.1], lammah_yellow: [.64, .64, -1.1], lammah_green: [.64, .64, -1.1], lammah_point: [.23, .37, -1.9], lammah_back: [.72, .57, 1.2], hadi_talk: [.11, .66, -1.1], hadi_talk_red: [.11, .66, -1.1], hadi_talk_yellow: [.11, .66, -1.1], hadi_talk_green: [.11, .66, -1.1], hadi_walk: [.08, .65, 1.2], salem_lammah: [.89, .25, -1.3] };
const KEYIMG = new Image(), KEYIMG_S = new Image(); let HOLD = null;
function rr(x, y, w, h, r, fill, stroke = INK, lw = 5) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.stroke(); } }
function askSign(x, foot, s = 1) {   /* level-2 stations: a round yellow «؟» sign (neutral) */
  const p = 1 + Math.sin(clock * 6) * .06 * (calm() ? 0 : 1); ctx.save(); ctx.translate(x, foot); ctx.scale(s * p, s * p);
  ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(0, 0, 16, 5, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#9aa3ab'; ctx.fillRect(-4, -70, 8, 70); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.strokeRect(-4, -70, 8, 70);
  ctx.shadowColor = '#FFD23F'; ctx.shadowBlur = 16; ctx.beginPath(); ctx.arc(0, -98, 38, 0, 7); ctx.fillStyle = '#FFC93C'; ctx.fill(); ctx.shadowBlur = 0; ctx.lineWidth = 4; ctx.stroke();
  ctx.fillStyle = INK; ctx.font = '900 52px Tajawal'; ctx.textAlign = 'center'; ctx.fillText('؟', 0, -80); ctx.restore();
}
function dangerSign(x, foot, s = 1) {
  const p = 1 + Math.sin(clock * 6) * .06 * (calm() ? 0 : 1); ctx.save(); ctx.translate(x, foot); ctx.scale(s * p, s * p);
  ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(0, 0, 16, 5, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#9aa3ab'; ctx.fillRect(-4, -70, 8, 70); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.strokeRect(-4, -70, 8, 70);
  ctx.shadowColor = '#FF3B3B'; ctx.shadowBlur = 16;
  ctx.beginPath(); ctx.moveTo(0, -130); ctx.lineTo(42, -58); ctx.lineTo(-42, -58); ctx.closePath(); ctx.fillStyle = '#E5232F'; ctx.fill(); ctx.shadowBlur = 0; ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, -114); ctx.lineTo(28, -66); ctx.lineTo(-28, -66); ctx.closePath(); ctx.fillStyle = '#fff'; ctx.fill();
  ctx.fillStyle = INK; ctx.fillRect(-3.5, -103, 7, 22); ctx.beginPath(); ctx.arc(0, -74, 4, 0, 7); ctx.fill(); ctx.restore();
}
function warn(x, y, s = 1) {   // ⚠ a pulsing warning sign drawn in code
  const p = 1 + Math.sin(clock * 8) * .08 * (calm() ? 0 : 1); ctx.save(); ctx.translate(x, y); ctx.scale(s * p, s * p);
  ctx.beginPath(); ctx.moveTo(0, -46); ctx.lineTo(48, 38); ctx.lineTo(-48, 38); ctx.closePath(); ctx.fillStyle = '#FFC93C'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.lineJoin = 'round'; ctx.stroke();
  ctx.fillStyle = INK; ctx.fillRect(-5, -18, 10, 32); ctx.beginPath(); ctx.arc(0, 26, 6, 0, 7); ctx.fill(); ctx.restore();
}

// ------------------------------------------------------------------ the street (side view, measured on bg_side)
const ROAD = { farFoot: 348, farLane: 424, nearLane: 524, nearFoot: 702, top: 366, bot: 528 };
const ZX = 820;                                         // the zebra crossing
const SIZE = { salem: 250, carNear: 160, carFar: 132 };
function zebra(x, glow = 0) {
  const n = Math.floor((ROAD.bot - ROAD.top - 18) / 24) + 1;
  for (let i = 0; i < n; i++) { const y = ROAD.top + 8 + i * 24, on = glow * n > n - 1 - i; ctx.fillStyle = on ? '#FFF39A' : 'rgba(255,255,255,.94)'; if (on) { ctx.shadowColor = '#FFE45C'; ctx.shadowBlur = 18; } ctx.fillRect(x - 72, y, 144, 12); ctx.shadowBlur = 0; }
  ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.fillRect(x - 108, ROAD.nearLane - 70, 8, 72); ctx.fillRect(x + 100, ROAD.top + 2, 8, 56);   // stop lines
  if (ready(IMG.ped_sign)) sprite('ped_sign', x + 160, ROAD.farFoot + 2, 240);   /* Bahrain's pedestrian-crossing sign on the far pavement, right of the crossing */
}
/* one round lamp: lit = halo + bright glass; off = dark glass with a hint of its colour; a small visor above */
const LAMP = { red: ['#FF3B30', '#5a1d1d'], yellow: ['#FFC21A', '#5a4a14'], green: ['#34E05A', '#173f22'], man: ['#ff4545', '#3a1818'], walk: ['#3df08a', '#123a24'] };
function lamp(x, y, r, c, lit) {
  const [on, off] = LAMP[c];
  ctx.save();
  if (lit) {
    const halo = ctx.createRadialGradient(x, y, r * .6, x, y, r * 3.2); halo.addColorStop(0, on + 'aa'); halo.addColorStop(1, on + '00');
    ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(x, y, r * 3.2, 0, 7); ctx.fill();
    const g = ctx.createRadialGradient(x - r * .3, y - r * .3, r * .1, x, y, r); g.addColorStop(0, '#ffffff'); g.addColorStop(.35, on); g.addColorStop(1, on);
    ctx.fillStyle = g; ctx.shadowColor = on; ctx.shadowBlur = r * 1.6;
  } else {
    const g = ctx.createRadialGradient(x - r * .3, y - r * .3, r * .1, x, y, r); g.addColorStop(0, off); g.addColorStop(1, '#141a20'); ctx.fillStyle = g;
  }
  ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
  ctx.lineWidth = 2; ctx.strokeStyle = '#0d1116'; ctx.stroke();
  ctx.fillStyle = '#1b232c'; ctx.beginPath(); ctx.arc(x, y, r * 1.18, Math.PI * 1.08, Math.PI * 1.92); ctx.arc(x, y, r * .98, Math.PI * 1.92, Math.PI * 1.08, true); ctx.fill();   /* visor */
  ctx.restore();
}
function pedLight(x, foot, h, green) {
  rr(x - 5, foot - h, 10, h, 3, '#55606B', INK, 3); rr(x - 24, foot - h - 92, 48, 96, 10, '#2B3A4A', INK, 4);
  const man = (cy, col, walk) => {
    lamp(x, cy, 18, walk ? 'walk' : 'man', !!col); if (!col) return;
    ctx.save(); ctx.strokeStyle = '#ffffff'; ctx.fillStyle = '#ffffff'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.shadowColor = col; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.arc(x, cy - 10, 3.6, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(x, cy - 6); ctx.lineTo(x, cy + 4);
    if (walk) { ctx.moveTo(x, cy + 4); ctx.lineTo(x - 6, cy + 12); ctx.moveTo(x, cy + 4); ctx.lineTo(x + 6, cy + 12); ctx.moveTo(x - 6, cy); ctx.lineTo(x + 6, cy - 4); }
    else { ctx.moveTo(x - 2, cy + 4); ctx.lineTo(x - 2, cy + 13); ctx.moveTo(x + 2, cy + 4); ctx.lineTo(x + 2, cy + 13); ctx.moveTo(x - 6, cy - 5); ctx.lineTo(x - 6, cy + 4); ctx.moveTo(x + 6, cy - 5); ctx.lineTo(x + 6, cy + 4); }
    ctx.stroke(); ctx.restore();
  };
  man(foot - h - 68, green ? null : '#ff4545', false); man(foot - h - 22, green ? '#3df08a' : null, true);
}
function carLight(x, foot, h, on, s = 1) {
  rr(x - 5 * s, foot - h, 10 * s, h, 3, '#55606B', INK, 3); rr(x - 22 * s, foot - h - 92 * s, 44 * s, 96 * s, 9, '#2B3A4A', INK, 4);
  ['red', 'yellow', 'green'].forEach((c, k) => lamp(x, foot - h - (75 - k * 29) * s, 11 * s, c, on === c));
}
const LIGHT = { near: { x: ZX - 150, foot: ROAD.nearFoot - 70, h: 190 }, ped: { x: ZX + 110, foot: ROAD.nearFoot - 70, h: 170 } };
function lights(sig) {   // the far-side lights are small; the near ones big (the child looks at those)
  carLight(ZX + 150, ROAD.farFoot - 2, 104, sig.car, .8); pedLight(ZX - 110, ROAD.farFoot - 2, 96, sig.ped === 'green');
}
function nearLights(sig) { carLight(LIGHT.near.x, LIGHT.near.foot, LIGHT.near.h, sig.car); pedLight(LIGHT.ped.x, LIGHT.ped.foot, LIGHT.ped.h, sig.ped === 'green'); }

// cars: right-hand traffic. near lane (1) moves left→right, far lane (0) right→left.
// physics: cruise 240 px/s, pull-away 120 px/s², braking at constant deceleration so the bumper stops exactly 60 px before the line.
const CARK = ['car_red', 'car_silver', 'car_blue', 'car_white'];
function traffic(lanes = [0, 1], n = 2) { const c = []; lanes.forEach(l => { for (let i = 0; i < n; i++) c.push({ k: CARK[(l * 2 + i) % 4], lane: l, x: l ? -260 - i * 760 : W + 260 + i * 760, s: 220, vmax: l ? 240 : 210, dip: 0 }); }); return c; }
const carH = c => c.lane ? SIZE.carNear : SIZE.carFar;
const carW = c => { const im = IMG[c.k]; return (ready(im) ? im.naturalWidth / im.naturalHeight : 2.3) * carH(c); };
function driveCars(cars, dt, stop) {
  for (const c of cars) {
    const dir = c.lane ? 1 : -1, w = carW(c), front = c.x + dir * w / 2;
    let target = null;                                          // the point the bumper must not pass
    if (stop) { const line = dir > 0 ? ZX - 112 - 60 : ZX + 112 + 60, d = dir > 0 ? line - front : front - line; if (d > -4) target = d; }
    for (const o of cars) if (o !== c && o.lane === c.lane) { const ob = o.x - dir * carW(o) / 2, d = dir > 0 ? ob - front - 70 : front - ob - 70; if (d > -30 && d < 400 && (target == null || d < target)) target = Math.max(0, d); }
    let a = 120;
    if (target != null) { const need = c.s * c.s / (2 * Math.max(target, 1)); if (target < 2) { c.s = 0; a = 0; } else if (need > 170) a = -need; }
    const s0 = c.s; c.s = clamp(c.s + a * dt, 0, c.vmax); c.dip += ((c.s < s0 ? (s0 - c.s) / dt / 260 : 0) - c.dip) * Math.min(1, dt * 10);
    c.x += dir * c.s * dt;
    if (dir > 0 && c.x > W + 420) c.x = Math.min(-300, ...cars.filter(o => o.lane === c.lane && o !== c).map(o => o.x - 760));
    if (dir < 0 && c.x < -420) c.x = Math.max(W + 300, ...cars.filter(o => o.lane === c.lane && o !== c).map(o => o.x + 760));
  }
}
const carsStopped = cars => cars.every(c => { const dir = c.lane ? 1 : -1, front = c.x + dir * carW(c) / 2, line = dir > 0 ? ZX - 112 : ZX + 112; return c.s < 1 || (dir > 0 ? front < line - 300 && c.x < -100 : front > line + 300 && c.x > W + 100) || (dir > 0 ? c.x - carW(c) / 2 > ZX + 112 : c.x + carW(c) / 2 < ZX - 112); });
function drawCars(cars, lane) { for (const c of cars) if (c.lane === lane) sprite(c.k, c.x, lane ? ROAD.nearLane : ROAD.farLane, carH(c), { flip: lane === 0, rot: (lane ? 1 : -1) * c.dip * .026 }); }

// Salem on the street: idle / walk / look / wait / shake / cross (walks away up the zebra, smaller with depth)
function salemNew(x) { return { x, foot: ROAD.nearFoot, h: SIZE.salem, mode: 'idle', face: -1, t: 0, cy: 0 }; }
function salemUpdate(s, dt) { s.t += dt; if (s.mode === 'walk' && s.to != null) { const d = s.to - s.x; s.face = Math.sign(d) || s.face; s.x += Math.sign(d) * Math.min(Math.abs(d), 110 * dt); if (Math.abs(d) < 1) { s.x = s.to; s.to = null; s.mode = 'idle'; } } }
function salemDraw(s) {
  if (s.mode === 'hidden') return;
  if (s.mode === 'cross') { const k = s.cy / 350; sprite(`k_back${((clock * 7) | 0) % 4}`, s.x, s.foot - s.cy, s.h * (1 - k * .4), { shadow: true }); return; }
  if (s.mode === 'back') { sprite(ready(IMG.k_bstand) ? 'k_bstand' : 'k_back1', s.x, s.foot, s.h, { shadow: true }); return; }   /* standing, looking ahead across the street */
  if (s.mode === 'run') { sprite(`k_back${((clock * 12) | 0) % 4}`, s.x, s.foot - s.cy, s.h * (1 - s.cy / 350 * .4)); return; }
  if (s.mode === 'walk') { sprite(`k_walk${((clock * 7) | 0) % 4}`, s.x, s.foot, s.h, { flip: s.face > 0 }); return; }
  if (s.mode === 'look') { sprite('k_walk0', s.x, s.foot, s.h, { flip: Math.floor(s.t * 1.6) % 2 === 0 }); return; }
  if (s.mode === 'shake') { sprite('k_idle', s.x, s.foot, s.h, { rot: Math.sin(s.t * 26) * .06 * Math.max(0, 1 - s.t / .7) }); return; }
  if (s.mode === 'talk') { sprite(ready(IMG.salem_talk) ? 'salem_talk' : 'k_idle', s.x, s.foot, s.h); return; }   /* turned a little towards «هادي» */
  if (s.mode === 'wait') { sprite('k_idle', s.x, s.foot - Math.abs(Math.sin(s.t * 6)) * 3, s.h); return; }
  if (s.mode === 'cheerFar') { sprite('k_cheer', s.x, ROAD.farFoot + 4 - Math.abs(Math.sin(s.t * 8)) * 10, s.h * .82); return; }   /* bigger (teacher) */   /* safe on the other side: a small jump of joy */
  if (s.mode === 'cheer') { sprite('k_cheer', s.x, s.foot - Math.abs(Math.sin(s.t * 7)) * 14, s.h); return; }
  sprite('k_idle', s.x, s.foot, s.h);
}
const salemHead = s => ({ x: s.x, y: s.foot - s.h - 8 });

// ------------------------------------------------------------------ loop, scenes, freeze
let scene = null, clock = 0, last = 0, frozen = null;
function loop(t) { const dt = Math.min(.05, (t - last) / 1000 || 0); last = t; clock += dt; step(dt); requestAnimationFrame(loop); }
const dlg = () => document.getElementById('teach').open;
function step(dt) { if (frozen) { ctx.drawImage(frozen, 0, 0); fx(dt); return; } if (!scene) return; if (!dlg()) scene.update && scene.update(dt); scene.draw && scene.draw(dt); fx(dt); }
function freeze(gray = .3) { const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); x.filter = `saturate(${1 - gray})`; x.drawImage(cv, 0, 0); frozen = c; }
let RUN = 0; const CLEAN = [];
const wait = ms => { const r = RUN; return new Promise(res => setTimeout(() => { if (r === RUN) res(); }, ms)); };
const until = (f, max = 20000) => { const r = RUN, t0 = performance.now(); return new Promise(res => { const tick = () => { if (r !== RUN) return; if (f() || performance.now() - t0 > max) res(); else setTimeout(tick, 50); }; tick(); }); };
const fade = document.getElementById('fade');
function go(fn) { fade.classList.add('on'); setTimeout(() => { RUN++; frozen = null; while (CLEAN.length) CLEAN.pop()(); parts.length = 0; clearUI(); document.body.classList.remove('lens-cursor'); fn(); fade.classList.remove('on'); }, 280); }
// a picture of the canvas for the cards; r = the part around the action (4:3)
function snap(r) { if (!r) return cv.toDataURL('image/jpeg', .82); const c = document.createElement('canvas'); c.width = 480; c.height = 360; c.getContext('2d').drawImage(cv, r.x, r.y, r.w, r.w * .75, 0, 0, 480, 360); return c.toDataURL('image/jpeg', .85); }
const STREET_CROP = { x: ZX - 360, y: 210, w: 680 };
function render(fn) { fn(); return snap(); }       // draw something once on the canvas and take its picture (the next frame redraws the scene)

// keyboard: Enter presses the main button; Space presses the focused target
addEventListener('keydown', e => { if (dlg() || e.target.tagName === 'INPUT') return; if (e.code === 'Enter') { const b = ui.querySelector('.go:not([disabled])'); if (b) { e.preventDefault(); b.click(); } } });

// ------------------------------------------------------------------ effects
const parts = [];
const COL = ['#FFC93C', '#EF4F5F', '#4CB050', '#5DA9E9', '#F28C38'];
function burst(x, y, cols = COL, n = 14) { if (calm()) n = 4; for (let i = 0; i < n; i++) { const a = rnd(0, 7), v = rnd(140, 320); parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 140, life: rnd(.5, .9), c: cols[i % cols.length], r: rnd(6, 11) }); } }
function confetti(n = 80) { if (calm()) n = 10; for (let i = 0; i < n; i++) parts.push({ x: rnd(0, W), y: rnd(-220, 0), vx: rnd(-40, 40), vy: rnd(90, 210), life: rnd(2.5, 4), c: COL[i % 5], r: rnd(6, 11), g: 30 }); }
function fx(dt) { for (let i = parts.length - 1; i >= 0; i--) { const p = parts[i]; p.life -= dt; if (p.life <= 0) { parts.splice(i, 1); continue; } p.vy += (p.g || 420) * dt; p.x += p.vx * dt; p.y += p.vy * dt; ctx.globalAlpha = Math.min(1, p.life * 2); ctx.fillStyle = p.c; ctx.fillRect(p.x - p.r / 2, p.y - p.r / 4, p.r, p.r / 2); ctx.globalAlpha = 1; } }

// ------------------------------------------------------------------ game state (one run)
const G = { keys: [], stars: 0, log: [], pips: [] };
function resetRun() { G.keys = []; G.stars = 0; G.log = []; G.pips = []; G.hudShown = false; }

// ------------------------------------------------------------------ HUD: keys (right), progress road (middle), stars + the log (left)
function hud(kind = 'safe') {
  ui.querySelector('.hud')?.remove();
  const pip = i => `<i class="${G.pips[i] || ''}" data-i="${i}"></i>`;
  const el = add(`<div class="hud">
    <div class="keys">${['g', 'r', 'y'].map(c => `<div class="kslot ${G.keys.includes(c) ? 'on' : ''}" data-k="${c}">${keySvg(KEYCOL[c])}</div>`).join('')}</div>
    <div class="road">${[0, 1, 2].map(pip).join('')}<i class="sep"></i>${[4, 5, 6, 7].map(pip).join('')}<i class="sep"></i>${[8, 9, 10, 11, 12, 13, 14].map(pip).join('')}</div>
    <div class="stars" data-l="نُجُومِي">⭐ <b>${ar(G.stars)}</b></div>
    <button class="talk" title="⚙️" data-l="اقْرَأْ ثَانِيَةً">💬</button>
    <button class="log" title="⚙️" data-l="سِجِلِّي">${kind === 'safe' ? '<img class="emb" src="assets/v5/emblem.webp" alt="">' : '🔍'}<span>${ar(G.log.filter(c => c.kind === (kind === 'safe' ? 'ok' : 'no')).length)}</span></button>
  </div>`);
  el.querySelector('.log').onclick = () => showLog(kind);
  el.querySelector(".talk").onclick = () => { const cur = ui.querySelector('.bubble'); if (cur) { cur.classList.remove('again'); void cur.offsetWidth; cur.classList.add('again'); } else if (LAST) say(...LAST); };   /* re-reading never skips the story (committee) */
  return el;
}
function showLog(kind) {
  const list = G.log.filter(c => c.kind === (kind === 'safe' ? 'ok' : 'no')); if (!list.length) return;
  const p = add(`<div class="panel board"><div class="phead">${kind === 'safe' ? '<img class="embi" src="assets/v5/emblem.webp" alt=""> سِجِلُّ السُّلُوكِ الْآمِنِ' : '🔍 سِجِلُّ السُّلُوكِ غَيْرِ الْآمِنِ'}</div>
    <div class="grid">${list.map(c => `<div class="mc ${c.kind}"><img src="${c.img}" alt=""><p>${c.kind === 'ok' ? '✓' : '✗'} ${esc(c.text)} ${c.tw ? pgT(c.page) : pg(c.page, c.from)}</p></div>`).join('')}</div><button class="btn small go">✓</button></div>`);
  p.querySelector('.go').onclick = () => p.remove();
}
const hudEl = sel => ui.querySelector(`.hud ${sel}`);
// a reward flies on an arc to its HUD place, then the place bumps
function fly(html, cls, from, toSel) {
  const to = hudEl(toSel); if (!to) return Promise.resolve();
  const f = add(`<div class="flyer ${cls}">${html}</div>`); const r0 = f.getBoundingClientRect(), w = r0.width / SCALE, h = r0.height / SCALE;
  f.style.left = from.x - w / 2 + 'px'; f.style.top = from.y - h / 2 + 'px';
  const sr = stage.getBoundingClientRect(), tr = to.getBoundingClientRect(), tx = (tr.left + tr.width / 2 - sr.left) / SCALE, ty = (tr.top + tr.height / 2 - sr.top) / SCALE;
  requestAnimationFrame(() => requestAnimationFrame(() => { f.style.transform = `translate(${tx - from.x}px, ${ty - from.y}px) scale(.35)`; f.style.opacity = '.2'; }));
  return new Promise(res => setTimeout(() => { f.remove(); to.classList.remove('bump'); void to.offsetWidth; to.classList.add('bump'); res(); }, 780));
}
KEYIMG.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(keySvg(KEYCOL.g).replace('viewBox', 'width="128" height="128" viewBox'));
KEYIMG_S.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(keySvg(KEYCOL.r).replace('viewBox', 'width="128" height="128" viewBox'));
async function gainStar(from) { G.stars++; await fly('⭐', 'star', from, '.stars'); const b = hudEl('.stars b'); if (b) b.textContent = ar(G.stars); const st = hudEl('.stars'); if (st) { st.classList.remove('gain'); void st.offsetWidth; st.classList.add('gain'); setTimeout(() => st.classList.remove('gain'), 1500); } }   /* the star box flashes when Salem is rewarded (teacher) */
async function gainKey(c, from) {
  if (!G.keys.includes(c)) G.keys.push(c);
  await fly(keySvg(KEYCOL[c]), 'key', from, `.kslot[data-k="${c}"]`);
  hudEl(`.kslot[data-k="${c}"]`)?.classList.add('on');
}
function setPip(i, cls) { G.pips[i] = cls; const el = ui.querySelector(`.hud .road i[data-i="${i}"]`); if (el) { el.className = cls; el.classList.add('bump'); } }

// ------------------------------------------------------------------ speech bubble: one named speaker, one short line
// (x, y) = the speaker's head on the stage. The bubble sits above it, its tail points at the head.
const WHO = { salem: 'سَالِمٌ', teacher: 'الْمُعَلِّمُ', lammah: 'هَادِي 🚦' };   // «هادي»: the traffic-light character of the book (p39), the child's guide (renamed by the teacher from «هادي»; the code keys stay 'lammah')
let LAST = null;   // the last bubble, so the child can read it again (💬)
/* a bubble stays at least READ ms before the story moves on, so a seven-year-old can read it (teacher's request: 5–6 s) */
const READ = 5500; let SAID = 0;
/* a cloud stays until the child presses «التَّالِي» (or Space / Enter): weak readers read at their own pace (committee, teacher 29 Oct 2026).
   With no cloud on the stage it waits as before. */
const tapNext = (x, y, bb = null) => new Promise(res => {
  const r = RUN, t0 = performance.now(), b = add(`<button class="nextb" style="left:${x}px;top:${y}px">التَّالِي ◀</button>`);
  let over = false;
  const end = ok => { if (over) return; over = true; clearInterval(iv); removeEventListener('keydown', key); b.remove(); if (ok && r === RUN) res(); };
  const done = () => { if (performance.now() - t0 >= 500) end(true); };
  const key = e => { if (e.code === 'Space' || e.code === 'Enter' || e.code === 'NumpadEnter') { e.preventDefault(); done(); } };
  b.onclick = done; addEventListener('keydown', key);
  /* each button watches only its own cloud: if that cloud is taken away, the story goes on */
  const iv = setInterval(() => { if (r !== RUN) end(false); else if (bb && !bb.isConnected) end(true); }, 200);
});
const read = (ms = READ) => {
  const bb = ui.querySelector('.bubble');
  if (!bb) return wait(Math.max(0, ms - (performance.now() - SAID)));
  return tapNext(clamp(bb.offsetLeft + bb.offsetWidth / 2 - 62, 8, W - 150), clamp(bb.offsetTop + bb.offsetHeight - 4, 8, H - 60), bb);   /* under the middle of the cloud, clear of its puffs */
};
function say(who, html, x, y, o = {}) {
  html = html.replace(/\s*<span class="pg"[^>]*>[^<]*<\/span>/g, '');   /* no page numbers in the speech clouds (teacher) */
  LAST = [who, html, x, y, o]; SAID = performance.now();
  ui.querySelectorAll('.bubble').forEach(b => b.remove());
  const b = add(`<div class="bubble ${who === 'teacher' ? 't' : who === 'lammah' ? 'l' : ''} ${o.cls || ''}"><span class="who">${WHO[who] || WHO.salem}</span>${html}</div>`);
  if (o.max) b.style.maxWidth = o.max + 'px';
  const bw = b.offsetWidth, bh = b.offsetHeight;
  const left = clamp(o.side === 'left' ? x - bw + 50 : x - 60, 16, W - bw - 16), top = clamp(y - bh - 30, b.classList.contains("cloud") ? 104 : 78, H - bh - 16);   /* clouds clear of the top buttons and their labels */
  b.style.left = left + 'px'; b.style.top = top + 'px'; b.style.setProperty('--tail', clamp(left + bw - x - 13, 20, bw - 46) + 'px');
  return b;
}
const hush = () => ui.querySelectorAll('.bubble').forEach(b => b.remove());
/* put a cloud BESIDE a speaker (to the right of the head, at head height) with small puffs pointing to the head (teacher: no cloud on a face) */
function sideCloud(b, head, below = false) {
  const bw = b.offsetWidth, bh = b.offsetHeight, x = below ? 24 : clamp(head[0] + 90, 16, W - bw - 16), y = below ? 400 : clamp(head[1] - bh / 2, 104, H - bh - 16);
  b.style.left = x + 'px'; b.style.top = y + 'px'; b.classList.add('side');
  [[.35, 24, 18], [.7, 13, 10]].forEach(([k, dw, dh]) => { const d = document.createElement('i'); d.className = 'ftail'; const ex = x + 30, ey = y + bh / 2;
    d.style.cssText = `position:absolute;left:${ex + (head[0] + 30 - ex) * k - dw / 2 - x}px;top:${ey + (head[1] - ey) * k - dh / 2 - y}px;width:${dw}px;height:${dh}px`; b.appendChild(d); });
  return b;
}

// ------------------------------------------------------------------ click targets on the picture
// a ring pulses on the target; a hand shows it at first (o.hand) or after the child waits 8 s (the idle hint)
/* at school: Salem gets out of the car; the child clicks the side he gets out on (the pavement), and the card «أَنْزِلُ مِنَ السَّيَّارَةِ مِنْ جِهَةِ الرَّصِيفِ.»
   joins his safe cards (the teacher's wording for the p39 picture; committee final) */
function kerbScene() {
  return new Promise(res => {
    let pic = 'c_kerb_q';   /* first the parked car, doors shut, the pavement on one side and the road on the other: the picture does not give the answer */
    scene = { draw() { const im = IMG[pic]; if (ready(im)) { const h = W / im.naturalWidth * im.naturalHeight; ctx.drawImage(im, 0, pic === 'c_kerb_q' ? -150 : H - h, W, h); } else cover('bg_side'); } };   /* the question: the window, the road and the pavement all show; the answer: its foot on the screen's foot */
    (async () => {
      await wait(500);
      const ask = () => say('salem', 'وَصَلْنَا!<br>مِنْ أَيِّ جِهَةٍ أَنْزِلُ مِنَ السَّيَّارَةِ؟<br>اضْغَطْ عَلَيْهَا!', 960, 20, { cls: 'cloud' });
      ask();
      const road = add(`<button class="hit sq ring" aria-label="⚙️" style="left:78px;top:535px;width:150px;height:300px"></button>`);   /* the road side (no guiding hand here); same shape and size as the pavement frame, so the frame gives no hint (supervisor, v207 review) */
      road.onclick = async e => { e.stopPropagation(); hush(); say('salem', 'هُنَا الشَّارِعُ،<br>وَفِيهِ سَيَّارَاتٌ!<br>اخْتَرِ الْجِهَةَ الْأُخْرَى.', 960, 20, { cls: 'cloud' }); };   /* the teacher's wording: a gentle second chance */
      const h = hit(1150, 535, { w: 150, h: 300, sq: true }); await h.p; road.remove(); hush();
      burst(1150, 470, ['#4CB050', '#FFC93C', '#fff']);
      pic = 'c_kerb'; await wait(300);   /* then Salem gets out on the pavement */
      say('salem', 'أَنْزِلُ مِنَ السَّيَّارَةِ<br>مِنْ جِهَةِ الرَّصِيفِ.', 980, 40, { cls: 'cloud' }); await read(); hush();
      if (!G.log.some(c => c.id === 'kerb')) { G.log.push({ kind: 'ok', id: 'kerb', tw: true, img: 'assets/v6/c_kerb.jpg', text: 'أَنْزِلُ مِنَ السَّيَّارَةِ مِنْ جِهَةِ الرَّصِيفِ.', page: 39 }); const tag = hudEl('.log span'); if (tag) tag.textContent = ar(G.log.filter(c => c.kind === 'ok').length); }
      await gainStar({ x: 470, y: 600 }); res();
    })();
  });
}
function hit(x, y, o = {}) {
  const w = o.w || o.r * 2 || 140, h = o.h || o.r * 2 || 140;
  const el = add(`<button class="hit ${o.sq ? 'sq' : ''} ${o.ring === false ? '' : 'ring'}" aria-label="⚙️" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"></button>`);
  let hand = null; const showHand = () => { if (!hand && el.isConnected) hand = add(`<div class="hand" style="left:${x - 10}px;top:${y + h / 2 - 20}px">👆</div>`); };
  if (o.hand) showHand(); const t = setTimeout(showHand, 8000);
  const done = () => { clearTimeout(t); hand?.remove(); el.remove(); };
  const p = new Promise(res => { el.onclick = e => { e.stopPropagation(); done(); res(); }; });
  el.focus({ preventScroll: true });
  return { el, p, done };
}
// clicks that miss every target: a ripple, and after two misses the target glows (no penalty)
function misses(onMiss) {
  const c = add(`<div style="position:absolute;inset:0;z-index:1"></div>`); let n = 0;
  c.onclick = e => { const p = toStage(e); const r = add(`<div class="ripple" style="left:${p.x}px;top:${p.y}px"></div>`); setTimeout(() => r.remove(), 600); n++; onMiss(n); };
  return () => c.remove();
}

// a target that also answers clicks elsewhere: a ripple, and after two misses Salem gives a short hint (no penalty)
async function hitHint(x, y, o, hint, head) {
  const h = hit(x, y, o); const stop = misses(n => { if (n >= 2) { say('lammah', hint, head.x, head.y, { cls: 'cloud' }); h.el.classList.add('ring'); } });
  await h.p; stop();
}

// ------------------------------------------------------------------ after a discovery (levels 1 and 2): on the scene itself, no card.
// «هادي» announces it in a cloud; Salem answers with the safe rule in one sentence (from the book, no page number); then a white «التالي».
// After a danger the two small pictures (what happened ✗ / the safe way ✓) stay between them.
function feedback(o) {
  hush();
  const ok = o.kind === 'ok', item = o.item, lk = ok ? 'lammah_ok' : 'lammah_stop', at = o.at;
  const car = o.car, el = add(`<div class="fb2 ${o.kind} ${at ? 'street' : car ? 'incar' : 'stage'}">
    ${at || car ? '' : `<img class="fbh" src="${MANIFEST[lk]}" alt=""><img class="fbs" src="${MANIFEST[ok ? 'k_cheer' : 'k_idle']}" alt="">`}
    <div class="bubble cloud fbc fbch ${o.kind}">${car ? car.dadSay : ok ? 'رَائِعٌ! لَقَدِ اكْتَشَفْتَ سُلُوكًا آمِنًا!' : 'انْتَبِهْ! لَقَدِ اكْتَشَفْتَ سُلُوكًا غَيْرَ آمِنٍ!'}</div>
    <div class="bubble cloud fbc fbcs">${((car && car.boySay) || item.say || item.card).split('|').map(esc).join('<br>')}</div>
    ${o.alt ? `<div class="fbpics"><figure><img src="${o.shot}" alt=""><b class="no">✗</b></figure><figure><img src="${o.alt}" alt=""><b class="ok">✓</b></figure></div>` : ''}
    <button class="btn big white go" style="visibility:hidden">التَّالِي ◀</button></div>`);
  { const nb = el.querySelector('.go'); setTimeout(() => { nb.style.visibility = ''; nb.classList.add('pop'); }, car ? 3000 : 1900); }   /* «التالي» comes after the praise, the words and the star (teacher, 29 Oct 2026) */
  /* the clouds: on the street they stand to the left of the pair on the far pavement, each with its tail of bubbles to its speaker's head;
     elsewhere the two big figures stand in the corners and the clouds are above them */
  const ch = el.querySelector('.fbch'), cs = el.querySelector('.fbcs');
  const tail = (c, to, delay) => {
    const x0 = c.offsetLeft, y0 = c.offsetTop, w = c.offsetWidth, h = c.offsetHeight;
    const fx = clamp(to[0], x0 + 60, x0 + w - 60), fy = clamp(to[1], y0 + 40, y0 + h - 30);       /* the cloud's edge point nearest the head */
    const ex = to[0] > x0 + w - 60 ? x0 + w - 40 : to[0] < x0 + 60 ? x0 + 40 : fx, ey = to[1] > y0 + h - 30 ? y0 + h - 22 : to[1] < y0 + 40 ? y0 + 20 : fy;
    [[.32, 26, 20], [.62, 15, 12]].forEach(([k, dw, dh]) => {
      const d = document.createElement('i'); d.className = 'ftail'; d.style.cssText = `left:${ex + (to[0] - ex) * k - dw / 2}px;top:${ey + (to[1] - ey) * k - dh / 2}px;width:${dw}px;height:${dh}px;animation-delay:${delay}s`;
      el.appendChild(d);
    });
  };
  if (car) {
    /* in the car (teacher): the father's praise sits on the dashboard in front of him; the boy's words sit low, below his face; no cloud on a face */
    ch.style.left = car.dash[0] + 'px'; ch.style.top = car.dash[1] + 'px'; cs.style.left = car.boyAt[0] + 'px'; cs.style.top = car.boyAt[1] + 'px';
    tail(ch, car.dad, 0); tail(cs, car.boy, .9);
    /* the father gives his son a star */
    setTimeout(() => { const st = add(`<div class="dadstar" style="left:${car.hand[0]}px;top:${car.hand[1]}px">⭐</div>`); requestAnimationFrame(() => requestAnimationFrame(() => { st.style.left = car.boy[0] + 'px'; st.style.top = car.boy[1] + 40 + 'px'; st.classList.add('go'); })); setTimeout(() => { burst(car.boy[0], car.boy[1] + 40, ['#FFD23F', '#fff']); st.remove(); }, 1300); }, 1400);
  } else if (at) {
    /* both clouds beside the pair, on its right, one under the other: no cloud on a face (teacher) */
    /* «هادي»'s short praise up on the right of the lights' pole; Salem's sentence below the pair, over the street: no face, no pole covered (committee) */
    ch.style.left = (W - 16 - ch.offsetWidth) + 'px'; ch.style.top = '104px';
    cs.style.left = '20px'; cs.style.top = '380px';
    tail(ch, at.h, 0); tail(cs, at.s, .9);
  } else {
    ch.style.right = '230px'; ch.style.top = '96px'; cs.style.left = '200px'; cs.style.top = (96 + ch.offsetHeight + 20) + 'px';
    const wid = (k, h) => ready(IMG[k]) ? IMG[k].naturalWidth / IMG[k].naturalHeight * h : h * .5;     /* the figures' heads: the tails go to them */
    tail(ch, [W - 40 - wid(lk, 300) / 2, H - 16 - 300 + 20], 0); tail(cs, [60 + wid(ok ? 'k_cheer' : 'k_idle', 310) / 2, H - 16 - 310 + 20], .9);
  }
  if (!car) burst(at ? at.h[0] : 1000, at ? at.h[1] - 40 : 200, ok ? ['#4CB050', '#FFC93C', '#fff'] : ['#EF4F5F', '#FFC93C', '#fff']);
  return new Promise(res => {
    el.querySelector('.go').onclick = async () => {
      el.remove(); G.log.push({ kind: o.kind, img: o.shot, text: item.card, page: item.page, from: !!item.from });
      const tag = hudEl('.log span'); fly(`<img src="${o.shot}" alt="">`, 'card', { x: 640, y: 360 }, '.log').then(() => { if (tag) tag.textContent = ar(+tag.textContent.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)) + 1); });
      await gainStar(car ? { x: car.boy[0], y: car.boy[1] + 40 } : { x: 640, y: 300 }); res();
    };
  });
}

// ================================================================== START SCREEN
/* the title screen: the game's name in the middle, three wooden doors (bronze → silver → gold, read from the right),
   Salem (with «درع الأمان») on the left and «هادي» (with the motto board) on the right.
   One row at the bottom, in order: 📜 rules → 🧑‍🏫 game instructions (for the teacher) → the name → «ابْدَأِ اللَّعِبَ».
   The sun rays and the glow move to the next step each time one is done (nothing is locked: they only guide). */
/* the motto's three pictures (teacher's choice): sort into the green / red boxes, two boys on a zebra crossing, the medal with the «درع الأمان» */
const MOTTO_ICONS = ['assets/v5/icon_classify.webp', 'assets/v5/icon_cross.webp', 'assets/v5/icon_medal.webp'];
/* the title doors carry the same banner (an SVG arc, the words follow it) and the same level tag as on the street */
const doorBannerSvg = i => { const L = DOOR_LEVELS[i]; return `<svg class="dban" viewBox="0 0 260 120" overflow="visible" aria-hidden="true"><defs><linearGradient id="dbg${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${L.c1}"/><stop offset="1" stop-color="${L.c2}"/></linearGradient><path id="dbp${i}" d="M22 106 A120 120 0 0 1 238 106"/></defs>
  <path d="M12 112 l-14 5 l9 -15 l-9 -13 l18 3z M248 112 l14 5 l-9 -15 l9 -13 l-18 3z" fill="${L.tail}" stroke="#1b1b1b" stroke-width="2.5" stroke-linejoin="round"/>
  <use href="#dbp${i}" fill="none" stroke="#1b1b1b" stroke-width="50" stroke-linecap="butt"/><use href="#dbp${i}" fill="none" stroke="url(#dbg${i})" stroke-width="44"/>
  <text font-family="Naskh" font-weight="800" font-size="${L.main.length > 38 ? 19 : 23}" fill="${L.ink}" dy="8"><textPath href="#dbp${i}" startOffset="50%" text-anchor="middle">${L.main}</textPath></text></svg>`; };
const DOORS = [['g', 'bronze', 'البرونزي'], ['r', 'silver', 'الفضي'], ['y', 'gold', 'الذهبي']];   /* plate names without marks: easier to read at this size (teacher's request) */
/* a shiny key of each door's metal, its tip at the keyhole as if about to go in (drawn in code: no text, crisp at any size) */
const METAL = { bronze: ['#F2B27A', '#B4682C', '#7A4316'], silver: ['#FFFFFF', '#B9C4CF', '#77838F'], gold: ['#FFF0A0', '#F2B705', '#A87400'] };
const keyMetal = m => { const [a, b, c] = METAL[m]; return `<svg viewBox="0 0 120 60"><defs><linearGradient id="km_${m}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset=".55" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient></defs>
  <g stroke="#3a2a12" stroke-width="3.5" stroke-linejoin="round" fill="url(#km_${m})"><circle cx="94" cy="30" r="21"/><path d="M75 24h-66v12h8v12h11v-12h7v9h10v-9h30z"/></g>
  <circle cx="94" cy="30" r="8" fill="#5b3b1a" stroke="#3a2a12" stroke-width="3"/><path d="M84 14q12-3 20 6" stroke="#fff" stroke-opacity=".75" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`; };
const RULES = () => [
  { img: 'rule_discover', text: 'اكْتَشِفِ السُّلُوكَ الْآمِنَ وَالسُّلُوكَ غَيْرَ الْآمِنِ.' },
  { img: 'rule_key', text: 'أَكْمِلْ كُلَّ تَحَدٍّ لِتَحْصُلَ عَلَى مِفْتَاحٍ.' },
  { img: 'rule_medal', text: 'اجْمَعِ الْمَفَاتِيحَ الثَّلَاثَةَ لِتَفُوزَ بِالْوِسَامِ.' },
];
const ORD = ['الْأُولَى', 'الثَّانِيَةُ', 'الثَّالِثَةُ'];
/* «قواعد اللعب»: a picture book the child turns page by page, on a calm plain background (no street, no title behind it).
   Right page: a big picture of the rule (Codex, no text in it) and the rule in big words under it.
   Left page: «هادي», the child's guide in the whole game, points at the picture.
   Buttons: back to the title (always there), previous page, next page; on the last page «ابدأ اللعب». No «فهمت». */
function rulesBook(onBack, onStart) {
  const R = RULES(); let i = 0, busy = false;
  const el = add(`<div class="bookscr">
    <div class="bkhead">قَوَاعِدُ اللَّعِبِ</div>
    <div class="book2">
      <div class="pg pr"><div class="pic"><img alt=""></div><p class="rtext"></p></div>
      <div class="spine"></div>
      <div class="pg pl"><div class="rnum"></div><img class="lampt" src="assets/v5/lammah_point.webp" alt=""><div class="dots">${R.map(() => '<i></i>').join('')}</div></div>
      <div class="turn"><div class="turnf"></div><div class="turnb"></div></div>
    </div>
    <div class="bkbtns">
      <button class="btn big bk-back">↩ الرُّجُوعُ إِلَى الْوَاجِهَةِ</button>
      <button class="btn big bk-prev">السَّابِقُ</button>
      <button class="btn big green bk-next">التَّالِي ◀</button>
    </div>
  </div>`);
  const img = el.querySelector('.pic img'), txt = el.querySelector('.rtext'), num = el.querySelector('.rnum'), dots = [...el.querySelectorAll('.dots i')];
  const prev = el.querySelector('.bk-prev'), next = el.querySelector('.bk-next'), turn = el.querySelector('.turn');
  const show = () => {
    img.src = MANIFEST[R[i].img]; txt.textContent = R[i].text; num.textContent = `الْقَاعِدَةُ ${ORD[i]}`;
    dots.forEach((d, k) => d.classList.toggle('on', k === i));
    prev.style.visibility = i ? 'visible' : 'hidden';
    const last = i === R.length - 1; next.textContent = last ? 'ابْدَأِ اللَّعِبَ ▶' : 'التَّالِي ◀'; next.classList.toggle('glow', last);
  };
  const flip = async dir => {                            // the page turns over the spine, then the next rule is there
    if (busy) return; busy = true; turn.className = `turn ${dir > 0 ? 'fwd' : 'back'}`;
    await wait(calm() ? 0 : 330); i += dir; show(); await wait(calm() ? 0 : 340); turn.className = 'turn'; busy = false;
  };
  next.onclick = () => (i < R.length - 1 ? flip(1) : (el.remove(), onStart()));
  prev.onclick = () => { if (i > 0) flip(-1); };
  el.querySelector('.bk-back').onclick = () => { el.remove(); onBack(); };
  show();
  return el;
}
/* «طريقة اللعب»: a poster that fills the screen (nothing behind it). Its parts come in one after another; each part shows the REAL
   control of the game (the glowing ring, the «التالي» and 💬 buttons, the magnifier, a card and its box) with a hand using it,
   and one short sentence under it. Two buttons: back to the title, start the game. */
const HOW = [
  { demo: `<div class="hd-solo"><img src="assets/v6/salem_front.webp" alt=""><img src="assets/v5/teacher.webp" alt=""></div>`,
    text: 'الْعَبْ وَحْدَكَ، وَالْمُعَلِّمُ يُسَاعِدُكَ إِذَا احْتَجْتَ.' },
  { demo: `<div class="hd-pic"><img src="assets/arcade/bg/side.webp" alt=""><span class="hit ring hd-ring"></span><span class="hd-hand tap">👆</span></div>`,
    text: 'اضْغَطْ عَلَى الْمَكَانِ الْمُضِيءِ لِتَكْتَشِفَ.' },
  { demo: `<div class="hd-btns"><span class="btn green hd-next">التَّالِي ◀</span><span class="talk hd-talk">💬</span><span class="hd-hand tap2">👆</span></div>`,
    text: 'اضْغَطِ «التَّالِي» لِتَنْتَقِلَ، وَاضْغَطِ الْغَيْمَةَ لِتَقْرَأَ الْكَلَامَ مَرَّةً أُخْرَى.' },
  { demo: `<div class="hd-pic"><img src="assets/arcade/bg/side.webp" alt=""><span class="hd-lens"><i></i></span></div>`,
    text: 'فِي التَّحَدِّي الثَّانِي: انْظُرْ بِالْعَدَسَةِ، ثُمَّ اخْتَرْ: آمِنٌ أَمْ غَيْرُ آمِنٍ؟' },
  { demo: `<div class="hd-drag"><span class="hd-box"></span><span class="hd-card"><img src="assets/v5/rule_discover.jpg" alt=""></span><span class="hd-hand drag">✋</span></div>`,
    text: 'اسْحَبِ الْبِطَاقَةَ بِالْفَأْرَةِ إِلَى مَكَانِهَا.' },
];
function howPoster(onBack, onStart) {
  const el = add(`<div class="poster">
    <div class="bkhead">طَرِيقَةُ اللَّعِبِ</div>
    <div class="pgrid">${HOW.map((h, i) => `<div class="pcard" style="animation-delay:${.3 + i * .9}s"><b class="bnum">${ar(i + 1)}</b><div class="pdemo">${h.demo}</div><p>${h.text}</p></div>`).join('')}</div>
    <div class="bkbtns"><button class="btn big bk-back">↩ الرُّجُوعُ إِلَى الْوَاجِهَةِ</button><button class="btn big green bk-go">ابْدَأِ اللَّعِبَ ▶</button></div>
  </div>`);
  setTimeout(() => el.querySelectorAll('.bkbtns .btn').forEach(b => b.classList.add('glow')), (.3 + HOW.length * .9) * 1000);   /* when every part is in, both buttons glow (teacher) */
  el.querySelector('.bk-back').onclick = () => { el.remove(); onBack(); };
  el.querySelector('.bk-go').onclick = () => onStart(el);   /* straight into the game; the title asks for the name here if it is missing */
  return el;
}
let rulesSeen = false, howSeen = false;                   // per pupil (this page load): the rules screen is not shown twice
function title() {
  resetRun(); rulesSeen = false; howSeen = false;
  let tt = 0;
  scene = {
    update(dt) { tt += dt; },
    draw() {
      cover('bg_street'); const g = ctx.createRadialGradient(W / 2, H * .42, 120, W / 2, H * .42, 760); g.addColorStop(0, 'rgba(255,248,228,.55)'); g.addColorStop(1, 'rgba(18,38,60,.35)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      salemShield(205, 574, 440, tt);                                                            /* left: Salem waves «درع الأمان» (feet level with «هادي») */
    },
  };
  const p = add(`<div class="title2">
    <div class="kicker">لُعْبَةٌ إِلِكْتُرُونِيَّةٌ تَفَاعُلِيَّةٌ بِعُنْوَانِ</div>
    <h1 class="gname">مَفَاتِيحُ بَطَلِ الْأَمَانِ</h1>
    <div class="lamsign"><img src="assets/v5/lammah_sign.webp" alt=""><div class="board">${K.game.motto.replace(/!$/, '').split('، ').map((m, i) => `<p><img class="mi" src="${MOTTO_ICONS[i]}" alt="">${esc(m)}</p>`).join('')}</div></div>
    <div class="doors2">${DOORS.map(([k, m, n], i) => `<div class="door2 ${m} ${i === 0 ? 'next' : ''}" data-k="${k}" style="animation-delay:${.15 + i * .18}s"><div class="dimg"><img src="assets/v5/door_${m}.webp" alt=""><span class="dkey">${keyMetal(m)}</span>${doorBannerSvg(i)}<span class="dtag" style="--tc:${DOOR_LEVELS[i].tail};color:${DOOR_LEVELS[i].ink}">${DOOR_LEVELS[i].sub}</span></div><span class="plate">${n}</span></div>`).join('')}</div>
    <div class="startrow">
      <span class="rays" aria-hidden="true"></span>
      <button class="btn tipb rulesb"><i class="bi">📜</i> قَوَاعِدُ اللَّعِبِ</button>
      <button class="btn tipb howb"><i class="bi">🎮</i> طَرِيقَةُ اللَّعِبِ</button>
      <label class="name2"><span class="pen" aria-hidden="true">✍️</span><input maxlength="18" aria-label="الاسم" placeholder="اكْتُبِ اسْمَكَ" value="${state.replay ? esc(state.name || '') : ''}"></label><span class="kbhint" style="display:none">الْحُرُوفُ إِنْجِلِيزِيَّةٌ: لِتَغْيِيرِ لُغَةِ لَوْحَةِ الْمَفَاتِيحِ اضْغَطْ <b dir="ltr">Alt + Shift</b></span>
      <button class="btn big go2"><i class="bi">▶</i> ابْدَأِ اللَّعِبَ</button>
    </div>
  </div>`);
  add(`<button class="tbtn gem" title="دَلِيلُ الْمُعَلِّمِ" aria-label="دَلِيلُ الْمُعَلِّمِ"><svg viewBox="0 0 64 56" aria-hidden="true"><defs><linearGradient id="gemA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".45" stop-color="#CFF3FF"/><stop offset="1" stop-color="#7FCBEA"/></linearGradient></defs><path d="M14 4 H50 L62 18 L32 54 L2 18 Z" fill="url(#gemA)" stroke="#5aa9c9" stroke-width="2" stroke-linejoin="round"/><path d="M2 18 H62 M14 4 L22 18 L32 54 L42 18 L50 4 M22 18 L32 4 L42 18" fill="none" stroke="#8fd0e8" stroke-width="1.6" stroke-linejoin="round"/><path d="M16 7 L22 16 L8 16 Z" fill="#fff" opacity=".9"/></svg><i class="spark s1"></i><i class="spark s2"></i><b class="gemtxt">دَلِيلُ الْمُعَلِّمِ</b><img class="gemt" src="assets/v6/teacher_icon.webp" alt=""></button>`).onclick = () => openGuide();   /* a small Bahraini teacher above the diamond (teacher) */   /* the teacher's door: a shining diamond on the flower wall behind Salem, away from the child's buttons (teacher) */
  const inp = p.querySelector('input'), nb = p.querySelector('.name2'), go2 = p.querySelector('.go2'), rb = p.querySelector('.rulesb'), gb = p.querySelector('.howb'), rays = p.querySelector('.rays');
  const guide = () => {
    const step = !rulesSeen ? rb : !howSeen ? gb : !inp.value.trim() ? nb : go2;
    [rb, gb, nb, go2].forEach(e => e.classList.toggle('glow', e === step)); nb.classList.toggle('done', !!inp.value.trim());
    { const kh = p.querySelector('.kbhint'); if (kh) kh.style.display = /[A-Za-z]/.test(inp.value) ? '' : 'none'; }   /* English letters: the teacher changes the keyboard (committee r9) */
    rays.style.left = step.offsetLeft + step.offsetWidth / 2 + 'px'; rays.style.top = step.offsetTop + step.offsetHeight / 2 + 'px';   /* the sun rays move behind the next step */
    if (step === nb) inp.focus();
  };
  const popup = (html, done) => {
    const v = add(`<div class="veil"></div>`), d = add(html);
    d.querySelector('.close').onclick = () => { v.remove(); d.remove(); done(); guide(); };
  };
  rb.onclick = () => rulesBook(() => { rulesSeen = true; guide(); }, () => { rulesSeen = true; howSeen = true; guide(); if (inp.value.trim()) go2.click(); else {   /* he chose to start: the glow goes to the name */ nb.classList.remove('shake'); void nb.offsetWidth; nb.classList.add('shake'); inp.focus(); } });
  const startFromPage = () => { rulesSeen = true; howSeen = true; guide(); if (inp.value.trim()) go2.click(); else { nb.classList.remove('shake'); void nb.offsetWidth; nb.classList.add('shake'); inp.focus(); } };   /* he chose to start: the glow goes to the name */
  /* «ابدأ اللعب» on the «طريقة اللعب» page goes straight into the game (teacher): with no name yet, a small name box opens on the same page */
  const startFromHow = poster => {
    rulesSeen = true; howSeen = true;
    if (inp.value.trim()) { poster.remove(); guide(); go2.click(); return; }
    const v = add(`<div class="veil over"></div>`), d = add(`<div class="askname"><div class="anhead">اكْتُبِ اسْمَكَ</div><label class="name2 glow"><span class="pen" aria-hidden="true">✍️</span><input maxlength="18" aria-label="الاسم" placeholder="اكْتُبِ اسْمَكَ" value=""></label><button class="btn big go glow">ابْدَأِ اللَّعِبَ ▶</button></div>`);
    const ni = d.querySelector('input'), nl = d.querySelector('.name2'), nbtn = d.querySelector('.go'); ni.focus();
    ni.oninput = () => nl.classList.toggle('done', !!ni.value.trim());
    const goNow = () => { if (!ni.value.trim()) { nl.classList.remove('shake'); void nl.offsetWidth; nl.classList.add('shake'); ni.focus(); return; } inp.value = ni.value.trim(); v.remove(); d.remove(); poster.remove(); guide(); go2.click(); };
    nbtn.onclick = goNow; ni.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); goNow(); } };
  };
  gb.onclick = () => howPoster(() => { howSeen = true; guide(); }, startFromHow);
  inp.oninput = guide;
  inp.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); go2.click(); } };   /* Enter in the name box starts the game */
  go2.onclick = async () => {
    if (!inp.value.trim()) { nb.classList.remove('shake'); void nb.offsetWidth; nb.classList.add('shake'); inp.focus(); return; }   /* the name first: the box shakes softly */
    go2.disabled = true; go2.classList.remove('glow'); rays.remove();
    const nm = inp.value.trim(); const measured = nm === state.name && state.k5 && state.k5.first != null;
    let same = !!state.replay && measured;   /* «الْعَبْ مَرَّةً أُخْرَى»: the same pupil plays again for fun */
    if (!same && measured) same = await new Promise(r => { const v = add(`<div class="veil over"></div>`), d = add(`<div class="askname whoask"><div class="anhead">${esc(nm)}</div><p>هَلْ لَعِبْتَ هَذِهِ اللُّعْبَةَ مِنْ قَبْلُ؟</p><div class="row" style="justify-content:center;gap:14px"><button class="btn green me">أَنَا نَفْسِي، أَلْعَبُ لِلْمُتْعَةِ</button><button class="btn other">أَنَا تِلْمِيذٌ آخَرُ</button></div></div>`);
      d.querySelector('.me').onclick = () => { v.remove(); d.remove(); r(true); }; d.querySelector('.other').onclick = () => { v.remove(); d.remove(); r(false); }; });   /* two pupils with the same name: ask, so no measure is lost (committee final) */
    state.replay = false;
    if (same) { G.trial = true; }   /* «الْعَبْ مَرَّةً أُخْرَى»: the same pupil plays again for fun; his first attempt stays the measure (committee r9) */
    else { keepResult(); state.name = nm; state.k5 = { first: null, picks: null, done: false }; G.trial = false; } save();   /* every start is a new pupil's record (committee) */
    /* the doors stay closed on the title: they open later, on the street, with their keys */
    await wait(250); go(welcome);
  };
  setTimeout(guide, 700);
}
/* Salem waves «درع الأمان» held in his raised hand: 12 frames posed and rendered in Blender (assets3d/pipeline/wave_shield.py).
   The upper arm stays raised; the forearm swings from the elbow to both sides of the vertical (one wave ≈ 0.8 s);
   the shield is fixed to his hand, held by its inner lower corner. x = his feet (the frames are wider: the feet are at 72% of the width).
   The shadow is drawn under his feet, not under the middle of the picture. */
function salemShield(x, foot, h, t) {
  const f = calm() ? 0 : ((t * 15) | 0) % 12, k = `k_wshield${f}`;
  ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.beginPath(); ctx.ellipse(x, foot, h * .19, h * .035, 0, 0, 7); ctx.fill();
  if (!ready(IMG[k])) return sprite('k_wave', x, foot, h, { shadow: false });
  const hn = h * 1.134, wn = IMG[k].naturalWidth / IMG[k].naturalHeight * hn;   /* the same body size as the other Salem pictures */
  return sprite(k, x + (.5 - .722) * wn, foot, hn, { shadow: false });
}
/* the welcome (teacher's design): Salem and «هادي» come out of Salem's front door and walk together along the pavement towards the
   school; the camera follows them. On the pavement stand the three locked doors of the game (bronze, silver, gold, as on the title).
   They stop at the bronze door, the camera glides past the silver and gold doors to the school at the end of the street (the goal), comes back,
   and they greet every child, hand in hand, in a speech cloud. They do NOT reach the school here: that is the game itself.
   Background: one wide side-view street (Codex), 3361×720, measured on it: door x 3008, school gate x 421, pavement y 489–603. */
function welcome() {
  const DOOR = 3008, STOP = 2330, FOOT = 592, SH = 195, MAXCAM = 3361 - W, BACK = 730;   /* the pair stands at x≈700: the clouds open to the right, clear of the bronze banner */
  const GATES = [['door_bronze', 2000], ['door_silver', 1500], ['door_gold', 1000]], GH = STREET.GH;   /* the doors on the pavement (world x), taller than the boys */   /* a little bigger than true scale to the door, so the child sees them well (teacher's choice) */
  const P = { x: DOOR, a: 0, pair: 0 }; let cam = MAXCAM, t = 0, phase = 'out', camTo = null;
  scene = {
    update(dt) {
      t += dt;
      P.a = Math.min(1, P.a + dt * 1.8);                                                         /* they step out of the door */
      if (phase === 'walk') { P.x = Math.max(STOP, P.x - 150 * dt); cam = clamp(P.x - 820, 0, MAXCAM); if (P.x === STOP) phase = 'stop'; }
      if (camTo) { const d = camTo.to - cam, step = Math.sign(d) * Math.min(Math.abs(d), camTo.v * dt); cam += step; if (!step) camTo = null; }
      if (phase === 'greet') P.pair = Math.min(1, P.pair + dt * 2.5);
      if (phase === 'go') { P.pair = Math.max(0, P.pair - dt * 3); P.x = Math.max(STREET.GATES[0][1] + 215, P.x - 150 * dt); }   /* «هيا بنا»: they step up to the bronze door */
    },
    draw() {
      ctx.fillStyle = '#9fd3ff'; ctx.fillRect(0, 0, W, H);
      if (ready(IMG.walk_street)) drawStreet(cam); else cover('bg_street');
      const sx = P.x - cam, walking = phase === 'walk' || phase === 'go', f = walking ? ((t * 7) | 0) % 4 : 0;
      for (let j = 0; j < 3; j++) drawDoor(j, cam, 0, j === 0);                                  /* locked; the bronze one glows: it is the first to open */
      if (P.pair < 1) {
        const hop = walking ? Math.abs(Math.sin(t * 8)) * 9 : 0;
        if (walking && ready(IMG.hadi_walk)) sprite('hadi_walk', sx + 80, FOOT - hop * .4, SH * .92, { alpha: P.a * (1 - P.pair), flip: true });   /* «هادي» walks the same way, holding Salem's hand (teacher) */
        else sprite('lammah_ok', sx + 80, FOOT - 10 - hop, SH, { alpha: P.a * (1 - P.pair) });
        sprite(`k_walk${f}`, sx, FOOT, SH, { alpha: P.a * (1 - P.pair) });                      /* Salem's real walk (his 3D model) */
      }
      if (P.pair > 0 && ready(IMG.salem_lammah)) sprite('salem_lammah', sx + 30, FOOT, SH * 1.12, { alpha: P.pair });   /* stopped: hand in hand, facing the child */
    },
  };
  (async () => {
    await wait(900); phase = 'walk';
    await until(() => phase === 'stop');
    /* they stand before the locked bronze door; the camera shows the silver and gold doors and the school, then comes back to them */
    camTo = { to: 0, v: 1300 }; await until(() => !camTo);
    await wait(2200);                                                                         /* the school and its name board */
    camTo = { to: clamp(STOP - BACK, 0, MAXCAM), v: 1300 }; await until(() => !camTo);
    phase = 'greet'; await wait(450);
    const sx = P.x - cam;
    say('salem', 'مَرْحَبًا يَا صَدِيقِي!<br>أَنَا سَالِمٌ، أُرِيدُ الْوُصُولَ إِلَى مَدْرَسَتِي بِأَمَانٍ.<br>فِي طَرِيقِي ثَلَاثَةُ أَبْوَابٍ مُقْفَلَةٍ،<br>سَاعِدْنِي لِنَجْمَعَ مَفَاتِيحَهَا!', sx - 30, FOOT - SH * 1.12 - 20, { max: 640, cls: 'cloud' });   /* the cloud opens to the right: the bronze door is on the left */
    await read();
    /* «هادي» introduces himself, reassures Salem, and asks the child to say the game's motto with him */
    const hx = sx + 30 + SH * 1.12 * .25, hy = FOOT - SH * 1.12 - 20;
    say('lammah', 'أَنَا هَادِي، إِشَارَةُ الْمُرُورِ!<br>أَهْدِيكَ إِلَى الطَّرِيقِ الْآمِنِ.', hx, hy, { max: 560, cls: 'cloud' });
    await read();
    say('lammah', 'لَا تَقْلَقْ يَا سَالِمُ!<br>سَأُسَاعِدُكَ لِتَجْمَعَ الْمَفَاتِيحَ<br>وَتَصِلَ إِلَى مَدْرَسَتِكَ بِأَمَانٍ.', hx, hy, { max: 660, cls: 'cloud' });
    await read();
    say('lammah', 'هَيَّا يَا صَدِيقِي،<br>رَدِّدْ مَعَنَا شِعَارَ اللُّعْبَةِ!', hx, hy, { max: 560, cls: 'cloud' });
    await read();
    hush();
    /* the motto, said by Salem and «هادي» together: one cloud with two tails (one to each); its three parts come in one after another */
    const lines = K.game.motto.replace(/!$/, '').split('، ');
    const duo = add(`<div class="bubble cloud duo">${lines.map((m, i) => `<p style="animation-delay:${.35 + i * 1.2}s"><img class="mi" src="${MOTTO_ICONS[i]}" alt="">${esc(m)}${i === lines.length - 1 ? '!' : '،'}</p>`).join('')}<span class="tl a1"></span><span class="tl a2"></span><span class="tl b1"></span><span class="tl b2"></span></div>`);
    const bw = duo.offsetWidth, bh = duo.offsetHeight, mid = (sx + hx) / 2, left = clamp(Math.max(mid - bw / 2, STREET.GATES[0][1] - cam + 230), 16, W - bw - 16), top = clamp(hy - bh - 46, 12, H - bh - 16);   /* right of the bronze door's banner   /* above the doors' banners */
    duo.style.left = left + 'px'; duo.style.top = top + 'px'; duo.style.setProperty('--ta', sx - left + 'px'); duo.style.setProperty('--tb', hx - left + 'px');
    await wait(350 + lines.length * 1200 + 900);
    /* «هادي» shows the bronze key in his raised hand (Salem holds the map): it is the child's when he finishes the first challenge */
    duo.remove();
    const ph = SH * 1.12, pw = ph * (ready(IMG.salem_lammah) ? IMG.salem_lammah.naturalWidth / IMG.salem_lammah.naturalHeight : 1.09);
    const glove = { x: sx + 30 - pw / 2 + pw * .88, y: FOOT - ph + ph * .22 };      /* measured on salem_lammah: his waving glove */
    add(`<div class="hkey" style="left:${glove.x}px;top:${glove.y}px">${keyMetal('bronze')}</div>`); burst(glove.x, glove.y, ['#E8A66A', '#FFD23F', '#fff'], 14);
    await wait(500);
    say('lammah', 'هَذَا مِفْتَاحُ الْبَابِ الْبُرُونْزِيِّ!<br>سَيَكُونُ لَكَ عِنْدَمَا تُكْمِلُ التَّحَدِّيَ الْأَوَّلَ.', hx, hy, { max: 600, cls: 'cloud' });
    await read();
    add(`<div class="wgo"><button class="btn big go2 glow">هَيَّا بِنَا ◀</button></div>`).querySelector('.go2').onclick = async e => {   /* «هَيَّا بِنَا»: they stand before the bronze door, it opens, and they walk in to level 1 (teacher's choice; scenario v5) */
      e.currentTarget.parentNode.remove(); hush(); ui.querySelector('.hkey')?.remove();
      camTo = { to: clamp(STREET.GATES[0][1] - 470, 0, MAXCAM), v: 120 }; phase = 'go';
      await until(() => P.x <= STREET.GATES[0][1] + 215 && !camTo); doorPass(0, level1Play);
    };
  })();
}
/* After each level: back on the street of the welcome. The key just won flies from the keys bar into its door's padlock, the door opens,
   and Salem and «هادي» walk through it to the next door (or, after the gold door, to the school gate). Then the next part of the game.
   Same street, doors and sizes as the welcome (world x of the doors measured on walk_street). */
/* the street picture, with the school's name board over its gate (drawn in code: no text inside pictures) */
const SCHOOL_NAME = 'مَدْرَسَةُ مَدِينَةِ حَمَدٍ الِابْتِدَائِيَّةُ لِلْبَنِينَ';
function drawStreet(cam) {
  ctx.drawImage(IMG.walk_street, -cam, 0);
  const cx = 452 - cam, y = 236, w = 540, h = 56;                                             /* over the school gate (world x 210–693), measured on walk_street */
  if (cx + w / 2 < 0 || cx - w / 2 > W) return;
  ctx.save();
  ctx.fillStyle = '#6b6f74'; ctx.fillRect(cx - w / 2 + 30, y + h, 8, 40); ctx.fillRect(cx + w / 2 - 38, y + h, 8, 40);   /* the two posts */
  rr(cx - w / 2, y, w, h, 12, '#1e4f8a', '#E8B600', 5);
  ctx.fillStyle = '#fff'; ctx.font = '700 30px Naskh'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.direction = 'rtl';
  ctx.fillText(SCHOOL_NAME, cx, y + h / 2 + 2);
  ctx.restore();
}
const STREET = { FOOT: 592, SH: 195, GH: 340, W: 3361, SCHOOL: 470, GATES: [['door_bronze', 2000, 'g', 'الْبُرُونْزِيُّ', 'الْبُرُونْزِيَّ'], ['door_silver', 1500, 'r', 'الْفِضِّيُّ', 'الْفِضِّيَّ'], ['door_gold', 1000, 'y', 'الذَّهَبِيُّ', 'الذَّهَبِيَّ']] };
/* each door carries its level: a curved banner over its arch (the level's goal) and a tag above its padlock («المستوى …»).
   Colours: warm orange on the bronze door, sky blue on the silver one, sunny yellow on the gold one. */
const DOOR_LEVELS = [
  { sub: 'التَّحَدِّي الْأَوَّلُ', main: 'اكْتَشِفْ سِرَّ السُّلُوكِ الْآمِنِ', c1: '#FFD29A', c2: '#F28C28', ink: '#5a2a00', tail: '#D9701A' },
  { sub: 'التَّحَدِّي الثَّانِي', main: 'اكْتَشِفْ سِرَّ السُّلُوكِ غَيْرِ الْآمِنِ', c1: '#CDEBFF', c2: '#4FA8E8', ink: '#0d2f55', tail: '#2F86C8' },
  { sub: 'التَّحَدِّي الثَّالِثُ', main: 'تَحَدِّي التَّصْنِيفِ الذَّهَبِيُّ', c1: '#FFF0A0', c2: '#F5C400', ink: '#4a2c00', tail: '#D9A400' },
];
/* door j on the street: open 0..1 (turns on its left hinge), next = the door to open now (it glows) */
function drawDoor(j, cam, open = 0, next = false) {
  const [k, gx] = STREET.GATES[j], im = IMG[k]; if (!ready(im)) return; const { FOOT, GH } = STREET, w = im.naturalWidth / im.naturalHeight * GH, cx = gx - cam, top = FOOT + 4 - GH;
  if (cx < -320 || cx > W + 320) return;
  ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.beginPath(); ctx.ellipse(cx, FOOT + 4, w * .45, 8, 0, 0, 7); ctx.fill();
  if (open > 0) {                                                                                 /* the doorway behind the leaf: an arch full of warm light */
    const ow = w * .86, ox = cx - ow / 2, oy = top + 8, oh = GH - 8, gl = ctx.createRadialGradient(cx, oy + oh * .55, 8, cx, oy + oh * .55, oh * .7);
    gl.addColorStop(0, '#FFFBE6'); gl.addColorStop(.6, '#FFE79A'); gl.addColorStop(1, '#F5B941');
    ctx.save(); ctx.globalAlpha = Math.min(1, open * 1.5); ctx.beginPath(); ctx.moveTo(ox, oy + oh); ctx.lineTo(ox, oy + ow / 2); ctx.arc(cx, oy + ow / 2, ow / 2, Math.PI, 0); ctx.lineTo(ox + ow, oy + oh); ctx.closePath();
    ctx.fillStyle = gl; ctx.shadowColor = '#FFE27A'; ctx.shadowBlur = 40; ctx.fill(); ctx.shadowBlur = 0; ctx.lineWidth = 8; ctx.strokeStyle = '#6b4a22'; ctx.stroke(); ctx.restore();
  }
  if (next && open < 1) { ctx.save(); ctx.shadowColor = '#FFD23F'; ctx.shadowBlur = calm() ? 28 : 22 + Math.sin(clock * 5) * 16; }
  ctx.drawImage(im, cx - w / 2, top, w * (1 - .8 * open), GH);
  if (next && open < 1) { ctx.drawImage(im, cx - w / 2, top, w * (1 - .8 * open), GH); ctx.restore(); }   /* drawn twice: a stronger glow */
  if (open < .5) { const L = DOOR_LEVELS[j]; arcBanner(cx, top - 26, 205 * GH / 280, L.main, 1, L); lockTag(cx, top + GH * .36, L.sub, 1, L); }
}
/* the doors to open next on each screen */
const nextDoor = () => Math.min(2, G.keys.length);
/* door i is the entrance to level i+1 (scenario v5): the bronze door opens at the start with no key;
   the key won in a level opens the next level's door (bronze key → door 2, silver key → door 3; the gold key opens the treasure) */
const DOOR_ORD = ['الْأَوَّلِ', 'الثَّانِي', 'الثَّالِثِ'];
function doorPass(i, next, o = {}) {
  hud(i === 0 ? 'safe' : 'danger');
  const { FOOT, SH, GH, GATES } = STREET, MAXCAM = STREET.W - W, [, gx] = GATES[i], free = i === 0, [, , keyId, nameN] = GATES[Math.max(0, i - 1)];
  const P = { x: gx + 215, a: 1 }; let cam = clamp(gx - 470, 0, MAXCAM), t = 0, open = 0, opening = false, walking = false, z = 1, zTo = 1, at = 'door', shut = 1, closing = false, flash = 0;
  scene = {
    update(dt) {
      t += dt;
      if (opening) open = Math.min(1, open + dt * 1.1);
      if (closing) shut = Math.max(0, shut - dt * 1.1);   /* Salem shuts the door behind them */
      flash = Math.max(0, flash - dt * .8);
      z += (zTo - z) * Math.min(1, dt * 2.4);
      if (walking) { P.x = Math.max(gx, P.x - 120 * dt); if (P.x - gx < 60) P.a = Math.max(0, (P.x - gx) / 60); if (P.x === gx) walking = false; }
    },
    draw() {
      ctx.fillStyle = '#9fd3ff'; ctx.fillRect(0, 0, W, H);
      const dx = gx - cam, dy = FOOT - GH * .45;
      ctx.save(); ctx.translate(dx, dy); ctx.scale(z, z); ctx.translate(-dx, -dy);                  /* the camera comes close: the door is big */
      if (ready(IMG.walk_street)) drawStreet(cam);
      GATES.forEach((g, j) => drawDoor(j, cam, j < i ? (o.ask && j === i - 1 ? shut : o.gold ? 0 : 1) : j === i ? open : 0, at === 'door' && j === (open >= 1 ? i + 1 : i)));
      if (flash > 0) {   /* the silver key flashes in the lock as the door opens (teacher) */
        const lx = gx - cam, ly = FOOT + 4 - GH * .5, r = 300, gr = ctx.createRadialGradient(lx, ly, 0, lx, ly, r);
        gr.addColorStop(0, `rgba(255,255,255,${flash})`); gr.addColorStop(.35, `rgba(255,244,190,${flash * .75})`); gr.addColorStop(1, 'rgba(255,244,190,0)');
        ctx.fillStyle = gr; ctx.fillRect(lx - r, ly - r, r * 2, r * 2);
      }
      const sx = P.x - cam;
      if (o.gold && ready(IMG.pair_bag_class)) {   /* door 3: the bag is on Salem's back now (sceptic) */
        if (walking && ready(IMG.salem_bwalk0)) {   /* Salem walks with his bag on his back (committee) */
          const f = ((t * 7) | 0) % 4, hop = Math.abs(Math.sin(t * 8)) * 9;
          if (ready(IMG.hadi_walk)) sprite('hadi_walk', sx + 80, FOOT - hop * .4, SH * .92, { alpha: P.a, flip: true });
          sprite(`salem_bwalk${f}`, sx, FOOT, SH, { alpha: P.a });
        } else { const hop = walking ? Math.abs(Math.sin(t * 8)) * 7 : 0; if (P.a > 0) sprite('pair_bag_class', sx + 50, FOOT - hop, SH * 1.12, { alpha: P.a, noKey: true }); }
      } else if (walking) {
        const f = ((t * 7) | 0) % 4, hop = Math.abs(Math.sin(t * 8)) * 9;
        if (ready(IMG.hadi_walk)) sprite('hadi_walk', sx + 80, FOOT - hop * .4, SH * .92, { alpha: P.a, flip: true });   /* the same way as Salem, holding his hand (teacher) */
        else sprite('lammah_ok', sx + 80, FOOT - 10 - hop, SH, { alpha: P.a });
        sprite(`k_walk${f}`, sx, FOOT, SH, { alpha: P.a });
      } else if (P.a > 0 && ready(IMG.salem_lammah)) sprite('salem_lammah', sx + 30, FOOT, SH * 1.12, { alpha: P.a });
      ctx.restore();
    },
  };
  const head = () => ({ x: P.x - cam + 60, y: FOOT - SH * 1.12 - 20 });   /* clouds open to the right, clear of the door's banner */
  (async () => {
    await wait(500);
    if (o.ask) {   /* they come out of door 1 with the card; Salem locks door 1 with the bronze key and keeps it in his pocket;
                    «هادي» brings the silver key and the child opens door 2 (teacher) */
      const card = G.oddCard ? K.measure.find(c => c.id === 'run') : null;
      const cd = card ? add(`<div class="tcard big odd raised mini" style="left:${P.x - cam + 150}px;top:${FOOT - 250}px"><img src="assets/v5/${card.img}.jpg" alt=""><p>${esc(card.text)} <b>؟</b></p></div>`) : null;
      HOLD = 'r';   /* «هادي» comes with the silver key in his hand */
      if (card) { say('salem', 'خَرَجْنَا وَمَعَنَا الْبِطَاقَةُ!', head().x, head().y, { max: 560, cls: 'cloud' }); await read(); cd.style.transition = 'opacity .5s'; cd.style.opacity = '0'; setTimeout(() => cd.remove(), 520); }
      say('salem', `سَأُقْفِلُ بَابَ التَّحَدِّي الْأَوَّلِ<br>بِالْمِفْتَاحِ ${["الْبُرُونْزِيِّ", "الْفِضِّيِّ"][i - 1]}.`, head().x, head().y, { max: 560, cls: 'cloud' }); await read(); hush();
      // the door shuts, the bronze key comes from the keys bar and locks it
      closing = true; await until(() => shut <= 0);
      const st = document.getElementById('stage').getBoundingClientRect(), slot = ui.querySelector(`.kslot[data-k="${keyId}"]`), sr = slot ? slot.getBoundingClientRect() : null;
      const kfrom = sr ? { x: (sr.left + sr.width / 2 - st.left) / SCALE, y: (sr.top + sr.height / 2 - st.top) / SCALE } : { x: W - 120, y: 40 };
      const lock1 = { x: GATES[i - 1][1] - cam, y: FOOT + 4 - GH * .5 };
      const bk = add(`<div class="flykey" style="left:${kfrom.x}px;top:${kfrom.y}px">${keyMetal('bronze')}</div>`);
      requestAnimationFrame(() => requestAnimationFrame(() => { bk.style.left = lock1.x + 'px'; bk.style.top = lock1.y + 'px'; bk.classList.add('in'); }));
      await wait(1250); bk.classList.add('turn'); await wait(500); burst(lock1.x, lock1.y, ['#FFD23F', '#fff', '#CD7F32'], 12);
      say('salem', 'أَقْفَلْتُ الْبَابَ!', head().x, head().y, { max: 560, cls: 'cloud' }); await wait(1300); hush();
      // the key back to Salem's hand, then into his shirt pocket
      const im0 = IMG.salem_lammah, h0 = SH * 1.12, w0 = ready(im0) ? im0.naturalWidth / im0.naturalHeight * h0 : h0, at0 = (fx, fy) => ({ x: P.x - cam + 30 - w0 / 2 + w0 * fx, y: FOOT - h0 + h0 * fy });
      const hand0 = at0(.09, .3), pocket = at0(.4, .38);   /* his hand (with the card), then his shirt pocket */
      bk.classList.remove('turn'); bk.style.left = hand0.x + 'px'; bk.style.top = hand0.y + 'px'; await wait(1250);
      bk.style.transition = 'left .8s, top .8s, transform .8s, opacity .8s'; bk.style.left = pocket.x + 'px'; bk.style.top = pocket.y + 'px'; bk.style.transform = 'translate(-50%, -50%) scale(.12)'; bk.style.opacity = '0';
      await wait(850); bk.remove();
      say('salem', `وَضَعْتُ الْمِفْتَاحَ ${GATES[i - 1][4]}<br>فِي جَيْبِي.`, head().x, head().y, { max: 560, cls: 'cloud' }); await read();
      say('lammah', `وَهَذَا الْمِفْتَاحُ الْفِضِّيُّ<br>يَفْتَحُ بَابَ التَّحَدِّي ${DOOR_ORD[i]}!`, head().x, head().y, { max: 560, cls: 'cloud' });
      await new Promise(res => { add(`<div class="bottom"><button class="btn big go pulse">افْتَحْ بَابَ التَّحَدِّي ${DOOR_ORD[i]} ◀</button></div>`).querySelector('.go').onclick = e => { e.currentTarget.closest('.bottom').remove(); res(); }; });
      hush();
    } else {
    say('salem', free ? 'هَذَا بَابُ التَّحَدِّي الْأَوَّلِ!<br>هَيَّا نَدْخُلْ يَا هَادِي!' : `مَعَنَا الْمِفْتَاحُ ${o.gold ? 'الذَّهَبِيُّ' : nameN}!<br>هَيَّا نَفْتَحْ بَابَ التَّحَدِّي ${DOOR_ORD[i]}.`, head().x, head().y, { max: 560, cls: 'cloud' });
    await wait(free ? 2600 : 2200); hush();
    }
    if (o.ask) {   /* the silver key flies from «هادي»'s hand into the padlock */
      const im = IMG.salem_lammah, h = SH * 1.12, w = ready(im) ? im.naturalWidth / im.naturalHeight * h : h, sx0 = P.x - cam + 30;
      const from = { x: sx0 - w / 2 + w * HAND.salem_lammah[0], y: FOOT - h + h * HAND.salem_lammah[1] }, lock = { x: gx - cam, y: FOOT + 4 - GH * .5 };
      HOLD = null; const k = add(`<div class="flykey" style="left:${from.x}px;top:${from.y}px">${keyMetal('silver')}</div>`);
      requestAnimationFrame(() => requestAnimationFrame(() => { k.style.left = lock.x + 'px'; k.style.top = lock.y + 'px'; k.classList.add('in'); }));
      await wait(1250); burst(lock.x, lock.y, ['#FFFFFF', '#C6D0DA', '#FFD23F'], 22); flash = 1; k.classList.add('turn'); await wait(500); k.remove();
    } else if (!free) {
    /* the key flies from the keys bar into the padlock */
    const st = document.getElementById('stage').getBoundingClientRect(), slot = ui.querySelector(`.kslot[data-k="${o.gold ? 'y' : keyId}"]`), sr = slot ? slot.getBoundingClientRect() : null;
    const from = sr ? { x: (sr.left + sr.width / 2 - st.left) / SCALE, y: (sr.top + sr.height / 2 - st.top) / SCALE } : { x: W - 120, y: 40 };
    const lock = { x: gx - cam, y: FOOT + 4 - GH * .5 };
    const metal = o.gold ? 'gold' : ['bronze', 'silver', 'gold'][i - 1], k = add(`<div class="flykey" style="left:${from.x}px;top:${from.y}px">${keyMetal(metal)}</div>`);
    requestAnimationFrame(() => requestAnimationFrame(() => { k.style.left = lock.x + 'px'; k.style.top = lock.y + 'px'; k.classList.add('in'); }));
    await wait(1250); burst(lock.x, lock.y, ['#FFD23F', '#fff', '#CD7F32'], 14); k.classList.add('turn'); await wait(500); k.remove();
    }
    /* the camera comes close, the door opens wide with light behind it, and they walk in through it */
    zTo = 1.42; await wait(700); opening = true; if (o.ask) flash = 1; await until(() => open >= 1);
    say('lammah', `فُتِحَ الْبَابُ!<br>هَيَّا نَدْخُلْ إِلَى التَّحَدِّي ${DOOR_ORD[i]}!`, W / 2 + 200, 150, { max: 560, cls: 'cloud' });
    await read(); hush();
    walking = true; await until(() => !walking); await wait(400);
    go(next);
  })();
}
/* after level 3 (all doors open): Salem and «هادي» reach the school; then the gold key opens the treasure */
function schoolArrive(next) {
  hud('danger');
  const { FOOT, SH, SCHOOL } = STREET, cam = clamp(SCHOOL - 300, 0, STREET.W - W), x = SCHOOL + 420;
  scene = { draw() { ctx.fillStyle = '#9fd3ff'; ctx.fillRect(0, 0, W, H); if (ready(IMG.walk_street)) drawStreet(cam); STREET.GATES.forEach((g, j) => drawDoor(j, cam, 1, false)); if (ready(IMG.salem_lammah)) sprite('salem_lammah', x - cam + 30, FOOT, SH * 1.12); } };
  (async () => {
    await wait(500);
    say('salem', 'وَصَلْنَا إِلَى الْمَدْرَسَةِ بِأَمَانٍ!<br>شُكْرًا لَكَ يَا صَدِيقِي!', x - cam + 60, FOOT - SH * 1.12 - 20, { max: 560, cls: 'cloud' });
    await read(); hush(); await wait(400);
    go(next);
  })();
}
function rules() {
  scene = { draw() { ctx.fillStyle = '#e6f3ff'; ctx.fillRect(0, 0, W, H); } };
  rulesBook(() => go(title), () => go(level1));
}

// ================================================================== LEVEL 1 «اكْتَشِفْ سِرَّ السُّلُوكِ الْآمِنِ» — 4 discoveries, the green key
// car pictures: where Salem stands and sits (fractions of the full-screen picture). Measured on the pictures.
const CAROUT = { car_out: { stand: [.43, .985], back: [.355, .55], front: [.56, .43], h: .40, kerb: true }, car_base3: { stand: [.13, .95], back: [.36, .45], front: [.58, .45], h: .5 } };
const CABIN = { cabin: { seat: [.29, .755], h: .52 }, car_base3: { seat: [.375, .70], h: .32 } };
function banner(sub, main, col) { ui.querySelector('.banner')?.remove(); const b = add(`<div class="banner" style="--c:${col}"><small>${sub}</small><b>${main}</b></div>`); setTimeout(() => b.remove(), 2600); }

/* a banner (راية) bent on an arc: a yellow band with folded tails; the words follow the curve.
   The text is drawn flat once (Arabic letters stay joined), then laid on the arc in thin slices. */
function arcBanner(cx, apexY, R, text, e = 1, L = DOOR_LEVELS[2]) {
  const span = 1.5, cy = apexY + R, band = 52, glow = 18 + Math.sin(clock * 4) * 8;
  ctx.save(); ctx.globalAlpha = e;
  const tail = sgn => { const ang = -Math.PI / 2 + sgn * (span / 2 + .02), x = cx + Math.cos(ang) * R, y = cy + Math.sin(ang) * R;
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang + Math.PI / 2); ctx.beginPath(); ctx.moveTo(0, -band / 2); ctx.lineTo(sgn * 46, -band / 2 + 8); ctx.lineTo(sgn * 30, 6); ctx.lineTo(sgn * 46, band / 2 + 8); ctx.lineTo(0, band / 2); ctx.closePath();
    ctx.fillStyle = L.tail; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#1b1b1b'; ctx.stroke(); ctx.restore(); };
  tail(-1); tail(1);
  ctx.shadowColor = '#FFD23F'; ctx.shadowBlur = glow;
  ctx.beginPath(); ctx.arc(cx, cy, R + band / 2, -Math.PI / 2 - span / 2, -Math.PI / 2 + span / 2); ctx.arc(cx, cy, R - band / 2, -Math.PI / 2 + span / 2, -Math.PI / 2 - span / 2, true); ctx.closePath();
  const g = ctx.createLinearGradient(0, apexY - band / 2, 0, apexY + band / 2); g.addColorStop(0, L.c1); g.addColorStop(1, L.c2); ctx.fillStyle = g; ctx.fill();
  ctx.shadowBlur = 0; ctx.lineWidth = 4; ctx.strokeStyle = '#1b1b1b'; ctx.stroke();
  /* the words: flat on a small canvas, then bent */
  let fs = 31; ctx.font = `700 ${fs}px Naskh`; fs = Math.min(31, Math.floor(31 * R * span * .82 / ctx.measureText(text).width));   /* fits the arc */
  const tc = arcBanner.c || (arcBanner.c = document.createElement('canvas')), t2 = tc.getContext('2d');
  t2.font = `700 ${fs}px Naskh`; const tw = Math.ceil(t2.measureText(text).width) + 8, th = Math.ceil(fs * 1.9);
  tc.width = tw; tc.height = th; t2.font = `700 ${fs}px Naskh`; t2.direction = 'rtl'; t2.textAlign = 'center'; t2.textBaseline = 'middle'; t2.fillStyle = L.ink; t2.fillText(text, tw / 2, th / 2 + 2);
  const ang0 = tw / R, N = 80, sw = tw / N;
  for (let i = 0; i < N; i++) {
    const ang = -Math.PI / 2 - ang0 / 2 + (i + .5) / N * ang0;
    ctx.save(); ctx.translate(cx + Math.cos(ang) * R, cy + Math.sin(ang) * R); ctx.rotate(ang + Math.PI / 2);
    ctx.drawImage(tc, i * sw, 0, sw + .6, th, -sw / 2, -th / 2, sw + .6, th); ctx.restore();
  }
  ctx.restore();
}
/* the level's tag, fixed on the door just above the padlock */
function lockTag(cx, y, text, e = 1, L = DOOR_LEVELS[2]) {
  ctx.save(); ctx.globalAlpha = e; ctx.font = '700 20px Naskh'; const w = ctx.measureText(text).width + 28, h = 34;
  ctx.shadowColor = '#0006'; ctx.shadowOffsetY = 3; ctx.shadowBlur = 4;
  rr(cx - w / 2, y - h / 2, w, h, 17, '#fff', L.tail, 4); ctx.shadowColor = 'transparent';
  ctx.fillStyle = L.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.direction = 'rtl'; ctx.fillText(text, cx, y + 1);
  ctx.restore();
}
/* before a level: Salem and «هادي» stand at its locked door on the street; the door glows and carries the level's banner and tag */
const INTRO_LINES = ['خَلْفَ هَذَا الْبَابِ التَّحَدِّي الْأَوَّلُ.<br>هَيَّا نَكْتَشِفْ سِرَّ السُّلُوكِ الْآمِنِ!', 'خَلْفَ هَذَا الْبَابِ التَّحَدِّي الثَّانِي.<br>هَيَّا نَكْتَشِفْ سِرَّ السُّلُوكِ غَيْرِ الْآمِنِ!', 'خَلْفَ هَذَا الْبَابِ التَّحَدِّي الثَّالِثُ:<br>تَحَدِّي التَّصْنِيفِ الذَّهَبِيُّ!'];
function doorIntro(i, then) {
  hud(i === 0 ? 'safe' : 'danger');
  const { FOOT, SH, GATES } = STREET, gx = GATES[i][1], cam = clamp(gx - 470, 0, STREET.W - W);
  scene = {
    draw() {
      ctx.fillStyle = '#9fd3ff'; ctx.fillRect(0, 0, W, H); if (ready(IMG.walk_street)) drawStreet(cam);
      GATES.forEach((g, j) => drawDoor(j, cam, j < i ? 1 : 0, j === i));
      if (ready(IMG.salem_lammah)) sprite('salem_lammah', gx + 215 - cam + 30, FOOT, SH * 1.12);
    },
  };
  (async () => {
    await wait(700);
    say('lammah', INTRO_LINES[i], gx + 215 - cam + 90, FOOT - SH * 1.12 - 20, { max: 600, cls: 'cloud' });
    await read();
    add(`<div class="wgo"><button class="btn big go2 glow">ابْدَأِ التَّحَدِّيَ ◀</button></div>`).querySelector('.go2').onclick = () => go(then);
  })();
}
function level1() { level1Play(); }   /* no door screen before level 1: the welcome walk leads into it */
function level1Play() {
  hud('safe'); if (K5().first == null && !G.trial && !K5().t0) { K5().t0 = Date.now(); save(); }   /* the play time, for the teacher */
  const S = K.safe;
  (async () => {
    await lightsScene(S[1], 0); await streetScene(S[0], 1);   /* the lights first, then the crossing (teacher's order) */ await seatScene(S[3], 2); await beltScene(S[2], 3);
    await kerbScene();   /* the child finds the fourth safe behaviour himself (committee final) */
    go(truckScene);
  })();
}

// the lights of the crossing (teacher's design): only two. The pedestrian light stands on the OTHER side of the street, facing Salem
// (a walker looks at the light across the road), drawn big; one car light on Salem's side for the cars of his lane.
const FARPED = { x: ZX - 112, foot: ROAD.farFoot - 14, h: 80, k: 1.4 };
function crossLights(sig) {
  ctx.save(); ctx.translate(FARPED.x, FARPED.foot); ctx.scale(FARPED.k, FARPED.k); pedLight(0, 0, FARPED.h, sig.ped === 'green'); ctx.restore();   /* far light first: it stands behind */
  carLight(ZX - 112, LIGHT.near.foot, 150, sig.car, 1.4);
}
const FARPED_HEAD = () => ({ x: FARPED.x, y: FARPED.foot - FARPED.k * (FARPED.h + 44) });
const GREEN_MAN = `<svg class="gman" viewBox="0 0 40 64" aria-hidden="true"><rect x="2" y="2" width="36" height="60" rx="8" fill="#2B3A4A" stroke="#1b1b1b" stroke-width="3"/><circle cx="20" cy="18" r="11" fill="#151b21"/><circle cx="20" cy="45" r="12" fill="#151b21"/><g stroke="#3df08a" stroke-width="3.2" stroke-linecap="round" fill="none"><path d="M20 41v8M20 49l-5 7M20 49l5 7M15 45l10-3"/></g><circle cx="20" cy="37" r="3" fill="#3df08a"/></svg>`;
const HADI = { x: 150, foot: 708, h: 270 };
const PAIR = { x: 505 };
const CROSS_AT = { h: ZX - 30, s: ZX + 70 };   /* where they stand before the crossing, looking at it (teacher) */   /* Salem and «هادي» hand in hand before the crossing, left of the car light */
/* «هادي» on the street: 'point' (stands, pointing), 'walk' (hops to the crossing), 'wait' (beside Salem), 'cross' (crosses with him, smaller with depth) */
function hadiNew(x) { return { x, to: null, mode: 'point', t: 0 }; }
function hadiUpdate(h, dt) { h.t += dt;
  if (h.follow) { const d = h.follow.x - h.gap - h.x; h.dir = 1; h.x += Math.sign(d) * Math.min(Math.abs(d), 170 * dt); return; }   /* walks with Salem, holding his hand (teacher) */
  if (h.mode === 'walk' && h.to != null) { const d = h.to - h.x; h.dir = Math.sign(d) || h.dir; h.x += Math.sign(d) * Math.min(Math.abs(d), 150 * dt); if (Math.abs(d) < 1) { h.x = h.to; h.to = null; h.mode = 'wait'; } } }
function hadiDraw(h, s) {
  if (h.mode === 'hidden') return;
  if (h.mode === 'point') return sprite('lammah_point', h.x, HADI.foot, HADI.h);
  if (h.mode === 'back' && ready(IMG.lammah_back)) return sprite('lammah_back', h.x, h.foot ?? s.foot, s.h * .92);   /* looking ahead with Salem */
  if (h.mode === 'far') return sprite('lammah_ok', h.fx ?? ZX + 50, ROAD.farFoot + 4 - Math.abs(Math.sin(h.t * 8)) * 8, s.h * .82 * .92);   /* safe on the other side, with Salem */
  const k = h.mode === 'cross' ? s.cy / 350 : 0, hop = (h.mode === 'walk' || h.mode === 'cross') && !calm() ? Math.abs(Math.sin(h.t * 8)) * 8 : 0;
  const sc = 1 - k * .4, x = h.mode === 'cross' ? ZX + 78 * sc : h.x, foot = (h.mode === 'cross' ? s.foot - s.cy : h.foot ?? s.foot) - hop;
  if (h.mode === 'walk' && ready(IMG.hadi_walk)) return sprite('hadi_walk', x, foot, s.h * .92, { flip: h.dir < 0 });   /* sideways, walking the way he goes (teacher) */
  const tk = h.lamp ? `hadi_talk_${h.lamp}` : 'hadi_talk';
  if (h.talk && h.mode === 'wait' && ready(IMG[tk])) return sprite(tk, x, foot, s.h * .92);   /* turned a little towards Salem, also while he lights his colours (teacher) */
  sprite(h.mode === 'cross' && ready(IMG.lammah_back) ? 'lammah_back' : h.lamp && ready(IMG[`lammah_${h.lamp}`]) ? `lammah_${h.lamp}` : 'lammah_ok', x, foot, s.h * .92 * sc, { shadow: h.mode !== 'cross' });   /* crossing: his back to us, like Salem */
}                // «هادي» stands on the pavement, pointing at the crossing

// «هادي» shows the top bar once, at the start of level 1: the keys and the stars, then the log and the talk button
async function hudTour() {
  if (G.hudShown) return; G.hudShown = true;
  const head = { x: HADI.x + 40, y: HADI.foot - HADI.h - 10 };
  const spot = sels => { ui.querySelectorAll('.hudspot').forEach(e => e.classList.remove('hudspot')); sels.forEach(s => hudEl(s)?.classList.add('hudspot')); };
  spot(['.keys']);                                                         /* the keys bar glows while «هادي» speaks (teacher's wording) */
  say('lammah', 'سَوْفَ أُعْطِيكَ الْمِفْتَاحَ<br>عِنْدَمَا تَكْتَشِفُ سِرَّ السُّلُوكِ الْآمِنِ.', head.x, head.y, { cls: 'cloud' });
  await read();
  spot([]); hush();
}

// scene 1: the zebra crossing (teacher's design). Salem asks for help; «هادي»: press the crossing when the pedestrian light is green.
// The man is red and the cars pass; then the car light turns red, the cars stop, the man turns green and the crossing glows.
// A press on red: Salem shakes his head and waits. A press on green: Salem walks to the crossing and crosses.
function streetScene(item, pipI) {
  const s = salemNew(CROSS_AT.s), hd = hadiNew(CROSS_AT.h), cars = traffic([0, 1]), sig = { car: 'green', ped: 'red' }; let glow = 0, glowOn = false, stop = false, show = 0, focus = null;
  s.mode = 'back'; hd.mode = 'back';   /* they stand before the crossing and look at it (teacher) */
  scene = {
    update(dt) { salemUpdate(s, dt); hadiUpdate(hd, dt); driveCars(cars, dt, stop); if (glowOn) glow = Math.min(1, glow + dt * 1.6); else if (show) glow = .5 + Math.sin(clock * 5) * .5; else glow = 0; },
    draw() {
      cover('bg_side'); zebra(ZX, glow); drawCars(cars, 0); drawCars(cars, 1); crossLights(sig);
      if (focus) {   /* a glowing ring round what «هادي» is showing */
        ctx.save(); ctx.strokeStyle = '#FFD23F'; ctx.lineWidth = 7; ctx.shadowColor = '#FFD23F'; ctx.shadowBlur = 18;
        ctx.beginPath(); ctx.ellipse(focus.x, focus.y, focus.rx * (1 + Math.sin(clock * 5) * .05), focus.ry * (1 + Math.sin(clock * 5) * .05), 0, 0, 7); ctx.stroke(); ctx.restore();
      }
      hadiDraw(hd, s); salemDraw(s);
    },
  };
  const hadiHead = { x: 640, y: 600 }, salemHd = { x: 640, y: 600 }, HL = { side: 'left', cls: 'cloud sm' };   /* the clouds sit left, clear of the sign, the lights and the lines */
  return (async () => {
    await wait(600);
    await hudTour();
    /* «هادي» shows Salem three things, one by one (teacher): the sign, the pedestrian light, the white lines (p40–41) */
    focus = { x: ZX + 160, y: ROAD.farFoot - 182, rx: 62, ry: 70 };
    say('lammah', 'هَذِهِ عَلَامَةُ مَمَرِّ الْمُشَاةِ.<br>هِيَ مِنَ الْإِشَارَاتِ الْخَاصَّةِ بِالْمُشَاةِ.', hadiHead.x, hadiHead.y, HL);
    await read();
    focus = { x: FARPED_HEAD().x, y: FARPED_HEAD().y, rx: 62, ry: 92 };
    say('lammah', `وَهَذِهِ إِشَارَةُ الْمُشَاةِ.<br>${esc(K.pedCross.text).replace('الطَّرِيقَ ', 'الطَّرِيقَ<br>').replace('، وَإِشَارَةُ', '،<br>وَإِشَارَةُ')}`, hadiHead.x, hadiHead.y, HL);
    await read();
    focus = null; show = 1;
    say('lammah', `وَهَذِهِ خُطُوطُ الْمُشَاةِ.<br>${esc(K.zebra.text).replace('هِيَ ', 'هِيَ<br>')}`, hadiHead.x, hadiHead.y, HL);
    await read(); show = 0;
    say('lammah', 'عِنْدَمَا تُضِيءُ إِشَارَةُ الْمُشَاةِ بِاللَّوْنِ الْأَخْضَرِ<br>نَعْبُرُ عَلَى خُطُوطِ الْمُشَاةِ.', hadiHead.x, hadiHead.y, HL);
    const tgt = hit(ZX, (ROAD.top + ROAD.bot) / 2, { w: 170, h: 170, sq: true, ring: false });
    let crossed = false, arrow = null;
    /* the cars pass for a moment, then their light turns red; the walking man lights only when they have stopped (p40–41) */
    (async () => {
      await wait(4200); sig.car = 'yellow'; await wait(1100); sig.car = 'red'; stop = true;
      await until(() => carsStopped(cars)); sig.ped = 'green'; glowOn = true; tgt.el.classList.add('ring'); burst(ZX, 450, ['#FFF39A', '#fff']);
      if (crossed) return;
      /* the green man is lit: a big arrow on the crossing, pointing across; the child presses it and they cross (teacher's design) */
      arrow = add(`<button class="carrow" aria-label="اعْبُرْ" style="left:${ZX}px;top:${(ROAD.top + ROAD.bot) / 2}px"><svg viewBox="0 0 100 120"><path d="M50 6 L94 56 H68 V114 H32 V56 H6 Z" fill="#FFC21A" stroke="#1b1b1b" stroke-width="7" stroke-linejoin="round"/></svg></button>`);
      arrow.onclick = e => { e.stopPropagation(); tgt.el.onclick && tgt.el.onclick(); };
      say('lammah', 'أَضَاءَتْ إِشَارَةُ الْمُشَاةِ بِاللَّوْنِ الْأَخْضَرِ!<br>اضْغَطِ السَّهْمَ لِنَعْبُرَ عَلَى خُطُوطِ الْمُشَاةِ.', hadiHead.x, hadiHead.y, HL);
    })();
    const stopM = misses(n => { if (n >= 2) say('lammah', 'نَنْتَظِرُ حَتَّى تُضِيءَ إِشَارَةُ الْمُشَاةِ<br>بِاللَّوْنِ الْأَخْضَرِ.', hadiHead.x, hadiHead.y, HL); });
    while (!crossed) {
      await new Promise(r => { tgt.el.onclick = r; });
      if (sig.ped === 'green') crossed = true;
      else { say('salem', 'لَا… إِشَارَةُ الْمُشَاةِ حَمْرَاءُ.<br>أَنْتَظِرُ حَتَّى تُضِيءَ بِاللَّوْنِ الْأَخْضَرِ!', salemHd.x, salemHd.y, HL); await wait(700); }
    }
    stopM(); tgt.done(); arrow?.remove(); hush();
    say('salem', `${esc(K.zebra.text)} ${pg(K.zebra.page)}`, ZX - 220, 300, { side: 'left' });   /* left of the crossing: never on their faces */
    s.mode = 'cross'; s.x = ZX; hd.mode = 'cross'; let shot = null;
    for (s.cy = 0; s.cy < 350; s.cy += 4) { await wait(16); if (s.cy > 150 && !shot) shot = snap(STREET_CROP); }
    s.mode = 'cheerFar'; s.t = 0; burst(ZX, ROAD.farFoot - 120, ['#4CB050', '#FFC93C', '#fff'], 10); hd.mode = 'far'; await read(); hush(); await farStep(s, hd);                  /* the cars stay stopped while they talk */
    const fh = farHeads(s, hd);
    sideCloud(say('lammah', 'هَذِهِ إِشَارَةُ الْمُشَاةِ،<br>وَهِيَ مِنَ الْإِشَارَاتِ الْخَاصَّةِ بِالْمُشَاةِ.', fh.h[0], fh.h[1], { cls: 'cloud sm' }), fh.h, true);   /* p40, the book's words */
    await read(); hush();
    /* one discovery screen here (teacher: no repeated clouds): the lights and the crossing in one cloud; both cards still go to the log */
    const l = L1_LATER; L1_LATER = null;
    setPip(pipI, 'g'); await feedback({ kind: 'ok', item: l && item.sayWithLights ? { ...item, say: item.sayWithLights } : item, shot, at: fh });
    if (l) {
      G.log.push({ kind: 'ok', img: l.shot, text: l.item.card, page: l.item.page, from: !!l.item.from });
      const tag = hudEl('.log span'); if (tag) tag.textContent = ar(G.log.filter(c => c.kind === 'ok').length);
      await gainStar({ x: 640, y: 300 });
    }
  })();
}

/* on the far pavement after crossing: the pair hop a few steps to the left, away from the crossing and the stopped cars, to talk */
async function farStep(s, hd) { for (let t = 0; t <= 1.001; t += .035) { const e = easeIO(Math.min(1, t)); s.x = ZX - 430 * e; hd.fx = ZX + 50 - 380 * e; await wait(16); } }
const farHeads = (s, hd) => ({ s: [s.x, ROAD.farFoot - 180], h: [hd.fx, ROAD.farFoot - 165] });
// scene 1 of level 1 (teacher's order: the lights first, then the crossing). «هادي» shows Salem the colours of the traffic light, in clouds:
// the child presses the light → red, yellow, green (p40); then the pedestrian light: red man, green man (p40–41). No crossing here.
let L1_LATER = null;   /* the lights discovery, shown after the crossing */
function lightsScene(item, pipI) {
  const s = salemNew(450), hd = hadiNew(HADI.x), cars = traffic([0, 1]), sig = { car: 'green', ped: 'red' }; let stop = false, show = null, showPed = null;
  s.mode = 'talk'; s.foot = ROAD.nearFoot - 26; hd.foot = ROAD.nearFoot;   /* away from the crossing, a little back from «هادي»; turned towards him (teacher) */
  scene = {
    update(dt) { salemUpdate(s, dt); hadiUpdate(hd, dt); driveCars(cars, dt, stop); },
    /* no car light beside them here (teacher: one light only, so the child is not confused): «هادي» shows the colours on his own body;
       only the pedestrian light across the street */
    draw() { cover('bg_side'); zebra(ZX); drawCars(cars, 0); drawCars(cars, 1); ctx.save(); ctx.translate(PL.x, PL.foot); ctx.scale(PL.k, PL.k); pedLight(0, 0, PL.h, (showPed || sig.ped) === 'green'); ctx.restore(); carLight(CL.x, CL.foot, CL.h, sig.car, CL.k); hadiDraw(hd, s); salemDraw(s); },   /* the car light stands beside Salem and «هادي» again (teacher) */
  };
  const CL = { x: ZX - 112, foot: LIGHT.near.foot, h: 150, k: 1.4 }, PL = { x: ZX - 112, foot: ROAD.farFoot - 14, h: 80, k: 1.4 }, PL_HEAD = () => ({ x: PL.x, y: PL.foot - PL.k * (PL.h + 44) });   /* one light on each side of the street at the crossing (teacher): the car light beside Salem and «هادي», the pedestrian light across the street; both big and the same size */
  const C = { cls: 'cloud sm' }, sHead = () => ({ x: s.x - 20, y: s.foot - s.h - 10 }), hHead = () => ({ x: hd.x + 10, y: hd.foot - s.h * .92 - 10 });   /* the clouds stay left, clear of the lights */   /* small clouds, placed clear of both lights */
  return (async () => {
    await wait(600);
    await hudTour();                                                       /* the top bar, once, at the start of level 1 */
    hd.mode = 'walk'; hd.to = 270; await until(() => hd.mode === 'wait'); hd.talk = true;   /* «هادي» comes to stand beside Salem, away from the crossing */
    /* «هادي» asks first; Salem answers «لا»; then «هادي» goes on (teacher's dialogue) */
    say('lammah', 'يَا سَالِمُ،<br>هَلْ تَعْرِفُ مَاذَا تَعْنِي أَلْوَانُ إِشَارَاتِ الْمُرُورِ؟', hHead().x, hHead().y, C);
    await read();
    say('salem', 'لَا، وَلَكِنَّ الْمُعَلِّمَ سَيُخْبِرُنَا.', sHead().x, sHead().y, { ...C, side: 'left' });
    await read();
    say('lammah', 'أَنَا سَأُعَلِّمُكَ مَاذَا يَعْنِي<br>كُلُّ لَوْنٍ فِي إِشَارَةِ الْمُرُورِ!', hHead().x, hHead().y, C);
    await read();
    say('lammah', 'اضْغَطْ عَلَيَّ<br>لِتَعْرِفَ أَلْوَانِي!', hHead().x, hHead().y, C);
    await hitHint(hd.x, hd.foot - s.h * .92 / 2, { w: 130, h: 230, sq: true, hand: true }, 'اضْغَطْ عَلَى هَادِي 🚦', hHead());
    /* «هادي» lights each of his own lamps in turn: red, yellow, green (p40) */
    for (const c of ['red', 'yellow', 'green']) { hd.lamp = c; sig.car = c; stop = c !== 'green'; say('lammah', `${esc(K.lights[c].text)} ${pg(K.lights[c].page)}`, hHead().x, hHead().y, C); await read(); }
    /* «هادي» makes sure Salem has it: the three colours together (p40) */
    hd.lamp = null; say('lammah', `تَذَكَّرْ يَا سَالِمُ:<br>${['red', 'yellow', 'green'].map(c => esc(K.lights[c].text)).join('،<br>')}.`, hHead().x, hHead().y, C);
    await read();
    s.mode = 'talk'; hd.mode = 'wait';                                    /* they turn back to each other */
    say('salem', 'فَهِمْتُ يَا هَادِي!<br>هَذِهِ الْإِشَارَةُ خَاصَّةٌ بِالسَّيَّارَاتِ.', sHead().x, sHead().y, { ...C, side: 'left' }); await read();
    say('salem', 'الْإِشَارَاتُ الضَّوْئِيَّةُ<br>تُسْهِمُ فِي تَنْظِيمِ الْمُرُورِ.', sHead().x, sHead().y, { ...C, side: 'left' });   /* two short clouds (committee) */
    await read(); hush(); const shot = snap(STREET_CROP);
    setPip(pipI, 'g'); L1_LATER = { item, shot };   /* its two clouds come on the far pavement after the crossing (teacher) */
    /* then they walk on together to the crossing: the next step (teacher) */
    hd.talk = false; s.mode = 'walk'; s.to = CROSS_AT.s; hd.mode = 'walk'; hd.to = null; hd.gap = CROSS_AT.s - CROSS_AT.h; hd.follow = s;   /* to the crossing, «هادي» holding Salem's hand */
    await until(() => { s.foot = Math.min(ROAD.nearFoot, s.foot + 1); return s.mode === 'idle'; }); s.foot = ROAD.nearFoot; hd.follow = null; hd.x = CROSS_AT.h; s.mode = 'back'; hd.mode = 'back';   /* they stop facing the crossing (teacher) */
  })();
}

// scene 3: the place for children in the car (the normal back seat). Front seat = Salem shakes his head; back seat = he gets in and sits.
function seatScene(item, pipI) {
  const base = pick('car_out', 'car_base3'), C = CAROUT[base]; let inCar = false, salemA = 1, salemX = C.stand[0] * W, shake = 0, lift = 0, walking = false;
  scene = {
    update(dt) { shake = Math.max(0, shake - dt); },
    draw() {
      if (inCar) { cabinDraw({}); return; }   /* seated; the belt is fastened in the next scene */
      cover(base);
      if (C.kerb && ready(IMG.bg_side)) ctx.drawImage(IMG.bg_side, 0, 655, 1600, 80, 0, 652, W, 70);   // the pavement in front: Salem gets in from the kerb side
      sprite(lift ? `k_back${((clock * 6) | 0) % 4}` : walking ? `k_walk${((clock * 7) | 0) % 4}` : 'k_idle', salemX, C.stand[1] * H - lift, C.h * H * (1 - lift / 600), { alpha: salemA, rot: Math.sin(shake * 26) * .06 * shake, shadow: !lift });
    },
  };
  return (async () => {
    await wait(500);
    say('salem', 'أَيْنَ أَجْلِسُ دَاخِلَ السَّيَّارَةِ؟ اضْغَطْ عَلَى مَكَانِي!', salemX + 40, C.stand[1] * H - C.h * H * .35);
    for (;;) {
      const a = hit(C.back[0] * W, C.back[1] * H, { w: 150, h: 170, sq: true }), b = hit(C.front[0] * W, C.front[1] * H, { w: 150, h: 170, sq: true });
      const stopM = misses(n => { if (n >= 2) say('salem', 'اضْغَطْ عَلَى أَحَدِ الْمَقْعَدَيْنِ 💺', salemX + 40, C.stand[1] * H - C.h * H * .35); });
      const which = await Promise.race([a.p.then(() => 'back'), b.p.then(() => 'front')]); a.done(); b.done(); stopM();
      if (which === 'back') break;
      shake = .7; say('salem', 'هَذَا لَيْسَ مَكَانِي…', salemX + 40, C.stand[1] * H - C.h * H * .35); await read();
      say('salem', 'أَيْنَ أَجْلِسُ؟', salemX + 40, C.stand[1] * H - C.h * H * .35);
    }
    hush();
    const x0 = salemX, x1 = C.back[0] * W + 20; walking = true; for (let t = 0; t <= 1; t += .025) { salemX = x0 + (x1 - x0) * t; await wait(20); } walking = false;   /* he walks to the open door (110 px/s) */
    for (let t = 0; t <= 1; t += .03) { lift = 1 + 60 * easeIO(t); salemA = 1 - Math.max(0, t - .7) / .3; await wait(20); }   /* he steps up into the car (back to us), then is inside */
    inCar = true; await wait(700); const shot = snap();
    setPip(pipI, 'g'); SEAT_LATER = { item, shot };   /* its cloud comes with the belt's, once the belt is fastened (teacher: one full sentence, no repeat) */
  })();
}
const CARFB = { dad: [735, 205], hand: [850, 300], dash: [905, 300], boy: [345, 255], boyAt: [30, 490], dadSay: 'أَحْسَنْتَ يَا بُنَيَّ!<br>هَذِهِ نَجْمَةٌ لَكَ.' };   /* measured on the cabin picture (1280×720) */
let SEAT_LATER = null;
// the car cabin: picture + Salem on the back seat + the belt drawn in code (shoulder → across the chest → buckle at the hip)
function cabinGeo() {
  const base = pick('cabin', 'car_base3'), c = CABIN[base], sh = c.h * H, px = c.seat[0] * W, py = c.seat[1] * H;
  return { base, sh, px, py, A: { x: px - sh * .30, y: py - sh * .66 }, S: { x: px - sh * .11, y: py - sh * .555 }, B: { x: px - sh * .11, y: py - sh * .33 }, loose: { x: px - sh * .30, y: py - sh * .36 } };   // A = the anchor on the pillar behind the shoulder
}
function cabinDraw(o = {}) {
  const g = cabinGeo(), lean = o.lean || 0, rk = o.reach && ready(IMG.salem_reach) ? 'salem_reach' : null;
  cover(o.look && ready(IMG.cabin_look) ? 'cabin_look' : g.base);
  ctx.save(); ctx.translate(g.px, g.py); ctx.rotate(lean); ctx.translate(-g.px, -g.py);
  let P = { A: g.A, S: g.S, hip: { x: g.px + g.sh * .03, y: g.py - g.sh * .36 }, B: g.B };
  if (rk) {   /* the reaching boy: his own picture, so the belt points are measured on it */
    const rw = IMG[rk].naturalWidth / IMG[rk].naturalHeight * g.sh, x0 = g.px + g.sh * .1 - rw / 2, y0 = g.py - g.sh;
    sprite(rk, g.px + g.sh * .1, g.py, g.sh, { shadow: false });
    P = { A: { x: x0 - rw * .01, y: y0 + g.sh * .27 }, S: { x: x0 + rw * .24, y: y0 + g.sh * .36 }, hip: { x: x0 + rw * .42, y: y0 + g.sh * .57 }, B: { x: x0 + rw * .09, y: y0 + g.sh * .59 } };
  } else sprite(o.reach ? 'kid_reach' : 'k_sit', g.px, g.py, g.sh, { flip: !o.reach, shadow: false });
  ctx.restore();
  // the belt
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const strap = (pts, quad) => { for (const [w, col] of [[g.sh * .056, INK], [g.sh * .034, '#7d8894']]) { ctx.lineWidth = w; ctx.strokeStyle = col; ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y); if (quad) ctx.quadraticCurveTo(pts[1].x, pts[1].y, pts[2].x, pts[2].y); else pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y)); ctx.stroke(); } };
  if (o.belt) { const S = rotP(P.S, g, lean), hip = rotP(P.hip, g, lean), B = rotP(P.B, g, lean); strap([P.A, S, hip, B]); buckle(B, g.sh); }
  else if (o.tongue) { strap([g.A, { x: (g.A.x + o.tongue.x) / 2 + g.sh * .1, y: Math.min(g.S.y, (g.A.y + o.tongue.y) / 2) }, o.tongue], true); buckle(o.tongue, g.sh, true); }
  else { strap([g.A, { x: g.A.x - 3, y: (g.A.y + g.loose.y) / 2 }, g.loose], true); buckle(g.loose, g.sh, true); }
  ctx.restore();
  if (o.doors > 0 && g.base === 'cabin') cabinDoors(o.doors);
}
/* the near side of the white car (cabin.jpg is cut away): the rear door hinges on the middle pillar, the front door on the windscreen pillar.
   The window glass stays clear, so Salem in his belt and the father are still seen (measured on cabin.jpg, 1280×720) */
function cabinDoors(k) {
  const doors = [
    { hinge: 566, body: [[110, 92], [566, 92], [566, 612], [150, 612], [110, 560]], win: [[150, 118], [548, 118], [548, 292], [150, 292]], handle: [470, 336] },
    { hinge: 1096, body: [[578, 92], [890, 92], [1096, 300], [1096, 612], [578, 612]], win: [[598, 118], [872, 118], [1048, 290], [598, 290]], handle: [690, 336] },
  ];
  const e = easeIO(Math.min(1, k));
  for (const d of doors) {
    ctx.save(); ctx.translate(d.hinge, 0); ctx.scale(Math.max(.02, e), 1); ctx.translate(-d.hinge, 0);
    const path = pts => { ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); };
    const gr = ctx.createLinearGradient(0, 92, 0, 612); gr.addColorStop(0, '#ffffff'); gr.addColorStop(.55, '#eef1f4'); gr.addColorStop(1, '#cfd5dc');
    ctx.save(); ctx.beginPath(); for (const pts of [d.body, d.win]) { pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); } ctx.fillStyle = gr; ctx.fill('evenodd'); ctx.restore();   /* the door, with a hole for its window */
    path(d.win); ctx.fillStyle = 'rgba(150, 205, 235, .22)'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = '#1f2328'; ctx.stroke();   /* clear glass, black rubber frame */
    path(d.body); ctx.lineWidth = 4; ctx.strokeStyle = '#8a939c'; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(d.body[0][0] + 20, 420); ctx.lineTo(d.body[2][0] - 20, 420); ctx.lineWidth = 3; ctx.strokeStyle = '#c3cad1'; ctx.stroke();   /* the side crease */
    ctx.fillStyle = '#9aa3ac'; ctx.beginPath(); ctx.roundRect(d.handle[0], d.handle[1], 64, 14, 7); ctx.fill();   /* the door handle */
    ctx.restore();
  }
}
const rotP = (p, g, a) => { if (!a) return p; const dx = p.x - g.px, dy = p.y - g.py; return { x: g.px + dx * Math.cos(a) - dy * Math.sin(a), y: g.py + dx * Math.sin(a) + dy * Math.cos(a) }; };
function buckle(p, sh, tongue) { ctx.fillStyle = '#d9dee3'; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(p.x - sh * .045, p.y - sh * .035, sh * .09, sh * .07, 4); ctx.fill(); ctx.stroke(); if (!tongue) { ctx.fillStyle = '#E5434F'; ctx.fillRect(p.x - sh * .02, p.y - sh * .012, sh * .04, sh * .024); } }

// scene 4: the seat belt. Drag the belt tongue to the buckle at the hip (or click it: it goes by itself).
function beltScene(item, pipI) {
  let st = { tongue: null, belt: false }, shield = 0;
  scene = { update(dt) { if (shield) shield = Math.min(1, shield + dt * 3); }, draw() { cabinDraw(st); if (shield) { const g = cabinGeo(); ctx.save(); ctx.globalAlpha = shield; if (ready(IMG.emblem)) sprite('emblem', g.px + g.sh * .45, g.py - g.sh * .62, 90 * ease(shield), { shadow: false });   /* the agreed shield (teacher) */ ctx.restore(); } } };
  return (async () => {
    await wait(400); const g = cabinGeo();
    say('salem', 'أَنَا الْآنَ دَاخِلَ السَّيَّارَةِ. اسْحَبِ الْحِزَامَ وَارْبِطْهُ!', g.px + 150, g.py - g.sh + 20, { side: 'left' });
    const h = hit(g.loose.x, g.loose.y, { w: 90, h: 90, hand: true }); h.el.onclick = null;
    const goal = add(`<div class="hit ring" style="left:${g.B.x}px;top:${g.B.y}px;width:60px;height:60px;pointer-events:none;opacity:.8"></div>`);
    await new Promise(res => {
      let drag = false, moved = 0, cur = { ...g.loose };
      const finish = async () => { h.done(); goal.remove(); const from = { ...cur }; for (let t = 0; t <= 1; t += .05) { st.tongue = { x: from.x + (g.B.x - from.x) * easeIO(t), y: from.y + (g.B.y - from.y) * easeIO(t) }; await wait(16); } st = { belt: true }; shield = .01; burst(g.B.x, g.B.y, ['#fff', '#FFC93C']); res(); };
      h.el.onpointerdown = e => { drag = true; moved = 0; try { h.el.setPointerCapture(e.pointerId); } catch (_) { /* no capture: the drag still works */ } };
      h.el.onpointermove = e => { if (!drag) return; const p = toStage(e); moved += 1; cur = p; st.tongue = p; h.el.style.left = p.x + 'px'; h.el.style.top = p.y + 'px'; };
      h.el.onpointerup = () => { if (!drag) return; drag = false; if (moved < 3 || Math.hypot(cur.x - g.B.x, cur.y - g.B.y) < 70) finish(); else { cur = { ...g.loose }; st.tongue = null; h.el.style.left = g.loose.x + 'px'; h.el.style.top = g.loose.y + 'px'; } };
      h.el.onkeydown = e => { if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); finish(); } };
    });
    hush(); await wait(900); const shot = snap();
    st.doors = .001; for (let t = 0; t <= 1.0001; t += .04) { st.doors = t; await wait(16); } await wait(500);   /* the doors shut after the belt (teacher) */
    const sl = SEAT_LATER; SEAT_LATER = null;
    if (!sl) setPip(pipI, 'g'); await feedback({ kind: 'ok', item: sl ? sl.item : item, shot, car: { ...CARFB, boyAt: [24, 372], boySay: 'أَجْلِسُ فِي الْمَكَانِ الْمُخَصَّصِ|لِلْأَطْفَالِ فِي السَّيَّارَةِ،|وَلَا أَرْكَبُ السَّيَّارَةَ|مِنْ دُونِ حِزَامِ أَمَانٍ.' } });
    if (sl) {   /* the seat card still goes to the log, and its star */
      /* the car gives ONE card, «أَجْلِسُ فِي الْمَكَانِ الْمُخَصَّصِ…» (p43 «أفعل»): no green «لَا أَرْكَبُ…» card in the truck, because the
         same sentence without «لا» is an UNSAFE card of the measure (committee r7, teacher 29 Oct 2026) */
      await gainStar({ x: CARFB.boy[0], y: CARFB.boy[1] + 40 });
    }
  })();
}

// end of level 1 (teacher's design, 28 Oct 2026): the safety truck stops; Salem takes the cards out of his hand: the three safe ones (p43 «أفعل») and one
// he is not sure of. «هادي», up by the keys, asks the child to load the safe ones; the unsure card will not go in. Then «هادي» gives the
// bronze key, and Salem takes the unsure card with him to the second door (its secret is behind it).
function truckScene() {
  hud('safe'); const tr = { x: -420, s: 300, phase: 'in' };
  /* a fourth safe card: getting out of the car on the pavement side (the p39 picture has no sentence; the teacher's wording, 29 Oct 2026) */
  if (!G.log.some(c => c.id === 'kerb')) { G.log.push({ kind: 'ok', id: 'kerb', tw: true, img: 'assets/v6/c_kerb.jpg', text: 'أَنْزِلُ مِنَ السَّيَّارَةِ مِنْ جِهَةِ الرَّصِيفِ.', page: 39 }); const tag = hudEl('.log span'); if (tag) tag.textContent = ar(G.log.filter(c => c.kind === 'ok').length); }
  const safe = G.log.filter(c => c.kind === 'ok');
  const odd = K.measure.find(c => c.id === 'run'), all = safe.map(c => ({ ...c, ok: true }));
  all.splice(Math.floor(all.length / 2), 0, { img: `assets/v5/${odd.img}.jpg`, text: odd.text, ok: false });   /* the unsure card in the middle of the row (teacher) */
  const SX = 1190, LAM = { x: 930, foot: ROAD.farFoot + 4, h: 205 }, HW = { x: 600, foot: ROAD.nearFoot, h: 230 }, SP = 790; let lam = 0, lamKey = 'lammah_point', salemKey = 'k_idle', hw = null, sx = SX, sTo = null, faceR = false;
  const sImg = add(`<img class="sreach" src="assets/v5/salem_card.webp" alt="" style="display:none">`);
  scene = {
    update(dt) {
      if (tr.phase === 'in') { const d = 470 - tr.x, need = tr.s * tr.s / (2 * Math.max(d, 1)); if (d < 2) { tr.s = 0; tr.phase = 'stop'; } else if (need > 200) tr.s = Math.max(0, tr.s - need * dt); tr.x += tr.s * dt; }
      if (tr.phase === 'out') { tr.s = Math.min(320, tr.s + 140 * dt); tr.x += tr.s * dt; }
      if (lam && lam < 1) lam = Math.min(1, lam + dt * 2.5);
      if (sTo != null) { const d = sTo - sx, st = 560 * dt; if (Math.abs(d) <= st) { sx = sTo; sTo = null; } else sx += Math.sign(d) * st; }   /* Salem walks to the card the child picks */
      if (hw && hw.k < 1) { hw.k = Math.min(1, hw.k + dt * .4); sx = hw.sx0 + (SP - hw.sx0) * ease(hw.k); if (hw.k === 1) hw.key = 'hadi_talk'; }   /* they walk to the middle and meet */
    },
    draw() {
      cover('bg_side');
      if (hw) { const k = ease(hw.k), hop = hw.k < 1 ? Math.abs(Math.sin(clock * 8)) * 6 : 0; if (ready(IMG[hw.key])) sprite(hw.key, LAM.x + (HW.x - LAM.x) * k, LAM.foot + (HW.foot - LAM.foot) * k - hop, LAM.h + (HW.h - LAM.h) * k, { flip: hw.k < 1 }); }
      else if (lam && ready(IMG[lamKey])) sprite(lamKey, LAM.x, LAM.foot, LAM.h * ease(lam), { flip: lamKey === 'lammah_point' });   /* «هادي» up by the keys, pointing at the truck */
      drawTruck(tr.x, ROAD.nearLane + 8, 1);
      const reach = salemKey === 'salem_card' && sTo == null && ready(IMG.salem_card);   /* his hand lies ON the card: drawn above the cards (DOM) */
      if (sImg) { if (reach) { const w = IMG.salem_card.naturalWidth / IMG.salem_card.naturalHeight * SIZE.salem; sImg.style.display = 'block'; sImg.style.left = sx - w / 2 + 'px'; sImg.style.top = ROAD.nearFoot - SIZE.salem + 'px'; sImg.style.width = w + 'px'; } else sImg.style.display = 'none'; }
      if (reach) { ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.beginPath(); ctx.ellipse(sx, ROAD.nearFoot, 40, 9, 0, 0, 7); ctx.fill(); }
      else if ((hw && hw.k < 1) || sTo != null) sprite(`k_walk${((clock * 7) | 0) % 4}`, sx, ROAD.nearFoot, SIZE.salem, { flip: (sTo != null && sTo > sx) || (hw && hw.k < 1 && hw.sx0 < SP) }); else sprite(ready(IMG[salemKey]) ? salemKey : 'salem_talk', sx, ROAD.nearFoot, SIZE.salem, { flip: faceR && salemKey === 'salem_talk' });   /* he faces the cards still on the pavement */
    },
  };
  const DOOR = () => ({ x: tr.x - 185, y: ROAD.nearLane - 120 });                       // the open rear door of the truck
  const inTruck = p => p.x > tr.x - 260 && p.x < tr.x + 250 && p.y > ROAD.nearLane - 270 && p.y < ROAD.nearLane + 20;
  const CW = 200, slotX = i => 24 + (4 - i) * 212, SLOTY = 512;                            // five big cards, all the same size, in a row along the pavement
  const sHead = () => ({ x: sx, y: ROAD.nearFoot - SIZE.salem - 8 }), SL = { side: 'left', cls: 'cloud sm' };
  /* «هادي»'s cloud opens to the RIGHT of his head (teacher) */
  const hadiSay = html => { say('lammah', html, LAM.x, LAM.foot - LAM.h, { cls: 'cloud sm hside' }); const bb = ui.querySelector('.bubble'); if (bb) { bb.style.left = Math.min(W - 8 - bb.offsetWidth, LAM.x + 40) + 'px'; bb.style.top = (LAM.foot - LAM.h - 60) + 'px'; } };
  const handOf = (key, x, foot, h, flip) => { const im = IMG[key], w = ready(im) ? im.naturalWidth / im.naturalHeight * h : h, f = flip ? 1 - HAND[key][0] : HAND[key][0]; return { x: x - w / 2 + w * f, y: foot - h + h * HAND[key][1] }; };
  (async () => {
    await until(() => tr.phase === 'stop');
    say('salem', `اكْتَشَفْنَا ${safe.length === 3 ? 'ثَلَاثَةَ' : 'أَرْبَعَةَ'} سُلُوكَاتٍ آمِنَةٍ!<br>هَذِهِ بِطَاقَاتُهَا.`, sHead().x, sHead().y, SL); await wait(1200);
    // 1. the cards come out of Salem's hand, one by one, and line up on the pavement
    const hand = { x: SX - 40, y: ROAD.nearFoot - SIZE.salem * .48 }, els = [];
    for (const [i, c] of all.entries()) {
      const el = add(`<div class="tcard big ${c.ok ? '' : 'odd'}" tabindex="0" style="left:${hand.x - CW / 2}px;top:${hand.y - 100}px;transform:scale(.12)"><img src="${c.img}" alt=""><p>${esc(c.text)}</p></div>`);
      requestAnimationFrame(() => requestAnimationFrame(() => { el.style.left = slotX(i) + 'px'; el.style.top = SLOTY + 'px'; el.style.transform = 'scale(1)'; }));
      burst(hand.x, hand.y, ['#4CB050', '#FFC93C', '#fff'], 6); els.push({ el, i, ok: c.ok, done: false }); await wait(650);
    }
    say('salem', 'وَهَذِهِ الْبِطَاقَةُ؟<br>لَسْتُ مُتَأَكِّدًا مِنْهَا…', sHead().x, sHead().y, SL);
    await read(); hush(); await wait(300);
    // 2. «هادي» appears by the keys and asks the child to load the safe cards; Salem answers
    lam = .01; await wait(500);
    hadiSay('أَحْسَنْتَ يَا بَطَلُ!<br>انْقُلِ السُّلُوكَاتِ الْآمِنَةَ<br>إِلَى شَاحِنَةِ السُّلُوكِ الْآمِنِ.'); await read();
    salemKey = 'salem_talk';   /* he turns to the cards */
    say('salem', 'حَسَنًا، سَأَنْقُلُ السُّلُوكَاتِ الْآمِنَةَ<br>إِلَى الشَّاحِنَةِ.', sHead().x, sHead().y, SL);
    const hint = add(`<div class="hand" style="left:${slotX(0) + 60}px;top:${SLOTY + 40}px">👆</div>`); setTimeout(() => hint.remove(), 3500);
    // 3. drag (or click) each card into the truck; the unsure card will not go in
    await new Promise(res => {
      const left = () => els.filter(e => e.ok && !e.done).length;
      const toCard = e => {   /* Salem walks to the card and puts his hand on it (teacher) */
        const im = IMG.salem_card, w = ready(im) ? im.naturalWidth / im.naturalHeight * SIZE.salem : SIZE.salem * .45, cx = slotX(e.i) + CW - 45;   /* his hand on the card's edge: his body stays clear of its picture and words */
        salemKey = 'salem_card'; sTo = clamp(cx + w / 2 - w * SCARD[0], 60, W - 60);
      };
      const back = e => { e.el.style.transition = 'left .35s, top .35s'; e.el.style.left = slotX(e.i) + 'px'; e.el.style.top = SLOTY + 'px'; };
      let busy = false, home = SX;   /* one card at a time: Salem has one hand on one card */
      const load = async (e, dragged) => {
        if (e.done || busy) { if (!e.done && dragged) back(e); return; }
        busy = true;
        if (!dragged) { toCard(e); await until(() => sTo == null); await wait(800);   /* his hand on the card first */ }
        if (!e.ok) {   /* the truck is only for safe behaviours: the card comes back, Salem is not sure */
          /* it flies to the truck, the truck does not take it, it comes back and shakes; Salem says he is not sure, then the child goes on (teacher) */
          const d = DOOR(); e.el.style.transition = 'left .45s, top .45s, transform .45s'; e.el.style.left = d.x - CW / 2 + 'px'; e.el.style.top = d.y - 110 + 'px'; e.el.style.transform = 'scale(.55)';
          await wait(500); back(e); e.el.style.transform = 'scale(1)'; await wait(380); e.el.classList.remove('shake'); void e.el.offsetWidth; e.el.classList.add('shake');
          /* it does not stay in front of Salem: it goes behind him, out of the row, so he can go on with the other cards (teacher) */
          await wait(600); e.done = true; home = SX - 130;
          e.el.style.transition = 'left .6s, top .6s, transform .6s'; e.el.style.left = W - 8 - CW * .8 - CW * .2 + 'px'; e.el.style.top = SLOTY - 40 + 'px'; e.el.style.transform = 'scale(.6) rotate(4deg)';
          salemKey = 'salem_talk'; faceR = false; sTo = home; await until(() => sTo == null);   /* back to his place by the row, the card behind him */
          say('salem', 'لَسْتُ مُتَأَكِّدًا مِنْ هَذِهِ الْبِطَاقَةِ…<br>سَنَتَحَدَّثُ عَنْهَا بَعْدَ قَلِيلٍ.', sHead().x, sHead().y, SL);
          busy = false; await read(); if (ui.querySelector('.bubble')?.textContent.includes('سَنَتَحَدَّثُ')) hush(); return;
        }
        e.done = true; busy = false; const d = DOOR(); e.el.style.transition = 'left .5s, top .5s, transform .5s, opacity .5s';
        e.el.style.left = d.x - CW / 2 + 'px'; e.el.style.top = d.y - 90 + 'px'; e.el.style.transform = 'scale(.15)'; e.el.style.opacity = '.4';
        burst(d.x, d.y, ['#4CB050', '#FFC93C', '#fff'], 8); await wait(520); e.el.remove(); salemKey = 'salem_talk'; sTo = home;   /* back to his place by the row */
        faceR = false;   /* at his place all the cards are on his left */
        if (!left()) res();
      };
      els.forEach(e => {
        let drag = null; const el = e.el;
        el.onpointerdown = ev => { if (e.done) return; const p = toStage(ev); drag = { dx: p.x - parseFloat(el.style.left), dy: p.y - parseFloat(el.style.top), moved: 0 }; el.style.transition = 'none'; el.classList.add('drag'); try { el.setPointerCapture(ev.pointerId); } catch (_) { /* the drag still works */ } };
        el.onpointermove = ev => { if (!drag) return; const p = toStage(ev); drag.moved++; el.style.left = p.x - drag.dx + 'px'; el.style.top = p.y - drag.dy + 'px'; };
        el.onpointerup = ev => {
          if (!drag) return; const p = toStage(ev), moved = drag.moved > 2; drag = null; el.classList.remove('drag');
          if (!moved) load(e); else if (inTruck(p)) load(e, true); else back(e);   // a click also works (for small hands)
        };
        el.onkeydown = ev => { if (ev.code === 'Space' || ev.code === 'Enter') { ev.preventDefault(); load(e); } };
      });
    });
    lamKey = 'lammah_ok';
    hadiSay('مُمْتَازٌ!<br>كُلُّ السُّلُوكَاتِ الْآمِنَةِ<br>فِي الشَّاحِنَةِ!');
    await wait(1200); tr.phase = 'out'; salemKey = 'k_cheer'; await read(); hush();
    banner('أَحْسَنْتَ!', 'اكْتَمَلَتْ مُهِمَّةُ اكْتِشَافِ السُّلُوكِ الْآمِنِ', '#3FA845'); confetti(50); await wait(1200);
    // 4. «هادي» comes down to Salem; together they hold up the card the truck would not take, and Salem reads it (teacher)
    hw = { k: 0, key: 'hadi_walk', sx0: sx }; salemKey = 'salem_talk'; faceR = false;
    const oddCard = els.find(e => !e.ok), HC = [HW.x - 60, 505], SC = [SP + 70, 505], HO = { side: 'left', cls: 'cloud sm' }, SO = { cls: 'cloud sm' };   /* «هادي»'s clouds open left, Salem's open right: each tail points at its speaker */
    if (oddCard) { const el = oddCard.el; el.onpointerdown = el.onpointermove = el.onpointerup = el.onkeydown = null; el.classList.add('raised'); el.style.transition = 'left 1.2s, top 1.2s, transform 1.2s'; el.style.left = (HW.x + SP) / 2 - CW / 2 + 'px'; el.style.top = '228px'; el.style.transform = 'scale(1.06) rotate(-2deg)'; }
    await until(() => hw.k >= 1); await wait(400);
    say('salem', 'لِمَاذَا لَمْ تَقْبَلِ الشَّاحِنَةُ<br>هَذِهِ الْبِطَاقَةَ؟', ...SC, SO); await read();
    say('lammah', 'حَاوِلْ أَنْ تَقْرَأَهَا يَا سَالِمُ.', ...HC, HO); await read();
    oddCard?.el.classList.add('reading');
    say('salem', `«${esc(odd.text)}»…<br>آمِنٌ أَمْ غَيْرُ آمِنٍ؟`, ...SC, SO); await read();
    say('lammah', 'لِتَعْرِفَ الْإِجَابَةَ، هَيَّا نَخْرُجْ مِنْ هُنَا<br>وَنَدْخُلْ بَابَ التَّحَدِّي الثَّانِي.', ...HC, HO); await read();
    /* the card goes into Salem's hand: they take it with them */
    const salemHand = { x: SP - 40, y: ROAD.nearFoot - SIZE.salem * .5 };
    if (oddCard) { const el = oddCard.el; el.classList.remove('reading'); el.style.transition = 'left .9s, top .9s, transform .9s, opacity .9s'; el.style.left = salemHand.x - CW / 2 + 'px'; el.style.top = salemHand.y - 100 + 'px'; el.style.transform = 'scale(.2)'; el.style.opacity = '.3'; await wait(950); el.remove(); G.oddCard = true; }
    // 5. «هادي» gives Salem the key of this challenge: from his hand to Salem, then to the keys bar
    say('lammah', 'وَلَكِنْ قَبْلَ ذَلِكَ، خُذْ يَا سَالِمُ<br>مِفْتَاحَ هَذَا التَّحَدِّي!', ...HC, HO); await read(); hush();
    const from = handOf('hadi_talk', HW.x, HW.foot, HW.h, false);
    G.keys.push('g');                                                   /* the key leaves «هادي»'s hand */
    const fk = add(`<div class="flykey" style="left:${from.x}px;top:${from.y}px">${keySvg(KEYCOL.g)}</div>`);
    requestAnimationFrame(() => requestAnimationFrame(() => { fk.style.left = salemHand.x + 'px'; fk.style.top = salemHand.y + 'px'; fk.classList.add('in'); }));
    await wait(1300); burst(salemHand.x, salemHand.y, ['#FFD23F', '#fff', '#CD7F32'], 12); salemKey = 'k_cheer';
    say('salem', 'شُكْرًا يَا هَادِي!<br>حَصَلْنَا عَلَى الْمِفْتَاحِ الْبُرُونْزِيِّ!', ...SC, SO);
    await wait(1600); fk.remove(); await gainKey('g', salemHand); await read(); hush();
    /* no button here (teacher): they go out to the next screen, where the door is opened */
    await wait(500); go(() => doorPass(1, level2, { ask: true }));
  })();
}
// the truck: the Codex picture, or a code drawing; its label is written in code (no text in pictures)
function drawTruck(x, foot, k) {
  const im = IMG.truck; let bx, by, bw, bh;
  if (ready(im)) { const h = 250 * k, w = im.naturalWidth / im.naturalHeight * h; ctx.drawImage(im, x - w / 2, foot - h, w, h); bx = x - w * .365; by = foot - h * .99; bw = w * .6; bh = h * .67; /* the plain cargo side, measured on the picture (teacher: the words in its middle) */ }
  else {
    const w = 480 * k, h = 230 * k; bx = x - w / 2; by = foot - h; bw = w * .66; bh = h * .74;
    rr(bx, by, bw, bh, 18, '#43B54A'); rr(bx + bw + 6, by + bh * .28, w * .3, bh * .72, 22, '#2f8f36'); rr(bx + bw + w * .12, by + bh * .36, w * .14, bh * .3, 10, '#bfe7ff', INK, 4);
    for (const wx of [bx + bw * .22, bx + bw * .9]) { ctx.beginPath(); ctx.arc(wx, foot - 26 * k, 34 * k, 0, 7); ctx.fillStyle = '#222'; ctx.fill(); ctx.beginPath(); ctx.arc(wx, foot - 26 * k, 14 * k, 0, 7); ctx.fillStyle = '#bbb'; ctx.fill(); }
  }
  /* two lines, sized to fit inside the cargo box, in its middle */
  const lines = ['شَاحِنَةُ', 'السُّلُوكِ الْآمِنِ']; ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.direction = 'rtl';
  ctx.font = '800 100px Naskh'; const fs = Math.min(bh * .23, 100 * bw * .6 / Math.max(...lines.map(l => ctx.measureText(l).width)));   /* well inside the green panel (teacher) */ ctx.font = `800 ${Math.round(fs)}px Naskh`;
  ctx.lineWidth = Math.max(4, fs * .2); ctx.strokeStyle = INK; ctx.fillStyle = '#fff'; ctx.lineJoin = 'round';
  lines.forEach((l, i) => { const ly = by + bh * .52 + (i - .5) * fs * 1.3; ctx.strokeText(l, bx + bw / 2, ly); ctx.fillText(l, bx + bw / 2, ly); }); ctx.restore();
}

// ================================================================== LEVEL 2 «اكْشِفْ سِرَّ السُّلُوكِ الْخَطِرِ» — the road to school on the map, 4 barriers
// path nodes on bg_map (stage pixels), from the house (bottom) to the school (top). Barriers on 4 nodes.
/* ================= LEVEL 2 on the street (teacher, 29 Oct 2026; built from the approved prototype proto/level2-b.html)
   Salem and «هادي» walk big on the pavement towards the school. «هادي» holds a big 3D lens over the street.
   Six stations (p41–47): the child brings the lens to the danger sign, finds the danger in the picture, the scene moves and
   freezes before the danger (no crash), «هادي» turns red and says the book's «لا…» sentence (p43), the card goes into the red box.
   Salem never makes the mistakes: another boy in each picture. */
const L2S = [
  { img: 'o_run', p: 43, salem: 'انْظُرْ! وَلَدٌ فِي الشَّارِعِ.', hot: [.38, .5, .22], u: 'run', mystery: true, p41: true },
  { img: 'o_cross', p: 43, salem: 'انْظُرْ! وَلَدٌ وَخُطُوطٌ بَيْضَاءُ.', safe: 'cross' },   /* safe, p47 (committee: a real choice) */
  { img: 'o_ball', p: 47, tsay: 'لَا أَلْعَبُ بِالْكُرَةِ<br>قُرْبَ الشَّارِعِ.', tcard: 'أَلْعَبُ بِالْكُرَةِ قُرْبَ الشَّارِعِ.', salem: 'انْظُرْ! وَلَدٌ وَكُرَةٌ.', hot: [.66, .76, .13], u: null },
  { img: 'o_bike', p: 43, salem: 'انْظُرْ! وَلَدٌ وَدَرَّاجَةٌ.', hot: [.48, .58, .22], u: 'bike', predict: true },
  { img: 'o_wait', pan: .1, p: 43, salem: 'انْظُرْ! وَلَدٌ عِنْدَ الْإِشَارَةِ.', safe: 'lights' },   /* safe, p47 */
  { img: 'o_nobelt', p: 43, salem: 'انْظُرْ! وَلَدٌ فِي السَّيَّارَةِ.', hot: [.47, .45, .2], u: 'nobelt', predict: 'q' },
  { img: 'o_family', p: 43, salem: 'انْظُرْ! أُسْرَةٌ فِي السَّيَّارَةِ.', safe: 'seat' },   /* safe, p47 (the red car with a family) */
  { img: 'o_distract', p: 43, salem: 'انْظُرْ! أَبٌ وَوَلَدٌ فِي السَّيَّارَةِ.', hot: [.58, .44, .22], u: 'distract' },
  { img: 'o_door', p: 47, tsay: 'لَا أَفْتَحُ بَابَ السَّيَّارَةِ<br>وَهِيَ تَسِيرُ.', tcard: 'أَفْتَحُ بَابَ السَّيَّارَةِ وَهِيَ تَسِيرُ.', salem: 'انْظُرْ! سَيَّارَةٌ عَلَى الطَّرِيقِ.', hot: [.52, .53, .17], u: null }   /* the open rear door of the moving car (redrawn, committee r8) */,
];
const L2W = { FOOT: 706, salem: { h: 420 }, hadi: { h: 440 } };   /* big on the pavement (teacher) */
/* «هادي» holding the lens (Codex pictures, teacher 29 Oct 2026: his glove closes round a thin handle). Measured on each picture:
   the glass centre (fx, fy of the width/height), the glass radius (ri, of the height), and width/height (ar). The glass is see-through. */
/* The small lens was cut out of the pictures (…_nolens): the glove and the thin handle stay, and a big gold lens sits on top of the handle.
   ro = where the handle meets the lens (its distance below the glass centre, in heights). */
const HOLDP = { green: { k: 'hadi_hold_green_nolens', fx: .2436, fy: .2443, ro: .2008, ar: .8265 }, red: { k: 'hadi_hold_red_nolens', fx: .2408, fy: .2436, ro: .2011, ar: .8354 }, back: { k: 'hadi_hold_back_nolens', fx: .2387, fy: .2404, ro: .2004, ar: .8545 } };
const RIM = 1.275;
/* Salem raises his own lens, facing the child (teacher): measured on salem_lens (Codex), the small lens cut out and a big rim put on its handle */
const SLP = { k: 'salem_lens_bag_nolens', fx: .7748, fy: .1362, ro: .123, ar: .5454 }, RS = 95;   /* Salem wears his school bag all the way (teacher) */   /* the gold rim's outer radius / the glass radius (lens_rim.webp) */
function level2() {
  hud('danger'); G.l2found = false; if (K5().first == null && !G.trial && !K5().t2) { K5().t2 = Date.now(); save(); }   /* not on the teacher's trial (committee r8) */ const run = RUN, alive = () => RUN === run;
  const F = L2W.FOOT, SH = L2W.salem.h, HH = L2W.hadi.h, R = 120, Y = F - HH + (HOLDP.green.fy + HOLDP.green.ro) * HH - R * RIM * .5;   /* the handle goes into the rim low on its side: the lens stays over the street, under the clouds */   /* a big lens on top of the thin handle in his glove */
  const L = { x: 420, y: Y, on: false, img: null, zoom: 1, fx: .5, fy: .5, freeze: 0, glow: 0, shake: 0, show: false };
  let scroll = 0, speed = 0, red = false, sign = null, gateIn = 0, found = 0, look = false, intro = true;   /* look: both turn to the street at a station (teacher) */
  const pose = () => (red ? HOLDP.red : HOLDP.green)   /* always facing the child (committee: his back looked like a grey block) */, hx = () => L.x + R * RIM * .85 - (pose().fx - .5) * pose().ar * HH; let bob = 0;
  const sx = () => Math.min(975, hx() + 250);
  const sLens = () => ({ x: sx() + (SLP.fx - .5) * SLP.ar * SH + .85 * RS * RIM, y: F - SH + (SLP.fy + SLP.ro) * SH - .5 * RS * RIM });
  const slens = add(`<div class="slens" style="display:none;width:${RS * 2}px;height:${RS * 2}px"></div>`);   /* what Salem shows in his lens */
  const slensSet = (html, cls = '') => { slens.className = 'slens ' + cls; slens.innerHTML = html; slens.style.opacity = html ? 1 : 0; if (html) { slens.classList.remove('pop'); void slens.offsetWidth; slens.classList.add('pop'); } };
  let judge = false, grey = null;   /* «هادي» is grey (no light) while the child decides */
  const greyHadi = () => { if (ready(IMG.hadi_hold_off_nolens)) return IMG.hadi_hold_off_nolens;   /* drawn calm, not smiling (committee) */
    if (grey) return grey; const im = IMG[HOLDP.green.k]; if (!ready(im)) return null; const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; const x = c.getContext('2d'); x.filter = 'grayscale(1) brightness(1.08)'; x.drawImage(im, 0, 0); return (grey = c); };
  let flash = 0;   /* «هادي»'s rim flashes once when the phrase matches the picture */   /* Salem walks right beside «هادي» all the way (teacher) */
  const drawLens = () => {
    const x = L.x + (L.shake ? Math.sin(clock * 60) * L.shake * 6 : 0), y = L.y - bob;   /* the lens goes up and down with his steps */
    if (L.on) { ctx.save(); ctx.fillStyle = 'rgba(10,20,35,.62)'; ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.moveTo(x + R + 10, y); ctx.arc(x, y, R + 10, 0, Math.PI * 2, true); ctx.fill('evenodd'); ctx.restore(); }
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, R, 0, 7); ctx.clip(); const im = L.img && IMG[L.img];
    if (L.on && ready(im)) { const h = R * 2 * 1.08 * L.zoom, w = im.naturalWidth / im.naturalHeight * h; ctx.globalAlpha = Math.min(1, L.glow * 2);
      ctx.drawImage(im, x - w / 2 - (L.pan || 0) * w - (L.fx - .5) * w * (L.zoom - 1) / L.zoom, y - h / 2 - (L.fy - .5) * h * (L.zoom - 1) / L.zoom, w, h); ctx.globalAlpha = 1;
      if (L.freeze) { ctx.fillStyle = 'rgba(229,35,47,.18)'; ctx.fillRect(x - R, y - R, R * 2, R * 2); } }
    else { ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(x - R, y - R, R * 2, R * 2); }
    ctx.restore();
    ctx.save(); if (L.on || flash) { ctx.shadowColor = L.freeze ? '#FF3B3B' : flash ? '#7FD3FF' : '#FFE27A'; ctx.shadowBlur = 34 * Math.max(L.glow, flash * 1.6); }
    if (ready(IMG.lens_rim)) { const ro = R * RIM * (IMG.lens_rim.naturalWidth / (IMG.lens_rim.naturalWidth - 5)); ctx.drawImage(IMG.lens_rim, x - ro, y - ro, ro * 2, ro * 2); }   /* the 3D gold rim */
    ctx.restore();
    if (L.freeze) { ctx.lineWidth = 7; ctx.strokeStyle = '#E5232F'; ctx.beginPath(); ctx.arc(x, y, R + 1, 0, 7); ctx.stroke(); }
  };
  const lensMarks = () => { const x = L.x, y = L.y - bob;
    if (L.freeze) { const bx = x + R * 1.08, by = y - R * 1.08;   /* on the rim, not on the boy's face */ ctx.save(); ctx.beginPath(); ctx.arc(bx, by, 38 * (1 + Math.sin(clock * 8) * .06), 0, 7); ctx.fillStyle = '#E5232F'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke(); ctx.fillStyle = '#fff'; ctx.font = '900 60px Tajawal'; ctx.textAlign = 'center'; ctx.fillText('!', bx, by + 21); ctx.restore(); }
  };
  scene = {
    update(dt) { scroll -= speed * dt; if (sign) sign.x += speed * dt; L.glow = L.on ? Math.min(1, L.glow + dt * 2.5) : Math.max(0, L.glow - dt * 3); flash = Math.max(0, flash - dt * 1.6);
      { const st = L.show && !intro && speed === 0, c = sLens(); slens.style.display = st ? 'grid' : 'none'; if (st) { slens.style.left = c.x - RS + 'px'; slens.style.top = c.y - RS + 'px'; } const sp = ui.querySelector('.slstrip'); if (sp) { sp.style.left = c.x + 'px'; sp.style.top = c.y + RS * RIM + 6 + 'px'; if (!st) sp.style.display = 'none'; } } L.shake = Math.max(0, L.shake - dt * 1.5); },
    draw() {
      if (intro) { cover('bg_school'); sprite('pair_back', 640, F, 450, { shadow: true }); return; }   /* the opening: the pair, big, facing the school (teacher) */
      const im = IMG.bg_street2;
      if (ready(im)) { const w = im.naturalWidth / im.naturalHeight * H, o = ((scroll % (w * 2)) + w * 2) % (w * 2);   /* the street repeats, every second copy mirrored, so the edges always match */
        for (let i = -1; i < Math.ceil(W / w) + 2; i++) { const x = i * w - o; ctx.save(); if (((i % 2) + 2) % 2) { ctx.translate(x + w, 0); ctx.scale(-1, 1); ctx.drawImage(im, 0, 0, w, H); } else ctx.drawImage(im, x, 0, w, H); ctx.restore(); } }
      else cover('bg_side');
      if (gateIn > 0) { ctx.globalAlpha = Math.min(1, gateIn); cover('bg_gate'); ctx.globalAlpha = 1; }
      if (sign && !L.on) askSign(sign.x, Y + R * 2.6, 1.6);   /* a neutral «؟» sign at each station: the child decides (committee) */   /* big, on the pavement beside the street; its triangle comes under the lens (teacher) */
      const walking = speed > 0, f = ((clock * 8) | 0) % 4; bob = walking ? Math.abs(Math.sin(clock * 9)) * 6 : 0;
      if (L.show) drawLens();
      if (L.show) { if (judge && !red) { const g = greyHadi(); if (g) { const w = (g.naturalWidth || g.width) / (g.naturalHeight || g.height) * HH; ctx.drawImage(g, hx() - w / 2, F - bob - HH, w, HH); } else sprite(pose().k, hx(), F - bob, HH, { noKey: true }); } else sprite(pose().k, hx(), F - bob, HH, { noKey: true }); lensMarks(); }   /* neutral before the choice (committee: green looked like «safe») */   /* «هادي» holds the lens in his glove (the glass is see-through) */
      else sprite('hadi_talk', hx(), F - bob, HH * .8, { flip: true, noKey: true });
      if (walking || !L.show) { if (walking) sprite(ready(IMG.salem_bwalk0) ? `salem_bwalk${f}` : `k_walk${f}`, sx(), F - bob, SH); else if (ready(IMG.salem_stand_bag)) sprite('salem_stand_bag', sx(), F, SH * 1.02);   /* he keeps his bag on while walking and at the school (committee r8: «salem_bag» is the bag alone) */ else sprite('salem_talk', sx(), F, SH * 1.02); }   /* the bag on, as at the stations (committee) */
      else {   /* Salem faces the child and raises his lens (teacher) */
        const c = sLens(), ro = RS * RIM * (ready(IMG.lens_rim) ? IMG.lens_rim.naturalWidth / (IMG.lens_rim.naturalWidth - 5) : 1);
        ctx.save(); ctx.shadowColor = '#7FD3FF'; ctx.shadowBlur = slens.innerHTML ? 26 : 0; if (ready(IMG.lens_rim)) ctx.drawImage(IMG.lens_rim, c.x - ro, c.y - ro, ro * 2, ro * 2); ctx.restore();
        sprite(SLP.k, sx(), F, SH);
      }
    },
  };
  /* the red danger box: six picture slots, under the HUD */
  const STN = SET().short ? L2S.filter(S => !['o_ball', 'o_door', 'o_family'].includes(S.img)) : L2S;   /* the teacher's «نسخة قصيرة»: 6 stations */
  window.__l2 = { L, R, STN };   /* only for the teacher's screenshots (test driver); the game does not read it */
  const NU = STN.filter(S => !S.safe).length;
  const box = add(`<div class="l2box" style="display:none"><div class="bx"><i class="lid"></i><b>!</b></div><div class="lbl">سُلُوكٌ غَيْرُ آمِنٍ</div><div class="count">${ar(0)}</div></div>`);
  const salemSay = async html => { say('salem', html, intro ? sx() : sx() + 20, intro ? F - SH * 1.02 - 6 : 214, { cls: 'cloud sm', side: intro ? undefined : 'left' }); await read(); };
  const hadiSay = async html => { say('lammah', html, hx() + 30, 214, { cls: 'cloud sm' }); await read(); };
  const on = (type, fn) => { stage.addEventListener(type, fn); CLEAN.push(() => stage.removeEventListener(type, fn)); return () => stage.removeEventListener(type, fn); };
  const handAt = (x, y) => add(`<div class="hand" style="left:${x - 24}px;top:${y - 10}px">👆</div>`);
  /* the child drags «هادي»'s lens along the street only; it snaps onto the danger sign */
  const lensTo = tx => new Promise(res => {
    const near = p => Math.hypot(p.x - L.x, p.y - L.y) < R + 40; let drag = null;
    const hand = handAt(L.x, L.y + 40), anim = setInterval(() => { if (!hand.isConnected) return clearInterval(anim); const k = (clock * .6) % 1; hand.style.left = (L.x + (tx - L.x) * k - 24) + 'px'; }, 30);
    const done = () => { offD(); offM(); offU(); hand.remove(); stage.style.cursor = ''; res(); };
    const offD = on('pointerdown', ev => { const p = toStage(ev); if (near(p)) { drag = { dx: p.x - L.x }; hand.remove(); } });
    const offM = on('pointermove', ev => { const p = toStage(ev); if (!drag) { stage.style.cursor = near(p) ? 'grab' : ''; return; } L.x = clamp(p.x - drag.dx, R + 30, 975 - 250 - R * RIM * .85 + (HOLDP.green.fx - .5) * HOLDP.green.ar * HH); if (Math.abs(L.x - tx) < 70) { L.x = tx; done(); } });
    const offU = on('pointerup', () => { drag = null; });
  });
  /* click on the danger inside the picture (a wide circle); a wrong click only wobbles the lens */
  const findHot = (S, showHand) => new Promise(res => {
    const hp = () => ({ x: L.x + (S.hot[0] - .5) * R * 2 * 1.08 * (4 / 3), y: L.y + (S.hot[1] - .5) * R * 2 * 1.08 });
    let hand = null, miss = 0; const help = () => { if (!hand) hand = handAt(hp().x, hp().y); };
    const tm = showHand ? setTimeout(help, 6000) : 0;   /* the child looks first; the hand comes later (committee) */
    const off = on('pointerdown', ev => { const p = toStage(ev), h = hp(); if (Math.hypot(p.x - L.x, p.y - L.y) > R) return;
      if (Math.hypot(p.x - h.x, p.y - h.y) < S.hot[2] * R * 2.4) { off(); clearTimeout(tm); hand?.remove(); res(); } else { L.shake = .6; if (++miss >= 2 && showHand) help(); } });
  });
  /* the scene moves towards the danger, then freezes before it */
  const playToFreeze = async S => { L.fx = S.hot[0]; L.fy = S.hot[1]; const t0 = performance.now();
    await until(() => { const k = Math.min(1, (performance.now() - t0) / 900); L.zoom = 1 + .45 * k * k; L.shake = k > .6 ? .5 : 0; return k >= 1; }); L.freeze = 1; L.shake = 0; red = true; };
  /* a card the child drags (wide drop zone; it slides back if missed) */
  const dragCard = (html, cls, home, inside, to) => new Promise(res => {
    const el = add(`<div class="l2card ${cls}" style="left:${home.x}px;top:${home.y}px">${html}</div>`); let drag = null, hand = null, anim = 0;
    const showHand = () => { hand = add(`<div class="hand drag">✋</div>`); const a = { x: home.x + el.offsetWidth - 40, y: home.y + 40 };   /* from the card's corner: the words stay visible */
      anim = setInterval(() => { if (!hand.isConnected) return clearInterval(anim); const k = (clock * .55) % 1, e = Math.min(1, k * 1.4); hand.style.left = a.x + (to.x - a.x) * e - 30 + 'px'; hand.style.top = a.y + (to.y - a.y) * e - 20 + 'px'; hand.style.opacity = k > .85 ? 0 : 1; }, 30); };
    const hideHand = () => { clearInterval(anim); hand?.remove(); hand = null; ui.querySelectorAll('.hand.drag').forEach(h => h.remove()); };   /* no guiding hand stays behind (seen in the final screenshots) */
    const a0 = { x: home.x + el.offsetWidth / 2, y: home.y + el.offsetHeight / 2 };
    const arrow = add(`<svg class="l2arrow" viewBox="0 0 ${W} ${H}" aria-hidden="true"><path d="M${a0.x} ${a0.y} Q ${(a0.x + to.x) / 2} ${Math.max(20, Math.min(a0.y, to.y) - (to.y < a0.y + 40 ? 230 : 60))} ${to.x} ${to.y}"/></svg>`);
    const go = async () => { el.onpointerdown = el.onpointermove = el.onpointerup = null; hideHand(); el.style.transition = 'left .5s, top .5s';   /* a second quick tap does nothing (it left a guiding hand behind) */ el.style.left = to.x - el.offsetWidth / 2 + 'px'; el.style.top = to.y - el.offsetHeight / 2 + 'px'; await wait(520); arrow.remove(); el.remove(); res(); };
    showHand();
    el.onpointerdown = ev => { const p = toStage(ev); drag = { dx: p.x - parseFloat(el.style.left), dy: p.y - parseFloat(el.style.top) }; el.classList.add('drag'); try { el.setPointerCapture(ev.pointerId); } catch (_) { /* still drags */ } hideHand(); };
    el.onpointermove = ev => { if (!drag) return; const p = toStage(ev); el.style.left = p.x - drag.dx + 'px'; el.style.top = p.y - drag.dy + 'px'; };
    el.onpointerup = ev => { if (!drag) return; const moved = Math.abs(parseFloat(el.style.left) - home.x) + Math.abs(parseFloat(el.style.top) - home.y) > 12; drag = null; el.classList.remove('drag'); const p = toStage(ev);
      if (!moved) { go(); return; }   /* a tap is enough: the card goes by itself (committee) */
      if (inside(p)) { arrow.remove(); el.remove(); res(); } else { el.style.transition = 'left .35s, top .35s'; el.style.left = home.x + 'px'; el.style.top = home.y + 'px'; setTimeout(() => { el.style.transition = ''; if (!hand) showHand(); }, 400); } };
  });
  const beat = async name => { if (window.__beat) await window.__beat(name); };   /* only for taking the teacher's screenshots */
  const walk = async until_ => { speed = 300; red = false; await until(until_); speed = 0; };
  (async () => {
    { const t = add(`<div class="l2title"><small>التَّحَدِّي الثَّانِي</small><b>اكْتَشِفْ سِرَّ السُّلُوكِ غَيْرِ الْآمِنِ</b></div>`); await wait(3200); t.remove(); }   /* the level's name in a speech cloud with small sun rays (teacher) */
    await wait(0); if (!alive()) return;
    say('salem', 'فِي الطَّرِيقِ إِلَى الْمَدْرَسَةِ سُلُوكَاتٌ آمِنَةٌ<br>وَسُلُوكَاتٌ غَيْرُ آمِنَةٍ. هَيَّا نَكْتَشِفْهَا!', 560, F - 500 - 6, { cls: 'cloud', side: 'left' }); await beat('opening'); await read(); hush(); if (!alive()) return;
    fade.classList.add('on'); await wait(300); intro = false; box.style.display = ''; fade.classList.remove('on'); await wait(300);
    L.show = true;
    await hadiSay('هَيَّا يَا سَالِمُ!<br>هَذِهِ عَدَسَتِي.'); await beat('lens'); if (!alive()) return;
    /* it starts from the card Salem carries from level 1 (teacher) */
    const runItem = K.unsafe.find(u => u.id === 'run'), oddM = K.measure.find(c => c.id === 'run'), oddPic = `assets/v5/${oddM.img}.jpg`;
    const oddText = `${esc(runItem.card).replace(' وَالسَّيَّارَاتُ', '<br>وَالسَّيَّارَاتُ').replace(/\.$/, '')}<b>؟</b>`;
    const strip = add(`<div class="slstrip" style="display:none">${oddText}</div>`);   /* the card's words under the lens */
    const showOdd = () => { slensSet(`<img src="${oddPic}" alt="">`, 'pic'); strip.style.display = ''; };
    showOdd();   /* the coloured picture of the card the truck did not take, in Salem's lens (teacher) */
    await salemSay('هَذِهِ الْبِطَاقَةُ<br>بَقِيَتْ مَعِي.'); await beat('card'); if (!alive()) return;
    await hadiSay('سَنَبْحَثُ عَنْ سِرِّهَا<br>فِي الطَّرِيقِ!'); await beat('search'); hush(); strip.style.display = 'none'; if (!alive()) return;
    /* the danger sign, big on the pavement: a sign of danger */
    /* the danger sign, raised big on the right in Salem's lens, while «هادي» says what it is (teacher) */
    slensSet(`<svg viewBox="-50 -50 100 100" width="140" height="140" aria-hidden="true"><circle r="44" fill="#FFC93C" stroke="#1b1b1b" stroke-width="5"/><text y="20" text-anchor="middle" font-family="Tajawal" font-weight="900" font-size="62" fill="#1b1b1b">؟</text></svg>`, 'sign'); await wait(400);
    await hadiSay('عِنْدَ هَذِهِ الْعَلَامَةِ<br>نَقِفُ وَنَنْظُرُ!'); await beat('sign'); hush(); slensSet(''); if (!alive()) return;
    for (const [i, S] of STN.entries()) {
      if (!alive()) return;
      const tx = 310 + (i % 3) * 90;   /* clear of the red box (committee) */ if (!sign) sign = { x: -120 }; await walk(() => sign.x >= tx); sign.x = tx; judge = true; await beat('walk' + i);   /* «هادي» stays green: the child decides first (committee) */
      look = true; const sayLens = () => say('lammah', 'اسْحَبْ عَدَسَتِي إِلَى<br>الْعَلَامَةِ الصَّفْرَاءِ 🟡', hx() + 30, 214, { cls: 'cloud sm' });
      let lt = 0; if (i < 3) sayLens(); else lt = setTimeout(sayLens, 6000);   /* from station 4 the moving hand alone; the words only if he waits (committee) */
      await lensTo(tx); clearTimeout(lt); hush(); sign = null; if (!alive()) return;
      L.img = S.img; L.pan = S.pan || 0; L.zoom = 1; L.freeze = 0; L.glow = 0; L.on = true;   /* pan: the light stays inside the lens */ strip.style.display = 'none'; await wait(500);   /* Salem's lens keeps «؟» until the child decides (committee) */
      await salemSay(S.salem); await beat('found' + i); if (!alive()) return;
      slensSet('؟', 'q');
      /* the child judges first: safe or not safe? «هادي» gives no sign before (committee) */
      say('salem', 'مَا رَأْيُكَ؟<br>آمِنٌ أَمْ غَيْرُ آمِنٍ؟', sx() + 20, 214, { cls: 'cloud sm', side: 'left' });
      let firstOk = false;
      await new Promise(res => {
        let first = true; const want = S.safe ? 'ok' : 'no';
        const pick = add(`<div class="bottom l2pick"><button class="btn big green" data-v="ok">✓ آمِنٌ</button><button class="btn big red" data-v="no">✗ غَيْرُ آمِنٍ</button></div>`);
        pick.querySelectorAll('button').forEach(btn => btn.onclick = () => {
          const ok = btn.dataset.v === want;
          if (first) { first = false; firstOk = ok; const k = K5(); if (!G.trial && k.first == null && !(k.l2 && S.img in k.l2)) { (k.l2 || (k.l2 = {}))[S.img] = ok; save(); } }   /* only the pupil's very first choice: no trial, no replay writes over it (committee r8) */   /* the first choice at each station, for the teacher */
          if (ok) { pick.remove(); res(); return; }
          btn.classList.remove('shake'); void btn.offsetWidth; btn.classList.add('shake'); L.shake = .6;   /* no penalty: look again */
          say('lammah', 'انْظُرْ جَيِّدًا إِلَى الصُّورَةِ!', hx() + 30, 214, { cls: 'cloud sm' });
        });
      });
      hush(); judge = false; if (!alive()) return;
      if (S.safe) {   /* a safe behaviour: «هادي» green, the book's «أفعل» sentence in Salem's lens; nothing goes into the red box */
        const sf = K.safe.find(x => x.id === S.safe); flash = 1; look = false;   /* «هادي» turns to the child, green */
        await wait(300); await hadiSay('أَحْسَنْتَ!<br>هَذَا سُلُوكٌ آمِنٌ.'); hush(); if (!alive()) return;
        slensSet(esc(sf.card).replace(' مِنَ ', '<br>مِنَ '), 'green'); await beat('says' + i);
        if (firstOk) await gainStar({ x: 120, y: 120 });   /* a star only for a right FIRST choice, safe or not (committee) */
        await salemSay('📖 اقْرَأْ فِي عَدَسَتِي.'); hush(); if (!alive()) return;   /* «التالي» always under a cloud (committee) */
        slensSet(''); L.on = false; L.img = null; look = false; await wait(400); continue;
      }
      red = true; await wait(300); await hadiSay('أَحْسَنْتَ!<br>هَذَا سُلُوكٌ غَيْرُ آمِنٍ.'); if (!alive()) return;
      say('lammah', 'أَيْنَ الْخَطَرُ فِي الصُّورَةِ؟<br>اضْغَطْ عَلَيْهِ!', hx() + 30, 214, { cls: 'cloud sm' }); await findHot(S, true); hush(); await playToFreeze(S); await beat('freeze' + i); if (!alive()) return;
      if (S.predict) {   /* p44: the child foresees the result aloud (the scene is frozen before it) */
        if (S.predict === true) { await salemSay('أَتَوَقَّعُ نَتِيجَةَ التَّصَرُّفِ غَيْرِ الصَّحِيحِ،<br>وَأُعَبِّرُ عَنْهُ شَفَوِيًّا.'); if (!alive()) return; }   /* p44, Salem's words (once, at the bike) */
        say('lammah', 'مَاذَا سَيَحْدُثُ لِلْوَلَدِ؟<br>🗣️ قُلْ جَوَابَكَ بِصَوْتِكَ.', hx() + 30, 214, { cls: 'cloud sm' });
        await wait(5000); await read(); hush(); if (!alive()) return;   /* time to say it aloud; the teacher listens (guide) */
      }
      const item = S.u && K.unsafe.find(u => u.id === S.u);
      G.oddCard = false;
      if (S.mystery) {   /* AFTER the child found the danger himself: he compares the card's picture in Salem's lens with «هادي»'s (ed-tech review) */
        showOdd(); await hadiSay('انْظُرْ إِلَى الصُّورَتَيْنِ!'); hush(); const c = sLens(); slensSet(''); strip.style.display = 'none';
        say('lammah', 'اسْحَبْ بِطَاقَةَ سَالِمٍ<br>إِلَى عَدَسَتِي!', hx() + 30, 214, { cls: 'cloud sm' });
        await dragCard(`<img src="${oddPic}" alt="">`, 'phrase pic glow', { x: c.x - 80, y: c.y - 60 }, p => Math.hypot(p.x - L.x, p.y - L.y) < R + 120, { x: L.x, y: L.y }); hush();
        flash = 1; showOdd(); await salemSay('هَذَا مِثْلُ بِطَاقَتِي!'); await beat('matched'); hush(); strip.style.display = 'none'; if (!alive()) return;
      }
      slensSet('');
      if (item) slensSet(item.from.replace(' فِي ', '<br>فِي ').replace(' مِنْ ', '<br>مِنْ ').replace(' وَالسَّيَّارَاتُ', '<br>وَالسَّيَّارَاتُ'), 'red'); else if (S.tsay) slensSet(S.tsay, 'red'); else slensSet('!', 'bang');   /* p47 pictures: the teacher's sentence */
      await beat('says' + i); await salemSay(item ? '📖 اقْرَأْ فِي عَدَسَتِي.' : S.tsay ? 'اقْرَأْ فِي عَدَسَتِي.' : 'انْظُرْ إِلَى عَدَسَتِي!'); hush(); if (!alive()) return;
      if (S.p41) {   /* p41: when to cross, in two short clouds, with the two lights in Salem's lens */
        slensSet(`<svg viewBox="0 0 120 100" width="150" height="125" aria-hidden="true"><rect x="8" y="10" width="44" height="80" rx="10" fill="#222"/><circle cx="30" cy="32" r="13" fill="#444"/><rect x="21" y="52" width="18" height="26" rx="5" fill="#3FD15A"/><rect x="68" y="4" width="44" height="92" rx="10" fill="#222"/><circle cx="90" cy="24" r="12" fill="#E5232F"/><circle cx="90" cy="50" r="12" fill="#444"/><circle cx="90" cy="76" r="12" fill="#444"/></svg>`, 'sign');
        await salemSay('أَعْبُرُ الطَّرِيقَ عِنْدَمَا تَكُونُ<br>إِشَارَةُ الْمُشَاةِ بِاللَّوْنِ الْأَخْضَرِ،'); if (!alive()) return;
        await salemSay('وَإِشَارَةُ السَّيَّارَاتِ<br>بِاللَّوْنِ الْأَحْمَرِ.'); hush(); slensSet(''); if (!alive()) return; }   /* Salem's words (he says «أنا») */
      box.classList.add('hot'); const sayBox = () => say('lammah', 'اسْحَبِ الْبِطَاقَةَ إِلَى<br>الصُّنْدُوقِ الْأَحْمَرِ فِي الْأَسْفَلِ ⬇', hx() + 30, 214, { cls: 'cloud sm' });
      let bt = 0; if (found < 2) sayBox(); else bt = setTimeout(sayBox, 6000);
      await dragCard(`<img src="${MANIFEST[S.img]}" alt="">${item ? `<p>${esc(item.card)}</p>` : S.tcard ? `<p>${esc(S.tcard)}</p>` : ''}`, 'small', { x: 54, y: 236 }, p => p.y > 450 && p.x < 320, { x: 120, y: 578 }); clearTimeout(bt); hush();   /* above the box, clear of «هادي» */   /* beside the box, below the cloud */   /* a wide, magnetic drop zone round the box */
      slensSet(''); box.classList.remove('hot'); box.classList.remove('got'); void box.offsetWidth; box.classList.add('got');
      found++; box.querySelector('.count').textContent = ar(found);   /* the number only: «… of 6» would tell how many are left (committee) */
      if (item) { G.log.push({ kind: 'no', img: MANIFEST[S.img], text: item.card, page: item.page, from: true }); setPip(4 + ['bike', 'nobelt', 'distract', 'run'].indexOf(S.u), 'r'); }
      else G.log.push({ kind: 'no', img: MANIFEST[S.img], text: S.tcard || '', page: 47, tw: !!S.tcard });   /* the ball and the door: the picture of p47 in the log too */
      await beat('boxed' + i); if (firstOk) await gainStar({ x: 120, y: 120 });
      L.on = false; L.freeze = 0; L.img = null; red = false; look = false; await wait(400);
    }
    /* they reach the school */
    L.show = false; speed = 300; for (let k = 0; k < 40; k++) { gateIn += .025; await wait(40); } speed = 0; if (!alive()) return;
    await hadiSay('أَحْسَنْتَ!'); await hadiSay('مَيَّزْتَ السُّلُوكَ الْآمِنَ<br>مِنَ السُّلُوكِ غَيْرِ الْآمِنِ!');   /* two short clouds (proofreader) */ if (!alive()) return;
    await gainKey('r', { x: 640, y: 330 });   /* the silver key: the reward of level 2 (the HUD shows bronze, silver, then gold) */
    await salemSay('وَصَلْنَا إِلَى الْمَدْرَسَةِ!'); await beat('school'); hush();
    go(bagScene);
  })();
}

/* ================= the end of level 2: «حقيبة سالم الذهبية» (teacher + Claude, 29 Oct 2026)
   At the school gate Salem puts his school bag down: a GREEN pocket (circle, «سُلُوكٌ آمِنٌ») and a RED pocket (triangle, «سُلُوكٌ غَيْرُ آمِنٍ»).
   The child drags the green truck of level 1 into the green pocket and the red danger box of level 2 (in Salem's lens) into the red pocket.
   The full bag closes; its gold zip-pull becomes the GOLD key that opens door 3. «هادي» is with them all the way into the class. */
const BAGP = { ar: .904 };   /* salem_bag2.webp (for the class) */
/* Salem from behind, the bag on his back (salem_back_bag.webp): pockets and zip as fractions of the picture */
const BACKP = { ar: .348, green: [.33, .465], red: [.68, .465], zip: [.27, .325] };
function bagScene() {
  hud('danger'); const run = RUN, alive = () => RUN === run;
  const F = 706, SB = { x: 590, h: 660 }, HH = 440, HX = 1100, RH = 90;   /* «هادي» clear of the edge (committee) */
  const sw = () => BACKP.ar * SB.h, at = f => ({ x: SB.x - sw() / 2 + f[0] * sw(), y: F - SB.h + f[1] * SB.h });
  const hp = HOLDP.green, lens = () => ({ x: HX - RH * RIM * .85 + (hp.fx - .5) * hp.ar * HH, y: F - HH + (hp.fy + hp.ro) * HH - .5 * RH * RIM });
  let gG = 0, gR = 0;
  scene = {
    update(dt) { gG = Math.max(0, gG - dt * .8); gR = Math.max(0, gR - dt * .8); },
    draw() {
      cover('bg_gate');
      const c = lens(), ro = RH * RIM * (ready(IMG.lens_rim) ? IMG.lens_rim.naturalWidth / (IMG.lens_rim.naturalWidth - 5) : 1);
      ctx.save(); ctx.beginPath(); ctx.arc(c.x, c.y, RH, 0, 7); ctx.fillStyle = 'rgba(255,255,255,.95)'; ctx.fill(); ctx.restore();
      if (ready(IMG.lens_rim)) ctx.drawImage(IMG.lens_rim, c.x - ro, c.y - ro, ro * 2, ro * 2);
      sprite(hp.k, HX, F, HH, { noKey: true });   /* «هادي» (green) holds his lens */
      sprite('salem_back_bag', SB.x, F, SB.h);       /* Salem's back to us: the bag on his back (teacher) */
      for (const [g, col, f] of [[gG, '#3FD15A', BACKP.green], [gR, '#FF3B3B', BACKP.red]]) if (g > 0) { const q = at(f); ctx.save(); ctx.globalAlpha = Math.min(1, g) * .55; ctx.shadowColor = col; ctx.shadowBlur = 40; ctx.lineWidth = 8; ctx.strokeStyle = col; ctx.beginPath(); ctx.roundRect(q.x - sw() * .17, q.y - SB.h * .085, sw() * .34, SB.h * .17, 14); ctx.stroke(); ctx.restore(); }
    },
  };
  const say2 = (who, html) => say(who, html, who === 'salem' ? SB.x - 130 : HX - 40, 214, { cls: 'cloud sm', side: 'left' });   /* clear of Salem's head */
  /* the pocket names beside the bag: the truck's on the left, the lens's on the right (teacher's words) */
  const gl = add(`<div class="baglbl g side" style="left:${at(BACKP.green).x - 150}px;top:${at(BACKP.green).y - 46}px"><i>✓</i> شَاحِنَةُ<br>السُّلُوكِ الْآمِنِ</div>`);
  const rl = add(`<div class="baglbl r side" style="left:${at(BACKP.red).x + 96}px;top:${at(BACKP.red).y - 66}px"><i>!</i> صُنْدُوقُ<br>السُّلُوكِ<br>غَيْرِ الْآمِنِ</div>`);   /* three short lines: clear of «هادي»'s lens (committee r7) */
  const fly = (from, to, n) => { for (let k = 0; k < n; k++) { const m = add(`<div class="minicard plain" style="left:${from.x}px;top:${from.y}px"></div>`); setTimeout(() => { m.style.left = to.x - 14 + 'px'; m.style.top = to.y - 18 + 'px'; m.style.transform = 'scale(.35) rotate(20deg)'; m.style.opacity = '.15'; }, 60 + k * 110); setTimeout(() => m.remove(), 900 + k * 110); } };
  /* drag into the right pocket (a wide area); the wrong pocket sends it back and the right pocket flashes */
  const pack = (el, home, good, bad, onIn, flashGood) => new Promise(res => {
    /* a moving hand and a dashed arrow show the whole way to the pocket, again and again; a tap is enough too (teacher) */
    const a = { x: home.x + el.offsetWidth / 2, y: home.y + el.offsetHeight / 2 }, t = at(good); let drag = null, hand = null, anim = 0;
    const arrow = add(`<svg class="l2arrow" viewBox="0 0 ${W} ${H}" aria-hidden="true"><path d="M${a.x} ${a.y} Q ${t.x} ${a.y} ${t.x} ${t.y}"/></svg>`);   /* along, then up into the pocket: clear of the labels (committee) */
    const showHand = () => { hand = add(`<div class="hand drag">✋</div>`); anim = setInterval(() => { if (!hand.isConnected) return clearInterval(anim); const k = (clock * .5) % 1, e = Math.min(1, k * 1.4), q = 1 - e;
      const x = q * q * a.x + 2 * q * e * t.x + e * e * t.x, y = q * q * a.y + 2 * q * e * a.y + e * e * t.y; hand.style.left = x - 30 + 'px'; hand.style.top = y - 20 + 'px'; hand.style.opacity = k > .85 ? 0 : 1; }, 30); };
    const hideHand = () => { clearInterval(anim); hand?.remove(); hand = null; };
    const done = () => { hideHand(); arrow.remove(); el.remove(); onIn(); res(); };
    showHand();
    el.onpointerdown = ev => { const p = toStage(ev); drag = { dx: p.x - parseFloat(el.style.left), dy: p.y - parseFloat(el.style.top), x0: p.x, y0: p.y }; el.classList.add('drag'); try { el.setPointerCapture(ev.pointerId); } catch (_) { /* still drags */ } hideHand(); };
    el.onpointermove = ev => { if (!drag) return; const p = toStage(ev); el.style.left = p.x - drag.dx + 'px'; el.style.top = p.y - drag.dy + 'px'; };
    el.onpointerup = ev => { if (!drag) return; const p = toStage(ev), tap = Math.hypot(p.x - drag.x0, p.y - drag.y0) < 12; drag = null; el.classList.remove('drag'); const d = f => Math.hypot(p.x - at(f).x, p.y - at(f).y);
      if (tap) { el.onpointerdown = el.onpointermove = el.onpointerup = null; el.style.transition = 'left .6s, top .6s, transform .6s'; el.style.left = t.x - el.offsetWidth / 2 + 'px'; el.style.top = t.y - el.offsetHeight / 2 + 'px'; el.style.transform = 'scale(.4)'; setTimeout(done, 620); return; }
      if (d(good) < 130 && d(good) <= d(bad)) { done(); return; }
      el.style.transition = 'left .4s, top .4s'; el.style.left = home.x + 'px'; el.style.top = home.y + 'px'; setTimeout(() => { el.style.transition = ''; if (!hand) showHand(); }, 450);
      flashGood(); };
  });
  (async () => {
    await wait(600); if (!alive()) return;
    say2('lammah', 'لِنُرَتِّبْ حَقِيبَةَ سَالِمٍ<br>قَبْلَ أَنْ نَدْخُلَ!'); await read(); hush(); if (!alive()) return;
    /* 1. the truck of level 1 comes in, with its safe cards */
    const tHome = { x: 40, y: 430 }, tr = add(`<div class="bagthing truck" style="left:-360px;top:${tHome.y}px"><img src="${MANIFEST.truck}" alt=""></div>`);
    requestAnimationFrame(() => requestAnimationFrame(() => { tr.style.transition = 'left 1.2s ease-out'; tr.style.left = tHome.x + 'px'; })); await wait(1300); tr.style.transition = '';
    say2('salem', 'اسْحَبْ شَاحِنَةَ السُّلُوكِ الْآمِنِ<br>إِلَى الْجَيْبِ الْأَخْضَرِ فِي حَقِيبَتِي!'); await wait(600);
    await pack(tr, tHome, BACKP.green, BACKP.red, () => { fly({ x: tHome.x + 130, y: tHome.y + 60 }, at(BACKP.green), Math.max(1, G.log.filter(c => c.kind === 'ok').length)); gG = 2; gl.classList.add('done'); setTimeout(() => gl.classList.add('dim'), 900); }, () => { gG = 1.2; gl.classList.remove('nope'); void gl.offsetWidth; gl.classList.add('nope'); }); hush(); if (!alive()) return;
    await wait(800);
    /* 2. the unsafe cards of level 2, in «هادي»'s lens */
    const c = lens(), rHome = { x: c.x - 62, y: c.y - 52 }, rb = add(`<div class="bagthing redbox" style="left:${rHome.x}px;top:${rHome.y}px"><div class="lid">!</div></div>`);
    say2('lammah', 'اسْحَبْ صُنْدُوقَ السُّلُوكِ غَيْرِ الْآمِنِ<br>إِلَى الْجَيْبِ الْأَحْمَرِ فِي الْحَقِيبَةِ!'); await wait(600);
    await pack(rb, rHome, BACKP.red, BACKP.green, () => { fly({ x: rHome.x + 60, y: rHome.y + 50 }, at(BACKP.red), 6); gR = 2; rl.classList.add('done'); setTimeout(() => rl.classList.add('dim'), 900); }, () => { gR = 1.2; rl.classList.remove('nope'); void rl.offsetWidth; rl.classList.add('nope'); }); hush(); if (!alive()) return;
    await wait(800);
    /* 3. the full bag closes with one click: its gold zip-pull becomes the GOLD key */
    say2('lammah', 'أَحْسَنْتَ!<br>أَغْلِقِ الْحَقِيبَةَ.'); const z = at(BACKP.zip);
    const zp = add(`<button class="zippull" style="left:${z.x - 34}px;top:${z.y - 20}px" aria-label="⚙️">${keyMetal('gold')}</button>`);
    const zh = add(`<div class="hand" style="left:${z.x - 10}px;top:${z.y + 30}px">👆</div>`);
    await new Promise(r => { zp.onclick = r; }); zh.remove(); hush(); if (!alive()) return;
    zp.classList.add('glow'); burst(z.x, z.y, ['#FFD23F', '#fff', '#F2B705'], 22); await wait(900);
    say2('salem', 'صَارَ السَّحَّابُ<br>مِفْتَاحًا ذَهَبِيًّا!'); zp.remove(); await gainKey('y', z); await read(); hush(); if (!alive()) return;
    say2('lammah', 'هَيَّا نَدْخُلِ الصَّفَّ مَعًا!');
    add(`<div class="bottom"><button class="btn big go pulse">افْتَحْ بَابَ التَّحَدِّي الثَّالِثِ ◀</button></div>`).querySelector('.go').onclick = () => go(() => doorPass(2, level3, { gold: true }));
  })();
}

// ================================================================== LEVEL 3 «تَحَدِّي التَّصْنِيفِ الذَّهَبِيِّ» — the measure (first attempt)
function level3() { level3Play(); }
/* level 3 classroom (teacher, 28 Oct 2026): a big smart board in the middle holds the whole activity; the teacher on the right,
   Salem with «هادي» standing on the left, and four boys seated with their backs to us, two on each side, looking at the board */
const BOARD3 = { x: 196, y: 22, w: 768, h: 458 };
function smartBoard() {
  const b = BOARD3, r = (x, y, w, h, rad) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, rad); };
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 22; ctx.shadowOffsetY = 8;
  r(b.x, b.y, b.w, b.h, 14); ctx.fillStyle = '#2b2f35'; ctx.fill(); ctx.restore();
  ctx.save(); r(b.x, b.y, b.w, b.h, 14); ctx.lineWidth = 3; ctx.strokeStyle = '#a9b0b8'; ctx.stroke();
  const g = ctx.createLinearGradient(0, b.y, 0, b.y + b.h); g.addColorStop(0, '#f7fbff'); g.addColorStop(1, '#e4eef7');
  r(b.x + 14, b.y + 14, b.w - 28, b.h - 28, 6); ctx.fillStyle = g; ctx.fill();
  ctx.fillStyle = '#1e2126'; r(b.x + b.w / 2 - 44, b.y - 12, 88, 14, 5); ctx.fill();          /* the camera bar on top */
  ctx.fillStyle = '#3a3f46'; r(b.x + b.w / 2 - 120, b.y + b.h - 2, 240, 12, 4); ctx.fill();   /* the pen tray under it */
  ctx.restore();
}
function level3Play() {
  hud('danger'); const T = { x: 1132, foot: 702, h: 440 };
  ui.classList.add('board3'); CLEAN.push(() => ui.classList.remove('board3'));
  scene = { draw() {
    if (ready(IMG.bg_class3)) cover('bg_class3'); else cover('bg_class');
    smartBoard();
    if (ready(IMG.pair_bag_class)) { if (G.sorting && ready(IMG.pair_bag_off)) sprite('pair_bag_off', 140, 650, 290, { noKey: true });   /* «هادي» with no light and a calm face while the child sorts (committee) */
      else sprite('pair_bag_class', 140, 650, 290, { noKey: true }); }   /* Salem (his bag on his back, hands empty) and «هادي» came into the class together (teacher) */
    else sprite('salem_lammah', 118, 642, 272, { noKey: true });
    if (ready(IMG.teacher)) sprite('teacher', T.x, T.foot, T.h, { flip: true });   /* he points left, toward the board */
    sprite('boys_l', 402, 783, 253, { shadow: false }); sprite('boys_r', 838, 781, 251, { shadow: false });   /* seated boys, backs to us, heads up */
  } };
  const tHead = { x: 1030, y: 282, max: 300 };   // the teacher's bubble sits above his head, right of the board, so it never covers the activity
  const cards = shuffle(K.measure.map(m => ({ ...m })));
  (async () => {
    await wait(500);
    /* the cards come out of Salem's bag onto the smart board, all white and unsorted: the child sorts them (level 3 is the measure) */
    for (let k = 0; k < 7; k++) { const m = add(`<div class="minicard plain" style="left:${70 + (k % 2) * 12}px;top:470px"></div>`);
      setTimeout(() => { m.style.left = 470 + k * 52 + 'px'; m.style.top = 250 + (k % 2) * 16 + 'px'; m.style.transform = 'scale(1.1) rotate(' + (k % 2 ? 6 : -6) + 'deg)'; m.style.opacity = '.1'; }, 60 + k * 140); setTimeout(() => m.remove(), 1000 + k * 140); }
    await wait(1500);
    say('teacher', 'مَرْحَبًا يَا بَطَلَ الْأَمَانِ! حَانَ وَقْتُ التَّحَدِّي الذَّهَبِيِّ!', tHead.x, tHead.y, { max: tHead.max });
    await new Promise(r => { add(`<div class="bottom"><button class="btn big go pulse">ابْدَأْ تَحَدِّيَ التَّصْنِيفِ ◀</button></div>`).querySelector('.go').onclick = e => { e.currentTarget.parentElement.remove(); ui.querySelector('.banner')?.remove(); r(); }; });
    say('teacher', 'صَنِّفِ الْبِطَاقَاتِ السَّبْعَ: اسْحَبْ كُلَّ بِطَاقَةٍ إِلَى صُنْدُوقِهَا.', tHead.x, tHead.y, { max: tHead.max });
    sortGame(cards, tHead);
  })();
}
function sortGame(cards, tHead) {
  if (K5().first == null && !G.trial && !K5().t3) { K5().t3 = Date.now(); save(); } G.sorting = true;
  ui.querySelector('.hud')?.classList.add('quiet');   /* the logs (with ✓ / ✗) are hidden during the measure */
  /* on the smart board (level 3 classroom) everything is smaller and inside the board's screen; the card size is set in keys.css (.board3) */
  const OnB = ui.classList.contains('board3');
  /* seven cards of «أفعل / لا أفعل» (p43): two rows on the board (4 + 3), right to left; in a box the cards stand side by side, fanned when many */
  const GEO = OnB ? { slot: i => i < 4 ? { x: 196 + (3 - i) * 192, y: 30 } : { x: 292 + (6 - i) * 192, y: 222 }, box: { safe: { x: 610, y: 400 }, unsafe: { x: 310, y: 400 } }   /* bigger cards (committee): wider steps, the boxes a little lower */, s: .6, k: () => .42, dx: (n, j) => 10 + j * Math.min(56, 150 / Math.max(1, n - 1)) }
                  : { slot: i => ({ x: 790 - i * 196, y: 92 }), box: { safe: { x: 640, y: 414 }, unsafe: { x: 150, y: 414 } }, s: 1, k: n => n > 2 ? .5 : .74, dx: (n, j) => n > 2 ? 26 + j * 86 : 40 + j * 160 };
  const SLOT = GEO.slot;            // the tray, right to left (the teacher stands at the right)
  /* an open 3D box (teacher): the opening and the side are drawn in SVG, the label sits in the middle of the front face */
  const box3 = (b, mark, label) => add(`<div class="box ${b}" data-b="${b}"><svg class="b3" viewBox="0 0 400 250" aria-hidden="true">
      <polygon class="side" points="360,80 400,30 400,200 360,250"/><polygon class="rim" points="0,80 40,30 400,30 360,80"/>
      <polygon class="hole" points="18,72 46,40 384,40 352,72" stroke-width="3"/></svg>
      <div class="b3f"><h3><i>${mark}</i> ${label}</h3></div></div>`);
  const boxes = { safe: box3('safe', '✓', 'سُلُوكٌ آمِنٌ'), unsafe: box3('unsafe', '✗', 'سُلُوكٌ غَيْرُ آمِنٍ') };
    const counter = add(`<div class="counter"></div>`);
  let sel = null, tries = 0, checkBtn = null;
  const placed = () => cards.filter(c => c.where).length;
  const layout = () => {
    const inBox = { safe: [], unsafe: [] };
    cards.forEach((c, i) => {
      const el = c.el;
      if (!c.where) { el.classList.remove('inbox'); const s = SLOT(i); el.style.left = s.x + 'px'; el.style.top = s.y + 'px'; el.style.transform = ''; return; }
      inBox[c.where].push(c); el.classList.add('inbox');
    });
    for (const b of ['safe', 'unsafe']) {
      const r = GEO.box[b], n = inBox[b].length, k = GEO.k(n);
      /* the cards stand in the box's opening: their foot is tucked just behind the front face (y 80 of 250), the label stays visible */
      inBox[b].forEach((c, j) => { c.el.style.transformOrigin = 'top left'; c.el.style.transform = `scale(${k})`; const h = c.el.offsetHeight * k; c.el.style.left = r.x + GEO.dx(n, j) + 'px'; c.el.style.top = r.y + 96 * GEO.s - h + 'px'; });
    }
    counter.innerHTML = `صَنَّفْتَ ${ar(placed())} مِنْ ${ar(cards.length)}`;
    if (placed() === cards.length && !checkBtn) { checkBtn = add(`<div class="bottom" style="${OnB ? "" : "bottom:2px;"}z-index:41"><button class="btn big green go pulse">تَحَقَّقْ مِنْ تَصْنِيفِي ✓</button></div>`); checkBtn.querySelector('.go').onclick = check; }
    if (placed() < cards.length && checkBtn) { checkBtn.remove(); checkBtn = null; }
  };
  const put = (c, where) => { if (c.locked) return; c.where = where; c.el.classList.remove('sel'); sel = null; layout(); };
  cards.forEach((c, i) => {
    const alt = 'n_' + c.id;   /* one neutral boy on all seven cards: the picture never tells the answer (committee, teacher) */
    const im = IMG[alt] && ready(IMG[alt]) ? IMG[alt] : IMG[c.img], src = ready(im) ? im.src : '';
    c.el = add(`<div class="scard" data-id="${c.id}" tabindex="0">${src ? `<img src="${src}" alt="">` : `<img alt="" style="background:#dfe6ec">`}<p>${esc(c.text)}</p></div>`);
    let drag = null;
    c.el.onpointerdown = e => { if (c.locked) return; const p = toStage(e); drag = { dx: p.x - parseFloat(c.el.style.left), dy: p.y - parseFloat(c.el.style.top), moved: 0 }; try { c.el.setPointerCapture(e.pointerId); } catch (_) { /* no capture: the drag still works */ } };
    c.el.onpointermove = e => { if (!drag) return; const p = toStage(e); drag.moved++; if (drag.moved > 2) { c.el.classList.add('drag'); c.el.style.transform = ''; c.el.style.left = p.x - drag.dx + 'px'; c.el.style.top = p.y - drag.dy + 'px'; const b = boxAt(p); Object.values(boxes).forEach(x => x.classList.toggle('over', x === b)); } };
    c.el.onpointerup = e => { if (!drag) return; const p = toStage(e), moved = drag.moved > 2; drag = null; c.el.classList.remove('drag'); Object.values(boxes).forEach(x => x.classList.remove('over'));
      if (!moved) { if (c.locked) return; sel = sel === c ? null : c; cards.forEach(o => o.el.classList.toggle('sel', o === sel)); return; }
      const b = boxAt(p); if (b) put(c, b.dataset.b); else { c.where = null; layout(); } };
    c.el.onkeydown = e => {
      if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); e.stopPropagation(); sel = c; cards.forEach(o => o.el.classList.toggle('sel', o === sel)); }
      else if (sel === c && (e.code === 'ArrowRight' || e.code === 'ArrowLeft')) { e.preventDefault(); put(c, e.code === 'ArrowRight' ? 'safe' : 'unsafe'); }   /* the safe box is on the right */
    };
  });
  const boxAt = p => Object.values(boxes).find(b => { const r = b.getBoundingClientRect(), sr = stage.getBoundingClientRect(); const x = (r.left - sr.left) / SCALE, y = (r.top - sr.top) / SCALE; return p.x > x && p.x < x + r.width / SCALE && p.y > y - 40 && p.y < y + r.height / SCALE; });
  Object.values(boxes).forEach(b => { b.onclick = () => { if (sel) put(sel, b.dataset.b); }; });
  layout();

  async function check() {
    checkBtn.remove(); checkBtn = null; tries++;
    const right = cards.filter(c => (c.where === 'safe') === c.safe);
    if (K5().first == null && !G.trial) { K5().first = right.length; K5().t3e = Date.now(); K5().picks = cards.map(c => ({ id: c.id, safe: c.safe, put: c.where })); if (K5().t0) K5().secs = Math.round((Date.now() - K5().t0) / 1000); save(); postResult(resultRow(K5(), new Date().toISOString().slice(0, 16).replace('T', ' '))); }
    ui.querySelector('.hud')?.classList.remove('quiet'); G.sorting = false;   /* the measure is saved: the logs may help now */
    cards.forEach(c => { if ((c.where === 'safe') === c.safe) { c.locked = true; c.el.classList.add('good'); } });
    right.forEach((c, j) => { const i = 8 + K.measure.findIndex(m => m.id === c.id); if (!G.pips[i]) setPip(i, 'y'); });
    if (right.length === cards.length) {
      for (const c of right) { const r = c.el.getBoundingClientRect(), sr = stage.getBoundingClientRect(); gainStar({ x: (r.left - sr.left) / SCALE + 60, y: (r.top - sr.top) / SCALE + 40 }); await wait(250); }
      say('teacher', tries === 1 ? `مُمْتَازٌ يَا بَطَلُ! ${ar(cards.length)} مِنْ ${ar(cards.length)}! صَنَّفْتَ جَمِيعَ السُّلُوكَاتِ تَصْنِيفًا صَحِيحًا!` : 'أَحْسَنْتَ! تَعَلَّمْتَ مِنْ مُحَاوَلَتِكَ، وَأَكْمَلْتَ التَّحَدِّيَ!', tHead.x, tHead.y, { max: tHead.max });
      confetti(60); await wait(1400); await gainKey('y', { x: 640, y: 300 }); await wait(900);
      add(`<div class="bottom"><button class="btn big go pulse">إِلَى الْكَنْزِ ◀</button></div>`).querySelector('.go').onclick = () => go(treasure);   /* they are already in the class: straight to the treasure (committee) */
      return;
    }
    say('teacher', tries >= 2 ? 'انْظُرْ إِلَى الرَّمْزِ<br>عَلَى الْبِطَاقَةِ:<br><img class="embi" src="assets/v5/emblem.webp" alt=""> = سُلُوكٌ آمِنٌ، 🔍 = سُلُوكٌ غَيْرُ آمِنٍ.' : 'مُحَاوَلَةٌ جَيِّدَةٌ!<br>بَعْضُ الْبِطَاقَاتِ تَحْتَاجُ إِلَى مُرَاجَعَةٍ.<br>تَذَكَّرْ مَا اكْتَشَفْتَهُ فِي الطَّرِيقِ.', tHead.x, tHead.y, { max: tHead.max });
    const wrong = cards.filter(c => !c.locked);
    // after the second try (the measure is already saved): a hint on each wrong card — the log where the child met it
    if (tries >= 2) wrong.forEach(c => { if (!c.el.querySelector('.hint')) c.el.insertAdjacentHTML('beforeend', `<span class="hint">${c.safe ? '<img class="embi" src="assets/v5/emblem.webp" alt="">' : '🔍'}</span>`); });
    wrong.forEach(c => { c.el.classList.remove('bad'); void c.el.offsetWidth; c.el.classList.add('bad'); });
    await wait(600); wrong.forEach(c => { c.where = null; }); layout();
  }
}

// ================================================================== ENDING: the treasure chest and the medal
function treasure() {
  hud('danger'); ui.querySelector('.hud')?.remove(); G.shieldGiven = false;
  let open = false, rise = 0; const CH = { x: 640, foot: 560, h: 300 };
  scene = {
    update(dt) { if (open) rise = Math.min(1, rise + dt * .8); },
    draw() {
      cover('bg_class', .5);
      if (open) { ctx.save(); ctx.translate(CH.x, CH.foot - CH.h * .7); for (let i = 0; i < 12; i++) { ctx.rotate(Math.PI / 6 + clock * .05); ctx.fillStyle = 'rgba(255,230,120,.25)'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-40, -420); ctx.lineTo(40, -420); ctx.fill(); } ctx.restore(); }
      const k = open ? pick('chest_open', 'chest') : pick('chest');
      if (k) sprite(k, CH.x, CH.foot, k === 'chest_open' ? CH.h * 1.24 : CH.h); else chestCode(CH, open);   /* the open picture is taller: same width */
      if (G.shieldGiven) sprite('k_cheer', 220, 712, 330); else salemShield(220, 712, 330, clock);   /* Salem holds up «درع الأمان», then gives it to the child */
    },
  };
  const locks = ['g', 'r', 'y'].map((c, i) => add(`<button class="lock" style="left:${CH.x + (1 - i) * 130 - 52}px;top:600px">${keySvg(KEYCOL[c])}</button>`));
  say('salem', 'اضْغَطْ عَلَى الْمَفَاتِيحِ الثَّلَاثَةِ لِنَفْتَحَ الْكَنْزَ!', 220, 380);
  let n = 0;
  locks.forEach((l, i) => l.onclick = async () => {
    l.classList.add('used'); const f = add(`<div class="flyer key" style="left:${CH.x + (1 - i) * 130 - 45}px;top:600px">${l.innerHTML}</div>`);
    const hx = CH.x + ([.78, .56, .34][i] - .5) * CH.h * 1.29, hy = CH.foot - CH.h * .35, lx = CH.x + (1 - i) * 130;   /* the keyholes on the chest picture */
    requestAnimationFrame(() => requestAnimationFrame(() => { f.style.transform = `translate(${hx - lx}px, ${hy - 645}px) rotate(90deg) scale(.45)`; }));
    await wait(800); f.remove(); burst(hx, hy, ['#FFC93C', '#fff']); n++;
    if (n === 3) { open = true; hush(); confetti(90); await wait(1600); medal(); }
  });
}
function chestCode(c, open) {
  const w = 300, h = 190, x = c.x - w / 2, y = c.foot - h;
  rr(x, y, w, h, 18, '#9a5b2a'); rr(x - 8, y - (open ? 120 : 70), w + 16, open ? 40 : 80, 30, '#b06b33');
  ctx.fillStyle = '#E5B53B'; ctx.fillRect(x, y + 60, w, 20); ctx.fillRect(c.x - 30, y + 30, 60, 80);
}
function medal() {
  const nm = state.name ? esc(state.name) : '';
  const src = ready(IMG.icon_medal) ? IMG.icon_medal.src : ready(IMG.medal) ? IMG.medal.src : '';
  const p = add(`<div class="panel medalp"><div class="phead">🏅 وِسَامُ بَطَلِ الْأَمَانِ</div>
    <div class="medrow">${src ? `<div class="medal"><img src="${src}" alt=""></div>` : '<div style="font-size:120px">🏅</div>'}<img class="gshield" src="${MANIFEST.emblem}" alt="دِرْعُ الْأَمَانِ"></div>
    ${nm ? `<p class="nm">${nm}</p>` : ''}<h1>بَطَلُ الْأَمَانِ</h1>
    <p>${esc(K.game.motto)}</p><p>${esc(K.ending.text)} ${pg(K.ending.page)}</p>
    <div class="more" style="display:none"><div class="vals">${K.values.list.map(v => `<span>${esc(v)}</span>`).join('')} ${pg(K.values.page)}</div>
    <div class="know"><b>هَلْ تَعْلَمُ؟</b> ${esc(K.know.text)} ${pg(K.know.page)}</div>
    <p>أَكْمَلْتَ التَّحَدِّيَاتِ الثَّلَاثَةَ بِنَجَاحٍ!</p></div>
    <div class="row mnext" style="justify-content:center"><button class="btn big green bk-next">التَّالِي ◀</button></div>
    <div class="row mend" style="justify-content:center;gap:16px;display:none"><button class="btn green again">🔁 الْعَبْ مَرَّةً أُخْرَى</button><button class="btn end">إِنْهَاءُ اللُّعْبَةِ</button></div></div>`);
  K5().done = true; save();
  say('salem', 'شُكْرًا لَكَ يَا صَدِيقِي!<br>أَنْتَ بَطَلُ الْأَمَانِ الْآنَ،<br>فَخُذِ الدِّرْعَ!', 140, 330, { max: 290 });
  /* Salem gives «درع الأمان» to the child: it flies from his raised hand into the medal panel (teacher, 29 Oct 2026) */
  setTimeout(() => { const gs = p.querySelector('.gshield'); if (!gs) return; const st = document.getElementById('stage').getBoundingClientRect(), r = gs.getBoundingClientRect();
    const to = { x: (r.left + r.width / 2 - st.left) / SCALE, y: (r.top + r.height / 2 - st.top) / SCALE };
    G.shieldGiven = true; const f = add(`<img class="flyshield" src="${MANIFEST.emblem}" alt="" style="left:150px;top:390px">`);
    requestAnimationFrame(() => requestAnimationFrame(() => { f.style.left = to.x + 'px'; f.style.top = to.y + 'px'; f.style.transform = 'translate(-50%, -50%) scale(.75) rotate(360deg)'; }));
    setTimeout(() => { f.remove(); gs.classList.add('got'); burst(to.x, to.y, ['#FFD23F', '#fff', '#2F86C8'], 18); hush(); say('salem', 'هُوَ لَكَ يَا بَطَلُ!', 140, 380, { max: 290 }); }, 1300); }, 2200);
  p.querySelector('.bk-next').onclick = () => { p.querySelector('.mnext').remove(); p.querySelector('.more').style.display = ''; p.querySelector('.mend').style.display = 'flex'; };
  p.querySelector('.again').onclick = () => { state.replay = true; save(); go(title); };   /* only this button keeps the name: a replay, not a new measure */
  p.querySelector('.end').onclick = () => exitGame(nm);
}
/* «إنهاء اللعبة»: say goodbye, then close the game. A browser lets a page close only a window it opened itself (or the installed app),
   so when it cannot, the screen says how to close it (teacher: the page stayed open). */
function exitGame(nm) {
  state.replay = false; save();   /* the next pupil finds an empty name box (committee final) */
  go(() => {
    scene = { draw() { cover('bg_school', .2); } };
    const p = add(`<div class="panel bye"><p style="font-size:40px">👋 مَعَ السَّلَامَةِ يَا ${nm || 'بَطَلُ'}!</p><p class="byehow" style="display:none;font-size:26px">انْتَهَتِ اللُّعْبَةُ. لِلْخُرُوجِ اضْغَطْ ✖ فِي أَعْلَى النَّافِذَةِ،<br>أَوِ اضْغَطْ <b dir="ltr">Ctrl + W</b>.</p></div>`);
    setTimeout(() => {
      try { if (document.fullscreenElement) document.exitFullscreen(); } catch (_) { /* not in full screen */ }
      try { window.close(); } catch (_) { /* not allowed: the hint below */ }
      setTimeout(() => { const h = p.querySelector('.byehow'); if (h) h.style.display = ''; }, 500);
    }, 1800);
  });
}

// ================================================================== TEACHER (PIN 2026): the measure, settings, jump to a level
function askPin(cb) { const d = document.getElementById('teach'), pin = document.getElementById('pin'); pin.value = ''; d.showModal(); d.onclose = () => { if (d.returnValue !== 'close' && pin.value === TEACHER_PIN) cb(); }; }
/* «دليل المعلم»: a 3D tri-fold brochure that unfolds over the whole stage (teacher + Codex, 29 Oct 2026).
   Right: the game; middle: how to play, the room, the teacher's role; left: the teacher's number and reading the result. */
function openGuide() {
  ui.querySelector('.tguide3')?.remove();
  const g = add(`<div class="tguide3" dir="rtl">
    <button class="gclose" aria-label="إِغْلَاقٌ">✖ إِغْلَاقٌ</button>
    <div class="fold">
      <section class="pn p1"><div class="pin-key" aria-hidden="true">🔑</div>
        <header class="h1row"><span class="seal">💎</span><div><h2>دَلِيلُ الْمُعَلِّمِ</h2><p class="tgname">مَفَاتِيحُ بَطَلِ الْأَمَانِ</p></div><span class="pill hp"><i>⏱️</i> ٤٥ د</span></header>
        <div class="pb">
          <div class="row"><i>📘</i><p><b>الدَّرْسُ:</b> الدِّرَاسَاتُ الِاجْتِمَاعِيَّةُ، الصَّفُّ الثَّانِي الِابْتِدَائِيُّ، الْوَحْدَةُ الْأُولَى، الدَّرْسُ الرَّابِعُ «أَحْمِي نَفْسِي عَلَى الطَّرِيقِ» (ص ٣٨–٤٨).</p></div>
          <div class="row"><i>👦</i><p><b>الْفِئَةُ الْمُسْتَهْدَفَةُ:</b> تَلَامِيذُ الصَّفِّ الثَّانِي (٧–٨ سَنَوَاتٍ)، لَعِبٌ فَرْدِيٌّ.</p></div>
          <div class="goal"><i>🎯</i><p><b>الْهَدَفُ:</b> أَنْ يُصَنِّفَ التِّلْمِيذُ سَبْعَةَ سُلُوكَاتٍ مُرُورِيَّةٍ مُصَوَّرَةٍ وَمَكْتُوبَةٍ إِلَى سُلُوكَاتٍ آمِنَةٍ وَغَيْرِ آمِنَةٍ تَصْنِيفًا صَحِيحًا، مِنْ خِلَالِ لُعْبَةٍ تَعْلِيمِيَّةٍ إِلِكْتُرُونِيَّةٍ تَفَاعُلِيَّةٍ فَرْدِيَّةٍ، خِلَالَ خَمْسٍ وَأَرْبَعِينَ دَقِيقَةً.</p></div>
          <div class="vmap" aria-label="قِيَمُ دَرْسِي"><svg class="vlines" viewBox="0 0 380 118" aria-hidden="true"><path d="M190 34 C190 60 64 52 64 84"/><path d="M190 34 L190 84"/><path d="M190 34 C190 60 316 52 316 84"/></svg><div class="vc">قِيَمُ دَرْسِي <small>ص٣٨</small></div><div class="vn v1"><span>🛡️</span><b>الْمَسْؤُولِيَّةُ</b></div><div class="vn v2"><span>🤝</span><b>الِاحْتِرَامُ</b></div><div class="vn v3"><span>🚦</span><b>الِالْتِزَامُ</b></div></div><div class="row"><i>🕘</i><p><b>خُطَّةُ الْحِصَّةِ (٤٥ د):</b> ٥ د دُخُولٌ وَتَشْغِيلٌ، ٣٥ د لَعِبٌ، ٥ د خِتَامٌ؛ بَعْدَ ص٤٣–٤٦، وَقَبْلَ «أُقَوِّمُ مَا تَعَلَّمْتُ» ص٤٧.</p></div><div class="row"><i>📏</i><p><b>الْقِيَاسُ (مُسْتَوَى التَّحْلِيلِ):</b> تَصْنِيفُ جُمَلِ ص٤٣ مَعَ صُوَرٍ جَدِيدَةٍ.</p></div>
        </div>
      </section>
      <section class="pn p2">
        <header><h3>🎮 طَرِيقَةُ اللَّعِبِ</h3></header>
        <div class="pb">
          <div class="lvl l1"><span class="m">🥉</span><p><b>«اكْتَشِفْ سِرَّ السُّلُوكِ الْآمِنِ»</b><br>يَكْتَشِفُ السُّلُوكَ الْآمِنَ، وَيُحَمِّلُهُ فِي شَاحِنَةِ السُّلُوكِ الْآمِنِ.</p><em>١٢ د</em></div>
          <div class="lvl l2"><span class="m">🥈</span><p><b>«اكْتَشِفْ سِرَّ السُّلُوكِ غَيْرِ الْآمِنِ»</b><br>يَحْكُمُ بِنَفْسِهِ فِي تِسْعَةِ مَوَاقِفَ: آمِنٌ أَمْ غَيْرُ آمِنٍ؟ وَيَكْشِفُ بِعَدَسَةِ هَادِي سِتَّةَ سُلُوكَاتٍ غَيْرِ آمِنَةٍ.</p><em>١٥ د</em></div>
          <div class="lvl l3"><span class="m">🥇</span><p><b>«تَحَدِّي التَّصْنِيفِ الذَّهَبِيُّ»</b><br>يُصَنِّفُ سَبْعَ بِطَاقَاتٍ إِلَى آمِنٍ وَغَيْرِ آمِنٍ.</p><em>٨ د</em></div>
          <p class="note">💬 لَا صَوْتَ فِي اللُّعْبَةِ؛ الْكَلَامُ فِي غُيُومٍ، وَزِرُّ 💬 يُعِيدُ قِرَاءَتَهَا.</p>
          <h4>🖥️ تَهْيِئَةُ الْمَكَانِ</h4>
          <ul class="chk"><li>حَاسُوبٌ وَفَأْرَةٌ لِكُلِّ تِلْمِيذٍ، وَمُتَصَفِّحُ Chrome أَوْ Edge.</li><li>افْتَحِ اللُّعْبَةَ مَرَّةً قَبْلَ الْحِصَّةِ، ثُمَّ تَعْمَلُ دُونَ إِنْتَرْنِتٍ.</li><li>مِلْءُ الشَّاشَةِ بِمِفْتَاحِ F11، وَلَا حَاجَةَ إِلَى سَمَّاعَاتٍ.</li><li>يَكْتُبُ التِّلْمِيذُ اسْمَهُ فِي الْوَاجِهَةِ.</li></ul><details class="labfold"><summary>⚙️ التَّشْغِيلُ فِي الْمُخْتَبَرِ، وَالنَّتَائِجُ، وَالْخُرُوجُ</summary><ul class="chk"><li><b>جُرِّبَتْ</b> مَعَ ثَلَاثَةِ تَلَامِيذَ مِنَ الصَّفِّ الثَّانِي، وَكَانَتِ التَّجْرِبَةُ نَاجِحَةً.</li><li><b>عِبَارَاتُ الْمُعَلِّمِ:</b> عِبَارَاتُ الْكُرَةِ وَالْبَابِ (ص٤٧) وَالنُّزُولِ مِنْ جِهَةِ الرَّصِيفِ (ص٣٩) مِنْ صِيَاغَةِ الْمُعَلِّمِ ✍️، وَلَيْسَتْ فِي بِطَاقَاتِ الْقِيَاسِ.</li><li><b>جَمْعُ النَّتَائِجِ:</b> ضَعْ مُجَلَّدَ اللُّعْبَةِ عَلَى مُجَلَّدِ الشَّبَكَةِ الْمُشْتَرَكِ لِتُجْمَعَ نَتَائِجُ كُلِّ الْأَجْهِزَةِ فِي مِلَفٍّ وَاحِدٍ.</li><li>لِلتَّشْغِيلِ فِي الْمُخْتَبَرِ: انْقُرْ نَقْرًا مُزْدَوِجًا عَلَى «تشغيل اللعبة.bat» فِي مُجَلَّدِ اللُّعْبَةِ، وَأَبْقِ نَافِذَتَهُ السَّوْدَاءَ مَفْتُوحَةً.</li><li><b>النَّتَائِجُ:</b> تُحْفَظُ كُلُّ نَتِيجَةٍ تِلْقَائِيًّا فِي الْمِلَفِّ «نتائج التلاميذ.csv» فِي مُجَلَّدِ اللُّعْبَةِ عَلَى كُلِّ جِهَازٍ، وَفِيهَا إِجَابَةُ كُلِّ بِطَاقَةٍ.</li><li><b>الْخُرُوجُ:</b> «إِنْهَاءُ اللُّعْبَةِ» يُغْلِقُ نَافِذَةَ التِّلْمِيذِ فَقَطْ؛ وَفِي آخِرِ الْحِصَّةِ اضْغَطْ «إِيقَافُ اللُّعْبَةِ عَلَى هَذَا الْجِهَازِ» فِي لَوْحَةِ الْمُعَلِّمِ.</li></ul></details>
          <div class="role"><i>🧑‍🏫</i><p><b>دَوْرُ الْمُعَلِّمِ:</b> يُرَاقِبُ وَلَا يُعْطِي الْإِجَابَةَ، وَيَسْتَمِعُ إِلَى التِّلْمِيذِ عِنْدَ سُؤَالِ التَّوَقُّعِ (ص٤٤) 🗣️؛ الْمُحَاوَلَةُ الْأُولَى فِي التَّحَدِّي الثَّالِثِ هِيَ الْمُعْتَمَدَةُ فِي الْقِيَاسِ. يُسَاعِدُ فِي اسْتِعْمَالِ الْفَأْرَةِ، وَيَقْرَأُ الْبِطَاقَةَ بِصَوْتِهِ لِمَنْ يَطْلُبُ دُونَ أَنْ يُلَمِّحَ إِلَى الْجَوَابِ.</p></div>
        </div>
      </section>
      <section class="pn p3">
        <header><h3>🧑‍🏫 لِلْمُعَلِّمِ</h3></header>
        <div class="pb">
          <form class="pinbox"><label>🔑 رَقْمُ الْمُعَلِّمِ</label><div><input type="password" inputmode="numeric" maxlength="6" autocomplete="off" aria-label="رَقْمُ الْمُعَلِّمِ"><button class="btn small" type="submit">دُخُولٌ ◀</button></div></form>
          <h4>📊 قِرَاءَةُ النَّتِيجَةِ</h4>
          <div class="band b7"><b>٧ مِنْ ٧</b><span>تَحَقَّقَ الْهَدَفُ.</span></div>
          <div class="band b5"><b>٥–٦</b><span>يَحْتَاجُ إِلَى تَعْزِيزٍ مَحْدُودٍ.</span></div>
          <div class="band b3"><b>٣–٤</b><span>يُرَاجِعُ بَعْضَ السُّلُوكَاتِ.</span></div>
          <div class="band b0"><b>٠–٢</b><span>يُعِيدُ الدَّرْسَ.</span></div>
          <div class="row"><i>👥</i><p><b>لِلتِّلْمِيذِ التَّالِي:</b> زِرُّ «تِلْمِيذٌ جَدِيدٌ» فِي اللَّوْحَةِ يَمْسَحُ الِاسْمَ وَالنَّتِيجَةَ.</p></div>
          <div class="row"><i>♿</i><p><b>مُرَاعَاةُ الْفُرُوقِ الْفَرْدِيَّةِ:</b> «خَطٌّ أَكْبَرُ» وَ«حَرَكَةٌ أَقَلُّ» فِي اللَّوْحَةِ.</p></div>
        </div>
      </section>
    </div></div>`);
  requestAnimationFrame(() => requestAnimationFrame(() => g.classList.add('open')));   /* the side panels unfold in 3D */
  const close = () => { g.classList.remove('open'); g.classList.add('closing'); setTimeout(() => g.remove(), 450); removeEventListener('keydown', esc_); };
  const esc_ = e => { if (e.key === 'Escape') close(); }; addEventListener('keydown', esc_);
  g.querySelector('.gclose').onclick = close;
  const f = g.querySelector('.pinbox'), inp = f.querySelector('input');
  f.onsubmit = e => { e.preventDefault(); if (inp.value === TEACHER_PIN) { close(); setTimeout(teacherPanel, 460); } else { inp.value = ''; f.classList.remove('nope'); void f.offsetWidth; f.classList.add('nope'); inp.focus(); } };
  setTimeout(() => inp.focus({ preventScroll: true }), 1100);
}
/* the result of the record now open goes into the history (name, first try, minutes, date) before a new record starts */
const mins = (a, b) => a && b ? Math.round((b - a) / 6000) / 10 : '';   /* minutes, one decimal */
function resultRow(k, at) { return { name: state.name || '—', first: k.first, secs: k.secs || 0, l2: k.l2 ? ar(Object.values(k.l2).filter(Boolean).length) + ' مِنْ ' + ar(Object.keys(k.l2).length) : '',   /* «٧ مِنْ ٩» (Excel read «7/9» as a date; committee r8, r9) */
  c1: mins(k.t0, k.t2), c2: mins(k.t2, k.t3), c3: mins(k.t3, k.t3e), cards: Object.fromEntries((k.picks || []).map(p => [p.id, (p.put === 'safe') === p.safe])), at }; }
/* the results table: one row a pupil, and one column for each of the seven cards (✓ / ✗), so the teacher sees what to explain again (committee r9) */
const csvHead = () => ['الاسم', 'المحاولة الأولى (من ' + K.measure.length + ')', 'التحدي الثاني: الإجابات الصحيحة من أول اختيار', 'التحدي الأول (د)', 'التحدي الثاني (د)', 'التحدي الثالث (د)', 'المدة حتى القياس (د)', 'التاريخ والساعة', ...K.measure.map(m => m.text)];
const csvCells = h => [h.name, h.first, h.l2 || '', h.c1 ?? '', h.c2 ?? '', h.c3 ?? '', h.secs ? Math.round(h.secs / 6) / 10 : '', h.at, ...K.measure.map(m => h.cards && m.id in h.cards ? (h.cards[m.id] ? '✓' : '✗') : '')];
const csvLine = cells => cells.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(',');
/* «تشغيل اللعبة.bat» writes every measure at once into «نتائج التلاميذ.csv» in the game folder: nothing to collect PC by PC (committee r9) */
function postResult(row) { try { fetch('/__result', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ head: csvLine(csvHead()), line: csvLine(csvCells(row)) }) }).catch(() => {}); } catch (_) { /* no lab launcher */ } }
function keepResult() { const k = state.k5; if (!k || k.first == null || k.kept) return; k.kept = true; (state.history || (state.history = [])).push(resultRow(k, new Date().toISOString().slice(0, 16).replace('T', ' '))); state.history = state.history.slice(-60); }
function teacherPanel() {
  const k = K5(), n = k.first;
  const T = K.measure.length;   /* 7 cards of «أفعل / لا أفعل» (teacher, 28 Oct 2026): 7 = mastery, 5–6 = a little support, 3–4 = review some, 0–2 = redo */
  const meaning = n == null ? 'لَمْ يُكْمِلِ التِّلْمِيذُ التَّحَدِّيَ بَعْدُ.' : n >= T ? 'تَحَقَّقَ الْهَدَفُ.' : n >= T - 2 ? 'يَحْتَاجُ إِلَى تَعْزِيزٍ مَحْدُودٍ.' : n >= 3 ? 'يُرَاجِعُ بَعْضَ السُّلُوكَاتِ.' : 'يُعِيدُ الدَّرْسَ.';
  const rows = (k.picks || []).filter(p => K.measure.some(x => x.id === p.id)).map(p => { const m = K.measure.find(x => x.id === p.id); return `<tr><td>${esc(m.text)}</td><td>${p.safe ? 'آمِنٌ' : 'غَيْرُ آمِنٍ'}</td><td>${p.put === 'safe' ? 'آمِنٌ' : 'غَيْرُ آمِنٍ'}</td><td>${(p.put === 'safe') === p.safe ? '✓' : '✗'}</td></tr>`; }).join('');
  const s = SET();
  const p = add(`<div class="panel teachp"><div class="phead">📋 لِلْمُعَلِّمِ ⚙️</div>
    <p><b>التِّلْمِيذُ:</b> ${esc(state.name || '—')}</p>
    <p><b>نَتِيجَةُ الْمُحَاوَلَةِ الْأُولَى:</b> ${n == null ? '—' : `${ar(n)} مِنْ ${ar(T)}`} — ${meaning}</p>
    <p><b>زَمَنُ اللَّعِبِ حَتَّى الْقِيَاسِ:</b> ${k.secs ? `${ar(Math.floor(k.secs / 60))} د ${ar(k.secs % 60)} ث` : '—'}</p>
    <p><b>الِاخْتِيَارُ الْأَوَّلُ فِي التَّحَدِّي الثَّانِي:</b> ${k.l2 ? `إِجَابَاتٌ صَحِيحَةٌ: ${ar(Object.values(k.l2).filter(Boolean).length)} مِنْ ${ar(Object.keys(k.l2).length)}` : '—'}</p>
    <p><b>زَمَنُ كُلِّ تَحَدٍّ:</b> ${[[k.t0, k.t2], [k.t2, k.t3], [k.t3, k.t3e]].map(([a, b], i) => `${['الْأَوَّلُ', 'الثَّانِي', 'الثَّالِثُ'][i]} ${a && b ? ar(Math.round((b - a) / 6000) / 10) + ' د' : '—'}`).join(' · ')}</p>
    ${(state.history || []).length ? `<details><summary>نَتَائِجُ التَّلَامِيذِ السَّابِقِينَ (${ar(state.history.length)})</summary><table><tr><th>الِاسْمُ</th><th>الْمُحَاوَلَةُ الْأُولَى</th><th>الْمُدَّةُ</th><th>التَّارِيخُ وَالسَّاعَةُ</th></tr>${state.history.slice().reverse().map(h => `<tr><td>${esc(h.name)}</td><td>${ar(h.first)} / ${ar(T)}</td><td>${h.secs ? ar(Math.round(h.secs / 6) / 10) + ' د' : '—'}</td><td dir="ltr">${h.at}</td></tr>`).join('')}</table></details>` : ''}
    ${(() => { const all = [...(state.history || []), ...(k.first != null && !k.kept ? [resultRow(k, '')] : [])], miss = {}; all.forEach(h => Object.entries(h.cards || {}).forEach(([id, ok]) => { if (!ok) miss[id] = (miss[id] || 0) + 1; })); const top = Object.entries(miss).sort((x, y) => y[1] - x[1])[0]; if (!top) return ''; const m = K.measure.find(x => x.id === top[0]); return m ? `<p><b>أَكْثَرُ بِطَاقَةٍ أَخْطَأَ فِيهَا التَّلَامِيذُ:</b> «${esc(m.text)}» (${ar(top[1])})</p>` : ''; })()}
    ${rows ? `<table><tr><th>الْبِطَاقَةُ</th><th>الصَّحِيحُ</th><th>اخْتِيَارُهُ</th><th></th></tr>${rows}</table>` : ''}
    <p><label><input type="checkbox" class="xl" ${s.font === 'XL' ? 'checked' : ''}> خَطٌّ أَكْبَرُ</label> &nbsp; <label><input type="checkbox" class="calmc" ${s.reduceMotion ? 'checked' : ''}> حَرَكَةٌ أَقَلُّ</label> &nbsp; <label><input type="checkbox" class="shortc" ${s.short ? 'checked' : ''}> نُسْخَةٌ قَصِيرَةٌ (سِتُّ مَحَطَّاتٍ فِي التَّحَدِّي الثَّانِي)</label></p>
    <div class="row" style="justify-content:center;gap:10px;flex-wrap:wrap">
      <button class="btn small" data-j="1">التَّحَدِّي ١</button><button class="btn small" data-j="2">التَّحَدِّي ٢</button><button class="btn small" data-j="3">التَّحَدِّي ٣</button><button class="btn small green" data-j="m3">انْقُلْ إِلَى الْقِيَاسِ</button><button class="btn small" data-j="4">الْكَنْزُ</button>
      <button class="btn small red" data-j="reset">تِلْمِيذٌ جَدِيدٌ</button><button class="btn small csv">⬇ تَنْزِيلُ النَّتَائِجِ</button><button class="btn small copy">📋 نَسْخُ النَّتَائِجِ</button><button class="btn small quit">⏻ إِيقَافُ اللُّعْبَةِ عَلَى هَذَا الْجِهَازِ</button><button class="btn small go">✓ إِغْلَاقٌ</button></div></div>`);
  const allRows = () => [...(state.history || []), ...(k.first != null && !k.kept ? [resultRow(k, 'الآن')] : [])];
  const table = sep => [csvHead(), ...allRows().map(csvCells)].map(r => r.map(v => sep === ',' ? '"' + String(v).replace(/"/g, '""') + '"' : v).join(sep)).join(sep === ',' ? '\r\n' : '\n');
  const download = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['\ufeff' + table(',')], { type: 'text/csv;charset=utf-8' })); a.download = 'نتائج-مفاتيح-بطل-الأمان-' + new Date().toISOString().slice(0, 10) + '.csv'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); };
  p.querySelector('.csv').onclick = e => { download(); e.target.textContent = '✓ نُزِّلَتْ (مُجَلَّدُ التَّنْزِيلَاتِ)'; };   /* a file Excel opens (committee r7: the copy button may fail on the lab PC) */
  p.querySelector('.copy').onclick = e => { const done = () => { e.target.textContent = '✓ نُسِخَتْ'; }; const fail = () => { download(); e.target.textContent = 'تَعَذَّرَ النَّسْخُ، فَنُزِّلَ مِلَفٌّ'; };
    try { navigator.clipboard ? navigator.clipboard.writeText(table('	')).then(done, fail) : fail(); } catch (_) { fail(); } };
  p.querySelector('.xl').onchange = e => { s.font = e.target.checked ? 'XL' : 'L'; save(); applySettings(); };
  p.querySelector('.calmc').onchange = e => { s.reduceMotion = e.target.checked; save(); applySettings(); };
  p.querySelector('.shortc').onchange = e => { s.short = e.target.checked; save(); };
  p.querySelector('.go').onclick = () => p.remove();
  p.querySelector('.quit').onclick = () => { keepResult(); save(); try { fetch('/__quit', { method: 'POST', keepalive: true }).catch(() => {}); } catch (_) { /* started without «تشغيل اللعبة.bat» */ } exitGame(state.name ? esc(state.name) : '');   /* the end of the lesson: the launcher stops and its black window closes (committee r9) */ };
  p.querySelectorAll('[data-j]').forEach(b => b.onclick = () => {
    const j = b.dataset.j;
    if (j === 'm3') { resetRun(); G.trial = false; G.keys.push('g', 'r'); [0, 1, 2].forEach(i => G.pips[i] = 'g'); [4, 5, 6, 7].forEach(i => G.pips[i] = 'r'); p.remove(); return go(level3); }   /* a late pupil goes to the measure; his first attempt still counts (committee final) */
    if (j === 'reset') { keepResult(); state.name = ''; state.k5 = { first: null, picks: null, done: false }; save(); return go(title); }
    resetRun(); G.trial = true; if (j >= 2) {   /* the teacher's jump: no measure is recorded */ G.keys.push('g'); [0, 1, 2].forEach(i => G.pips[i] = 'g'); } if (j >= 3) { G.keys.push('r'); [4, 5, 6, 7].forEach(i => G.pips[i] = 'r'); } if (j >= 4) G.keys.push('y');
    go([level1, level2, level3, treasure][j - 1]);
  });
}
function applySettings() { const s = SET(), b = document.body.classList; b.toggle('xl', s.font === 'XL'); b.toggle('calm', !!s.reduceMotion); }   /* only the teacher's «حركة أقل» (the Windows animation setting of the lab PCs froze Salem's wave and the glows) */

// ================================================================== boot
(async () => {
  try { const r = await fetch('data/keys.json'); if (!r.ok) throw new Error(r.status); K = await r.json(); }
  catch (_) { const l = document.getElementById('load'); if (l) l.innerHTML = '<div class="loaderr">تَعَذَّرَ تَشْغِيلُ اللُّعْبَةِ.<br>شَغِّلْهَا بِالنَّقْرِ الْمُزْدَوِجِ عَلَى الْمِلَفِّ «تشغيل اللعبة.bat» فِي مُجَلَّدِ اللُّعْبَةِ، ثُمَّ أَعِدِ الْمُحَاوَلَةَ.</div>'; return; }
  applySettings(); await loadAll(); { const l = document.getElementById('load'); l.classList.add('off'); setTimeout(() => l.remove(), 450); }
  requestAnimationFrame(loop);
  const q = new URLSearchParams(location.search), lv = q.get('lv');
  if (lv || q.has('end')) G.trial = true;   /* a level opened by its link is a trial: no measure (committee r9) */
  if (lv === '1') go(level1); else if (lv === '2') go(level2); else if (lv === '3') go(level3); else if (q.has('end')) go(treasure); else go(title);
})();
window.__game = { fitCloud, cloudFits, doorPass, feedback, farHeads, G, IMG, K: () => K, step(n = 30) { for (let i = 0; i < n; i++) { clock += 1 / 30; step(1 / 30); } }, go, title, level1, level2, level3, treasure, scene: () => scene, cabinGeo, cabinDraw, sc: { kerbScene, bagScene, streetScene, lightsScene, seatScene, beltScene, truckScene } };
