import * as THREE from 'three'
import Physics from './Physics.js'
import Car from './Car.js'

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
    const pos = this.physics.car.chassis.body.position
    // round to 3 decimal places
    return ({
      x: Math.round(pos.x * 1000) / 1000,
      y: Math.round(pos.y * 1000) / 1000,
      z: Math.round(pos.z * 1000) / 1000
    });
  }

  setPos(pos) {
    this.physics.car.chassis.body.position.set(pos.x, pos.y, pos.z)
  }

  quaternion() {
    const quaternion = this.physics.car.chassis.body.quaternion
    // round to 3 decimal places
    return {
      x: Math.round(quaternion.x * 1000) / 1000,
      y: Math.round(quaternion.y * 1000) / 1000,
      z: Math.round(quaternion.z * 1000) / 1000,
      w: Math.round(quaternion.w * 1000) / 1000
    }
  }

  setQuaternion(quaternion) {
    this.physics.car.chassis.body.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w)
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
