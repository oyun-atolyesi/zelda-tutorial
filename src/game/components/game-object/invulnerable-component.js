import { BaseGameObjectComponent } from './base-game-object-component'
export class InvulnerableComponent extends BaseGameObjectComponent {
  #invulnerable
  #invulnerableAfterHitAnimationDuration

  constructor (gameObject, invulnerable = false, invulnerableAfterHitAnimationDuration = 0) {
    super(gameObject)
    this.#invulnerable = invulnerable
    this.#invulnerableAfterHitAnimationDuration = invulnerableAfterHitAnimationDuration
  }

  get invulnerable () {
    return this.#invulnerable
  }

  set invulnerable (value) {
    this.#invulnerable = value
  }

  get invulnerableAfterHitAnimationDuration () {
    return this.#invulnerableAfterHitAnimationDuration
  }
}
