export class MainMenu extends Phaser.Scene{
  constructor(){
    super("mainMenu");
  }

  preload(){
    this.load.image("heart", "../images/heart.png")
  }
  
  create(){
    this.heart = this.add.image(200, 200, "heart");
  }

  
}