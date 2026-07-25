/* 无为山房 · 轻敲音效 */
let audioCtx = null;

function tapSound(freq = 380) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = "sine";
    o.frequency.value = freq;
    g.gain.value = 0.04;
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
    o.stop(audioCtx.currentTime + 0.2);
  } catch (_) {}
}

window.tapSound = tapSound;
