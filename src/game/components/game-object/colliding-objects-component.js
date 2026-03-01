import { BaseGameObjectComponent } from './base-game-object-component'

export class CollidingObjectsComponent extends BaseGameObjectComponent {
  #objects

  constructor (gameObject) {
    super(gameObject)
    this.#objects = []
  }

  get objects () {
    return this.#objects
  }

  add (gameObject) {
    this.#objects.push(gameObject)
  }

  reset () {
    this.#objects = []
  }
}
