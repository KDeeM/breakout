export class Button extends Phaser.GameObjects.Image{
  constructor(scene, x, y, texture, frame){
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    this.setInteractive()
      .on("pointerdown", this.clicked)
      .on("pointerup", this.cancelClick)
    this.isDown = false;
  }

  clicked(){
    this.isDown = true;
  }

  cancelClick(){
    this.isDown = false;
  }

  addText(text, textOptions = {}){
    this.btnText = this.scene.add.text(this.x, this.y, text, textOptions).setOrigin(0.5);
  }
}

export class Tile extends Phaser.Physics.Arcade.Sprite{
  constructor(scene, x, y, texture, frame, health, color){
    super(scene, x, y, texture, frame, health, color);
    this.health = health;
    this.setTint(color).setOrigin(0);
    this.init(scene);
    this.setColor();
    this.tileValue = health * 3;
  }
  
  init(scene){
    scene.physics.world.enableBody(this, Phaser.Physics.Arcade.STATIC_BODY);
    scene.add.existing(this);
  }

  takeDamage(){
    this.health -= 1;
    if(this.health <= 0){
      this.die();
      return this.tileValue;
    }else if(this.health == 1){
      this.setFrame(1);
    }
    return 0;
  }

  setColor(){
    if(this.health == 1){
      this.setTint(0xff8819);
    }else if(this.health == 2){
      this.setTint(0x7be8b9);
    }else if(this.health >= 3){
      this.setTint(0x9dabb0);
    }
  }

  die(){
    this.disableBody(true, true)
  }
}

export class TileManager extends Phaser.Physics.Arcade.StaticGroup{
  constructor(world, scene, children, config){
    super(world, scene, children, config);
    this.init(scene);
  }

  init(scene){
    scene.add.existing(this);
  }

  createLevel(levelData){
    for(let i = 0; i < levelData.length; i++){
      this.add( new Tile(this.scene, levelData[i][0], levelData[i][1], levelData[i][2], 0, levelData[i][3]));
    }
  }

  clearLevel(){
    this.clear(true, true);
  }
}

export class Stage extends Phaser.Scene{
  constructor(){
    super("stage");
    this._variables = {
      paddleStart: {
        x : 180,
        y : 510
      },
      paddleSpeed : 200,
      maxBallSpeed : 300,
      playerScore : 0,
      levels : {
        list : ["level1"],
        current : 0
      }
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

    // tiles
    this.levelData = this.cache.json.get("levelData");
    this.dummyManager = new TileManager(this.physics.world, this, null, null);
    this.dummyManager.createLevel(this.levelData[this._variables.levels.list[this._variables.levels.current]]);
    
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
    this.physics.add.collider(this.ball, this.dummyManager, this.hitTile, null, this);

    // Controls 
    this.createControls();

    this.reset()
  }

  launchBall(){
    let vel = {
      x : Phaser.Math.Between(-150, 150),
      y : Phaser.Math.Between(120, 160)
    }
    this.ball.setVelocity(vel.x, vel.y);
  }

  update(){
    this.paddleMotion();
    if((this.controls.keyboard.space.isDown || this.controls.virtual.launch.isDown) && this.ball.state == "idle"){
      this.ball.setState("running");
      this.launchBall();
    }
  }

  hitTile(ball, tile){
    this._variables.playerScore += tile.takeDamage();
    console.log(this._variables.playerScore)
  }

  reset(){
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
        launch : new Button(this, 180, 590, "button", null).setOrigin(0.5).setScale(0.8, 1)
      },
      keyboard : {
        Bspace : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes["BACKSPACE"]),
        space : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes["SPACE"]),
        left : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes["LEFT"]),
        right : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes["RIGHT"]),
        A : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes["A"]),
        D : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes["D"]),
        num_left : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes["NUMPAD_FOUR"]),
        num_right : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes["NUMPAD_RIGHT"])
      }
    }

    this.controls.virtual.launch.addText("Launch", {fontSize: "32px", fill: "#020411", fontFamily : "FredokaOne"});
  }

  paddleMotion(){
    let move = {right: false, left: false};
    if(this.controls.virtual.left.isDown || this.controls.keyboard.left.isDown || this.controls.keyboard.num_left.isDown || this.controls.keyboard.A.isDown){
      move.left = true;
    }else{
      move.left = false;
    }
    if(this.controls.virtual.right.isDown || this.controls.keyboard.right.isDown || this.controls.keyboard.num_right.isDown || this.controls.keyboard.D.isDown){
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
    let diff = paddle.x - ball.x;
    let maxOffset = 100;
    if (diff != 0){
      let bvel = ball.body.velocity.x + ((-diff * maxOffset) / paddle.width/2);
      console.log(bvel);
      ball.body.setVelocityX(bvel);
    }
  }

}