/* 无为山房 · 人间骗局图鉴 */
function initScams() {
  const { scams } = window.WuweiData;
  const scamList = document.getElementById("scamList");
  const INITIAL = 10;
  const scamFallback =
    "data:image/svg+xml," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><rect fill="#243832" width="100%" height="100%"/><text x="50%" y="50%" fill="#c4a35a" font-size="28" text-anchor="middle" font-family="serif">无为山房</text></svg>`
    );

  const itemsById = {};
  let expanded = false;
  let moreBtn = null;

  function closeAll() {
    scamList.querySelectorAll(".scam-item").forEach((el) => {
      el.classList.remove("open");
      const t = el.querySelector(".scam-toggle");
      if (t) t.textContent = "展开";
    });
  }

  function openItem(item) {
    // 深链打开时，若条目在「更多」里，先展开列表
    if (item.classList.contains("scam-more") && !expanded) {
      setExpanded(true);
    }
    closeAll();
    item.classList.add("open");
    const label = item.querySelector(".scam-toggle");
    if (label) label.textContent = "收起";
    item.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function setExpanded(on) {
    expanded = on;
    scamList.classList.toggle("is-expanded", on);
    if (moreBtn) {
      const rest = Math.max(0, scams.length - INITIAL);
      moreBtn.textContent = on ? "收起更多" : `显示更多（还有 ${rest} 条）`;
      moreBtn.setAttribute("aria-expanded", on ? "true" : "false");
    }
  }

  function createItem(s, index) {
    const item = document.createElement("div");
    item.className = "scam-item" + (index >= INITIAL ? " scam-more" : "");
    item.dataset.id = s.id || "";
    item.innerHTML =
      `<button type="button" class="scam-head">` +
      `<img class="scam-thumb" src="${s.img}" alt="" loading="lazy" decoding="async" />` +
      `<span class="scam-head-text"><strong>${s.title}</strong><em>${s.tag}</em></span>` +
      `<span class="scam-toggle">展开</span>` +
      `</button>` +
      `<div class="scam-body">` +
      `<img class="scam-photo" src="${s.img}" alt="" loading="lazy" decoding="async" />` +
      `<p class="scam-verdict">${s.verdict}</p>` +
      `<div class="path-hint" data-actions></div>` +
      `<p class="scam-credit">${s.credit} · 仅作氛围配图</p>` +
      `</div>`;

    item.querySelectorAll("img").forEach((img) => {
      img.addEventListener("error", () => {
        img.src = scamFallback;
      });
    });

    const actions = item.querySelector("[data-actions]");
    const dropBtn = document.createElement("button");
    dropBtn.type = "button";
    dropBtn.className = "path-chip";
    dropBtn.textContent = "丢进清心池";
    dropBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      WuweiBridge.goto({ section: "drop", prefills: s.title.replace(/[「」]/g, "") });
      WuweiBridge.addDao(1, "识破一局。");
    });
    const lotBtn = document.createElement("button");
    lotBtn.type = "button";
    lotBtn.className = "path-chip";
    lotBtn.textContent = "去改命";
    lotBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      WuweiBridge.goto({ section: "lot" });
    });
    const copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.className = "path-chip";
    copyBtn.textContent = "复制转给道友";
    copyBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const link = `${location.origin}${location.pathname}#scams`;
      const text =
        `【无为山房·人间骗局图鉴】\n` +
        `${s.title} · ${s.tag}\n` +
        `${s.verdict}\n` +
        `——别硬撑、先放下\n` +
        link;
      try {
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = "已复制";
        setTimeout(() => (copyBtn.textContent = "复制转给道友"), 1200);
        WuweiBridge.addDao(1, "识破传出去了。");
      } catch {
        copyBtn.textContent = "复制失败";
        setTimeout(() => (copyBtn.textContent = "复制转给道友"), 1200);
      }
    });
    actions.append(dropBtn, lotBtn, copyBtn);

    const btn = item.querySelector("button.scam-head");
    btn.addEventListener("click", () => {
      const open = item.classList.contains("open");
      if (open) {
        closeAll();
      } else {
        openItem(item);
        window.WuweiStore.persistStats({ lastPath: "scams" });
      }
    });

    return item;
  }

  scams.forEach((s, index) => {
    const item = createItem(s, index);
    scamList.appendChild(item);
    if (s.id) itemsById[s.id] = item;
  });

  if (scams.length > INITIAL) {
    moreBtn = document.createElement("button");
    moreBtn.type = "button";
    moreBtn.className = "btn scam-more-btn";
    moreBtn.setAttribute("aria-expanded", "false");
    moreBtn.textContent = `显示更多（还有 ${scams.length - INITIAL} 条）`;
    moreBtn.addEventListener("click", () => {
      setExpanded(!expanded);
      if (expanded) {
        moreBtn.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
    scamList.after(moreBtn);
  }

  window.WuweiScams = {
    openById(id) {
      const item = itemsById[id];
      if (item) openItem(item);
    },
  };
}

window.initScams = initScams;
