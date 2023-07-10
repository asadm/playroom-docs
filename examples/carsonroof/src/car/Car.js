import * as THREE from 'three'
export default class Car {
  constructor(_options) {
    // Options
    this.time = _options.time
    this.physics = _options.physics
    // Set up
    this.container = new THREE.Object3D()
    this.position = new THREE.Vector3()
    this.setMovement()
    this.setChassis(_options.chassisObject)
    this.setWheels(_options.wheelObject)
  }

  setMovement() {
    this.movement = {}
    this.movement.speed = new THREE.Vector3()
    this.movement.localSpeed = new THREE.Vector3()
    this.movement.acceleration = new THREE.Vector3()
    this.movement.localAcceleration = new THREE.Vector3()

    // Time tick
    this.time.on('tick', () => {
      // Movement
      const movementSpeed = new THREE.Vector3()
      movementSpeed.copy(this.chassis.object.position).sub(this.chassis.oldPosition)
      this.movement.acceleration = movementSpeed.clone().sub(this.movement.speed)
      this.movement.speed.copy(movementSpeed)
      // console.log(this.movement.localSpeed)
      this.movement.localSpeed = this.movement.speed.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), - this.chassis.object.rotation.z)
      this.movement.localAcceleration = this.movement.acceleration.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), - this.chassis.object.rotation.z)
      if (this.movement.localAcceleration.x > 0.01) {
        // this.sounds.play('screech')
      }
    })
  }

  setChassis(object) {
    this.chassis = {}
    this.chassis.offset = new THREE.Vector3(0, 0, - 0.28)
    this.chassis.object = object;
    this.chassis.object.position.copy(this.physics.car.chassis.body.position)
    this.chassis.oldPosition = this.chassis.object.position.clone()
    this.container.add(this.chassis.object)

    // Time tick
    this.time.on('tick', () => {
      // Save old position for movement calculation
      this.chassis.oldPosition = this.chassis.object.position.clone()

      this.chassis.object.position.copy(this.physics.car.chassis.body.position).add(this.chassis.offset)
      this.chassis.object.quaternion.copy(this.physics.car.chassis.body.quaternion)

      // Update position
      this.position.copy(this.chassis.object.position)
    })
  }


  setWheels(object) {
    this.wheels = {}
    this.wheels.object = object;
    this.wheels.items = []

    for (let i = 0; i < 4; i++) {
      const object = this.wheels.object.clone()

      this.wheels.items.push(object)
      this.container.add(object)
    }

    // Time tick
    this.time.on('tick', () => {
      for (const _wheelKey in this.physics.car.wheels.bodies) {
        const wheelBody = this.physics.car.wheels.bodies[_wheelKey]
        const wheelObject = this.wheels.items[_wheelKey]

        wheelObject.position.copy(wheelBody.position)
        wheelObject.quaternion.copy(wheelBody.quaternion)
      }
    })
  }
}
