/* ==========================================================
   ETHIOPIAN ORTHODOX BAPTISM INVITATION — script.js
   ========================================================== */

/* ================= EDIT HERE =================
   Set the baptism date & time for the countdown.
   Format: "YYYY-MM-DDTHH:MM:SS" (24-hour time).  */
const CONFIG = {
  baptismDate: "2026-11-21T00:00:00+03:00", // Nov 21, 2026 (ህዳር 12, 2019) — Addis Ababa time
  cardTitle: "Holy Baptism",            // thank-you card subtitle
  cardMessage:
    "Thank you for being part of this blessed celebration. " +
    "Your presence, prayers, love, and blessings mean so much " +
    "to our family. May God bless you abundantly.",
};
/* ============================================== */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ==========================================================
   GOLD PARTICLES (opening overlay)
   ========================================================== */
(function particles() {
  const canvas = $("#particles");
  const ctx = canvas.getContext("2d");
  let W, H, dots = [], raf;

  function resize() {
    W = canvas.width = canvas.offsetWidth * devicePixelRatio;
    H = canvas.height = canvas.offsetHeight * devicePixelRatio;
  }
  resize();
  window.addEventListener("resize", resize);

  const COUNT = Math.min(60, Math.floor(innerWidth / 22));
  for (let i = 0; i < COUNT; i++) {
    dots.push({
      x: Math.random(), y: Math.random(),
      r: 1 + Math.random() * 2.4,
      vy: 0.15 + Math.random() * 0.4,
      vx: (Math.random() - 0.5) * 0.12,
      a: 0.15 + Math.random() * 0.5,
      tw: Math.random() * Math.PI * 2,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const d of dots) {
      d.y -= d.vy * 0.0009;
      d.x += d.vx * 0.0009;
      d.tw += 0.02;
      if (d.y < -0.02) { d.y = 1.02; d.x = Math.random(); }
      if (d.x < -0.02) d.x = 1.02;
      if (d.x > 1.02) d.x = -0.02;
      const alpha = d.a * (0.6 + 0.4 * Math.sin(d.tw));
      const r = d.r * devicePixelRatio;
      const g = ctx.createRadialGradient(d.x * W, d.y * H, 0, d.x * W, d.y * H, r * 3.4);
      g.addColorStop(0, `rgba(219,141,168,${alpha})`);
      g.addColorStop(1, "rgba(219,141,168,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(d.x * W, d.y * H, r * 3.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(242,207,217,${alpha})`;
      ctx.beginPath();
      ctx.arc(d.x * W, d.y * H, r, 0, Math.PI * 2);
      ctx.fill();
    }
    raf = requestAnimationFrame(draw);
  }

  if (!reduceMotion) draw();
  window.__stopParticles = () => cancelAnimationFrame(raf);
})();

/* ==========================================================
   OPENING → REVEAL
   ========================================================== */
(function opening() {
  const overlay = $("#opening");
  const main = $("#main");
  const btn = $("#openBtn");

  btn.addEventListener("click", () => {
    overlay.classList.add("opened");
    window.__stopParticles && window.__stopParticles();
    main.hidden = false;
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      overlay.style.display = "none";
      document.body.style.overflow = "";
      initReveals();
    }, reduceMotion ? 50 : 1500);
  });
})();

/* ==========================================================
   SCROLL REVEAL
   ========================================================== */
let revealObserver;
function initReveals() {
  if (revealObserver) return;
  if (reduceMotion) {
    $$(".reveal").forEach((el) => el.classList.add("visible"));
    return;
  }
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          e.target.style.transitionDelay = `${(i % 4) * 90}ms`;
          e.target.classList.add("visible");
          revealObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  $$(".reveal").forEach((el) => revealObserver.observe(el));
}

/* ==========================================================
   COUNTDOWN
   ========================================================== */
(function countdown() {
  const target = new Date(CONFIG.baptismDate).getTime();
  const els = {
    d: $("#cdDays"), h: $("#cdHours"), m: $("#cdMins"), s: $("#cdSecs"),
  };
  const done = $("#countdownDone");
  const grid = $("#countdownGrid");

  function set(el, val) {
    const v = String(val).padStart(2, "0");
    if (el.textContent !== v) {
      el.textContent = v;
      el.classList.remove("tick");
      void el.offsetWidth;
      el.classList.add("tick");
    }
  }

  function update() {
    const diff = target - Date.now();
    if (diff <= 0) {
      grid.hidden = true;
      done.hidden = false;
      clearInterval(timer);
      return;
    }
    set(els.d, Math.floor(diff / 864e5));
    set(els.h, Math.floor(diff / 36e5) % 24);
    set(els.m, Math.floor(diff / 6e4) % 60);
    set(els.s, Math.floor(diff / 1e3) % 60);
  }

  let timer = null;
  update();
  timer = setInterval(update, 1000);
})();

/* ==========================================================
   LIGHTBOX
   ========================================================== */
(function lightbox() {
  const box = $("#lightbox");
  const img = $("#lightboxImg");
  const close = $(".lightbox-close");

  $$(".framed-photo img").forEach((el) => {
    el.closest("figure").addEventListener("click", () => {
      img.src = el.src;
      img.alt = el.alt;
      box.hidden = false;
      document.body.style.overflow = "hidden";
    });
  });

  function hide() {
    box.hidden = true;
    document.body.style.overflow = "";
  }
  close.addEventListener("click", hide);
  box.addEventListener("click", (e) => { if (e.target === box) hide(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !box.hidden) hide(); });
})();

/* ==========================================================
   MUSIC
   ========================================================== */
(function music() {
  const audio = $("#bgMusic");
  const btn = $("#musicBtn");

  btn.addEventListener("click", async () => {
    try {
      if (audio.paused) {
        await audio.play();
        btn.classList.add("playing");
        btn.setAttribute("aria-label", "Pause background music");
      } else {
        audio.pause();
        btn.classList.remove("playing");
        btn.setAttribute("aria-label", "Play background music");
      }
    } catch (err) {
      console.warn("Audio playback blocked:", err);
    }
  });
})();

/* ==========================================================
   THANK-YOU CARD — drawn on canvas, downloaded as PNG
   ========================================================== */
(function thankYouCard() {
  const canvas = $("#cardCanvas");
  const btn = $("#cardBtn");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;

  const GOLD = "#DB8DA8", DEEP = "#AD6078", SOFT = "#F2CFD9",
        IVORY = "#FFF9F6", INK = "#6E4A56";

  function wrapText(text, x, y, maxW, lh, font, color) {
    ctx.font = font;
    ctx.fillStyle = color;
    const words = text.split(" ");
    let line = "", lines = [];
    for (const w of words) {
      const test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; }
      else line = test;
    }
    lines.push(line);
    lines.forEach((l, i) => ctx.fillText(l, x, y + i * lh));
    return y + lines.length * lh;
  }

  function drawCross(cx, cy, s) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = GOLD;
    ctx.strokeStyle = DEEP;
    ctx.lineWidth = s * 0.012;
    const t = s * 0.085;
    const rr = (x, y, w, h, r) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill(); ctx.stroke(); };
    rr(-t, -s * 0.5, t * 2, s, t);
    rr(-s * 0.36, -s * 0.30, s * 0.72, s * 0.075, s * 0.037);
    rr(-s * 0.30, -s * 0.10, s * 0.60, s * 0.065, s * 0.032);
    rr(-s * 0.24, s * 0.09, s * 0.48, s * 0.055, s * 0.027);
    ctx.lineWidth = s * 0.028;
    const ring = (x, y, r) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke(); };
    ring(0, -s * 0.56, s * 0.075);
    ring(-s * 0.36, -s * 0.263, s * 0.06); ring(s * 0.36, -s * 0.263, s * 0.06);
    ring(-s * 0.30, -s * 0.067, s * 0.05); ring(s * 0.30, -s * 0.067, s * 0.05);
    ring(-s * 0.24, s * 0.118, s * 0.042); ring(s * 0.24, s * 0.118, s * 0.042);
    ring(0, s * 0.56, s * 0.07);
    ctx.restore();
  }

  function cornerFlourish(x, y, sx, sy) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(sx, sy);
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 4;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const a = (i / 60) * Math.PI * 2.1;
      const r = 90 * (1 - i / 75);
      const px = r * Math.cos(a), py = r * Math.sin(a) * 0.75;
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.stroke();
    ctx.fillStyle = GOLD;
    [[0.35, 58], [0.62, 76], [0.85, 34]].forEach(([t, r0]) => {
      const a = t * Math.PI * 2.1;
      ctx.beginPath();
      ctx.arc(r0 * Math.cos(a), r0 * Math.sin(a) * 0.75, 6, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  function draw() {
    if (!ctx.roundRect) {
      ctx.roundRect = function (x, y, w, h) { this.rect(x, y, w, h); };
    }
    const babyName = $(".baby-name").textContent.trim() || "Our Little Blessing";

    // background
    ctx.fillStyle = IVORY;
    ctx.fillRect(0, 0, W, H);
    const rg = ctx.createRadialGradient(W / 2, H * 0.42, 60, W / 2, H * 0.42, H * 0.75);
    rg.addColorStop(0, "rgba(255,255,255,0.9)");
    rg.addColorStop(1, "rgba(247,230,232,0.9)");
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, W, H);

    // borders
    ctx.strokeStyle = GOLD; ctx.lineWidth = 7;
    ctx.strokeRect(44, 44, W - 88, H - 88);
    ctx.strokeStyle = SOFT; ctx.lineWidth = 2.5;
    ctx.strokeRect(64, 64, W - 128, H - 128);

    // corner flourishes
    cornerFlourish(150, 150, 1, 1);
    cornerFlourish(W - 150, 150, -1, 1);
    cornerFlourish(150, H - 150, 1, -1);
    cornerFlourish(W - 150, H - 150, -1, -1);

    ctx.textAlign = "center";
    try { ctx.letterSpacing = "10px"; } catch (_) {}

    // eyebrow
    ctx.font = "600 30px Jost, sans-serif";
    ctx.fillStyle = DEEP;
    ctx.fillText("WITH GRATEFUL HEARTS", W / 2, 175);

    // cross
    drawCross(W / 2, 390, 300);

    // Thank You (script)
    try { ctx.letterSpacing = "2px"; } catch (_) {}
    const grad = ctx.createLinearGradient(W / 2 - 300, 0, W / 2 + 300, 0);
    grad.addColorStop(0, DEEP); grad.addColorStop(0.5, GOLD);
    grad.addColorStop(0.65, SOFT); grad.addColorStop(1, DEEP);
    ctx.font = "130px 'Great Vibes', cursive";
    ctx.fillStyle = grad;
    ctx.fillText("Thank You", W / 2, 660);

    // baby name + subtitle
    ctx.font = "86px 'Great Vibes', cursive";
    ctx.fillStyle = DEEP;
    ctx.fillText(babyName, W / 2, 790);
    try { ctx.letterSpacing = "14px"; } catch (_) {}
    ctx.font = "600 34px 'Cormorant Garamond', serif";
    ctx.fillText(CONFIG.cardTitle.toUpperCase(), W / 2, 860);
    try { ctx.letterSpacing = "0px"; } catch (_) {}

    // divider
    ctx.strokeStyle = GOLD; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(W / 2 - 180, 910); ctx.lineTo(W / 2 - 26, 910); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W / 2 + 26, 910); ctx.lineTo(W / 2 + 180, 910); ctx.stroke();
    ctx.fillStyle = GOLD;
    ctx.save();
    ctx.translate(W / 2, 910); ctx.rotate(Math.PI / 4);
    ctx.fillRect(-9, -9, 18, 18);
    ctx.restore();

    // message
    wrapText(CONFIG.cardMessage, W / 2, 985, W - 320, 52,
      "italic 40px 'Cormorant Garamond', serif", INK);
  }

  btn.addEventListener("click", async () => {
    try { await document.fonts.ready; } catch (_) {}
    draw();
    canvas.toBlob((blob) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "thank-you-card.png";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    }, "image/png");
  });
})();
