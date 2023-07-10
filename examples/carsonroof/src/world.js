import * as THREE from 'three';
import * as CANNON from 'cannon';
import shape2mesh from "./utils/shape2mesh";

export default function createWorld(scene, PhysicsWorld, width = 20){
  const floor = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Box(new CANNON.Vec3(width, width, 100)),
  })
  floor.position.set(0, 0, -100);
  const floorMesh = shape2mesh(floor, new THREE.MeshPhongMaterial({ color: "gray" }));
  PhysicsWorld.addBody(floor);
  scene.add(floorMesh);

  // create walls around the plane geometry
  const wall1 = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Box(new CANNON.Vec3(width, 0.1, 0.3)),
  })
  wall1.position.set(0, width, 0);
  const wall1Mesh = shape2mesh(wall1, new THREE.MeshPhongMaterial({ color: "gray" }));
  PhysicsWorld.addBody(wall1);
  scene.add(wall1Mesh);

  const wall2 = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Box(new CANNON.Vec3(width, 0.1, 0.3)),
  })
  wall2.position.set(0, -width, 0);
  const wall2Mesh = shape2mesh(wall2, new THREE.MeshPhongMaterial({ color: "gray" }));
  PhysicsWorld.addBody(wall2);
  scene.add(wall2Mesh);

  const wall3 = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Box(new CANNON.Vec3(0.1, width, 0.3)),
  })
  wall3.position.set(width, 0, 0);
  const wall3Mesh = shape2mesh(wall3, new THREE.MeshPhongMaterial({ color: "gray" }));
  PhysicsWorld.addBody(wall3);
  scene.add(wall3Mesh);

  const wall4 = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Box(new CANNON.Vec3(0.1, width, 0.3)),
  })
  wall4.position.set(-width, 0, 0);
  const wall4Mesh = shape2mesh(wall4, new THREE.MeshPhongMaterial({ color: "gray" }));
  PhysicsWorld.addBody(wall4);
  scene.add(wall4Mesh);
}