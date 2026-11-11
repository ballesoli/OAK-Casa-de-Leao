/* ============================================================
   CASA DE LEÃO — Cena 3D do hero (Three.js)
   Coroa dourada girando + campo de partículas (brasas douradas)
   Fallback: se o Three.js não carregar, o hero continua bonito
   com imagem + raios de luz em CSS.
   ============================================================ */
(function () {
  "use strict";

  function initThree() {
    var canvas = document.getElementById("hero3d");
    if (!canvas || typeof THREE === "undefined") return;

    var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
      });
    } catch (e) {
      return; // sem WebGL: fica o fundo estático
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    var scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07060b, 0.0045);

    var camera = new THREE.PerspectiveCamera(52, 1, 0.1, 400);
    var camBase = { x: 0, y: 2, z: 64 };
    camera.position.set(camBase.x, camBase.y, camBase.z);

    /* ---------- Luzes ---------- */
    scene.add(new THREE.AmbientLight(0x4a3a22, 1.35));
    scene.add(new THREE.HemisphereLight(0xf2d06b, 0x14101f, 0.85));

    var keyLight = new THREE.PointLight(0xffd27a, 3.8, 320, 1.4);
    keyLight.position.set(-40, 46, 30);
    scene.add(keyLight);

    var fillLight = new THREE.PointLight(0xfff2cc, 1.6, 320, 1.4);
    fillLight.position.set(-58, 8, 52);
    scene.add(fillLight);

    var rimLight = new THREE.PointLight(0xff9d4d, 2.0, 300, 1.6);
    rimLight.position.set(52, -18, 36);
    scene.add(rimLight);

    var topLight = new THREE.DirectionalLight(0xfff2cc, 1.1);
    topLight.position.set(0, 60, 40);
    scene.add(topLight);

    /* ---------- Materiais ---------- */
    var goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.72,
      roughness: 0.26,
      emissive: 0x8a651a,
      emissiveIntensity: 0.42
    });
    var goldBright = new THREE.MeshStandardMaterial({
      color: 0xf2d06b,
      metalness: 0.65,
      roughness: 0.2,
      emissive: 0xb98a24,
      emissiveIntensity: 0.55
    });
    var gemMat = new THREE.MeshStandardMaterial({
      color: 0xff9d4d,
      metalness: 0.4,
      roughness: 0.15,
      emissive: 0xff7a2d,
      emissiveIntensity: 1.3
    });

    /* ---------- Coroa (Leão de Judá) ---------- */
    var crown = new THREE.Group();

    // corpo da coroa (cilindro aberto)
    var band = new THREE.Mesh(
      new THREE.CylinderGeometry(9.4, 10, 4.2, 48, 1, true),
      new THREE.MeshStandardMaterial({
        color: 0xd4af37, metalness: 0.72, roughness: 0.26,
        emissive: 0x8a651a, emissiveIntensity: 0.42,
        side: THREE.DoubleSide
      })
    );
    crown.add(band);

    // aros superior e inferior
    var ringTop = new THREE.Mesh(new THREE.TorusGeometry(9.4, 0.42, 18, 64), goldBright);
    ringTop.rotation.x = Math.PI / 2;
    ringTop.position.y = 2.1;
    crown.add(ringTop);

    var ringBottom = new THREE.Mesh(new THREE.TorusGeometry(10, 0.5, 18, 64), goldBright);
    ringBottom.rotation.x = Math.PI / 2;
    ringBottom.position.y = -2.1;
    crown.add(ringBottom);

    // pontas + esferas
    var spikes = 8;
    for (var i = 0; i < spikes; i++) {
      var a = (i / spikes) * Math.PI * 2;

      var spike = new THREE.Mesh(new THREE.ConeGeometry(1.15, 4.6, 4), goldMat);
      spike.position.set(Math.cos(a) * 9.15, 4.3, Math.sin(a) * 9.15);
      spike.rotation.y = -a;
      crown.add(spike);

      var orb = new THREE.Mesh(new THREE.SphereGeometry(0.72, 18, 18), goldBright);
      orb.position.set(Math.cos(a) * 9.15, 6.9, Math.sin(a) * 9.15);
      crown.add(orb);
    }

    // joia central
    var gem = new THREE.Mesh(new THREE.OctahedronGeometry(2.3, 0), gemMat);
    gem.position.y = 0.4;
    crown.add(gem);

    var gemLight = new THREE.PointLight(0xff9d4d, 1.1, 46, 1.9);
    gemLight.position.set(0, 1, 0);
    crown.add(gemLight);

    scene.add(crown);

    // Halo dourado atrás da coroa (garante leitura "dourada" mesmo sem env map)
    var haloMat = new THREE.SpriteMaterial({
      map: null, // definido depois que o sprite de partícula existir
      color: 0xd4af37,
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    var halo = new THREE.Sprite(haloMat);
    halo.scale.setScalar(52);
    scene.add(halo);

    /* ---------- Partículas (brasas douradas) ---------- */
    function makeSprite() {
      var c = document.createElement("canvas");
      c.width = c.height = 64;
      var ctx = c.getContext("2d");
      var g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, "rgba(255,238,190,1)");
      g.addColorStop(0.32, "rgba(244,208,110,.85)");
      g.addColorStop(0.62, "rgba(212,175,55,.28)");
      g.addColorStop(1, "rgba(212,175,55,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
      var tex = new THREE.CanvasTexture(c);
      return tex;
    }
    var sprite = makeSprite();
    haloMat.map = sprite; // reaproveita o glow radial

    function makeCloud(count, spread, size, opacity) {
      var geo = new THREE.BufferGeometry();
      var pos = new Float32Array(count * 3);
      for (var i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * spread;
        pos[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.62;
        pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
      }
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      var mat = new THREE.PointsMaterial({
        size: size,
        map: sprite,
        transparent: true,
        opacity: opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
      });
      var pts = new THREE.Points(geo, mat);
      scene.add(pts);
      return pts;
    }

    var isMobileW = window.innerWidth < 768;
    var cloudFar = makeCloud(isMobileW ? 380 : 900, 190, 2.6, 0.65);
    var cloudNear = makeCloud(isMobileW ? 130 : 260, 130, 4.6, 0.9);

    /* ---------- Posicionamento responsivo ---------- */
    var crownBase = { x: 0, y: 3, halo: 52 };
    function layout() {
      var w = window.innerWidth;
      if (w < 768) {
        // mobile: sem coroa — apenas um halo dourado suave atrás do conteúdo
        crown.visible = false;
        crownBase.x = 0; crownBase.y = 0; crownBase.halo = 85;
        crown.position.set(0, 0, -40);
        crown.scale.setScalar(0.8);
      } else if (w < 1100) {
        // canto direito, afastada do texto
        crown.visible = true;
        crownBase.x = 38; crownBase.y = 5; crownBase.halo = 38;
        crown.position.set(38, 5, -34);
        crown.scale.setScalar(0.75);
      } else {
        // borda direita, totalmente visível
        crown.visible = true;
        crownBase.x = 46; crownBase.y = 1; crownBase.halo = 42;
        crown.position.set(46, 1, -18);
        crown.scale.setScalar(0.88);
      }
      halo.scale.setScalar(crownBase.halo);
    }
    layout();

    /* ---------- Parallax do mouse ---------- */
    var mx = 0, my = 0, tx = 0, ty = 0;
    window.addEventListener("pointermove", function (e) {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    /* ---------- Resize ---------- */
    function resize() {
      var w = canvas.clientWidth || window.innerWidth;
      var h = canvas.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", function () {
      resize();
      layout();
    });

    /* ---------- Controle de execução ---------- */
    var running = true;
    var hero = document.getElementById("inicio");
    if ("IntersectionObserver" in window && hero) {
      new IntersectionObserver(function (entries) {
        running = entries[0].isIntersecting;
      }, { threshold: 0.02 }).observe(hero);
    }
    document.addEventListener("visibilitychange", function () {
      // o loop já checa running + document.hidden
    });

    /* ---------- Loop ---------- */
    var clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      if (!running || document.hidden) return;

      var t = clock.getElapsedTime();

      // coroa: rotação + flutuação
      crown.rotation.y = t * 0.22;
      crown.position.y = crownBase.y + Math.sin(t * 0.55) * 1.1;
      halo.position.set(crownBase.x, crown.position.y, crown.position.z + 4);
      gem.rotation.y = t * 0.9;
      gem.rotation.x = Math.sin(t * 0.6) * 0.35;

      // luzes orbitando
      keyLight.position.x = Math.cos(t * 0.3) * 46;
      keyLight.position.z = 30 + Math.sin(t * 0.3) * 20;
      rimLight.position.x = Math.cos(t * 0.22 + Math.PI) * 52;
      rimLight.position.y = -18 + Math.sin(t * 0.4) * 12;

      // nuvens de partículas
      cloudFar.rotation.y = t * 0.016;
      cloudNear.rotation.y = -t * 0.024;

      // câmera com parallax suave
      mx += (tx - mx) * 0.045;
      my += (ty - my) * 0.045;
      camera.position.x = camBase.x + mx * 6;
      camera.position.y = camBase.y - my * 3.4;
      camera.lookAt(0, 2, 0);

      renderer.render(scene, camera);
    }

    if (prefersReduced) {
      // um único frame estático
      camera.lookAt(0, 2, 0);
      renderer.render(scene, camera);
    } else {
      animate();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initThree);
  } else {
    initThree();
  }
})();
