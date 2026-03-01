import Phaser from 'phaser'
import { ASSET_KEYS, WISP_ANIMATION_KEYS } from '../../common/assets'
import { ENEMY_WISP_PULSE_ANIMATION_DURATION, ENEMY_WISP_PULSE_ANIMATION_SCALE_X, ENEMY_WISP_PULSE_ANIMATION_SCALE_Y, ENEMY_WISP_SPEED, ENEMY_WISP_START_MAX_HEALTH } from '../../common/config'
import { InputComponent } from '../../components/input/input-component'
import { BounceMoveState } from '../../components/state-machine/state/character/bounce-move-state'
import { CHARACTER_STATES } from '../../components/state-machine/state/character/character-states'
import { CharacterGameObject } from '../common/character-game-object'

export class Wisp extends CharacterGameObject {
  constructor (config) {
    const animConfig = { key: WISP_ANIMATION_KEYS.IDLE, repeat: -1, ignoreIfPlaying: true }
    const animationConfig = {
      IDLE_DOWN: animConfig,
      IDLE_UP: animConfig,
      IDLE_RIGHT: animConfig,
      IDLE_LEFT: animConfig
    }

    super({
      scene: config.scene,
      position: config.position,
      assetKey: ASSET_KEYS.WISP,
      frame: 0,
      id: `wisp-${Phaser.Math.RND.uuid()}`,
      isPlayer: false,
      animationConfig,
      speed: ENEMY_WISP_SPEED,
      inputComponent: new InputComponent(),
      isInvulnerable: true,
      maxLife: ENEMY_WISP_START_MAX_HEALTH,
      currentLife: ENEMY_WISP_START_MAX_HEALTH
    })

    this._stateMachine.addState(new BounceMoveState(this))
    this._stateMachine.setState(CHARACTER_STATES.BOUNCE_MOVE_STATE)

    this.scene.tweens.add({
      targets: this,
      scaleX: ENEMY_WISP_PULSE_ANIMATION_SCALE_X,
      scaleY: ENEMY_WISP_PULSE_ANIMATION_SCALE_Y,
      yoyo: true,
      repeat: -1,
      duration: ENEMY_WISP_PULSE_ANIMATION_DURATION
    })
  }
}
