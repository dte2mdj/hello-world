/* 无为山房 · 跨板块总线：识破 → 放下 → 改命 → 固本 */
const WuweiBridge = {
  goto(detail) {
    window.dispatchEvent(new CustomEvent("wuwei:goto", { detail }));
  },

  addDao(delta, reason) {
    window.dispatchEvent(
      new CustomEvent("wuwei:dao", { detail: { delta, reason } })
    );
  },

  toast(msg) {
    let el = document.getElementById("daoToast");
    if (!el) {
      el = document.createElement("div");
      el.id = "daoToast";
      el.className = "dao-toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove("show"), 2200);
  },

  handleGoto(detail = {}) {
    const { section, prefills, game, autoStart, scamId, oracle } = detail;
    const { persistStats, stats } = window.WuweiStore;
    if (section) {
      persistStats({ lastPath: section });
      const target = document.getElementById(section);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    }

    if (section === "drop" && prefills) {
      const input = document.getElementById("worryInput");
      if (input) {
        input.value = prefills;
        setTimeout(() => input.focus(), 400);
      }
    }

    if (section === "games" && game) {
      const tab = document.querySelector(`.game-tab[data-game="${game}"]`);
      if (tab) tab.click();
      if (autoStart) {
        setTimeout(() => {
          if (game === "muyu") {
            const btn = document.getElementById("muyuBtn");
            if (btn) btn.focus();
          }
          if (game === "breathe") {
            const btn = document.getElementById("breatheStart");
            if (btn) btn.click();
          }
          if (game === "zuowang") {
            const btn = document.getElementById("zwStart");
            if (btn) btn.click();
          }
          if (game === "fish") {
            const btn = document.getElementById("fishStart");
            if (btn) btn.click();
          }
        }, 500);
      }
    }

    if (section === "oracle" && oracle) {
      setTimeout(() => {
        const btn = document.getElementById("oracleBtn");
        if (btn) btn.click();
      }, 450);
    }

    if (section === "scams" && scamId && window.WuweiScams) {
      setTimeout(() => window.WuweiScams.openById(scamId), 450);
    }
  },

  handleDao({ delta = 1, reason = "" } = {}) {
    const { stats, persistStats } = window.WuweiStore;
    const next = (stats.dao || 0) + delta;
    persistStats({ dao: next });
    const tpl = window.WuweiData.pickLine(window.WuweiData.daoToasts);
    const msg = tpl.replace("{n}", String(delta)) + (reason ? ` ${reason}` : "");
    this.toast(msg);
    tapSound(420);
  },

  init() {
    window.addEventListener("wuwei:goto", (e) => this.handleGoto(e.detail || {}));
    window.addEventListener("wuwei:dao", (e) => this.handleDao(e.detail || {}));
  },
};

window.WuweiBridge = WuweiBridge;
