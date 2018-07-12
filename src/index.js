import * as THREE from 'three';
import { Cube, Cylinder } from './lib/ooml';

let camera;
let scene;
let renderer;


const OOMLScene = [];

function init() {
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
  camera.position.z = 1;
  scene = new THREE.Scene();

  const code = `

  const myCube = new Cube(0.2, 0.2, 0.2);
  myCube.translate(0.4, 0, 0);
  myCube.rotate(0, 45, 0);

  const myCylinder = new Cylinder(0.1, 0.5);
  myCylinder.rotate(45,0,0);

  OOMLScene.push(myCube);
  OOMLScene.push(myCylinder);
`;

  const f = new Function('OOMLScene', 'Cube', 'Cylinder', code);
  f(OOMLScene, Cube, Cylinder);

  OOMLScene.forEach((element) => {
    scene.add(element.toTHREEMesh());
  });


  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

function show() {
  renderer.render(scene, camera);
}

init();
show();
