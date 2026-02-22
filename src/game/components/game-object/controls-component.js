import { BaseGameObjectComponent } from './base-game-object-component'

export class ControlsComponent extends BaseGameObjectComponent {
  #inputComponent

  constructor (gameObject, inputComponent) {
    super(gameObject)
    this.#inputComponent = inputComponent
  }

  get controls () {
    return this.#inputComponent
  }
}
