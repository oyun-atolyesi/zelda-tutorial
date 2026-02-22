export class BaseGameObjectComponent {
  scene
  gameObject

  constructor (gameObject) {
    this.scene = gameObject.scene
    this.gameObject = gameObject
    this.assignComponentToObject(gameObject)
  }

  static getComponent (gameObject) {
    return gameObject[`_${this.name}`]
  }

  static removeComponent (gameObject) {
    delete gameObject[`_${this.name}`]
  }

  assignComponentToObject (object) {
    object[`_${this.constructor.name}`] = this
  }
}
