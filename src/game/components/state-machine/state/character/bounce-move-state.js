import Phaser from 'phaser'
import { BaseCharacterState } from './base-chaarcter-state'
import { CHARACTER_STATES } from './character-states'

export class BounceMoveState extends BaseCharacterState {
  constructor (gameObject) {
    super(CHARACTER_STATES.BOUNCE_MOVE_STATE, gameObject)
  }

  onEnter () {
    this._gameObject.animationComponent.playAnimation(`IDLE_${this._gameObject.direction}`)
    const speed = this._gameObject.speed
    const randomDirection = Phaser.Math.Between(0, 3)
    if (randomDirection === 0) {
      this._gameObject.setVelocity(speed, speed * -1)
    } else if (randomDirection === 1) {
      this._gameObject.setVelocity(speed, speed)
    } else if (randomDirection === 2) {
      this._gameObject.setVelocity(speed * -1, speed)
    } else if (randomDirection === 3) {
      this._gameObject.setVelocity(speed * -1, speed * -1)
    }
    this._gameObject.setBounce(1)
  }
}
