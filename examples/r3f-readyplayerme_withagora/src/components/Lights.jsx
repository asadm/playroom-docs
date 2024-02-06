export default function Lights() {
  return (
    <>
      <directionalLight
        intensity={5.7}
        color={'#ffffff'}
        castShadow
        position={[-20, 20, 20]}
        shadow-camera-top={20}
        shadow-camera-right={20}
        shadow-camera-bottom={-20}
        shadow-camera-left={-20}
        name="followLight"
      />
      <ambientLight intensity={0.7} />
    </>
  )
}
