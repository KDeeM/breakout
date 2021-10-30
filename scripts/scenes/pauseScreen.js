import {Button} from "/scripts/scenes/_customClasses.js";

export class PauseScreen extends Phaser.Scene{
  constructor(){
    super("pauseScreen");
    this.assets = { buttons : {}, backgrounds : {}};
  }

  init(data){
    this.pauseData = data;
  }

  create(){
    this.assets.backgrounds = {
      page : this.add.rectangle(0, 0, 360, 640, 0x74d1dc, 0.25).setOrigin(0),
      menu : this.add.rectangle(180, 320, 220, 280, 0xe46a19).setOrigin(0.5)
    }

    this.createMenu();
  }

  createMenu(){
    let fontSettings = {
      fontFamily : "FredokaOne",
      fill : "#020411",
      fontSize : "24px"
    }
    this.assets.buttons = {
      resume : new Button(this, 180, 250, "button", null).setOrigin(0.5),
      settings : new Button(this, 180, 320, "button", null).setOrigin(0.5),
      quit : new Button(this, 180, 390, "button", null).setOrigin(0.5)
    }
    this.assets.buttons.resume.addText("RESUME", fontSettings);
    this.assets.buttons.settings.addText("SETTINGS", fontSettings);
    this.assets.buttons.quit.addText("QUIT", fontSettings);
  }
  menuActions(){
    if(this.assets.buttons.resume.isDown){
      this.resumeGame();
    }
    if(this.assets.buttons.quit.isDown){
      this.quitGame();
    }
  }

  resumeGame(){
    this.scene.resume("stage", this.pauseData);
    this.scene.stop();
  }

  quitGame(){
    this.scene.launch("mainMenu");
    this.scene.stop("stage");
    this.scene.stop();
  }

  update(){
    this.menuActions();
  }

}