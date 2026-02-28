import { PLAYER_ANIMATION_KEYS } from '../../../../common/assets'
import { getIsMoving, getIsMovingVeritcally } from '../../../../common/controls'
import { BaseCharacterState } from './base-chaarcter-state'
import { CHARACTER_STATES } from './character-states'

export class MoveState extends BaseCharacterState {
  constructor (gameObject) {
    super(CHARACTER_STATES.MOVE_STATE, gameObject)
  }

  onUpdate () {
    const controls = this._gameObject.controls

    if (!getIsMoving(controls)) {
      this._stateMachine.setState(CHARACTER_STATES.IDLE_STATE)
    }

    if (controls.isUpDown) {
      this._gameObject.play({ key: PLAYER_ANIMATION_KEYS.WALK_UP, repeat: -1 }, true)
      this.#updateVelocity(false, -1)
    } else if (controls.isDownDown) {
      this._gameObject.play({ key: PLAYER_ANIMATION_KEYS.WALK_DOWN, repeat: -1 }, true)
      this.#updateVelocity(false, 1)
    } else {
      this.#updateVelocity(false, 0)
    }

    if (controls.isLeftDown) {
      this._gameObject.setFlipX(true)
      this.#updateVelocity(true, -1)
      if (!getIsMovingVeritcally(controls)) {
        this._gameObject.play({ key: PLAYER_ANIMATION_KEYS.WALK_SIDE, repeat: -1 }, true)
      }
    } else if (controls.isRightDown) {
      this._gameObject.setFlipX(false)
      this.#updateVelocity(true, 1)
      if (!getIsMovingVeritcally(controls)) {
        this._gameObject.play({ key: PLAYER_ANIMATION_KEYS.WALK_SIDE, repeat: -1 }, true)
      }
    } else {
      this.#updateVelocity(true, 0)
    }

    this.#normalzieVelocity()
  }

  #updateVelocity (isX, value) {
    if (isX) {
      this._gameObject.body.velocity.x = value
      return
    }
    this._gameObject.body.velocity.y = value
  }

  #normalzieVelocity () {
    this._gameObject.body.velocity.normalize().scale(this._gameObject.speed)
  }
}
