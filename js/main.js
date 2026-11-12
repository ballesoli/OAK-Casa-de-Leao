/* ============================================================
   CASA DE LEÃO — Interações do site
   Nav, menu mobile, reveals 3D no scroll, tilt 3D nos cards,
   contagem regressiva do próximo encontro e partículas azuis no CTA.
   ============================================================ */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isTouch = window.matchMedia("(hover: none)").matches;

  document.addEventListener("DOMContentLoaded", function () {

    /* ---------- Ano do rodapé ---------- */
    var ano = document.getElementById("ano");
    if (ano) ano.textContent = new Date().getFullYear();

    /* ---------- Nav ---------- */
    var nav = document.getElementById("nav");
    function onScroll() {
      if (nav) nav.classList.toggle("scrolled", window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ---------- Menu mobile ---------- */
    var toggle = document.getElementById("navToggle");
    var links = document.getElementById("navLinks");
    if (toggle && links) {
      toggle.addEventListener("click", function () {
        var open = links.classList.toggle("open");
        toggle.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        document.body.classList.toggle("menu-open", open);
      });
      links.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          links.classList.remove("open");
          toggle.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
          document.body.classList.remove("menu-open");
        });
      });
    }

    /* ---------- Reveals 3D no scroll ---------- */
    var revealEls = document.querySelectorAll(".reveal, .reveal-l, .reveal-r");
    if ("IntersectionObserver" in window && !prefersReduced) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("visible");
            io.unobserve(en.target);
          }
        });
      }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("visible"); });
    }

    /* ---------- Tilt 3D nos cards ---------- */
    if (!isTouch && !prefersReduced) {
      document.querySelectorAll("[data-tilt]").forEach(function (el) {
        el.classList.add("tilt-glare");
        var max = el.classList.contains("schedule") || el.classList.contains("step") ? 5 : 8;

        el.addEventListener("pointermove", function (e) {
          var r = el.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width;
          var py = (e.clientY - r.top) / r.height;
          var rx = (0.5 - py) * max;
          var ry = (px - 0.5) * max;
          el.classList.add("tilting");
          el.style.transform =
            "perspective(900px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg) translateY(-4px)";
          el.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
          el.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
        });

        el.addEventListener("pointerleave", function () {
          el.classList.remove("tilting");
          el.style.transform = "";
        });
      });
    }

    /* ---------- Próximo encontro (contagem regressiva) ---------- */
    var evName = document.getElementById("evName");
    var evCount = document.getElementById("evCount");
    if (evName && evCount) {
      var DAYS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

      function lastSundayOf(year, month) {
        // month: 0-11; retorna Date do último domingo (9h) do mês
        var d = new Date(year, month + 1, 0, 9, 0, 0); // último dia do mês
        while (d.getDay() !== 0) d.setDate(d.getDate() - 1);
        d.setHours(9, 0, 0, 0);
        return d;
      }

      function nextEvents() {
        var now = new Date();
        var out = [];
        var i, d;

        // semanais: domingo 18h (culto), quarta 12h (oração), quinta 20h (culto)
        var weekly = [
          { day: 0, h: 18, name: "Domingo • 18h — Culto" },
          { day: 3, h: 12, name: "Quarta • 12h — Oração" },
          { day: 4, h: 20, name: "Quinta • 20h — Culto" }
        ];
        for (i = 0; i < 8; i++) {
          d = new Date(now.getTime());
          d.setDate(now.getDate() + i);
          weekly.forEach(function (w) {
            if (d.getDay() === w.day) {
              var ev = new Date(d);
              ev.setHours(w.h, 0, 0, 0);
              if (ev > now) out.push(ev);
            }
          });
        }

        // último domingo do mês (mês atual e próximo), 9h — Culto da Manhã
        var y = now.getFullYear(), m = now.getMonth();
        [lastSundayOf(y, m), lastSundayOf(y, m + 1), lastSundayOf(y, m + 2)].forEach(function (ev) {
          if (ev > now) out.push(ev);
        });

        out.sort(function (a, b) { return a - b; });
        return out;
      }

      function labelFor(d) {
        var h = d.getHours();
        if (d.getDay() === 3 && h === 12) return "Quarta • 12h — Oração";
        if (d.getDay() === 0 && h === 9) return "Domingo • 9h — Culto da Manhã";
        if (d.getDay() === 0 && h === 18) return "Domingo • 18h — Culto";
        if (d.getDay() === 4 && h === 20) return "Quinta • 20h — Culto";
        return DAYS[d.getDay()] + " • " + h + "h";
      }

      function pad(n) { return (n < 10 ? "0" : "") + n; }

      function tick() {
        var list = nextEvents();
        if (!list.length) return;
        var next = list[0];
        var diff = next - new Date();
        if (diff < 0) diff = 0;

        var s = Math.floor(diff / 1000);
        var d = Math.floor(s / 86400);
        var h = Math.floor((s % 86400) / 3600);
        var m = Math.floor((s % 3600) / 60);
        var sec = s % 60;

        evName.textContent = labelFor(next);
        evCount.textContent =
          (d > 0 ? d + "d " : "") + h + "h " + pad(m) + "m " + pad(sec) + "s";
      }

      tick();
      setInterval(tick, 1000);
    }

    /* ---------- Slider de fotos das células ---------- */
    var celSlider = document.getElementById("celSlider");
    if (celSlider) {
      var slides = celSlider.querySelectorAll(".cel-slide");
      var dotsBox = document.getElementById("celDots");
      var barFill = celSlider.querySelector(".cel-bar-fill");
      var btnPrev = document.getElementById("celPrev");
      var btnNext = document.getElementById("celNext");
      var totalSlides = slides.length;
      var curSlide = 0;
      var celTimer = null;
      var CEL_DUR = 5000;
      var celInView = true;
      var celHovering = false;

      var celDots = [];
      slides.forEach(function (_, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "cel-dot" + (i === 0 ? " is-active" : "");
        b.setAttribute("aria-label", "Ver foto " + (i + 1));
        b.addEventListener("click", function () { celShow(i); celSync(); });
        dotsBox.appendChild(b);
        celDots.push(b);
      });

      function celPaint() {
        slides.forEach(function (s, i) {
          s.classList.toggle("is-active", i === curSlide);
          s.setAttribute("aria-hidden", i === curSlide ? "false" : "true");
        });
        celDots.forEach(function (d, i) { d.classList.toggle("is-active", i === curSlide); });
      }

      function celRestartBar() {
        if (!barFill) return;
        barFill.classList.remove("run");
        void barFill.offsetWidth; /* reinicia a animação */
        barFill.classList.add("run");
      }

      function celShow(i) {
        curSlide = (i + totalSlides) % totalSlides;
        celPaint();
      }

      function celShouldRun() {
        return !prefersReduced && !celHovering && celInView && !document.hidden;
      }

      function celPlay() {
        celStopTimer();
        if (!celShouldRun()) return;
        celSlider.classList.remove("is-paused");
        celRestartBar();
        celTimer = setInterval(function () { celShow(curSlide + 1); }, CEL_DUR);
      }

      function celStopTimer() {
        if (celTimer) { clearInterval(celTimer); celTimer = null; }
      }

      function celPause() {
        celStopTimer();
        celSlider.classList.add("is-paused");
      }

      function celSync() {
        if (celShouldRun()) celPlay(); else celPause();
      }

      btnPrev.addEventListener("click", function () { celShow(curSlide - 1); celSync(); });
      btnNext.addEventListener("click", function () { celShow(curSlide + 1); celSync(); });

      /* pausa no hover (apenas em dispositivos com mouse) */
      if (!isTouch) {
        celSlider.addEventListener("mouseenter", function () { celHovering = true; celSync(); });
        celSlider.addEventListener("mouseleave", function () { celHovering = false; celSync(); });
      }
      document.addEventListener("visibilitychange", celSync);

      /* pausa quando o slider sai da tela */
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
          celInView = entries[0].isIntersecting;
          celSync();
        }, { threshold: 0.2 }).observe(celSlider);
      }

      /* deslizar no toque */
      var celSx = null, celSy = null;
      celSlider.addEventListener("pointerdown", function (e) {
        celSx = e.clientX; celSy = e.clientY;
      }, { passive: true });
      celSlider.addEventListener("pointerup", function (e) {
        if (celSx === null) return;
        var dx = e.clientX - celSx;
        var dy = e.clientY - celSy;
        celSx = celSy = null;
        if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.4) {
          celShow(dx < 0 ? curSlide + 1 : curSlide - 1);
          celSync();
        }
      }, { passive: true });

      celPaint();
      celSync();
    }

    /* ---------- Partículas azuis no CTA final ---------- */
    var embers = document.getElementById("embers");
    if (embers && !prefersReduced) {
      var ctx = embers.getContext("2d");
      var parts = [];
      var EMBERS_N = Math.min(70, Math.floor(window.innerWidth / 16));

      function sizeEmbers() {
        embers.width = embers.clientWidth;
        embers.height = embers.clientHeight;
      }
      sizeEmbers();
      window.addEventListener("resize", sizeEmbers);

      function spawn(initial) {
        return {
          x: Math.random() * embers.width,
          y: initial ? Math.random() * embers.height : embers.height + 12,
          r: 0.7 + Math.random() * 2.3,
          v: 0.25 + Math.random() * 0.85,
          drift: (Math.random() - 0.5) * 0.5,
          a: 0.15 + Math.random() * 0.55,
          tw: Math.random() * Math.PI * 2
        };
      }
      for (var i = 0; i < EMBERS_N; i++) parts.push(spawn(true));

      var ctaVisible = true;
      var ctaSec = document.querySelector(".cta-final");
      if ("IntersectionObserver" in window && ctaSec) {
        new IntersectionObserver(function (en) {
          ctaVisible = en[0].isIntersecting;
        }, { threshold: 0.02 }).observe(ctaSec);
      }

      (function loop(t) {
        requestAnimationFrame(loop);
        if (!ctaVisible || document.hidden) return;

        ctx.clearRect(0, 0, embers.width, embers.height);
        parts.forEach(function (p, idx) {
          p.y -= p.v;
          p.x += p.drift + Math.sin(t / 1400 + p.tw) * 0.22;
          p.tw += 0.02;
          if (p.y < -14) parts[idx] = spawn(false);

          var flicker = 0.72 + Math.sin(p.tw * 2.4) * 0.28;
          var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3.4);
          g.addColorStop(0, "rgba(214,236,255," + (p.a * flicker).toFixed(3) + ")");
          g.addColorStop(0.4, "rgba(126,180,250," + (p.a * 0.55 * flicker).toFixed(3) + ")");
          g.addColorStop(1, "rgba(70,130,230,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 3.4, 0, Math.PI * 2);
          ctx.fill();
        });
      })(0);
    }
  });
})();
