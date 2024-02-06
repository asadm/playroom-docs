import { Physics, vec3 } from '@react-three/rapier'
import { Environment, KeyboardControls } from '@react-three/drei'
import { Fragment, useEffect, useState } from 'react'
import Lights from './Lights'
import Map from './Map'
import CharacterModel from './CharacterModel'
import { RoughPlane } from './RoughPlane'
import { usePlayersState } from 'playroomkit'
import { AnimationRemotePlayer } from './AnimationRemotePlayer'
import { animationSet } from '../hooks/useRPMAnimations'
import { PlayroomJoystick } from './PlayroomJoystick'
import { Player } from './Player'

/**
 * Keyboard control preset
 */
const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'run', keys: ['Shift'] },
  { name: 'action1', keys: ['1'] },
  { name: 'action2', keys: ['2'] },
  { name: 'action3', keys: ['3'] },
  { name: 'action4', keys: ['KeyF'] },
]

export default function OpenMapExperience({ onReady }) {
  const [mapReady, setMapReady] = useState(false)
  const characters = usePlayersState('character')

  useEffect(() => onReady(mapReady), [mapReady])

  return (
    <>
      <Environment background files='/AmbienceExposure4k.hdr' />

      <Lights />

      <Physics timeStep='vary' debug={false} gravity={vec3({ x: 0, y: mapReady ? -9.8 : 0, z: 0 })}>
        {characters
          .filter(({ state }) => state) // remove nulls
          .map(({ state, player }) =>
            player.id === player.myId ? (
              // controlled player
              <KeyboardControls map={keyboardMap} key={`local-${state.id}`}>
                <Player />
                <PlayroomJoystick player={player} />
              </KeyboardControls>
            ) : (
              // remote player
              <Fragment key={`remote-${state.id}`}>
                <AnimationRemotePlayer animationSet={animationSet} player={player}  key={state.avatarUrl}>
                  <CharacterModel characterUrl={state.avatarUrl} player={player} />
                </AnimationRemotePlayer>
              </Fragment>
            )
          )}
        <Map onMapReady={() => setMapReady(true)} />
        <RoughPlane />
      </Physics>
    </>
  )
}
