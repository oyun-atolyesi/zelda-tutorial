import Phaser from 'phaser'
import { ControlsComponent } from '../../components/game-object/controls-component'
import { StateMachine } from '../../components/state-machine/state-machine'
import { CHARACTER_STATES } from '../../components/state-machine/state/character/character-states'
import { IdleState } from '../../components/state-machine/state/character/idle-state'
import { MoveState } from '../../components/state-machine/state/character/move-state'
import { SpeedComponent } from '../../components/game-object/speed-component'
import { PLAYER_SPEED } from '../../common/config'
import { DirectionComponent } from '../../components/game-object/direction-component'
import { AnimationComponent } from '../../components/game-object/animation-component'
import { PLAYER_ANIMATION_KEYS } from '../../common/assets'

export class Player extends Phaser.Physics.Arcade.Sprite {
  #controlsComponent
  #speedComponent
  #directionComponent
  #animationComponent
  #stateMachine

  constructor (config) {
    const { scene, position: { x, y }, assetKey, frame, controls } = config
    super(scene, x, y, assetKey, frame || 0)

    scene.add.existing(this)
    scene.physics.add.existing(this)

    const animationConfig = {
      IDLE_DOWN: { key: PLAYER_ANIMATION_KEYS.IDLE_DOWN, repeat: -1, ignoreIfPlaying: true },
      IDLE_UP: { key: PLAYER_ANIMATION_KEYS.IDLE_UP, repeat: -1, ignoreIfPlaying: true },
      IDLE_RIGHT: { key: PLAYER_ANIMATION_KEYS.IDLE_SIDE, repeat: -1, ignoreIfPlaying: true },
      IDLE_LEFT: { key: PLAYER_ANIMATION_KEYS.IDLE_SIDE, repeat: -1, ignoreIfPlaying: true },
      WALK_DOWN: { key: PLAYER_ANIMATION_KEYS.WALK_DOWN, repeat: -1, ignoreIfPlaying: true },
      WALK_UP: { key: PLAYER_ANIMATION_KEYS.WALK_UP, repeat: -1, ignoreIfPlaying: true },
      WALK_RIGHT: { key: PLAYER_ANIMATION_KEYS.WALK_SIDE, repeat: -1, ignoreIfPlaying: true },
      WALK_LEFT: { key: PLAYER_ANIMATION_KEYS.WALK_SIDE, repeat: -1, ignoreIfPlaying: true }
    }

    this.#controlsComponent = new ControlsComponent(this, controls)
    this.#speedComponent = new SpeedComponent(this, PLAYER_SPEED)
    this.#directionComponent = new DirectionComponent(this)
    this.#animationComponent = new AnimationComponent(this, animationConfig)
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

  get direction () {
    return this.#directionComponent.direction
  }

  set direction (direction) {
    this.#directionComponent.direction = direction
  }

  get animationComponent () {
    return this.#animationComponent
  }

  update () {
    this.#stateMachine.update()
  }
}
