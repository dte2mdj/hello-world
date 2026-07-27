/* 无为山房 · 人间骗局图鉴 */
function initScams() {
  const { scams } = window.WuweiData;
  const scamList = document.getElementById("scamList");
  const INITIAL = 6;
  const scamFallback =
    "data:image/svg+xml," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><rect fill="#243832" width="100%" height="100%"/><text x="50%" y="50%" fill="#c4a35a" font-size="28" text-anchor="middle" font-family="serif">无为山房</text></svg>`
    );

  const itemsById = {};
  const extraItems = [];
  let expanded = false;
  let moreBtn = null;

  function closeAll() {
    scamList.querySelectorAll(".scam-item").forEach((el) => {
      el.classList.remove("open");
      const t = el.querySelector(".scam-toggle");
      if (t) t.textContent = "展开";
    });
  }

  function setExpanded(on) {
    expanded = on;
    extraItems.forEach((el) => {
      el.hidden = !on;
    });
    if (moreBtn) {
      const rest = Math.max(0, scams.length - INITIAL);
      moreBtn.textContent = on ? "收起" : `显示更多（还有 ${rest} 条）`;
      moreBtn.setAttribute("aria-expanded", on ? "true" : "false");
    }
  }

  function openItem(item) {
    if (item.hidden) setExpanded(true);
    closeAll();
    item.classList.add("open");
    const label = item.querySelector(".scam-toggle");
    if (label) label.textContent = "收起";
    item.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function wrapLines(ctx, text, maxWidth) {
    const lines = [];
    let line = "";
    for (const ch of String(text || "")) {
      const next = line + ch;
      if (ctx.measureText(next).width > maxWidth && line) {
        lines.push(line);
        line = ch === "\n" ? "" : ch;
      } else if (ch === "\n") {
        lines.push(line);
        line = "";
      } else {
        line = next;
      }
    }
    if (line) lines.push(line);
    return lines.length ? lines : [""];
  }

  function loadShareImage(url) {
    return new Promise((resolve) => {
      if (!url) {
        resolve(null);
        return;
      }
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = url;
    });
  }

  function drawCover(ctx, img, x, y, w, h) {
    if (!img) {
      ctx.fillStyle = "#243832";
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = "rgba(196,163,90,0.55)";
      ctx.font = '28px "Ma Shan Zheng", cursive';
      ctx.textAlign = "center";
      ctx.fillText("无为山房", x + w / 2, y + h / 2 + 10);
      ctx.textAlign = "left";
      return;
    }
    const ir = img.width / img.height;
    const br = w / h;
    let sx = 0;
    let sy = 0;
    let sw = img.width;
    let sh = img.height;
    if (ir > br) {
      sw = img.height * br;
      sx = (img.width - sw) / 2;
    } else {
      sh = img.width / br;
      sy = (img.height - sh) / 2;
    }
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
    ctx.fillStyle = "rgba(26,36,32,0.28)";
    ctx.fillRect(x, y, w, h);
  }

  async function renderScamShareCard(s) {
    if (document.fonts && document.fonts.ready) {
      try {
        await document.fonts.ready;
      } catch {
        /* ignore */
      }
    }

    const W = 720;
    const pad = 48;
    const contentW = W - pad * 2;
    const measure = document.createElement("canvas").getContext("2d");
    measure.font = '22px "ZCOOL XiaoWei", "Noto Serif SC", serif';
    const verdictLines = wrapLines(measure, s.verdict, contentW);
    const coverH = 220;
    const H =
      pad +
      36 +
      18 +
      coverH +
      28 +
      42 +
      28 +
      verdictLines.length * 36 +
      48 +
      28 +
      pad;

    const scale = 2;
    const canvas = document.createElement("canvas");
    canvas.width = W * scale;
    canvas.height = H * scale;
    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);

    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#15201c");
    bg.addColorStop(0.55, "#1a2420");
    bg.addColorStop(1, "#121a17");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    const glow = ctx.createRadialGradient(W * 0.2, 0, 20, W * 0.2, 0, 280);
    glow.addColorStop(0, "rgba(61,92,79,0.45)");
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(196,163,90,0.35)";
    ctx.lineWidth = 2;
    ctx.strokeRect(18, 18, W - 36, H - 36);

    let y = pad;
    ctx.fillStyle = "rgba(196,163,90,0.85)";
    ctx.font = '18px "Noto Serif SC", serif';
    ctx.fillText("无为山房 · 人间骗局图鉴", pad, y);
    y += 18;

    const coverImg = await loadShareImage(s.img);
    drawCover(ctx, coverImg, pad, y, contentW, coverH);
    y += coverH + 28;

    ctx.fillStyle = "#eef3ef";
    ctx.font = '40px "Ma Shan Zheng", cursive';
    wrapLines(ctx, s.title, contentW).forEach((line) => {
      ctx.fillText(line, pad, y);
      y += 46;
    });
    y += 4;

    ctx.fillStyle = "rgba(196,163,90,0.9)";
    ctx.font = '18px "ZCOOL XiaoWei", serif';
    ctx.fillText(s.tag || "识破", pad, y);
    y += 20;

    ctx.strokeStyle = "rgba(196,163,90,0.35)";
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(pad + 64, y);
    ctx.stroke();
    y += 28;

    ctx.fillStyle = "rgba(216,228,220,0.88)";
    ctx.font = '22px "ZCOOL XiaoWei", "Noto Serif SC", serif';
    verdictLines.forEach((line) => {
      ctx.fillText(line, pad, y);
      y += 36;
    });

    y = H - pad - 8;
    ctx.fillStyle = "rgba(196,92,72,0.9)";
    ctx.font = '20px "Ma Shan Zheng", cursive';
    ctx.fillText("别硬撑、先放下", pad, y);
    ctx.fillStyle = "rgba(216,228,220,0.4)";
    ctx.font = '14px "Noto Serif SC", serif';
    ctx.textAlign = "right";
    ctx.fillText("命数在自己手里", W - pad, y);
    ctx.textAlign = "left";

    return canvas;
  }

  async function generateShareImage(s, btn) {
    const label = "分享给道友";
    btn.disabled = true;
    btn.textContent = "生成中…";
    try {
      const canvas = await renderScamShareCard(s);
      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("blob"))), "image/png");
      });

      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        btn.textContent = "已复制到剪贴板";
        WuweiBridge.addDao(1, "识破传出去了。");
      } else {
        throw new Error("clipboard-unsupported");
      }
    } catch (err) {
      console.error(err);
      btn.textContent = "复制失败，可换浏览器重试";
    } finally {
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = label;
      }, 1600);
    }
  }

  function createItem(s, index) {
    const item = document.createElement("div");
    item.className = "scam-item";
    item.dataset.id = s.id || "";
    if (index >= INITIAL) {
      item.hidden = true;
      extraItems.push(item);
    }
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
    const shareBtn = document.createElement("button");
    shareBtn.type = "button";
    shareBtn.className = "path-chip";
    shareBtn.textContent = "分享给道友";
    shareBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      generateShareImage(s, shareBtn);
    });
    actions.append(dropBtn, lotBtn, shareBtn);

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
      if (!expanded) {
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
