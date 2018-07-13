# OOML.js
Object Oriented Modelling Language. It is built upon [Three.js](https://threejs.org/). It uses [THREE.STLExpoerter](https://www.npmjs.com/package/three-stlexporter) to generate STL files. Editor is [Monaco-editor](https://github.com/Microsoft/monaco-editor/). 

Check the rest of dependencies on [package.json file](./package.json)

## LICENSE
[MIT License](https://opensource.org/licenses/MIT)



## How to run

    npm install
    npm run dev

## OOML.js code samples

### Example 1

![Alt text](/images/example1.png?raw=true "Union, Difference, Intersection")

```javascript

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

```
### Example 1

![Alt text](/images/example2.png?raw=true "For loop")

```javascript

for(let i = -5; i<5; i++){
  for (let j=-5; j<5; j++){
    let cube = Cube(0.03,0.03,0.1);
    cube.translate(i/10,j/10,0);
    OOMLScene.push(cube);
  }
}

```
