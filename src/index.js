import * as THREE from 'three';
import * as monaco from 'monaco-editor';
import {
  OOMLScene, OOMLConfig, Cube, Cylinder, Sphere, Union, Difference, Intersection, Translate, Rotate,
} from './lib/ooml';
import { } from './lib/STLExporter';
import { saveAs } from 'file-saver';

let renderer;
let axes;
let scene;

function init() {
  const initialCode = `

  myCube1 = Cube(20, 20, 20);
  myCube2 = Cube(20, 20, 20);
  myCube3 = Cube(20, 20, 20);
  
  mySphere1 = Sphere(12);
  mySphere2 = Sphere(12);
  mySphere3 = Sphere(12);

  myObj1 = Union(myCube1, mySphere1);
  myObj1.translate(0,10,0);

  myObj2 = Difference(myCube2, mySphere2);
  myObj2.translate(40,10,0);

  myObj3 = Intersection(myCube3, mySphere3);
  myObj3.translate(-40,10,0);


`;

  const rendererEl = document.querySelector('.renderer');
  const { width, height } = rendererEl.getBoundingClientRect();

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0xEEEEEE);
  renderer.setSize(width, height);

  rendererEl.appendChild(renderer.domElement);

  const codeEl = document.querySelector('.code');
  const editor = monaco.editor.create(codeEl, {
    value: initialCode,
    language: 'javascript',
  });

  editor.onDidChangeModelContent(() => {
    show(editor.getValue());
  });

  show(initialCode);
}


function show(code) {
  const rendererEl = document.querySelector('.renderer');
  const { width, height } = rendererEl.getBoundingClientRect();

  scene = new THREE.Scene();

  const planeGeometry = new THREE.PlaneGeometry(140, 140, 1, 1);
  const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, wireframe: false });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);

  plane.rotation.x = -0.5 * Math.PI;
  plane.position.set(0, 0, 0);

  scene.add(plane);

  // programmed objects
  const config = OOMLConfig;
  config.makeSTL = false;

  OOMLScene.length = 0;

  const f = new Function(
    'OOMLScene',
    'config',
    'Cube',
    'Cylinder',
    'Sphere',
    'Union',
    'Difference',
    'Intersection',
    'Translate',
    'Rotate',
    code,
  );

  try {
    
    f(OOMLScene, config, Cube, Cylinder, Sphere, Union, Difference, Intersection, Translate, Rotate);

    OOMLScene.forEach((element) => {
      scene.add(element.toTHREEMesh());
    });

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.x = -150;
    camera.position.y = 150;
    camera.position.z = 150;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);

    if (config.makeSTL) {
      const exporter = new THREE.STLExporter();
      const stlString = exporter.parse(scene);
      const blob = new Blob([stlString], { type: 'text/plain' });
      saveAs(blob, 'escena' + '.stl');
    }
  } catch (e) {
    console.log('Error compiling', e);
  }
}

init();
