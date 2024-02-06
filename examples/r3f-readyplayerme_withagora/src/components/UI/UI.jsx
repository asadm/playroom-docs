import { useEffect, useState } from 'react'
import { AvatarCreator } from '@readyplayerme/react-avatar-creator'
import { myPlayer, getRoomCode } from 'playroomkit'
import { Chat } from './Chat'
import imgLogo from '../../assets/logo-rr.svg'
import { getRandomExpression } from '../../utils/helpers'
import { VoiceChat } from './VoiceChat'
import { PlayerList } from './PlayersList'
import { ActionsInstructions } from './ActionsInstructions'

export const UI = () => {
  const [avatarMode, setAvatarMode] = useState(false)
  const [avatarImage, setAvatarImage] = useState('')

  useEffect(() => {
    const color = myPlayer().getProfile().color

    const img = myPlayer().getState('character').avatarImg + `&background=${color.r},${color.g},${color.b}`
    setAvatarImage(img)
  }, [avatarMode])

  return (
    <>
      {avatarMode && (
        <AvatarCreator
          subdomain='playroom'
          className='fixed top-0 left-0 z-10 w-screen h-screen'
          onAvatarExported={event => {
            const character = myPlayer().getState('character')
            const avatarUrl = event.data.url
            character.avatarUrl = avatarUrl.split('?')[0] + '?' + new Date().getTime() + `&meshLod=2`
            character.avatarImg = `https://models.readyplayer.me/${
              event.data.avatarId
            }.png?expression=${getRandomExpression()}&size=512&t=${new Date().getTime()}`
            myPlayer().setState('character', character)
            setAvatarMode(false)
            myPlayer().setState('avatarMode', false)
          }}
        />
      )}

      <div
        className='select-none	fixed inset-4 flex items-end justify-start  max-md:left-0 max-md:inset-1'
        style={{ backgroundColor: '#f000' }}
      >
        {/* READY LOGO AND ROOM CODE */}
        <div className=' cursor-pointer absolute top-0 left-1 text-center'>
          <div className='text-md mt-1 text-base max-md:text-xs'>
            Room: <span style={{ fontFamily: 'sans-serif' }}>{getRoomCode()}</span>
          </div>
          <div className='text-4xl font-bold'>
            <img src={imgLogo} alt='Ready Rooms' className='h-20 max-md:h-10' />
          </div>
        </div>

        {/* PLAYERS LIST */}
        <div className='absolute top-36 left-1 h-52 overflow-auto max-md:top-16 max-md:left-0 max-md:h-25'>
          <PlayerList />
        </div>

        <div className='absolute top-0 right-0 mt-1 mr-1 flex justify-end items-center'>
          {/* VOICE CHAT */}
          <VoiceChat uid={myPlayer().id} />

          {/* AVATAR */}
          <button
            className='w-10 h-10 p-4 rounded-full bg-slate-500 text-white  drop-shadow-md cursor-pointer hover:bg-slate-800 transition-colors'
            onClick={() => {
              setAvatarMode(true)
              myPlayer().setState('avatarMode', true)
            }}
            style={{
              backgroundImage: `url(${avatarImage})`,
              backgroundSize: '200%',
              backgroundPositionX: '50%',
            }}
          />
        </div>

        <div className='flex items-end justify-center space-x-0  max-md:mb-40 max-md:flex-col md:w-2/4 max-md:items-start'>
          {/* CHAT */}
          {!avatarMode && <Chat />}
        </div>
        <ActionsInstructions />
      </div>
    </>
  )
}
