// ===== QUOTE / AFFIRMATION DESKTOP WIDGET =====
(function () {
  const textEl  = document.getElementById('quote-widget-text');
  const metaEl  = document.getElementById('quote-widget-meta');
  const nextBtn = document.getElementById('quote-widget-next');
  if (!textEl || !nextBtn) return;

  let currentIndex = -1;

  function pickRandom() {
    let idx;
    do { idx = Math.floor(Math.random() * QUOTES_LIST.length); }
    while (idx === currentIndex && QUOTES_LIST.length > 1);
    return idx;
  }

  function show(idx) {
    const q = QUOTES_LIST[idx];
    currentIndex = idx;
    textEl.textContent = `"${q.text}"`;
    metaEl.textContent = `— ${q.author} · ${q.country} · ${q.year}`;
  }

  function next() {
    textEl.style.opacity = '0';
    metaEl.style.opacity = '0';
    setTimeout(() => {
      show(pickRandom());
      textEl.style.opacity = '1';
      metaEl.style.opacity = '1';
    }, 220);
  }

  nextBtn.addEventListener('click', next);

  // Show one on load
  show(pickRandom());
})();
