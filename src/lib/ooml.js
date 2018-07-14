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

class Object3D {
  constructor() {
    this.rotateX = 0;
    this.rotateY = 0;
    this.rotateZ = 0;
    this.xp = 0;
    this.yp = 0;
    this.zp = 0;
    OOMLScene.push(this);
    this.operation = [];
  }

  rotate(x, y, z) {
    this.operation.push(['r', [x, y, z]]);
    return this;
  }

  translate(x, y, z) {
    this.operation.push(['t', [x, y, z]]);
    return this;
  }

  locate(mesh) {
    this.operation.forEach((element) => {
      if (element[0] === 'r') mesh.rotation.set(element[1][0], element[1][1], element[1][2]);
      if (element[0] === 't') mesh.position.set(element[1][0], element[1][1], element[1][2]);
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
    const material = new THREE.MeshNormalMaterial();

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
    const material = new THREE.MeshNormalMaterial();

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
    const material = new THREE.MeshNormalMaterial();

    const mesh = new THREE.Mesh(geometry, material);

    return this.locate(mesh);
  }
}

class BooleanBSP extends Object3D {
  constructor(OOMLMesh1, OOMLMesh2) {
    super();
    this.OOMLMesh1 = OOMLMesh1;
    this.OOMLMesh2 = OOMLMesh2;

    // when to mesh come together, remove them from scene
    remove(OOMLScene, OOMLMesh1);
    remove(OOMLScene, OOMLMesh2);
  }

  toTHREEMesh() {
    const result = this.resultBSP.toMesh(new THREE.MeshNormalMaterial());
    result.geometry.computeVertexNormals();
    return this.locate(result);
  }
}

class UnionClassBSP extends BooleanBSP {
  constructor(OOMLMesh1, OOMLMesh2) {
    super(OOMLMesh1, OOMLMesh2);
    const meshBSP1 = new ThreeBSP(OOMLMesh1.toTHREEMesh());
    const meshBSP2 = new ThreeBSP(OOMLMesh2.toTHREEMesh());

    this.resultBSP = meshBSP1.union(meshBSP2);
  }
}

class DifferenceClassBSP extends BooleanBSP {
  constructor(OOMLMesh1, OOMLMesh2) {
    super(OOMLMesh1, OOMLMesh2);
    const meshBSP1 = new ThreeBSP(OOMLMesh1.toTHREEMesh());
    const meshBSP2 = new ThreeBSP(OOMLMesh2.toTHREEMesh());

    this.resultBSP = meshBSP1.subtract(meshBSP2);
  }
}

class IntersectionClassBSP extends BooleanBSP {
  constructor(OOMLMesh1, OOMLMesh2) {
    super(OOMLMesh1, OOMLMesh2);
    const meshBSP1 = new ThreeBSP(OOMLMesh1.toTHREEMesh());
    const meshBSP2 = new ThreeBSP(OOMLMesh2.toTHREEMesh());

    this.resultBSP = meshBSP1.intersect(meshBSP2);
  }
}

export function Cube(sx, sy, sz) {
  return new CubeClass(sx, sy, sz);
}

export function Sphere(r) {
  return new SphereClass(r);
}


export function Cylinder(...args) {
  return new CylinderClass(...args);
}

export function Union(obj1, obj2) {
  return new UnionClassBSP(obj1, obj2);
}

export function Difference(obj1, obj2) {
  return new DifferenceClassBSP(obj1, obj2);
}

export function Intersection(obj1, obj2) {
  return new IntersectionClassBSP(obj1, obj2);
}

export function Translate(xyz, ...args) {
  args.forEach((element) => {
    element.translate(xyz[0], xyz[1], xyz[2]);
  });
}

export function Rotate(xyz, ...args) {
  args.forEach((element) => {
    element.rotate(xyz[0], xyz[1], xyz[2]);
  });
}

export { OOMLScene, OOMLConfig };
