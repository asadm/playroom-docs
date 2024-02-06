import { usePlayersState } from 'playroomkit'
import soundIcon from '../../assets/soundIcon.svg'

export const PlayerList = () => {
  const playersWithMic = usePlayersState('withVoiceChat')

  return (
    <div className='flex flex-col'>
      {playersWithMic.map(({ state: withMic, player: p }) => {
        const playerName = p.getState().player_name
        return (
          <div
            className='bg-black m-1 h-8 flex items-center w-48 rounded-full max-md:h-5'
            key={p.id}
            style={{
              backgroundColor: '#000a',
            }}
          >
            <span
              className='text-white ml-4 mr-0 overflow-hidden whitespace-no-wrap text-xl text-ellipsis max-md:text-xs w-full'
              style={{
                fontFamily: "''",
              }}
            >
              {playerName}
            </span>
            <div className={`select-none rounded-full h-8 w-10 mr-0 flex justify-center invert`}>
              <img src={soundIcon} className={`talking-icon w-6 ${!withMic && 'hidden'}`} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
