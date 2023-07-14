var playerOptions = {
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
export default class Player {
  constructor(scene, layerTiles, x, y, playerColor, joystick) {
    this.scene = scene;
    this.layer = layerTiles;

    this.joystick = joystick;
    this.jumpKeyIsDown = false;
    this.jumpKeyDownAt = 0;

    // adding the hero sprite and replace it's color with playerColor
    this.hero = scene.physics.add.sprite(x, y, "hero");
    scene.plugins.get('rexColorReplacePipeline').add(this.hero, {
      originalColor: 0x2B2FDA,
      newColor: playerColor,
      epsilon: 0.4
    });
    // this.hero = scene.add.rectangle(x, y, 20, 20, playerColor);
    
    scene.physics.add.existing(this.hero);

    // scene.physics.world.addCollider(this.hero, scene.layer);
    scene.physics.add.collider(this.hero, scene.layer);
    // scene.physics.add.collider(this.hero, scene.layer, null, null, this);

    // setting hero anchor point
    this.hero.setOrigin(0.5);

    this.hero.body.setCollideWorldBounds(true);

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

  pos(){
    return { x: this.hero.body.x, y: this.hero.body.y };
  }

  setPos(x, y) {
    this.hero.body.x = x;
    this.hero.body.y = y;
  }

  body(){
    return this.hero.body;
  }

  destroy(){
    this.hero.destroy();
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
    if (!this.jumpKeyIsDown && this.joystick.isPressed("jump")) {
      this.jumpKeyIsDown = true;
      this.jumpKeyDownAt = Date.now();
    }
    return this.jumpKeyIsDown && ((Date.now() - this.jumpKeyDownAt) < duration);
  }

  spaceInputReleased() {
    if (!this.joystick.isPressed("jump")) {
      this.jumpKeyIsDown = false;
      return true;
    }
    return false;
  }

  rightInputIsActive() {
    return this.joystick.dpad().x === "right";
  }

  leftInputIsActive() {
    return this.joystick.dpad().x === "left";
  }
}