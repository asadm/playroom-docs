import nipplejs from 'nipplejs';

export default class Joystick {
  constructor(playerState, isMyPlayer){
    this.playerState = playerState;
    if (isMyPlayer) {
      this.initJoystick();
    }
  }

  initJoystick() {
    const joystick = nipplejs.create();
    joystick.on("move", (e, data) => {
      let angle = data.angle.radian;
      // minus 270 degrees to make it face up
      angle -= Math.PI * 1.5;
      this.playerState.setState("dir", angle);
      this.playerState.setState("up", true);
    });
    joystick.on("end", () => {
      this.playerState.setState("up", undefined);
    });
  }

  angle() {
    return this.playerState.getState("dir") || 0;
  }

  up() {
    return this.playerState.getState("up");
  }

  down() {
    return false; // TODO
  }

  brake() {
    return false; // TODO
  }

  boost() {
    return false; // TODO
  }
}