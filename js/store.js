/* 无为山房 · 本机存储与道行 */
const STORAGE_KEY = "wuwei-shanfang-v1";

const store = {
  load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  },
  save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },
  patch(partial) {
    const next = { ...this.load(), ...partial };
    this.save(next);
    return next;
  },
};

let stats = {
  drops: 0,
  muyu: 0,
  fishBest: 0,
  rewrites: 0,
  dao: 0,
  lastPath: "",
  history: [],
  fateLogs: [],
  ...store.load(),
};
if (!Array.isArray(stats.history)) stats.history = [];
if (!Array.isArray(stats.fateLogs)) stats.fateLogs = [];

function refreshNav() {
  const el = document.getElementById("navStat");
  if (!el) return;
  const dao = stats.dao || 0;
  const rw = stats.rewrites ? ` · 改命 ${stats.rewrites}` : "";
  el.textContent = `道行 ${dao} · 放下 ${stats.drops || 0} · 木鱼 ${stats.muyu || 0}${rw}`;
}

function persistStats(partial) {
  Object.assign(stats, partial);
  store.patch(partial);
  refreshNav();
}

window.WuweiStore = { store, stats, refreshNav, persistStats, STORAGE_KEY };
refreshNav();
