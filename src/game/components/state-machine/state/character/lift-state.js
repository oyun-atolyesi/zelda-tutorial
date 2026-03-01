import { BaseCharacterState } from './base-chaarcter-state'
import { CHARACTER_STATES } from './character-states'

export class LiftState extends BaseCharacterState {
  constructor (gameObject) {
    super(CHARACTER_STATES.LIFT_STATE, gameObject)
  }

  onEnter () {
    this._gameObject.body.velocity.x = 0
    this._gameObject.body.velocity.y = 0

    this._gameObject.animationComponent.playAnimation(`LIFT_${this._gameObject.direction}`)
  }

  onUpdate () {
    if (this._gameObject.animationComponent.isAnimationPlaying()) return
    this._stateMachine.setState(CHARACTER_STATES.IDLE_HOLDING_STATE)
  }
}
