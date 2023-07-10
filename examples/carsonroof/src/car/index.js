import * as THREE from 'three'
import Physics from './Physics.js'
import Car from './Car.js'

function roundOffPos(pos){
  return {
    x: Math.round(pos.x * 1000) / 1000,
    y: Math.round(pos.y * 1000) / 1000,
    z: Math.round(pos.z * 1000) / 1000
  }
}

function roundOffQuat(quat){
  return {
    x: Math.round(quat.x * 1000) / 1000,
    y: Math.round(quat.y * 1000) / 1000,
    z: Math.round(quat.z * 1000) / 1000,
    w: Math.round(quat.w * 1000) / 1000
  }
}

export default class {
  constructor({ initialPos, debug, time, physicsWorld, controls, chassisObject, wheelObject }) {
    // Options
    this.debug = debug
    this.time = time
    this.physicsWorld = physicsWorld
    this.controls = controls
    this.chassisObject = chassisObject
    this.wheelObject = wheelObject

    // Debug
    if (this.debug) {
      this.debugFolder = this.debug.addFolder('world')
      this.debugFolder.open()
    }

    // Set up
    this.container = new THREE.Object3D()
    this.container.matrixAutoUpdate = false

    this.setPhysics()
    this.setCar()
    this.initCar(initialPos);
  }

  initCar(pos) {
    // Car
    this.physics.car.chassis.body.sleep()
    this.physics.car.chassis.body.position.set(pos.x, pos.y, pos.z)

    window.setTimeout(() => {
      this.physics.car.chassis.body.wakeUp()
    }, 300)
  }

  pos() {
    return [
      roundOffPos(this.physics.car.chassis.body.position),
      roundOffPos(this.physics.car.wheels.bodies[0].position),
      roundOffPos(this.physics.car.wheels.bodies[1].position),
      roundOffPos(this.physics.car.wheels.bodies[2].position),
      roundOffPos(this.physics.car.wheels.bodies[3].position),
    ];
  }

  setPos(posArray) {
    this.physics.car.chassis.body.position.set(posArray[0].x, posArray[0].y, posArray[0].z);
    this.physics.car.wheels.bodies[0].position.set(posArray[1].x, posArray[1].y, posArray[1].z);
    this.physics.car.wheels.bodies[1].position.set(posArray[2].x, posArray[2].y, posArray[2].z);
    this.physics.car.wheels.bodies[2].position.set(posArray[3].x, posArray[3].y, posArray[3].z);
    this.physics.car.wheels.bodies[3].position.set(posArray[4].x, posArray[4].y, posArray[4].z);
  }

  quaternion() {
    return [
      roundOffQuat(this.physics.car.chassis.body.quaternion),
      roundOffQuat(this.physics.car.wheels.bodies[0].quaternion),
      roundOffQuat(this.physics.car.wheels.bodies[1].quaternion),
      roundOffQuat(this.physics.car.wheels.bodies[2].quaternion),
      roundOffQuat(this.physics.car.wheels.bodies[3].quaternion),
    ]
  }

  setQuaternion(quaternionArray) {
    this.physics.car.chassis.body.quaternion.set(quaternionArray[0].x, quaternionArray[0].y, quaternionArray[0].z, quaternionArray[0].w);
    this.physics.car.wheels.bodies[0].quaternion.set(quaternionArray[1].x, quaternionArray[1].y, quaternionArray[1].z, quaternionArray[1].w);
    this.physics.car.wheels.bodies[1].quaternion.set(quaternionArray[2].x, quaternionArray[2].y, quaternionArray[2].z, quaternionArray[2].w);
    this.physics.car.wheels.bodies[2].quaternion.set(quaternionArray[3].x, quaternionArray[3].y, quaternionArray[3].z, quaternionArray[3].w);
    this.physics.car.wheels.bodies[3].quaternion.set(quaternionArray[4].x, quaternionArray[4].y, quaternionArray[4].z, quaternionArray[4].w);
  }

  setPhysics() {
    this.physics = new Physics({
      debug: this.debug,
      time: this.time,
      controls: this.controls,
      world: this.physicsWorld,
    })

    this.container.add(this.physics.models.container)
  }
  setCar() {
    this.car = new Car({
      time: this.time,
      physics: this.physics,
      chassisObject: this.chassisObject,
      wheelObject: this.wheelObject,
    })
    this.container.add(this.car.container)
  }

  destroy() {
    this.physics.destroy();
  }
}
