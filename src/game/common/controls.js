export const DIRECTION = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT'
}

export function getIsMoving (controls) {
  return controls.isUpDown || controls.isDownDown || controls.isRightDown || controls.isLeftDown
}

export function getIsMovingVeritcally (controls) {
  return controls.isUpDown || controls.isDownDown
}

export function isDirection (value) {
  return DIRECTION[value] !== undefined
}
