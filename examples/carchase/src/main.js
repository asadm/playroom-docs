import { onPlayerJoin, insertCoin, isHost, myPlayer } from "playroomkit";
import * as THREE from 'three';
import * as CANNON from 'cannon';
import Time from "./Utils/Time"
import Controls from './controls';
import Car from "./car";
import * as dat from 'dat.gui'
import loadCar from './carmodel';
// import loadCar from './carmodel_basic';

async function addCar(color){
  
}

function setupGame(){
  // Scene
  const scene = new THREE.Scene()

  // // Add global light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
  scene.add(ambientLight);

  // Renderer
  const renderer = new THREE.WebGLRenderer({
      alpha: true
  })
  renderer.setClearColor(0x414141, 1)
  renderer.setPixelRatio(2)
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement);

  // Camera
  const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 80);
  const cameraCoords = new THREE.Vector3(16.3, 18.38, 20);
  camera.position.copy(cameraCoords);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  camera.rotation.z = Math.PI;
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

  // const debugFolder = debug.addFolder('other')
  // debugFolder.open()
  // debugFolder.add(camera.position, 'x', -20, 20, 0.01)

  // WASD and Touch Controls
  let controls = new Controls({
    time: time,
  });

  let playersAndCars = [];
  window.playersAndCars = playersAndCars;

  onPlayerJoin(async (player)=>{
    const color = player.getProfile().color.hex;
    const isMyPlayer = myPlayer().id === player.id;
    const {chassisObject, wheelObject} = await loadCar(color);
    const car = new Car({
      // debug: debug,
      time: time,
      chassisObject: chassisObject,
      wheelObject: wheelObject,
      physicsWorld: PhysicsWorld,
      controls: isMyPlayer ? controls : null,
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
