/* 无为山房 · 摇签 + 自动逆天改命 */
function initLot() {
  const {
    lots, pickLine, wittyPo, wittyBurn, wittyQi, wittyQiTick, wittySeal, wittyRetry, wittySuccess,
  } = window.WuweiData;
  const { stats, persistStats } = window.WuweiStore;

  const lotStage = document.getElementById("lotStage");
  const lotInner = document.getElementById("lotInner");
  const lotBtn = document.getElementById("lotBtn");
  const copyLot = document.getElementById("copyLot");
  let lastLot = null;
  let ritualBusy = false;
  let rewriteRound = 0;
  const GOOD_RANKS = new Set(["上上签", "上吉签"]);

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function resetLotStage() {
    lotStage.className = "lot-stage";
    ritualBusy = false;
    lotBtn.disabled = false;
    lotBtn.textContent = "摇一签";
  }

  function spawnAshes(n = 14) {
    const layer = document.createElement("div");
    layer.className = "ritual-ashes";
    for (let i = 0; i < n; i++) {
      const s = document.createElement("span");
      s.style.left = 20 + Math.random() * 60 + "%";
      s.style.top = 45 + Math.random() * 30 + "%";
      s.style.animationDelay = Math.random() * 0.35 + "s";
      s.style.background = Math.random() > 0.5
        ? "rgba(196,92,72,0.75)"
        : "rgba(196,163,90,0.7)";
      layer.appendChild(s);
    }
    lotStage.appendChild(layer);
    setTimeout(() => layer.remove(), 1400);
  }

  function pickLot(preferGood) {
    const pool = preferGood ? lots.filter((l) => GOOD_RANKS.has(l.rank)) : lots;
    let lot;
    do {
      lot = pool[Math.floor(Math.random() * pool.length)];
    } while (pool.length > 1 && lot === lastLot);
    lastLot = lot;
    return lot;
  }

  function renderRitualShell(stepIndex, title, desc, extraHtml = "") {
    const names = ["破妄", "焚旧", "聚炁", "封印"];
    const steps = names
      .map((n, i) => {
        let cls = "";
        if (i < stepIndex) cls = "done";
        if (i === stepIndex) cls = "on";
        return `<li class="${cls}">${n}</li>`;
      })
      .join("");
    lotInner.innerHTML =
      `<div class="ritual"><ul class="ritual-steps">${steps}</ul>${extraHtml}` +
      `<p class="ritual-title">${title}</p><p class="ritual-desc">${desc}</p></div>`;
  }

  function followChips(htmlHost, chips) {
    const box = document.createElement("div");
    box.className = "path-hint center";
    chips.forEach((c) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "path-chip";
      b.textContent = c.label;
      b.addEventListener("click", () => WuweiBridge.goto(c.detail));
      box.appendChild(b);
    });
    htmlHost.appendChild(box);
  }

  function showGoodLot(lot, fromRewrite) {
    lotStage.className = "lot-stage blessed";
    const note = fromRewrite
      ? `<p class="lot-advice"><strong>逆天改命成功</strong><br />${pickLine(wittySuccess)}<br />${lot.advice}</p>`
      : `<p class="lot-advice"><strong>护运一言</strong><br />${lot.advice}</p>`;
    lotInner.innerHTML =
      `<div class="lot-stick" id="lotStick" aria-hidden="true"></div>` +
      `<div id="lotResult">` +
      (fromRewrite ? `<div class="ritual-seal slam">命由<br />己造</div>` : "") +
      `<p class="lot-rank">${lot.rank}</p>` +
      `<p class="lot-text">${lot.t}</p>` +
      note +
      `</div>`;
    const host = document.getElementById("lotResult");
    if (fromRewrite) {
      followChips(host, [
        { label: "敲木鱼固本", detail: { section: "games", game: "muyu" } },
        { label: "调息安神", detail: { section: "games", game: "breathe", autoStart: true } },
        { label: "再识破一条", detail: { section: "scams" } },
      ]);
      WuweiBridge.addDao(3, "命已改。");
    }
    tapSound(fromRewrite ? 520 : 440);
    ritualBusy = false;
    lotBtn.disabled = false;
    lotBtn.textContent = fromRewrite ? "再摇一签" : "摇一签";
  }

  function showPlainLot(lot) {
    lotStage.className = "lot-stage";
    lotInner.innerHTML =
      `<div class="lot-stick" id="lotStick" aria-hidden="true"></div>` +
      `<div id="lotResult">` +
      `<p class="lot-rank">${lot.rank}</p>` +
      `<p class="lot-text">${lot.t}</p>` +
      `<p class="lot-advice"><strong>护运一言</strong><br />${lot.advice}</p>` +
      `</div>`;
    const host = document.getElementById("lotResult");
    followChips(host, [
      { label: "去功课固本", detail: { section: "games" } },
      { label: "求一悟", detail: { section: "oracle", oracle: true } },
    ]);
    tapSound(440);
    ritualBusy = false;
    lotBtn.disabled = false;
    lotBtn.textContent = "摇一签";
    WuweiBridge.addDao(1, "得签。");
  }

  async function runAutoRewrite(badLot) {
    ritualBusy = true;
    rewriteRound = 0;
    lotBtn.disabled = true;
    lotBtn.textContent = "自动改命中…";
    let current = badLot;

    while (!GOOD_RANKS.has(current.rank)) {
      rewriteRound += 1;
      lotStage.className = "lot-stage ominous flash-red";
      renderRitualShell(
        0,
        "破妄",
        `第 ${rewriteRound} 次改命。<br />${pickLine(wittyPo)}`,
        `<div class="lot-stick" id="lotStick"></div>` +
          `<p class="lot-rank bad">${current.rank}</p>` +
          `<p class="lot-text">${current.t}</p>`
      );
      tapSound(260);
      await wait(1300);

      lotStage.className = "lot-stage ominous";
      const textEl = lotInner.querySelector(".lot-text");
      const stick = document.getElementById("lotStick");
      const title = lotInner.querySelector(".ritual-title");
      const desc = lotInner.querySelector(".ritual-desc");
      const steps = lotInner.querySelectorAll(".ritual-steps li");
      steps.forEach((li, i) => {
        li.classList.toggle("done", i < 1);
        li.classList.toggle("on", i === 1);
      });
      if (title) title.textContent = "焚旧";
      if (desc) desc.innerHTML = pickLine(wittyBurn);
      if (textEl) textEl.classList.add("burn");
      if (stick) stick.classList.add("crack");
      spawnAshes(16);
      tapSound(220);
      await wait(1500);

      lotStage.className = "lot-stage rewriting";
      renderRitualShell(
        2,
        "聚炁",
        pickLine(wittyQi),
        `<div class="ritual-orb charged" id="qiOrb"><span>炁</span></div>` +
          `<div class="ritual-progress"><i id="qiBar"></i></div>` +
          `<p class="lot-hint" id="qiHint">聚炁中…</p>`
      );
      const bar = document.getElementById("qiBar");
      for (let p = 1; p <= 7; p++) {
        bar.style.width = (p / 7) * 100 + "%";
        document.getElementById("qiHint").textContent = wittyQiTick[p - 1];
        tapSound(280 + p * 28);
        await wait(240);
      }
      await wait(400);

      renderRitualShell(3, "封印", pickLine(wittySeal), `<div class="ritual-seal slam">改</div>`);
      spawnAshes(12);
      tapSound(480);
      await wait(1000);

      const forceGood = rewriteRound >= 3 || Math.random() < 0.35 + rewriteRound * 0.3;
      current = pickLot(forceGood);
      if (!GOOD_RANKS.has(current.rank)) {
        lotInner.innerHTML =
          `<div class="ritual">` +
          `<p class="lot-rank">${current.rank}</p>` +
          `<p class="lot-text">${current.t}</p>` +
          `<p class="ritual-title">还不够好</p>` +
          `<p class="ritual-desc">${pickLine(wittyRetry)}</p></div>`;
        tapSound(300);
        await wait(1300);
      }
    }

    persistStats({ rewrites: (stats.rewrites || 0) + rewriteRound, lastPath: "lot" });
    showGoodLot(current, true);
  }

  function getLotStick() {
    return document.getElementById("lotStick");
  }
  function getLotResult() {
    return document.getElementById("lotResult");
  }

  lotBtn.addEventListener("click", () => {
    if (ritualBusy) return;
    if (!getLotStick() || !getLotResult()) {
      lotInner.innerHTML =
        `<div class="lot-stick" id="lotStick" aria-hidden="true"></div>` +
        `<div id="lotResult"><p class="lot-hint">签筒在响……</p></div>`;
    }
    const stick = getLotStick();
    const result = getLotResult();
    lotStage.className = "lot-stage";
    ritualBusy = false;
    lotBtn.disabled = true;
    lotBtn.textContent = "摇签中…";
    stick.classList.remove("shaking", "crack");
    stick.style.opacity = "1";
    void stick.offsetWidth;
    stick.classList.add("shaking");
    result.innerHTML = '<p class="lot-hint">签筒在响……</p>';
    setTimeout(() => {
      const lot = pickLot(false);
      if (lot.rank === "下下签") {
        runAutoRewrite(lot);
        return;
      }
      showPlainLot(lot);
    }, 2200);
  });

  copyLot.addEventListener("click", async () => {
    const result = getLotResult() || lotInner;
    const rank = result.querySelector(".lot-rank");
    const text = result.querySelector(".lot-text");
    const extra = result.querySelector(".lot-advice, .ritual-desc");
    if (!rank || !text) {
      copyLot.textContent = "先摇一签";
      setTimeout(() => (copyLot.textContent = "复制签文"), 1000);
      return;
    }
    const extraLine = extra ? "\n" + extra.textContent.replace(/\s+/g, " ").trim() : "";
    try {
      await navigator.clipboard.writeText(
        `【无为山房·${rank.textContent}】\n${text.textContent}${extraLine}\n——命数在自己手里`
      );
      copyLot.textContent = "已复制";
      setTimeout(() => (copyLot.textContent = "复制签文"), 1200);
    } catch {
      copyLot.textContent = "复制失败";
      setTimeout(() => (copyLot.textContent = "复制签文"), 1200);
    }
  });
}

window.initLot = initLot;
