/* ============================================================
   CASA DE LEÃO — Cena 3D do hero (Three.js)
   Carvalho 3D azul (referência à logo Carvalhos de Justiça)
   + campo de partículas azuis.
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
    scene.fog = new THREE.FogExp2(0x050b18, 0.0045);

    var camera = new THREE.PerspectiveCamera(52, 1, 0.1, 400);
    var camBase = { x: 0, y: 2, z: 64 };
    camera.position.set(camBase.x, camBase.y, camBase.z);

    /* ---------- Luzes (todas em tons de azul) ---------- */
    scene.add(new THREE.AmbientLight(0x22345c, 1.35));
    scene.add(new THREE.HemisphereLight(0x8ec5ff, 0x0c1930, 0.85));

    var keyLight = new THREE.PointLight(0xbcd8ff, 3.8, 320, 1.4);
    keyLight.position.set(-40, 46, 30);
    scene.add(keyLight);

    var fillLight = new THREE.PointLight(0x6fa8ff, 1.6, 320, 1.4);
    fillLight.position.set(-58, 8, 52);
    scene.add(fillLight);

    var rimLight = new THREE.PointLight(0x38c3f0, 2.0, 300, 1.6);
    rimLight.position.set(52, -18, 36);
    scene.add(rimLight);

    var topLight = new THREE.DirectionalLight(0xdcecff, 1.1);
    topLight.position.set(0, 60, 40);
    scene.add(topLight);

    /* ---------- Materiais ---------- */
    var trunkMat = new THREE.MeshStandardMaterial({
      color: 0x1748a8,
      metalness: 0.6,
      roughness: 0.35,
      emissive: 0x0d2f78,
      emissiveIntensity: 0.28
    });
    var branchMat = new THREE.MeshStandardMaterial({
      color: 0x2468d8,
      metalness: 0.55,
      roughness: 0.3,
      emissive: 0x14409f,
      emissiveIntensity: 0.35
    });
    var arcMat = new THREE.MeshStandardMaterial({
      color: 0x8ec5ff,
      metalness: 0.45,
      roughness: 0.25,
      emissive: 0x4d9fff,
      emissiveIntensity: 1.1
    });

    function canopyMat(color, emissive) {
      return new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.35,
        roughness: 0.3,
        emissive: emissive,
        emissiveIntensity: 0.4,
        flatShading: true
      });
    }

    /* ---------- Carvalho (árvore da justiça) ---------- */
    var tree = new THREE.Group();

    // tronco afilado
    var trunk = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 2.5, 14, 10), trunkMat);
    trunk.position.y = -1;
    tree.add(trunk);

    // base alargada (raízes)
    var roots = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 4.4, 2.4, 10), trunkMat);
    roots.position.y = -7.8;
    tree.add(roots);

    // braços erguidos (figuras que formam o tronco na logo)
    var armL = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.72, 7.4, 8), branchMat);
    armL.position.set(-2.9, 3.6, 0.3);
    armL.rotation.z = 0.62;
    tree.add(armL);

    var armR = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.72, 7.4, 8), branchMat);
    armR.position.set(2.9, 3.6, -0.3);
    armR.rotation.z = -0.62;
    tree.add(armR);

    // copa: aglomerado de folhagens facetadas em tons de azul
    var blobs = [
      { x: 0,    y: 10.5, z: 0,    r: 5.4, c: 0x2f7ce8, e: 0x1a4fd0 },
      { x: -5.2, y: 8.6,  z: 1.2,  r: 3.9, c: 0x2468d8, e: 0x14409f },
      { x: 5.2,  y: 8.8,  z: -0.8, r: 4.1, c: 0x2468d8, e: 0x14409f },
      { x: -3.1, y: 12.4, z: -2.6, r: 3.3, c: 0x5aa6ff, e: 0x2b74e0 },
      { x: 3.4,  y: 12.6, z: 2.4,  r: 3.5, c: 0x5aa6ff, e: 0x2b74e0 },
      { x: 0.4,  y: 14.6, z: -0.6, r: 2.9, c: 0x8ec5ff, e: 0x3f8bf5 },
      { x: -6.8, y: 6.4,  z: -2.2, r: 2.7, c: 0x1d55c8, e: 0x113a92 },
      { x: 6.9,  y: 6.6,  z: 2.0,  r: 2.8, c: 0x1d55c8, e: 0x113a92 },
      { x: 0,    y: 7.2,  z: -4.6, r: 2.5, c: 0x2468d8, e: 0x14409f },
      { x: 1.2,  y: 7.4,  z: 4.4,  r: 2.4, c: 0x2468d8, e: 0x14409f }
    ];
    var topBlob = null;
    blobs.forEach(function (b) {
      var m = new THREE.Mesh(new THREE.IcosahedronGeometry(b.r, 1), canopyMat(b.c, b.e));
      m.position.set(b.x, b.y, b.z);
      m.rotation.set(b.x * 0.35, b.y * 0.22, b.z * 0.3);
      tree.add(m);
      if (b.y > 14) topBlob = m;
    });

    // luz suave dentro da copa
    var canopyLight = new THREE.PointLight(0x4d9fff, 1.15, 52, 1.9);
    canopyLight.position.set(0, 9.5, 0);
    tree.add(canopyLight);

    // arcos dourados da base (como na logo) — aqui em azul brilhante
    var arcs = new THREE.Group();
    var arc1 = new THREE.Mesh(new THREE.TorusGeometry(9.4, 0.3, 12, 80), arcMat);
    arc1.rotation.x = Math.PI / 2;
    arc1.position.y = -9.4;
    arcs.add(arc1);

    var arc2 = new THREE.Mesh(new THREE.TorusGeometry(11.8, 0.22, 12, 80), arcMat.clone());
    arc2.material.emissiveIntensity = 0.7;
    arc2.rotation.x = Math.PI / 2;
    arc2.position.y = -10.6;
    arcs.add(arc2);

    tree.add(arcs);
    scene.add(tree);

    // Halo azul atrás da árvore
    var haloMat = new THREE.SpriteMaterial({
      map: null, // definido depois que o sprite de partícula existir
      color: 0x2f7ce8,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    var halo = new THREE.Sprite(haloMat);
    halo.scale.setScalar(52);
    scene.add(halo);

    /* ---------- Partículas azuis ---------- */
    function makeSprite() {
      var c = document.createElement("canvas");
      c.width = c.height = 64;
      var ctx = c.getContext("2d");
      var g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, "rgba(214,236,255,1)");
      g.addColorStop(0.32, "rgba(140,197,255,.85)");
      g.addColorStop(0.62, "rgba(77,159,255,.28)");
      g.addColorStop(1, "rgba(77,159,255,0)");
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
    var treeBase = { x: 0, y: -3, halo: 52 };
    function layout() {
      var w = window.innerWidth;
      if (w < 768) {
        // mobile: sem árvore — apenas um halo azul suave atrás do conteúdo
        tree.visible = false;
        treeBase.x = 0; treeBase.y = 0; treeBase.halo = 85;
        tree.position.set(0, 0, -40);
        tree.scale.setScalar(0.8);
      } else if (w < 1100) {
        // canto direito, afastada do texto
        tree.visible = true;
        treeBase.x = 38; treeBase.y = -6; treeBase.halo = 40;
        tree.position.set(38, -6, -36);
        tree.scale.setScalar(0.72);
      } else {
        // borda direita, totalmente visível
        tree.visible = true;
        treeBase.x = 46; treeBase.y = -8; treeBase.halo = 46;
        tree.position.set(46, -8, -20);
        tree.scale.setScalar(0.85);
      }
      halo.scale.setScalar(treeBase.halo);
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

      // árvore: rotação lenta + flutuação
      tree.rotation.y = t * 0.18;
      tree.position.y = treeBase.y + Math.sin(t * 0.55) * 1.1;

      // arcos da base: pulso sutil
      var pulse = 1 + Math.sin(t * 1.3) * 0.025;
      arcs.scale.set(pulse, 1, pulse);

      // copa: respiração no topo
      if (topBlob) topBlob.scale.setScalar(1 + Math.sin(t * 0.9) * 0.04);

      halo.position.set(treeBase.x, tree.position.y + 4, tree.position.z + 6);

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
