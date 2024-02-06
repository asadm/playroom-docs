import { useEffect, useState } from 'react'
import imgLogo from '../../assets/logo-rr.svg'

export const Loading = ({ show }) => {
  const [hide, setHide] = useState(false)
  useEffect(() => {
    if (!show) {
      setTimeout(() => setHide(true), 5500)
    }
  }, [show])
  return (
    <>
      {!hide && (
        <div
          style={{
            width: '100vw',
            height: '100vh',
            transition: 'all 3s linear',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 100,
            opacity: show ? 1 : 0,
          }}
        >
          <div className='flex flex-col items-center justify-center h-screen bg-gray-100' style={{ opacity: 'inherit' }}>
            <div className='text-4xl font-bold'>
              <img src={imgLogo} alt='Ready Rooms' style={{ height: '80px' }} />
            </div>
            <div className='text-md mt-1'>LOADING EXPERIENCE</div>

            <div className='lds-ellipsis' style={{ visibility: show ? 'visible' : 'hidden' }}>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
