import { BaseGameObjectComponent } from './base-game-object-component'

export class SpeedComponent extends BaseGameObjectComponent {
  #speed

  constructor (gameObject, speed) {
    super(gameObject)
    this.#speed = speed
  }

  get speed () {
    return this.#speed
  }
}
