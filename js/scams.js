/* 无为山房 · 人间骗局图鉴 */
function initScams() {
  const { scams } = window.WuweiData;
  const scamList = document.getElementById("scamList");
  const scamFallback =
    "data:image/svg+xml," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><rect fill="#243832" width="100%" height="100%"/><text x="50%" y="50%" fill="#c4a35a" font-size="28" text-anchor="middle" font-family="serif">无为山房</text></svg>`
    );

  const itemsById = {};

  function closeAll() {
    scamList.querySelectorAll(".scam-item").forEach((el) => {
      el.classList.remove("open");
      const t = el.querySelector(".scam-toggle");
      if (t) t.textContent = "展开";
    });
  }

  function openItem(item) {
    closeAll();
    item.classList.add("open");
    const label = item.querySelector(".scam-toggle");
    if (label) label.textContent = "收起";
    item.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  scams.forEach((s) => {
    const item = document.createElement("div");
    item.className = "scam-item";
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
    actions.append(dropBtn, lotBtn);

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

    scamList.appendChild(item);
    if (s.id) itemsById[s.id] = item;
  });

  window.WuweiScams = {
    openById(id) {
      const item = itemsById[id];
      if (item) openItem(item);
    },
  };
}

window.initScams = initScams;
