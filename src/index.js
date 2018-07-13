import * as THREE from 'three';
import * as monaco from 'monaco-editor'
import { Cube, Cylinder, Sphere, Union, Difference, Intersection } from './lib/ooml';
import { ThreeBSP } from './lib/threeCSG';
import { THREESTLExporter } from './lib/STLExporter'
import {saveAs} from 'file-saver';

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


  OOMLScene.push(myObj1);
  OOMLScene.push(myObj2);
  OOMLScene.push(myObj3);

`;


  

  const rendererEl = document.querySelector('.renderer');
  const {width, height} = rendererEl.getBoundingClientRect();

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);

  rendererEl.appendChild(renderer.domElement);

  const codeEl = document.querySelector('.code');
  const editor = monaco.editor.create(codeEl, {
    value: initialCode,
    language: 'javascript'
  });

  editor.onDidChangeModelContent((event) => {
    show(editor.getValue());
  });

  show(initialCode);
}

function show(code) {
  const OOMLScene = [];
  const rendererEl = document.querySelector('.renderer');
  const {width, height} = rendererEl.getBoundingClientRect();
  const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
  camera.position.z = 1;
  const scene = new THREE.Scene();

  const f = new Function('OOMLScene', 'Cube', 'Cylinder', 'Sphere', 'Union', 'Difference', 'Intersection', code);

  try {
    f(OOMLScene, Cube, Cylinder, Sphere, Union, Difference, Intersection);

    OOMLScene.forEach((element) => {
      scene.add(element.toTHREEMesh());
    });

    renderer.render(scene, camera);

    var exporter = new THREE.STLExporter();

    // second argument is a list of options
    const stlString = exporter.parse( scene );
    let blob = new Blob([stlString], {type: 'text/plain'});
    //saveAs(blob, "escena" + '.stl');

  } catch (e) {
    console.log('Error compiling', e);
  }
}

init();
