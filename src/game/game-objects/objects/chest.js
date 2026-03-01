import Phaser from 'phaser'
import { ASSET_KEYS, CHEST_FRAME_KEYS } from '../../common/assets'
import { CHEST_STATE } from '../../common/objects'

export class Chest extends Phaser.Physics.Arcade.Image {
  #state
  #isBossKeyChest

  constructor (config) {
    const { scene, position, requiresBossKey, chestState } = config
    const frameKey = requiresBossKey ? CHEST_FRAME_KEYS.BIG_CHEST_CLOSED : CHEST_FRAME_KEYS.SMALL_CHEST_CLOSED
    super(scene, position.x, position.y, ASSET_KEYS.DUNGEON_OBJECTS, frameKey)

    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setOrigin(0, 1).setImmovable(true)

    this.#state = chestState || CHEST_STATE.HIDDEN
    this.#isBossKeyChest = requiresBossKey

    if (this.#isBossKeyChest) {
      this.body.setSize(32, 24).setOffset(0, 8)
    }
  }

  open () {
    if (this.#state !== CHEST_STATE.REVEALED) return

    this.#state = CHEST_STATE.OPEN
    const frameKey = this.#isBossKeyChest ? CHEST_FRAME_KEYS.BIG_CHEST_OPEN : CHEST_FRAME_KEYS.SMALL_CHEST_OPEN
    this.setFrame(frameKey)
  }
}
