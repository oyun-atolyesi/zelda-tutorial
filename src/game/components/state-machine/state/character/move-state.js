import { DIRECTION, getIsMoving, getIsMovingVeritcally } from '../../../../common/controls'
import { INTERACTIVE_OBJECT_TYPE } from '../../../../common/objects'
import { CollidingObjectsComponent } from '../../../game-object/colliding-objects-component'
import { InteractiveObjectsComponent } from '../../../game-object/interactive-objects-component'
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

    if (this.#checkIfObjectWasInteractedWith(controls)) return

    if (controls.isUpDown) {
      this.#updateVelocity(false, -1)
      this.#updateDirection(DIRECTION.UP)
    } else if (controls.isDownDown) {
      this.#updateVelocity(false, 1)
      this.#updateDirection(DIRECTION.DOWN)
    } else {
      this.#updateVelocity(false, 0)
    }

    if (controls.isLeftDown) {
      this._gameObject.setFlipX(true)
      this.#updateVelocity(true, -1)
      if (!getIsMovingVeritcally(controls)) {
        this.#updateDirection(DIRECTION.LEFT)
      }
    } else if (controls.isRightDown) {
      this._gameObject.setFlipX(false)
      this.#updateVelocity(true, 1)
      if (!getIsMovingVeritcally(controls)) {
        this.#updateDirection(DIRECTION.RIGHT)
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

  #updateDirection (direction) {
    this._gameObject.direction = direction
    this._gameObject.animationComponent.playAnimation(`WALK_${this._gameObject.direction}`)
  }

  #checkIfObjectWasInteractedWith (controls) {
    const collidedComponent = CollidingObjectsComponent.getComponent(this._gameObject)
    if (collidedComponent === undefined || collidedComponent.objects.length === 0) return false

    const collisionObject = collidedComponent.objects[0]
    const interactiveObjectComponent = InteractiveObjectsComponent.getComponent(collisionObject)
    if (interactiveObjectComponent === undefined) return false

    if (!controls.isActionKeyJustDown) return false

    switch (interactiveObjectComponent.objectType) {
      case INTERACTIVE_OBJECT_TYPE.PICKUP:
        this._stateMachine.setState(CHARACTER_STATES.LIFT_STATE)
        return true
      case INTERACTIVE_OBJECT_TYPE.OPEN:
        this._stateMachine.setState(CHARACTER_STATES.OPEN_CHEST_STATE)
        return true
      case INTERACTIVE_OBJECT_TYPE.AUTO:
        return false
      default:
        console.warn('unknown object type', interactiveObjectComponent.objectType)
        return false
    }
  }
}
