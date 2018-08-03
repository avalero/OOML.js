import * as THREE from 'three';
import { ThreeBSP } from './threeCSG';

const OOMLScene = [];

const OOMLConfig = {
  makeSTL: false,
  drawGlobalAxis: true,
  drawObjectAxis: false,
};

function remove(array, element) {
  const index = array.indexOf(element);

  if (index !== -1) {
    array.splice(index, 1);
  }
}

class OOMLView {
  constructor(el, initialCode = '') {
    this.el = el;
    this.renderer = new THREE.WebGLRenderer();

    this.renderer.setClearColor(0xEEEEEE);

    this.updateSize();

    this.el.appendChild(this.renderer.domElement);

    this.updateCode(initialCode);
  }

  updateSize() {
    const { width, height } = this.el.getBoundingClientRect();
    this.width = width;
    this.height = height;
    this.renderer.setSize(width, height);
  }

  updateCode(code) {
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

      // Add OOML objects to THREE scene
      OOMLScene.forEach((element) => {
        scene.add(element.toTHREEMesh());
      });

      const camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 1000);
      camera.position.set(0, -200, 180);

      // const vector = new THREE.Vector3(0, 0, 0);
      // camera.lookAt(vector);

      camera.lookAt(scene.position);
      this.renderer.render(scene, camera);
    } catch (e) {
      console.log('Error compiling', e);
    }
  }

  getSTL() {
    return OOML2STL(this.scene);
  }
}

class Object3D {
  constructor() {
    OOMLScene.push(this);
    this.operation = [];
  }

  rotate(x, y, z) {
    const xg = Math.PI * x / 180;
    const yg = Math.PI * y / 180;
    const zg = Math.PI * z / 180;

    this.operation.push(['r', [xg, yg, zg]]);
    return this;
  }

  translate(x, y, z) {
    this.operation.push(['t', [x, y, z]]);
    return this;
  }

  moveTo(x, y, z) {
    this.operation.push(['m', [x, y, z]]);
    return this;
  }

  locate(mesh) {
    this.operation.forEach((element) => {
      if (element[0] === 'r') {
        mesh.rotation.set(element[1][0], element[1][1], element[1][2]);
      } else if (element[0] === 't') {
        mesh.translateX(element[1][0]);
        mesh.translateY(element[1][1]);
        mesh.translateZ(element[1][2]);
      } else if (element[0] === 'm') {
        mesh.position.set(element[1][0], element[1][1], element[1][2]);
      }
    });
    return mesh;
  }
}

class CubeClass extends Object3D {
  constructor(x, y, z) {
    super();
    this.sx = x;
    this.sy = y;
    this.sz = z;
  }

  toTHREEMesh() {
    const geometry = new THREE.BoxGeometry(this.sx, this.sy, this.sz);
    const material = new THREE.MeshLambertMaterial({ color: 0xff0000 });

    const mesh = new THREE.Mesh(geometry, material);

    return this.locate(mesh);
  }
}

class SphereClass extends Object3D {
  constructor(radius) {
    super();
    this.radius = radius;
  }

  toTHREEMesh() {
    const geometry = new THREE.SphereGeometry(this.radius, 20, 20);
    const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });

    const mesh = new THREE.Mesh(geometry, material);

    return this.locate(mesh);
  }
}

class CylinderClass extends Object3D {
  constructor(...args) {
    super();
    console.log(args.length);
    if (args.length == 2) {
      this.r1 = args[0];
      this.r2 = args[0];
      this.h = args[1];
      this.fn = 20;
    } else if (args.length == 3) {
      this.r1 = args[0];
      this.r2 = args[1];
      this.h = args[2];
      this.fn = 20;
    } else if (args.length == 4) {
      this.r1 = args[0];
      this.r2 = args[1];
      this.h = args[2];
      this.fn = args[3];
    }
  }

  toTHREEMesh() {
    const geometry = new THREE.CylinderGeometry(this.r1, this.r2, this.h, this.fn);
    const material = new THREE.MeshLambertMaterial({ color: 0x0000ff });

    const mesh = new THREE.Mesh(geometry, material);

    return this.locate(mesh);
  }
}

class BooleanBSP extends Object3D {
  constructor(args) {
    super();
    this.OOMLMeshArr = args;

    // when meshes come together, remove them from scene
    for (let i = 0; i < args.length; i++) {
      remove(OOMLScene, args[i]);
    }
  }

  toTHREEMesh() {
    const result = this.resultBSP.toMesh(new THREE.MeshLambertMaterial({ color: 0xffff00 }));
    // result.geometry.computeVertexNormals();
    return this.locate(result);
  }
}

class UnionClassBSP extends BooleanBSP {
  constructor(args) {
    super(args);
    let unionMeshBSP = new ThreeBSP(args[0].toTHREEMesh());
    for (let i = 1; i < args.length; i++) {
      const bspMesh = new ThreeBSP(args[i].toTHREEMesh());
      unionMeshBSP = unionMeshBSP.union(bspMesh);
    }

    this.resultBSP = unionMeshBSP;
  }
}

class DifferenceClassBSP extends BooleanBSP {
  constructor(args) {
    super(args);
    let differenceMeshBSP = new ThreeBSP(args[0].toTHREEMesh());
    for (let i = 1; i < args.length; i++) {
      const bspMesh = new ThreeBSP(args[i].toTHREEMesh());
      differenceMeshBSP = differenceMeshBSP.subtract(bspMesh);
    }

    this.resultBSP = differenceMeshBSP;
  }
}

class IntersectionClassBSP extends BooleanBSP {
  constructor(args) {
    super(args);
    let intersectionMeshBSP = new ThreeBSP(args[0].toTHREEMesh());
    for (let i = 1; i < args.length; i++) {
      const bspMesh = new ThreeBSP(args[i].toTHREEMesh());
      intersectionMeshBSP = intersectionMeshBSP.subtract(bspMesh);
    }

    this.resultBSP = intersectionMeshBSP;
  }
}

const Cube = (sx, sy, sz) => new CubeClass(sx, sy, sz);

const Sphere = r => new SphereClass(r);


const Cylinder = (...args) => new CylinderClass(...args);

const Union = (...args) => new UnionClassBSP(args);

const Difference = (...args) => new DifferenceClassBSP(args);

const Intersection = (...args) => new IntersectionClassBSP(args);

const Translate = (xyz, ...args) => {
  args.forEach((element) => {
    element.translate(xyz[0], xyz[1], xyz[2]);
  });
};

const Rotate = (xyz, ...args) => {
  args.forEach((element) => {
    element.rotate(xyz[0], xyz[1], xyz[2]);
  });
};

export { OOMLView, OOMLScene, OOMLConfig };
