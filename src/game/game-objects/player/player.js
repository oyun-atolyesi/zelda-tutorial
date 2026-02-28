import Phaser from 'phaser'
import { PLAYER_ANIMATION_KEYS } from '../../common/assets'
import { ControlsComponent } from '../../components/game-object/controls-component'
import { StateMachine } from '../../components/state-machine/state-machine'
import { IdleState } from '../../components/state-machine/state/character/idle-state'
import { CHARACTER_STATES } from '../../components/state-machine/state/character/character-states'

export class Player extends Phaser.Physics.Arcade.Sprite {
  #controlsComponent
  #stateMachine

  constructor (config) {
    const { scene, position: { x, y }, assetKey, frame, controls } = config
    super(scene, x, y, assetKey, frame || 0)

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.#controlsComponent = new ControlsComponent(this, controls)

    this.play({ key: PLAYER_ANIMATION_KEYS.IDLE_DOWN, repeat: -1 })

    this.#stateMachine = new StateMachine('player')
    this.#stateMachine.addState(new IdleState(this))
    this.#stateMachine.setState(CHARACTER_STATES.IDLE_STATE)

    scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this)
    })
  }

  get controls () {
    return this.#controlsComponent.controls
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
    this.#stateMachine.update()
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
