/**
 * 3D Interactive WebGL Scene for Anurag Singh's Portfolio
 * Technologies: Three.js (r128), WebGL, Smooth Lerp Motion
 * Features:
 *  - Electronics/IoT inspired 3D nodal circuit constellation & particle wave
 *  - Floating 3D geometric wireframes (Hardware & Software synthesis)
 *  - Smooth cursor-driven 3D camera parallax with inertia
 *  - Scroll-based camera journey through sections
 *  - Dynamic theme synchronization (Light/Dark mode color grading)
 *  - Auto-pause when off-screen or reduced-motion is requested for max performance
 */

(function () {
  'use strict';

  // Check WebGL availability
  function isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  if (!isWebGLAvailable()) {
    console.info('WebGL not supported or disabled. Falling back gracefully to CSS 3D transforms.');
    return;
  }

  // Check reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let scene, camera, renderer, container;
  let particles, particleGeometry;
  let nodeMeshGroup, geometricGroup;
  let pointLight1, pointLight2, ambientLight;
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let scrollY = 0, targetScrollY = 0;
  let isVisible = true;
  let animationFrameId = null;
  let width = window.innerWidth;
  let height = window.innerHeight;

  // Color palettes based on style.css variables
  const palettes = {
    dark: {
      bg: 0x071216,
      nodes: 0x2abaaa,       // Teal
      lines: 0x184441,       // Dark teal line
      particles: 0x94e4d3,   // Mint
      accent: 0xe8a553,      // Amber
      wireframe: 0x2abaaa,   // Teal wireframe
      light1: 0x94e4d3,      // Mint light
      light2: 0xe8a553,      // Amber accent light
      ambient: 0x092124
    },
    light: {
      bg: 0xf1f5f0,
      nodes: 0x087a70,
      lines: 0xc0d7d0,
      particles: 0x0e978b,
      accent: 0xa86217,
      wireframe: 0x087a70,
      light1: 0x0e978b,
      light2: 0xa86217,
      ambient: 0xd8e6e0
    }
  };

  function getCurrentTheme() {
    const dataTheme = document.body.dataset.theme;
    if (dataTheme === 'light' || dataTheme === 'dark') return dataTheme;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function init() {
    container = document.getElementById('webgl-canvas-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'webgl-canvas-container';
      container.className = 'webgl-canvas-container';
      container.setAttribute('aria-hidden', 'true');
      document.body.prepend(container);
    }

    width = window.innerWidth;
    height = window.innerHeight;

    // Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(getCurrentTheme() === 'light' ? 0xf1f5f0 : 0x071216, 0.0018);

    // Camera
    camera = new THREE.PerspectiveCamera(60, width / height, 1, 2000);
    camera.position.set(0, 0, 420);

    // Renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Lights
    const theme = palettes[getCurrentTheme()];
    ambientLight = new THREE.AmbientLight(theme.ambient, 1.2);
    scene.add(ambientLight);

    pointLight1 = new THREE.PointLight(theme.light1, 2.5, 650);
    pointLight1.position.set(160, 180, 260);
    scene.add(pointLight1);

    pointLight2 = new THREE.PointLight(theme.light2, 1.8, 550);
    pointLight2.position.set(-200, -150, 180);
    scene.add(pointLight2);

    // Build 3D Objects
    createParticleConstellation();
    createGeometricWireframes();
    createCircuitGrid();

    // Event Listeners
    window.addEventListener('resize', onWindowResize, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    // Sync theme changes
    const observer = new MutationObserver(() => {
      updateThemeColors();
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });

    // Pause off-screen or tab hidden for battery efficiency
    if ('IntersectionObserver' in window) {
      const heroSection = document.getElementById('top') || document.querySelector('.hero');
      if (heroSection) {
        const visObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            isVisible = entry.isIntersecting || window.scrollY < window.innerHeight * 1.5;
            if (isVisible && !animationFrameId && !prefersReducedMotion) {
              animate();
            }
          });
        }, { threshold: 0.05 });
        visObserver.observe(heroSection);
      }
    }

    document.addEventListener('visibilitychange', () => {
      isVisible = document.visibilityState === 'visible';
      if (isVisible && !animationFrameId && !prefersReducedMotion) {
        animate();
      }
    });

    if (!prefersReducedMotion) {
      animate();
    } else {
      // Single calm render for reduced motion
      renderer.render(scene, camera);
    }
  }

  // 1. Constellation of connected nodal points (representing IoT, Signals & Circuits)
  function createParticleConstellation() {
    nodeMeshGroup = new THREE.Group();
    const nodeCount = width < 768 ? 45 : 85;
    const bounds = { x: 500, y: 350, z: 280 };
    const nodePositions = [];
    const theme = palettes[getCurrentTheme()];

    const sphereGeo = new THREE.SphereGeometry(1.6, 8, 8);
    const sphereMat = new THREE.MeshBasicMaterial({ color: theme.nodes, transparent: true, opacity: 0.85 });

    for (let i = 0; i < nodeCount; i++) {
      const x = (Math.random() - 0.5) * bounds.x * 2;
      const y = (Math.random() - 0.5) * bounds.y * 2;
      const z = (Math.random() - 0.5) * bounds.z * 2;
      nodePositions.push(new THREE.Vector3(x, y, z));

      const mesh = new THREE.Mesh(sphereGeo, sphereMat);
      mesh.position.set(x, y, z);
      nodeMeshGroup.add(mesh);
    }

    // Connect close nodes with glowing lines
    const lineMat = new THREE.LineBasicMaterial({
      color: theme.lines,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });

    const lineGeo = new THREE.BufferGeometry();
    const linePositions = [];
    const maxDistance = 110;

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < maxDistance) {
          linePositions.push(nodePositions[i].x, nodePositions[i].y, nodePositions[i].z);
          linePositions.push(nodePositions[j].x, nodePositions[j].y, nodePositions[j].z);
        }
      }
    }

    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
    nodeMeshGroup.add(lineSegments);

    scene.add(nodeMeshGroup);
  }

  // 2. Floating 3D Geometric Polyhedra (Hardware / Software synthesis)
  function createGeometricWireframes() {
    geometricGroup = new THREE.Group();
    const theme = palettes[getCurrentTheme()];

    // Icosahedron (Core / Electronics representation)
    const icoGeo = new THREE.IcosahedronGeometry(42, 1);
    const icoMat = new THREE.MeshStandardMaterial({
      color: theme.wireframe,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
      roughness: 0.2,
      metalness: 0.8
    });
    const icosahedron = new THREE.Mesh(icoGeo, icoMat);
    icosahedron.position.set(220, 40, -40);
    icosahedron.name = 'ico';
    geometricGroup.add(icosahedron);

    // Inner glowing core
    const innerGeo = new THREE.OctahedronGeometry(18, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: theme.accent,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    innerCore.position.set(220, 40, -40);
    innerCore.name = 'icoInner';
    geometricGroup.add(innerCore);

    // Torus Ring Orbit (Symbolizing hardware integration & communications)
    const torusGeo = new THREE.TorusGeometry(62, 0.9, 8, 48);
    const torusMat = new THREE.MeshBasicMaterial({
      color: theme.nodes,
      transparent: true,
      opacity: 0.35
    });
    const torusRing = new THREE.Mesh(torusGeo, torusMat);
    torusRing.rotation.x = Math.PI / 3;
    torusRing.position.set(220, 40, -40);
    torusRing.name = 'torus';
    geometricGroup.add(torusRing);

    // Left floating dodecahedron (Software / Algorithms representation)
    const dodecaGeo = new THREE.DodecahedronGeometry(30, 0);
    const dodecaMat = new THREE.MeshStandardMaterial({
      color: theme.accent,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      roughness: 0.3,
      metalness: 0.7
    });
    const dodeca = new THREE.Mesh(dodecaGeo, dodecaMat);
    dodeca.position.set(-230, -70, -30);
    dodeca.name = 'dodeca';
    geometricGroup.add(dodeca);

    scene.add(geometricGroup);
  }

  // 3. Ground Wave / Circuit Plane in Depth
  function createCircuitGrid() {
    const particleCount = width < 768 ? 350 : 750;
    particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const theme = palettes[getCurrentTheme()];

    let idx = 0;
    for (let i = 0; i < particleCount; i++) {
      positions[idx] = (Math.random() - 0.5) * 1100;
      positions[idx + 1] = -160 + (Math.random() - 0.5) * 70;
      positions[idx + 2] = (Math.random() - 0.5) * 850;
      scales[i] = Math.random() * 2.2 + 0.8;
      idx += 3;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    // Custom shader material for luminous circular dots
    const pMaterial = new THREE.PointsMaterial({
      color: theme.particles,
      size: 2.2,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(particleGeometry, pMaterial);
    scene.add(particles);
  }

  function updateThemeColors() {
    const curTheme = getCurrentTheme();
    const theme = palettes[curTheme];

    if (scene) {
      scene.fog.color.setHex(curTheme === 'light' ? 0xf1f5f0 : 0x071216);
    }
    if (ambientLight) ambientLight.color.setHex(theme.ambient);
    if (pointLight1) pointLight1.color.setHex(theme.light1);
    if (pointLight2) pointLight2.color.setHex(theme.light2);

    if (geometricGroup) {
      const ico = geometricGroup.getObjectByName('ico');
      if (ico && ico.material) ico.material.color.setHex(theme.wireframe);

      const inner = geometricGroup.getObjectByName('icoInner');
      if (inner && inner.material) inner.material.color.setHex(theme.accent);

      const torus = geometricGroup.getObjectByName('torus');
      if (torus && torus.material) torus.material.color.setHex(theme.nodes);

      const dodeca = geometricGroup.getObjectByName('dodeca');
      if (dodeca && dodeca.material) dodeca.material.color.setHex(theme.accent);
    }

    if (particles && particles.material) {
      particles.material.color.setHex(theme.particles);
    }
  }

  function onPointerMove(event) {
    // Normalized coordinates (-1 to +1)
    mouse.targetX = (event.clientX / width) * 2 - 1;
    mouse.targetY = -(event.clientY / height) * 2 + 1;
  }

  function onScroll() {
    targetScrollY = window.scrollY;
  }

  function onWindowResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  let clock = new THREE.Clock();

  function animate() {
    if (!isVisible) {
      animationFrameId = null;
      return;
    }

    animationFrameId = requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // Smooth inertia lerp for mouse parallax
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    // Smooth scroll interpolation
    scrollY += (targetScrollY - scrollY) * 0.08;

    // Camera motion: mouse orbit + scroll-based depth drift
    camera.position.x = mouse.x * 45;
    camera.position.y = mouse.y * 35 - scrollY * 0.28;
    camera.position.z = 420 + Math.sin(elapsedTime * 0.4) * 15 - scrollY * 0.12;
    camera.lookAt(0, -scrollY * 0.28, 0);

    // Dynamic rotation of geometric wireframes
    if (geometricGroup) {
      const ico = geometricGroup.getObjectByName('ico');
      if (ico) {
        ico.rotation.x = elapsedTime * 0.25;
        ico.rotation.y = elapsedTime * 0.35;
      }
      const inner = geometricGroup.getObjectByName('icoInner');
      if (inner) {
        inner.rotation.x = -elapsedTime * 0.4;
        inner.rotation.y = elapsedTime * 0.5;
      }
      const torus = geometricGroup.getObjectByName('torus');
      if (torus) {
        torus.rotation.z = elapsedTime * 0.2;
      }
      const dodeca = geometricGroup.getObjectByName('dodeca');
      if (dodeca) {
        dodeca.rotation.x = elapsedTime * 0.22;
        dodeca.rotation.y = -elapsedTime * 0.3;
      }
      geometricGroup.position.y = Math.sin(elapsedTime * 0.8) * 10;
    }

    // Slowly rotate constellation
    if (nodeMeshGroup) {
      nodeMeshGroup.rotation.y = elapsedTime * 0.04 + mouse.x * 0.2;
      nodeMeshGroup.rotation.x = Math.sin(elapsedTime * 0.03) * 0.1 - mouse.y * 0.15;
    }

    // Gentle wave movement on particle plane
    if (particles && particleGeometry) {
      particles.rotation.y = elapsedTime * 0.02;
    }

    renderer.render(scene, camera);
  }

  // Initialize when DOM and Three.js are ready
  let attempts = 0;
  function start() {
    if (typeof THREE !== 'undefined') {
      init();
    } else if (attempts < 25) {
      attempts++;
      setTimeout(start, 120);
    } else {
      console.info('Three.js CDN not reached or offline. Seamless CSS 3D fallback active.');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
