import { onPlayerJoin, insertCoin, isHost, myPlayer, setState, getState } from "playroomkit";
import * as THREE from 'three';
import * as CANNON from 'cannon';

import Time from "./utils/Time"
import Controls from "./controls";
import Car from "./car";
import shape2mesh from "./utils/shape2mesh";
import createWorld from "./world";
import loadCar from './carmodel';
// import loadCar from './carmodel_basic';
// import * as dat from 'dat.gui'

function addSphere(pos = {x:0, y: 20, z: 0}, color = 0xF9F9F9, radius = 1, mass = 1) {
  const sphereShape = new CANNON.Sphere( radius );
  const body = new CANNON.Body({ mass: mass, shape: sphereShape });
  body.position.set(pos.x, pos.y, pos.z);
  body.linearDamping = 0.6;

  const material = new THREE.MeshLambertMaterial({ color: color });
  const mesh = shape2mesh(body, material);
  return {mesh, body};
}

function setupGame(){
  // Init world
  const scene = new THREE.Scene()
  const ambientLight = new THREE.AmbientLight( 0xffffbb, 0.4 );
  scene.add( ambientLight );

  const light = new THREE.DirectionalLight( 0xffffff, 0.5 );
  light.position.set( 100, 100, 50 );
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
  scene.add( light );

  // Renderer
  const renderer = new THREE.WebGLRenderer({
      alpha: true
  });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x87ceeb, 1)
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
  onPlayerJoin(async (player)=>{
    const color = player.getProfile().color.hex;
    const isMyPlayer = myPlayer().id === player.id;
    const {chassisObject, wheelObject} = await loadCar(color);
    let controls = new Controls(player, isMyPlayer);
    const car = new Car({
      initialPos: new THREE.Vector3(Math.random() * 10, Math.random() * 10, 12),
      time: time,
      chassisObject: chassisObject,
      wheelObject: wheelObject,
      physicsWorld: PhysicsWorld,
      controls: controls
    });
    scene.add(car.container);
    player.onQuit(()=>{
      scene.remove(car.container);
      car.destroy();
    });
    playersAndCars.push({player, car});
  });

  // Add some spheres
  const spheres = [
    addSphere({x: 0, y: 0, z: 40}, 0xff0000, 1, 10),
    addSphere({x: 15, y: 10, z: 40}, 0x00ff00, 0.5, 5),
    addSphere({x: 0, y: -10, z: 30}, 0x0000ff, 1, 5),
    addSphere({x: -15, y: 10, z: 40}, 0xffff00, 0.5, 15),
  ]
  spheres.forEach(({mesh, body})=>{
    scene.add(mesh);
    PhysicsWorld.addBody(body);
  });

  // Main loop
  time.on('tick', (delta)=>{
    renderer.render(scene, camera);

    // On host device, update physics
    if (isHost()){
      PhysicsWorld.step(1 / 60, delta, 3);
    }

    // On host device, update all player and spheres pos
    if(isHost()){
      playersAndCars.forEach(({player, car})=>{
        player.setState('pos', car.pos());
        player.setState('quaternion', car.quaternion());
      });

      spheres.forEach(({mesh, body})=>{
        mesh.position.copy(body.position);
      });
      // set sphere pos to playroom
      setState('spherePos', spheres.map(({mesh})=>mesh.position));
    }

    // On client, get everyone's pos and update locally
    else{
      playersAndCars.forEach(({player, car})=>{
        const pos = player.getState('pos');
        if(pos){
          car.setPos(pos);
        }
        const quaternion = player.getState('quaternion');
        if(quaternion){
          car.setQuaternion(quaternion);
        }
      });

      // Update sphere pos as well
      const spherePos = getState('spherePos');
      if(spherePos){
        spheres.forEach(({mesh}, i)=>{
          mesh.position.copy(spherePos[i]);
        });
      }
    }

    // Follow my car with camera
    const pos = myPlayer().getState('pos')?myPlayer().getState('pos')[0]:null;
    if(pos){
      camera.position.copy(pos);
      camera.position.add(cameraCoords);
    }
  });
}

// Start game
insertCoin().then(()=>{
  setupGame();
})
