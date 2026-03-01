import { getIsMoving } from '../../../../common/controls'
import { BaseMoveState } from './base-move-state'
import { CHARACTER_STATES } from './character-states'

export class MoveHoldingState extends BaseMoveState {
  constructor (gameObject) {
    super(CHARACTER_STATES.MOVE_HOLDING_STATE, gameObject, 'WALK_HOLD')
  }

  onUpdate () {
    const controls = this._gameObject.controls

    if (controls.isActionKeyJustDown) {
      // TODO: throw item
      this._stateMachine.setState(CHARACTER_STATES.IDLE_STATE)
      return
    }

    if (!getIsMoving(controls)) {
      this._stateMachine.setState(CHARACTER_STATES.IDLE_HOLDING_STATE)
    }

    this.handleCharacterMovement()
  }
}
