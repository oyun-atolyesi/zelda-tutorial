import { getIsMoving } from '../../../../common/controls'
import { INTERACTIVE_OBJECT_TYPE } from '../../../../common/objects'
import { CollidingObjectsComponent } from '../../../game-object/colliding-objects-component'
import { InteractiveObjectsComponent } from '../../../game-object/interactive-objects-component'
import { BaseMoveState } from './base-move-state'
import { CHARACTER_STATES } from './character-states'

export class MoveState extends BaseMoveState {
  constructor (gameObject) {
    super(CHARACTER_STATES.MOVE_STATE, gameObject, 'WALK')
  }

  onUpdate () {
    const controls = this._gameObject.controls

    if (!getIsMoving(controls)) {
      this._stateMachine.setState(CHARACTER_STATES.IDLE_STATE)
    }

    if (this.#checkIfObjectWasInteractedWith(controls)) return

    this.handleCharacterMovement()
  }

  #checkIfObjectWasInteractedWith (controls) {
    const collidedComponent = CollidingObjectsComponent.getComponent(this._gameObject)
    if (collidedComponent === undefined || collidedComponent.objects.length === 0) return false

    const collisionObject = collidedComponent.objects[0]
    const interactiveObjectComponent = InteractiveObjectsComponent.getComponent(collisionObject)
    if (interactiveObjectComponent === undefined) return false

    if (!controls.isActionKeyJustDown) return false

    if (!interactiveObjectComponent.canInteractWith()) return false
    interactiveObjectComponent.interact()

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
