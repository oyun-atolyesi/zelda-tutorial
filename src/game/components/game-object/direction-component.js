import { DIRECTION } from '../../common/controls'
import { BaseGameObjectComponent } from './base-game-object-component'

export class DirectionComponent extends BaseGameObjectComponent {
  #direction
  #callback

  constructor (gameObject, onDirectionCallback = () => undefined) {
    super(gameObject)
    this.#direction = DIRECTION.DOWN
    this.#callback = onDirectionCallback
  }

  get direction () {
    return this.#direction
  }

  set direction (direction) {
    this.#direction = direction
    this.#callback(this.#direction)
  }
}
