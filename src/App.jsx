import { useRef } from 'react'

import { PhaserGame } from './PhaserGame'

function App () {
  //  References to the PhaserGame component (game and scene are exposed)
  const phaserRef = useRef()

  return <PhaserGame ref={phaserRef} />
}

export default App
