/* 无为山房 · 投烦恼 */
function initDrop() {
  const { replies, quickWorryTags, pickLine } = window.WuweiData;
  const { stats, persistStats } = window.WuweiStore;
  const worryInput = document.getElementById("worryInput");
  const dropBtn = document.getElementById("dropBtn");
  const pond = document.getElementById("pond");
  const replyEl = document.getElementById("reply");
  const historyList = document.getElementById("historyList");
  const followEl = document.getElementById("dropFollow");
  const quickTags = document.getElementById("quickTags");

  quickWorryTags.forEach((tag) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = tag;
    b.addEventListener("click", () => {
      const cur = worryInput.value.trim();
      worryInput.value = cur ? cur + "、" + tag : tag;
      worryInput.focus();
    });
    quickTags.appendChild(b);
  });

  function renderHistory() {
    historyList.innerHTML = "";
    if (!stats.history.length) {
      historyList.innerHTML = '<li class="history-empty">还空着。放下第一条吧。</li>';
      return;
    }
    stats.history.slice(0, 8).forEach((item) => {
      const li = document.createElement("li");
      const span = document.createElement("span");
      span.textContent = item.text;
      const time = document.createElement("time");
      time.textContent = item.when;
      li.append(span, time);
      historyList.appendChild(li);
    });
  }

  function showFollow() {
    followEl.innerHTML = "";
    followEl.className = "path-hint";
    const actions = [
      { label: "求一悟巩固", detail: { section: "oracle", oracle: true } },
      { label: "去摇签改命", detail: { section: "lot" } },
      { label: "敲木鱼压惊", detail: { section: "games", game: "muyu" } },
    ];
    actions.forEach((a) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "path-chip";
      b.textContent = a.label;
      b.addEventListener("click", () => WuweiBridge.goto(a.detail));
      followEl.appendChild(b);
    });
  }

  dropBtn.addEventListener("click", () => {
    const raw = worryInput.value.trim();
    const w = raw || "说不清的闷";
    tapSound(320);
    const float = document.createElement("div");
    float.className = "worry-float";
    float.textContent = w.length > 20 ? w.slice(0, 20) + "…" : w;
    pond.appendChild(float);
    setTimeout(() => float.remove(), 1800);

    const short = w.length > 24 ? w.slice(0, 24) + "…" : w;
    const line = pickLine(replies)(short);
    pond.classList.add("has-reply");
    replyEl.classList.remove("show");
    void replyEl.offsetWidth;
    replyEl.textContent = line;
    replyEl.classList.add("show");
    worryInput.value = "";

    const now = new Date();
    const when = `${now.getMonth() + 1}/${now.getDate()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    persistStats({
      drops: (stats.drops || 0) + 1,
      history: [{ text: short, when }, ...stats.history].slice(0, 12),
      lastPath: "drop",
    });
    renderHistory();
    showFollow();
    WuweiBridge.addDao(1, "烦恼已投。");
  });

  renderHistory();
  window.WuweiDrop = { renderHistory };
}

window.initDrop = initDrop;
