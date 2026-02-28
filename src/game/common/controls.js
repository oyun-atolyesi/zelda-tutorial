export function getIsMoving (controls) {
  return controls.isUpDown || controls.isDownDown || controls.isRightDown || controls.isLeftDown
}

export function getIsMovingVeritcally (controls) {
  return controls.isUpDown || controls.isDownDown
}
