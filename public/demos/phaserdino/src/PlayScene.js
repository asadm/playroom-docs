// import Phaser from 'phaser';
const { onPlayerJoin, insertCoin, isHost, myPlayer, setState, getState, Joystick } = Playroom;
class PlayScene extends Phaser.Scene {

  constructor() {
    super('PlayScene');
  }

  async create() {
    await insertCoin();
    const { height, width } = this.game.config;
    this.gameSpeed = 10;
    this.isGameRunning = false;
    this.respawnTime = 0;
    this.score = 0;

    this.jumpSound = this.sound.add('jump', {volume: 0.2});
    this.hitSound = this.sound.add('hit', {volume: 0.2});
    this.reachSound = this.sound.add('reach', {volume: 0.2});

    this.startTrigger = this.physics.add.sprite(0, 10).setOrigin(0, 1).setImmovable();
    this.ground = this.add.tileSprite(0, height, 88, 26, 'ground').setOrigin(0, 1)
    this.dino = this.physics.add.sprite(0, height, 'dino-idle')
      .setCollideWorldBounds(true)
      .setGravityY(5000)
      .setBodySize(44, 92)
      .setDepth(1)
      .setOrigin(0, 1);

    this.scoreText = this.add.text(width, 0, "00000", {fill: "#535353", font: '900 35px Courier', resolution: 5})
      .setOrigin(1, 0)
      .setAlpha(0);

    this.highScoreText = this.add.text(0, 0, "00000", {fill: "#535353", font: '900 35px Courier', resolution: 5})
      .setOrigin(1, 0)
      .setAlpha(0);

      this.environment = this.add.group();
      this.environment.addMultiple([
        this.add.image(width / 2, 170, 'cloud'),
        this.add.image(width - 80, 80, 'cloud'),
        this.add.image((width / 1.3), 100, 'cloud')
      ]);
      this.environment.setAlpha(0);

    this.gameOverScreen = this.add.container(width / 2, height / 2 - 50).setAlpha(0)
    this.gameOverText = this.add.image(0, 0, 'game-over');
    this.restart = this.add.image(0, 80, 'restart').setInteractive();
    this.gameOverScreen.add([
      this.gameOverText,  this.restart
    ])

    this.obstacles = this.physics.add.group();
    this.currentObstacleIds = [];

    this.initAnims();
    this.initStartTrigger();
    this.initColliders();
    this.handleInputs();
    this.handleScore();

    this.otherDinosContainer = this.physics.add.group();
    this.otherDinos = [];
    const joystickConfig = {
      type: "dpad",
      buttons: [
        {id: "jump", label: "Jump"},
        {id: "crouch", label: "Crouch"}
      ]
    }
    this.myJoystick = new Joystick(myPlayer(), joystickConfig);

    onPlayerJoin(state=>{
      if (state.id === myPlayer().id) { return; }
      const joystick = new Joystick(state, joystickConfig);
      const sprite = this.otherDinosContainer.create(0, height, 'dino-idle');
      sprite.alpha = 0.6;
      this.otherDinos.push({state, sprite, joystick});
      state.onQuit(()=>{
        this.otherDinos = this.otherDinos.filter(({state: s})=>s.id !== state.id);
        this.otherDinosContainer.killAndHide(sprite);
      })
    });
  }

  initColliders() {
    this.physics.add.collider(this.dino, this.obstacles, () => {
      this.highScoreText.x = this.scoreText.x - this.scoreText.width - 20;

      const highScore = this.highScoreText.text.substr(this.highScoreText.text.length - 5);
      const newScore = Number(this.scoreText.text) > Number(highScore) ? this.scoreText.text : highScore;

      this.highScoreText.setText('HI ' + newScore);
      this.highScoreText.setAlpha(1);

      // this.physics.pause();
      // this.isGameRunning = false;
      this.anims.pauseAll();
      this.dino.setTexture('dino-hurt');
      this.respawnTime = 0;
      this.gameSpeed = 10;
      this.gameOverScreen.setAlpha(1);
      this.score = 0;
      this.hitSound.play();
    }, null, this);
  }

  initStartTrigger() {
    const { width, height } = this.game.config;
    this.physics.add.overlap(this.startTrigger, this.dino, () => {
      if (this.startTrigger.y === 10) {
        this.startTrigger.body.reset(0, height);
        return;
      }

      this.startTrigger.disableBody(true, true);

      const startEvent =  this.time.addEvent({
        delay: 1000/60,
        loop: true,
        callbackScope: this,
        callback: () => {
          this.dino.setVelocityX(80);
          this.dino.play('dino-run', 1);

          if (this.ground.width < width) {
            this.ground.width += 17 * 2;
          }

          if (this.ground.width >= this.game.config.width) {
            this.ground.width = width;
            this.isGameRunning = true;
            this.dino.setVelocityX(0);
            this.scoreText.setAlpha(1);
            this.environment.setAlpha(1);
            startEvent.remove();
          }
        }
      });
    }, null, this)

    setState('obstacles', undefined);
    console.log("clearing")

    // jump!
    this.jumpSound.play();
    this.dino.body.height = 92;
    this.dino.body.offset.y = 0;
    this.dino.setVelocityY(-1600);
    this.dino.setTexture('dino', 0);
  }

  initAnims() {
    this.anims.create({
      key: 'dino-run',
      frames: this.anims.generateFrameNumbers('dino', {start: 2, end: 3}),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'dino-down-anim',
      frames: this.anims.generateFrameNumbers('dino-down', {start: 0, end: 1}),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'enemy-dino-fly',
      frames: this.anims.generateFrameNumbers('enemy-bird', {start: 0, end: 1}),
      frameRate: 6,
      repeat: -1
    })
  }

  handleScore() {
    this.time.addEvent({
      delay: 1000/10,
      loop: true,
      callbackScope: this,
      callback: () => {
        if (!this.isGameRunning) { return; }

        this.score++;
        this.gameSpeed += 0.01

        if (this.score % 100 === 0) {
          this.reachSound.play();

          this.tweens.add({
            targets: this.scoreText,
            duration: 100,
            repeat: 3,
            alpha: 0,
            yoyo: true
          })
        }

        const score = Array.from(String(this.score), Number);
        for (let i = 0; i < 5 - String(this.score).length; i++) {
          score.unshift(0);
        }

        this.scoreText.setText(score.join(''));
      }
    })
  }

  handleInputs() {
    this.restart.on('pointerdown', () => {
      this.dino.setVelocityY(0);
      this.dino.body.height = 92;
      this.dino.body.offset.y = 0;
      this.physics.resume();
      this.obstacles.clear(true, true);
      this.isGameRunning = true;
      this.gameOverScreen.setAlpha(0);
      this.anims.resumeAll();
    })

    this.input.keyboard.on('keydown_SPACE', () => {
      if (!this.dino.body.onFloor() || this.dino.body.velocity.x > 0) { return; }

      this.jumpSound.play();
      this.dino.body.height = 92;
      this.dino.body.offset.y = 0;
      this.dino.setVelocityY(-1600);
      this.dino.setTexture('dino', 0);
    })

    this.input.keyboard.on('keydown_DOWN', () => {
      if (!this.dino.body.onFloor() || !this.isGameRunning) { return; }

      this.dino.body.height = 58;
      this.dino.body.offset.y = 34;
    })

    this.input.keyboard.on('keyup_DOWN', () => {
      if ((this.score !== 0 && !this.isGameRunning)) { return; }

      this.dino.body.height = 92;
      this.dino.body.offset.y = 0;
    })
  }

  placeObstacleHost(){
    const obstacleNum = Math.floor(Math.random() * 7) + 1;
    const distance = Phaser.Math.Between(600, 900);
    const randomStringId = Math.random().toString(36).substring(7);
    let currentEnemyHeight = 0;
    if (obstacleNum > 6) {
      const enemyHeight = [20, 50];
      currentEnemyHeight = enemyHeight[Math.floor(Math.random() * 2)];
    }
    const obstacle = {
      id: randomStringId,
      x: distance,
      y: currentEnemyHeight,
      type: obstacleNum,
    }
    const obstacles = getState('obstacles') || [];
    obstacles.push(obstacle);
    setState('obstacles', obstacles);
  }

  placeObstacle(data) {
    let obstacle;
    const obstacleNum = data.type;
    const enemyHeight = data.y;
    const distance = data.x;
    if (obstacleNum > 6) {
      obstacle = this.obstacles.create(this.game.config.width + distance, this.game.config.height - enemyHeight, `enemy-bird`)
        .setOrigin(0, 1)
        obstacle.play('enemy-dino-fly', 1);
      obstacle.body.height = obstacle.body.height / 1.5;
    } else {
      console.log("obstacleNum", `obstacle-${obstacleNum}`);
      obstacle = this.obstacles.create(this.game.config.width + distance, this.game.config.height, `obstacle-${obstacleNum}`)
        .setOrigin(0, 1);

      obstacle.body.offset.y = +10;
    }

    obstacle._obstacleId = data.id;

    obstacle.setImmovable();

    this.currentObstacleIds.push(obstacle._obstacleId);
    console.log("currentObstacleIds", this.currentObstacleIds)
  }

  update(time, delta) {
    if (!this.isGameRunning) { return; }

    if (this.myJoystick.isPressed('jump') && !this.keyJumpIsDown){
      this.keyJumpIsDown = true;
      if (!this.dino.body.onFloor() || this.dino.body.velocity.x > 0) { return; }

      this.jumpSound.play();
      this.dino.body.height = 92;
      this.dino.body.offset.y = 0;
      this.dino.setVelocityY(-1600);
      this.dino.setTexture('dino', 0);
    }
    else if (!this.myJoystick.isPressed('jump')){
      this.keyJumpIsDown = false;
    }

    const obstacles = getState('obstacles') || [];
    obstacles.forEach(obstacle => {
      // console.log("obstacle", this.currentObstacleIds)
      if (this.currentObstacleIds.indexOf(obstacle.id)===-1) {
        this.placeObstacle(obstacle);
      }
    });

    this.ground.tilePositionX += this.gameSpeed;
    Phaser.Actions.IncX(this.obstacles.getChildren(), -this.gameSpeed);
    Phaser.Actions.IncX(this.environment.getChildren(), - 0.5);

    this.respawnTime += delta * this.gameSpeed * 0.08;
    if (this.respawnTime >= 1500) {
      if (isHost()){
        console.log("place obstacle")
        this.placeObstacleHost();
        this.respawnTime = 0;
      }
    }

    this.obstacles.getChildren().forEach(obstacle => {
      if (obstacle.getBounds().right < 0) {
        this.obstacles.killAndHide(obstacle);
        // console.log("updating currentObstacleIds", this.currentObstacleIds);
        // this.currentObstacleIds = this.currentObstacleIds.filter(id => id !== obstacle._obstacleId);
        // console.log("updated currentObstacleIds", this.currentObstacleIds);
        if (isHost()){
          const obstacles = getState('obstacles') || [];
          const newObstacles = obstacles.filter(obs => obs.id !== obstacle._obstacleId);
          setState('obstacles', newObstacles);
        }
      }
    })

    this.environment.getChildren().forEach(env => {
      if (env.getBounds().right < 0) {
        env.x = this.game.config.width + 30;
      }
    })

    if (this.dino.body.deltaAbsY() > 0) {
      this.dino.anims.stop();
      this.dino.setTexture('dino', 0);
    } else {
      this.dino.body.height <= 58 ? this.dino.play('dino-down-anim', true) : this.dino.play('dino-run', true);
    }

    myPlayer().setState('pos', [this.dino.body.x, this.dino.body.y]);
    myPlayer().setState('anim', this.dino.anims.currentAnim.key);
    this.otherDinos.forEach(({state, sprite}) => {
      const pos =  state.getState('pos') || [0, 0];
      sprite.body.x = pos[0];
      sprite.body.y = pos[1];
      sprite.anims.play(state.getState('anim'), true);
    });
  }
}

export default PlayScene;
