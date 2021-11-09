import {MainMenu} from "https://kdeem.github.io/scripts/scenes/mainMenu.js";
import {LoadingScreen} from "https://kdeem.github.io/scripts/scenes/loadingScreen.js"
import {Stage} from "https://kdeem.github.io/scripts/scenes/stage.js"
import {PauseScreen} from "https://kdeem.github.io/scripts/scenes/pauseScreen.js"

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
  scene: [LoadingScreen, MainMenu, Stage, PauseScreen]
}

let game = new Phaser.Game(config);
