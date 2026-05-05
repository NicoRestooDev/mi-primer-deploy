import { AUTO, Game, Scale } from "phaser";
import MatapayoScene from "./MatapayoScene.js";

export function startMatapayo(parent) {
  return new Game({
    type: AUTO,
    width: 1024,
    height: 768,
    parent,
    backgroundColor: "#028af8",
    pixelArt: true,
    roundPixels: true,
    scale: {
      mode: Scale.FIT,
      autoCenter: Scale.CENTER_BOTH,
    },
    scene: [MatapayoScene],
  });
}

export default startMatapayo;
