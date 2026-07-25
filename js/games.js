/* 无为山房 · 山房功课：坐忘 / 摸鱼 / 木鱼 / 调息 */
function initGames() {
  const { muyuLines } = window.WuweiData;
  const { stats, persistStats } = window.WuweiStore;

  document.querySelectorAll(".game-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".game-tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".game-panel").forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById("panel-" + tab.dataset.game).classList.add("active");
      stopZuowang(false);
      stopBreathe();
    });
  });

  /* Zuowang */
  const zw = document.getElementById("zuowang");
  const zwTime = document.getElementById("zwTime");
  const zwMsg = document.getElementById("zwMsg");
  const zwStart = document.getElementById("zwStart");
  let zwTimer = null;
  let zwSeconds = 0;
  let zwActive = false;
  const zwLevels = [
    [3, "心猿初定……"],
    [8, "杂念还在刷朋友圈。"],
    [15, "开始有点道味了。"],
    [30, "你比大部分群聊都安静。"],
    [60, "一分钟。现代人的奇迹。"],
    [90, "快成精了，别睁眼。"],
    [120, "坐忘大成。人间骗术暂时失效。"],
  ];

  function stopZuowang(showEnd) {
    zwActive = false;
    zw.classList.remove("sitting");
    if (zwTimer) {
      clearInterval(zwTimer);
      zwTimer = null;
    }
    window.removeEventListener("mousemove", breakZuowang);
    window.removeEventListener("keydown", breakZuowang);
    window.removeEventListener("touchstart", breakZuowang);
    window.removeEventListener("scroll", breakZuowang);
    zwStart.disabled = false;
    zwStart.textContent = zwSeconds > 0 ? "再坐一次" : "开始坐忘";
    if (showEnd && zwSeconds > 0) {
      zwMsg.textContent = `破功。你坚持了 ${zwSeconds} 秒——也算修行。`;
      if (zwSeconds >= 30) WuweiBridge.addDao(1, "坐忘有成。");
    }
  }

  function breakZuowang() {
    if (!zwActive) return;
    stopZuowang(true);
  }

  zwStart.addEventListener("click", () => {
    stopZuowang(false);
    zwSeconds = 0;
    zwTime.textContent = "0";
    zwActive = true;
    zw.classList.add("sitting");
    zwStart.disabled = true;
    zwStart.textContent = "坐忘中…";
    zwMsg.textContent = "动一下就算破功。道友，忍住。";
    window.addEventListener("mousemove", breakZuowang);
    window.addEventListener("keydown", breakZuowang);
    window.addEventListener("touchstart", breakZuowang, { passive: true });
    window.addEventListener("scroll", breakZuowang, { passive: true });
    zwTimer = setInterval(() => {
      zwSeconds += 1;
      zwTime.textContent = String(zwSeconds);
      for (let i = zwLevels.length - 1; i >= 0; i--) {
        if (zwSeconds >= zwLevels[i][0]) {
          zwMsg.textContent = zwLevels[i][1];
          break;
        }
      }
      if (zwSeconds >= 120) {
        stopZuowang(false);
        zwMsg.textContent = "坐忘圆满。你可以去人间骗回来了——用平静。";
        WuweiBridge.addDao(3, "坐忘圆满。");
        const follow = document.getElementById("zuowangFollow");
        if (follow) {
          follow.innerHTML = "";
          follow.className = "path-hint center";
          const b = document.createElement("button");
          b.type = "button";
          b.className = "path-chip";
          b.textContent = "回去投烦恼";
          b.addEventListener("click", () => WuweiBridge.goto({ section: "drop" }));
          follow.appendChild(b);
        }
      }
    }, 1000);
  });

  /* Fish */
  const fishGame = document.getElementById("fishGame");
  const fishOverlay = document.getElementById("fishOverlay");
  const fishStart = document.getElementById("fishStart");
  const fishScoreEl = document.getElementById("fishScore");
  const fishTimeEl = document.getElementById("fishTime");
  const fishResult = document.getElementById("fishResult");
  const fishEmojis = ["🐟", "🐠", "🐡", "🦐", "🐙", "🦑"];
  let fishScore = 0;
  let fishLeft = 20;
  let fishSpawn = null;
  let fishCountdown = null;
  let fishPlaying = false;

  function clearFish() {
    fishGame.querySelectorAll(".fish").forEach((f) => f.remove());
  }

  function endFish() {
    fishPlaying = false;
    clearInterval(fishSpawn);
    clearInterval(fishCountdown);
    clearFish();
    fishOverlay.classList.remove("hidden");
    if (fishScore > (stats.fishBest || 0)) {
      persistStats({ fishBest: fishScore });
    }
    let rank;
    if (fishScore >= 18) rank = "摸鱼大宗师。建议出家，或者升职。";
    else if (fishScore >= 12) rank = "得道摸鱼人。老板以为你在思考。";
    else if (fishScore >= 6) rank = "初级道友。还要多摸，路还长。";
    else rank = "心太诚了，几乎没摸到。也是一种清修。";
    const best = stats.fishBest ? ` 历史最佳 ${stats.fishBest}。` : "";
    fishResult.textContent = `本局摸到 ${fishScore} 条。${rank}${best}`;
    fishStart.textContent = "再摸一局";
    if (fishScore >= 6) WuweiBridge.addDao(1, "摸鱼有获。");
  }

  function spawnFish() {
    if (!fishPlaying) return;
    const el = document.createElement("button");
    el.type = "button";
    el.className = "fish";
    el.textContent = fishEmojis[Math.floor(Math.random() * fishEmojis.length)];
    el.setAttribute("aria-label", "鱼");
    el.style.left = 8 + Math.random() * 78 + "%";
    el.style.top = 18 + Math.random() * 62 + "%";
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!fishPlaying || el.classList.contains("caught")) return;
      el.classList.add("caught");
      fishScore += 1;
      fishScoreEl.textContent = String(fishScore);
      tapSound(520);
      setTimeout(() => el.remove(), 400);
    });
    fishGame.appendChild(el);
    setTimeout(() => {
      if (el.parentNode && !el.classList.contains("caught")) el.remove();
    }, 1600 + Math.random() * 900);
  }

  fishStart.addEventListener("click", () => {
    fishScore = 0;
    fishLeft = 20;
    fishScoreEl.textContent = "0";
    fishTimeEl.textContent = "20";
    fishResult.textContent = "";
    fishOverlay.classList.add("hidden");
    clearFish();
    fishPlaying = true;
    fishSpawn = setInterval(spawnFish, 480);
    spawnFish();
    fishCountdown = setInterval(() => {
      fishLeft -= 1;
      fishTimeEl.textContent = String(fishLeft);
      if (fishLeft <= 0) endFish();
    }, 1000);
  });

  /* Muyu */
  const muyuBtn = document.getElementById("muyuBtn");
  const muyuCount = document.getElementById("muyuCount");
  const muyuMsg = document.getElementById("muyuMsg");
  const muyuReset = document.getElementById("muyuReset");
  muyuCount.textContent = String(stats.muyu || 0);

  function updateMuyuMsg() {
    let msg = "每敲一下，人间少一点噪音。";
    for (let i = muyuLines.length - 1; i >= 0; i--) {
      if ((stats.muyu || 0) >= muyuLines[i][0]) {
        msg = muyuLines[i][1];
        break;
      }
    }
    muyuMsg.textContent = msg;
  }
  updateMuyuMsg();

  const milestoneHit = new Set();
  muyuBtn.addEventListener("click", () => {
    const next = (stats.muyu || 0) + 1;
    persistStats({ muyu: next, lastPath: "games" });
    muyuCount.textContent = String(next);
    updateMuyuMsg();
    tapSound(280);
    muyuBtn.classList.add("hit");
    setTimeout(() => muyuBtn.classList.remove("hit"), 80);
    [10, 66, 108].forEach((n) => {
      if (next === n && !milestoneHit.has(n)) {
        milestoneHit.add(n);
        WuweiBridge.addDao(n === 108 ? 3 : 1, `木鱼 ${n}。`);
      }
    });
  });

  muyuReset.addEventListener("click", () => {
    persistStats({ muyu: 0 });
    muyuCount.textContent = "0";
    updateMuyuMsg();
  });

  /* Breathe */
  const breatheCircle = document.getElementById("breatheCircle");
  const breatheLabel = document.getElementById("breatheLabel");
  const breatheMsg = document.getElementById("breatheMsg");
  const breatheStart = document.getElementById("breatheStart");
  let breatheTimer = null;
  let breatheActive = false;
  let breatheRound = 0;

  function stopBreathe() {
    breatheActive = false;
    if (breatheTimer) {
      clearTimeout(breatheTimer);
      breatheTimer = null;
    }
    breatheCircle.className = "breathe-circle";
    breatheLabel.textContent = "息";
    breatheStart.disabled = false;
    breatheStart.textContent = breatheRound > 0 ? "再来一轮" : "开始调息";
  }

  function breathePhase(name, cls, ms, next) {
    if (!breatheActive) return;
    breatheCircle.className = "breathe-circle " + cls;
    breatheLabel.textContent = name;
    breatheTimer = setTimeout(next, ms);
  }

  function startBreatheCycle() {
    if (!breatheActive) return;
    breatheRound += 1;
    breatheMsg.textContent = `第 ${breatheRound} 轮。别硬撑呼吸，顺着来。`;
    breathePhase("吸", "in", 4000, () => {
      breathePhase("屏", "hold", 4000, () => {
        breathePhase("呼", "out", 4000, () => {
          if (breatheRound >= 4) {
            stopBreathe();
            breatheMsg.textContent = "四轮调息完成。心慢了，世界也就慢了。";
            breatheLabel.textContent = "定";
            WuweiBridge.addDao(2, "调息完成。");
            return;
          }
          startBreatheCycle();
        });
      });
    });
  }

  breatheStart.addEventListener("click", () => {
    stopBreathe();
    breatheActive = true;
    breatheRound = 0;
    breatheStart.disabled = true;
    breatheStart.textContent = "调息中…";
    breatheMsg.textContent = "跟着圆圈。手机先放下。";
    startBreatheCycle();
  });
}

window.initGames = initGames;
