import Phaser from 'phaser'
import { AnimationComponent } from '../../components/game-object/animation-component'
import { ControlsComponent } from '../../components/game-object/controls-component'
import { DirectionComponent } from '../../components/game-object/direction-component'
import { SpeedComponent } from '../../components/game-object/speed-component'
import { StateMachine } from '../../components/state-machine/state-machine'
import { InvulnerableComponent } from '../../components/game-object/invulnerable-component'
import { CHARACTER_STATES } from '../../components/state-machine/state/character/character-states'
import { LifeComponent } from '../../components/game-object/life-component'

export class CharacterGameObject extends Phaser.Physics.Arcade.Sprite {
  _controlsComponent
  _speedComponent
  _directionComponent
  _animationComponent
  _invulnerableComponent
  _lifeComponent
  _stateMachine
  _isPlayer
  _isDefeated

  constructor (config) {
    const {
      scene,
      position: { x, y },
      assetKey,
      frame,
      speed,
      animationConfig,
      inputComponent,
      id,
      isPlayer,
      isInvulnerable = false,
      invulnerableAfterHitAnimationDuration = 0,
      currentLife,
      maxLife
    } = config
    super(scene, x, y, assetKey, frame || 0)

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this._controlsComponent = new ControlsComponent(this, inputComponent)
    this._speedComponent = new SpeedComponent(this, speed)
    this._directionComponent = new DirectionComponent(this)
    this._animationComponent = new AnimationComponent(this, animationConfig)
    this._invulnerableComponent = new InvulnerableComponent(this, isInvulnerable, invulnerableAfterHitAnimationDuration)
    this._lifeComponent = new LifeComponent(this, maxLife, currentLife)

    this._stateMachine = new StateMachine(id)

    this._isPlayer = isPlayer
    this._isDefeated = false
  }

  get isDefeated () {
    return this._isDefeated
  }

  get isEnemy () {
    return !this._isPlayer
  }

  get controls () {
    return this._controlsComponent.controls
  }

  get speed () {
    return this._speedComponent.speed
  }

  get direction () {
    return this._directionComponent.direction
  }

  set direction (direction) {
    this._directionComponent.direction = direction
  }

  get animationComponent () {
    return this._animationComponent
  }

  get invulnerableComponent () {
    return this._invulnerableComponent
  }

  update () {
    this._stateMachine.update()
  }

  hit (direction, damage = 0) {
    if (this._isDefeated) return
    if (this._invulnerableComponent.invulnerable) return

    this._lifeComponent.takeDamage(damage)
    if (this._lifeComponent.life === 0) {
      this._isDefeated =
      this._stateMachine.setState(CHARACTER_STATES.DEATH_STATE)
      return
    }
    this._stateMachine.setState(CHARACTER_STATES.HURT_STATE, direction)
  }

  disableObject () {
    this.body.enable = false
    this.active = false
    if (!this._isPlayer) {
      this.visible = false
    }
  }

  enableObject () {
    if (this._isDefeated) return

    this.body.enable = true
    this.active = true
    this.visible = true
  }
}
