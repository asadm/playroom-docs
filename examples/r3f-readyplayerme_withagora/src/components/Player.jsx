import Ecctrl from 'ecctrl'
import CharacterModel from './CharacterModel'
import { myPlayer } from 'playroomkit'
import { useState } from 'react'
import { AnimationLocalPlayer } from './AnimationLocalPlayer'
import { animationSet } from '../hooks/useRPMAnimations'
import { randomRange } from '../utils/helpers'

const getRandomPos = () => {
  const min = -5
  const max = 5
  const x = randomRange(min, max)
  const z = randomRange(min, max)
  const y = 10
  return [x, y, z]
}
export const Player = () => {
  const [initialPos] = useState(getRandomPos())
  const [player] = useState(myPlayer())
  const characterUrl = player.state.character.avatarUrl

  return (
    <Ecctrl debug={false} animated camInitDis={-10} followLight position={initialPos}>
      <AnimationLocalPlayer animationSet={animationSet} player={player} key={characterUrl}>
        <CharacterModel characterUrl={characterUrl} sharePos player={player} />
      </AnimationLocalPlayer>
    </Ecctrl>
  )
}
