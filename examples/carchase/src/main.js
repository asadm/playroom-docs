import { onPlayerJoin, insertCoin, isHost, myPlayer } from "playroomkit";
import * as THREE from 'three';
import * as CANNON from 'cannon';
import Time from "./Utils/Time"
import Controls from "./controls";
import Car from "./car";
import * as dat from 'dat.gui'
import loadCar from './carmodel';
// import loadCar from './carmodel_basic';

function setupGame(){
  // Scene
  const scene = new THREE.Scene()

  // // Add global light
  const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
  scene.add( light );

  // Renderer
  const renderer = new THREE.WebGLRenderer({
      alpha: true
  })
  renderer.setClearColor(0xf6893d, 1)
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

  // Placeholder box
  var box = new THREE.Mesh(new THREE.BoxGeometry(1.02, 1.16, 2.03), new THREE.MeshMatcapMaterial({
    color: 0xf0ff00
  }));
  scene.add(box);

  // Physics
  let time = new Time();
  const debug = new dat.GUI({ width: 420 })
  const PhysicsWorld = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.83, 0)
  });

  // Floor
  const floor = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Plane(),
  })

  PhysicsWorld.addBody(floor)

  const debugFolder = debug.addFolder('other')
  debugFolder.open()
  // debugFolder.add(camera.position, 'x', -20, 20, 0.01)
  // debugFolder.add(camera.position, 'y', -20, 20, 0.01)
  // debugFolder.add(camera.position, 'z', -20, 20, 0.01)
  // debugFolder.add(camera.rotation, 'x', -Math.PI, Math.PI, 0.01)
  // debugFolder.add(camera.rotation, 'y', -Math.PI, Math.PI, 0.01)
  // debugFolder.add(camera.rotation, 'z', -Math.PI, Math.PI, 0.01)

  let playersAndCars = [];
  window.playersAndCars = playersAndCars;

  onPlayerJoin(async (player)=>{
    const color = player.getProfile().color.hex;
    const isMyPlayer = myPlayer().id === player.id;
    const {chassisObject, wheelObject} = await loadCar(color);
    let controls = new Controls(player, isMyPlayer);
    const car = new Car({
      // debug: debug,
      time: time,
      chassisObject: chassisObject,
      wheelObject: wheelObject,
      physicsWorld: PhysicsWorld,
      controls: controls
    });
    scene.add(car.container);
    playersAndCars.push({player, car});
  });

  time.on('tick', (delta)=>{
    renderer.render(scene, camera);
    PhysicsWorld.step(1 / 60, delta, 3);

    // on host, update all player pos
    if(isHost()){
      playersAndCars.forEach(({player, car})=>{
        player.setState('pos', car.pos());
      });
    }
    // on client, update everyone's pos
    else{
      playersAndCars.forEach(({player, car})=>{
        const pos = player.getState('pos');
        if(pos){
          car.setPos(pos);
        }
      });
    }
    // follow my car
    const pos = myPlayer().getState('pos');
    if(pos){
      camera.position.copy(pos);
      camera.position.add(cameraCoords);
    }
    // camera.position.copy(car.pos());
    // camera.position.add(cameraCoords);
  });
}

insertCoin().then(()=>{
  setupGame();
})
