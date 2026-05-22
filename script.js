/* ── HERO CANVAS: deep ocean particle field ── */
(function () {
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let w, h, particles = [], jellyfish = [];
  const colors = [
    'rgba(61,232,196,',
    'rgba(27,191,160,',
    'rgba(100,200,220,',
    'rgba(255,255,255,'
  ];

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  function rand(a, b) {
    return Math.random() * (b - a) + a;
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < 160; i++) {
      particles.push({
        x: rand(0, w),
        y: rand(0, h),
        r: rand(0.3, 2.5),
        color: colors[Math.floor(rand(0, colors.length))],
        alpha: rand(0.05, 0.4),
        vx: rand(-0.12, 0.12),
        vy: rand(-0.25, -0.05),
        wobble: rand(0, Math.PI * 2),
        wobbleSpeed: rand(0.008, 0.025),
        wobbleAmt: rand(0.2, 0.8)
      });
    }

    jellyfish = [];
    for (let i = 0; i < 5; i++) {
      jellyfish.push({
        x: rand(50, w - 50),
        y: rand(h * 0.2, h * 0.8),
        size: rand(15, 35),
        phase: rand(0, Math.PI * 2),
        speed: rand(0.003, 0.008),
        vy: rand(-0.15, -0.05),
        alpha: rand(0.05, 0.15)
      });
    }
  }

  function drawJellyfish(j) {
    const pulse = Math.sin(j.phase) * 0.2 + 0.8;
    const s = j.size * pulse;

    ctx.save();
    ctx.globalAlpha = j.alpha;
    ctx.strokeStyle = 'rgba(61,232,196,0.6)';
    ctx.lineWidth = 0.5;

    ctx.beginPath();
    ctx.arc(j.x, j.y, s, Math.PI, 0, false);
    ctx.bezierCurveTo(j.x + s, j.y + s * 0.5, j.x + s * 0.5, j.y + s * 0.8, j.x, j.y + s * 0.4);
    ctx.bezierCurveTo(j.x - s * 0.5, j.y + s * 0.8, j.x - s, j.y + s * 0.5, j.x - s, j.y);
    ctx.stroke();

    for (let t = 0; t < 4; t++) {
      const tx = j.x + (t - 1.5) * s * 0.5;
      ctx.beginPath();
      ctx.moveTo(tx, j.y + s * 0.4);
      for (let seg = 0; seg < 6; seg++) {
        const nx = tx + Math.sin(j.phase * 3 + seg + t) * 4;
        ctx.lineTo(nx, j.y + s * 0.4 + seg * 6);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    const grad = ctx.createRadialGradient(w * 0.5, h * 0.3, 0, w * 0.5, h * 0.3, h * 0.8);
    grad.addColorStop(0, 'rgba(10,25,45,0.95)');
    grad.addColorStop(0.4, 'rgba(5,15,30,0.97)');
    grad.addColorStop(1, 'rgba(4,10,20,1)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    for (let j of jellyfish) {
      drawJellyfish(j);
      j.phase += j.speed;
      j.y += j.vy;
      if (j.y + j.size < 0) {
        j.y = h + j.size;
        j.x = rand(50, w - 50);
      }
    }

    for (let p of particles) {
      p.wobble += p.wobbleSpeed;
      p.x += p.vx + Math.sin(p.wobble) * p.wobbleAmt * 0.3;
      p.y += p.vy;
      if (p.y + p.r < 0) { p.y = h + p.r; p.x = rand(0, w); }
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });

  resize();
  initParticles();
  draw();
})();

/* ── SCROLL REVEAL ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      if (e.target.classList.contains('strip-bar-fill')) {
        const pct = e.target.getAttribute('data-width');
        e.target.style.width = pct + '%';
      }
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .strip-bar-fill').forEach(el => observer.observe(el));

/* ── STAGGERED TIMELINE ── */
const tlObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 100);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.timeline-item').forEach(el => tlObs.observe(el));

/* ── IMPACT ITEMS STAGGER ── */
const impactObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 120);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.impact-item').forEach(el => impactObs.observe(el));

/* ── COUNTER ANIMATION ── */
function animateCount(el, target) {
  const dur = 1800;
  const start = performance.now();

  function update(now) {
    const t = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(ease * target);
    if (t < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const target = parseInt(e.target.getAttribute('data-target'));
      animateCount(e.target, target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));

/* ── NAV SCROLL SHRINK ── */
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (window.scrollY > 60) {
    nav.style.padding = '0.7rem 4rem';
  } else {
    nav.style.padding = '1.2rem 4rem';
  }
});
