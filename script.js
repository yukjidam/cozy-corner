// ===== CUTE SOUND ENGINE =====
// All sounds are synthesized with Web Audio API — no files needed.
const CuteSound = (function(){
  // Create and unlock the AudioContext on the very first click anywhere,
  // so it's already running by the time a dock button fires its handler.
  const ctx = new (window.AudioContext || window.webkitAudioContext)();

  function unlock(){
    if(ctx.state === 'suspended') ctx.resume();
    document.removeEventListener('click', unlock, true);
  }
  document.addEventListener('click', unlock, true); // capture phase = fires first

  function getCtx(){ return ctx; }

  // ── open: a soft two-tone "pop" like a bubble ──
  function playOpen(){
    const c = getCtx();
    const t = c.currentTime;

    // first tone — quick chirp
    const osc1 = c.createOscillator();
    const gain1 = c.createGain();
    osc1.connect(gain1); gain1.connect(c.destination);
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(520, t);
    osc1.frequency.exponentialRampToValueAtTime(780, t + 0.06);
    gain1.gain.setValueAtTime(0.0, t);
    gain1.gain.linearRampToValueAtTime(0.18, t + 0.01);
    gain1.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);
    osc1.start(t); osc1.stop(t + 0.14);

    // second tone — slight echo sparkle
    const osc2 = c.createOscillator();
    const gain2 = c.createGain();
    osc2.connect(gain2); gain2.connect(c.destination);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1040, t + 0.04);
    osc2.frequency.exponentialRampToValueAtTime(1300, t + 0.10);
    gain2.gain.setValueAtTime(0.0, t + 0.04);
    gain2.gain.linearRampToValueAtTime(0.09, t + 0.055);
    gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    osc2.start(t + 0.04); osc2.stop(t + 0.19);
  }

  // ── close: a gentle descending "whoosh" ──
  function playClose(){
    const c = getCtx();
    const t = c.currentTime;

    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain); gain.connect(c.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(640, t);
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.18);
    gain.gain.setValueAtTime(0.0, t);
    gain.gain.linearRampToValueAtTime(0.14, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    osc.start(t); osc.stop(t + 0.23);

    // soft noise layer for the "whoosh" texture
    const bufSize = c.sampleRate * 0.2;
    const buf = c.createBuffer(1, bufSize, c.sampleRate);
    const data = buf.getChannelData(0);
    for(let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1);
    const noise = c.createBufferSource();
    noise.buffer = buf;
    const noiseFilter = c.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(800, t);
    noiseFilter.frequency.exponentialRampToValueAtTime(200, t + 0.2);
    noiseFilter.Q.value = 1.2;
    const noiseGain = c.createGain();
    noiseGain.gain.setValueAtTime(0.06, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
    noise.connect(noiseFilter); noiseFilter.connect(noiseGain); noiseGain.connect(c.destination);
    noise.start(t); noise.stop(t + 0.21);
  }

  // ── minimize: a tiny descending pip ──
  function playMinimize(){
    const c = getCtx();
    const t = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain); gain.connect(c.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.10);
    gain.gain.setValueAtTime(0.0, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
    osc.start(t); osc.stop(t + 0.15);
  }

  return { playOpen, playClose, playMinimize };
})();

// ===== CLOCK =====
(function(){
  const timeEl=document.getElementById('clockTime'),dateEl=document.getElementById('clockDate'),dayEl=document.getElementById('clockDay');
  const days=['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  const months=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  function tick(){
    const now=new Date();
    timeEl.textContent=now.getHours().toString().padStart(2,'0')+':'+now.getMinutes().toString().padStart(2,'0');
    dateEl.textContent=months[now.getMonth()]+' '+String(now.getDate()).padStart(2,'0')+' · '+now.getFullYear();
    dayEl.textContent=days[now.getDay()];
  }
  tick(); setInterval(tick,1000);
})();

// ===== CALENDAR =====
(function(){
  const monthEl=document.getElementById('calMonth'),gridEl=document.getElementById('calGrid');
  const months=['january','february','march','april','may','june','july','august','september','october','november','december'];
  const dows=['su','mo','tu','we','th','fr','sa'];
  const now=new Date(),year=now.getFullYear(),month=now.getMonth(),today=now.getDate();
  monthEl.textContent=months[month]+' '+year;
  dows.forEach(d=>{ const el=document.createElement('div'); el.className='cal-dow'; el.textContent=d; gridEl.appendChild(el); });
  const firstDay=new Date(year,month,1).getDay();
  for(let i=0;i<firstDay;i++){ const el=document.createElement('div'); el.className='cal-day'; gridEl.appendChild(el); }
  const daysInMonth=new Date(year,month+1,0).getDate();
  for(let d=1;d<=daysInMonth;d++){ const el=document.createElement('div'); el.className='cal-day'+(d===today?' today':''); el.textContent=d; gridEl.appendChild(el); }
})();

// ===== WIDGET DRAG =====
(function(){
  function makeDraggable(el){
    let dragging=false,startX,startY,originLeft,originTop;
    function getRotation(){ const t=el.style.transform||'',m=t.match(/rotate\(([^)]+)\)/); return m?m[1]:'0deg'; }
    function startDrag(cx,cy){
      if(window.innerWidth<=720)return;
      dragging=true; el.classList.add('dragging');
      const rect=el.getBoundingClientRect();
      el.style.right='auto'; el.style.bottom='auto';
      el.style.left=rect.left+'px'; el.style.top=rect.top+'px';
      startX=cx; startY=cy; originLeft=rect.left; originTop=rect.top;
    }
    function onMove(cx,cy){
      if(!dragging)return;
      const rot=getRotation(),vw=window.innerWidth,vh=window.innerHeight,w=el.offsetWidth,h=el.offsetHeight;
      el.style.left=Math.max(0,Math.min(originLeft+(cx-startX),vw-w))+'px';
      el.style.top=Math.max(0,Math.min(originTop+(cy-startY),vh-h))+'px';
      el.style.transform=rot!=='0deg'?'rotate('+rot+')':'';
    }
    function endDrag(){ if(!dragging)return; dragging=false; el.classList.remove('dragging'); }
    el.addEventListener('mousedown',e=>{ startDrag(e.clientX,e.clientY); e.preventDefault(); });
    window.addEventListener('mousemove',e=>onMove(e.clientX,e.clientY));
    window.addEventListener('mouseup',endDrag);
    el.addEventListener('touchstart',e=>{ const t=e.touches[0]; startDrag(t.clientX,t.clientY); },{passive:true});
    window.addEventListener('touchmove',e=>{ const t=e.touches[0]; onMove(t.clientX,t.clientY); },{passive:true});
    window.addEventListener('touchend',endDrag);
  }
  document.querySelectorAll('.desk-widget').forEach(makeDraggable);
  document.querySelectorAll('.sticky').forEach(makeDraggable);
})();

// ===== WINDOW MANAGEMENT =====
const allWins=document.querySelectorAll('.win');
let zTop=150;
const defaultPositions={'win-about':{x:80,y:80},'win-links':{x:110,y:110},'win-work':{x:140,y:80},'win-faq':{x:170,y:110},'win-contact':{x:200,y:80},'win-logs':{x:220,y:100}};
function isMobile(){ return window.innerWidth<=720; }
function clampPosition(win,x,y){ const vw=window.innerWidth,vh=window.innerHeight,w=win.offsetWidth,h=win.offsetHeight; return{x:Math.max(0,Math.min(x,vw-w)),y:Math.max(0,Math.min(y,vh-40))}; }
function focusWin(win){ zTop++; win.style.zIndex=zTop; win.classList.add('focused'); allWins.forEach(w=>{if(w!==win)w.classList.remove('focused');}); }

function dockBtnFor(winId){ return document.querySelector(`.dock button[data-win="${winId.replace('win-','')}"]`); }

// Sets the CSS vars the genie animation reads: the dock icon's center
// (the transform-origin, so the window visually shrinks INTO that point)
// and how far/how much it needs to translate+scale to get there.
function setGenieTarget(win,btn){
  if(!btn || isMobile()){ return; } // mobile uses a plain slide-down, no per-icon target needed
  const wr=win.getBoundingClientRect();
  const br=btn.getBoundingClientRect();
  const targetX=br.left+br.width/2, targetY=br.top+br.height/2;
  const originX=targetX-wr.left, originY=targetY-wr.top;
  win.style.setProperty('--mz-ox', originX+'px');
  win.style.setProperty('--mz-oy', originY+'px');
  win.style.setProperty('--mz-tx', (targetX-(wr.left+wr.width/2))+'px');
  win.style.setProperty('--mz-ty', (targetY-(wr.top+wr.height/2))+'px');
  win.style.setProperty('--mz-sx', Math.max(.04, 26/wr.width));
  win.style.setProperty('--mz-sy', Math.max(.04, 26/wr.height));
}

function openWin(id){
  const win=document.getElementById(id); if(!win)return;
  if(win.classList.contains('visible')){
    if(win.classList.contains('minimized')){ restoreWin(win); return; }
    // already open and not minimized → tapping its dock icon again minimizes it
    minimizeWin(win);
    return;
  }
  if(!isMobile()){
    const pos=defaultPositions[id]||{x:120,y:120};
    const jitter={x:Math.random()*20-10,y:Math.random()*20-10};
    win.style.display='block';
    const clamped=clampPosition(win,pos.x+jitter.x,pos.y+jitter.y);
    win.style.left=clamped.x+'px'; win.style.top=clamped.y+'px';
    win.style.display='';
  }
  win.classList.remove('minimized','minimizing','restoring');
  win.classList.add('visible'); focusWin(win); updateDockBtn(id,true);
  CuteSound.playOpen();
  // let the entrance pop play once, then never again until a real close
  requestAnimationFrame(()=>win.classList.add('opened-once'));
}

function minimizeWin(win){
  if(!win.classList.contains('visible') || win.classList.contains('minimized'))return;
  const btn=dockBtnFor(win.id);
  setGenieTarget(win,btn);
  win.classList.remove('restoring');
  win.classList.add('minimizing');
  win.classList.remove('focused');
  CuteSound.playMinimize();
  const done=()=>{
    win.classList.remove('minimizing');
    win.classList.add('minimized');
    win.removeEventListener('transitionend',onEnd);
  };
  function onEnd(e){ if(e.propertyName==='transform'||e.propertyName==='opacity') done(); }
  win.addEventListener('transitionend',onEnd);
  // safety fallback in case transitionend doesn't fire (e.g. tab was backgrounded)
  setTimeout(done, 460);
  // dock icon stays lit — the window still "exists", just tucked away
}

function restoreWin(win){
  // unhide first — geometry can't be measured while display:none
  win.classList.remove('minimized');
  const btn=dockBtnFor(win.id);
  setGenieTarget(win,btn);
  win.classList.add('minimizing'); // start from the shrunk/at-dock state
  void win.offsetWidth; // force the browser to register the start state
  win.classList.remove('minimizing');
  win.classList.add('restoring');
  focusWin(win);
  const done=()=>{
    win.classList.remove('restoring');
    win.removeEventListener('transitionend',onEnd);
  };
  function onEnd(e){ if(e.propertyName==='transform'||e.propertyName==='opacity') done(); }
  win.addEventListener('transitionend',onEnd);
  setTimeout(done, 420);
}

function closeWin(win){
  CuteSound.playClose();
  win.classList.remove('visible','focused','minimized','minimizing','restoring','opened-once');
  updateDockBtn(win.id,false);
  const body=win.querySelector('.win-body');
  if(body) body.scrollTop=0;
}
function updateDockBtn(winId,open){ const btn=dockBtnFor(winId); if(btn)btn.classList.toggle('win-open',open); }

document.querySelectorAll('.dock button').forEach(btn=>{
  if(btn.dataset.win==='player')return;
  btn.addEventListener('click',()=>{
    btn.classList.remove('dock-bounce'); void btn.offsetWidth; btn.classList.add('dock-bounce');
    btn.addEventListener('animationend',()=>btn.classList.remove('dock-bounce'),{once:true});
    openWin('win-'+btn.dataset.win);
  });
});
document.querySelectorAll('.win .win-dot.close').forEach(dot=>dot.addEventListener('click',e=>{e.stopPropagation();closeWin(dot.closest('.win'));}));
document.querySelectorAll('.win .win-dot.min').forEach(dot=>dot.addEventListener('click',e=>{e.stopPropagation();minimizeWin(dot.closest('.win'));}));
allWins.forEach(win=>{
  win.addEventListener('mousedown',()=>focusWin(win));
  win.addEventListener('touchstart',()=>focusWin(win),{passive:true});
});

// ===== SWIPE DOWN TO CLOSE (mobile bottom sheets) =====
document.querySelectorAll('.win').forEach(win => {
  let swipeStartY = null, swipeCurrentY = 0, swipeSwiping = false;
  function onSwipeStart(e){
    if(!isMobile()) return;
    // only initiate from the handle/bar area (top 50px of the sheet)
    const rect = win.getBoundingClientRect();
    const touch = e.touches[0];
    if(touch.clientY - rect.top > 50) return;
    swipeStartY = touch.clientY;
    swipeSwiping = true;
    win.style.transition = 'none';
  }
  function onSwipeMove(e){
    if(!swipeSwiping || swipeStartY === null) return;
    swipeCurrentY = e.touches[0].clientY - swipeStartY;
    if(swipeCurrentY < 0) swipeCurrentY = 0;
    win.style.transform = `translateY(${swipeCurrentY}px)`;
  }
  function onSwipeEnd(){
    if(!swipeSwiping) return;
    swipeSwiping = false;
    win.style.transition = '';
    if(swipeCurrentY > 80){
      CuteSound.playClose();
      win.style.transform = `translateY(100%)`;
      setTimeout(()=>{ win.style.transform = ''; closeWin(win); }, 260);
    } else {
      win.style.transform = '';
    }
    swipeStartY = null; swipeCurrentY = 0;
  }
  win.addEventListener('touchstart', onSwipeStart, {passive:true});
  window.addEventListener('touchmove', onSwipeMove, {passive:true});
  window.addEventListener('touchend', onSwipeEnd);
});

// ===== DRAG WINDOWS =====
document.querySelectorAll('.win .win-bar').forEach(bar=>{
  let dragging=false,startX,startY,winX,winY;
  function startDrag(cx,cy){ if(isMobile())return; const win=bar.closest('.win'); dragging=true; startX=cx;startY=cy; winX=parseInt(win.style.left)||0; winY=parseInt(win.style.top)||0; focusWin(win); bar.style.cursor='grabbing'; }
  function onMove(cx,cy){ if(!dragging)return; const win=bar.closest('.win'),dx=cx-startX,dy=cy-startY,clamped=clampPosition(win,winX+dx,winY+dy); win.style.left=clamped.x+'px'; win.style.top=clamped.y+'px'; }
  function endDrag(){ dragging=false; bar.style.cursor='grab'; }
  bar.addEventListener('mousedown',e=>{ if(e.target.closest('.win-dot'))return; startDrag(e.clientX,e.clientY); e.preventDefault(); });
  window.addEventListener('mousemove',e=>onMove(e.clientX,e.clientY));
  window.addEventListener('mouseup',endDrag);
  bar.addEventListener('touchstart',e=>{ if(e.target.closest('.win-dot'))return; const t=e.touches[0]; startDrag(t.clientX,t.clientY); },{passive:true});
  window.addEventListener('touchmove',e=>{ const t=e.touches[0]; onMove(t.clientX,t.clientY); },{passive:true});
  window.addEventListener('touchend',endDrag);
});

// ===== THEME TOGGLE =====
document.getElementById('themeToggle').addEventListener('click',()=>{ const r=document.documentElement; r.setAttribute('data-theme',r.getAttribute('data-theme')==='night'?'day':'night'); });

// ===== VINYL TOGGLE =====
const vinylToggle=document.getElementById('vinylToggle'),scene=document.querySelector('.scene');

// ===== BGM SYSTEM =====
(function(){
  const BGM = {
    night: 'assets/bgm/nightmode.mp3',
    day:   'assets/bgm/daymode.mp3',
  };
  const FADE_IN_DURATION  = 3000; // ms
  const FADE_OUT_DURATION = 2000; // ms
  const TARGET_VOLUME     = 0.22; // soft background level

  let audio       = new Audio();
  audio.loop      = false; // we handle looping ourselves for fade effect
  let bgmEnabled  = true;
  let fadeRaf     = null;
  let currentTheme = null;
  let playerActive = false;
  let bgmStarting  = false; // guard against concurrent startBGM calls

  function getTheme(){ return document.documentElement.getAttribute('data-theme') || 'night'; }

  function cancelFade(){ if(fadeRaf){ cancelAnimationFrame(fadeRaf); fadeRaf=null; } }

  function fadeTo(targetVol, duration, onDone){
    cancelFade();
    const startVol  = audio.volume;
    const startTime = performance.now();
    function step(now){
      const t = Math.min((now - startTime) / duration, 1);
      audio.volume = startVol + (targetVol - startVol) * t;
      if(t < 1){ fadeRaf = requestAnimationFrame(step); }
      else{ audio.volume = targetVol; fadeRaf = null; if(onDone) onDone(); }
    }
    fadeRaf = requestAnimationFrame(step);
  }

  function playBGM(theme){
    const src = BGM[theme];
    if(!src) return;
    currentTheme = theme;
    audio.src    = src;
    audio.volume = 0;
    audio.muted  = false; // always unmute when playing — user gesture has occurred by this point
    audio.currentTime = 0;
    bgmStarting = true;
    audio.play().then(() => {
      bgmStarting = false;
      fadeTo(TARGET_VOLUME, FADE_IN_DURATION);
    }).catch(()=>{ bgmStarting = false; });
  }

  // Loop with fade out → fade in
  audio.addEventListener('timeupdate', () => {
    if(!audio.duration || audio.paused) return;
    const remaining = audio.duration - audio.currentTime;
    if(remaining <= FADE_OUT_DURATION / 1000 && audio.volume > 0.01){
      fadeTo(0, remaining * 1000, () => {
        audio.currentTime = 0;
        audio.play().then(() => fadeTo(TARGET_VOLUME, FADE_IN_DURATION)).catch(()=>{});
      });
    }
  });

  function startBGM(){
    if(playerActive || bgmStarting) return;
    const theme = getTheme();
    if(audio.paused || currentTheme !== theme){
      if(!audio.paused && currentTheme !== theme){
        // switch theme: fade out then switch
        fadeTo(0, FADE_OUT_DURATION, () => { audio.pause(); playBGM(theme); });
      } else {
        // resume or fresh start
        if(audio.src && currentTheme === theme && audio.currentTime > 0){
          audio.play().then(()=>fadeTo(TARGET_VOLUME, FADE_IN_DURATION)).catch(()=>{});
        } else {
          playBGM(theme);
        }
      }
    }
  }

  function pauseBGM(){ cancelFade(); fadeTo(0, FADE_OUT_DURATION, ()=>audio.pause()); }

  // Vinyl toggle: visual + BGM
  vinylToggle.addEventListener('click', () => {
    bgmEnabled = !bgmEnabled;
    scene.classList.toggle('lofi-on', bgmEnabled);
    vinylToggle.classList.toggle('active', bgmEnabled);
    vinylToggle.setAttribute('aria-pressed', bgmEnabled);
    if(bgmEnabled) startBGM(); else pauseBGM();
  });

  // Theme switch → swap BGM
  new MutationObserver(() => {
    if(bgmEnabled && !playerActive) startBGM();
  }).observe(document.documentElement, { attributes:true, attributeFilter:['data-theme'] });

  // Pause BGM when player starts, resume when player stops
  window.BGMPlayer = {
    pause: pauseBGM,
    resume: () => { if(bgmEnabled) startBGM(); },
    isEnabled: () => bgmEnabled,
    setEnabled: (val) => { bgmEnabled = val; },
    wasManuallyDisabled: () => !bgmEnabled,
  };

  // Unmute on first user interaction (muted autoplay needs a gesture to unmute)
  function tryAutoStart(){
    audio.muted = false;
    if(bgmEnabled){
      const theme = getTheme();
      if(bgmStarting){
        // Muted play is still launching — if theme changed, abort it and restart with correct theme
        if(currentTheme !== theme){ audio.pause(); bgmStarting = false; playBGM(theme); }
        // else: play resolves soon and will fade in unmuted (muted=false already set above)
      } else {
        // Re-call startBGM to pick up the correct current theme (may have changed)
        startBGM();
      }
      scene.classList.add('lofi-on');
      vinylToggle.classList.add('active');
      vinylToggle.setAttribute('aria-pressed','true');
    }
    document.removeEventListener('click', tryAutoStart);
    document.removeEventListener('keydown', tryAutoStart);
  }
  document.addEventListener('click', tryAutoStart);
  document.addEventListener('keydown', tryAutoStart);

  // Try muted autoplay immediately — browsers always allow muted autoplay,
  // so this guarantees playback actually starts on page load.
  setTimeout(()=>{
    audio.muted = true;
    startBGM();
    scene.classList.add('lofi-on');
    vinylToggle.classList.add('active');
    vinylToggle.setAttribute('aria-pressed','true');
  }, 300);
})();


// ===== FAQ =====
document.querySelectorAll('.faq-q').forEach(q=>{
  q.addEventListener('click',()=>{
    const item=q.parentElement,ans=item.querySelector('.faq-a'),isOpen=item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i=>{ i.classList.remove('open'); i.querySelector('.faq-a').style.maxHeight=null; });
    if(!isOpen){ item.classList.add('open'); ans.style.maxHeight=ans.scrollHeight+'px'; }
  });
});

// ===== NOW PLAYING MARQUEE =====
const npDot   = document.getElementById('npDot');
const npInner = document.getElementById('npInner');
const npText  = document.getElementById('npText');

// Config
const MARQUEE_SPEED  = 42;   // px per second
const PAUSE_AFTER    = 1100; // ms pause at start before each loop

let marqueeRAF  = null;
let marqueePx   = 0;
let loopWidth   = 0;  // width of one copy (text + gap) — we scroll this far then snap
let isPaused    = false;
let pauseTimer  = null;
let lastTS      = null;
let marqueeRunning = false;

function setNowPlayingText(title, artist, playing) {
  const label = playing
    ? `♪  ${artist}  —  ${title}`
    : '♪  nothing playing yet  —  open the player below';
  npDot.classList.toggle('idle', !playing);
  clearMarquee();
  buildMarquee(label);
}

function clearMarquee() {
  marqueeRunning = false;
  if (marqueeRAF) { cancelAnimationFrame(marqueeRAF); marqueeRAF = null; }
  if (pauseTimer) { clearTimeout(pauseTimer); pauseTimer = null; }
  // Reset inner to just the original span
  npInner.innerHTML = '';
  const span = document.createElement('span');
  span.className = 'np-item';
  span.id = 'npText';
  npInner.appendChild(span);
  npInner.style.transform = 'translateX(0)';
  marqueePx = 0;
  isPaused  = false;
  lastTS    = null;
}

function buildMarquee(label) {
  const textEl = document.getElementById('npText');
  textEl.textContent = label;

  // Wait two frames for layout to settle
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const containerW = npInner.parentElement.offsetWidth;
    const textW      = textEl.offsetWidth;

    // Only scroll if text overflows the container
    if (textW <= containerW) {
      marqueeRunning = false;
      return;
    }

    // Long text — carousel scroll. Gap between repetitions:
    const GAP = 64; // px of invisible space between end and start of next copy
    loopWidth = textW + GAP;

    // Build: [original][clone] side by side, inner is 2× wide
    textEl.style.paddingRight = GAP + 'px';

    const clone = textEl.cloneNode(true);
    clone.removeAttribute('id');
    npInner.appendChild(clone);

    // Kick off with a pause so user can read from the start
    marqueePx      = 0;
    isPaused       = true;
    marqueeRunning = true;
    lastTS         = null;

    pauseTimer = setTimeout(() => {
      isPaused = false;
      lastTS   = null;
      marqueeRAF = requestAnimationFrame(tickMarquee);
    }, PAUSE_AFTER);
  }));
}

function tickMarquee(ts) {
  if (!marqueeRunning) return;
  if (isPaused) return;

  if (lastTS === null) lastTS = ts;
  const dt = (ts - lastTS) / 1000;
  lastTS = ts;

  marqueePx += MARQUEE_SPEED * dt;

  // Once we've scrolled exactly one copy-width, snap back & pause
  if (marqueePx >= loopWidth) {
    marqueePx = 0;
    npInner.style.transform = 'translateX(0)';
    isPaused = true;
    lastTS   = null;
    pauseTimer = setTimeout(() => {
      isPaused = false;
      lastTS   = null;
      marqueeRAF = requestAnimationFrame(tickMarquee);
    }, PAUSE_AFTER);
    return;
  }

  npInner.style.transform = `translateX(-${marqueePx}px)`;
  marqueeRAF = requestAnimationFrame(tickMarquee);
}

// ===== AUDIO VISUALIZER =====
const vizCanvas  = document.getElementById('vizCanvas');
const vizWrap    = document.getElementById('vizWrap');
const vizCtx     = vizCanvas.getContext('2d');

let audioCtx     = null;
let analyser     = null;
let sourceNode   = null;
let vizRAF       = null;
let vizActive    = false;

function getAccentColor() {
  return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#f3b27a';
}
function getAccent2Color() {
  return getComputedStyle(document.documentElement).getPropertyValue('--accent-2').trim() || '#e6a0b8';
}

function initAudioContext(audioEl) {
  if (audioCtx) return; // already set up
  try {
    audioCtx  = new (window.AudioContext || window.webkitAudioContext)();
    analyser  = audioCtx.createAnalyser();
    analyser.fftSize = 64;
    analyser.smoothingTimeConstant = 0.82;
    sourceNode = audioCtx.createMediaElementSource(audioEl);
    sourceNode.connect(analyser);
    analyser.connect(audioCtx.destination);
  } catch(e) {
    console.warn('AudioContext unavailable:', e);
  }
}

function resizeVizCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const w   = vizWrap.offsetWidth;
  const h   = 38;
  vizCanvas.width  = w * dpr;
  vizCanvas.height = h * dpr;
  vizCtx.scale(dpr, dpr);
}

function startViz() {
  if (vizActive) return;
  vizActive = true;
  vizWrap.classList.add('active');
  resizeVizCanvas();
  drawViz();
}

function stopViz() {
  vizActive = false;
  vizWrap.classList.remove('active');
  if (vizRAF) { cancelAnimationFrame(vizRAF); vizRAF = null; }
  vizCtx.clearRect(0, 0, vizCanvas.width, vizCanvas.height);
}

function drawViz() {
  if (!vizActive) return;
  vizRAF = requestAnimationFrame(drawViz);

  const w   = vizCanvas.width  / (window.devicePixelRatio || 1);
  const h   = vizCanvas.height / (window.devicePixelRatio || 1);
  vizCtx.clearRect(0, 0, w, h);

  if (!analyser) {
    // Fallback idle animation — gentle waving bars
    drawIdleBars(w, h);
    return;
  }

  const bufLen = analyser.frequencyBinCount;
  const data   = new Uint8Array(bufLen);
  analyser.getByteFrequencyData(data);

  const accent  = getAccentColor();
  const accent2 = getAccent2Color();

  // Use only the lower portion of bins (more musically interesting)
  const useBins  = Math.min(bufLen, 24);
  const barW     = (w / useBins) - 1.5;
  const radius   = Math.max(2, barW / 2);

  for (let i = 0; i < useBins; i++) {
    const norm   = data[i] / 255;
    const barH   = Math.max(3, norm * h * 0.92);
    const x      = i * (barW + 1.5);
    const y      = h - barH;

    // Gradient per bar: accent → accent-2
    const t      = i / useBins;
    const grad   = vizCtx.createLinearGradient(0, y, 0, h);
    grad.addColorStop(0,   interpolateHex(accent, accent2, t));
    grad.addColorStop(1,   accent + '55');
    vizCtx.fillStyle = grad;

    // Rounded-top rect
    vizCtx.beginPath();
    vizCtx.moveTo(x + radius, y);
    vizCtx.lineTo(x + barW - radius, y);
    vizCtx.quadraticCurveTo(x + barW, y, x + barW, y + radius);
    vizCtx.lineTo(x + barW, h);
    vizCtx.lineTo(x, h);
    vizCtx.lineTo(x, y + radius);
    vizCtx.quadraticCurveTo(x, y, x + radius, y);
    vizCtx.closePath();
    vizCtx.fill();
  }
}

function drawIdleBars(w, h) {
  const n      = 24;
  const barW   = (w / n) - 1.5;
  const radius = Math.max(2, barW / 2);
  const now    = performance.now() / 1000;
  const accent = getAccentColor();

  for (let i = 0; i < n; i++) {
    const wave = Math.sin(now * 1.8 + i * 0.55) * 0.5 + 0.5;
    const barH = 3 + wave * (h * 0.35);
    const x    = i * (barW + 1.5);
    const y    = h - barH;

    vizCtx.fillStyle = accent + '55';
    vizCtx.beginPath();
    vizCtx.moveTo(x + radius, y);
    vizCtx.lineTo(x + barW - radius, y);
    vizCtx.quadraticCurveTo(x + barW, y, x + barW, y + radius);
    vizCtx.lineTo(x + barW, h);
    vizCtx.lineTo(x, h);
    vizCtx.lineTo(x, y + radius);
    vizCtx.quadraticCurveTo(x, y, x + radius, y);
    vizCtx.closePath();
    vizCtx.fill();
  }
}

// Hex colour interpolation helper
function interpolateHex(hex1, hex2, t) {
  const parse = h => { h = h.trim().replace('#',''); if(h.length===3) h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2]; return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]; };
  const [r1,g1,b1] = parse(hex1);
  const [r2,g2,b2] = parse(hex2);
  const r = Math.round(r1 + (r2-r1)*t);
  const g = Math.round(g1 + (g2-g1)*t);
  const b = Math.round(b1 + (b2-b1)*t);
  return `rgb(${r},${g},${b})`;
}

window.addEventListener('resize', () => { if (vizActive) resizeVizCanvas(); });

// ===== PLAYER STATION =====
const playerStation=document.getElementById('playerStation');
const miniBar=document.getElementById('miniBar');
const playerAudio=document.getElementById('playerAudio');
const playerPlayBtn=document.getElementById('playerPlayBtn');
const playerScrub=document.getElementById('playerScrub');
const playerVol=document.getElementById('playerVol');
const playerTimeCur=document.getElementById('playerTimeCurrent');
const playerTimeTot=document.getElementById('playerTimeTotal');
const playerTrackEl=document.getElementById('playerTrack');
const playerArtistEl=document.getElementById('playerArtist');
const playerGenreLabel=document.getElementById('playerGenreLabel');
const miniPlayBtn=document.getElementById('miniPlayBtn');
const miniPrevBtn=document.getElementById('miniPrevBtn');
const miniNextBtn=document.getElementById('miniNextBtn');
const miniProgressFill=document.getElementById('miniProgressFill');
const miniTrackEl=document.getElementById('miniTrack');
const miniArtistEl=document.getElementById('miniArtist');
const playerDockBtn=document.querySelector('.dock button[data-win="player"]');
const trackListEl=document.getElementById('trackList');
const genreTabsEl=document.getElementById('genreTabs');

const GENRES={
  chill:{label:'🌙 chill lofi',cover:'assets/chill_lofi.png',tracks:[
    {title:'Home',artist:'Cassidy Goodwin',dur:'2:15',src:'assets/chill lofi/Cassidy Goodwin - Home.mp3',thumb:'assets/chill lofi/Cassidy Goodwin - Home.jpg'},
    {title:'Changing Season',artist:'Cloudy Purle',dur:'2:39',src:'assets/chill lofi/Cloudy Purle - Changing Season.mp3',thumb:'assets/chill lofi/Cloudy Purle - Changing Season.jpg'},
    {title:'wind down',artist:'flovry',dur:'2:14',src:'assets/chill lofi/flovry - wind down.mp3',thumb:'assets/chill lofi/flovry - wind down.jpg'},
    {title:'Feathers',artist:'Kupla',dur:'1:55',src:'assets/chill lofi/Kupla - Feathers.mp3',thumb:'assets/chill lofi/Kupla - Feathers.jpg'},
    {title:'Dreaming of Her',artist:'mellow fox',dur:'1:12',src:'assets/chill lofi/mellow fox - Dreaming of Her.mp3',thumb:'assets/chill lofi/mellow fox - Dreaming of Her.jpg'},
    {title:'bikes at the pier',artist:'Nogymx',dur:'4:32',src:'assets/chill lofi/Nogymx - bikes at the pier.mp3',thumb:'assets/chill lofi/Nogymx - bikes at the pier.jpg'},
    {title:'When You Said Hi',artist:'NVTHVN',dur:'1:27',src:'assets/chill lofi/NVTHVN - When You Said Hi.mp3',thumb:'assets/chill lofi/NVTHVN - When You Said Hi.jpg'},
    {title:"It's Raining Outside",artist:'Outgoing Hikikomori',dur:'2:18',src:"assets/chill lofi/Outgoing Hikikomori - It's Raining Outside.mp3",thumb:"assets/chill lofi/Outgoing Hikikomori - It's Raining Outside.jpg"},
    {title:'Relief',artist:'sheath',dur:'2:22',src:'assets/chill lofi/sheath - Relief.mp3',thumb:'assets/chill lofi/sheath - Relief.jpg'},
    {title:'Every Summer',artist:"through & through, J'san",dur:'2:00',src:"assets/chill lofi/through & through, J'san - Every Summer.mp3",thumb:"assets/chill lofi/through & through, J'san - Every Summer.jpg"},
  ]},
  study:{label:'📚 study lofi',cover:'assets/study_lofi.png',tracks:[
    {title:'Life is beautiful',artist:'Aisake',dur:'3:00',src:'assets/study lofi/Aisake - Life is beautiful.mp3',thumb:'assets/study lofi/Aisake - Life is beautiful.jpg'},
    {title:'Action Speaks The Beat',artist:'chill chill journal',dur:'3:20',src:'assets/study lofi/chill chill journal - Action Speaks The Beat.mp3',thumb:'assets/study lofi/chill chill journal - Action Speaks The Beat.jpg'},
    {title:'Forget',artist:'Dosi',dur:'2:55',src:'assets/study lofi/Dosi - Forget.mp3',thumb:'assets/study lofi/Dosi - Forget.jpg'},
    {title:'Cotton Cloud',artist:'fatb',dur:'3:10',src:'assets/study lofi/fatb - Cotton Cloud.mp3',thumb:'assets/study lofi/fatb - Cotton Cloud.jpg'},
    {title:'Lilac',artist:'Jinsang',dur:'3:30',src:'assets/study lofi/Jinsang - Lilac.mp3',thumb:'assets/study lofi/Jinsang - Lilac.jpg'},
    {title:'rain on venus',artist:'ornaut',dur:'2:45',src:'assets/study lofi/ornaut - rain on venus.mp3',thumb:'assets/study lofi/ornaut - rain on venus.jpg'},
    {title:"Ridin' Solo",artist:'Prompt Society',dur:'3:15',src:"assets/study lofi/Prompt Society - Ridin' Solo.mp3",thumb:"assets/study lofi/Prompt Society - Ridin' Solo.jpg"},
    {title:'animal sports',artist:'sova',dur:'2:50',src:'assets/study lofi/sova - animal sports.mp3',thumb:'assets/study lofi/sova - animal sports.jpg'},
    {title:'Tiramisu',artist:'sova',dur:'3:05',src:'assets/study lofi/sova - Tiramisu.mp3',thumb:'assets/study lofi/sova - Tiramisu.jpg'},
    {title:'Sudachi',artist:'yuhei miura',dur:'3:25',src:'assets/study lofi/yuhei miura - Sudachi.mp3',thumb:'assets/study lofi/yuhei miura - Sudachi.jpg'},
  ]},
  jazz:{label:'🎷 jazz lofi',cover:'assets/jazz_lofi.png',tracks:[
    {title:'Envejecer',artist:'Erameld',dur:'1:13',src:'assets/jazz lofi/Erameld - Envejecer.mp3',thumb:'assets/jazz lofi/Erameld - Envejecer.jpg'},
    {title:'Yume',artist:'Kalaido',dur:'3:01',src:'assets/jazz lofi/Kalaido - Yume.mp3',thumb:'assets/jazz lofi/Kalaido - Yume.jpg'},
    {title:'The Way of the RAIN',artist:'Orihusay',dur:'2:40',src:'assets/jazz lofi/Orihusay - The Way of the RAIN.mp3',thumb:'assets/jazz lofi/Orihusay - The Way of the RAIN.jpg'},
    {title:'Yoake',artist:'paniyolo',dur:'1:53',src:'assets/jazz lofi/paniyolo - Yoake.mp3',thumb:'assets/jazz lofi/paniyolo - Yoake.jpg'},
    {title:'The Shining Kingdom',artist:'Raimu',dur:'2:23',src:'assets/jazz lofi/Raimu - The Shining Kingdom.mp3',thumb:'assets/jazz lofi/Raimu - The Shining Kingdom.jpg'},
    {title:'Hananoen',artist:'Sakamoto Juunosuke',dur:'2:46',src:'assets/jazz lofi/Sakamoto Juunosuke - Hananoen.mp3',thumb:'assets/jazz lofi/Sakamoto Juunosuke - Hananoen.jpg'},
    {title:'madder sky',artist:'TAKUMI M',dur:'2:41',src:'assets/jazz lofi/TAKUMI M - madder sky.mp3',thumb:'assets/jazz lofi/TAKUMI M - madder sky.jpg'},
    {title:'Rent a Van',artist:'Tom Doolie',dur:'2:02',src:'assets/jazz lofi/Tom Doolie - Rent a Van.mp3',thumb:'assets/jazz lofi/Tom Doolie - Rent a Van.jpg'},
    {title:'Black Sakura',artist:'Vindu, FlFexclamation',dur:'3:04',src:'assets/jazz lofi/Vindu, FlFexclamation - Black Sakura.mp3',thumb:'assets/jazz lofi/Vindu, FlFexclamation - Black Sakura.jpg'},
    {title:'Tokyo Rooftop',artist:'zad.',dur:'2:18',src:'assets/jazz lofi/zad. - Tokyo Rooftop.mp3',thumb:'assets/jazz lofi/zad. - Tokyo Rooftop.jpg'},
  ]},
  hiphop:{label:'🎤 hip hop lofi',cover:'assets/hip_hop_lofi.png',tracks:[
    {title:'Soft Spoken',artist:'Dreamfield',dur:'2:35',src:'assets/hip hop lofi/Dreamfield - Soft Spoken.mp3',thumb:'assets/hip hop lofi/Dreamfield - Soft Spoken.jpg'},
    {title:'Timeless Glow',artist:'Erwin Do',dur:'2:38',src:'assets/hip hop lofi/Erwin Do - Timeless Glow.mp3',thumb:'assets/hip hop lofi/Erwin Do - Timeless Glow.jpg'},
    {title:'Jazzy Winter',artist:'Guustavv',dur:'2:12',src:'assets/hip hop lofi/Guustavv - Jazzy Winter.mp3',thumb:'assets/hip hop lofi/Guustavv - Jazzy Winter.jpg'},
    {title:'Shibuya River',artist:'HoKo',dur:'2:15',src:'assets/hip hop lofi/HoKo - Shibuya River.mp3',thumb:'assets/hip hop lofi/HoKo - Shibuya River.jpg'},
    {title:'The Origami Man',artist:'HoKo',dur:'1:57',src:'assets/hip hop lofi/HoKo - The Origami Man.mp3',thumb:'assets/hip hop lofi/HoKo - The Origami Man.jpg'},
    {title:'July',artist:'John Lee',dur:'2:08',src:'assets/hip hop lofi/John Lee - July.mp3',thumb:'assets/hip hop lofi/John Lee - July.jpg'},
    {title:'Visitors',artist:'Late Night Tones',dur:'1:37',src:'assets/hip hop lofi/Late Night Tones - Visitors.mp3',thumb:'assets/hip hop lofi/Late Night Tones - Visitors.jpg'},
    {title:'Miami Nights',artist:'Lenny B.',dur:'2:05',src:'assets/hip hop lofi/Lenny B. - Miami Nights.mp3',thumb:'assets/hip hop lofi/Lenny B. - Miami Nights.jpg'},
    {title:'City Whispers',artist:'Living Room',dur:'1:59',src:'assets/hip hop lofi/Living Room - City Whispers.mp3',thumb:'assets/hip hop lofi/Living Room - City Whispers.jpg'},
    {title:'Nardis',artist:'UKDD',dur:'2:08',src:'assets/hip hop lofi/UKDD - Nardis.mp3',thumb:'assets/hip hop lofi/UKDD - Nardis.jpg'},
  ]},
  picks:{label:'⭐ personal picks',cover:'assets/personal.png',tracks:[
    {title:'Backwards',artist:'Forrest.',dur:'4:20',src:'assets/personal/Forrest. - Backwards.mp3',thumb:'assets/personal/Forrest. - Backwards.jpg'},
    {title:"Grandpop's Uke",artist:'Forrest.',dur:'4:09',src:"assets/personal/Forrest. - Grandpop's Uke.mp3",thumb:"assets/personal/Forrest. - Grandpop's Uke.jpg"},
    {title:'Your Soul',artist:'Forrest., Biskwiq',dur:'4:27',src:'assets/personal/Forrest., Biskwiq - Your Soul.mp3',thumb:'assets/personal/Forrest., Biskwiq - Your Soul.jpg'},
    {title:'Cloud',artist:'galdive',dur:'4:01',src:'assets/personal/galdive - Cloud.mp3',thumb:'assets/personal/galdive - Cloud.jpg'},
    {title:'sorbet',artist:'galdive',dur:'4:55',src:'assets/personal/galdive - sorbet.mp3',thumb:'assets/personal/galdive - sorbet.jpg'},
    {title:'Sunkissed',artist:'khai dreams',dur:'2:14',src:'assets/personal/khai dreams - Sunkissed.mp3',thumb:'assets/personal/khai dreams - Sunkissed.jpg'},
    {title:'Come true',artist:'khai dreams, Forrest',dur:'5:06',src:'assets/personal/khai dreams, Forrest - Come true.mp3',thumb:'assets/personal/khai dreams, Forrest - Come true.jpg'},
    {title:'Youth',artist:'Manila Killa, Satica',dur:'3:02',src:'assets/personal/Manila Killa, Satica - Youth.mp3',thumb:'assets/personal/Manila Killa, Satica - Youth.jpg'},
    {title:'HALO HALO',artist:'Shawn Wasabi, Chevy',dur:'2:52',src:'assets/personal/Shawn Wasabi, Chevy - HALO HALO.mp3',thumb:'assets/personal/Shawn Wasabi, Chevy - HALO HALO.jpg'},
    {title:'MANGO LOVE',artist:'Shawn Wasabi, Satica',dur:'3:21',src:'assets/personal/Shawn Wasabi, Satica - MANGO LOVE.mp3',thumb:'assets/personal/Shawn Wasabi, Satica - MANGO LOVE.jpg'},
    {title:'Pixel Galaxy',artist:"Snail's House",dur:'6:00',src:"assets/personal/Snail's House - Pixel Galaxy.mp3",thumb:"assets/personal/Snail's House - Pixel Galaxy.jpg"},
    {title:'Sunday Best',artist:'Surfaces',dur:'3:59',src:'assets/personal/Surfaces - Sunday Best.mp3',thumb:'assets/personal/Surfaces - Sunday Best.jpg'},
    {title:"Can't Hide",artist:'Whethan, Ashe',dur:'4:36',src:"assets/personal/Whethan, Ashe - Can't Hide.mp3",thumb:"assets/personal/Whethan, Ashe - Can't Hide.jpg"},
  ]}
};

let currentGenre='chill',currentIndex=-1;
// what's actually loaded/playing — independent of whichever genre tab
// the user happens to be browsing right now
let playingGenre=null, playingIndex=-1;

function showStation(){ playerStation.classList.add('mini'); if(playerDockBtn)playerDockBtn.classList.add('win-open'); }
function hideStation(){ playerStation.classList.remove('mini','expanded'); if(playerDockBtn)playerDockBtn.classList.remove('win-open'); }
function expandStation(){ playerStation.classList.add('mini','expanded'); if(playerDockBtn)playerDockBtn.classList.add('win-open'); }
function collapseStation(){ playerStation.classList.remove('expanded'); }

if(playerDockBtn){
  playerDockBtn.addEventListener('click',()=>{
    playerDockBtn.classList.remove('dock-bounce'); void playerDockBtn.offsetWidth; playerDockBtn.classList.add('dock-bounce');
    playerDockBtn.addEventListener('animationend',()=>playerDockBtn.classList.remove('dock-bounce'),{once:true});
    const isMini=playerStation.classList.contains('mini'),isExpanded=playerStation.classList.contains('expanded');
    if(!isMini)showStation(); else if(isExpanded)collapseStation(); else expandStation();
  });
}

miniBar.addEventListener('click',()=>{ playerStation.classList.contains('expanded')?collapseStation():expandStation(); });
document.getElementById('playerClose').addEventListener('click',e=>{ e.stopPropagation(); playerAudio.pause(); hideStation(); });
document.getElementById('playerMin').addEventListener('click',e=>{ e.stopPropagation(); collapseStation(); });

document.addEventListener('click',function(e){
  if(!playerStation.classList.contains('expanded'))return;
  if(!playerStation.contains(e.target))collapseStation();
},true);

function renderTrackList(genre){
  const list=GENRES[genre].tracks;
  trackListEl.innerHTML='';
  list.forEach((t,i)=>{
    const isPlaying=(genre===playingGenre&&i===playingIndex);
    const row=document.createElement('div');
    row.className='track-row'+(isPlaying?' playing':'');
    row.innerHTML=`<div class="track-eq"><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div></div><span class="track-num">${i+1}</span><div class="track-info"><p class="track-name">${t.title}</p><p class="track-sub">${t.artist}</p></div><span class="track-dur">${t.dur}</span>`;
    row.addEventListener('click',()=>loadTrack(genre,i,true));
    trackListEl.appendChild(row);
  });
}

function setActiveTab(genre){ genreTabsEl.querySelectorAll('.genre-tab').forEach(tab=>tab.classList.toggle('active',tab.dataset.genre===genre)); }
function switchGenre(genre){ currentGenre=genre; setActiveTab(genre); renderTrackList(genre); }
genreTabsEl.querySelectorAll('.genre-tab').forEach(tab=>tab.addEventListener('click',()=>switchGenre(tab.dataset.genre)));

function loadTrack(genre,index,autoplay){
  const t=GENRES[genre].tracks[index];
  playingGenre=genre; playingIndex=index;
  currentGenre=genre; currentIndex=index; // also bring the viewed tab along when a track is explicitly loaded
  const src=playerAudio.querySelector('source');
  src.src=t.src||''; playerAudio._loadingTrack=true; playerAudio.load();
  playerGenreLabel.textContent=GENRES[genre].label||genre;
  playerTrackEl.textContent=t.title; playerArtistEl.textContent=t.artist;
  miniTrackEl.textContent=t.title; miniArtistEl.textContent=t.artist;

  // Update hero now-playing marquee
  setNowPlayingText(t.title, t.artist, true);

  const playerThumbEl=document.querySelector('.player-thumb'),miniThumbEl=document.querySelector('.mini-thumb');
  const thumbSrc = t.thumb || GENRES[genre].cover || '';
  if(thumbSrc){
    playerThumbEl.innerHTML=`<img src="${thumbSrc}" alt="${t.title}" style="width:100%;height:100%;object-fit:cover;">`;
    miniThumbEl.innerHTML=`<img src="${thumbSrc}" alt="${t.title}" style="width:100%;height:100%;object-fit:cover;">`;
  } else {
    playerThumbEl.innerHTML='<span>🎵</span>'; miniThumbEl.innerHTML='<span>🎵</span>';
  }
  setActiveTab(genre);
  renderTrackList(genre);
  updateDynamicIsland(t);
  if(autoplay)playerAudio.play().catch(()=>{});
}

// ===== DYNAMIC ISLAND (mobile mini player) =====
const dynamicIsland   = document.getElementById('dynamicIsland');
const islandThumbEl   = document.getElementById('islandThumb');
const islandTrackEl   = document.getElementById('islandTrack');
const islandArtistEl  = document.getElementById('islandArtist');

function updateDynamicIsland(track){
  if(!dynamicIsland) return;
  islandTrackEl.textContent  = track.title;
  islandArtistEl.textContent = track.artist;
  islandThumbEl.innerHTML = track.thumb
    ? `<img src="${track.thumb}" alt="${track.title}" style="width:100%;height:100%;object-fit:cover;">`
    : '<span>🎵</span>';
  dynamicIsland.classList.add('playing','show');
}

if(dynamicIsland){
  function openFromIsland(){
    // bring the station online (in case it was never opened) then expand it
    playerStation.classList.add('mini');
    if(playerDockBtn) playerDockBtn.classList.add('win-open');
    expandStation();
  }
  dynamicIsland.addEventListener('click', openFromIsland);
  dynamicIsland.addEventListener('keydown', e=>{
    if(e.key==='Enter' || e.key===' '){ e.preventDefault(); openFromIsland(); }
  });
  // reveal the island whenever the station is shown, and mirror its
  // playing state for the waveform — driven off class changes so this
  // never has to duplicate the audio event-handling logic above
  const islandVisibilityObserver = new MutationObserver(()=>{
    dynamicIsland.classList.toggle('show', playerStation.classList.contains('mini'));
    dynamicIsland.classList.toggle('is-playing', playerStation.classList.contains('is-playing'));
    dynamicIsland.classList.toggle('station-expanded', playerStation.classList.contains('expanded'));
  });
  islandVisibilityObserver.observe(playerStation, {attributes:true, attributeFilter:['class']});
}

// ===== SHUFFLE & REPEAT =====
let shuffleOn  = false;  // shuffle mode
let repeatMode = 0;      // 0=off, 1=repeat-all, 2=repeat-one
let shuffleHistory = []; // for back-navigation in shuffle

const playerShuffleBtn = document.getElementById('playerShuffleBtn');
const playerRepeatBtn  = document.getElementById('playerRepeatBtn');
const playerPrevBtn    = document.getElementById('playerPrevBtn');
const playerNextBtn    = document.getElementById('playerNextBtn');

function updateShuffleUI(){
  playerShuffleBtn.classList.toggle('active', shuffleOn);
}
function updateRepeatUI(){
  playerRepeatBtn.classList.remove('active','repeat-one');
  if(repeatMode===1){ playerRepeatBtn.classList.add('active'); playerRepeatBtn.title='repeat all'; }
  else if(repeatMode===2){ playerRepeatBtn.classList.add('active','repeat-one'); playerRepeatBtn.title='repeat one'; }
  else { playerRepeatBtn.title='repeat off'; }
}

playerShuffleBtn.addEventListener('click',()=>{ shuffleOn=!shuffleOn; shuffleHistory=[]; updateShuffleUI(); });
playerRepeatBtn.addEventListener('click', ()=>{ repeatMode=(repeatMode+1)%3; updateRepeatUI(); });

function getRandomIndex(exclude){
  const list=GENRES[playingGenre||currentGenre].tracks;
  if(list.length<=1) return 0;
  let idx; do { idx=Math.floor(Math.random()*list.length); } while(idx===exclude);
  return idx;
}

function prevTrack(){
  const genre=playingGenre||currentGenre;
  const list=GENRES[genre].tracks;
  if(playingIndex<0){ loadTrack(genre,list.length-1,true); return; }
  if(shuffleOn && shuffleHistory.length>1){
    shuffleHistory.pop(); // remove current
    const prev=shuffleHistory[shuffleHistory.length-1];
    loadTrack(genre,prev,true);
    return;
  }
  loadTrack(genre,(playingIndex-1+list.length)%list.length,true);
}

function nextTrack(){
  const genre=playingGenre||currentGenre;
  const list=GENRES[genre].tracks;
  if(playingIndex<0){ loadTrack(genre,0,true); return; }
  if(repeatMode===2){ playerAudio.currentTime=0; playerAudio.play().catch(()=>{}); return; }
  let next;
  if(shuffleOn){ next=getRandomIndex(playingIndex); shuffleHistory.push(next); }
  else { next=(playingIndex+1)%list.length; }
  if(next===0 && !shuffleOn && repeatMode===0){ playerAudio.pause(); return; } // end of playlist, no repeat
  loadTrack(genre,next,true);
}

function formatTime(sec){ if(!isFinite(sec)||sec<0)sec=0; return Math.floor(sec/60)+':'+Math.floor(sec%60).toString().padStart(2,'0'); }
playerAudio.volume=parseFloat(playerVol.value);
function togglePlay(){
  initAudioContext(playerAudio);
  if(audioCtx && audioCtx.state==='suspended') audioCtx.resume();
  if(playingIndex<0){loadTrack(currentGenre,0,true);return;}
  if(playerAudio.paused)playerAudio.play().catch(()=>{});
  else playerAudio.pause();
}

playerPlayBtn.addEventListener('click',togglePlay);
miniPlayBtn.addEventListener('click',togglePlay);
playerPrevBtn.addEventListener('click',prevTrack);
playerNextBtn.addEventListener('click',nextTrack);
miniPrevBtn.addEventListener('click',prevTrack);
miniNextBtn.addEventListener('click',nextTrack);
playerAudio.addEventListener('ended',nextTrack);
updateShuffleUI(); updateRepeatUI();


playerAudio.addEventListener('play',()=>{
  playerAudio._loadingTrack=false; // track is now actually playing; safe to restore BGM on next pause
  playerStation.classList.add('is-playing');
  playerPlayBtn.setAttribute('aria-label','pause');
  miniPlayBtn.setAttribute('aria-label','pause');
  initAudioContext(playerAudio);
  if(audioCtx && audioCtx.state==='suspended') audioCtx.resume();
  startViz();
  if(!vizActive) startViz();
  // Remember if user had already manually turned BGM off
  playerAudio._bgmWasOn = window.BGMPlayer && window.BGMPlayer.isEnabled();
  if(window.BGMPlayer){ window.BGMPlayer.setEnabled(false); window.BGMPlayer.pause(); }
  scene.classList.remove('lofi-on');
  vinylToggle.classList.remove('active');
  vinylToggle.setAttribute('aria-pressed','false');
});
playerAudio.addEventListener('pause',()=>{
  playerStation.classList.remove('is-playing');
  playerPlayBtn.setAttribute('aria-label','play');
  miniPlayBtn.setAttribute('aria-label','play');
  stopViz();
  startViz();
  // Only restore BGM if user hadn't manually turned it off before player started
  if(!playerAudio._loadingTrack && playerAudio._bgmWasOn && window.BGMPlayer){
    window.BGMPlayer.setEnabled(true);
    window.BGMPlayer.resume();
    scene.classList.add('lofi-on');
    vinylToggle.classList.add('active');
    vinylToggle.setAttribute('aria-pressed','true');
  }
});
playerAudio.addEventListener('loadedmetadata',()=>{ playerScrub.max=playerAudio.duration||0; playerTimeTot.textContent=formatTime(playerAudio.duration); });
playerAudio.addEventListener('timeupdate',()=>{
  if(!playerScrub.matches(':active'))playerScrub.value=playerAudio.currentTime;
  playerTimeCur.textContent=formatTime(playerAudio.currentTime);
  miniProgressFill.style.width=(playerAudio.duration?(playerAudio.currentTime/playerAudio.duration)*100:0)+'%';
});
playerScrub.addEventListener('input',()=>{ playerAudio.currentTime=parseFloat(playerScrub.value); });
playerVol.addEventListener('input',()=>{ playerAudio.volume=parseFloat(playerVol.value); });

renderTrackList('chill');

// Start idle marquee & visualizer on load
buildMarquee('♪  nothing playing yet  —  open the player below');
startViz();

// Genre tabs drag-to-scroll
(function(){
  const el=genreTabsEl; let isDown=false,startX,scrollLeft;
  el.addEventListener('mousedown',e=>{ isDown=true; startX=e.pageX-el.offsetLeft; scrollLeft=el.scrollLeft; el.style.userSelect='none'; });
  window.addEventListener('mouseup',()=>{ isDown=false; el.style.userSelect=''; });
  window.addEventListener('mousemove',e=>{ if(!isDown)return; e.preventDefault(); el.scrollLeft=scrollLeft-(e.pageX-el.offsetLeft-startX)*1.2; });
  let touchStartX,touchScrollLeft;
  el.addEventListener('touchstart',e=>{ touchStartX=e.touches[0].pageX-el.offsetLeft; touchScrollLeft=el.scrollLeft; },{passive:true});
  el.addEventListener('touchmove',e=>{ el.scrollLeft=touchScrollLeft-(e.touches[0].pageX-el.offsetLeft-touchStartX); },{passive:true});
})();

// Keyboard shortcuts
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    if(playerStation.classList.contains('expanded')){ collapseStation(); return; }
    const focused=document.querySelector('.win.focused.visible');
    if(focused)closeWin(focused);
  }
});

// ===== GUESTBOOK =====
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxOjDc-eRYVlCQxhhxdp3oUemZdbh4ve0ArgmmysBcuZnI6amvE1Svg6QQeCXnDBKLc/exec';

let gbCache = null;

function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function showToast(msg, isError) {
  const toast = document.getElementById('gb-toast');
  if (!toast) return;
  const iconEl = document.getElementById('gb-toast-icon');
  const msgEl  = document.getElementById('gb-toast-msg');
  clearTimeout(toast._hideTimer);
  iconEl.textContent = isError ? '😿' : '🐾';
  msgEl.textContent  = msg;
  toast.classList.toggle('error', !!isError);
  // retrigger the entrance animation even if a toast is already showing
  toast.classList.remove('show');
  void toast.offsetWidth;
  toast.classList.add('show');
  toast._hideTimer = setTimeout(() => { toast.classList.remove('show'); }, 3200);
}

function renderGuestbookEntries(data) {
  const log   = document.getElementById('gb-log');
  const empty = document.getElementById('gb-empty');
  if (!log) return;
  if (!data || !data.length) {
    if (empty) empty.textContent = 'no notes yet — be the first! 🐾';
    return;
  }
  if (empty) empty.remove();
  log.innerHTML = '';
  data.forEach(entry => {
    const card = document.createElement('div');
    card.style.cssText = 'background:#fef9c3;border:none;border-bottom:1.5px solid #e9d76a;padding:14px 4px 12px;position:relative;';
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
        <span style="font-family:'Indie Flower',cursive;font-size:1.08rem;font-weight:700;color:#5a4a00;">${escapeHtml(entry.name||'anonymous')}</span>
        <span style="font-family:'Indie Flower',cursive;font-size:.82rem;color:#92720a;white-space:nowrap;margin-left:8px;">${entry.from?escapeHtml(entry.from)+' · ':''}${escapeHtml(entry.date)}</span>
      </div>
      <p style="font-family:'Indie Flower',cursive;font-size:1rem;color:#6b5700;margin:0;line-height:1.6;">${escapeHtml(entry.message)}</p>
    `;
    log.appendChild(card);
  });
}

function loadGuestbook() {
  if (gbCache) { renderGuestbookEntries(gbCache); return; }
  const callbackName = 'gbCallback_' + Date.now();
  const script = document.createElement('script');
  const timeout = setTimeout(() => { cleanup(); const e=document.getElementById('gb-empty'); if(e) e.textContent="couldn't load notes right now 😿"; }, 8000);
  function cleanup() { clearTimeout(timeout); delete window[callbackName]; if(script.parentNode) script.remove(); }
  window[callbackName] = (data) => { cleanup(); gbCache=data; renderGuestbookEntries(data); };
  script.onerror = () => { cleanup(); const e=document.getElementById('gb-empty'); if(e) e.textContent="couldn't load notes right now 😿"; };
  script.src = APPS_SCRIPT_URL + '?action=get&callback=' + callbackName;
  document.head.appendChild(script);
}

function submitGuestbook() {
  const name    = document.getElementById('gb-name').value.trim();
  const from    = document.getElementById('gb-from').value.trim();
  const message = document.getElementById('gb-msg').value.trim();
  const status  = document.getElementById('gb-status');
  const btn     = document.getElementById('gb-submit');
  if (!name || !message) { status.textContent='name and message are required! 🐱'; return; }
  btn.disabled=true; btn.textContent='sending...'; status.textContent='';
  const callbackName = 'gbSubmit_' + Date.now();
  const script = document.createElement('script');
  const timeout = setTimeout(() => { delete window[callbackName]; if(script.parentNode) script.remove(); onSuccess(); }, 5000);
  function onSuccess() {
    clearTimeout(timeout);
    document.getElementById('gb-name').value='';
    document.getElementById('gb-from').value='';
    document.getElementById('gb-msg').value='';
    status.textContent=''; btn.disabled=false; btn.textContent='leave a note ✉️';
    showToast('note left! thanks for visiting', false);
    gbCache=null; setTimeout(()=>loadGuestbook(),1500);
  }
  function onFail() {
    btn.disabled=false; btn.textContent='leave a note ✉️';
    showToast('something went wrong, try again', true);
  }
  window[callbackName] = (res) => { delete window[callbackName]; if(script.parentNode) script.remove(); clearTimeout(timeout); if(res&&res.ok){onSuccess();}else{onFail();} };
  script.onerror = () => { delete window[callbackName]; clearTimeout(timeout); onFail(); };
  const params = new URLSearchParams({ action:'post', callback:callbackName, name, from, message });
  script.src = APPS_SCRIPT_URL + '?' + params.toString();
  document.head.appendChild(script);
}

// Wire up submit button
document.getElementById('gb-submit').addEventListener('click', submitGuestbook);

// Load guestbook when logs window opens
document.querySelector('button[data-win="logs"]').addEventListener('click', () => { setTimeout(loadGuestbook, 80); });

// Preload in background
setTimeout(() => { gbCache=null; loadGuestbook(); }, 1800);

// ===== HEADPHONE NOTIFICATION TOAST =====
(function(){
  const TOAST_ID   = 'headphone-toast';
  const SHOW_DELAY = 2200; // ms after page load
  const AUTO_HIDE  = 7000; // ms visible before auto-dismiss

  const css = `
    #${TOAST_ID}{
      position:fixed;
      bottom:24px;
      left:24px;
      width:280px;
      background:var(--win-body);
      border:1px solid var(--win-bar-border);
      border-radius:10px;
      box-shadow:0 12px 40px var(--shadow), 0 2px 8px var(--shadow);
      z-index:9000;
      overflow:hidden;
      font-family:'Nunito', sans-serif;
      transform:translateY(calc(100% + 32px));
      opacity:0;
      transition:transform .38s cubic-bezier(.34,1.3,.64,1), opacity .3s ease;
      pointer-events:all;
    }
    #${TOAST_ID}.show{
      transform:translateY(0);
      opacity:1;
    }
    #${TOAST_ID} .nt-bar{
      background:var(--win-bar);
      border-bottom:1px solid var(--win-bar-border);
      padding:0 12px;
      height:34px;
      display:flex; align-items:center; justify-content:space-between;
      user-select:none;
    }
    #${TOAST_ID} .nt-bar-left{
      display:flex; align-items:center; gap:8px;
    }
    #${TOAST_ID} .nt-dots{
      display:flex; gap:5px;
    }
    #${TOAST_ID} .nt-dot{
      width:11px; height:11px; border-radius:50%;
      border:none; padding:0; cursor:pointer;
      display:flex; align-items:center; justify-content:center;
      transition: opacity .15s;
    }
    #${TOAST_ID} .nt-dot:hover{ opacity:.75; }
    #${TOAST_ID} .nt-dot.close{ background:#ff5f57; }\
    #${TOAST_ID} .nt-dot.close svg{
      width:7px; height:7px; opacity:0; transform:scale(.6);
      transition: opacity .15s ease, transform .15s ease;
    }
    #${TOAST_ID} .nt-dot.close svg path{ stroke:#4d0c08; stroke-width:1.8; stroke-linecap:round; }
    #${TOAST_ID} .nt-dot.close:hover svg{ opacity:1; transform:scale(1); }
    #${TOAST_ID} .nt-title{
      font-family:'Space Mono', monospace;
      font-size:.68rem; color:var(--text-muted);
      letter-spacing:.06em;
    }
    #${TOAST_ID} .nt-body{
      padding:14px 16px 16px;
      display:flex; align-items:flex-start; gap:13px;
    }
    #${TOAST_ID} .nt-icon{
      font-size:1.65rem;
      line-height:1;
      flex-shrink:0;
      margin-top:1px;
      filter: drop-shadow(0 1px 2px var(--shadow));
    }
    #${TOAST_ID} .nt-content{
      display:flex; flex-direction:column; gap:3px;
    }
    #${TOAST_ID} .nt-heading{
      font-family:'Fredoka', sans-serif;
      font-size:.95rem;
      font-weight:600;
      color:var(--text);
      line-height:1.2;
    }
    #${TOAST_ID} .nt-msg{
      font-size:.78rem;
      color:var(--text-muted);
      line-height:1.45;
    }
    #${TOAST_ID} .nt-progress{
      height:2px;
      background:var(--win-bar-border);
      position:relative;
      overflow:hidden;
    }
    #${TOAST_ID} .nt-progress-fill{
      position:absolute;
      inset:0;
      background:var(--accent);
      transform-origin:left;
      transform:scaleX(1);
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  const el = document.createElement('div');
  el.id = TOAST_ID;
  el.setAttribute('role','status');
  el.setAttribute('aria-live','polite');
  el.innerHTML = `
    <div class="nt-bar">
      <div class="nt-bar-left">
        <div class="nt-dots">
          <button class="nt-dot close" aria-label="dismiss">
            <svg viewBox="0 0 8 8" fill="none"><path d="M1.5 1.5L6.5 6.5M6.5 1.5L1.5 6.5"/></svg>
          </button>
        </div>
        <span class="nt-title">system &middot; notification</span>
      </div>
    </div>
    <div class="nt-body">
      <div class="nt-icon">&#x1F3A7;</div>
      <div class="nt-content">
        <div class="nt-heading">headphones recommended</div>
        <div class="nt-msg">for the full cozy experience, plug in your headphones ~</div>
      </div>
    </div>
    <div class="nt-progress"><div class="nt-progress-fill" id="nt-fill"></div></div>
  `;
  document.body.appendChild(el);

  function dismiss(){
    el.classList.remove('show');
    setTimeout(()=>el.remove(), 400);
  }

  el.querySelector('.nt-dot.close').addEventListener('click', dismiss);

  setTimeout(()=>{
    el.classList.add('show');
    const fill = document.getElementById('nt-fill');
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      fill.style.transition = `transform ${AUTO_HIDE}ms linear`;
      fill.style.transform  = 'scaleX(0)';
    }));
    setTimeout(dismiss, AUTO_HIDE);
  }, SHOW_DELAY);
})();

// ===== PC-ONLY FEATURES NOTIFICATION TOAST (mobile only) =====
(function(){
  if(window.innerWidth > 720) return; // desktop already has everything, nothing to flag

  const TOAST_ID   = 'pc-features-toast';
  const SHOW_DELAY = 9700; // appears right after the headphones toast clears
  const AUTO_HIDE  = 7500;

  const css = `
    #${TOAST_ID}{
      position:fixed;
      bottom:24px;
      left:24px;
      width:280px;
      background:var(--win-body);
      border:1px solid var(--win-bar-border);
      border-radius:10px;
      box-shadow:0 12px 40px var(--shadow), 0 2px 8px var(--shadow);
      z-index:9000;
      overflow:hidden;
      font-family:'Nunito', sans-serif;
      transform:translateY(calc(100% + 32px));
      opacity:0;
      transition:transform .38s cubic-bezier(.34,1.3,.64,1), opacity .3s ease;
      pointer-events:all;
    }
    #${TOAST_ID}.show{
      transform:translateY(0);
      opacity:1;
    }
    #${TOAST_ID} .nt-bar{
      background:var(--win-bar);
      border-bottom:1px solid var(--win-bar-border);
      padding:0 12px;
      height:34px;
      display:flex; align-items:center; justify-content:space-between;
      user-select:none;
    }
    #${TOAST_ID} .nt-bar-left{
      display:flex; align-items:center; gap:8px;
    }
    #${TOAST_ID} .nt-dots{
      display:flex; gap:5px;
    }
    #${TOAST_ID} .nt-dot{
      width:11px; height:11px; border-radius:50%;
      border:none; padding:0; cursor:pointer;
      display:flex; align-items:center; justify-content:center;
      transition: opacity .15s;
    }
    #${TOAST_ID} .nt-dot:hover{ opacity:.75; }
    #${TOAST_ID} .nt-dot.close{ background:#ff5f57; }
    #${TOAST_ID} .nt-dot.close svg{
      width:7px; height:7px; opacity:0; transform:scale(.6);
      transition: opacity .15s ease, transform .15s ease;
    }
    #${TOAST_ID} .nt-dot.close svg path{ stroke:#4d0c08; stroke-width:1.8; stroke-linecap:round; }
    #${TOAST_ID} .nt-dot.close:hover svg{ opacity:1; transform:scale(1); }
    #${TOAST_ID} .nt-title{
      font-family:'Space Mono', monospace;
      font-size:.68rem; color:var(--text-muted);
      letter-spacing:.06em;
    }
    #${TOAST_ID} .nt-body{
      padding:14px 16px 16px;
      display:flex; align-items:flex-start; gap:13px;
    }
    #${TOAST_ID} .nt-icon{
      font-size:1.65rem;
      line-height:1;
      flex-shrink:0;
      margin-top:1px;
      filter: drop-shadow(0 1px 2px var(--shadow));
    }
    #${TOAST_ID} .nt-content{
      display:flex; flex-direction:column; gap:3px;
    }
    #${TOAST_ID} .nt-heading{
      font-family:'Fredoka', sans-serif;
      font-size:.95rem;
      font-weight:600;
      color:var(--text);
      line-height:1.2;
    }
    #${TOAST_ID} .nt-msg{
      font-size:.78rem;
      color:var(--text-muted);
      line-height:1.45;
    }
    #${TOAST_ID} .nt-progress{
      height:2px;
      background:var(--win-bar-border);
      position:relative;
      overflow:hidden;
    }
    #${TOAST_ID} .nt-progress-fill{
      position:absolute;
      inset:0;
      background:var(--accent);
      transform-origin:left;
      transform:scaleX(1);
    }
    @media (max-width:720px){
      #${TOAST_ID}{
        left:50% !important;
        bottom:max(80px, calc(env(safe-area-inset-bottom, 0px) + 80px)) !important;
        transform:translateX(-50%) translateY(calc(100% + 40px)) !important;
        width:min(300px, 88vw) !important;
      }
      #${TOAST_ID}.show{
        transform:translateX(-50%) translateY(0) !important;
      }
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  const el = document.createElement('div');
  el.id = TOAST_ID;
  el.setAttribute('role','status');
  el.setAttribute('aria-live','polite');
  el.innerHTML = `
    <div class="nt-bar">
      <div class="nt-bar-left">
        <div class="nt-dots">
          <button class="nt-dot close" aria-label="dismiss">
            <svg viewBox="0 0 8 8" fill="none"><path d="M1.5 1.5L6.5 6.5M6.5 1.5L1.5 6.5"/></svg>
          </button>
        </div>
        <span class="nt-title">system &middot; notification</span>
      </div>
    </div>
    <div class="nt-body">
      <div class="nt-icon">🖥️</div>
      <div class="nt-content">
        <div class="nt-heading">a few things only show up on pc</div>
        <div class="nt-msg">desk widgets, sticky notes, and window dragging are desktop-only — everything else here works the same ✨</div>
      </div>
    </div>
    <div class="nt-progress"><div class="nt-progress-fill" id="pc-toast-fill"></div></div>
  `;
  document.body.appendChild(el);

  function dismiss(){
    el.classList.remove('show');
    setTimeout(()=>el.remove(), 400);
  }

  el.querySelector('.nt-dot.close').addEventListener('click', dismiss);

  setTimeout(()=>{
    el.classList.add('show');
    const fill = document.getElementById('pc-toast-fill');
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      fill.style.transition = `transform ${AUTO_HIDE}ms linear`;
      fill.style.transform  = 'scaleX(0)';
    }));
    setTimeout(dismiss, AUTO_HIDE);
  }, SHOW_DELAY);
})();