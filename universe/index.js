import * as THREE from "three";

export function startUniverse(containerId = "universe") {
  const container = document.getElementById(containerId);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("black");

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  );

  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Star field
  const starGeometry = new THREE.BufferGeometry();
  const starCount = 8000;
  const starPositions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount * 3; i++) {
    starPositions[i] = (Math.random() - 0.5) * 2000;
  }

  starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.8 });

  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);

  // Basic animation loop
  function animate() {
    requestAnimationFrame(animate);
    stars.rotation.y += 0.0007;
    renderer.render(scene, camera);
  }

  animate();
}
