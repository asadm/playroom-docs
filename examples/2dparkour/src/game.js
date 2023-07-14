import Phaser from "phaser";
import Player from "./player";
import { onPlayerJoin, insertCoin, isHost, myPlayer, Joystick } from "playroomkit";
import ColorReplacePipelinePlugin from 'phaser3-rex-plugins/plugins/colorreplacepipeline-plugin.js';

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
      player.onQuit(() => {
        this.players = this.players.filter(({ player: _player }) => _player !== player);
        hero.destroy();
      });
    });
  }

  update() {
    this.players.forEach(({ player, hero }) => {
      if (isHost()) {
        hero.update();
        player.setState('pos', hero.pos());
      }
      else {
        const pos = player.getState('pos');
        if (pos) {
          hero.setPos(pos.x, pos.y);
        }
      }
    });
  }
}

var gameOptions = {
  // width of the game, in pixels
  gameWidth: 14 * 32,
  // height of the game, in pixels
  gameHeight: 23 * 32,
  // background color
  bgColor: 0xF7DEB5
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
  },
  plugins: {
    global: [{
      key: 'rexColorReplacePipeline',
      plugin: ColorReplacePipelinePlugin,
      start: true
    },
    ]
  }
};

insertCoin().then(() => {
  // creating a new Phaser 3 game instance
  const game = new Phaser.Game(config);
});