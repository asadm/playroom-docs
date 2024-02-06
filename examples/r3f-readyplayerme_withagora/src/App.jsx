import { Canvas } from '@react-three/fiber'
import Lobby from './Lobby'
import { AvatarCreator } from '@readyplayerme/react-avatar-creator'
import { useState } from 'react'
import { insertCoin, myPlayer } from 'playroomkit'
import { generateRandomHexColor, getRandomExpression, getStoreValue } from './utils/helpers'
import OpenMapExperience from './components/OpenMapExperience'
import { UI } from './components/UI/UI'
import { Loading } from './components/UI/Loading'

export default function App() {
  const [avatarMode, setAvatarMode] = useState(false)
  const [gameLaunched, setGameLaunched] = useState(false)
  const [experienceReady, setExperienceReady] = useState(false)

  if (!avatarMode && !gameLaunched) {
    // home page
    return (
      <Lobby
        onJoinOrCreateRoom={roomCode => {
          // setRoomCode(roomCode)
          setAvatarMode(true)
        }}
      />
    )
  } else if (!gameLaunched && avatarMode) {
    // show avatar creator
    return (
      <AvatarCreator
        subdomain='playroom'
        className='fixed top-0 left-0 z-10 w-screen h-screen'
        onAvatarExported={event => {
          const avatarUrl = event.data.url
          const avatarImage = `https://models.readyplayer.me/${event.data.avatarId}.png?expression=${getRandomExpression()}&size=512`
          // join or create the room now.
          insertCoin({
            skipLobby: true, // skip the lobby UI and join/create the room directly
          }).then(() => {
            myPlayer().setState('character', {
              id: myPlayer().id,
              hairColor: generateRandomHexColor(),
              topColor: generateRandomHexColor(),
              bottomColor: generateRandomHexColor(),
              // set the avatar url and add a timestamp to it to avoid caching
              avatarUrl: avatarUrl.split('?')[0] + '?' + new Date().getTime() + '&meshLod=2',
              avatarImg: avatarImage,
            })

            myPlayer().setState('player_name', getStoreValue('player_name'))
            setAvatarMode(false)
            setGameLaunched(true)
          })
        }}
      />
    )
  } else if (gameLaunched) {
    // show the game
    return (
      <>
        <Loading show={!experienceReady} />
        <Canvas shadows camera={{ position: [8, 8, 8], fov: 30 }}>
          <color attach='background' args={['#ececec']} />
          <OpenMapExperience onReady={setExperienceReady} />
        </Canvas>
        {experienceReady && <UI />}
      </>
    )
  }
}
