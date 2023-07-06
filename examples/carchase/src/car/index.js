import * as THREE from 'three'
import Physics from './Physics.js'
import Car from './Car.js'

export default class {
    constructor({debug, time, physicsWorld, controls, chassisObject, wheelObject}) {
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
        // this.setControls()

        this.start()
    }

    start() {
        this.setPhysics()
        this.setCar()
        setTimeout(() => {
            this.initCar();
        }, 100);
        
    }

    initCar(){
        // Car
        this.physics.car.chassis.body.sleep()
        this.physics.car.chassis.body.position.set(0, 0, 12)

        window.setTimeout(() => {
            this.physics.car.chassis.body.wakeUp()
        }, 300)
    }

    setControls() {
        this.controls = new Controls({
            // config: this.config,
            // sizes: this.sizes,
            time: this.time,
            // camera: this.camera,
            // sounds: this.sounds
        })
    }

    pos(){
        const pos = this.physics.car.chassis.body.position
        // round to 3 decimal places
        return ({
            x: Math.round(pos.x * 1000) / 1000, 
            y: Math.round(pos.y * 1000) / 1000, 
            z: Math.round(pos.z * 1000) / 1000
        });
    }

    setPos(pos){
        this.physics.car.chassis.body.position.set(pos.x, pos.y, pos.z)
    }

    quaternion(){
        return (this.physics.car.chassis.body.quaternion)
    }

    setQuaternion(quaternion){
        this.physics.car.chassis.body.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w)
    }

    setPhysics() {
        this.physics = new Physics({
            // config: this.config,
            debug: this.debug,
            time: this.time,
            // sizes: this.sizes,
            controls: this.controls,
            // sounds: this.sounds,
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

}
