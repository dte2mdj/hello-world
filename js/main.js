/* 无为山房 · 入口 */
function initLeaves() {
  const leaves = document.getElementById("leaves");
  if (!leaves) return;
  for (let i = 0; i < 7; i++) {
    const el = document.createElement("span");
    el.className = "leaf";
    el.style.left = Math.random() * 100 + "%";
    el.style.animationDuration = 12 + Math.random() * 14 + "s";
    el.style.animationDelay = Math.random() * 10 + "s";
    el.style.opacity = String(0.25 + Math.random() * 0.4);
    leaves.appendChild(el);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initLeaves();
  WuweiBridge.init();
  initScams();
  initDrop();
  initLot();
  initOracle();
  initGames();
  window.WuweiStore.refreshNav();
});
