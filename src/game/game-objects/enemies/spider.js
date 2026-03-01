import Phaser from 'phaser'
import { ASSET_KEYS, SPIDER_ANIMATION_KEYS } from '../../common/assets'
import { ENEMY_SPIDER_CHANGE_DIRECTION_DELAY_MAX, ENEMY_SPIDER_CHANGE_DIRECTION_DELAY_MIN, ENEMY_SPIDER_HURT_PUSH_BACK_SPEED, ENEMY_SPIDER_SPEED, PLAYER_HURT_PUSH_BACK_SPEED } from '../../common/config'
import { DIRECTION } from '../../common/controls'
import { InputComponent } from '../../components/input/input-component'
import { CHARACTER_STATES } from '../../components/state-machine/state/character/character-states'
import { IdleState } from '../../components/state-machine/state/character/idle-state'
import { MoveState } from '../../components/state-machine/state/character/move-state'
import { CharacterGameObject } from '../common/character-game-object'
import { HurtState } from '../../components/state-machine/state/character/hurt-state'

export class Spider extends CharacterGameObject {
  constructor (config) {
    const walkAnimConfig = { key: SPIDER_ANIMATION_KEYS.WALK, repeat: -1, ignoreIfPlaying: true }
    const hurtAnimConfig = { key: SPIDER_ANIMATION_KEYS.HIT, repeat: 0, ignoreIfPlaying: true }
    const animationConfig = {
      IDLE_DOWN: walkAnimConfig,
      IDLE_UP: walkAnimConfig,
      IDLE_RIGHT: walkAnimConfig,
      IDLE_LEFT: walkAnimConfig,
      WALK_DOWN: walkAnimConfig,
      WALK_UP: walkAnimConfig,
      WALK_RIGHT: walkAnimConfig,
      WALK_LEFT: walkAnimConfig,
      HURT_DOWN: hurtAnimConfig,
      HURT_UP: hurtAnimConfig,
      HURT_RIGHT: hurtAnimConfig,
      HURT_LEFT: hurtAnimConfig
    }

    super({
      scene: config.scene,
      position: config.position,
      assetKey: ASSET_KEYS.SPIDER,
      frame: 0,
      id: `spider-${Phaser.Math.RND.uuid()}`,
      isPlayer: false,
      animationConfig,
      speed: ENEMY_SPIDER_SPEED,
      inputComponent: new InputComponent(),
      isInvulnerable: false
    })

    this._directionComponent.callback = (direction) => {
      this.#handleDirectionChange(direction)
    }

    this._stateMachine.addState(new IdleState(this))
    this._stateMachine.addState(new MoveState(this))
    this._stateMachine.addState(new HurtState(this, ENEMY_SPIDER_HURT_PUSH_BACK_SPEED))
    this._stateMachine.setState(CHARACTER_STATES.IDLE_STATE)

    this.#addChangeDirectionEvent()
  }

  #handleDirectionChange (direction) {
    switch (direction) {
      case DIRECTION.DOWN:
        this.setAngle(0)
        break
      case DIRECTION.UP:
        this.setAngle(180)
        break
      case DIRECTION.LEFT:
        this.setAngle(90)
        break
      case DIRECTION.RIGHT:
        this.setAngle(270)
        break
    }
  }

  #changeDirection () {
    this.controls.reset()
    this.scene.time.delayedCall(200, () => {
      const randomDirection = Phaser.Math.Between(0, 3)
      if (randomDirection === 0) {
        this.controls.isUpDown = true
      } else if (randomDirection === 1) {
        this.controls.isDownDown = true
      } else if (randomDirection === 2) {
        this.controls.isLeftDown = true
      } else if (randomDirection === 3) {
        this.controls.isRightDown = true
      }
    })
    this.#addChangeDirectionEvent()
  }

  #addChangeDirectionEvent () {
    this.scene.time.addEvent({
      delay: Phaser.Math.Between(ENEMY_SPIDER_CHANGE_DIRECTION_DELAY_MIN, ENEMY_SPIDER_CHANGE_DIRECTION_DELAY_MAX),
      callback: this.#changeDirection,
      callbackScope: this,
      loop: false
    })
  }
}
