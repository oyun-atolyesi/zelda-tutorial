import { CHARACTER_ANIMATIONS } from '../../../../common/assets'
import { BaseCharacterState } from './base-chaarcter-state'
import { CHARACTER_STATES } from './character-states'

export class DeathState extends BaseCharacterState {
  #onDieCallback

  constructor (gameObject, onDieCallback = () => undefined) {
    super(CHARACTER_STATES.DEATH_STATE, gameObject)
    this.#onDieCallback = onDieCallback
  }

  onEnter () {
    const body = this._gameObject.body
    body.velocity.x = 0
    body.velocity.y = 0

    this._gameObject.invulnerableComponent.invulnerable = true
    this._gameObject.body.enable = false
    this._gameObject.animationComponent.playAnimation(CHARACTER_ANIMATIONS.DIE_DOWN, () => {
      this.#triggerDefeatedEvent()
    })
  }

  #triggerDefeatedEvent () {
    this._gameObject.disableObject()
    this.#onDieCallback()
  }
}
