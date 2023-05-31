import { Application } from '@splinetool/runtime';
const { onPlayerJoin, insertCoin, isHost, myPlayer } = Playroom;

const canvas = document.getElementById('canvas3d');
const app = new Application(canvas);

class AnimationFrame {
  constructor(fps = 60, animate) {
    this.requestID = 0;
    this.fps = fps;
    this.animate = animate;
  }

  start() {
    let then = performance.now();
    const interval = 1000 / this.fps;
    const tolerance = 0.1;

    const animateLoop = (now) => {
      this.requestID = requestAnimationFrame(animateLoop);
      const delta = now - then;

      if (delta >= interval - tolerance) {
        then = now - (delta % interval);
        this.animate(delta);
      }
    };
    this.requestID = requestAnimationFrame(animateLoop);
  }

  stop() {
    cancelAnimationFrame(this.requestID);
  }
}

window._USETEMPSTORAGE = true;
await insertCoin();
// await app.load('https://prod.spline.design/upsGl4lgNgcU3Qpx/scene.splinecode');
await app.load('/demos/spline/scene.splinecode');
window.app = app;
// Joystick connection
const joystick = nipplejs.create();
joystick.on("move", (e, data) => {
  // console.log(data.vector);
  myPlayer().setState("dir", data.vector);
});
joystick.on("end", () => {
  myPlayer().setState("dir", {x:0, y:0});
});

let players = [];
window.players = players;
function getObjectFromSpline(name){
  return app._scene.children.find((child)=> child.name === name);//.rigidBody.addForce({ x: -0.10, y: 0.0, z: 0.0 }, true); setTimeout(()=> app._scene.children.find((child)=> child.name === "Ball1").rigidBody.resetForces(true), 100);
};

onPlayerJoin((state) => {
  const ball = getObjectFromSpline("Ball" + (players.length+1));
  players.push({state, ball});
});

const loop = new AnimationFrame(120, () => {
  if (isHost()){
    for (const player of players) {
      const controls = player.state.getState("dir") || {};
      // player.ball.rigidBody.resetForces(true);
      // console.log(controls);
      player.ball.rigidBody.setLinvel({ 
        x: controls?.x * 4.0 || 0.0,
        y:player.ball.rigidBody.linvel().y, 
        z: controls?.y * -4.0 || 0.0
      }, true);

      const translation = player.ball.rigidBody.translation();
      // const pos = player.ball.position;
      let finalPos = new THREE.Vector3(translation.x * 200, translation.y * 200, translation.z * 200);
      // finalPos.applyQuaternion(player.ball.rigidBody.rotation());
      finalPos.add(new THREE.Vector3(0, 100.5, 5));
      // const finalPos = {
      //   x: translation.x * 200,
      //   y: translation.y * 200,
      //   z: translation.z * 200
      // }


      app._camera.position.x = finalPos.x;
      app._camera.position.y = finalPos.y;
      app._camera.position.z = finalPos.z;

      let finalLookAt = new THREE.Vector3(translation.x * 200, translation.y * 200, translation.z * 200);
      finalLookAt.add(new THREE.Vector3(0, 100.5, 0));
      app._controls.orbitControls.target.x = finalLookAt.x;
      app._controls.orbitControls.target.y = finalLookAt.y;
      app._controls.orbitControls.target.z = finalLookAt.z;
      // app._camera.lookAt(finalLookAt.x, finalLookAt.y, finalLookAt.z);

      // app._camera.lookAt(finalPos.x, finalPos.y, finalPos.z);
      // console.log(finalPos);
      // if (controls.x == "left") {
      //   player.ball.rigidBody.resetForces(true);
      //   player.ball.rigidBody.addForce({ x: -4.0, y: 0.0, z: 0.0 }, true);
      //   setTimeout(()=> player.ball.rigidBody.resetForces(true), 10);
      // }
      // else if (controls.x == "right") {
      //   player.ball.rigidBody.resetForces(true);
      //   player.ball.rigidBody.addForce({ x: 4.0, y: 0.0, z: 0.0 }, true);
      //   setTimeout(()=> player.ball.rigidBody.resetForces(true), 10);
      // }

      // if (controls.y == "up") {
      //   player.ball.rigidBody.resetForces(true);
      //   player.ball.rigidBody.addForce({ x: 0.0, y: 0.0, z: -4.0 }, true);
      //   setTimeout(()=> player.ball.rigidBody.resetForces(true), 10);
      // }
      // else if (controls.y == "down") {
      //   player.ball.rigidBody.resetForces(true);
      //   player.ball.rigidBody.addForce({ x: 0.0, y: 0.0, z: 4.0 }, true);
      //   setTimeout(()=> player.ball.rigidBody.resetForces(true), 10);
      // }
      player.state.setState("pos", player.ball.rigidBody.translation());
    }
  }
  else{
    for (const player of players) {
      const pos = player.state.getState("pos");
      if (pos){
        player.ball.rigidBody.setTranslation(pos, true);
      }
    }
  }
});
loop.start();