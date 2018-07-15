/**
 * @author Alberto Valero <alberto.valero@bq.com>
 *
 * Derived from STLExporter.js from
 * @author kovacsv / http://kovacsv.hu/
 * @author mrdoob / http://mrdoob.com/
 * @author mudcube / http://mudcu.be/
 * @author Mugen87 / https://github.com/Mugen87
 *
 *
 *
 * var STLData = OOML2STL.parse(OOMLScene);
 *
 */

import * as THREE from 'three';


function OOML2STL(OOMLScene) {
  const vector = new THREE.Vector3();
  const normalMatrixWorld = new THREE.Matrix3();
  const STLData = [];

  OOMLScene.forEach((OOMLObject) => {
    let object;
    let triangles;

    const mesh = OOMLObject.toTHREEMesh();
    let geometry = mesh.geometry;

    if (geometry.isBufferGeometry) {
      geometry = new THREE.Geometry().fromBufferGeometry(geometry);
    }

    if (geometry.isGeometry) {
      triangles = geometry.faces.length;
      object = {
        geometry,
        matrixWorld: mesh.matrixWorld,
      };
    }

    let offset = 80; // skip header
    const bufferLength = triangles * 2 + triangles * 3 * 4 * 4 + 80 + 4;
    const arrayBuffer = new ArrayBuffer(bufferLength);
    const output = new DataView(arrayBuffer);
    output.setUint32(offset, triangles, true); offset += 4;


    const vertices = object.geometry.vertices;
    const faces = object.geometry.faces;
    const matrixWorld = object.matrixWorld;

    normalMatrixWorld.getNormalMatrix(matrixWorld);

    for (let j = 0, jl = faces.length; j < jl; j++) {
      const face = faces[j];

      vector.copy(face.normal).applyMatrix3(normalMatrixWorld).normalize();

      output.setFloat32(offset, vector.x, true); offset += 4; // normal
      output.setFloat32(offset, vector.y, true); offset += 4;
      output.setFloat32(offset, vector.z, true); offset += 4;

      const indices = [face.a, face.b, face.c];

      for (let k = 0; k < 3; k++) {
        vector.copy(vertices[indices[k]]).applyMatrix4(matrixWorld);

        output.setFloat32(offset, vector.x, true); offset += 4; // vertices
        output.setFloat32(offset, vector.y, true); offset += 4;
        output.setFloat32(offset, vector.z, true); offset += 4;
      }

      output.setUint16(offset, 0, true); offset += 2; // attribute byte count
    }
    STLData.push(output);
  });

  return STLData;
}

export { OOML2STL };
