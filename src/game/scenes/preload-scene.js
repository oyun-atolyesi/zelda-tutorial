import { Scene } from 'phaser'
import { SCENE_KEYS } from './scene-keys'
import { ASSET_KEYS, ASSET_PACK_KEYS } from '../common/assets'

export class PreloadScene extends Scene {
  constructor () {
    super({
      key: SCENE_KEYS.PRELOAD_SCENE
    })
  }

  preload () {
    this.load.pack(ASSET_PACK_KEYS.MAIN, 'assets/data/assets.json')
  }

  create () {
    this.#createAnimations()
    this.scene.start(SCENE_KEYS.GAME_SCENE)
  }

  #createAnimations () {
    this.anims.createFromAseprite(ASSET_KEYS.PLAYER)
    this.anims.createFromAseprite(ASSET_KEYS.SPIDER)
    this.anims.createFromAseprite(ASSET_KEYS.WISP)
  }
}
