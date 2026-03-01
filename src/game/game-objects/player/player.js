import Phaser from 'phaser'
import { ASSET_KEYS, PLAYER_ANIMATION_KEYS } from '../../common/assets'
import { PLAYER_HURT_PUSH_BACK_SPEED, PLAYER_INVULNERABLE_AFTER_HIT_DURATION, PLAYER_SPEED } from '../../common/config'
import { CHARACTER_STATES } from '../../components/state-machine/state/character/character-states'
import { IdleState } from '../../components/state-machine/state/character/idle-state'
import { MoveState } from '../../components/state-machine/state/character/move-state'
import { CharacterGameObject } from '../common/character-game-object'
import { HurtState } from '../../components/state-machine/state/character/hurt-state'
import { flash } from '../../common/juice-utils'
import { DeathState } from '../../components/state-machine/state/character/death-state'
import { CollidingObjectsComponent } from '../../components/game-object/colliding-objects-component'
import { LiftState } from '../../components/state-machine/state/character/lift-state'
import { OpenChestState } from '../../components/state-machine/state/character/open-chest-state'
import { IdleHoldingState } from '../../components/state-machine/state/character/idle-holding-state copy'
import { MoveHoldingState } from '../../components/state-machine/state/character/move-holding-state'

export class Player extends CharacterGameObject {
  #collidingObjectsComponent

  constructor (config) {
    const animationConfig = {
      IDLE_DOWN: { key: PLAYER_ANIMATION_KEYS.IDLE_DOWN, repeat: -1, ignoreIfPlaying: true },
      IDLE_UP: { key: PLAYER_ANIMATION_KEYS.IDLE_UP, repeat: -1, ignoreIfPlaying: true },
      IDLE_RIGHT: { key: PLAYER_ANIMATION_KEYS.IDLE_SIDE, repeat: -1, ignoreIfPlaying: true },
      IDLE_LEFT: { key: PLAYER_ANIMATION_KEYS.IDLE_SIDE, repeat: -1, ignoreIfPlaying: true },
      WALK_DOWN: { key: PLAYER_ANIMATION_KEYS.WALK_DOWN, repeat: -1, ignoreIfPlaying: true },
      WALK_UP: { key: PLAYER_ANIMATION_KEYS.WALK_UP, repeat: -1, ignoreIfPlaying: true },
      WALK_RIGHT: { key: PLAYER_ANIMATION_KEYS.WALK_SIDE, repeat: -1, ignoreIfPlaying: true },
      WALK_LEFT: { key: PLAYER_ANIMATION_KEYS.WALK_SIDE, repeat: -1, ignoreIfPlaying: true },
      HURT_DOWN: { key: PLAYER_ANIMATION_KEYS.HURT_DOWN, repeat: 0, ignoreIfPlaying: true },
      HURT_UP: { key: PLAYER_ANIMATION_KEYS.HURT_UP, repeat: 0, ignoreIfPlaying: true },
      HURT_RIGHT: { key: PLAYER_ANIMATION_KEYS.HURT_SIDE, repeat: 0, ignoreIfPlaying: true },
      HURT_LEFT: { key: PLAYER_ANIMATION_KEYS.HURT_SIDE, repeat: 0, ignoreIfPlaying: true },
      DIE_DOWN: { key: PLAYER_ANIMATION_KEYS.DIE_DOWN, repeat: 0, ignoreIfPlaying: true },
      DIE_UP: { key: PLAYER_ANIMATION_KEYS.DIE_UP, repeat: 0, ignoreIfPlaying: true },
      DIE_RIGHT: { key: PLAYER_ANIMATION_KEYS.DIE_SIDE, repeat: 0, ignoreIfPlaying: true },
      DIE_LEFT: { key: PLAYER_ANIMATION_KEYS.DIE_SIDE, repeat: 0, ignoreIfPlaying: true },
      IDLE_HOLD_DOWN: { key: PLAYER_ANIMATION_KEYS.IDLE_HOLD_DOWN, repeat: -1, ignoreIfPlaying: true },
      IDLE_HOLD_UP: { key: PLAYER_ANIMATION_KEYS.IDLE_HOLD_UP, repeat: -1, ignoreIfPlaying: true },
      IDLE_HOLD_RIGHT: { key: PLAYER_ANIMATION_KEYS.IDLE_HOLD_SIDE, repeat: -1, ignoreIfPlaying: true },
      IDLE_HOLD_LEFT: { key: PLAYER_ANIMATION_KEYS.IDLE_HOLD_SIDE, repeat: -1, ignoreIfPlaying: true },
      WALK_HOLD_DOWN: { key: PLAYER_ANIMATION_KEYS.WALK_HOLD_DOWN, repeat: -1, ignoreIfPlaying: true },
      WALK_HOLD_UP: { key: PLAYER_ANIMATION_KEYS.WALK_HOLD_UP, repeat: -1, ignoreIfPlaying: true },
      WALK_HOLD_RIGHT: { key: PLAYER_ANIMATION_KEYS.WALK_HOLD_SIDE, repeat: -1, ignoreIfPlaying: true },
      WALK_HOLD_LEFT: { key: PLAYER_ANIMATION_KEYS.WALK_HOLD_SIDE, repeat: -1, ignoreIfPlaying: true },
      LIFT_DOWN: { key: PLAYER_ANIMATION_KEYS.LIFT_DOWN, repeat: 0, ignoreIfPlaying: true },
      LIFT_UP: { key: PLAYER_ANIMATION_KEYS.LIFT_UP, repeat: 0, ignoreIfPlaying: true },
      LIFT_RIGHT: { key: PLAYER_ANIMATION_KEYS.LIFT_SIDE, repeat: 0, ignoreIfPlaying: true },
      LIFT_LEFT: { key: PLAYER_ANIMATION_KEYS.LIFT_SIDE, repeat: 0, ignoreIfPlaying: true }
    }

    super({
      scene: config.scene,
      position: config.position,
      assetKey: ASSET_KEYS.PLAYER,
      frame: 0,
      id: 'player',
      isPlayer: true,
      animationConfig,
      speed: PLAYER_SPEED,
      inputComponent: config.controls,
      isInvulnerable: false,
      invulnerableAfterHitAnimationDuration: PLAYER_INVULNERABLE_AFTER_HIT_DURATION,
      maxLife: config.maxLife,
      currentLife: config.currentLife
    })

    this.#collidingObjectsComponent = new CollidingObjectsComponent(this)

    this._stateMachine.addState(new IdleState(this))
    this._stateMachine.addState(new MoveState(this))
    this._stateMachine.addState(new HurtState(this, PLAYER_HURT_PUSH_BACK_SPEED, () => {
      flash(this)
    }))
    this._stateMachine.addState(new DeathState(this))
    this._stateMachine.addState(new LiftState(this))
    this._stateMachine.addState(new OpenChestState(this))
    this._stateMachine.addState(new IdleHoldingState(this))
    this._stateMachine.addState(new MoveHoldingState(this))
    this._stateMachine.setState(CHARACTER_STATES.IDLE_STATE)

    config.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
    config.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      config.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this)
    })

    this.body.setSize(12, 16, true).setOffset(this.width / 2 - 5, this.height / 2)
  }

  collidedWithGameObject (gameObject) {
    this.#collidingObjectsComponent.add(gameObject)
  }

  update () {
    super.update()
    this.#collidingObjectsComponent.reset()
  }
}
