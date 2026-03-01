import { BaseGameObjectComponent } from './base-game-object-component'

export class LifeComponent extends BaseGameObjectComponent {
  #maxLife
  #currentLife

  constructor (gameObject, maxLife, currentLife = maxLife) {
    super(gameObject)
    this.#maxLife = maxLife
    this.#currentLife = currentLife
  }

  get maxLife () {
    return this.#maxLife
  }

  get life () {
    return this.#currentLife
  }

  takeDamage (amount = 1) {
    if (this.#currentLife === 0) return
    this.#currentLife = Math.max(0, this.#currentLife - amount)
  }
}
