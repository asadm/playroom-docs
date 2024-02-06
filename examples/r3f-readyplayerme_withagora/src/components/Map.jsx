import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useEffect, useRef, useState } from 'react'

export default function Map({ onMapReady }) {
  const floorRef = useRef()

  return (
    <>
      <RigidBody type='fixed' ref={floorRef}>
        <mesh receiveShadow position={[0, -3.5, 0]}>
          <cylinderGeometry args={[150, 150, 5, 50]} />
          <shadowMaterial color='#333' transparent opacity={0.5} />
          <meshStandardMaterial color='lightblue' transparent opacity={0.5} />
        </mesh>
      </RigidBody>
      <GroundSensor callback={onMapReady} />
    </>
  )
}

const GroundSensor = ({ callback }) => {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    initialized && callback()
  }, [initialized])

  return (
    <>
      <RigidBody gravityScale={0}>
        <CuboidCollider
          args={[5, 5, 1]}
          sensor
          onIntersectionEnter={() => {
            setInitialized(true)
          }}
        />
      </RigidBody>
    </>
  )
}
