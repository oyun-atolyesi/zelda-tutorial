import Phaser, { Scene } from 'phaser'
import { ASSET_KEYS } from '../common/assets'
import { PLAYER_START_MAX_HEALTH } from '../common/config'
import { DIRECTION } from '../common/controls'
import { KeyboardComponent } from '../components/input/keyboard-component'
import { Spider } from '../game-objects/enemies/spider'
import { Wisp } from '../game-objects/enemies/wisp'
import { Chest } from '../game-objects/objects/chest'
import { Pot } from '../game-objects/objects/pot'
import { Player } from '../game-objects/player/player'
import { SCENE_KEYS } from './scene-keys'
import { CUSTOM_EVENTS, EVENT_BUS } from '../common/event-bus'

export class GameScene extends Scene {
  #controls
  #player
  #enemyGroup
  #blockingGroup

  constructor () {
    super({
      key: SCENE_KEYS.GAME_SCENE
    })
  }

  create () {
    if (!this.input.keyboard) {
      console.warn('Enable keyboard plugin')
      return
    }

    this.#controls = new KeyboardComponent(this.input.keyboard)
    this.add
      .text(this.scale.width / 2, this.scale.height / 2, 'Game Scene', { fontFamily: ASSET_KEYS.FONT_PRESS_START_2P })
      .setOrigin(0.5)
    this.#player = new Player({
      scene: this,
      position: { x: this.scale.width / 2, y: this.scale.height / 2 },
      controls: this.#controls,
      maxLife: PLAYER_START_MAX_HEALTH,
      currentLife: PLAYER_START_MAX_HEALTH
    })

    this.#enemyGroup = this.add.group([
      new Spider({
        scene: this,
        position: { x: this.scale.width / 2, y: this.scale.height / 2 + 50 }
      }),
      new Wisp({
        scene: this,
        position: { x: this.scale.width / 2, y: this.scale.height / 2 - 50 }
      })
    ], {
      runChildUpdate: true
    })

    this.#blockingGroup = this.add.group([
      new Pot({
        scene: this,
        position: { x: this.scale.width / 2 + 90, y: this.scale.height / 2 }
      }),
      new Chest({
        scene: this,
        position: { x: this.scale.width / 2 - 90, y: this.scale.height / 2 },
        requiresBossKey: false
      }),
      new Chest({
        scene: this,
        position: { x: this.scale.width / 2 - 90, y: this.scale.height / 2 - 80 },
        requiresBossKey: true
      })
    ])

    this.#registerColliders()
    this.#registerCustomEvents()
  }

  #registerColliders () {
    this.#enemyGroup.getChildren().forEach(enemy => {
      enemy.setCollideWorldBounds(true)
    })

    this.physics.add.overlap(this.#player, this.#enemyGroup, (player, enemy) => {
      this.#player.hit(DIRECTION.DOWN, 1)
      enemy.hit(this.#player.direction, 1)
    })

    this.physics.add.collider(this.#player, this.#blockingGroup, (player, gameObject) => {
      this.#player.collidedWithGameObject(gameObject)
    })

    this.physics.add.collider(this.#enemyGroup, this.#blockingGroup, () => {
      //
    })
  }

  #registerCustomEvents () {
    EVENT_BUS.on(CUSTOM_EVENTS.OPENED_CHEST, this.#handleOpenChest, this)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      EVENT_BUS.off(CUSTOM_EVENTS.OPENED_CHEST, this.#handleOpenChest, this)
    })
  }

  #handleOpenChest (chest) {
    console.log('chest opened')
  }
}
