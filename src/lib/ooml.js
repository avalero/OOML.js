import * as THREE from 'three';

class Object3D {
  constructor() {
    this.rotateX = 0;
    this.rotateY = 0;
    this.rotateZ = 0;
    this.xp = 0;
    this.yp = 0;
    this.zp = 0;
  }

  rotate(x, y, z) {
    this.rotateX = x;
    this.rotateY = y;
    this.rotateZ = z;
  }

  translate(x, y, z) {
    this.xp += x;
    this.yp += y;
    this.zp += z;
  }

  locate(mesh) {
    mesh.position.x = this.xp;
    mesh.position.y = this.yp;
    mesh.position.z = this.zp;


    mesh.rotation.x = this.rotateX;
    mesh.rotation.y = this.rotateY;
    mesh.rotation.z = this.rotateZ;

    return mesh;
  }
}

export class Cube extends Object3D {
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

export class Cylinder extends Object3D {
  constructor() {
    super();
    if (arguments.length == 2) {
      this.r1 = arguments[0];
      this.r2 = arguments[0];
      this.h = arguments[1];
      this.fn = 20;
    } else if (arguments.length == 3) {
      this.r1 = arguments[0];
      this.r2 = arguments[1];
      this.h = arguments[2];
      this.fn = 20;
    } else if (arguments.length == 4) {
      this.r1 = arguments[0];
      this.r2 = arguments[1];
      this.h = arguments[2];
      this.fn = arguments[3];
    }
  }

  toTHREEMesh() {
    const geometry = new THREE.CylinderGeometry(this.r1, this.r2, this.h, this.fn);
    const material = new THREE.MeshNormalMaterial();

    const mesh = new THREE.Mesh(geometry, material);

    return this.locate(mesh);
  }
}
