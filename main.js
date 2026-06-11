/* ═══════════════════════════════════════════
   FOR DISA — main.js
   ═══════════════════════════════════════════ */

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
    wrap.classList.add('open');
    const rect = wrap.getBoundingClientRect();
    createQuietClickSpark(rect.left + rect.width / 2, rect.top + rect.height / 2);

    // After letter peeks out, fade to main
    setTimeout(() => {
      scene.classList.add('gone');
      main.classList.add('revealed');
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