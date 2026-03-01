import { CUSTOM_EVENTS, EVENT_BUS } from '../../../../common/event-bus'
import { BaseCharacterState } from './base-chaarcter-state'
import { CHARACTER_STATES } from './character-states'

export class OpenChestState extends BaseCharacterState {
  constructor (gameObject) {
    super(CHARACTER_STATES.OPEN_CHEST_STATE, gameObject)
  }

  onEnter (args) {
    const chest = args[0]

    this._gameObject.body.velocity.x = 0
    this._gameObject.body.velocity.y = 0

    this._gameObject.animationComponent.playAnimation(`LIFT_${this._gameObject.direction}`, () => {
      EVENT_BUS.emit(CUSTOM_EVENTS.OPENED_CHEST, chest)
      this._stateMachine.setState(CHARACTER_STATES.IDLE_STATE)
    })
  }
}
