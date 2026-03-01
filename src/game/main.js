import Phaser, { AUTO, Game } from 'phaser'
import { SCENE_KEYS } from './scenes/scene-keys'
import { PreloadScene } from './scenes/preload-scene'
import { GameScene } from './scenes/game-scene'

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config = {
  type: AUTO,
  pixelArt: true,
  roundPixels: true,
  scale: {
    parent: 'game-container',
    width: 256,
    height: 224,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH
  },
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: true
    }
  }
}

const StartGame = (parent) => {
  const game = new Game({ ...config, parent })
  game.scene.add(SCENE_KEYS.PRELOAD_SCENE, PreloadScene)
  game.scene.add(SCENE_KEYS.GAME_SCENE, GameScene)
  game.scene.start(SCENE_KEYS.PRELOAD_SCENE)
  return game
}

export default StartGame
