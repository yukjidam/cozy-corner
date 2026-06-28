// ===== HAIKU DESKTOP WIDGET =====
(function () {
  const textEl    = document.getElementById('haiku-widget-text');
  const metaEl    = document.getElementById('haiku-widget-meta');
  const nextBtn   = document.getElementById('haiku-widget-next');
  if (!textEl || !nextBtn) return;

  let currentIndex = -1;

  function pickRandom() {
    let idx;
    do { idx = Math.floor(Math.random() * HAIKU_LIST.length); }
    while (idx === currentIndex && HAIKU_LIST.length > 1);
    return idx;
  }

  function show(idx) {
    const h = HAIKU_LIST[idx];
    currentIndex = idx;
    textEl.innerHTML =
      `<span>${h.lines[0]}</span>` +
      `<span>${h.lines[1]}</span>` +
      `<span>${h.lines[2]}</span>`;
    metaEl.textContent = `— ${h.author} · ${h.country} · ${h.year}`;
  }

  function next() {
    textEl.style.opacity = '0';
    setTimeout(() => {
      show(pickRandom());
      textEl.style.opacity = '1';
    }, 220);
  }

  nextBtn.addEventListener('click', next);

  // Show one on load
  show(pickRandom());
})();
