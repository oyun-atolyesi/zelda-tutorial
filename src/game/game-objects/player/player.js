import Phaser from 'phaser'
import { ControlsComponent } from '../../components/game-object/controls-component'
import { StateMachine } from '../../components/state-machine/state-machine'
import { CHARACTER_STATES } from '../../components/state-machine/state/character/character-states'
import { IdleState } from '../../components/state-machine/state/character/idle-state'
import { MoveState } from '../../components/state-machine/state/character/move-state'
import { SpeedComponent } from '../../components/game-object/speed-component'
import { PLAYER_SPEED } from '../../common/config'

export class Player extends Phaser.Physics.Arcade.Sprite {
  #controlsComponent
  #speedComponent
  #stateMachine

  constructor (config) {
    const { scene, position: { x, y }, assetKey, frame, controls } = config
    super(scene, x, y, assetKey, frame || 0)

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.#controlsComponent = new ControlsComponent(this, controls)
    this.#speedComponent = new SpeedComponent(this, PLAYER_SPEED)

    this.#stateMachine = new StateMachine('player')
    this.#stateMachine.addState(new IdleState(this))
    this.#stateMachine.addState(new MoveState(this))
    this.#stateMachine.setState(CHARACTER_STATES.IDLE_STATE)

    scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this)
    })
  }

  get controls () {
    return this.#controlsComponent.controls
  }

  get speed () {
    return this.#speedComponent.speed
  }

  update () {
    this.#stateMachine.update()
  }
}
