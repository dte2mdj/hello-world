/* 无为山房 · 投烦恼 */
function initDrop() {
  const { quickWorryTags, generateWorryReply, getAiConfig, saveAiConfig } = window.WuweiReplies;
  const { stats, persistStats } = window.WuweiStore;
  const worryInput = document.getElementById("worryInput");
  const dropBtn = document.getElementById("dropBtn");
  const pond = document.getElementById("pond");
  const replyEl = document.getElementById("reply");
  const replyMeta = document.getElementById("replyMeta");
  const historyList = document.getElementById("historyList");
  const followEl = document.getElementById("dropFollow");
  const quickTags = document.getElementById("quickTags");

  // AI settings
  const aiEnabled = document.getElementById("aiEnabled");
  const aiKey = document.getElementById("aiKey");
  const aiBase = document.getElementById("aiBase");
  const aiModel = document.getElementById("aiModel");
  const aiSave = document.getElementById("aiSave");
  const aiStatus = document.getElementById("aiStatus");

  function syncAiForm() {
    const cfg = getAiConfig();
    if (aiEnabled) aiEnabled.checked = cfg.enabled;
    if (aiKey) aiKey.value = cfg.key;
    if (aiBase) aiBase.value = cfg.base;
    if (aiModel) aiModel.value = cfg.model;
    if (aiStatus) {
      aiStatus.textContent = cfg.enabled && cfg.key
        ? "AI 已开启：将优先动态生成，失败则回落本地词库"
        : "当前用本地动态词库（可组合出大量不同回应）";
    }
  }

  if (aiSave) {
    aiSave.addEventListener("click", () => {
      saveAiConfig({
        enabled: !!(aiEnabled && aiEnabled.checked),
        key: aiKey ? aiKey.value : "",
        base: aiBase ? aiBase.value : "",
        model: aiModel ? aiModel.value : "",
      });
      syncAiForm();
      WuweiBridge.toast("AI 设置已保存在本机");
    });
  }
  syncAiForm();

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

  dropBtn.addEventListener("click", async () => {
    const raw = worryInput.value.trim();
    const w = raw || "说不清的闷";
    tapSound(320);
    dropBtn.disabled = true;
    dropBtn.textContent = "池水翻涌…";

    const float = document.createElement("div");
    float.className = "worry-float";
    float.textContent = w.length > 20 ? w.slice(0, 20) + "…" : w;
    pond.appendChild(float);
    setTimeout(() => float.remove(), 1800);

    const short = w.length > 24 ? w.slice(0, 24) + "…" : w;
    pond.classList.add("has-reply");
    replyEl.classList.remove("show");
    replyEl.textContent = "清心池正在回应……";
    replyEl.classList.add("show");
    if (replyMeta) replyMeta.textContent = "";

    const result = await generateWorryReply(w);

    replyEl.classList.remove("show");
    void replyEl.offsetWidth;
    replyEl.textContent = result.text;
    replyEl.classList.add("show");
    if (replyMeta) {
      if (result.source === "ai") {
        replyMeta.textContent = "来源：AI 动态生成";
      } else if (result.error) {
        replyMeta.textContent = "AI 暂不可用，已用本地词库 · " + result.error.slice(0, 48);
      } else {
        replyMeta.textContent = "来源：本地动态词库";
      }
    }

    worryInput.value = "";
    dropBtn.disabled = false;
    dropBtn.textContent = "投入清心池";

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
