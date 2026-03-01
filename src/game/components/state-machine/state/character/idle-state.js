import { getIsMoving } from '../../../../common/controls'
import { BaseCharacterState } from './base-chaarcter-state'
import { CHARACTER_STATES } from './character-states'

export class IdleState extends BaseCharacterState {
  constructor (gameObject) {
    super(CHARACTER_STATES.IDLE_STATE, gameObject)
  }

  onEnter () {
    this._gameObject.animationComponent.playAnimation(`IDLE_${this._gameObject.direction}`)
    this._gameObject.body.velocity.x = 0
    this._gameObject.body.velocity.y = 0
  }

  onUpdate () {
    const controls = this._gameObject.controls
    if (!getIsMoving(controls)) {
      return
    }

    this._stateMachine.setState(CHARACTER_STATES.MOVE_STATE)
  }
}
