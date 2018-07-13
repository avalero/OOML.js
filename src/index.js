import * as THREE from 'three';
import * as monaco from 'monaco-editor';
import {
  OOMLScene, Cube, Cylinder, Sphere, Union, Difference, Intersection, Translate, Rotate 
} from './lib/ooml';
import { } from './lib/STLExporter';
import { saveAs } from 'file-saver';

let renderer;

function init() {
  const initialCode = `

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

`;

  const rendererEl = document.querySelector('.renderer');
  const { width, height } = rendererEl.getBoundingClientRect();

  renderer = new THREE.WebGLRenderer({ antialias: true });
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

const newLocal = 'Cube';
function show(code) {
  OOMLScene.length = 0;
  const rendererEl = document.querySelector('.renderer');
  const { width, height } = rendererEl.getBoundingClientRect();
  const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
  camera.position.z = 1;
  const scene = new THREE.Scene();

  const f = new Function(
    'OOMLScene', 
    'Cube',
    'Cylinder', 
    'Sphere', 
    'Union', 
    'Difference', 
    'Intersection',
    'Translate',
    'Rotate',
    code
  );

  try {
    let makeSTL = false;

    makeSTL = f(OOMLScene, Cube, Cylinder, Sphere, Union, Difference, Intersection, Translate, Rotate) || false;

    OOMLScene.forEach((element) => {
      scene.add(element.toTHREEMesh());
    });

    renderer.render(scene, camera);

    console.log('Make STL: ' + makeSTL);

    if (makeSTL) {
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
