import Phaser from "phaser";
import Player from "./player";
import { onPlayerJoin, insertCoin, isHost, myPlayer, Joystick } from "playroomkit";

class PlayGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }

  preload() {
    this.load.image("tile", "/tile.png");
    this.load.image("hero", "/hero.png");
    this.load.tilemapTiledJSON("level", "/level.json");
  }

  create() {
    // setting background color
    this.cameras.main.setBackgroundColor(gameOptions.bgColor);

    // creatin of "level" tilemap
    this.map = this.make.tilemap({ key: "level", tileWidth: 64, tileHeight: 64 });

    // adding tiles (actually one tile) to tilemap
    this.tileset = this.map.addTilesetImage("tileset01", "tile");

    // which layer should we render? That's right, "layer01"
    this.layer = this.map.createLayer("layer01", this.tileset, 0, 0);

    this.layer.setCollisionBetween(0, 1, true);

    // loading level tilemap
    this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    // players and their controllers
    this.players = [];

    onPlayerJoin(async (player) => {
      const joystick = new Joystick(player, {
        type: "dpad",
        buttons: [
          { id: "jump", label: "JUMP" }
        ]
      });
      const hero = new Player(
        this, 
        this.layer, 
        this.cameras.main.width / 2 + (this.players.length * 20), 
        440, 
        player.getProfile().color.hex, 
        joystick);
       
      this.players.push({ player, hero, joystick });
    });
  }

  update() {
    this.players.forEach(({ player, hero }) => {
      if (isHost()){
        hero.update();
        player.setState('pos', hero.pos());
      }
      else{
        const pos = player.getState('pos');
        if (pos){
          hero.setPos(pos.x, pos.y);
        }
      }
    });
  }
}

var gameOptions = {
  // width of the game, in pixels
  gameWidth: 9 * 32,
  // height of the game, in pixels
  gameHeight: 15 * 32,
  // background color
  bgColor: 0x444444
}

// Phaser 3 game configuration
const config = {
  type: Phaser.AUTO,
  width: gameOptions.gameWidth,
  height: gameOptions.gameHeight,
  parent: "container",
  scene: [PlayGame],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 900 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

insertCoin().then(() => {
  // creating a new Phaser 3 game instance
  const game = new Phaser.Game(config);
  window.game = game;
  // scaleCanvasToFit();
  // window.addEventListener("resize", scaleCanvasToFit);
});

// function scaleCanvasToFit(){
//   // scale canvas container to fit window
//   const container = document.getElementById("container");
//   const scale = Math.min(window.innerWidth / gameOptions.gameWidth, (window.innerHeight - 100) / gameOptions.gameHeight);
//   container.style.transform = `scale(${scale})`;
// }