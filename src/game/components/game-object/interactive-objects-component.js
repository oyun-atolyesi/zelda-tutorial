import { BaseGameObjectComponent } from './base-game-object-component'

export class InteractiveObjectsComponent extends BaseGameObjectComponent {
  #objectType
  #callback
  #canInteractCheck

  constructor (gameObject, objectType, canInteractCheck = () => true, callback = () => undefined) {
    super(gameObject)
    this.#objectType = objectType
    this.#canInteractCheck = canInteractCheck
    this.#callback = callback
  }

  get objectType () {
    return this.#objectType
  }

  interact () {
    this.#callback()
  }

  canInteractWith () {
    return this.#canInteractCheck()
  }
}
