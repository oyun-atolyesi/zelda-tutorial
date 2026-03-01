import Phaser from 'phaser'
import { BaseGameObjectComponent } from './base-game-object-component'

export class AnimationComponent extends BaseGameObjectComponent {
  #config

  constructor (gameObject, config) {
    super(gameObject)
    this.#config = config
  }

  getAnimationKey (characterAnimationKey) {
    if (this.#config[characterAnimationKey] === undefined) {
      return undefined
    }
    return this.#config[characterAnimationKey].key
  }

  playAnimation (characterAnimationKey, callback) {
    if (this.#config[characterAnimationKey] === undefined) {
      if (callback) {
        callback()
      }
      return
    }
    const animationConfig = {
      key: this.#config[characterAnimationKey].key,
      repeat: this.#config[characterAnimationKey].repeat,
      timeScale: 1
    }
    if (callback) {
      const animationKey = Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + this.#config[characterAnimationKey].key
      this.gameObject.once(animationKey, () => {
        callback()
      })
    }
    this.gameObject.play(animationConfig, this.#config[characterAnimationKey].ignoreIfPlaying)
  }

  isAnimationPlaying () {
    return this.gameObject.anims.isPlaying
  }
}
