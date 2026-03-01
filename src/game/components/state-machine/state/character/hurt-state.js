import { CHARACTER_ANIMATIONS } from '../../../../common/assets'
import { HURT_PUSH_BACK_DELAY } from '../../../../common/config'
import { DIRECTION } from '../../../../common/controls'
import { BaseCharacterState } from './base-chaarcter-state'
import { CHARACTER_STATES } from './character-states'

export class HurtState extends BaseCharacterState {
  #hurtPushBackSpeed
  #onHurtCallabck
  #nextState

  constructor (
    gameObject,
    hurtPushBackSpeed,
    onHurtCallabck = () => undefined,
    nextState = CHARACTER_STATES.IDLE_STATE
  ) {
    super(CHARACTER_STATES.HURT_STATE, gameObject)
    this.#hurtPushBackSpeed = hurtPushBackSpeed
    this.#onHurtCallabck = onHurtCallabck
    this.#nextState = nextState
  }

  onEnter (args) {
    const attackDirection = args[0]
    const body = this._gameObject.body
    body.velocity.x = 0
    body.velocity.y = 0

    switch (attackDirection) {
      case DIRECTION.DOWN:
        body.velocity.y = this.#hurtPushBackSpeed
        break
      case DIRECTION.UP:
        body.velocity.y = -this.#hurtPushBackSpeed
        break
      case DIRECTION.LEFT:
        body.velocity.x = -this.#hurtPushBackSpeed
        break
      case DIRECTION.RIGHT:
        body.velocity.x = this.#hurtPushBackSpeed
        break
      default:
        console.warn('unknown direction', attackDirection)
    }

    this._gameObject.scene.time.delayedCall(HURT_PUSH_BACK_DELAY, () => {
      body.velocity.x = 0
      body.velocity.y = 0
    })

    this._gameObject.invulnerableComponent.invulnerable = true
    this.#onHurtCallabck()

    this._gameObject.animationComponent.playAnimation(CHARACTER_ANIMATIONS.HURT_DOWN, () => {
      this.#transition()
    })
  }

  #transition () {
    this._gameObject.scene.time.delayedCall(this._gameObject.invulnerableComponent.invulnerableAfterHitAnimationDuration, () => {
      this._gameObject.invulnerableComponent.invulnerable = false
    })
    this._stateMachine.setState(this.#nextState)
  }
}
