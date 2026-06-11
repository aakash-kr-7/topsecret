/* ── AUDIO SYNTHESIZER ENGINE ── */
let audioCtx = null;

function getAudioContext() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) audioCtx = new Ctx();
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playPaperTearSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const bufferSize = ctx.sampleRate * 0.4;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    const noise = Math.random() * 2 - 1;
    const crackle = Math.random() < 0.006 ? (Math.random() * 2 - 1) * 0.45 : 0;
    data[i] = noise * 0.12 + crackle;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1400, now);
  filter.frequency.exponentialRampToValueAtTime(250, now + 0.4);
  filter.Q.setValueAtTime(4.0, now);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.22, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(now);
  source.stop(now + 0.4);
}

function playPaperRustleSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const bufferSize = ctx.sampleRate * 0.28;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(2200, now);
  filter.frequency.exponentialRampToValueAtTime(500, now + 0.28);
  filter.Q.setValueAtTime(1.5, now);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.08, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(now);
  source.stop(now + 0.28);
}

function playWritingScratchSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const bufferSize = ctx.sampleRate * 0.04;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(2600 + Math.random() * 500, now);
  filter.Q.setValueAtTime(6.0, now);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.02, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(now);
  source.stop(now + 0.04);
}

function playStarChimeSound(freq = 880) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);
  osc.frequency.exponentialRampToValueAtTime(freq * 1.4, now + 0.22);
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.045, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.32);
}

function playMagicConstellationSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const notes = [698.46, 880.00, 1046.50, 1396.91, 1760.00, 2093.00];
  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + index * 0.06);
    gain.gain.setValueAtTime(0.0001, now + index * 0.06);
    gain.gain.linearRampToValueAtTime(0.05, now + index * 0.06 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.06 + 0.38);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + index * 0.06);
    osc.stop(now + index * 0.06 + 0.4);
  });
}

/* ── CURSOR ── */
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mx = -100, my = -100, rx = -100, ry = -100;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function cursorLoop() {
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top  = ry + 'px';
  requestAnimationFrame(cursorLoop);
})();

document.querySelectorAll('a, button, .polaroid, .reel-frame').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width  = '20px';
    cursor.style.height = '20px';
    cursor.style.background = 'rgba(196,122,138,0.5)';
    cursorRing.style.width  = '50px';
    cursorRing.style.height = '50px';
    cursorRing.style.borderColor = 'rgba(196,122,138,0.6)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width  = '10px';
    cursor.style.height = '10px';
    cursor.style.background = '#C47A8A';
    cursorRing.style.width  = '36px';
    cursorRing.style.height = '36px';
    cursorRing.style.borderColor = 'rgba(196,122,138,0.4)';
  });
});

function createQuietClickSpark(x, y) {
  const glyphs = ['♡', '✿', '❋', '✧'];
  const count = 6;

  for (let i = 0; i < count; i++) {
    const sprite = document.createElement('div');
    sprite.className = 'burst-sprite';
    sprite.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    sprite.style.left = `${x}px`;
    sprite.style.top = `${y}px`;
    sprite.style.setProperty('--dx', `${(Math.random() - 0.5) * 70}px`);
    sprite.style.setProperty('--dy', `${(Math.random() - 0.6) * 70 - 20}px`);
    sprite.style.fontSize = `${10 + Math.random() * 5}px`;
    document.body.appendChild(sprite);
    setTimeout(() => sprite.remove(), 800);
  }
}

function showEdgeNote(text, position = 'top-right') {
  const existing = document.querySelector('.edge-note.show');
  if (existing) existing.classList.remove('show');

  const note = document.createElement('div');
  note.className = `edge-note ${position}`;
  note.textContent = text;
  document.body.appendChild(note);

  requestAnimationFrame(() => note.classList.add('show'));
  window.setTimeout(() => {
    note.classList.remove('show');
    window.setTimeout(() => note.remove(), 350);
  }, 1400);
}

function addFloatingCutes() {
  const layer = document.createElement('div');
  layer.id = 'floating-cutes';
  layer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(layer);

  const symbols = ['✧', '♡', '·'];
  for (let i = 0; i < 8; i++) {
    const el = document.createElement('span');
    el.className = 'floaty-cute';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = `${Math.random() * 100}%`;
    el.style.top = `${Math.random() * 100}%`;
    el.style.fontSize = `${10 + Math.random() * 6}px`;
    el.style.animationDuration = `${10 + Math.random() * 8}s`;
    el.style.animationDelay = `${Math.random() * 4}s`;
    layer.appendChild(el);
  }
}

/* ── PARTICLES ── */
(function () {
  const canvas = document.getElementById('particle-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H;

  const COLORS = ['#F7D4DF','#E8A0B8','#D4ADCF','#F2E4EA','#F5C5B0','#EEE0EE'];

  // Hearts shapes as paths
  function drawHeart(ctx, x, y, size, alpha, color) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.translate(x, y);
    ctx.scale(size, size);
    ctx.beginPath();
    ctx.moveTo(0, -0.5);
    ctx.bezierCurveTo(0.5, -1, 1, -0.3, 0, 0.5);
    ctx.bezierCurveTo(-1, -0.3, -0.5, -1, 0, -0.5);
    ctx.fill();
    ctx.restore();
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x      = Math.random() * W;
      this.y      = init ? Math.random() * H : H + 20;
      this.r      = Math.random() * 3 + 0.6;
      this.alpha  = Math.random() * 0.4 + 0.05;
      this.vx     = (Math.random() - 0.5) * 0.4;
      this.vy     = -(Math.random() * 0.5 + 0.12);
      this.color  = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = (Math.random() - 0.5) * 0.022;
      this.isHeart = Math.random() < 0.12; // 12% are tiny hearts
    }
    update() {
      this.wobble += this.wobbleSpeed;
      this.x += this.vx + Math.sin(this.wobble) * 0.3;
      this.y += this.vy;
      if (this.y < -20) this.reset(false);
    }
    draw() {
      if (this.isHeart) {
        drawHeart(ctx, this.x, this.y, this.r * 1.8, this.alpha, this.color);
      } else {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
      }
    }
  }

  // Sparkle class
  class Sparkle {
    constructor() { this.reset(); }
    reset() {
      this.x     = Math.random() * W;
      this.y     = Math.random() * H;
      this.size  = Math.random() * 1.5 + 0.4;
      this.alpha = 0;
      this.maxAlpha = Math.random() * 0.6 + 0.1;
      this.phase = Math.random() * Math.PI * 2;
      this.speed = Math.random() * 0.018 + 0.008;
    }
    update() {
      this.phase += this.speed;
      this.alpha = ((Math.sin(this.phase) + 1) / 2) * this.maxAlpha;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = '#F7D4DF';
      ctx.translate(this.x, this.y);
      // 4-pointed star
      for (let i = 0; i < 4; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI) / 2);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(this.size * 0.4, this.size * 0.4);
        ctx.lineTo(0, this.size * 2);
        ctx.lineTo(-this.size * 0.4, this.size * 0.4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    }
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 110 }, () => new Particle());
  const sparkles  = Array.from({ length: 40  }, () => new Sparkle());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    sparkles.forEach(s => { s.update(); s.draw(); });
    particles.forEach(p => { p.update(); p.draw(); });
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  }
  loop();

  // Burst on click
  document.addEventListener('click', e => {
    if (e.target.closest('input, textarea, select, [data-no-burst]')) return;

    for (let i = 0; i < 8; i++) {
      const p = new Particle();
      p.x = e.clientX; p.y = e.clientY;
      p.r = Math.random() * 3 + 1;
      p.vx = (Math.random() - 0.5) * 3;
      p.vy = -(Math.random() * 4 + 1);
      p.alpha = 0.6;
      particles.push(p);
    }

    createQuietClickSpark(e.clientX, e.clientY);
    if (particles.length > 180) particles.splice(0, 20);
  });
})();

addFloatingCutes();

/* ── ENVELOPE INTRO ── */
(function () {
  const scene    = document.getElementById('envelope-scene');
  const wrap     = document.querySelector('.envelope-wrap');
  const main     = document.getElementById('main-content');
  if (!scene || !wrap) return;

  // Sprinkle floating hearts around envelope
  const heartsEl = document.querySelector('.env-hearts');
  for (let i = 0; i < 8; i++) {
    const h = document.createElement('div');
    h.className = 'env-heart';
    h.textContent = ['♡','❀','✿','❋'][Math.floor(Math.random()*4)];
    h.style.cssText = `
      left:${Math.random()*110-5}%;
      top:${Math.random()*110-5}%;
      animation: envHeartFloat ${2+Math.random()*3}s ${Math.random()*2}s ease-in-out infinite;
      font-size:${10+Math.random()*10}px;
    `;
    heartsEl.appendChild(h);
  }

  // Inject keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes envHeartFloat {
      0%,100% { opacity:0; transform:translateY(0) scale(0.8) rotate(-5deg); }
      30%      { opacity:0.5; }
      60%      { opacity:0.3; transform:translateY(-18px) scale(1.1) rotate(5deg); }
    }
  `;
  document.head.appendChild(style);

  let opened = false;
  wrap.addEventListener('click', e => {
    if (opened) return;
    opened = true;
    
    // Play paper tear sound
    playPaperTearSound();
    
    wrap.classList.add('open');
    const rect = wrap.getBoundingClientRect();
    createQuietClickSpark(rect.left + rect.width / 2, rect.top + rect.height / 2);

    // After letter peeks out, fade to main
    setTimeout(() => {
      scene.classList.add('gone');
      main.classList.add('revealed');
      
      // Play paper rustle sound when scrapbook is opened
      playPaperRustleSound();
      
      // Reveal the companion "Skye" and speak a welcome bubble
      const skye = document.getElementById('skye-companion');
      if (skye) {
        skye.classList.add('visible');
        setTimeout(() => {
          window.showSkyeBubble && window.showSkyeBubble("hey, you actually showed up. ♡");
        }, 800);
      }
      
      // Try to start music
      window.tryMusicPlay && window.tryMusicPlay();
    }, 1600);
  });
})();

/* ── SCROLL REVEAL ── */
(function () {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(
    '.reveal-block, .section-title, .quote-opening, .quote-body, .quote-sig, ' +
    '.closing-headline, .closing-body, .signature, .made-with, .soft-divider, .reel-item'
  ).forEach(el => io.observe(el));
})();

/* ── PAPER UNFOLD & EASTER EGG ── */
(function () {
  const paper = document.getElementById('paper-unfold');
  if (!paper) return;

  const labelEl = paper.querySelector('.paper-label');
  const textEl = paper.querySelector('.paper-content p');
  let lastSeen = -1;
  let activeSection = null;
  let audioCtx = null;

  const updatePaperFold = () => {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    const foldProgress = Math.max(0, Math.min(1, progress * 1.18));
    paper.style.setProperty('--fold-progress', foldProgress.toFixed(3));

    const shouldOpen = foldProgress > 0.04 || Boolean(activeSection);
    paper.classList.toggle('open', shouldOpen);
    paper.classList.toggle('is-folded', foldProgress < 0.18);
  };

  const update3DScrollFolding = () => {
    const wrappers = document.querySelectorAll('.paper-fold-wrapper');
    const vh = window.innerHeight;
    const vh2 = vh / 2;
    const maxAngle = 38; // 38 degrees is a perfect paper fold angle

    wrappers.forEach((wrapper, index) => {
      const section = wrapper.closest('.page-section');
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height / 2;

      // Normalized progress relative to viewport center: -1.2 to 1.2
      let progress = (sectionCenter - vh2) / vh2;
      progress = Math.max(-1.2, Math.min(1.2, progress));

      // Alternate fold direction for accordion zigzag
      const isEven = index % 2 === 0;
      const angle = isEven ? progress * maxAngle : -progress * maxAngle;

      // Calculate scaleY to maintain projected height: scaleY = 1 / cos(angle)
      const angleRad = (angle * Math.PI) / 180;
      const scaleY = 1 / Math.cos(angleRad);

      wrapper.style.transform = `perspective(1800px) rotateX(${angle.toFixed(2)}deg) scaleY(${scaleY.toFixed(4)})`;

      // Update shadow overlay opacity based on the fold angle
      const shadowOverlay = wrapper.querySelector('.paper-shadow-overlay');
      if (shadowOverlay) {
        const shadowOpacity = Math.min(0.55, Math.abs(progress) * 0.45);
        shadowOverlay.style.opacity = shadowOpacity.toFixed(3);
      }
    });
  };

  const showPaperForSection = (section) => {
    const index = Number(section.dataset.sectionIndex || 0);
    if (index === lastSeen) return;
    lastSeen = index;
    activeSection = section;

    const label = section.dataset.paperLabel || 'a quiet note';
    const copy = section.dataset.paperCopy || 'the next page opens softly';
    const note = section.dataset.edgeNote || '';
    const position = section.dataset.edgeNotePos || 'top-right';

    labelEl.textContent = label;
    textEl.textContent = copy;
    paper.classList.add('open');
    paper.classList.remove('is-folded');

    if (note) {
      showEdgeNote(note, position);
    }

    updatePaperFold();
  };

  const sections = Array.from(document.querySelectorAll('.page-section'));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        showPaperForSection(entry.target);
      } else if (entry.target === activeSection) {
        activeSection = null;
        updatePaperFold();
      }
    });
  }, { threshold: 0.34 });

  sections.forEach((section, index) => {
    section.dataset.sectionIndex = index;
    observer.observe(section);
  });

  const positions = ['corner-tl', 'corner-tr', 'corner-bl', 'edge-top', 'edge-left', 'edge-right'];
  const tab = document.createElement('button');
  tab.type = 'button';
  tab.className = 'paper-peek';
  tab.setAttribute('aria-label', 'Open a tiny surprise');
  tab.innerHTML = '<div style="display:flex; flex-direction:column; align-items:center; gap:2px;"><span class="paper-peek-label">surprise</span><span style="font-size:10px; color:var(--deep-rose);">✿</span></div>';
  document.body.appendChild(tab);

  const overlay = document.createElement('div');
  overlay.className = 'easter-egg-overlay';
  overlay.innerHTML = `
    <div class="easter-egg-card" role="dialog" aria-modal="true" aria-label="Tiny surprise">
      <button class="egg-close" type="button" aria-label="Close surprise">✕</button>
      <div class="egg-icon">♡</div>
      <p class="egg-title">a tiny secret</p>
      <p class="egg-copy">I tucked a little sparkle in here just for you.</p>
      <p class="egg-footer">keep scrolling, little heart</p>
    </div>
  `;
  document.body.appendChild(overlay);

  const card = overlay.querySelector('.easter-egg-card');
  const closeBtn = overlay.querySelector('.egg-close');

  function playEasterEggSound() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    if (!audioCtx) audioCtx = new Ctx();

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const notes = [1046.50, 1318.51, 1567.98, 2093.00]; // C6, E6, G6, C7
    notes.forEach((freq, index) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.07);
      
      gain.gain.setValueAtTime(0.0001, now + index * 0.07);
      gain.gain.linearRampToValueAtTime(0.05, now + index * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.07 + 0.22);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start(now + index * 0.07);
      osc.stop(now + index * 0.07 + 0.25);
    });
  }

  function createEggConfetti(container) {
    const glyphs = ['✧', '♡', '✿', '❋', '🌸', '✨', '🎈'];
    const count = 25;
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'egg-confetti';
    container.appendChild(confettiContainer);

    for (let i = 0; i < count; i++) {
      const span = document.createElement('span');
      span.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      span.style.left = `${10 + Math.random() * 80}%`;
      span.style.top = `-20px`;
      span.style.color = ['#F7D4DF', '#E8A0B8', '#D4ADCF', '#F2E4EA', '#F5C5B0'][Math.floor(Math.random() * 5)];
      
      const dx = (Math.random() - 0.5) * 160;
      const r = Math.random() * 360 + 360;
      const dur = 1.0 + Math.random() * 1.4;
      const delay = Math.random() * 0.35;
      
      span.style.setProperty('--cf-x', `${dx}px`);
      span.style.setProperty('--cf-r', `${r}deg`);
      span.style.setProperty('--cf-dur', `${dur}s`);
      span.style.setProperty('--cf-delay', `${delay}s`);
      span.style.fontSize = `${12 + Math.random() * 12}px`;
      
      confettiContainer.appendChild(span);
    }
    
    setTimeout(() => confettiContainer.remove(), 2800);
  }

  let tabVisible = false;
  let currentPosition = '';

  function setPeekPosition(position) {
    currentPosition = position;
    tab.className = `paper-peek peek-visible ${position}`;
  }

  function updateEasterPeek() {
    const triggerSection = document.querySelectorAll('.page-section')[2]; // 3rd section (index 2: Landscape Photos)
    if (!triggerSection) return;

    const rect = triggerSection.getBoundingClientRect();
    const vh = window.innerHeight;
    const shouldShow = rect.top < vh * 0.55 && rect.bottom > vh * 0.3;

    if (!shouldShow) {
      if (tabVisible) {
        tabVisible = false;
        tab.classList.remove('peek-visible');
      }
      return;
    }

    if (!tabVisible) {
      tabVisible = true;
      const position = positions[Math.floor(Math.random() * positions.length)];
      setPeekPosition(position);
    }
  }

  tab.addEventListener('click', (event) => {
    event.stopPropagation();
    playEasterEggSound();
    overlay.classList.add('show');
    tab.classList.remove('peek-visible');

    const messages = [
      "My favorite place in the world is right next to you. ♡",
      "A little reminder: You are doing so well, and I'm incredibly proud of you. ✨",
      "Here is a virtual hug, wrapped in paper and sent with all my warmth. ✿",
      "Every time I think of you, a tiny star starts shining a little brighter. ✧",
      "You are my favorite thought. Yes, you. 🌸",
      "I tucked a little sparkle in here just for you. ♡"
    ];
    const chosenMessage = messages[Math.floor(Math.random() * messages.length)];
    overlay.querySelector('.egg-copy').textContent = chosenMessage;

    createEggConfetti(card);
  });

  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('show');
    if (tabVisible) {
      tab.classList.add('peek-visible');
    }
  });

  overlay.addEventListener('click', () => {
    overlay.classList.remove('show');
    if (tabVisible) {
      tab.classList.add('peek-visible');
    }
  });

  card.addEventListener('click', (event) => event.stopPropagation());

  window.addEventListener('scroll', () => {
    updatePaperFold();
    updateEasterPeek();
    update3DScrollFolding();
  }, { passive: true });
  window.addEventListener('resize', () => {
    updatePaperFold();
    updateEasterPeek();
    update3DScrollFolding();
  });

  updatePaperFold();
  updateEasterPeek();
  update3DScrollFolding();
})();

/* ── POLAROID WALL ── */
(function () {
  const polaroids = document.querySelectorAll('.polaroid');
  const rotations = [-3.5, 1.8, -1.2, 2.6, -2.8, 1.4, -0.8, 3.1, -1.9, 2.3, -2.1, 0.9];

  // Assign rotations
  polaroids.forEach((p, i) => {
    const rot = rotations[i % rotations.length];
    p.dataset.rot = rot;
    p.style.transform = `translateY(30px) rotate(${rot}deg)`;

    // Hover: straighten
    p.addEventListener('mouseenter', () => {
      p.style.transform = `translateY(-8px) rotate(0deg) scale(1.04)`;
    });
    p.addEventListener('mouseleave', () => {
      p.style.transform = `translateY(0) rotate(${rot}deg) scale(1)`;
    });
  });

  // Reveal on scroll
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const rot = e.target.dataset.rot || 0;
        e.target.style.transition =
          'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease';
        e.target.classList.add('in');
        e.target.style.transform = `translateY(0) rotate(${rot}deg)`;
        e.target.style.opacity = '1';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  polaroids.forEach((p, i) => {
    p.style.transitionDelay = (i % 4) * 0.1 + 's';
    io.observe(p);
  });
})();

/* ── LIGHTBOX ── */
(function () {
  const lb       = document.getElementById('lightbox');
  const lbCard   = lb.querySelector('.lightbox-card');
  const lbImg    = document.getElementById('lb-img');
  const lbCap    = document.getElementById('lb-cap');
  const lbClose  = document.getElementById('lb-close');
  const lbPrev   = document.getElementById('lb-prev');
  const lbNext   = document.getElementById('lb-next');
  const backdrop = lb.querySelector('.lightbox-backdrop');

  let items = []; // { src, caption, type }
  let current = 0;

  function collectItems() {
    items = [];
    document.querySelectorAll('.polaroid[data-src]').forEach(p => {
      items.push({ src: p.dataset.src, caption: p.dataset.caption || '', type: p.dataset.type || 'img' });
    });
    // Also fallback: any polaroid (placeholder or real)
    if (items.length === 0) {
      document.querySelectorAll('.polaroid').forEach(p => {
        items.push({ src: null, caption: p.querySelector('.polaroid-caption')?.textContent || '', type: 'img' });
      });
    }
  }

  function openAt(idx) {
    collectItems();
    current = ((idx % items.length) + items.length) % items.length;
    const it = items[current];

    lbCard.innerHTML = '';

    // Close btn
    const closeBtn = document.createElement('button');
    closeBtn.id = 'lb-close';
    closeBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>`;
    closeBtn.onclick = closeLB;
    lbCard.appendChild(closeBtn);

    if (it.src) {
      const media = document.createElement(it.type === 'video' ? 'video' : 'img');
      media.src = it.src;
      if (it.type === 'video') { media.controls = true; media.autoplay = true; }
      lbCard.appendChild(media);
    } else {
      // Placeholder
      const ph = document.createElement('div');
      ph.style.cssText = 'width:320px;aspect-ratio:1;background:var(--blush);display:flex;align-items:center;justify-content:center;color:var(--deep-rose);opacity:0.5;font-family:Cormorant Garamond,serif;font-style:italic;font-size:18px;';
      ph.textContent = 'your photo here';
      lbCard.appendChild(ph);
    }

    const cap = document.createElement('p');
    cap.className = 'lightbox-caption';
    cap.textContent = it.caption;
    lbCard.appendChild(cap);

    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLB() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  backdrop.addEventListener('click', closeLB);
  lbPrev.addEventListener('click', () => openAt(current - 1));
  lbNext.addEventListener('click', () => openAt(current + 1));

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLB();
    if (e.key === 'ArrowRight')  openAt(current + 1);
    if (e.key === 'ArrowLeft')   openAt(current - 1);
  });

  document.querySelectorAll('.polaroid').forEach((p, i) => {
    p.addEventListener('click', e => {
      e.stopPropagation();
      const rect = p.getBoundingClientRect();
      createQuietClickSpark(rect.left + rect.width / 2, rect.top + rect.height / 2);
      collectItems();
      openAt(i);
    });
  });
})();

/* ── MUSIC PLAYER ── */
(function () {
  /*
   * Drop your mp3s into a /music folder at the root.
   * Name them anything — they load in alphabetical order.
   * This function tries common filenames; if you want full
   * dynamic folder scanning, you need a tiny server (included
   * in the Vercel config below as api/tracks.js).
   *
   * For zero-server use, just list your files in TRACK_LIST below.
   */
  const TRACK_LIST = [
    'music/01.mp3',
    'music/02.mp3',
    'music/03.mp3',
    'music/04.mp3',
    'music/05.mp3',
    'music/06.mp3',
    'music/07.mp3',
    'music/08.mp3',
    'music/09.mp3',
    'music/10.mp3',
  ];

  // Try to get dynamic list from /api/tracks if available
  async function getPlaylist() {
    try {
      const r = await fetch('/api/tracks');
      if (r.ok) { const d = await r.json(); return d.tracks || TRACK_LIST; }
    } catch {}
    return TRACK_LIST;
  }

  let playlist = TRACK_LIST.map((src, i) => ({
    src,
    title: src.replace('music/','').replace('.mp3','').replace(/^\d+[-_.\s]?/,'') || `Track ${i+1}`
  }));

  let idx = 0, playing = false;
  const audio = new Audio();
  audio.volume = 0.65;

  const playBtn  = document.getElementById('p-play');
  const prevBtn  = document.getElementById('p-prev');
  const nextBtn  = document.getElementById('p-next');
  const titleEl  = document.getElementById('p-title');
  const volEl    = document.getElementById('p-vol');
  const eqBars   = document.querySelectorAll('.p-eq-bar');

  const PLAY_ICON  = '<path d="M8 5v14l11-7z"/>';
  const PAUSE_ICON = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';

  function setEQ(active) {
    eqBars.forEach(b => { b.style.animationPlayState = active ? 'running' : 'paused'; });
  }

  function updateTitle() {
    const name = playlist[idx].title || `♫ ${idx + 1}`;
    titleEl.textContent = '♫ ' + (name.charAt(0).toUpperCase() + name.slice(1));
  }

  function load(i, autoplay) {
    idx = ((i % playlist.length) + playlist.length) % playlist.length;
    audio.src = playlist[idx].src;
    updateTitle();
    if (autoplay) {
      audio.play()
        .then(() => { playing = true; updatePlayBtn(); setEQ(true); })
        .catch(() => {});
    }
  }

  function updatePlayBtn() {
    playBtn.querySelector('svg').innerHTML = playing ? PAUSE_ICON : PLAY_ICON;
    setEQ(playing);
  }

  playBtn.addEventListener('click', () => {
    if (!audio.src || audio.src === window.location.href) { load(0, true); return; }
    if (playing) { audio.pause(); playing = false; }
    else { audio.play().then(() => { playing = true; }).catch(()=>{}); }
    updatePlayBtn();
  });
  prevBtn.addEventListener('click', () => load(idx - 1, playing));
  nextBtn.addEventListener('click', () => load(idx + 1, playing));
  audio.addEventListener('ended', () => load(idx + 1, true));
  volEl.addEventListener('input', () => {
    audio.volume = parseFloat(volEl.value);
    const pct = Math.round(parseFloat(volEl.value) * 100);
    volEl.style.background = `linear-gradient(to right, var(--deep-rose) ${pct}%, rgba(196,122,138,0.22) ${pct}%)`;
  });

  // Expose for envelope trigger
  window.tryMusicPlay = () => {
    if (!playing) {
      load(0, true);
    }
  };

  // Try immediate autoplay
  load(0, false);
  setTimeout(() => {
    audio.play().then(() => { playing = true; updatePlayBtn(); setEQ(true); }).catch(()=>{});
  }, 600);

  // Fallback on interaction
  const onInteract = () => {
    if (!playing) {
      audio.play().then(() => { playing = true; updatePlayBtn(); setEQ(true); }).catch(()=>{});
    }
  };
  document.addEventListener('click', onInteract, { once: true });
  document.addEventListener('touchstart', onInteract, { once: true });

  // Fetch dynamic playlist
  getPlaylist().then(tracks => {
    if (Array.isArray(tracks) && tracks.length > 0) {
      playlist = tracks.map((src, i) => {
        const name = src.replace(/^music\//,'').replace(/\.mp3$/i,'').replace(/^\d+[-_.\s]?/,'');
        return { src: src.startsWith('music/') ? src : `music/${src}`, title: name || `Track ${i+1}` };
      });
      if (!playing) { load(0, false); }
      updateTitle();
    }
  });
})();

/* ── FLOATING COMPANION "SKYE" ── */
(function () {
  const skye = document.getElementById('skye-companion');
  if (!skye) return;
  const skyeCloud = skye.querySelector('.skye-cloud');
  const skyeBubble = skye.querySelector('.skye-speech-bubble');
  const skyeQuote = skye.querySelector('.skye-quote');

  let skyePos = { x: 80, y: window.innerHeight - 140 };
  let skyeTarget = { x: 80, y: window.innerHeight - 140 };

  document.addEventListener('mousemove', (e) => {
    skyeTarget.x = e.clientX - 50;
    skyeTarget.y = e.clientY + 30;
  });

  function updateSkye() {
    skyePos.x += (skyeTarget.x - skyePos.x) * 0.045;
    skyePos.y += (skyeTarget.y - skyePos.y) * 0.045;

    const pad = 20;
    skyePos.x = Math.max(pad, Math.min(window.innerWidth - 90, skyePos.x));
    skyePos.y = Math.max(pad, Math.min(window.innerHeight - 90, skyePos.y));

    skye.style.left = skyePos.x + 'px';
    skye.style.top = skyePos.y + 'px';

    requestAnimationFrame(updateSkye);
  }
  requestAnimationFrame(updateSkye);

  const quotes = [
    "Thinking of you right now... ♡",
    "Scroll down, I'm right here with you. ✨",
    "Life gets messy, but you're my favorite part. 🌸",
    "Did you know? You're incredibly special to me.",
    "meow meow rawr. 🐾",
    "No matter what happens, you will always matter to me. ♡",
    "Click anywhere to spill some watercolor magic!",
    "Are you enjoying the music? ♫"
  ];

  let bubbleTimeout = null;
  window.showSkyeBubble = function (customText = null) {
    if (bubbleTimeout) clearTimeout(bubbleTimeout);

    const text = customText || quotes[Math.floor(Math.random() * quotes.length)];
    skyeQuote.textContent = text;
    skyeBubble.classList.add('show');

    playStarChimeSound(1000 + Math.random() * 250);

    skyeCloud.style.transform = 'scale(1.18) rotate(6deg)';
    setTimeout(() => {
      skyeCloud.style.transform = '';
    }, 250);

    bubbleTimeout = setTimeout(() => {
      skyeBubble.classList.remove('show');
    }, 3200);
  };

  skyeCloud.addEventListener('click', (e) => {
    e.stopPropagation();
    window.showSkyeBubble();
  });

  setInterval(() => {
    if (skye.classList.contains('visible') && !skyeBubble.classList.contains('show') && Math.random() < 0.4) {
      window.showSkyeBubble();
    }
  }, 22000);
})();

/* ── CALLIGRAPHY DESK WRITING ── */
(function () {
  const section = document.querySelector('.calligraphy-section');
  if (!section) return;
  const deskPaper = section.querySelector('.desk-paper');
  const feather = section.querySelector('.calligraphy-feather');
  const lines = [
    section.querySelector('.written-line-1'),
    section.querySelector('.written-line-2'),
    section.querySelector('.written-line-3')
  ];

  const texts = [
    "I know I'm not perfect. I can get messy,",
    "I can say silly things and get it wrong sometimes...",
    "But you are and always will be incredibly special to me."
  ];

  let started = false;
  
  const writerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        startWriting();
        writerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.45 });

  writerObserver.observe(section);

  async function startWriting() {
    feather.style.display = 'block';
    
    for (let l = 0; l < lines.length; l++) {
      const lineEl = lines[l];
      const text = texts[l];
      const lineRect = lineEl.getBoundingClientRect();
      
      let currentText = "";
      
      for (let i = 0; i < text.length; i++) {
        currentText += text[i];
        lineEl.textContent = currentText;
        
        const progress = i / text.length;
        const featherX = 48 + progress * (lineRect.width - 48);
        const featherY = lineEl.offsetTop + 32;
        
        feather.style.left = featherX + 'px';
        feather.style.top = featherY + 'px';
        
        if (text[i] !== ' ') {
          playWritingScratchSound();
        }
        
        await new Promise(r => setTimeout(r, 60 + Math.random() * 50));
      }
      
      await new Promise(r => setTimeout(r, 600));
    }
    
    feather.style.transition = 'all 0.5s ease';
    feather.style.opacity = '0';
    setTimeout(() => {
      feather.style.display = 'none';
    }, 500);
  }
})();

/* ── TIMELINE MEMORY UNFOLD ── */
(function () {
  const items = document.querySelectorAll('.timeline-item');
  
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        timelineObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(item => {
    timelineObserver.observe(item);
    
    const card = item.querySelector('.timeline-card');
    card.addEventListener('click', () => {
      const alreadyUnfolded = card.classList.contains('unfolded');
      
      document.querySelectorAll('.timeline-card').forEach(c => c.classList.remove('unfolded'));
      
      if (!alreadyUnfolded) {
        card.classList.add('unfolded');
        playPaperRustleSound();
        
        const index = Number(item.dataset.index);
        const comments = [
          "I still remember how my heart raced that day... ♡",
          "We stayed up so late, the moon went to sleep before us. 🌙",
          "No storm will ever be strong enough to pull me away. ⛈️"
        ];
        if (window.showSkyeBubble) {
          window.showSkyeBubble(comments[index]);
        }
      }
    });
  });
})();

/* ── CONSTELLATION SKY CANVAS ── */
(function () {
  const section = document.querySelector('.constellation-section');
  if (!section) return;
  const canvas = document.getElementById('constellation-canvas');
  const ctx = canvas.getContext('2d');
  const letter = document.getElementById('constellation-letter');

  let W, H;
  function resize() {
    if (!canvas.parentNode) return;
    const rect = canvas.parentNode.getBoundingClientRect();
    W = canvas.width = rect.width;
    H = canvas.height = rect.height;
  }
  resize();
  window.addEventListener('resize', resize);

  const heartPoints = [
    { x: 0, y: -0.22 },
    { x: 0.22, y: -0.38 },
    { x: 0.38, y: -0.2 },
    { x: 0.3, y: 0.08 },
    { x: 0, y: 0.38 }, // bottom tip
    { x: -0.3, y: 0.08 },
    { x: -0.38, y: -0.2 },
    { x: -0.22, y: -0.38 }
  ];

  let stars = [];
  function initStars() {
    stars = heartPoints.map((pt, index) => {
      return {
        id: index,
        x: W / 2 + pt.x * W * 0.85,
        y: H / 2 + pt.y * H * 0.85,
        r: 3.5 + Math.random() * 2,
        active: false,
        pulsePhase: Math.random() * Math.PI,
        pulseSpeed: 0.02 + Math.random() * 0.03
      };
    });
  }
  initStars();
  window.addEventListener('resize', initStars);

  let bgStars = [];
  function initBgStars() {
    bgStars = [];
    for (let i = 0; i < 40; i++) {
      bgStars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        alpha: 0.2 + Math.random() * 0.5,
        speed: 0.01 + Math.random() * 0.02,
        phase: Math.random() * Math.PI
      });
    }
  }
  initBgStars();
  window.addEventListener('resize', initBgStars);

  let selectedOrder = [];
  let isComplete = false;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    bgStars.forEach(s => {
      s.phase += s.speed;
      const alpha = s.alpha * ((Math.sin(s.phase) + 1) / 2);
      ctx.fillStyle = `rgba(253, 245, 239, ${alpha})`;
      ctx.fillRect(s.x, s.y, 1.2, 1.2);
    });

    if (selectedOrder.length > 0) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(247, 212, 223, 0.45)';
      ctx.shadowColor = 'rgba(232, 160, 184, 0.5)';
      ctx.shadowBlur = 12;
      ctx.lineWidth = 1.8;

      const firstStar = stars[selectedOrder[0]];
      ctx.moveTo(firstStar.x, firstStar.y);

      for (let i = 1; i < selectedOrder.length; i++) {
        const star = stars[selectedOrder[i]];
        ctx.lineTo(star.x, star.y);
      }

      if (isComplete) {
        ctx.closePath();
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    stars.forEach(s => {
      s.pulsePhase += s.pulseSpeed;
      const scale = 1 + Math.sin(s.pulsePhase) * 0.18;
      
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 2.8 * scale, 0, Math.PI * 2);
      ctx.fillStyle = s.active 
        ? 'rgba(232, 160, 184, 0.22)' 
        : 'rgba(247, 212, 223, 0.08)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * scale, 0, Math.PI * 2);
      ctx.fillStyle = s.active ? '#ffffff' : 'rgba(247, 212, 223, 0.7)';
      ctx.fill();

      if (s.active) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(s.x - s.r * 2, s.y); ctx.lineTo(s.x + s.r * 2, s.y);
        ctx.moveTo(s.x, s.y - s.r * 2); ctx.lineTo(s.x, s.y + s.r * 2);
        ctx.stroke();
      }
    });

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);

  canvas.addEventListener('click', (e) => {
    if (isComplete) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let clickedStar = null;
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const dist = Math.hypot(s.x - x, s.y - y);
      if (dist < 28) {
        clickedStar = s;
        break;
      }
    }

    if (clickedStar) {
      const id = clickedStar.id;
      
      if (!selectedOrder.includes(id)) {
        selectedOrder.push(id);
        clickedStar.active = true;
        
        const chimeFreqs = [440, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99, 880.00];
        const freqIndex = (selectedOrder.length - 1) % chimeFreqs.length;
        playStarChimeSound(chimeFreqs[freqIndex]);
        
        createQuietClickSpark(e.clientX, e.clientY);

        if (selectedOrder.length === stars.length) {
          isComplete = true;
          playMagicConstellationSound();
          
          setTimeout(() => {
            letter.classList.add('reveal');
            if (window.showSkyeBubble) {
              window.showSkyeBubble("you found my heart in the stars... ✧");
            }
          }, 800);
        }
      }
    }
  });

  const seal = letter.querySelector('.letter-seal');
  seal.addEventListener('click', (e) => {
    e.stopPropagation();
    letter.classList.remove('reveal');
    selectedOrder = [];
    stars.forEach(s => s.active = false);
    isComplete = false;
    playPaperRustleSound();
  });
})();

/* ── WATERCOLOR CLICK BLOTCHES ── */
(function () {
  const canvas = document.getElementById('watercolor-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  let blotches = [];

  class Blot {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.r = 10;
      this.maxR = 50 + Math.random() * 40;
      this.alpha = 0.24;
      this.speed = 1.5 + Math.random() * 1.5;
      const colors = [
        'rgba(247, 212, 223, ',
        'rgba(232, 160, 184, ',
        'rgba(212, 173, 207, ',
        'rgba(245, 197, 176, '
      ];
      this.colorBase = colors[Math.floor(Math.random() * colors.length)];
      this.points = [];
      const numPoints = 8 + Math.floor(Math.random() * 5);
      for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        this.points.push({
          angle: angle,
          variance: 0.8 + Math.random() * 0.4
        });
      }
    }
    update() {
      if (this.r < this.maxR) {
        this.r += this.speed;
        this.alpha -= 0.0018;
      } else {
        this.alpha -= 0.004;
      }
    }
    draw() {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.beginPath();
      const startX = this.x + Math.cos(this.points[0].angle) * this.r * this.points[0].variance;
      const startY = this.y + Math.sin(this.points[0].angle) * this.r * this.points[0].variance;
      ctx.moveTo(startX, startY);

      for (let i = 1; i < this.points.length; i++) {
        const pt = this.points[i];
        const currX = this.x + Math.cos(pt.angle) * this.r * pt.variance;
        const currY = this.y + Math.sin(pt.angle) * this.r * pt.variance;
        ctx.lineTo(currX, currY);
      }
      ctx.closePath();
      
      ctx.shadowColor = this.colorBase + '0.15)';
      ctx.shadowBlur = 15;
      ctx.fillStyle = this.colorBase + this.alpha + ')';
      ctx.fill();
      ctx.restore();
    }
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('input, button, a, .polaroid, .reel-frame, #lightbox, .timeline-card, #constellation-canvas, #skye-companion')) return;
    blotches.push(new Blot(e.clientX, e.clientY));
    if (blotches.length > 25) {
      blotches.shift();
    }
  });

  function loop() {
    ctx.clearRect(0, 0, W, H);
    blotches.forEach((b, index) => {
      b.update();
      b.draw();
      if (b.alpha <= 0) {
        blotches.splice(index, 1);
      }
    });
    requestAnimationFrame(loop);
  }
  loop();
})();