import Phaser from 'phaser'
import { AnimationComponent } from '../../components/game-object/animation-component'
import { ControlsComponent } from '../../components/game-object/controls-component'
import { DirectionComponent } from '../../components/game-object/direction-component'
import { SpeedComponent } from '../../components/game-object/speed-component'
import { StateMachine } from '../../components/state-machine/state-machine'

export class CharacterGameObject extends Phaser.Physics.Arcade.Sprite {
  _controlsComponent
  _speedComponent
  _directionComponent
  _animationComponent
  _stateMachine
  _isPlayer

  constructor (config) {
    const { scene, position: { x, y }, assetKey, frame, speed, animationConfig, inputComponent, id, isPlayer } = config
    super(scene, x, y, assetKey, frame || 0)

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this._controlsComponent = new ControlsComponent(this, inputComponent)
    this._speedComponent = new SpeedComponent(this, speed)
    this._directionComponent = new DirectionComponent(this)
    this._animationComponent = new AnimationComponent(this, animationConfig)

    this._stateMachine = new StateMachine(id)

    this._isPlayer = isPlayer
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

  update () {
    this._stateMachine.update()
  }
}
