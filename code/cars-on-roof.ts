import { CodePlaygroundFile } from "../components/CodePlayground";

export const carsOnRoof: CodePlaygroundFile[] = [
  {
    name: "src/utils/EventEmitter.js",
    language: "javascript",
    code: `export default class {
  /**
   * Constructor
   */
  constructor() {
    this.callbacks = {}
    this.callbacks.base = {}
  }

  /**
   * On
   */
  on(_names, callback) {
    const that = this

    // Errors
    if (typeof _names === 'undefined' || _names === '') {
      console.warn('wrong names')
      return false
    }

    if (typeof callback === 'undefined') {
      console.warn('wrong callback')
      return false
    }

    // Resolve names
    const names = this.resolveNames(_names)

    // Each name
    names.forEach(function (_name) {
      // Resolve name
      const name = that.resolveName(_name)

      // Create namespace if not exist
      if (!(that.callbacks[name.namespace] instanceof Object))
        that.callbacks[name.namespace] = {}

      // Create callback if not exist
      if (!(that.callbacks[name.namespace][name.value] instanceof Array))
        that.callbacks[name.namespace][name.value] = []

      // Add callback
      that.callbacks[name.namespace][name.value].push(callback)
    })

    return this
  }

  /**
   * Off
   */
  off(_names) {
    const that = this

    // Errors
    if (typeof _names === 'undefined' || _names === '') {
      console.warn('wrong name')
      return false
    }

    // Resolve names
    const names = this.resolveNames(_names)

    // Each name
    names.forEach(function (_name) {
      // Resolve name
      const name = that.resolveName(_name)

      // Remove namespace
      if (name.namespace !== 'base' && name.value === '') {
        delete that.callbacks[name.namespace]
      }

      // Remove specific callback in namespace
      else {
        // Default
        if (name.namespace === 'base') {
          // Try to remove from each namespace
          for (const namespace in that.callbacks) {
            if (that.callbacks[namespace] instanceof Object && that.callbacks[namespace][name.value] instanceof Array) {
              delete that.callbacks[namespace][name.value]

              // Remove namespace if empty
              if (Object.keys(that.callbacks[namespace]).length === 0)
                delete that.callbacks[namespace]
            }
          }
        }

        // Specified namespace
        else if (that.callbacks[name.namespace] instanceof Object && that.callbacks[name.namespace][name.value] instanceof Array) {
          delete that.callbacks[name.namespace][name.value]

          // Remove namespace if empty
          if (Object.keys(that.callbacks[name.namespace]).length === 0)
            delete that.callbacks[name.namespace]
        }
      }
    })

    return this
  }

  /**
   * Trigger
   */
  trigger(_name, _args) {
    // Errors
    if (typeof _name === 'undefined' || _name === '') {
      console.warn('wrong name')
      return false
    }

    const that = this
    let finalResult = null
    let result = null

    // Default args
    const args = !(_args instanceof Array) ? [] : _args

    // Resolve names (should on have one event)
    let name = this.resolveNames(_name)

    // Resolve name
    name = this.resolveName(name[0])

    // Default namespace
    if (name.namespace === 'base') {
      // Try to find callback in each namespace
      for (const namespace in that.callbacks) {
        if (that.callbacks[namespace] instanceof Object && that.callbacks[namespace][name.value] instanceof Array) {
          that.callbacks[namespace][name.value].forEach(function (callback) {
            result = callback.apply(that, args)

            if (typeof finalResult === 'undefined') {
              finalResult = result
            }
          })
        }
      }
    }

    // Specified namespace
    else if (this.callbacks[name.namespace] instanceof Object) {
      if (name.value === '') {
        console.warn('wrong name')
        return this
      }

      that.callbacks[name.namespace][name.value].forEach(function (callback) {
        result = callback.apply(that, args)

        if (typeof finalResult === 'undefined')
          finalResult = result
      })
    }

    return finalResult
  }

  /**
   * Resolve names
   */
  resolveNames(_names) {
    let names = _names
    names = names.replace(/[^a-zA-Z0-9 ,/.]/g, '')
    names = names.replace(/[,/]+/g, ' ')
    names = names.split(' ')

    return names
  }

  /**
   * Resolve name
   */
  resolveName(name) {
    const newName = {}
    const parts = name.split('.')

    newName.original = name
    newName.value = parts[0]
    newName.namespace = 'base' // Base namespace

    // Specified namespace
    if (parts.length > 1 && parts[1] !== '') {
      newName.namespace = parts[1]
    }

    return newName
  }
}`
  },
  {
    name: "src/utils/Time.js",
    language: "javascript",
    code: `import EventEmitter from './EventEmitter.js'

export default class Time extends EventEmitter {
  /**
   * Constructor
   */
  constructor() {
    super()

    this.start = Date.now()
    this.current = this.start
    this.elapsed = 0
    this.delta = 16

    this.tick = this.tick.bind(this)
    this.tick()
  }

  /**
   * Tick
   */
  tick() {
    this.ticker = window.requestAnimationFrame(this.tick)

    const current = Date.now()

    this.delta = current - this.current
    this.elapsed = current - this.start
    this.current = current

    if (this.delta > 60) {
      this.delta = 60
    }

    this.trigger('tick', [this.delta, this.elapsed])
  }

  /**
   * Stop
   */
  stop() {
    window.cancelAnimationFrame(this.ticker)
  }
}`
  },
  {
    name: "src/utils/shape2mesh.js",
    language: "javascript",
    code: `import * as THREE from 'three';
import * as CANNON from 'cannon';

// adapted from https://schteppe.github.io/cannon.js/build/cannon.demo.js
export default function shape2mesh(body, material) {
  var obj = new THREE.Object3D();

  for (var l = 0; l < body.shapes.length; l++) {
    var shape = body.shapes[l];

    var mesh;

    switch (shape.type) {

      case CANNON.Shape.types.SPHERE:
        var sphere_geometry = new THREE.SphereGeometry(shape.radius);
        mesh = new THREE.Mesh(sphere_geometry, material);
        break;

      case CANNON.Shape.types.PLANE:
        var geometry = new THREE.PlaneGeometry(10, 10, 4, 4);
        mesh = new THREE.Object3D();
        var submesh = new THREE.Object3D();
        var ground = new THREE.Mesh(geometry, material);
        ground.scale.set(100, 100, 100);
        submesh.add(ground);

        ground.castShadow = true;
        ground.receiveShadow = true;

        mesh.add(submesh);
        break;

      case CANNON.Shape.types.BOX:
        var box_geometry = new THREE.BoxGeometry(shape.halfExtents.x * 2,
          shape.halfExtents.y * 2,
          shape.halfExtents.z * 2);
        mesh = new THREE.Mesh(box_geometry, material);
        break;

      default:
        throw "Visual type not recognized: " + shape.type;
    }

    mesh.receiveShadow = true;
    mesh.castShadow = true;
    if (mesh.children) {
      for (var i = 0; i < mesh.children.length; i++) {
        mesh.children[i].castShadow = true;
        mesh.children[i].receiveShadow = true;
        if (mesh.children[i]) {
          for (var j = 0; j < mesh.children[i].length; j++) {
            mesh.children[i].children[j].castShadow = true;
            mesh.children[i].children[j].receiveShadow = true;
          }
        }
      }
    }

    var o = body.shapeOffsets[l];
    var q = body.shapeOrientations[l];
    mesh.position.set(o.x, o.y, o.z);
    mesh.quaternion.set(q.x, q.y, q.z, q.w);

    obj.add(mesh);
  }

  // copy pos
  obj.position.copy(body.position);

  return obj;
};`
  },
  {
    name: "src/world.js",
    language: "javascript",
    code: `import * as THREE from 'three';
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
}`
  },
  {
    name: "src/styles.css",
    language: "css",
    code: `body {
  margin: 0;
}
html,
body {
  height: 100%;
	overflow: hidden;
  background-color: #000000;
}
canvas {
  display: block;
}`
  },
  {
    name: "src/carmodel_basic.js",
    language: "javascript",
    code: `import * as THREE from 'three';
export default function loadCar(primaryColor=0xff2800) {
  var torus = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.14, 12, 18),
    new THREE.MeshLambertMaterial({
      color: 0x000000
    }));

  torus.rotation.x = Math.PI / 2;
  torus.castShadow = true;
  torus.receiveShadow = true;
  const wheelContainer = new THREE.Object3D();
  wheelContainer.add(torus);

  var box = new THREE.Mesh(new THREE.BoxGeometry(0.702, 0.706, 2.03), new THREE.MeshPhongMaterial({
    color: primaryColor,
    flatShading: true
  }));
  box.rotation.y = Math.PI / 2;
  box.position.z = 0.7
  box.castShadow = true;
  box.receiveShadow = true;
  const chassisContainer = new THREE.Object3D();
  chassisContainer.add(box);

  return {wheelObject: wheelContainer, chassisObject: chassisContainer};
}`
  },
  {
    name: "src/carmodel.js",
    language: "javascript",
    code: `import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

async function loadModel(url) {
  return new Promise((resolve, reject) => {
    // Draco
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('draco/')
    dracoLoader.setDecoderConfig({ type: 'js' })

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader)

    loader.load(url, resolve, undefined, reject)
  });
}

function applyMaterial(mesh, primaryColor) {
  const materials = {
    'pureRed': new THREE.MeshBasicMaterial({ color: 0xff2800 }),
    'pureWhite': new THREE.MeshBasicMaterial({ color: 0xfffffc }),
    'pureBlack': new THREE.MeshBasicMaterial({ color: 0x160000 }),
    'pureYellow': new THREE.MeshBasicMaterial({ color: 0xffe889 }),
    'shadeWhite': new THREE.MeshPhongMaterial({ color: 0xfffffc }),
    'shadeBlack': new THREE.MeshPhongMaterial({ color: 0x160000 }),
    'shadeRed': new THREE.MeshPhongMaterial({ color: primaryColor || 0xff2800 }),
  }

  // Get material name by matching with startsWith
  let materialName = Object.keys(materials).find((_materialName) => mesh.name.startsWith(_materialName));
  if (typeof materialName === 'undefined') {
    materialName = 'pureWhite';
  }

  mesh.material = materials[materialName].clone();
  return mesh;
}

// Recenter model to marked center point and apply mesh
function processModel(obj, primaryColor) {
  const container = new THREE.Object3D()
  const center = new THREE.Vector3()
  // Go through each base child
  const baseChildren = [...obj.children]

  for (const _child of baseChildren) {
    // Find center
    if (_child.name.match(/^center_?[0-9]{0,3}?/i)) {
      center.set(_child.position.x, _child.position.y, _child.position.z)
    }

    if (_child instanceof THREE.Mesh) {
      const mesh = applyMaterial(_child, primaryColor);
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      container.add(mesh);
    }

    // Apply centering
    if (center.length() > 0) {
      for (const _child of container.children) {
        _child.position.sub(center)
      }

      container.position.add(center)
    }
  }
  return container;
}

export default async function loadCar(primaryColor=0xff2800) {
  const chassisModel = await loadModel('/carmodel/chassis.glb');
  const wheelModel = await loadModel('/carmodel/wheel.glb');
  console.log("chassisModel", chassisModel)
  const chassisObject = processModel(chassisModel.scene, primaryColor);
  console.log("wheelModel", wheelModel)
  const wheelObject = processModel(wheelModel.scene);
  return { chassisObject, wheelObject };
}`
  },
  {
    name: "src/car/Physics.js",
    language: "javascript",
    code: `import * as CANNON from 'cannon';
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
}`
  },
  {
    name: "src/car/Car.js",
    language: "javascript",
    code: `import * as THREE from 'three'
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
}`
  },
  {
    name: "src/car/index.js",
    language: "javascript",
    code: `import * as THREE from 'three'
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
}`
  },
  {
    name: "src/main.js",
    language: "javascript",
    code: `import { onPlayerJoin, insertCoin, isHost, myPlayer, setState, getState, Joystick } from "playroomkit";
import * as THREE from 'three';
import * as CANNON from 'cannon';

import Time from "./utils/Time"
import Car from "./car";
import shape2mesh from "./utils/shape2mesh";
import createWorld from "./world";
import loadCar from './carmodel';
// import loadCar from './carmodel_basic';
import mobileRevTriangle from './images/trianglerev.png'
// import * as dat from 'dat.gui'

function addSphere(pos = { x: 0, y: 20, z: 0 }, color = 0xF9F9F9, radius = 1, mass = 1) {
  const sphereShape = new CANNON.Sphere(radius);
  const body = new CANNON.Body({ mass: mass, shape: sphereShape });
  body.position.set(pos.x, pos.y, pos.z);
  body.linearDamping = 0.6;

  const material = new THREE.MeshLambertMaterial({ color: color, shading: THREE.FlatShading });
  const mesh = shape2mesh(body, material);
  return { mesh, body };
}

function setupGame() {
  // Init world
  const scene = new THREE.Scene()
  const hemisphereLight = new THREE.HemisphereLight(0xaaaaff, 0xffaa00, .4);
  const ambientLight = new THREE.AmbientLight(0xdc8874, .4);
  const shadowLight = new THREE.DirectionalLight(0xffffff, .9);
  shadowLight.position.set(150, 350, 350);
  shadowLight.castShadow = true;
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;
  scene.add(hemisphereLight);
  scene.add(shadowLight);
  scene.add(ambientLight);
  scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

  const light = new THREE.DirectionalLight(0xffffff, 0.5);
  light.position.set(100, 100, 50);
  light.castShadow = true;
  const dLight = 200;
  const sLight = dLight * 0.25;
  light.shadow.camera.left = - sLight;
  light.shadow.camera.right = sLight;
  light.shadow.camera.top = sLight;
  light.shadow.camera.bottom = - sLight;
  light.shadow.camera.near = dLight / 30;
  light.shadow.camera.far = dLight;
  light.shadow.mapSize.x = 1024 * 2;
  light.shadow.mapSize.y = 1024 * 2;
  scene.add(light);

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    alpha: true
  });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0xb4e0f1, 1)
  renderer.setPixelRatio(2)
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement);

  // Camera
  const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 80);
  const cameraCoords = new THREE.Vector3(19.36, 9.36, 11.61);
  camera.position.copy(cameraCoords);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  camera.rotation.x = -0.7;
  camera.rotation.y = 1;
  camera.rotation.z = 2.37;
  window.camera = camera;

  // Physics
  let time = new Time();

  const PhysicsWorld = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.83, 0)
  });

  // Floor and walls
  createWorld(scene, PhysicsWorld);
  // const debug = new dat.GUI({ width: 420 })
  // const debugFolder = debug.addFolder('other')
  // debugFolder.open()
  // debugFolder.add(camera.position, 'x', -20, 20, 0.01)

  // Handle players joining
  let playersAndCars = [];
  onPlayerJoin(async (player) => {
    const color = player.getProfile().color.hex;
    const { chassisObject, wheelObject } = await loadCar(color);
    let controls = new Joystick(player, {
      buttons: [
        {id: "down", icon: mobileRevTriangle}
      ],
    });
    const car = new Car({
      initialPos: new THREE.Vector3(Math.random() * 10, Math.random() * 10, 12),
      time: time,
      chassisObject: chassisObject,
      wheelObject: wheelObject,
      physicsWorld: PhysicsWorld,
      controls: controls
    });
    scene.add(car.container);
    player.onQuit(() => {
      scene.remove(car.container);
      car.destroy();
    });
    playersAndCars.push({ player, car });
  });

  // Add some spheres, for fun
  // if there already exist sphere pos, use that
  const spherePos = getState('spherePos') || [
    { x: 0, y: 0, z: 40 },
    { x: 15, y: 10, z: 40 },
    { x: 0, y: -10, z: 30 },
    { x: -15, y: 10, z: 40 },
  ];
  const sphereColors = [0xff3300, 0xff3300, 0xff3300, 0xff3300];
  const sphereRadii = [1, 0.5, 1, 0.5];
  const spheres = spherePos.map((pos, i) => {
    return addSphere(
      pos,
      sphereColors[i],
      sphereRadii[i],
      10 * sphereRadii[i]);
  });

  spheres.forEach(({ mesh, body }) => {
    scene.add(mesh);
    PhysicsWorld.addBody(body);
  });

  // Main loop
  time.on('tick', (delta) => {
    renderer.render(scene, camera);
    PhysicsWorld.step(1 / 60, delta, 3);

    // On host device, update all player and spheres pos
    if (isHost()) {
      playersAndCars.forEach(({ player, car }) => {
        player.setState('pos', car.pos());
        player.setState('quaternion', car.quaternion());
      });

      spheres.forEach(({ mesh, body }) => {
        mesh.position.copy(body.position);
      });
      // set sphere pos to playroom
      setState('spherePos', spheres.map(({ mesh }) => mesh.position));
    }

    // On client, get everyone's pos and update locally
    else {
      playersAndCars.forEach(({ player, car }) => {
        const pos = player.getState('pos');
        if (pos) {
          car.setPos(pos);
        }
        const quaternion = player.getState('quaternion');
        if (quaternion) {
          car.setQuaternion(quaternion);
        }
      });

      // Update sphere pos as well
      const spherePos = getState('spherePos');
      if (spherePos) {
        spheres.forEach(({ mesh }, i) => {
          mesh.position.copy(spherePos[i]);
        });
      }
    }

    // Follow my car with camera
    const pos = myPlayer().getState('pos') ? myPlayer().getState('pos')[0] : null;
    if (pos) {
      camera.position.copy(pos);
      camera.position.add(cameraCoords);
    }
  });
}

// Start game
insertCoin().then(() => {
  setupGame();
})`
  },
  {
    name: "index.html",
    language: "html",
    code: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="./src/styles.css" />
  </head>
  <body>
    <script type="module" src="./src/main.js"></script>
  </body>
</html>`
  }
]
