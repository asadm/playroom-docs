import * as CANNON from 'cannon';
import * as THREE from 'three'

export default class Physics {
  constructor(_options) {
    this.debug = _options.debug
    this.time = _options.time
    this.controls = _options.controls

    // Set up
    if (this.debug) {
      this.debugFolder = this.debug.addFolder('physics')
    }
    this.world = _options.world;
    this.setWorld()
    this.setModels()
    this.setCar()
  }

  destroy(){
    this.car.destroy()
  }

  setWorld() {
    this.world.gravity.set(0, 0, - 3.25)
    this.world.allowSleep = true
    this.world.defaultContactMaterial.friction = 0
    this.world.defaultContactMaterial.restitution = 0.2

    // Debug
    if (this.debug) {
      this.debugFolder.add(this.world.gravity, 'z').step(0.001).min(- 20).max(20).name('gravity')
    }
  }

  setModels() {
    this.models = {}
    this.models.container = new THREE.Object3D()
    this.models.container.visible = false
    this.models.materials = {}
    this.models.materials.static = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true })
    this.models.materials.dynamic = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
    this.models.materials.dynamicSleeping = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true })

    // Debug
    if (this.debug) {
      this.debugFolder.add(this.models.container, 'visible').name('modelsVisible')
    }
  }

  setCar() {
    this.car = {}

    this.car.steering = 0
    this.car.accelerating = 0
    this.car.speed = 0
    this.car.worldForward = new CANNON.Vec3()
    this.car.angle = 0
    this.car.forwardSpeed = 0
    this.car.oldPosition = new CANNON.Vec3()
    this.car.goingForward = true

    /**
     * Options
     */
    this.car.options = {}
    this.car.options.chassisWidth = 1.02
    this.car.options.chassisHeight = 1.16
    this.car.options.chassisDepth = 2.03
    this.car.options.chassisOffset = new CANNON.Vec3(0, 0, 0.41)
    this.car.options.chassisMass = 20
    this.car.options.wheelFrontOffsetDepth = 0.635
    this.car.options.wheelBackOffsetDepth = - 0.475
    this.car.options.wheelOffsetWidth = 0.39
    this.car.options.wheelRadius = 0.25
    this.car.options.wheelHeight = 0.24
    this.car.options.wheelSuspensionStiffness = 25
    this.car.options.wheelSuspensionRestLength = 0.1
    this.car.options.wheelFrictionSlip = 5
    this.car.options.wheelDampingRelaxation = 1.8
    this.car.options.wheelDampingCompression = 1.5
    this.car.options.wheelMaxSuspensionForce = 100000
    this.car.options.wheelRollInfluence = 0.01
    this.car.options.wheelMaxSuspensionTravel = 0.3
    this.car.options.wheelCustomSlidingRotationalSpeed = - 30
    this.car.options.wheelMass = 5
    this.car.options.controlsSteeringSpeed = 0.005
    this.car.options.controlsSteeringMax = Math.PI * 0.17
    this.car.options.controlsSteeringQuad = false
    this.car.options.controlsAcceleratinMaxSpeed = 0.055
    this.car.options.controlsAcceleratinMaxSpeedBoost = 0.11
    this.car.options.controlsAcceleratingSpeed = 2
    this.car.options.controlsAcceleratingSpeedBoost = 3.5
    this.car.options.controlsAcceleratingQuad = true
    this.car.options.controlsBrakeStrength = 0.45

    /**
     * Upsize down
     */
    this.car.upsideDown = {}
    this.car.upsideDown.state = 'watching' // 'wathing' | 'pending' | 'turning'
    this.car.upsideDown.pendingTimeout = null
    this.car.upsideDown.turningTimeout = null

    /**
     * Jump
     */
    this.car.jump = (_toReturn = true, _strength = 60) => {
      let worldPosition = this.car.chassis.body.position
      worldPosition = worldPosition.vadd(new CANNON.Vec3(_toReturn ? 0.08 : 0, 0, 0))
      this.car.chassis.body.applyImpulse(new CANNON.Vec3(0, 0, _strength), worldPosition)
    }

    /**
     * Create method
     */
    this.car.create = () => {
      /**
       * Chassis
       */
      this.car.chassis = {}

      this.car.chassis.shape = new CANNON.Box(new CANNON.Vec3(this.car.options.chassisDepth * 0.5, this.car.options.chassisWidth * 0.5, this.car.options.chassisHeight * 0.5))

      this.car.chassis.body = new CANNON.Body({ mass: this.car.options.chassisMass })
      this.car.chassis.body.allowSleep = false
      this.car.chassis.body.position.set(0, 0, 12)
      this.car.chassis.body.sleep()
      this.car.chassis.body.addShape(this.car.chassis.shape, this.car.options.chassisOffset)
      this.car.chassis.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), - Math.PI * 0.5)

      /**
       * Vehicle
       */
      this.car.vehicle = new CANNON.RaycastVehicle({
        chassisBody: this.car.chassis.body
      })

      /**
       * Wheel
       */
      this.car.wheels = {}
      this.car.wheels.options = {
        radius: this.car.options.wheelRadius,
        height: this.car.options.wheelHeight,
        suspensionStiffness: this.car.options.wheelSuspensionStiffness,
        suspensionRestLength: this.car.options.wheelSuspensionRestLength,
        frictionSlip: this.car.options.wheelFrictionSlip,
        dampingRelaxation: this.car.options.wheelDampingRelaxation,
        dampingCompression: this.car.options.wheelDampingCompression,
        maxSuspensionForce: this.car.options.wheelMaxSuspensionForce,
        rollInfluence: this.car.options.wheelRollInfluence,
        maxSuspensionTravel: this.car.options.wheelMaxSuspensionTravel,
        customSlidingRotationalSpeed: this.car.options.wheelCustomSlidingRotationalSpeed,
        useCustomSlidingRotationalSpeed: true,
        directionLocal: new CANNON.Vec3(0, 0, - 1),
        axleLocal: new CANNON.Vec3(0, 1, 0),
        chassisConnectionPointLocal: new CANNON.Vec3(1, 1, 0) // Will be changed for each wheel
      }

      // Front left
      this.car.wheels.options.chassisConnectionPointLocal.set(this.car.options.wheelFrontOffsetDepth, this.car.options.wheelOffsetWidth, 0)
      this.car.vehicle.addWheel(this.car.wheels.options)

      // Front right
      this.car.wheels.options.chassisConnectionPointLocal.set(this.car.options.wheelFrontOffsetDepth, - this.car.options.wheelOffsetWidth, 0)
      this.car.vehicle.addWheel(this.car.wheels.options)

      // Back left
      this.car.wheels.options.chassisConnectionPointLocal.set(this.car.options.wheelBackOffsetDepth, this.car.options.wheelOffsetWidth, 0)
      this.car.vehicle.addWheel(this.car.wheels.options)

      // Back right
      this.car.wheels.options.chassisConnectionPointLocal.set(this.car.options.wheelBackOffsetDepth, - this.car.options.wheelOffsetWidth, 0)
      this.car.vehicle.addWheel(this.car.wheels.options)

      this.car.vehicle.addToWorld(this.world)

      this.car.wheels.indexes = {}

      this.car.wheels.indexes.frontLeft = 0
      this.car.wheels.indexes.frontRight = 1
      this.car.wheels.indexes.backLeft = 2
      this.car.wheels.indexes.backRight = 3
      this.car.wheels.bodies = []

      for (const _wheelInfos of this.car.vehicle.wheelInfos) {
        const shape = new CANNON.Cylinder(_wheelInfos.radius, _wheelInfos.radius, this.car.wheels.options.height, 20)
        const body = new CANNON.Body({ mass: this.car.options.wheelMass })
        const quaternion = new CANNON.Quaternion()
        quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2)

        body.type = CANNON.Body.KINEMATIC

        body.addShape(shape, new CANNON.Vec3(), quaternion)
        this.car.wheels.bodies.push(body)
      }

      /**
       * Model
       */
      this.car.model = {}
      this.car.model.container = new THREE.Object3D()
      this.models.container.add(this.car.model.container)

      this.car.model.material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })

      this.car.model.chassis = new THREE.Mesh(new THREE.BoxGeometry(this.car.options.chassisDepth, this.car.options.chassisWidth, this.car.options.chassisHeight), this.car.model.material)
      this.car.model.container.add(this.car.model.chassis)

      this.car.model.wheels = []

      const wheelGeometry = new THREE.CylinderGeometry(this.car.options.wheelRadius, this.car.options.wheelRadius, this.car.options.wheelHeight, 8, 1)

      for (let i = 0; i < 4; i++) {
        const wheel = new THREE.Mesh(wheelGeometry, this.car.model.material)
        this.car.model.container.add(wheel)
        this.car.model.wheels.push(wheel)
      }
    }

    /**
     * Destroy method
     */
    this.car.destroy = () => {
      this.car.vehicle.removeFromWorld(this.world)
      this.models.container.remove(this.car.model.container)
    }

    /**
     * Recreate method
     */
    this.car.recreate = () => {
      this.car.destroy()
      this.car.create()
      this.car.chassis.body.wakeUp()
    }

    /**
     * Brake
     */
    this.car.brake = () => {
      this.car.vehicle.setBrake(1, 0)
      this.car.vehicle.setBrake(1, 1)
      this.car.vehicle.setBrake(1, 2)
      this.car.vehicle.setBrake(1, 3)
    }

    /**
     * Unbrake
     */
    this.car.unbrake = () => {
      this.car.vehicle.setBrake(0, 0)
      this.car.vehicle.setBrake(0, 1)
      this.car.vehicle.setBrake(0, 2)
      this.car.vehicle.setBrake(0, 3)
    }

    /**
     * Cannon tick
     */
    this.world.addEventListener('postStep', () => {
      // Update speed
      let positionDelta = new CANNON.Vec3()
      positionDelta = positionDelta.copy(this.car.chassis.body.position)
      positionDelta = positionDelta.vsub(this.car.oldPosition)

      this.car.oldPosition.copy(this.car.chassis.body.position)
      this.car.speed = positionDelta.length()

      // Update forward
      const localForward = new CANNON.Vec3(1, 0, 0)
      this.car.chassis.body.vectorToWorldFrame(localForward, this.car.worldForward)
      this.car.angle = Math.atan2(this.car.worldForward.y, this.car.worldForward.x)

      this.car.forwardSpeed = this.car.worldForward.dot(positionDelta)
      this.car.goingForward = this.car.forwardSpeed > 0

      // Updise down
      const localUp = new CANNON.Vec3(0, 0, 1)
      const worldUp = new CANNON.Vec3()
      this.car.chassis.body.vectorToWorldFrame(localUp, worldUp)

      if (worldUp.dot(localUp) < 0.5) {
        if (this.car.upsideDown.state === 'watching') {
          this.car.upsideDown.state = 'pending'
          this.car.upsideDown.pendingTimeout = window.setTimeout(() => {
            this.car.upsideDown.state = 'turning'
            this.car.jump(true)

            this.car.upsideDown.turningTimeout = window.setTimeout(() => {
              this.car.upsideDown.state = 'watching'
            }, 1000)
          }, 1000)
        }
      }
      else {
        if (this.car.upsideDown.state === 'pending') {
          this.car.upsideDown.state = 'watching'
          window.clearTimeout(this.car.upsideDown.pendingTimeout)
        }
      }

      // Update wheel bodies
      for (let i = 0; i < this.car.vehicle.wheelInfos.length; i++) {
        this.car.vehicle.updateWheelTransform(i)

        const transform = this.car.vehicle.wheelInfos[i].worldTransform
        this.car.wheels.bodies[i].position.copy(transform.position)
        this.car.wheels.bodies[i].quaternion.copy(transform.quaternion)

        // Rotate the wheels on the right
        if (i === 1 || i === 3) {
          const rotationQuaternion = new CANNON.Quaternion(0, 0, 0, 1)
          rotationQuaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), Math.PI)
          this.car.wheels.bodies[i].quaternion = this.car.wheels.bodies[i].quaternion.mult(rotationQuaternion)
        }
      }

      // Slow down back
      if (!this.controls.isJoystickPressed() && !this.controls.isPressed('down')) {
        let slowDownForce = this.car.worldForward.clone()

        if (this.car.goingForward) {
          slowDownForce = slowDownForce.negate()
        }

        slowDownForce = slowDownForce.scale(this.car.chassis.body.velocity.length() * 0.1)

        this.car.chassis.body.applyImpulse(slowDownForce, this.car.chassis.body.position)
      }
    })

    /**
     * Time tick
     */
    this.time.on('tick', () => {
      /**
       * Body
       */
      // Update chassis model
      this.car.model.chassis.position.copy(this.car.chassis.body.position).add(this.car.options.chassisOffset)
      this.car.model.chassis.quaternion.copy(this.car.chassis.body.quaternion)

      // Update wheel models
      for (const _wheelKey in this.car.wheels.bodies) {
        const wheelBody = this.car.wheels.bodies[_wheelKey]
        const wheelMesh = this.car.model.wheels[_wheelKey]

        wheelMesh.position.copy(wheelBody.position)
        wheelMesh.quaternion.copy(wheelBody.quaternion)
      }

      /**
       * Steering
       */
      let deltaAngle = 0

      if (this.controls.angle()) {
        // Calculate delta between joystick and car angles
        deltaAngle = (this.controls.angle() - this.car.angle + Math.PI) % (Math.PI * 2) - Math.PI
        deltaAngle = deltaAngle < - Math.PI ? deltaAngle + Math.PI * 2 : deltaAngle
      }

      // Update steering directly
      const goingForward = Math.abs(this.car.forwardSpeed) < 0.01 ? true : this.car.goingForward
      this.car.steering = deltaAngle * (goingForward ? - 1 : 1)

      // Clamp steer
      if (Math.abs(this.car.steering) > this.car.options.controlsSteeringMax) {
        this.car.steering = Math.sign(this.car.steering) * this.car.options.controlsSteeringMax
      }
      
      // Update wheels
      this.car.vehicle.setSteeringValue(- this.car.steering, this.car.wheels.indexes.frontLeft)
      this.car.vehicle.setSteeringValue(- this.car.steering, this.car.wheels.indexes.frontRight)

      if (this.car.options.controlsSteeringQuad) {
        this.car.vehicle.setSteeringValue(this.car.steering, this.car.wheels.indexes.backLeft)
        this.car.vehicle.setSteeringValue(this.car.steering, this.car.wheels.indexes.backRight)
      }

      /**
       * Accelerate
       */
      const accelerationSpeed = this.controls.isPressed('boost') ? this.car.options.controlsAcceleratingSpeedBoost : this.car.options.controlsAcceleratingSpeed
      const accelerateStrength = this.time.delta * accelerationSpeed
      const controlsAcceleratinMaxSpeed = this.controls.isPressed('boost') ? this.car.options.controlsAcceleratinMaxSpeedBoost : this.car.options.controlsAcceleratinMaxSpeed

      // Accelerate up
      if (this.controls.isJoystickPressed() && !this.controls.isPressed('down')) {
        if (this.car.speed < controlsAcceleratinMaxSpeed || !this.car.goingForward) {
          this.car.accelerating = accelerateStrength
        }
        else {
          this.car.accelerating = 0
        }
      }

      // Accelerate Down
      else if (this.controls.isPressed('down')) {
        if (this.car.speed < controlsAcceleratinMaxSpeed || this.car.goingForward) {
          this.car.accelerating = - accelerateStrength
        }
        else {
          this.car.accelerating = 0
        }
      }
      else {
        this.car.accelerating = 0
      }

      this.car.vehicle.applyEngineForce(- this.car.accelerating, this.car.wheels.indexes.backLeft)
      this.car.vehicle.applyEngineForce(- this.car.accelerating, this.car.wheels.indexes.backRight)

      if (this.car.options.controlsSteeringQuad) {
        this.car.vehicle.applyEngineForce(- this.car.accelerating, this.car.wheels.indexes.frontLeft)
        this.car.vehicle.applyEngineForce(- this.car.accelerating, this.car.wheels.indexes.frontRight)
      }

      /**
       * Brake
       */
      if (this.controls.isPressed('brake')) {
        this.car.vehicle.setBrake(this.car.options.controlsBrakeStrength, 0)
        this.car.vehicle.setBrake(this.car.options.controlsBrakeStrength, 1)
        this.car.vehicle.setBrake(this.car.options.controlsBrakeStrength, 2)
        this.car.vehicle.setBrake(this.car.options.controlsBrakeStrength, 3)
      }
      else {
        this.car.vehicle.setBrake(0, 0)
        this.car.vehicle.setBrake(0, 1)
        this.car.vehicle.setBrake(0, 2)
        this.car.vehicle.setBrake(0, 3)
      }
    })

    // Create the initial car
    this.car.create()

    // Debug
    if (this.debug) {
      this.car.debugFolder = this.debugFolder.addFolder('car')
      this.car.debugFolder.open()

      this.car.debugFolder.add(this.car.options, 'chassisWidth').step(0.001).min(0).max(5).name('chassisWidth').onFinishChange(this.car.recreate)
      this.car.debugFolder.add(this.car.options, 'chassisHeight').step(0.001).min(0).max(5).name('chassisHeight').onFinishChange(this.car.recreate)
      this.car.debugFolder.add(this.car.options, 'chassisDepth').step(0.001).min(0).max(5).name('chassisDepth').onFinishChange(this.car.recreate)
      this.car.debugFolder.add(this.car.options.chassisOffset, 'z').step(0.001).min(0).max(5).name('chassisOffset').onFinishChange(this.car.recreate)
      this.car.debugFolder.add(this.car.options, 'chassisMass').step(0.001).min(0).max(1000).name('chassisMass').onFinishChange(this.car.recreate)
      this.car.debugFolder.add(this.car.options, 'wheelFrontOffsetDepth').step(0.001).min(0).max(5).name('wheelFrontOffsetDepth').onFinishChange(this.car.recreate)
      this.car.debugFolder.add(this.car.options, 'wheelBackOffsetDepth').step(0.001).min(- 5).max(0).name('wheelBackOffsetDepth').onFinishChange(this.car.recreate)
      this.car.debugFolder.add(this.car.options, 'wheelOffsetWidth').step(0.001).min(0).max(5).name('wheelOffsetWidth').onFinishChange(this.car.recreate)
      this.car.debugFolder.add(this.car.options, 'wheelRadius').step(0.001).min(0).max(2).name('wheelRadius').onFinishChange(this.car.recreate)
      this.car.debugFolder.add(this.car.options, 'wheelHeight').step(0.001).min(0).max(2).name('wheelHeight').onFinishChange(this.car.recreate)
      this.car.debugFolder.add(this.car.options, 'wheelSuspensionStiffness').step(0.001).min(0).max(300).name('wheelSuspensionStiffness').onFinishChange(this.car.recreate)
      this.car.debugFolder.add(this.car.options, 'wheelSuspensionRestLength').step(0.001).min(0).max(5).name('wheelSuspensionRestLength').onFinishChange(this.car.recreate)
      this.car.debugFolder.add(this.car.options, 'wheelFrictionSlip').step(0.001).min(0).max(30).name('wheelFrictionSlip').onFinishChange(this.car.recreate)
      this.car.debugFolder.add(this.car.options, 'wheelDampingRelaxation').step(0.001).min(0).max(30).name('wheelDampingRelaxation').onFinishChange(this.car.recreate)
      this.car.debugFolder.add(this.car.options, 'wheelDampingCompression').step(0.001).min(0).max(30).name('wheelDampingCompression').onFinishChange(this.car.recreate)
      this.car.debugFolder.add(this.car.options, 'wheelMaxSuspensionForce').step(0.001).min(0).max(1000000).name('wheelMaxSuspensionForce').onFinishChange(this.car.recreate)
      this.car.debugFolder.add(this.car.options, 'wheelRollInfluence').step(0.001).min(0).max(1).name('wheelRollInfluence').onFinishChange(this.car.recreate)
      this.car.debugFolder.add(this.car.options, 'wheelMaxSuspensionTravel').step(0.001).min(0).max(5).name('wheelMaxSuspensionTravel').onFinishChange(this.car.recreate)
      this.car.debugFolder.add(this.car.options, 'wheelCustomSlidingRotationalSpeed').step(0.001).min(- 45).max(45).name('wheelCustomSlidingRotationalSpeed').onFinishChange(this.car.recreate)
      this.car.debugFolder.add(this.car.options, 'wheelMass').step(0.001).min(0).max(1000).name('wheelMass').onFinishChange(this.car.recreate)
      this.car.debugFolder.add(this.car.options, 'controlsSteeringSpeed').step(0.001).min(0).max(0.1).name('controlsSteeringSpeed')
      this.car.debugFolder.add(this.car.options, 'controlsSteeringMax').step(0.001).min(0).max(Math.PI * 0.5).name('controlsSteeringMax')
      this.car.debugFolder.add(this.car.options, 'controlsSteeringQuad').name('controlsSteeringQuad')
      this.car.debugFolder.add(this.car.options, 'controlsAcceleratingSpeed').step(0.001).min(0).max(30).name('controlsAcceleratingSpeed')
      this.car.debugFolder.add(this.car.options, 'controlsAcceleratingSpeedBoost').step(0.001).min(0).max(30).name('controlsAcceleratingSpeedBoost')
      this.car.debugFolder.add(this.car.options, 'controlsAcceleratingQuad').name('controlsAcceleratingQuad')
      this.car.debugFolder.add(this.car.options, 'controlsBrakeStrength').step(0.001).min(0).max(5).name('controlsBrakeStrength')
      this.car.debugFolder.add(this.car, 'recreate')
      this.car.debugFolder.add(this.car, 'jump')
    }
  }
}
