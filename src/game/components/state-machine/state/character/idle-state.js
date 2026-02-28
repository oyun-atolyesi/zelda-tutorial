import { PLAYER_ANIMATION_KEYS } from '../../../../common/assets'
import { BaseCharacterState } from './base-chaarcter-state'
import { CHARACTER_STATES } from './character-states'

export class IdleState extends BaseCharacterState {
  constructor (gameObject) {
    super(CHARACTER_STATES.IDLE_STATE, gameObject)
  }

  onEnter () {
    this._gameObject.play({ key: PLAYER_ANIMATION_KEYS.IDLE_DOWN, repeat: -1 }, true)
    this._gameObject.body.velocity.x = 0
    this._gameObject.body.velocity.y = 0
  }

  onUpdate () {
    const controls = this._gameObject.controls
    if (!(controls.isUpDown || controls.isDownDown || controls.isRightDown || controls.isLeftDown)) {
      return
    }

    this._stateMachine.setState(CHARACTER_STATES.MOVE_STATE)
  }
}
