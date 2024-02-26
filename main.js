import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
const scene = new THREE.Scene();

const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: "#00ff83",
  roughness: 0.2,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const light = new THREE.PointLight(0xffffff, 70, 100, 1.7);
light.position.set(0, 10, 10);
// light.intensity = 1.25;
scene.add(light);

const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 20;
scene.add(camera);

const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

const fontLoader = new FontLoader();
let font;
fontLoader.load('./SpaceFrigate_Regular.json', loadedFont => {
  font = loadedFont;
  console.log("Font loaded:", font);

  // text geometry for the title
  const titleTextGeometry = new TextGeometry("", {
    font: font,
    size: 10,
    height: 0.1,
  });

  const titleTextMaterial = new THREE.MeshStandardMaterial({ color: "#ffffff" });

  const titleTextMesh = new THREE.Mesh(titleTextGeometry, titleTextMaterial);
  titleTextMesh.position.set(0, 10, 10);
  titleTextMesh.lookAt(camera.position);
  scene.add(titleTextMesh);

  // text elements for qualities
  const qualities = ["Understanding", "Positive Attitude", "Helpful", "Supportive"];
  const qualityTexts = [];

  for (let i = 0; i < qualities.length; i++) {
    const angle = (i / qualities.length) * Math.PI * 2;
    const x = Math.sin(angle) * 10;
    const z = Math.cos(angle) * 10;

    const qualityTextGeometry = new TextGeometry(qualities[i], {
      font: font,
      size: 0.5,
      height: 0.1,
    });

    const qualityTextMaterial = new THREE.MeshStandardMaterial({ color: "#ffffff" });

    const qualityTextMesh = new THREE.Mesh(qualityTextGeometry, qualityTextMaterial);
    qualityTextMesh.position.set(x, 0, z);
    qualityTextMesh.lookAt(camera.position);
    scene.add(qualityTextMesh);

    qualityTexts.push(qualityTextMesh);
  }
});

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.render(scene, camera);
  // }
});

const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();

const tl = gsap.timeline({ defaults: { duration: 1 } });
tl.fromTo(mesh.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 });
tl.fromTo(".title", { opacity: 0 }, { opacity: 1 });

let mouseDown = false;
let rgb = [];
window.addEventListener("mousedown", (e) => {
  mouseDown = true;
});
window.addEventListener("mouseup", (e) => {
  mouseDown = false;
});
window.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150,
    ];
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    });
  }
});
renderer.render(scene, camera);