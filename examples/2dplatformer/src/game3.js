import Phaser from "phaser";

var playerOptions = {
  // player gravity
  playerGravity: 900,

  // player horizontal speed
  playerSpeed: 300,

  // player force
  playerJump: 300,

  playerWallDragMaxVelocity: 50,

  // allow how many jumps (>1 for mid air jumps)
  playerMaxJumps: 1,

  // should be below acceleration. 
  // You can disable "slippery floor" setting by giving ridiculously high value
  playerDrag: 700,// 9999,

  playerAcceleration: 1500
}
class Player {
  constructor(scene, layerTiles, x, y, spriteID) {
      this.scene = scene;
      this.layer = layerTiles;

      // adding the hero sprite
      this.hero = scene.physics.add.sprite(x, y, spriteID);

      // scene.physics.world.addCollider(this.hero, scene.layer);
      scene.physics.add.collider(this.hero, scene.layer);
      // scene.physics.add.collider(this.hero, scene.layer, null, null, this);

      // setting hero anchor point
      this.hero.setOrigin(0.5);

      this.hero.setCollideWorldBounds(true);

      // setting hero gravity
      this.hero.body.setGravityY(playerOptions.playerGravity);

      // Set player minimum and maximum movement speed
      this.hero.body.setMaxVelocity(playerOptions.playerSpeed, playerOptions.playerSpeed * 10);

      // Add drag to the player that slows them down when they are not accelerating
      this.hero.body.setDrag(playerOptions.playerDrag, 0);

      // the hero can jump
      this.canJump = true;

      // hero is in a jump
      this.jumping = false;

      // the hero is not on the wall
      this.onWall = false;

      // to detect player input
      // this.input = scene.input;
      this.input = scene.input.keyboard.createCursorKeys();


      // to detect input from gamepad
      // this.pad = scene.input.gamepad.getPad(0);
  }

  handleJump() {
      // the hero can jump when:
      // canJump is true AND the hero is on the ground (blocked.down)
      // OR
      // the hero is on the wall
      if (this.canJump || this.onWall) {
          // applying jump force
          this.hero.body.setVelocityY(-playerOptions.playerJump);

          // is the hero on a wall and this isn't the first jump (jump from ground to wall)
          // if yes then push to opposite direction
          if (this.onWall && !this.isFirstJump) {
              // flip horizontally the hero
              this.hero.flipX = !this.hero.flipX;

              // change the horizontal velocity too. This way the hero will jump off the wall
              this.hero.body.setVelocityX(playerOptions.playerSpeed * (this.hero.flipX ? -1 : 1));
          }

          // hero is not on the wall anymore
          this.onWall = false;
      }
  }

  update() {
      // hero on the ground
      if (this.hero.body.blocked.down) {
          // hero can jump
          this.canJump = true;

          // hero not on the wall
          this.onWall = false;
      }

      // hero NOT on the ground and touching a wall on the right
      if (this.hero.body.blocked.right && !this.hero.body.blocked.down) {
          // hero on a wall
          this.onWall = true;

          // drag on wall only if key pressed and going downwards.
          if (this.rightInputIsActive() && this.hero.body.velocity.y > playerOptions.playerWallDragMaxVelocity) {
              this.hero.body.setVelocityY(playerOptions.playerWallDragMaxVelocity);
          }
      }

      if (this.hero.body.blocked.left && !this.hero.body.blocked.down) {
          this.onWall = true;

          // drag on wall only if key pressed and going downwards.
          if (this.leftInputIsActive() && this.hero.body.velocity.y > playerOptions.playerWallDragMaxVelocity) {
              this.hero.body.setVelocityY(playerOptions.playerWallDragMaxVelocity);
          }
      }

      if (this.hero.body.blocked.down || this.onWall) {
          // set total jumps allowed
          this.jumps = playerOptions.playerMaxJumps;
          this.jumping = false;
      } else if (!this.jumping) {
          this.jumps = 0;
      }

      if (this.leftInputIsActive()) {
          // If the LEFT key is down, set the player velocity to move left
          this.hero.body.setAccelerationX(-playerOptions.playerAcceleration);
          this.hero.flipX = true;
      } else if (this.rightInputIsActive()) {
          // If the RIGHT key is down, set the player velocity to move right
          this.hero.body.setAccelerationX(playerOptions.playerAcceleration);
          this.hero.flipX = false;
      } else {
          this.hero.body.setAccelerationX(0);
      }

      if ((this.onWall || this.jumps > 0) && this.spaceInputIsActive(150)) {
          if (this.hero.body.blocked.down)
              this.isFirstJump = true;
          this.handleJump();
          this.jumping = true;
      }

      if (this.spaceInputReleased()) {
          this.isFirstJump = false;
      }

      if (this.jumping && this.spaceInputReleased()) {
          this.jumps--;
          this.jumping = false;
      }
  }

  spaceInputIsActive(duration) {
    // return this.input.space.downDuration(duration);
     return Phaser.Input.Keyboard.DownDuration(this.input.space, duration);
      // return (
      //     this.input.keyboard.downDuration(Phaser.Input.Keyboard.KeyCodes.SPACE, duration) ||
      //     this.pad.justPressed(Phaser.Input.Gamepad.Xbox360.A, duration)
      // );
  }

  spaceInputReleased() {
      return  Phaser.Input.Keyboard.UpDuration(this.input.space);
      // return this.input.space.isUp;
      // return (
      //     this.input.keyboard.upDuration(Phaser.Input.Keyboard.KeyCodes.SPACE) ||
      //     this.pad.justReleased(Phaser.Input.Gamepad.Xbox360.A)
      // );
  }

  rightInputIsActive() {
      return this.input.right.isDown;
      // return (
      //     this.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.RIGHT) ||
      //     this.pad.isDown(Phaser.Input.Gamepad.Xbox360.DPAD_RIGHT) ||
      //     this.pad.axis(Phaser.Input.Gamepad.Xbox360.STICK_LEFT_X) > 0.1
      // );
  }

  leftInputIsActive(duration) {
      return this.input.left.isDown;
      return (
          this.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.LEFT) ||
          this.pad.isDown(Phaser.Input.Gamepad.Xbox360.DPAD_LEFT) ||
          this.pad.axis(Phaser.Input.Gamepad.Xbox360.STICK_LEFT_X) < -0.1
      );
  }
}

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
      // console.log(this.map.widthInPixels, this.map.heightInPixels)
      this.hero = new Player(this, this.layer, this.cameras.main.width / 2, 440, "hero");
  }

  update() {
      this.hero.update();
  }
}

var gameOptions = {
  // width of the game, in pixels
  gameWidth: 640,
  // height of the game, in pixels
  gameHeight: 480,
  // background color
  bgColor: 0x444444
}


// Phaser 3 game configuration
const config = {
  type: Phaser.AUTO,
  width: gameOptions.gameWidth,
  height: gameOptions.gameHeight,
  scene: [PlayGame],
  physics: {
      default: "arcade",
      arcade: {
          gravity: { y: 900 },
          debug: true
      }
  },
  scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

// creating a new Phaser 3 game instance
const game = new Phaser.Game(config);
