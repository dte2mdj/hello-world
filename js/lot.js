/* 无为山房 · 摇签 + 小说式自动逆天改命 + 纪事
 * 签台 = 固定高度剧场（动画/签面）；签笺 = 台下全文（签文/护运/联动）
 */
function initLot() {
  const { lots, pickLine, wittySuccess } = window.WuweiData;
  const { stats, persistStats } = window.WuweiStore;
  const { buildFateJourney } = window.WuweiFateStories;

  const lotStage = document.getElementById("lotStage");
  const lotInner = document.getElementById("lotInner");
  const lotSheet = document.getElementById("lotSheet");
  const lotBtn = document.getElementById("lotBtn");
  const copyLot = document.getElementById("copyLot");
  const chronicleEl = document.getElementById("fateChronicle");
  const chronicleArc = document.getElementById("fateChronicleArc");
  const fateLogEl = document.getElementById("fateLog");
  const fateHistoryEl = document.getElementById("fateHistory");
  let lastLot = null;
  let ritualBusy = false;
  let lastShownLot = null;
  const GOOD_RANKS = new Set(["上上签", "上吉签"]);
  const BAD_RANK = "下下签";
  if (!Array.isArray(stats.fateLogs)) stats.fateLogs = [];

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function setChronicleMode(mode) {
    if (!fateLogEl) return;
    fateLogEl.classList.toggle("is-writing", mode === "writing");
    fateLogEl.classList.toggle("has-chapters", mode === "done" || mode === "writing");
    if (mode === "idle") {
      fateLogEl.classList.remove("is-writing", "has-chapters");
    }
  }

  function clearSheet() {
    if (!lotSheet) return;
    lotSheet.innerHTML = "";
    lotSheet.classList.add("is-empty");
  }

  function fillSheet(html) {
    if (!lotSheet) return;
    lotSheet.innerHTML = html;
    lotSheet.classList.remove("is-empty");
  }

  function tubeHTML(extraClass) {
    const cls = extraClass ? `lot-tube ${extraClass}` : "lot-tube";
    return (
      `<div class="${cls}" id="lotStick" aria-hidden="true">` +
      `<div class="lot-tube-sticks" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>` +
      `<div class="lot-tube-body"><span class="lot-tube-band"></span><span class="lot-tube-label">签</span></div>` +
      `<div class="lot-tube-base"></div>` +
      `</div>`
    );
  }

  function setStageCaption(html, tubeClass) {
    lotInner.innerHTML =
      tubeHTML(tubeClass) +
      `<div id="lotStageCaption">${html}</div>`;
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
    if (!pool.length) return lots[0];
    let lot;
    let guard = 0;
    do {
      lot = pool[Math.floor(Math.random() * pool.length)];
      guard += 1;
    } while (pool.length > 1 && lot === lastLot && guard < 20);
    lastLot = lot;
    return lot;
  }

  function clearChronicle() {
    if (chronicleEl) chronicleEl.innerHTML = "";
    if (chronicleArc) chronicleArc.textContent = "等待下一场改命…";
    setChronicleMode("idle");
  }

  function appendChronicle(chapter, arcMeta) {
    if (!chronicleEl) return;
    setChronicleMode("writing");
    if (arcMeta && chronicleArc) {
      chronicleArc.textContent = `${arcMeta.arcName} · ${arcMeta.arcTag}`;
    }
    const li = document.createElement("li");
    li.className = "fate-chapter enter";
    li.innerHTML =
      `<div class="fate-chapter-hd"><span>${chapter.index ? `第 ${chapter.index} 幕` : "序章"}</span><strong>${chapter.title}</strong></div>` +
      `<p>${chapter.text}</p>`;
    chronicleEl.appendChild(li);
    chronicleEl.scrollTop = chronicleEl.scrollHeight;
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
    const kicker =
      chapter.index > 0
        ? `${journey.arcName} · 第 ${chapter.index} 幕`
        : `${journey.arcName} · 序章`;
    // 台内只演标题；正文进纪事卷轴，避免撑高/裁切
    lotInner.innerHTML =
      `<div class="ritual story-beat">` +
      (showOrb ? `<div class="ritual-orb charged"><span>炁</span></div>` : "") +
      (showSeal ? `<div class="ritual-seal slam">改</div>` : "") +
      `<p class="ritual-kicker">${kicker}</p>` +
      `<p class="ritual-title">${chapter.title}</p>` +
      `</div>`;
    appendChronicle(chapter, journey);
    tapSound(chapter.fx === "seal" ? 500 : chapter.fx === "orb" ? 360 : 280);
    await wait(chapter.ms || 1400);
  }

  function unlockLotBtn(label) {
    ritualBusy = false;
    lotBtn.disabled = false;
    lotBtn.textContent = label || "摇一签";
  }

  function showGoodLot(lot, fromRewrite, journeyLog) {
    lastShownLot = lot;
    lotStage.className = "lot-stage blessed";
    lotInner.innerHTML =
      (fromRewrite
        ? `<div class="ritual-seal slam">命由<br />己造</div>`
        : tubeHTML("drawn")) +
      `<div id="lotStageCaption"><p class="lot-rank">${lot.rank}</p></div>`;

    const note = fromRewrite
      ? `<p class="lot-advice"><strong>逆天改命成功</strong><br />${pickLine(wittySuccess)}<br />${lot.advice || ""}</p>`
      : `<p class="lot-advice"><strong>护运一言</strong><br />${lot.advice || ""}</p>`;
    fillSheet(
      `<p class="lot-text">${lot.t}</p>` + note
    );
    if (fromRewrite) {
      followChips(lotSheet, [
        { label: "敲木鱼固本", detail: { section: "games", game: "muyu" } },
        { label: "调息安神", detail: { section: "games", game: "breathe", autoStart: true } },
        { label: "再识破一条", detail: { section: "scams" } },
      ]);
      if (journeyLog && chronicleArc) {
        chronicleArc.textContent = `完结：${journeyLog.arcName} · ${journeyLog.fromRank} → ${lot.rank}`;
      }
      setChronicleMode("done");
      WuweiBridge.addDao(3, "命已改。");
    }
    tapSound(fromRewrite ? 520 : 440);
    unlockLotBtn(fromRewrite ? "再摇一签" : "摇一签");
  }

  function showPlainLot(lot) {
    lastShownLot = lot;
    lotStage.className = "lot-stage";
    clearChronicle();
    setStageCaption(`<p class="lot-rank">${lot.rank}</p>`, "drawn");
    fillSheet(
      `<p class="lot-text">${lot.t}</p>` +
      `<p class="lot-advice"><strong>护运一言</strong><br />${lot.advice || lot.remedy || ""}</p>`
    );
    followChips(lotSheet, [
      { label: "去功课固本", detail: { section: "games" } },
      { label: "求一悟", detail: { section: "oracle", oracle: true } },
    ]);
    tapSound(440);
    unlockLotBtn("摇一签");
    WuweiBridge.addDao(1, "得签。");
  }

  /**
   * 下下签：演完正文 → 强制落好签 → 再播收束。
   */
  async function runAutoRewrite(badLot) {
    ritualBusy = true;
    lotBtn.disabled = true;
    lotBtn.textContent = "剧情改命中…";
    clearChronicle();
    clearSheet();

    try {
      lotStage.className = "lot-stage ominous flash-red";
      lotInner.innerHTML =
        `<div class="ritual">` +
        `<p class="lot-rank bad">${badLot.rank}</p>` +
        `<p class="ritual-title">坏签降临</p>` +
        `<p class="ritual-kicker">山房不认栽</p>` +
        `</div>`;
      appendChronicle(
        { index: 0, title: "序章", text: `抽得「${badLot.rank}」：${badLot.t}。改命程序启动。` },
        { arcName: "即将开演", arcTag: "序" }
      );
      tapSound(260);
      await wait(1200);

      const journey = buildFateJourney({
        rank: badLot.rank,
        sign: badLot.t.slice(0, 18),
        round: 1,
        hero: "道友",
      });
      const allChapters = [];

      for (const ch of journey.chapters) {
        await playChapter(ch, journey);
        allChapters.push({
          title: `${journey.arcName}·${ch.title}`,
          text: ch.text,
        });
      }

      const goodLot = pickLot(true);
      const ending = journey.buildEnding({
        rank: goodLot.rank,
        sign: goodLot.t.slice(0, 18),
      });
      await playChapter(ending, journey);
      allChapters.push({
        title: `${journey.arcName}·${ending.title}`,
        text: ending.text,
      });

      const now = new Date();
      const when = `${now.getMonth() + 1}/${now.getDate()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const log = {
        when,
        arcName: journey.arcName,
        arcTag: journey.arcTag,
        fromRank: badLot.rank,
        toRank: goodLot.rank,
        toText: goodLot.t,
        rounds: 1,
        chapters: allChapters,
      };
      const fateLogs = [log, ...(stats.fateLogs || [])].slice(0, 12);
      persistStats({
        rewrites: (stats.rewrites || 0) + 1,
        fateLogs,
        lastPath: "lot",
      });
      renderFateHistory();
      showGoodLot(goodLot, true, log);
    } catch (err) {
      console.error("改命剧情中断", err);
      unlockLotBtn("再试一签");
      setStageCaption(`<p class="lot-hint">改命被风吹散了，再摇一次。</p>`);
      clearSheet();
    }
  }

  function getLotStick() {
    return document.getElementById("lotStick");
  }

  function ensureStickUI() {
    if (!getLotStick()) {
      setStageCaption(`<p class="lot-hint">签筒在响……</p>`);
    }
  }

  lotBtn.addEventListener("click", () => {
    if (ritualBusy || lotBtn.disabled) return;
    clearSheet();
    lastShownLot = null;
    ensureStickUI();
    const stick = getLotStick();
    const caption = document.getElementById("lotStageCaption");
    lotStage.className = "lot-stage";
    ritualBusy = true;
    lotBtn.disabled = true;
    lotBtn.textContent = "摇签中…";
    if (stick) {
    stick.classList.remove("shaking", "drawn");
    stick.style.opacity = "1";
    void stick.offsetWidth;
    stick.classList.add("shaking");
    }
    if (caption) caption.innerHTML = '<p class="lot-hint">签筒在响……</p>';

    setTimeout(() => {
      if (!getLotStick()) ensureStickUI();
      const lot = pickLot(false);
      if (lot.rank === BAD_RANK) {
        runAutoRewrite(lot);
        return;
      }
      showPlainLot(lot);
    }, 2200);
  });

  copyLot.addEventListener("click", async () => {
    const rank =
      (lotSheet && lotSheet.querySelector(".lot-rank")) ||
      lotInner.querySelector(".lot-rank");
    const text =
      (lotSheet && lotSheet.querySelector(".lot-text")) ||
      (lastShownLot && lastShownLot.t);
    const adviceEl = lotSheet && lotSheet.querySelector(".lot-advice");
    const chapters = chronicleEl
      ? [...chronicleEl.querySelectorAll("li")].map((li) => li.innerText.replace(/\s+/g, " ").trim())
      : [];

    const rankText = rank ? rank.textContent : lastShownLot && lastShownLot.rank;
    const textContent = typeof text === "string" ? text : text ? text.textContent : "";
    if (!rankText || !textContent) {
      copyLot.textContent = "先摇一签";
      setTimeout(() => (copyLot.textContent = "复制签文"), 1000);
      return;
    }
    const extraLine = adviceEl ? "\n" + adviceEl.textContent.replace(/\s+/g, " ").trim() : "";
    const storyLine = chapters.length ? "\n【改命纪事】\n" + chapters.join("\n") : "";
    try {
      await navigator.clipboard.writeText(
        `【无为山房·${rankText}】\n${textContent}${extraLine}${storyLine}\n——命数在自己手里`
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
