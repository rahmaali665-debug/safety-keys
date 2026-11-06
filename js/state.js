// Game state + local persistence (this computer only; nothing is sent anywhere).
const KEY = 'ahmi-nafsi-v1';

const safe = {
  get() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; } },
  set(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* storage blocked: game still works */ } },
  clear() { try { localStorage.removeItem(KEY); } catch { /* ignore */ } },
};

const defaults = () => ({
  name: '',
  settings: { font: 'L', quality: 'auto', reduceMotion: false, timer: '10', colorSafe: false, walk: 'hold', stay: false },
  // per behavior id: { first: true|false|null, challenge: true|false|null }
  results: {},
  finished: false,
});

export const state = Object.assign(defaults(), safe.get() || {});

export function save() { safe.set(state); }

export function resetRun() {
  state.results = {};
  state.finished = false;
  save();
}

export function clearAll() {
  safe.clear();
  Object.assign(state, defaults());
}

export function recordFirst(id, ok) {
  const r = state.results[id] || (state.results[id] = { first: null, challenge: null });
  if (r.first === null) r.first = ok;   // only the first attempt counts
  save();
}

export function recordChallenge(id, ok) {
  const r = state.results[id] || (state.results[id] = { first: null, challenge: null });
  if (r.challenge === null || r.challenge === undefined) r.challenge = ok;   // the measure keeps the first attempt only
  save();
}

export function objectiveMet(behaviors) {
  return behaviors.every(b => state.results[b.id]?.challenge === true);
}

export const TEACHER_PIN = '2026';
