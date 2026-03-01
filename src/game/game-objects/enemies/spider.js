import Phaser from 'phaser'
import { ASSET_KEYS, SPIDER_ANIMATION_KEYS } from '../../common/assets'
import { ENEMY_SPIDER_SPEED } from '../../common/config'
import { InputComponent } from '../../components/input/input-component'
import { CHARACTER_STATES } from '../../components/state-machine/state/character/character-states'
import { IdleState } from '../../components/state-machine/state/character/idle-state'
import { MoveState } from '../../components/state-machine/state/character/move-state'
import { CharacterGameObject } from '../common/character-game-object'

export class Spider extends CharacterGameObject {
  constructor (config) {
    const animConfig = { key: SPIDER_ANIMATION_KEYS.WALK, repeat: -1, ignoreIfPlaying: true }
    const animationConfig = {
      IDLE_DOWN: animConfig,
      IDLE_UP: animConfig,
      IDLE_RIGHT: animConfig,
      IDLE_LEFT: animConfig,
      WALK_DOWN: animConfig,
      WALK_UP: animConfig,
      WALK_RIGHT: animConfig,
      WALK_LEFT: animConfig
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
      inputComponent: new InputComponent()
    })

    this._stateMachine.addState(new IdleState(this))
    this._stateMachine.addState(new MoveState(this))
    this._stateMachine.setState(CHARACTER_STATES.IDLE_STATE)

    this.scene.time.addEvent({
      delay: Phaser.Math.Between(500, 1500),
      callback: this.#changeDirection,
      callbackScope: this,
      loop: false
    })
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

    this.scene.time.addEvent({
      delay: Phaser.Math.Between(500, 1500),
      callback: this.#changeDirection,
      callbackScope: this,
      loop: false
    })
  }
}
