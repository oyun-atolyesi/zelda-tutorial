export class BaseCharacterState {
  _stateMachine
  _gameObject
  #name

  constructor (name, gameObject) {
    this.#name = name
    this._gameObject = gameObject
  }

  get name () {
    return this.#name
  }

  get stateMachine () {
    return this._stateMachine
  }

  set stateMachine (stateMachine) {
    this._stateMachine = stateMachine
  }
}
