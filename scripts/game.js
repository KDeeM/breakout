import {MainMenu} from "/scripts/scenes/mainMenu.js";
import {LoadingScreen} from "/scripts/scenes/loadingScreen.js"
import {Button, Stage} from "/scripts/scenes/stage.js"

const gameCanvas = document.querySelector("#gameCanvas");
let config = {
  width: 360,
  height: 640,
  type: Phaser.AUTO,
  scale : {
    mode : Phaser.Scale.FIT,
    autoCenter : Phaser.Scale.CENTER_BOTH
  },
  physics : {
    default: 'arcade',
    arcade: {
      debug : true
    }
  },
  scene: [LoadingScreen, MainMenu, Stage]
}

let game = new Phaser.Game(config);