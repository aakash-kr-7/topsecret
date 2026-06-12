/* ═══════════════════════════════════════════
   FOR DISA — main.js
   Production-grade, reel-worthy
   ═══════════════════════════════════════════ */

/* ══════════════════════════════════════════
   AUDIO ENGINE
   ══════════════════════════════════════════ */
let audioCtx = null;
function getAudioContext() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) audioCtx = new Ctx();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}
function playPaperTearSound() {
  const ctx = getAudioContext(); if (!ctx) return;
  const now = ctx.currentTime, len = ctx.sampleRate * 0.4;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) { d[i] = (Math.random()*2-1)*0.12 + (Math.random()<0.006?(Math.random()*2-1)*0.45:0); }
  const s = ctx.createBufferSource(); s.buffer = buf;
  const f = ctx.createBiquadFilter(); f.type='bandpass'; f.frequency.setValueAtTime(1400,now); f.frequency.exponentialRampToValueAtTime(250,now+0.4); f.Q.setValueAtTime(4,now);
  const g = ctx.createGain(); g.gain.setValueAtTime(0.001,now); g.gain.linearRampToValueAtTime(0.22,now+0.05); g.gain.exponentialRampToValueAtTime(0.001,now+0.4);
  s.connect(f); f.connect(g); g.connect(ctx.destination); s.start(now); s.stop(now+0.4);
}
function playPaperRustleSound() {
  const ctx = getAudioContext(); if (!ctx) return;
  const now = ctx.currentTime, len = ctx.sampleRate * 0.28;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random()*2-1;
  const s = ctx.createBufferSource(); s.buffer = buf;
  const f = ctx.createBiquadFilter(); f.type='bandpass'; f.frequency.setValueAtTime(2200,now); f.frequency.exponentialRampToValueAtTime(500,now+0.28); f.Q.setValueAtTime(1.5,now);
  const g = ctx.createGain(); g.gain.setValueAtTime(0.001,now); g.gain.linearRampToValueAtTime(0.08,now+0.03); g.gain.exponentialRampToValueAtTime(0.0001,now+0.28);
  s.connect(f); f.connect(g); g.connect(ctx.destination); s.start(now); s.stop(now+0.28);
}
function playWritingScratchSound() {
  const ctx = getAudioContext(); if (!ctx) return;
  const now = ctx.currentTime, len = ctx.sampleRate * 0.04;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random()*2-1;
  const s = ctx.createBufferSource(); s.buffer = buf;
  const f = ctx.createBiquadFilter(); f.type='bandpass'; f.frequency.setValueAtTime(2600+Math.random()*500,now); f.Q.setValueAtTime(6,now);
  const g = ctx.createGain(); g.gain.setValueAtTime(0.02,now); g.gain.exponentialRampToValueAtTime(0.0001,now+0.035);
  s.connect(f); f.connect(g); g.connect(ctx.destination); s.start(now); s.stop(now+0.04);
}
function playChime(freq=880) {
  const ctx = getAudioContext(); if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator(), g = ctx.createGain();
  osc.type='sine'; osc.frequency.setValueAtTime(freq,now); osc.frequency.exponentialRampToValueAtTime(freq*1.4,now+0.22);
  g.gain.setValueAtTime(0.001,now); g.gain.linearRampToValueAtTime(0.045,now+0.02); g.gain.exponentialRampToValueAtTime(0.0001,now+0.32);
  osc.connect(g); g.connect(ctx.destination); osc.start(now); osc.stop(now+0.32);
}
function playMagicSound() {
  const ctx = getAudioContext(); if (!ctx) return;
  const now = ctx.currentTime;
  [698.46,880,1046.50,1396.91,1760,2093].forEach((freq,i) => {
    const o=ctx.createOscillator(), g=ctx.createGain();
    o.type='sine'; o.frequency.setValueAtTime(freq,now+i*0.06);
    g.gain.setValueAtTime(0.0001,now+i*0.06); g.gain.linearRampToValueAtTime(0.05,now+i*0.06+0.02); g.gain.exponentialRampToValueAtTime(0.0001,now+i*0.06+0.38);
    o.connect(g); g.connect(ctx.destination); o.start(now+i*0.06); o.stop(now+i*0.06+0.4);
  });
}
function playPostcardSound() {
  const ctx = getAudioContext(); if (!ctx) return;
  const now = ctx.currentTime;
  [1046.50,1318.51,1567.98].forEach((freq,i) => {
    const o=ctx.createOscillator(), g=ctx.createGain();
    o.type='sine'; o.frequency.setValueAtTime(freq,now+i*0.08);
    g.gain.setValueAtTime(0.0001,now+i*0.08); g.gain.linearRampToValueAtTime(0.04,now+i*0.08+0.02); g.gain.exponentialRampToValueAtTime(0.0001,now+i*0.08+0.2);
    o.connect(g); g.connect(ctx.destination); o.start(now+i*0.08); o.stop(now+i*0.08+0.25);
  });
}

/* ══════════════════════════════════════════
   CURSOR
   ══════════════════════════════════════════ */
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mx=-100, my=-100, rx=-100, ry=-100;
document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
(function cursorLoop() {
  cursor.style.left=mx+'px'; cursor.style.top=my+'px';
  rx+=(mx-rx)*0.12; ry+=(my-ry)*0.12;
  cursorRing.style.left=rx+'px'; cursorRing.style.top=ry+'px';
  requestAnimationFrame(cursorLoop);
})();

function createSpark(x, y) {
  const glyphs = ['♡','✿','❋','✧'];
  for (let i=0; i<6; i++) {
    const s = document.createElement('div');
    s.className = 'burst-sprite';
    s.textContent = glyphs[Math.floor(Math.random()*glyphs.length)];
    s.style.left = x+'px'; s.style.top = y+'px';
    s.style.setProperty('--dx', `${(Math.random()-0.5)*70}px`);
    s.style.setProperty('--dy', `${(Math.random()-0.6)*70-20}px`);
    s.style.fontSize = `${10+Math.random()*5}px`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 800);
  }
}

// Hover effects on interactive elements
document.querySelectorAll('a, button, .polaroid, .reel-frame, .letter-seal, .reason-card, .postcard').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width='20px'; cursor.style.height='20px'; cursor.style.background='rgba(196,122,138,0.5)';
    cursorRing.style.width='50px'; cursorRing.style.height='50px'; cursorRing.style.borderColor='rgba(196,122,138,0.6)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width='10px'; cursor.style.height='10px'; cursor.style.background='#C47A8A';
    cursorRing.style.width='36px'; cursorRing.style.height='36px'; cursorRing.style.borderColor='rgba(196,122,138,0.4)';
  });
});

/* ══════════════════════════════════════════
   PARTICLES
   ══════════════════════════════════════════ */
(function() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;
  const COLORS = ['#F7D4DF','#E8A0B8','#D4ADCF','#F2E4EA','#F5C5B0','#EEE0EE'];

  function drawHeart(x,y,size,alpha,color) {
    ctx.save(); ctx.globalAlpha=alpha; ctx.fillStyle=color;
    ctx.translate(x,y); ctx.scale(size,size);
    ctx.beginPath(); ctx.moveTo(0,-0.5);
    ctx.bezierCurveTo(0.5,-1,1,-0.3,0,0.5);
    ctx.bezierCurveTo(-1,-0.3,-0.5,-1,0,-0.5);
    ctx.fill(); ctx.restore();
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x=Math.random()*W; this.y=init?Math.random()*H:H+20;
      this.r=Math.random()*3+0.6; this.alpha=Math.random()*0.4+0.05;
      this.vx=(Math.random()-0.5)*0.4; this.vy=-(Math.random()*0.5+0.12);
      this.color=COLORS[Math.floor(Math.random()*COLORS.length)];
      this.wobble=Math.random()*Math.PI*2; this.wobbleSpeed=(Math.random()-0.5)*0.022;
      this.isHeart=Math.random()<0.12;
    }
    update() { this.wobble+=this.wobbleSpeed; this.x+=this.vx+Math.sin(this.wobble)*0.3; this.y+=this.vy; if(this.y<-20) this.reset(false); }
    draw() {
      if(this.isHeart) drawHeart(this.x,this.y,this.r*1.8,this.alpha,this.color);
      else { ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fillStyle=this.color; ctx.globalAlpha=this.alpha; ctx.fill(); }
    }
  }
  class Sparkle {
    constructor() { this.reset(); }
    reset() { this.x=Math.random()*W; this.y=Math.random()*H; this.size=Math.random()*1.5+0.4; this.alpha=0; this.maxAlpha=Math.random()*0.6+0.1; this.phase=Math.random()*Math.PI*2; this.speed=Math.random()*0.018+0.008; }
    update() { this.phase+=this.speed; this.alpha=((Math.sin(this.phase)+1)/2)*this.maxAlpha; }
    draw() {
      ctx.save(); ctx.globalAlpha=this.alpha; ctx.fillStyle='#F7D4DF'; ctx.translate(this.x,this.y);
      for(let i=0;i<4;i++) { ctx.save(); ctx.rotate((i*Math.PI)/2); ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(this.size*0.4,this.size*0.4); ctx.lineTo(0,this.size*2); ctx.lineTo(-this.size*0.4,this.size*0.4); ctx.closePath(); ctx.fill(); ctx.restore(); }
      ctx.restore();
    }
  }

  function resize() { W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight; }
  resize(); window.addEventListener('resize', resize);
  const particles = Array.from({length:110}, ()=>new Particle());
  const sparkles = Array.from({length:40}, ()=>new Sparkle());
  function loop() {
    ctx.clearRect(0,0,W,H);
    sparkles.forEach(s=>{s.update();s.draw();}); particles.forEach(p=>{p.update();p.draw();});
    ctx.globalAlpha=1; requestAnimationFrame(loop);
  }
  loop();
  document.addEventListener('click', e => {
    if(e.target.closest('input,textarea,select,[data-no-burst]')) return;
    for(let i=0;i<8;i++) { const p=new Particle(); p.x=e.clientX; p.y=e.clientY; p.r=Math.random()*3+1; p.vx=(Math.random()-0.5)*3; p.vy=-(Math.random()*4+1); p.alpha=0.6; particles.push(p); }
    createSpark(e.clientX,e.clientY);
    if(particles.length>180) particles.splice(0,20);
  });
})();

/* ══════════════════════════════════════════
   SCROLL PROGRESS HEART
   ══════════════════════════════════════════ */
(function() {
  const el = document.getElementById('scroll-progress');
  const fill = el.querySelector('.progress-fill');
  window.addEventListener('scroll', () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const pct = Math.min(1, window.scrollY / max);
    el.classList.toggle('visible', pct > 0.02);
    fill.style.strokeDashoffset = (100 - pct * 100).toFixed(1);
  }, {passive:true});
})();

/* ══════════════════════════════════════════
   ENVELOPE
   ══════════════════════════════════════════ */
(function() {
  const scene = document.getElementById('envelope-scene');
  const wrap = document.querySelector('.envelope-wrap');
  const main = document.getElementById('main-content');
  if(!scene||!wrap) return;

  function requestFullscreenOnce() {
    const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
    if (isFullscreen) return;

    const target = document.documentElement || document.body;
    const requestFullscreen = target.requestFullscreen || target.webkitRequestFullscreen || target.msRequestFullscreen;
    if (requestFullscreen) {
      requestFullscreen.call(target);
    }
  }

  let opened = false;
  wrap.addEventListener('click', () => {
    if(opened) return; opened=true;
    requestFullscreenOnce();
    playPaperTearSound();
    wrap.classList.add('open');
    createSpark(wrap.getBoundingClientRect().left+wrap.getBoundingClientRect().width/2, wrap.getBoundingClientRect().top+wrap.getBoundingClientRect().height/2);
    setTimeout(() => {
      scene.classList.add('gone');
      main.classList.add('revealed');
      playPaperRustleSound();
      const skye = document.getElementById('skye-companion');
      if(skye) { skye.classList.add('visible'); setTimeout(()=>window.showSkyeBubble&&window.showSkyeBubble("hey, you actually showed up. ♡"),800); }
      window.tryMusicPlay&&window.tryMusicPlay();
    }, 1600);
  });
})();

/* ══════════════════════════════════════════
   SCROLL REVEAL — Staggered
   ══════════════════════════════════════════ */
(function() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting) {
        const delay = parseFloat(e.target.dataset.delay || '0');
        e.target.style.transitionDelay = delay + 's';
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, {threshold: 0.1});

  document.querySelectorAll('.reveal-up, .section-title, .soft-divider').forEach((el,i) => {
    // Auto-stagger siblings
    if(!el.dataset.delay) {
      const parent = el.parentElement;
      const siblings = Array.from(parent.querySelectorAll('.reveal-up'));
      const idx = siblings.indexOf(el);
      if(idx > 0) el.dataset.delay = (idx * 0.12).toFixed(2);
    }
    io.observe(el);
  });
})();

/* ══════════════════════════════════════════
   HIDDEN POSTCARDS
   ══════════════════════════════════════════ */
(function() {
  const postcards = document.querySelectorAll('.postcard');
  const sections = document.querySelectorAll('.page-section');

  function updatePostcards() {
    const vh = window.innerHeight;
    postcards.forEach(pc => {
      const triggerIdx = parseInt(pc.dataset.triggerSection, 10);
      const section = sections[triggerIdx];
      if(!section) return;
      const rect = section.getBoundingClientRect();
      const shouldShow = rect.top < vh * 0.6 && rect.bottom > vh * 0.35;
      if(shouldShow && !pc.classList.contains('visible')) {
        pc.classList.add('visible');
        playPostcardSound();
      } else if(!shouldShow) {
        pc.classList.remove('visible');
        pc.classList.remove('flipped');
      }
    });
  }

  postcards.forEach(pc => {
    pc.addEventListener('click', e => {
      e.stopPropagation();
      pc.classList.toggle('flipped');
      playChime(1200);
    });
  });

  window.addEventListener('scroll', updatePostcards, {passive:true});
  updatePostcards();
})();

/* ══════════════════════════════════════════
   POLAROIDS
   ══════════════════════════════════════════ */
(function() {
  const polaroids = document.querySelectorAll('.polaroid');
  const rotations = [-3.5,1.8,-1.2,2.6,-2.8,1.4,-0.8,3.1,-1.9,2.3];
  polaroids.forEach((p,i) => {
    const rot = rotations[i%rotations.length]; p.dataset.rot=rot;
    if (p.classList.contains('stack-back')) {
      p.style.transform = `translateY(-8px) rotate(${rot}deg)`;
    } else {
      p.style.transform = `translateY(30px) rotate(${rot}deg)`;
    }
    p.addEventListener('mouseenter', ()=>{
      if (p.classList.contains('stack-back')) return;
      p.style.transform=`translateY(-8px) rotate(0deg) scale(1.04)`;
    });
    p.addEventListener('mouseleave', ()=>{
      if (p.classList.contains('stack-back')) return;
      p.style.transform=`translateY(0) rotate(${rot}deg) scale(1)`;
    });
  });
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting) {
        const rot = e.target.dataset.rot||0;
        e.target.style.transition='opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease';
        e.target.classList.add('in');
        e.target.style.transform=`translateY(0) rotate(${rot}deg)`;
        e.target.style.opacity='1';
        io.unobserve(e.target);
      }
    });
  }, {threshold:0.08});
  polaroids.forEach((p,i) => { p.style.transitionDelay=(i%4)*0.1+'s'; io.observe(p); });
})();

/* ══════════════════════════════════════════
   LIGHTBOX
   ══════════════════════════════════════════ */
(function() {
  const lb = document.getElementById('lightbox');
  const lbCard = lb.querySelector('.lightbox-card');
  const lbPrev = document.getElementById('lb-prev');
  const lbNext = document.getElementById('lb-next');
  const backdrop = lb.querySelector('.lightbox-backdrop');
  let items=[], current=0;

  function collectItems() {
    items=[];
    document.querySelectorAll('.polaroid').forEach(p => {
      items.push({src:p.dataset.src||null, caption:p.dataset.caption||p.querySelector('.polaroid-caption')?.textContent||'', type:p.dataset.type||'img'});
    });
    document.querySelectorAll('.reel-frame').forEach(r => {
      items.push({src:r.dataset.video||null, caption:r.dataset.caption||'', type:'video'});
    });
    document.querySelectorAll('.timeline-card-photo[data-src]').forEach(photo => {
      items.push({src:photo.dataset.src||null, caption:photo.dataset.caption||photo.querySelector('img')?.alt||'', type:photo.dataset.type||'img'});
    });
  }
  function openAt(idx) {
    collectItems(); current=((idx%items.length)+items.length)%items.length;
    const it=items[current]; lbCard.innerHTML='';
    const close=document.createElement('button'); close.id='lb-close';
    close.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>`;
    close.onclick=closeLB; lbCard.appendChild(close);
    if(it.src) {
      const m=document.createElement(it.type==='video'?'video':'img');
      m.src=it.src;
      if(it.type==='video'){
        m.controls=true;
        m.autoplay=true;
        m.playsInline=true;
        m.muted=false;
        m.addEventListener('canplay', ()=> m.play().catch(()=>{}), {once:true});
      }
      lbCard.appendChild(m);
    }
    else { const ph=document.createElement('div'); ph.style.cssText='width:320px;aspect-ratio:1;background:var(--blush);display:flex;align-items:center;justify-content:center;color:var(--deep-rose);opacity:0.5;font-family:Cormorant Garamond,serif;font-style:italic;font-size:18px;'; ph.textContent='your photo here'; lbCard.appendChild(ph); }
    const cap=document.createElement('p'); cap.className='lightbox-caption'; cap.textContent=it.caption; lbCard.appendChild(cap);
    lb.classList.add('open'); document.body.style.overflow='hidden';
  }
  function closeLB() { lb.classList.remove('open'); document.body.style.overflow=''; }
  backdrop.addEventListener('click',closeLB);
  lbPrev.addEventListener('click',()=>openAt(current-1));
  lbNext.addEventListener('click',()=>openAt(current+1));
  document.addEventListener('keydown',e=>{if(!lb.classList.contains('open'))return;if(e.key==='Escape')closeLB();if(e.key==='ArrowRight')openAt(current+1);if(e.key==='ArrowLeft')openAt(current-1);});
  function startReelVideo(frame) {
    const video = frame.querySelector('video');
    if (!video) return;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('muted', '');
    video.play().catch(()=>{});
    frame.classList.add('playing');
  }

  document.querySelectorAll('.polaroid').forEach((p,i) => {
    p.addEventListener('click',e=>{e.stopPropagation();createSpark(e.clientX,e.clientY);openAt(i);});
  });
  document.querySelectorAll('.reel-frame').forEach((frame,i) => {
    const video = frame.querySelector('video');
    if (video) {
      video.addEventListener('play', ()=> frame.classList.add('playing'));
      video.addEventListener('pause', ()=> frame.classList.remove('playing'));
      video.addEventListener('loadeddata', ()=> startReelVideo(frame), {once:true});
      window.addEventListener('pointerdown', ()=> startReelVideo(frame), {once:true});
    }
    frame.addEventListener('click',e=>{e.stopPropagation(); createSpark(e.clientX,e.clientY); startReelVideo(frame); openAt(document.querySelectorAll('.polaroid').length + i);});
  });

  document.querySelectorAll('.timeline-card-photo[data-src]').forEach(photo => {
    photo.addEventListener('click', e => {
      e.stopPropagation();
      createSpark(e.clientX, e.clientY);
      collectItems();
      const idx = items.findIndex(item => item.src === photo.dataset.src);
      if (idx >= 0) openAt(idx);
    });
    photo.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        photo.click();
      }
    });
    photo.setAttribute('role', 'button');
    photo.setAttribute('tabindex', '0');
  });
})();

/* ══════════════════════════════════════════
   MUSIC PLAYER
   ══════════════════════════════════════════ */
(function() {
  const TRACKS=[
    'songs/I Wanna Be Yours.mp3',
    'songs/ruth b. - dandelions.mp3',
    'songs/Say Yes to Heaven.mp3',
    'songs/SEÑORITA.mp3',
    'songs/Stephen Dawes - Teenage Dream.mp3',
    'songs/Those Eyes - New West.mp3',
    'songs/Until i found you.mp3',
    'songs/𝑃𝑒𝑟𝑓𝑒𝑐𝑡 𝑏𝑦 𝐸𝑑 𝑆ℎ𝑒𝑒𝑟𝑎𝑛.mp3'
  ];

  function toTrackEntry(src, index) {
    const raw = typeof src === 'string' ? src : '';
    const fileName = raw.split('/').pop() || `Track ${index + 1}`;
    const title = fileName.replace(/\.mp3$/i, '') || `Track ${index + 1}`;
    const normalizedSrc = raw.startsWith('songs/') || raw.startsWith('music/') || raw.startsWith('/')
      ? raw.replace(/^\/+/, '')
      : `songs/${raw}`;
    return { src: normalizedSrc, title };
  }

  async function getPlaylist(){
    try {
      const r=await fetch('/api/tracks');
      if(r.ok){
        const d=await r.json();
        if(Array.isArray(d.tracks)&&d.tracks.length>0){
          return d.tracks.map((src,i)=>toTrackEntry(src,i));
        }
      }
    } catch {}
    return TRACKS.map((src,i)=>toTrackEntry(src,i));
  }

  let playlist=TRACKS.map((src,i)=>toTrackEntry(src,i));
  let idx=0, playing=false;
  const audio=new Audio(); audio.volume=0.65;
  const playBtn=document.getElementById('p-play'), prevBtn=document.getElementById('p-prev'), nextBtn=document.getElementById('p-next');
  const titleEl=document.getElementById('p-title'), volEl=document.getElementById('p-vol'), eqBars=document.querySelectorAll('.p-eq-bar');
  const playerEl=document.getElementById('music-player'), discEl=document.getElementById('p-disc');
  const PLAY_ICON='<path d="M8 5v14l11-7z"/>', PAUSE_ICON='<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';

  function setEQ(a){eqBars.forEach(b=>{b.style.animationPlayState=a?'running':'paused';});}
  function setPlaybackState(a){
    playing=a;
    playerEl.classList.toggle('playing', a);
    discEl.classList.toggle('playing', a);
    playBtn.querySelector('svg').innerHTML=a?PAUSE_ICON:PLAY_ICON;
    setEQ(a);
  }
  function updateTitle(){
    const n=playlist[idx]?.title||`Track ${idx+1}`;
    titleEl.textContent='♫ '+n;
  }
  function updateVolumeUI(){
    const pct=Math.round(parseFloat(audio.volume||0)*100);
    volEl.style.background=`linear-gradient(to right, var(--deep-rose) ${pct}%, rgba(196,122,138,0.22) ${pct}%)`;
  }
  function load(i,auto){
    idx=((i%playlist.length)+playlist.length)%playlist.length;
    audio.src=encodeURI(playlist[idx].src);
    audio.load();
    updateTitle();
    updateVolumeUI();
    if(auto){
      audio.play().then(()=>setPlaybackState(true)).catch(()=>setPlaybackState(false));
    } else {
      setPlaybackState(false);
    }
  }

  playBtn.addEventListener('click',()=>{
    if(!audio.src||audio.src===window.location.href){load(0,true);return;}
    if(playing){
      audio.pause();
      setPlaybackState(false);
    } else {
      audio.play().then(()=>setPlaybackState(true)).catch(()=>setPlaybackState(false));
    }
  });
  prevBtn.addEventListener('click',()=>load(idx-1,true));
  nextBtn.addEventListener('click',()=>load(idx+1,true));
  audio.addEventListener('ended',()=>load(idx+1,true));
  audio.addEventListener('play',()=>setPlaybackState(true));
  audio.addEventListener('pause',()=>{if(!audio.ended){setPlaybackState(false);}});
  volEl.addEventListener('input',()=>{audio.volume=parseFloat(volEl.value);updateVolumeUI();});

  window.tryMusicPlay=()=>{if(!playing)load(0,true);};
  updateVolumeUI();
  load(0,false);
  setTimeout(()=>{audio.play().then(()=>setPlaybackState(true)).catch(()=>setPlaybackState(false));},600);
  const onInteract=()=>{if(!playing)audio.play().then(()=>setPlaybackState(true)).catch(()=>setPlaybackState(false));};
  document.addEventListener('click',onInteract,{once:true});
  document.addEventListener('touchstart',onInteract,{once:true});
  getPlaylist().then(tracks=>{if(Array.isArray(tracks)&&tracks.length>0){playlist=tracks;updateTitle();if(!playing)load(0,false);}});
})();

/* ══════════════════════════════════════════
   SKYE COMPANION (stationary)
   ══════════════════════════════════════════ */
(function() {
  const skye=document.getElementById('skye-companion'); if(!skye) return;
  const cloud=skye.querySelector('.skye-cloud'), bubble=skye.querySelector('.skye-speech-bubble'), quote=skye.querySelector('.skye-quote');
  const quotes=["Thinking of you right now... ♡","Scroll down, I'm right here with you. ✨","Life can be pretty fucked, but you're always my favorite part. 🌸","Did you know? You're the mostest bestest.","meow meow meowwww. 🐾","No matter what happens, US. ALWAYS. ♡","Rawwwr Khapppp 🐾","Are you enjoying the music? ♫"];
  let timeout=null;
  window.showSkyeBubble=function(text){
    if(timeout)clearTimeout(timeout);
    quote.textContent=text||quotes[Math.floor(Math.random()*quotes.length)];
    bubble.classList.add('show'); playChime(1000+Math.random()*250);
    cloud.style.transform='scale(1.18) rotate(6deg)'; setTimeout(()=>{cloud.style.transform='';},250);
    timeout=setTimeout(()=>{bubble.classList.remove('show');},3200);
  };
  cloud.addEventListener('click',e=>{e.stopPropagation();window.showSkyeBubble();});
  setInterval(()=>{if(skye.classList.contains('visible')&&!bubble.classList.contains('show')&&Math.random()<0.4)window.showSkyeBubble();},22000);
})();

/* ══════════════════════════════════════════
   CALLIGRAPHY DESK
   ══════════════════════════════════════════ */
(function() {
  const section=document.querySelector('.calligraphy-section'); if(!section) return;
  const hand=section.querySelector('.calligraphy-hand');
  const lines=[
    section.querySelector('.written-line-1'),
    section.querySelector('.written-line-2'),
    section.querySelector('.written-line-3'),
    section.querySelector('.written-line-4')
  ];
  const texts=[
    "Dear god, I am a freaking fool,",
    "I have the most delicate and beautiful soul as my gf and I am really not nice sometimes",
    "If you are there and you hear me please know that i want her to be so so so happy.",
    "Bless her with every happiness I cannot give her."
  ];
  let started=false;
  let soundEnabled=false;

  function enableSoundWhenVisible() {
    if(soundEnabled) return;
    soundEnabled=true;
  }

  async function typeLine(lineEl, text) {
    lineEl.textContent='';
    const paper=section.querySelector('.desk-paper');
    const paperRect=paper.getBoundingClientRect();
    for(let i=0;i<=text.length;i++) {
      lineEl.textContent=text.slice(0,i);
      const lineRect=lineEl.getBoundingClientRect();
      const progress=i/text.length;
      hand.style.left=(lineRect.left-paperRect.left)+progress*Math.max(lineRect.width,120)-18+'px';
      hand.style.top=(lineEl.offsetTop+8)+'px';
      if(soundEnabled && i>0 && text[i-1]!==' ') playWritingScratchSound();
      await new Promise(r=>setTimeout(r,45+Math.random()*30));
    }
    await new Promise(r=>setTimeout(r,450));
  }

  async function startWriting() {
    if(started) return; started=true;
    enableSoundWhenVisible();
    hand.style.display='block';
    hand.style.opacity='1';
    hand.style.transition='left 0.08s linear, top 0.08s linear, opacity 0.25s ease';
    for(let l=0;l<lines.length;l++) {
      const lineEl=lines[l]; const text=texts[l] || '';
      if(!lineEl) continue;
      await typeLine(lineEl, text);
    }
    hand.style.transition='opacity 0.5s ease';
    hand.style.opacity='0';
    setTimeout(()=>{hand.style.display='none';},500);
  }

  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting) { startWriting(); obs.unobserve(e.target); } });
  }, {threshold:0.35});

  obs.observe(section);
})();

/* ══════════════════════════════════════════
   TIMELINE — auto-reveal
   ══════════════════════════════════════════ */
(function() {
  const items=document.querySelectorAll('.timeline-item');
  const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target);}});},{threshold:0.15});
  items.forEach(item=>obs.observe(item));
})();

/* ══════════════════════════════════════════
   CONSTELLATION
   ══════════════════════════════════════════ */
(function() {
  const section=document.querySelector('.constellation-section'); if(!section) return;
  const canvas=document.getElementById('constellation-canvas');
  const ctx=canvas.getContext('2d');
  const letter=document.getElementById('constellation-letter');
  let W,H;
  function resize(){if(!canvas.parentNode)return;const r=canvas.parentNode.getBoundingClientRect();W=canvas.width=r.width;H=canvas.height=r.height;}
  resize(); window.addEventListener('resize',resize);
  const heartPoints=[{x:0,y:-0.22},{x:0.22,y:-0.38},{x:0.38,y:-0.2},{x:0.3,y:0.08},{x:0,y:0.38},{x:-0.3,y:0.08},{x:-0.38,y:-0.2},{x:-0.22,y:-0.38}];
  let stars=[];
  function initStars(){stars=heartPoints.map((pt,i)=>({id:i,x:W/2+pt.x*W*0.85,y:H/2+pt.y*H*0.85,r:3.5+Math.random()*2,active:false,pulsePhase:Math.random()*Math.PI,pulseSpeed:0.02+Math.random()*0.03}));}
  initStars(); window.addEventListener('resize',initStars);
  let bgStars=[];
  function initBg(){bgStars=[];for(let i=0;i<40;i++)bgStars.push({x:Math.random()*W,y:Math.random()*H,alpha:0.2+Math.random()*0.5,speed:0.01+Math.random()*0.02,phase:Math.random()*Math.PI});}
  initBg(); window.addEventListener('resize',initBg);
  let selectedOrder=[], isComplete=false;
  function draw(){
    ctx.clearRect(0,0,W,H);
    bgStars.forEach(s=>{s.phase+=s.speed;ctx.fillStyle=`rgba(253,245,239,${s.alpha*((Math.sin(s.phase)+1)/2)})`;ctx.fillRect(s.x,s.y,1.2,1.2);});
    if(selectedOrder.length>0){
      ctx.beginPath();ctx.strokeStyle='rgba(247,212,223,0.45)';ctx.shadowColor='rgba(232,160,184,0.5)';ctx.shadowBlur=12;ctx.lineWidth=1.8;
      const f=stars[selectedOrder[0]]; ctx.moveTo(f.x,f.y);
      for(let i=1;i<selectedOrder.length;i++){const s=stars[selectedOrder[i]];ctx.lineTo(s.x,s.y);}
      if(isComplete)ctx.closePath(); ctx.stroke(); ctx.shadowBlur=0;
    }
    stars.forEach(s=>{
      s.pulsePhase+=s.pulseSpeed; const sc=1+Math.sin(s.pulsePhase)*0.18;
      ctx.beginPath();ctx.arc(s.x,s.y,s.r*2.8*sc,0,Math.PI*2);ctx.fillStyle=s.active?'rgba(232,160,184,0.22)':'rgba(247,212,223,0.08)';ctx.fill();
      ctx.beginPath();ctx.arc(s.x,s.y,s.r*sc,0,Math.PI*2);ctx.fillStyle=s.active?'#ffffff':'rgba(247,212,223,0.7)';ctx.fill();
      if(s.active){ctx.strokeStyle='rgba(255,255,255,0.8)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(s.x-s.r*2,s.y);ctx.lineTo(s.x+s.r*2,s.y);ctx.moveTo(s.x,s.y-s.r*2);ctx.lineTo(s.x,s.y+s.r*2);ctx.stroke();}
    });
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
  canvas.addEventListener('click',e=>{
    if(isComplete) return;
    const r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
    let clicked=null;
    for(const s of stars){if(Math.hypot(s.x-x,s.y-y)<28){clicked=s;break;}}
    if(clicked&&!selectedOrder.includes(clicked.id)){
      selectedOrder.push(clicked.id); clicked.active=true;
      const freqs=[440,493.88,523.25,587.33,659.25,698.46,783.99,880];
      playChime(freqs[(selectedOrder.length-1)%freqs.length]);
      createSpark(e.clientX,e.clientY);
      if(selectedOrder.length===stars.length){
        isComplete=true; playMagicSound();
        setTimeout(()=>{letter.classList.add('reveal');window.showSkyeBubble&&window.showSkyeBubble("you found my heart in the stars... ✧");},800);
      }
    }
  });
  letter.querySelector('.letter-seal').addEventListener('click',e=>{
    e.stopPropagation(); letter.classList.remove('reveal');
    selectedOrder=[]; stars.forEach(s=>s.active=false); isComplete=false; playPaperRustleSound();
  });
})();