export class LoadingScreen extends Phaser.Scene{
  constructor(){
    super("loadingScreen");
  }

  preload(){
    let spriteList = [
      ["paddle", "../images/paddle.png", [ 72, 19]],
      ["tile_6", "../images/tile_6.png", [ 53, 18]],
      ["tile_8", "../images/tile_8.png", [ 38, 13]]
    ]
    this.loadSprites(spriteList);
    let images = [
      ["stageBackground", "../images/stageBackground.jpg"],
      ["ball", "../images/ball.png"],
      ["wall", "../images/wall.jpg"],
      ["control_left", "../images/ui/left_3.png"],
      ["control_right", "../images/ui/right_3.png"],
      ["button", "../images/ui/button.png"]
    ]
    this.loadImage(images);
    this.load.json("levelData", "../data/levels.json");
  }

  create(){
    this.label = this.add.text(360 / 2, 640 / 2, "Loading Screen", {fontSize: "36px", fill : "#fff"}).setOrigin(0.5);
    setTimeout(
      () => {
        this.scene.start("stage");
      }, 1000
    )
  }

  loadSprites(sprites){
    for (let i = 0; i < sprites.length; i++){
      this.load.spritesheet( sprites[i][0], sprites[i][1], { frameWidth : sprites[i][2][0], frameHeight: sprites[i][2][1]});
    }
  }

  loadImage(images){
    for (let i = 0; i < images.length; i++){
      this.load.image(images[i][0], images[i][1]);
    }
  }

}