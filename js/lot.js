/* 无为山房 · 摇签 + 小说式自动逆天改命 + 纪事 */
function initLot() {
  const { lots, pickLine, wittyRetry, wittySuccess } = window.WuweiData;
  const { stats, persistStats } = window.WuweiStore;
  const { buildFateJourney } = window.WuweiFateStories;

  const lotStage = document.getElementById("lotStage");
  const lotInner = document.getElementById("lotInner");
  const lotBtn = document.getElementById("lotBtn");
  const copyLot = document.getElementById("copyLot");
  const chronicleEl = document.getElementById("fateChronicle");
  const chronicleArc = document.getElementById("fateChronicleArc");
  const fateHistoryEl = document.getElementById("fateHistory");
  let lastLot = null;
  let ritualBusy = false;
  let rewriteRound = 0;
  const GOOD_RANKS = new Set(["上上签", "上吉签"]);
  if (!Array.isArray(stats.fateLogs)) stats.fateLogs = [];

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
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

  function clearChronicle() {
    if (chronicleEl) chronicleEl.innerHTML = "";
    if (chronicleArc) chronicleArc.textContent = "等待下一场改命…";
  }

  function appendChronicle(chapter, arcMeta) {
    if (!chronicleEl) return;
    if (arcMeta && chronicleArc) {
      chronicleArc.textContent = `剧情线：${arcMeta.arcName} · ${arcMeta.arcTag}`;
    }
    const li = document.createElement("li");
    li.className = "fate-chapter enter";
    li.innerHTML =
      `<div class="fate-chapter-hd"><span>${chapter.index ? `第 ${chapter.index} 幕` : "序章"}</span><strong>${chapter.title}</strong></div>` +
      `<p>${chapter.text}</p>`;
    chronicleEl.appendChild(li);
    li.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  function renderFateHistory() {
    if (!fateHistoryEl) return;
    fateHistoryEl.innerHTML = "";
    const logs = stats.fateLogs || [];
    if (!logs.length) {
      fateHistoryEl.innerHTML = '<li class="history-empty">还没有改命实录。抽到下下签就会自动开演。</li>';
      return;
    }
    logs.slice(0, 6).forEach((log) => {
      const li = document.createElement("li");
      li.className = "fate-history-item";
      const summary = (log.chapters || []).map((c) => c.title).join(" → ");
      li.innerHTML =
        `<button type="button" class="fate-history-btn">` +
        `<strong>${log.arcName}</strong>` +
        `<span>${log.fromRank} → ${log.toRank}</span>` +
        `<time>${log.when}</time>` +
        `</button>` +
        `<div class="fate-history-body hidden">` +
        `<p class="fate-history-tag">${log.arcTag || ""} · ${log.rounds || 1} 回合</p>` +
        `<ol>${(log.chapters || []).map((c) => `<li><strong>${c.title}</strong> ${c.text}</li>`).join("")}</ol>` +
        `<p class="fate-history-end">终局：${log.toText || log.toRank}</p>` +
        `</div>`;
      const btn = li.querySelector("button");
      const body = li.querySelector(".fate-history-body");
      btn.addEventListener("click", () => {
        body.classList.toggle("hidden");
      });
      // unused summary kept for potential tooltip
      btn.title = summary;
      fateHistoryEl.appendChild(li);
    });
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

  function playFx(fx) {
    if (fx === "ash" || fx === "flash") spawnAshes(fx === "flash" ? 18 : 12);
    if (fx === "flash") {
      lotStage.classList.remove("flash-red");
      void lotStage.offsetWidth;
      lotStage.classList.add("flash-red");
    }
  }

  async function playChapter(chapter, journey) {
    lotStage.className = "lot-stage " + (chapter.mood || "rewriting");
    playFx(chapter.fx);
    const showOrb = chapter.fx === "orb";
    const showSeal = chapter.fx === "seal";
    lotInner.innerHTML =
      `<div class="ritual story-beat">` +
      (showOrb ? `<div class="ritual-orb charged"><span>炁</span></div>` : "") +
      (showSeal ? `<div class="ritual-seal slam">改</div>` : "") +
      `<p class="ritual-kicker">${journey.arcName} · 第 ${chapter.index} 幕</p>` +
      `<p class="ritual-title">${chapter.title}</p>` +
      `<p class="ritual-desc">${chapter.text}</p>` +
      `</div>`;
    appendChronicle(chapter, journey);
    tapSound(chapter.fx === "seal" ? 500 : chapter.fx === "orb" ? 360 : 280);
    await wait(chapter.ms || 1400);
  }

  function showGoodLot(lot, fromRewrite, journeyLog) {
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
      if (journeyLog && chronicleArc) {
        chronicleArc.textContent = `完结：${journeyLog.arcName} · ${journeyLog.fromRank} → ${lot.rank}`;
      }
      WuweiBridge.addDao(3, "命已改。");
    }
    tapSound(fromRewrite ? 520 : 440);
    ritualBusy = false;
    lotBtn.disabled = false;
    lotBtn.textContent = fromRewrite ? "再摇一签" : "摇一签";
  }

  function showPlainLot(lot) {
    lotStage.className = "lot-stage";
    clearChronicle();
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
    lotBtn.textContent = "剧情改命中…";
    clearChronicle();
    let current = badLot;
    const allChapters = [];
    let lastJourney = null;

    // 开场亮一下坏签
    lotStage.className = "lot-stage ominous flash-red";
    lotInner.innerHTML =
      `<div class="ritual">` +
      `<p class="lot-rank bad">${badLot.rank}</p>` +
      `<p class="lot-text">${badLot.t}</p>` +
      `<p class="ritual-title">坏签降临</p>` +
      `<p class="ritual-desc">山房不认栽。正在为你抽取改命剧情线……</p>` +
      `</div>`;
    appendChronicle(
      { index: 0, title: "序章", text: `抽得「${badLot.rank}」：${badLot.t}。改命程序启动。` },
      { arcName: "即将开演", arcTag: "序" }
    );
    tapSound(260);
    await wait(1200);

    while (!GOOD_RANKS.has(current.rank)) {
      rewriteRound += 1;
      const journey = buildFateJourney({
        rank: current.rank,
        sign: current.t.slice(0, 18),
        round: rewriteRound,
        hero: "道友",
      });
      lastJourney = journey;
      for (const ch of journey.chapters) {
        await playChapter(ch, journey);
        allChapters.push({
          title: `${journey.arcName}·${ch.title}`,
          text: ch.text,
        });
      }

      const forceGood = rewriteRound >= 3 || Math.random() < 0.35 + rewriteRound * 0.3;
      current = pickLot(forceGood);

      if (!GOOD_RANKS.has(current.rank)) {
        const twist = {
          index: allChapters.length + 1,
          title: "番外：还不够好",
          mood: "ominous",
          fx: "flash",
          ms: 1300,
          text: `暂得「${current.rank}」。${pickLine(wittyRetry)} 剧情续写中……`,
        };
        await playChapter(twist, journey);
        allChapters.push({ title: twist.title, text: twist.text });
      }
    }

    const now = new Date();
    const when = `${now.getMonth() + 1}/${now.getDate()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const log = {
      when,
      arcName: lastJourney ? lastJourney.arcName : "逆天改命",
      arcTag: lastJourney ? lastJourney.arcTag : "",
      fromRank: badLot.rank,
      toRank: current.rank,
      toText: current.t,
      rounds: rewriteRound,
      chapters: allChapters,
    };
    const fateLogs = [log, ...(stats.fateLogs || [])].slice(0, 12);
    persistStats({
      rewrites: (stats.rewrites || 0) + rewriteRound,
      fateLogs,
      lastPath: "lot",
    });
    renderFateHistory();
    showGoodLot(current, true, log);
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
    const chapters = chronicleEl
      ? [...chronicleEl.querySelectorAll("li")].map((li) => li.innerText.replace(/\s+/g, " ").trim())
      : [];
    if (!rank || !text) {
      copyLot.textContent = "先摇一签";
      setTimeout(() => (copyLot.textContent = "复制签文"), 1000);
      return;
    }
    const extraLine = extra ? "\n" + extra.textContent.replace(/\s+/g, " ").trim() : "";
    const storyLine = chapters.length ? "\n【改命纪事】\n" + chapters.join("\n") : "";
    try {
      await navigator.clipboard.writeText(
        `【无为山房·${rank.textContent}】\n${text.textContent}${extraLine}${storyLine}\n——命数在自己手里`
      );
      copyLot.textContent = "已复制";
      setTimeout(() => (copyLot.textContent = "复制签文"), 1200);
    } catch {
      copyLot.textContent = "复制失败";
      setTimeout(() => (copyLot.textContent = "复制签文"), 1200);
    }
  });

  renderFateHistory();
}

window.initLot = initLot;
