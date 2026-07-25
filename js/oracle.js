/* 无为山房 · 今日一悟 */
function initOracle() {
  const { oracles } = window.WuweiData;
  const oracleText = document.getElementById("oracleText");
  const oracleMeta = document.getElementById("oracleMeta");
  const oracleBtn = document.getElementById("oracleBtn");
  const copyOracle = document.getElementById("copyOracle");
  const followEl = document.getElementById("oracleFollow");
  let lastOracle = null;
  let current = null;

  function renderFollow(o) {
    followEl.innerHTML = "";
    followEl.className = "path-hint center";
    if (o.scamId) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "path-chip";
      b.textContent = "看看相关骗局";
      b.addEventListener("click", () =>
        WuweiBridge.goto({ section: "scams", scamId: o.scamId })
      );
      followEl.appendChild(b);
    }
    const drop = document.createElement("button");
    drop.type = "button";
    drop.className = "path-chip";
    drop.textContent = "有感而投";
    drop.addEventListener("click", () =>
      WuweiBridge.goto({ section: "drop", prefills: o.t.slice(0, 40) })
    );
    followEl.appendChild(drop);

    const lot = document.createElement("button");
    lot.type = "button";
    lot.className = "path-chip";
    lot.textContent = "去摇签";
    lot.addEventListener("click", () => WuweiBridge.goto({ section: "lot" }));
    followEl.appendChild(lot);
  }

  function pickOracle() {
    let o;
    do {
      o = oracles[Math.floor(Math.random() * oracles.length)];
    } while (oracles.length > 1 && o === lastOracle);
    lastOracle = o;
    current = o;
    oracleText.style.opacity = "0";
    oracleText.style.transform = "translateY(8px)";
    setTimeout(() => {
      oracleText.textContent = o.t;
      oracleMeta.textContent = o.m;
      oracleText.style.transition = "opacity 0.45s, transform 0.45s";
      oracleText.style.opacity = "1";
      oracleText.style.transform = "translateY(0)";
      renderFollow(o);
    }, 180);
    tapSound(360);
    WuweiBridge.addDao(1, "得一悟。");
    window.WuweiStore.persistStats({ lastPath: "oracle" });
  }

  oracleBtn.addEventListener("click", pickOracle);
  copyOracle.addEventListener("click", async () => {
    const text = `【无为山房·今日一悟】\n${oracleText.textContent}\n—— ${oracleMeta.textContent}`;
    try {
      await navigator.clipboard.writeText(text);
      copyOracle.textContent = "已复制";
      setTimeout(() => (copyOracle.textContent = "复制发给道友"), 1200);
    } catch {
      copyOracle.textContent = "复制失败";
      setTimeout(() => (copyOracle.textContent = "复制发给道友"), 1200);
    }
  });
}

window.initOracle = initOracle;
