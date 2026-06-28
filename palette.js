// ===== COLOR PALETTE GENERATOR (100 presets, no AI) =====
(function () {
  const swatches  = document.getElementById('palette-swatches');
  const hexRow    = document.getElementById('palette-hex-row');
  const statusEl  = document.getElementById('palette-status');
  const tryWrap   = document.getElementById('palette-try-wrap');
  const tryBtn    = document.getElementById('palette-try-btn');
  const resetBtn  = document.getElementById('palette-reset-btn');
  const shuffleBtn = document.getElementById('palette-gen-btn');
  if (!swatches) return;

  // ── 100 hand-curated palettes ──
  // Each entry: { name, colors: [5 hex strings] }
  const PALETTES = [
    { name: 'lofi night',        colors: ['#0d0b1e','#1a1630','#7c3aed','#f3b27a','#e6a0b8'] },
    { name: 'sakura dusk',       colors: ['#1a0e1a','#2d1b2d','#c77dba','#f5a7c7','#ffe0f0'] },
    { name: 'forest rain',       colors: ['#0b1a12','#1a3328','#2d6a4f','#74c69d','#b7e4c7'] },
    { name: 'ocean midnight',    colors: ['#03045e','#0077b6','#00b4d8','#90e0ef','#caf0f8'] },
    { name: 'autumn ember',      colors: ['#1a0a00','#7b2d00','#e85d04','#f48c06','#fdc500'] },
    { name: 'lavender mist',     colors: ['#10002b','#240046','#7b2fbe','#c77dff','#e0aaff'] },
    { name: 'mint tea',          colors: ['#0b1a15','#155d3d','#40916c','#95d5b2','#d8f3dc'] },
    { name: 'cotton candy',      colors: ['#1a0020','#a4133c','#ff4d6d','#ffb3c6','#fff0f3'] },
    { name: 'cafe au lait',      colors: ['#1a0f0a','#4a3728','#8b6253','#c9a07d','#f0d9c5'] },
    { name: 'arctic aurora',     colors: ['#001219','#005f73','#0a9396','#94d2bd','#e9d8a6'] },
    { name: 'cyberpunk neon',    colors: ['#0a0010','#1b0030','#7400b8','#ff006e','#00f5d4'] },
    { name: 'desert sunset',     colors: ['#1a0500','#7b2d00','#e07c24','#f4a261','#e9c46a'] },
    { name: 'cherry blossom',    colors: ['#1a0010','#4d0030','#c9184a','#ff4d6d','#ffb3c1'] },
    { name: 'deep sea',          colors: ['#03045e','#023e8a','#0077b6','#0096c7','#48cae4'] },
    { name: 'golden hour',       colors: ['#1a0900','#7a3b00','#e07c24','#ffd166','#fff3b0'] },
    { name: 'grape soda',        colors: ['#0d002b','#2b0060','#6a0dad','#b388ff','#ede7f6'] },
    { name: 'mocha dream',       colors: ['#1a0a00','#3e2000','#7b4900','#c87941','#f0c99e'] },
    { name: 'bubblegum',         colors: ['#1a001a','#4d0033','#e0529c','#ff85c2','#ffcce0'] },
    { name: 'moss & stone',      colors: ['#0b110a','#233826','#4a7c59','#8ab87a','#c5e1a5'] },
    { name: 'neon sunset',       colors: ['#1a001a','#7b003a','#ff0055','#ff6b35','#ffe66d'] },
    { name: 'pastel rainbow',    colors: ['#ffe5f0','#c5d5fc','#b5ead7','#ffd1dc','#fff5ba'] },
    { name: 'storm cloud',       colors: ['#0f1114','#1c2128','#2d3748','#718096','#e2e8f0'] },
    { name: 'rose gold',         colors: ['#1a0a0a','#5e2028','#b5534b','#e8a0a3','#f7d6d6'] },
    { name: 'midnight city',     colors: ['#080811','#14141f','#2a2a42','#6677aa','#d0d8f8'] },
    { name: 'matcha latte',      colors: ['#0a1200','#234d20','#44883a','#a2c86c','#d4e6ad'] },
    { name: 'denim wash',        colors: ['#0c1422','#1b3050','#2c4a7c','#6b8fb4','#c4d8ef'] },
    { name: 'terracotta sun',    colors: ['#1a0800','#6b3520','#c2714f','#e09060','#f7d3aa'] },
    { name: 'cold brew',         colors: ['#0c0800','#2e1a00','#6b4423','#b07850','#f0d9c0'] },
    { name: 'electric blue',     colors: ['#00021a','#000a40','#0035b0','#0070f3','#66b2ff'] },
    { name: 'sunflower field',   colors: ['#1a1000','#5a3d00','#c2880a','#f4c300','#fff5a0'] },
    { name: 'velvet night',      colors: ['#0a0014','#1e0038','#4b0082','#9400d3','#bf80ff'] },
    { name: 'coral reef',        colors: ['#001a20','#00505e','#00989a','#00d9c0','#77f2e0'] },
    { name: 'clay pottery',      colors: ['#1a0a00','#5c2500','#a85032','#d07858','#ead5c0'] },
    { name: 'seafoam',           colors: ['#001a14','#00403a','#00806a','#2eb89e','#a0ded4'] },
    { name: 'lilac haze',        colors: ['#0f0014','#2e0050','#6c3483','#c39bd3','#f3d7f7'] },
    { name: 'maple syrup',       colors: ['#1a0500','#7b2000','#c25000','#e08020','#f5c880'] },
    { name: 'snowfall',          colors: ['#0a0a14','#1a1a28','#3c3c5e','#8080b0','#d0d0f0'] },
    { name: 'jade garden',       colors: ['#001a0f','#004030','#00704e','#00a060','#80d4a0'] },
    { name: 'blueberry pie',     colors: ['#0a0014','#1a0040','#3a0068','#7040a0','#c098e0'] },
    { name: 'tangerine dream',   colors: ['#1a0500','#8a2800','#e04000','#ff7700','#ffcc80'] },
    { name: 'lunar eclipse',     colors: ['#08000a','#18002a','#3a004e','#a060b0','#f0a0ff'] },
    { name: 'pine forest',       colors: ['#050f08','#0d2818','#1a4d2e','#2d7a4f','#80b894'] },
    { name: 'honey & cream',     colors: ['#1a1000','#5a3a00','#a87800','#d4aa30','#f8e8a0'] },
    { name: 'dusty rose',        colors: ['#1a0a0a','#4e2028','#8c4a5a','#c0808a','#e8c0c8'] },
    { name: 'midnight ocean',    colors: ['#00080f','#001830','#003060','#0060a0','#60b0e0'] },
    { name: 'autumn leaves',     colors: ['#100800','#4a2800','#a05000','#d08000','#f8d060'] },
    { name: 'periwinkle sky',    colors: ['#080814','#141432','#2828a0','#7080e0','#c0d0ff'] },
    { name: 'spiced chai',       colors: ['#1a0800','#6a2800','#b05818','#d09040','#f0d098'] },
    { name: 'watermelon',        colors: ['#050a00','#0f2800','#1a6000','#ff3366','#ff9999'] },
    { name: 'deep plum',         colors: ['#0a0010','#200028','#500058','#903880','#d098c8'] },
    { name: 'baby blue',         colors: ['#08101a','#102840','#206080','#60a8d8','#c0e0f8'] },
    { name: 'burnt sienna',      colors: ['#100500','#401500','#803800','#c06028','#e8a870'] },
    { name: 'electric mint',     colors: ['#001010','#003830','#006860','#00b8a0','#80ffe0'] },
    { name: 'smoky quartz',      colors: ['#0a0808','#201810','#402c20','#806040','#c0a880'] },
    { name: 'indigo dye',        colors: ['#04000f','#0c0028','#200058','#4040a0','#9090e0'] },
    { name: 'flamingo',          colors: ['#1a0008','#58002a','#c03060','#f07898','#ffd0e0'] },
    { name: 'midnight ink',      colors: ['#040410','#0c0c28','#181848','#303080','#8080c8'] },
    { name: 'fern gully',        colors: ['#040c08','#0c2818','#1a5030','#3a8850','#80c898'] },
    { name: 'topaz',             colors: ['#001018','#003048','#006888','#30a8c8','#a0d8f0'] },
    { name: 'crimson fog',       colors: ['#100008','#380018','#780030','#c04060','#f09098'] },
    { name: 'sage',              colors: ['#0a100a','#203020','#485a40','#788c68','#b8c898'] },
    { name: 'old paper',         colors: ['#1a1000','#3a2800','#7a5820','#b89860','#e8d8a0'] },
    { name: 'cotton blue',       colors: ['#08101a','#182838','#305878','#6098c8','#b8d8f8'] },
    { name: 'absinthe',          colors: ['#041004','#0c2c0c','#205820','#50a040','#a8e080'] },
    { name: 'pomegranate',       colors: ['#100004','#3a0008','#800010','#c83838','#f09898'] },
    { name: 'glacier',           colors: ['#080c10','#101828','#203040','#408090','#b0d8f0'] },
    { name: 'charcoal slate',    colors: ['#080808','#181818','#303030','#606060','#b0b0b0'] },
    { name: 'peach fuzz',        colors: ['#1a0800','#5a2800','#b06030','#e09868','#f8d8c0'] },
    { name: 'deep emerald',      colors: ['#001008','#003820','#006840','#30a870','#90d8b0'] },
    { name: 'twilight purple',   colors: ['#080010','#1c0038','#400068','#7838a8','#c080f0'] },
    { name: 'sand dunes',        colors: ['#1a1000','#5a4000','#9a7820','#c8a858','#f0d8a0'] },
    { name: 'cobalt',            colors: ['#000818','#001838','#003880','#2060c0','#80a8e8'] },
    { name: 'minted cream',      colors: ['#081010','#183028','#305848','#688878','#b0d0c0'] },
    { name: 'ruby red',          colors: ['#100005','#3a0010','#800020','#c02040','#f07080'] },
    { name: 'caramel',           colors: ['#1a0a00','#5a2800','#a05000','#d08828','#f8c878'] },
    { name: 'slate ocean',       colors: ['#060a10','#101c28','#203848','#406888','#90b8d8'] },
    { name: 'spring bud',        colors: ['#081008','#183020','#304830','#60884a','#b0d890'] },
    { name: 'amethyst',          colors: ['#0a0018','#1c0048','#400080','#8038b8','#d098f0'] },
    { name: 'warm ivory',        colors: ['#1a1008','#3a2808','#6a5020','#9a8050','#d8c8a0'] },
    { name: 'teal depth',        colors: ['#001814','#004038','#007868','#30b898','#90e8d8'] },
    { name: 'bronze age',        colors: ['#100800','#402008','#804018','#c07030','#e8b870'] },
    { name: 'rainy day',         colors: ['#08080f','#151520','#282840','#505090','#a0a0d0'] },
    { name: 'cherry cola',       colors: ['#0f0005','#2a001a','#580035','#a01055','#e06090'] },
    { name: 'olive grove',       colors: ['#080c00','#202808','#405010','#788030','#b8b870'] },
    { name: 'ink wash',          colors: ['#060608','#101018','#1c1c30','#383860','#8888b0'] },
    { name: 'sunrise cream',     colors: ['#1a0808','#5a1818','#c06038','#f0a060','#fce0c0'] },
    { name: 'pacific fog',       colors: ['#08101a','#183040','#305870','#6890b0','#c0d8f0'] },
    { name: 'cinnamon',          colors: ['#100500','#401000','#803000','#c06018','#f0a858'] },
    { name: 'periwinkle',        colors: ['#080818','#181838','#303070','#6868b8','#c0c0f0'] },
    { name: 'juniper',           colors: ['#050c08','#102818','#205030','#407848','#80b888'] },
    { name: 'butter yellow',     colors: ['#1a1400','#5a4800','#a08800','#d4c030','#f8ec90'] },
    { name: 'nightshade',        colors: ['#0a0010','#1a0030','#3c0058','#780080','#c040d0'] },
    { name: 'copper wire',       colors: ['#100800','#402c00','#8a5a10','#c89030','#f0c868'] },
    { name: 'pixel sky',         colors: ['#04080f','#0c1828','#183058','#3878c0','#88c8f8'] },
    { name: 'velvet plum',       colors: ['#0c0010','#200028','#4a005a','#8830a0','#d080e8'] },
    { name: 'warm slate',        colors: ['#100a08','#28201c','#504038','#807060','#c0b0a0'] },
    { name: 'teal dream',        colors: ['#001018','#003040','#006070','#20a0b0','#80d8e8'] },
    { name: 'carnation',         colors: ['#100008','#3c0020','#880040','#d04080','#f8a0c0'] },
    { name: 'stargazer',         colors: ['#020210','#060620','#101040','#202080','#6868c8'] },
  ];

  // ── helpers ──
  function hexToRgb(hex) {
    const h = hex.replace('#', '');
    return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
  }
  function luminance(rgb) { return 0.299*rgb[0] + 0.587*rgb[1] + 0.114*rgb[2]; }
  function contrastColor(hex) { return luminance(hexToRgb(hex)) > 140 ? '#1a1a2e' : '#f3ead9'; }

  // ── CSS vars touched when a palette is applied; theme switching is
  //    handled by removing these inline overrides (see restoreOriginals) ──
  const ROOT = document.documentElement;
  const THEME_VARS = ['--bg','--bg-2','--panel','--panel-edge','--text','--text-muted','--accent','--accent-2','--sky-1','--sky-2','--frame','--sill','--shadow','--win-bar','--win-bar-border','--win-body'];

  let lastPalette = null;
  let themeApplied = false;
  let currentIndex = -1;

  function pickRandom() {
    let idx;
    do { idx = Math.floor(Math.random() * PALETTES.length); }
    while (idx === currentIndex && PALETTES.length > 1);
    return idx;
  }

  function applyToTheme(colors) {
    const sorted = colors.slice().sort((a, b) => luminance(hexToRgb(a)) - luminance(hexToRgb(b)));
    const [darkest, dark, mid, light, lightest] = sorted;
    function mix(a, b, t) {
      const ra = hexToRgb(a), rb = hexToRgb(b);
      return '#' + [0,1,2].map(i => Math.round(ra[i]*(1-t)+rb[i]*t).toString(16).padStart(2,'0')).join('');
    }
    function darken(hex, amt) {
      const c = hexToRgb(hex);
      return '#' + c.map(v => Math.max(0, Math.round(v*(1-amt))).toString(16).padStart(2,'0')).join('');
    }
    ROOT.style.setProperty('--bg',             darkest);
    ROOT.style.setProperty('--bg-2',           mix(darkest, dark, 0.5));
    ROOT.style.setProperty('--panel',          dark);
    ROOT.style.setProperty('--panel-edge',     mix(dark, mid, 0.5));
    ROOT.style.setProperty('--text',           lightest);
    ROOT.style.setProperty('--text-muted',     mix(light, mid, 0.35));
    ROOT.style.setProperty('--accent',         colors[3]);
    ROOT.style.setProperty('--accent-2',       colors[4]);
    ROOT.style.setProperty('--sky-1',          darken(darkest, 0.1));
    ROOT.style.setProperty('--sky-2',          mix(darkest, mid, 0.3));
    ROOT.style.setProperty('--frame',          mix(dark, mid, 0.6));
    ROOT.style.setProperty('--sill',           darken(mid, 0.15));
    ROOT.style.setProperty('--shadow',         'rgba(0,0,0,0.5)');
    ROOT.style.setProperty('--win-bar',        mix(darkest, dark, 0.4));
    ROOT.style.setProperty('--win-bar-border', mix(dark, mid, 0.3));
    ROOT.style.setProperty('--win-body',       mix(darkest, dark, 0.2));
    themeApplied = true;
    tryBtn.textContent = '✅ palette applied!';
    tryWrap.style.display = 'block';
  }

  function restoreOriginals() {
    // remove the inline overrides entirely so the stylesheet's
    // data-theme rules (night/day) take back over — setting them to a
    // captured snapshot would freeze the theme at whatever it was on
    // page load and block the day/night toggle afterwards.
    THEME_VARS.forEach(v => ROOT.style.removeProperty(v));
    themeApplied = false;
    tryBtn.textContent = '🖥️ try this palette';
    tryWrap.style.display = lastPalette ? 'block' : 'none';
  }

  function renderSwatches(palette) {
    lastPalette = palette;
    swatches.innerHTML = '';
    hexRow.innerHTML = '';

    palette.colors.forEach(hex => {
      const sw = document.createElement('div');
      sw.style.cssText = `flex:1;background:${hex};border-radius:6px;cursor:pointer;transition:transform .15s;`;
      sw.title = `copy ${hex}`;
      sw.addEventListener('mouseenter', () => { sw.style.transform = 'scaleY(1.08)'; });
      sw.addEventListener('mouseleave', () => { sw.style.transform = ''; });
      sw.addEventListener('click', () => {
        if (navigator.clipboard) navigator.clipboard.writeText(hex);
        sw.style.outline = '2px solid #fff';
        setTimeout(() => { sw.style.outline = ''; }, 700);
      });
      swatches.appendChild(sw);

      const tag = document.createElement('span');
      tag.style.cssText = `font-family:'Space Mono',monospace;font-size:.6rem;padding:3px 7px;border-radius:6px;background:${hex};color:${contrastColor(hex)};cursor:pointer;`;
      tag.textContent = hex;
      tag.addEventListener('click', () => {
        if (navigator.clipboard) navigator.clipboard.writeText(hex);
      });
      hexRow.appendChild(tag);
    });

    tryWrap.style.display = 'block';
    tryBtn.textContent = themeApplied ? '✅ palette applied!' : '🖥️ try this palette';
    if (statusEl) statusEl.textContent = `✨ ${palette.name}`;
  }

  function generate() {
    const idx = pickRandom();
    currentIndex = idx;
    renderSwatches(PALETTES[idx]);
    if (themeApplied) applyToTheme(PALETTES[idx].colors);
  }

  // ── wire buttons ──
  shuffleBtn.addEventListener('click', generate);

  tryBtn.addEventListener('click', () => {
    if (!lastPalette) return;
    if (themeApplied) { restoreOriginals(); } else { applyToTheme(lastPalette.colors); }
  });

  resetBtn.addEventListener('click', restoreOriginals);

  // Show a random palette on first open
  const paletteWin = document.getElementById('win-palette');
  if (paletteWin) {
    let opened = false;
    new MutationObserver(() => {
      if (!opened && paletteWin.classList.contains('visible')) {
        opened = true;
        generate();
      }
    }).observe(paletteWin, { attributes: true, attributeFilter: ['class'] });
  }
})();