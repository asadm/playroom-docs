import imgLogo from './assets/logo-rr.svg'
import imgReadyPlayerMe from './assets/bottom-logo.svg'
import { useState } from 'react'
import { generateRandomGuestName, getHashValue, getStoreValue, setHashValue, setStoreValue } from './utils/helpers'

function Lobby({ onJoinOrCreateRoom }) {
  const [screen, setScreen] = useState(getHashValue('r') ? 'NAME' : 'LOBBY')
  const [playerName, setPlayerName] = useState(getStoreValue('player_name') || generateRandomGuestName()) // NEW / JOIN

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
      <div className='text-4xl font-bold'>
        <img src={imgLogo} alt='Ready Rooms' style={{ height: '80px' }} />
      </div>
      <div className='text-md mt-1'>OPEN HANGOUT SPACES</div>
      {screen === 'LOBBY' && (
        <div className='flex mt-20'>
          <button
            className='rounded-lg px-3 py-2 m-3'
            style={{ backgroundColor: '#A2DCBB' }}
            onClick={() => {
              setHashValue('r', '')
              setScreen('NAME')
            }}
          >
            New room
          </button>
          <button
            className='rounded-lg px-3 py-2 m-3'
            style={{ backgroundColor: '#ccc' }}
            onClick={() => {
              const roomCode = prompt('Enter room code')
              if (roomCode) {
                setHashValue('r', 'R' + roomCode)
              }
              setScreen('NAME')
            }}
          >
            Join room
          </button>
        </div>
      )}
      {screen === 'NAME' && (
        <div className='flex mt-20 items-center'>
          <div className='rounded-3xl h-12 flex gap-4 overflow-hidden py-2 px-6 bg-white '>
            <Input onChange={setPlayerName} onSubmit={() => {}} value={playerName} />
          </div>
          <button
            className='rounded-lg px-3 py-2 m-3'
            style={{ backgroundColor: '#A2DCBB' }}
            onClick={() => {
              setStoreValue('player_name', playerName)
              onJoinOrCreateRoom()
            }}
          >
            Next
          </button>
        </div>
      )}
      <div className='absolute bottom-5 text-xs gap-2 flex items-center'>
        <img src={imgReadyPlayerMe} alt='Ready Player Me x Playroom' style={{ height: '40px' }} />
      </div>
    </div>
  )
}

export default Lobby

const Input = ({ onSubmit, onChange, value }) => (
  <>
    <input
      maxLength={300}
      placeholder='write your name'
      className='flex-1 min-w-0 rounded-xl bg-transparent focus:outline-none focus:border-none input-box text5 font-bold'
      type='text'
      onChange={e => {
        onChange(e.target.value)
      }}
      onKeyDown={e => {
        e.stopPropagation() // avoids moving character while typing
        e.code === 'Enter' && onSubmit()
        e.code === 'Escape' && e.target.blur()
      }}
      value={value}
    />
  </>
)
