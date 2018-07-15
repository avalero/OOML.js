# OOML.js
Object Oriented Modelling Language. It is built upon [Three.js](https://threejs.org/). It uses [THREE.STLExpoerter](https://www.npmjs.com/package/three-stlexporter) to generate STL files. Editor is [Monaco-editor](https://github.com/Microsoft/monaco-editor/). 

Check the rest of dependencies on [package.json file](./package.json)

## LICENSE
[MIT License](https://opensource.org/licenses/MIT)



## How to run

    npm install
    npm run dev

## OOML.js code samples

### Example 1 - Union, Difference, Intersection

![Alt text](/images/example1.png?raw=true "Union, Difference, Intersection")

```javascript

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

```
### Example 2 - For loop

![Alt text](/images/example2.png?raw=true "For loop")

```javascript

for(let i = -5; i<5; i++){
  for (let j=-5; j<5; j++){
    let cube = Cube(3,10,3);
    cube.translate(i*10,0,j*10);
  }
}

```

### Example 3 -  OpenSCAD Style 

You can also design "as in" OpenSCAD. It is not OpenSCAD language, but it is the same coding style.

```javascript

//Union of several objects
Union(
  Cube(1,1,1),
  Cylinder(0.2,2)  
);

//Translation of several objetcs (x=2, y=3, z=1)
Translate([2,3,1],
  Cube(1,1,1),
  Cylinder(0.2,2)  
);

//Composed operations (translation of the union)
Translate([2,3,1],
  Union(
    Cube(1,1,1),
    Cylinder(0.2,2)  
  )
);

```
