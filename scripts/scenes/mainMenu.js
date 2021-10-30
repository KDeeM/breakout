import {Button} from "/scripts/scenes/_customClasses.js";

export class MainMenu extends Phaser.Scene{
  constructor(){
    super("mainMenu");
    this.assets = {};
  }

  preload(){
    this.load.image("heart", "../images/heart.png")
  }
  
  create(){
    this.assets.backgrounds = {
      page : this.add.image(180, 320, "stageBackground")
    }

    this.createVirtualControls()
  }

  createVirtualControls(){
    this.assets.buttons = {
      start : this.createButton(180, 480, "button"),
      settings : this.createButton(340, 50, "cog").setOrigin(1, 0.5),
      highScore : this.createButton(280, 50, "star").setOrigin(1, 0.5).setScale(0.6)
    }

    this.assets.buttons.start.addText("Start", { fontFamily : "FredokaOne", fill : "#020411", fontSize : "24px" } );
  }
  createButton(x, y, texture){
    return new Button(this, x, y, texture, null);
  }
  virtalControlsHandler(){
    if(this.assets.buttons.start.isDown){
      this.startGame();
    }
  }

  startGame(){
    this.scene.launch("stage");
    this.scene.stop();
  }

  update(){
    this.virtalControlsHandler();
  }

  
}