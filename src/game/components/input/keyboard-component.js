import Phaser from 'phaser'
import { InputComponent } from './input-component'

export class KeyboardComponent extends InputComponent {
  #cursorKeys
  #attackKey
  #actionKey
  #enterKey

  constructor (keyboardPlugin) {
    super()
    this.#cursorKeys = keyboardPlugin.createCursorKeys()
    this.#attackKey = keyboardPlugin.addKey(Phaser.Input.Keyboard.KeyCodes.Z)
    this.#actionKey = keyboardPlugin.addKey(Phaser.Input.Keyboard.KeyCodes.X)
    this.#enterKey = keyboardPlugin.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
  }

  get isUpDown () {
    return this.#cursorKeys.up.isDown
  }

  get isUpJustDown () {
    return Phaser.Input.Keyboard.JustDown(this.#cursorKeys.up)
  }

  get isDownDown () {
    return this.#cursorKeys.down.isDown
  }

  get isDownJustDown () {
    return Phaser.Input.Keyboard.JustDown(this.#cursorKeys.down)
  }

  get isLeftDown () {
    return this.#cursorKeys.left.isDown
  }

  get isRightDown () {
    return this.#cursorKeys.right.isDown
  }

  get isAttackKeyJustDown () {
    return Phaser.Input.Keyboard.JustDown(this.#attackKey)
  }

  get isSelectKeyJustDown () {
    return Phaser.Input.Keyboard.JustDown(this.#cursorKeys.shift)
  }

  get isActionKeyJustDown () {
    return Phaser.Input.Keyboard.JustDown(this.#actionKey)
  }

  get isEnterKeyJustDown () {
    return Phaser.Input.Keyboard.JustDown(this.#enterKey)
  }
}
