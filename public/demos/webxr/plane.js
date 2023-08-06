// import * as THREE from "three";
THREE = window.__THREE__;
var Colors = {
  red:0xf25346,
  white:0xd8d0d1,
  pink:0xF5986E,
  brown:0x59332e,
  brownDark:0x23190f,
  blue:0x68c3c0,
};

function normalize(v, vmin, vmax, tmin, tmax) {
  var nv = Math.max(Math.min(v, vmax), vmin);
  var dv = vmax - vmin;
  var pc = (nv - vmin) / dv;
  var dt = tmax - tmin;
  var tv = tmin + pc * dt;
  return tv;
}

// class Pilot {
//   constructor() {
//     this.mesh = new THREE.Object3D();
//     this.mesh.name = "pilot";
//     this.angleHairs = 0;

//     var bodyGeom = new THREE.BoxGeometry(15, 15, 15);
//     var bodyMat = new THREE.MeshPhongMaterial({ color: Colors.brown,  });
//     var body = new THREE.Mesh(bodyGeom, bodyMat);
//     body.position.set(2, -12, 0);

//     this.mesh.add(body);

//     var faceGeom = new THREE.BoxGeometry(10, 10, 10);
//     var faceMat = new THREE.MeshLambertMaterial({ color: Colors.pink });
//     var face = new THREE.Mesh(faceGeom, faceMat);
//     this.mesh.add(face);

//     var hairGeom = new THREE.BoxGeometry(4, 4, 4);
//     var hairMat = new THREE.MeshLambertMaterial({ color: Colors.brown });
//     var hair = new THREE.Mesh(hairGeom, hairMat);
//     hair.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 2, 0));
//     var hairs = new THREE.Object3D();

//     this.hairsTop = new THREE.Object3D();

//     for (var i = 0; i < 12; i++) {
//       var h = hair.clone();
//       var col = i % 3;
//       var row = Math.floor(i / 3);
//       var startPosZ = -4;
//       var startPosX = -4;
//       h.position.set(startPosX + row * 4, 0, startPosZ + col * 4);
//       this.hairsTop.add(h);
//     }
//     hairs.add(this.hairsTop);

//     var hairSideGeom = new THREE.BoxGeometry(12, 4, 2);
//     hairSideGeom.applyMatrix(new THREE.Matrix4().makeTranslation(-6, 0, 0));
//     var hairSideR = new THREE.Mesh(hairSideGeom, hairMat);
//     var hairSideL = hairSideR.clone();
//     hairSideR.position.set(8, -2, 6);
//     hairSideL.position.set(8, -2, -6);
//     hairs.add(hairSideR);
//     hairs.add(hairSideL);

//     var hairBackGeom = new THREE.BoxGeometry(2, 8, 10);
//     var hairBack = new THREE.Mesh(hairBackGeom, hairMat);
//     hairBack.position.set(-1, -4, 0);
//     hairs.add(hairBack);
//     hairs.position.set(-5, 5, 0);

//     this.mesh.add(hairs);

//     var glassGeom = new THREE.BoxGeometry(5, 5, 5);
//     var glassMat = new THREE.MeshLambertMaterial({ color: Colors.brown });
//     var glassR = new THREE.Mesh(glassGeom, glassMat);
//     glassR.position.set(6, 0, 3);
//     var glassL = glassR.clone();
//     glassL.position.z = -glassR.position.z;

//     var glassAGeom = new THREE.BoxGeometry(11, 1, 11);
//     var glassA = new THREE.Mesh(glassAGeom, glassMat);
//     this.mesh.add(glassR);
//     this.mesh.add(glassL);
//     this.mesh.add(glassA);

//     var earGeom = new THREE.BoxGeometry(2, 3, 2);
//     var earL = new THREE.Mesh(earGeom, faceMat);
//     earL.position.set(0, 0, -6);
//     var earR = earL.clone();
//     earR.position.set(0, 0, 6);
//     this.mesh.add(earL);
//     this.mesh.add(earR);
//   }
//   updateHairs() {
//     var hairs = this.hairsTop.children;

//     var l = hairs.length;
//     for (var i = 0; i < l; i++) {
//       var h = hairs[i];
//       h.scale.y = .75 + Math.cos(this.angleHairs + i / 3) * .25;
//     }
//     this.angleHairs += 0.16;
//   }
// }



class AirPlane {
  constructor(color) {
    this.mesh = new THREE.Object3D();
    this.mesh.name = "airPlane";

    // Create the cabin
    var geomCockpit = new THREE.BoxGeometry(60, 50, 50, 1, 1, 1);
    var matCockpit = new THREE.MeshPhongMaterial({
      color,
    });
    var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
    cockpit.castShadow = true;
    cockpit.receiveShadow = true;
    this.mesh.add(cockpit);

    // Create Engine
    var geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);
    var matEngine = new THREE.MeshPhongMaterial({
      color: Colors.white,
    });
    var engine = new THREE.Mesh(geomEngine, matEngine);
    engine.position.x = 40;
    engine.castShadow = true;
    engine.receiveShadow = true;
    this.mesh.add(engine);

    // Create Tailplane
    var geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
    var matTailPlane = new THREE.MeshPhongMaterial({
      color,
      
    });
    var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
    tailPlane.position.set(-35, 25, 0);
    tailPlane.castShadow = true;
    tailPlane.receiveShadow = true;
    this.mesh.add(tailPlane);

    // Create Wing
    var geomSideWing = new THREE.BoxGeometry(40, 8, 150, 1, 1, 1);
    var matSideWing = new THREE.MeshPhongMaterial({
      color,
      
    });
    var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
    sideWing.position.set(0, 0, 0);
    sideWing.castShadow = true;
    sideWing.receiveShadow = true;
    this.mesh.add(sideWing);

    // Propeller
    var geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
    var matPropeller = new THREE.MeshPhongMaterial({
      color: Colors.brown,
      
    });
    this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
    this.propeller.castShadow = true;
    this.propeller.receiveShadow = true;

    // Blades
    var geomBlade = new THREE.BoxGeometry(1, 100, 20, 1, 1, 1);
    var matBlade = new THREE.MeshPhongMaterial({
      color: Colors.brownDark,
      
    });

    var blade = new THREE.Mesh(geomBlade, matBlade);
    blade.position.set(8, 0, 0);
    blade.castShadow = true;
    blade.receiveShadow = true;
    this.propeller.add(blade);
    this.propeller.position.set(50, 0, 0);
    this.mesh.add(this.propeller);
  }
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function createPlane(scene, color = 0xFF0000){
  const airplane = new AirPlane(color);
  airplane.mesh.scale.set(.005,.005,.005);
  airplane.mesh.position.y = randomBetween(1,2);
  airplane.mesh.position.x = randomBetween(-2, 2);
  airplane.mesh.position.z = randomBetween(-2, 2);
  scene.add(airplane.mesh);
  // return {airplane, updatePlane: (pos)=>updatePlane(airplane, pos)};
  return airplane;
}

function updatePlane(airplane, pos) {
  var targetY = normalize(pos.y, -0.75, 0.75, 25, 175);
  var targetX = normalize(pos.x, -0.75, 0.75, -100, 100);
  airplane.mesh.position.y = targetY;
  airplane.mesh.position.x = targetX;
  airplane.propeller.rotation.x += 0.3;
}
