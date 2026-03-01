import Phaser from 'phaser'
import { ASSET_KEYS } from '../../common/assets'

export class Pot extends Phaser.Physics.Arcade.Sprite {
  #position

  constructor (config) {
    const { scene, position } = config
    super(scene, position.x, position.y, ASSET_KEYS.POT, 0)

    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setOrigin(0, 1).setImmovable(true)

    this.#position = { x: position.x, y: position.y }
  }
}
