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

export class Player extends CharacterGameObject {
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
      DIE_LEFT: { key: PLAYER_ANIMATION_KEYS.DIE_SIDE, repeat: 0, ignoreIfPlaying: true }
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

    this._stateMachine.addState(new IdleState(this))
    this._stateMachine.addState(new MoveState(this))
    this._stateMachine.addState(new HurtState(this, PLAYER_HURT_PUSH_BACK_SPEED, () => {
      flash(this)
    }))
    this._stateMachine.addState(new DeathState(this))
    this._stateMachine.setState(CHARACTER_STATES.IDLE_STATE)

    config.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
    config.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      config.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this)
    })

    this.body.setSize(12, 16, true).setOffset(this.width / 2 - 5, this.height / 2)
  }
}
