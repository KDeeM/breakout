import {Button, Tile, TileManager} from "/scripts/scenes/_customClasses.js";

export class Stage extends Phaser.Scene{
  constructor(){
    super("stage");
    this._variables = {
      game: {
        canChange: "true",
        changeTimeout: 300
      },
      paddleStart: {
        x : 180,
        y : 510
      },
      paddleSpeed : 200,
      maxBallSpeed : 300,
      playerScore : 0,
      levels : {
        list : ["level1"],
        loop : true,
      },
      gameCompleted: false
    }
  }

  create(){
    // background
    this.background = this.add.image(180, 320, "stageBackground");

    // the wall
    this.walls = {
        upper : this.physics.add.image(0, 0, "wall").setOrigin(0).setScale(1, 0.5).setImmovable(),
        lower : this.physics.add.image(0, 640, "wall").setOrigin(0, 1).setScale(1, 1).setImmovable()
    }
    this.createScoreText();

    // tiles
    this.levelData = this.cache.json.get("levelData");
    this.stageTiles = new TileManager(this.physics.world, this, null, null);
    this.stageTiles.setLevel(0);
    this.buildLevel();
    
    // paddle
    this.paddle = this.physics.add.sprite(this._variables.paddleStart.x, this._variables.paddleStart.y, "paddle").setScale(1).setCollideWorldBounds(true).setImmovable();
    this.anims.create(
      {
        key : "paddle_flux",
        frames : this.anims.generateFrameNumbers("paddle", {start: 0, end: 2}),
        frameRate : 10,
        repeat : -1
      }
    )
    this.paddle.anims.play("paddle_flux");

    // ball
    this.ball = this.physics.add.image(180, 360, "ball").setCollideWorldBounds(true).setBounce(1);
    this.ball.body.setCircle(12);
    this.ball.setMaxVelocity(this._variables.maxBallSpeed);
    this.ball.setState('idle');

    this.physics.add.collider(this.ball, this.walls.upper);
    this.physics.add.collider(this.ball, this.walls.lower);
    this.physics.add.collider(this.ball, this.paddle, this.transferMomentum, null, this);

    // dummy ball fn
    // this.physics.add.collider(this.ball, this.dummyTile, this.hitTile, null, this);
    this.physics.add.collider(this.ball, this.stageTiles, this.hitTile, null, this);

    // Controls 
    this.createControls();
    this.resumeHandler();
    this.reset()
  }

  update(){
    this.paddleMotion();
    if((this.controls.keyboard.SPACE.isDown || this.controls.virtual.launch.isDown) && this.ball.state == "idle"){
      this.ball.setState("running");
      this.launchBall();
    }

    if(this.controls.keyboard.P.isDown || this.controls.virtual.pause.isDown){
      this.controls.virtual.pause.isDown = false;
      this.pauseHandler();
    }
  }

  launchBall(){
    let vel = {
      x : Phaser.Math.Between(-150, 150),
      y : Phaser.Math.Between(130, 160)
    }
    this.ball.setVelocity(vel.x, vel.y);
    this.ball.setState("running")
  }

  createScoreText(){
    this.scoreText = this.add.text(20, 25, "Score: " + this._variables.playerScore, {fill : "#fff", fontFamily: "FredokaOne", fontSize: "24px" }).setOrigin(0, 0.5);
  }

  hitTile(ball, tile){
    this._variables.playerScore += tile.takeDamage();
    this.incrementScore()
    if(this.stageTiles.countActive(true) == 0){
      this.gameplayControl(true);
    }
    return;
  }

  gameplayControl(gameActive = false){
    if (gameActive) {
      // load next stage

    }else{
      // Go to Game Over Screen
    }
  }

  buildLevel(){
    let level = this.stageTiles.getLevel("level");
    this.stageTiles.createLevel(this.levelData[this._variables.levels.list[0  ]]);
  }

  incrementScore(){
    this.scoreText.setText("Score: " + this._variables.playerScore)
    return;
  }

  reset(){
    this.ball.setState("idle");
    this.paddle.setPosition(this._variables.paddleStart.x, this._variables.paddleStart.y);
    let ballPos = {
      x : this.paddle.x,
      y : this.paddle.y - (this.paddle.height / 2) - (this.ball.height / 2)
    }
    this.ball.setPosition(ballPos.x, ballPos.y);
  }

  createControls(){
    this.controls = {
      virtual : {
        left : new Button(this, 50, 590, "control_left", null).setOrigin(0.5).setScale(0.75),
        right : new Button(this, 310, 590, "control_right", null).setOrigin(0.5).setScale(0.75),
        launch : new Button(this, 180, 590, "button", null).setOrigin(0.5).setScale(0.8, 1),
        pause : new Button(this, 340, 25, "pauseButton", null).setOrigin(1, 0.5).setScale(0.8)
      },
      keyboard : this.getKeyboardKey(["p", "escape", "backspace", "space", "left", "right", "a", "d", "numpad_four", "numpad_six"])
    }
    this.controls.virtual.launch.addText("Launch", {fontSize: "32px", fill: "#020411", fontFamily : "FredokaOne"});
    this.controls.virtual.launch.setText("Launch");
  }

  paddleMotion(){
    let move = {right: false, left: false};
    if(this.controls.virtual.left.isDown || this.controls.keyboard.LEFT.isDown || this.controls.keyboard.NUMPAD_FOUR.isDown || this.controls.keyboard.A.isDown){
      move.left = true;
    }else{
      move.left = false;
    }
    if(this.controls.virtual.right.isDown || this.controls.keyboard.RIGHT.isDown || this.controls.keyboard.NUMPAD_SIX.isDown || this.controls.keyboard.D.isDown){
      move.right = true;
    }else{
      move.right = false;
    }

    if((move.right && move.left) || (!move.right && !move.left)){
      this.paddle.setVelocityX(0);
    }else if(move.right && !move.left){
      this.paddle.setVelocityX(this._variables.paddleSpeed);
    }else if(!move.right && move.left){
      this.paddle.setVelocityX(-this._variables.paddleSpeed)
    }
  }

  transferMomentum(ball, paddle){
    // if(paddle.body.velocity.x !== 0){
    //   let pVel = paddle.body.velocity.x;
    //   let trfVel = Phaser.Math.Between(pVel * 0.1, pVel * 0.3);
    //   // add it to ball x
    //   let bVel = ball.body.velocity.x + trfVel;
    //   ball.body.setVelocityX(bVel);
    // }

    // alter velocity based on proximity to center
    if (ball.state == "running"){
      let diff = paddle.x - ball.x;
      let maxOffset = 100;
      let minVelY =70;
      if (diff != 0){
        let bvel = ball.body.velocity.x + ((-diff * maxOffset) / paddle.width/2);
        ball.body.setVelocityX(bvel);
      }
      if (ball.body.velocity.y > -minVelY && ball.body.velocity.y < minVelY){
        let bvel = ball.body.velocity.y * Phaser.Math.FloatBetween(1.4, 1.9);
        ball.body.setVelocityY(bvel);
      }
    }
    if (this.ball.state == "idle"){
      ball.setPosition(paddle.x, ball.y, null, null);
    }
  }

  getKeyboardKey(keys){
    let obj = {}
    for (let i = 0; i < keys.length; i++){
      let key = keys[i].toUpperCase()
      obj[key] = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[key]);
    }
    return obj;
  }

  pauseHandler(){
    let data = this.pauseActions()
    this.scene.launch("pauseScreen", data);
    this.scene.pause();
  }
  pauseActions(){
    let data = {}

    if(this.ball.state == "running"){
      this.ball.setData("lastVelocity", {x : this.ball.body.velocity.x, y : this.ball.body.velocity.y});
      this.ball.body.stop();
    }

    return data;
  }
  resumeHandler(){
    this.events.on(
      "resume", this.resumeActions, this
    )
  }
  resumeActions(ev, data){
    if(this.ball.state == "running"){
      let bVel = this.ball.getData("lastVelocity");
      setTimeout(
        () => {this.ball.body.setVelocity(bVel.x, bVel.y)},
        2000
      )
    }
  }

  closeHandler(){
    this.events.on(
      "shutdown",  this.closeStage, this
    )
  }
  closeStage(){
    console.log("going to sleep now");
  }

}