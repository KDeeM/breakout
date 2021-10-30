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
    return;
  }

  setText(text){
    this.btnText.setText(text);
    return;
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
    this._level_ = 0;
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

  setLevel(val){
    this._level_ = val;
    return;
  }

  getLevel(){
    return this._level_;
  }

  _clearLevel(){
    this.children.iterate(
      (tile) => {
        tile.die();
      }
    )
  }
}