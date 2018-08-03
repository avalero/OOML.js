import * as monaco from 'monaco-editor';
import * as THREE from 'three';
import { saveAs } from 'file-saver';
import { OOMLView } from './lib/ooml';
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

  const view = new OOMLView(rendererEl, initialCode);

  const codeEl = document.querySelector('.code');
  const editor = monaco.editor.create(codeEl, {
    value: initialCode,
    language: 'javascript',
  });

  editor.onDidChangeModelContent(() => {
    view.updateCode(editor.getValue());

    if (config.makeSTL) {
      const STLData = view.getSTL();
      STLData.forEach((data, i) => {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        saveAs(blob, `escena${i}.stl`);
      });
    }
  });
}

init();
