export class InputComponent {
  #up
  #down
  #left
  #right
  #actionKey
  #attackKey
  #selectKey
  #enterKey

  constructor () {
    this.#up = false
    this.#down = false
    this.#left = false
    this.#right = false
    this.#actionKey = false
    this.#attackKey = false
    this.#selectKey = false
    this.#enterKey = false
  }

  get isUpDown () {
    return this.#up
  }

  set isUpDown (val) {
    this.#up = val
  }

  get isDownDown () {
    return this.#down
  }

  set isDownDown (val) {
    this.#down = val
  }

  get isLeftDown () {
    return this.#left
  }

  set isLeftDown (val) {
    this.#left = val
  }

  get isRightDown () {
    return this.#right
  }

  set isRightDown (val) {
    this.#right = val
  }

  get isActionKeyJustDown () {
    return this.#actionKey
  }

  set isActionKeyJustDown (val) {
    this.#actionKey = val
  }

  get isAttackKeyJustDown () {
    return this.#attackKey
  }

  set isAttackKeyJustDown (val) {
    this.#attackKey = val
  }

  get isSelectKeyJustDown () {
    return this.#selectKey
  }

  set isSelectKeyJustDown (val) {
    this.#selectKey = val
  }

  get isEnterKeyJustDown () {
    return this.#enterKey
  }

  set isEnterKeyJustDown (val) {
    this.#enterKey = val
  }

  reset () {
    this.#up = false
    this.#down = false
    this.#left = false
    this.#right = false
    this.#actionKey = false
    this.#attackKey = false
    this.#selectKey = false
    this.#enterKey = false
  }
}
