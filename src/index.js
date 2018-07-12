import * as THREE from 'three';
import { Cube, Cylinder, Sphere, Union, Difference, Intersection } from './lib/ooml';
import { ThreeBSP } from './lib/threeCSG';

let camera;
let scene;
let renderer;


const OOMLScene = [];

function init() {
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
  camera.position.z = 1;
  scene = new THREE.Scene();

  const code = `

  myCube1 = Cube(0.2, 0.2, 0.2);
  myCube2 = Cube(0.2, 0.2, 0.2);
  myCube3 = Cube(0.2, 0.2, 0.2);

  mySphere1 = Sphere(0.12);
  mySphere2 = Sphere(0.12);
  mySphere3 = Sphere(0.12);
  
  myObj1 = Union(myCube1, mySphere1);
  myObj2 = Difference(myCube2, mySphere2);
  myObj3 = Intersection(myCube3, mySphere3);
  
  myObj1.rotate(45,0,0);

  myObj2.translate(0.5, 0, 0);
  myObj2.rotate(45,0,0);

  myObj3.translate(-0.5, 0, 0);
  myObj3.rotate(45,0,0);


  OOMLScene.push(myObj1);
  OOMLScene.push(myObj2);
  OOMLScene.push(myObj3);

`;

  const f = new Function('OOMLScene', 'Cube', 'Cylinder', 'Sphere', 'Union', 'Difference', 'Intersection', code);
  f(OOMLScene, Cube, Cylinder, Sphere, Union, Difference, Intersection);

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
