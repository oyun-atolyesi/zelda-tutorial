import Phaser from 'phaser'
import { PLAYER_ANIMATION_KEYS } from '../../common/assets'
import { ControlsComponent } from '../../components/game-object/controls-component'

export class Player extends Phaser.Physics.Arcade.Sprite {
  #controlsComponent

  constructor (config) {
    const { scene, position: { x, y }, assetKey, frame, controls } = config
    super(scene, x, y, assetKey, frame || 0)

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.#controlsComponent = new ControlsComponent(this, controls)

    this.play({ key: PLAYER_ANIMATION_KEYS.IDLE_DOWN, repeat: -1 })

    scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this)
    })
  }

  update () {
    const controls = this.#controlsComponent.controls
    const isMovingVertically = controls.isUpDown || controls.isDownDown
    const isMoving = controls.isUpDown || controls.isDownDown || controls.isRightDown || controls.isLeftDown

    if (controls.isUpDown) {
      this.play({ key: PLAYER_ANIMATION_KEYS.WALK_UP, repeat: -1 }, true)
      this.#updateVelocity(false, -1)
    } else if (controls.isDownDown) {
      this.play({ key: PLAYER_ANIMATION_KEYS.WALK_DOWN, repeat: -1 }, true)
      this.#updateVelocity(false, 1)
    } else {
      this.#updateVelocity(false, 0)
    }

    if (controls.isLeftDown) {
      this.setFlipX(true)
      this.#updateVelocity(true, -1)
      if (!isMovingVertically) {
        this.play({ key: PLAYER_ANIMATION_KEYS.WALK_SIDE, repeat: -1 }, true)
      }
    } else if (controls.isRightDown) {
      this.setFlipX(false)
      this.#updateVelocity(true, 1)
      if (!isMovingVertically) {
        this.play({ key: PLAYER_ANIMATION_KEYS.WALK_SIDE, repeat: -1 }, true)
      }
    } else {
      this.#updateVelocity(true, 0)
    }

    if (!isMoving) {
      this.play({ key: PLAYER_ANIMATION_KEYS.IDLE_DOWN, repeat: -1 }, true)
    }

    this.#normalzieVelocity()
  }

  #updateVelocity (isX, value) {
    if (isX) {
      this.body.velocity.x = value
      return
    }
    this.body.velocity.y = value
  }

  #normalzieVelocity () {
    this.body.velocity.normalize().scale(80)
  }
}
