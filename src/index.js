import * as monaco from 'monaco-editor';
import * as THREE from 'three';
import { saveAs } from 'file-saver';
import {
  OOMLScene, OOMLConfig, Cube, Cylinder, Sphere, Union, Difference, Intersection, Translate, Rotate,
} from './lib/ooml';
import { OOML2STL } from './lib/OOML2STL';

let renderer;

function init() {
  const initialCode = `

  myCube1 = Cube(20, 20, 20);
  myCube2 = Cube(20, 20, 20);
  myCube3 = Cube(20, 20, 20);
  
  mySphere1 = Sphere(12);
  mySphere2 = Sphere(12);
  mySphere3 = Sphere(12);

  myObj1 = Union(myCube1, mySphere1);
  myObj1.moveTo(0,0,10);

  myObj2 = Difference(myCube2, mySphere2);
  myObj2.moveTo(40,0,10);

  myObj3 = Intersection(myCube3, mySphere3);
  myObj3.moveTo(-40,0,10);



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

  const scene = new THREE.Scene();

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(100, -200, 200);
  scene.add(spotLight);

  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1));
  const helper = new THREE.PlaneHelper(plane, 200, 0x98f5ff);
  scene.add(helper);

  const axes = new THREE.AxisHelper(20);
  axes.position.set(-95,-95,1);
  scene.add(axes);

  const grid = new THREE.GridHelper(200, 10);
  grid.geometry.rotateX(Math.PI / 2);
  scene.add(grid);


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

    // save scene to STL?
    if (config.makeSTL) {
      const STLData = OOML2STL(OOMLScene);
      STLData.forEach((data, i) => {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        saveAs(blob, `escena${i}.stl`);
      });
    }

    // Add OOML objects to THREE scene
    OOMLScene.forEach((element) => {
      scene.add(element.toTHREEMesh());
    });

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, -200, 180);

    // const vector = new THREE.Vector3(0, 0, 0);
    // camera.lookAt(vector);

    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  } catch (e) {
    console.log('Error compiling', e);
  }
}

init();
