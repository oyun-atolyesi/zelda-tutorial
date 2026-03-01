import { Scene } from 'phaser'
import { SCENE_KEYS } from './scene-keys'
import { ASSET_KEYS } from '../common/assets'
import { Player } from '../game-objects/player/player'
import { KeyboardComponent } from '../components/input/keyboard-component'
import { Spider } from '../game-objects/enemies/spider'

export class GameScene extends Scene {
  #controls
  #player
  #spider

  constructor () {
    super({
      key: SCENE_KEYS.GAME_SCENE
    })
  }

  create () {
    if (!this.input.keyboard) {
      console.warn('Enable keyboard plugin')
      return
    }

    this.#controls = new KeyboardComponent(this.input.keyboard)
    this.add
      .text(this.scale.width / 2, this.scale.height / 2, 'Game Scene', { fontFamily: ASSET_KEYS.FONT_PRESS_START_2P })
      .setOrigin(0.5)
    this.#player = new Player({
      scene: this,
      position: { x: this.scale.width / 2, y: this.scale.height / 2 },
      controls: this.#controls
    })

    this.#spider = new Spider({
      scene: this,
      position: { x: this.scale.width / 2, y: this.scale.height / 2 + 50 }
    })
    this.#spider.setCollideWorldBounds(true)
  }

  update () {
    this.#spider.update()
  }
}
