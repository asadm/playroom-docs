import waveIcon from '../../assets/waveIcon.svg'
import danceIcon from '../../assets/danceIcon.svg'
import instructionsBtnWave from '../../assets/instructionsBtnWave.svg'
import instructionsBtnDance from '../../assets/instructionsBtnDance.svg'
import instructionsBtnDance2 from '../../assets/instructionsBtnDance2.svg'
import { useGame } from 'ecctrl'

export const ActionsInstructions = () => {
  const action1 = useGame(state => state.action1)
  const action2 = useGame(state => state.action2)
  const action3 = useGame(state => state.action3)

  return (
    <>
      <div className='absolute bottom-40 right-2 flex h-11 mb-3 md:hidden max-md:flex'>
        <a onClick={action1}>
          <img src={waveIcon} className='h-11 mr-2' />
        </a>
        <a onClick={() => (Math.random() > 0.25 ? action3() : action2())}>
          <img src={danceIcon} className='h-11' />
        </a>
      </div>
      <div className='absolute bottom-0 right-2 flex h-11 mb-3 max-md:hidden'>
        <a onClick={action1}>
          <img src={instructionsBtnWave} className='h-11 mr-3' />
        </a>
        <a onClick={action2}>
          <img src={instructionsBtnDance} className='h-11 mr-3' />
        </a>
        <a onClick={action3}>
          <img src={instructionsBtnDance2} className='h-11' />
        </a>
      </div>
    </>
  )
}
