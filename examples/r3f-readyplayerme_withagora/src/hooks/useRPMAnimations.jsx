import { useAnimations, useGLTF } from '@react-three/drei'

export const useRPMAnimations = targetRef => {
  const { animations: walkAnimation } = useGLTF('/animations/M_Walk_001.glb')
  const { animations: danceAnimation } = useGLTF('/animations/M_Dances_001.glb')
  const { animations: danceAltAnimation } = useGLTF('/animations/M_Dances_005.glb')
  const { animations: idleAltAnimation } = useGLTF('/animations/M_Standing_Expressions_001.glb')
  const { animations: idleAnimation } = useGLTF('/animations/M_Standing_Idle_001.glb')
  const { animations: idleAlt2Animation } = useGLTF('/animations/M_Standing_Idle_002.glb')
  const { animations: jumpIdleAnimation } = useGLTF('/animations/M_Jump_Idle.glb')
  const { animations: jumpAnimation } = useGLTF('/animations/M_Falling_Idle_002.glb')
  const { animations: jogAnimation } = useGLTF('/animations/M_Jog_001.glb')

  const { actions } = useAnimations(
    [
      idleAnimation[0].clone(),
      idleAltAnimation[0].clone(),
      idleAlt2Animation[0].clone(),
      walkAnimation[0].clone(),
      danceAnimation[0].clone(),
      danceAltAnimation[0].clone(),
      jumpIdleAnimation[0].clone(),
      jogAnimation[0].clone(),
      jumpAnimation[0].clone(),
    ],
    targetRef
  )

  return actions
}

useGLTF.preload('/animations/M_Walk_001.glb')
useGLTF.preload('/animations/M_Standing_Idle_001.glb')
useGLTF.preload('/animations/M_Standing_Idle_002.glb')
useGLTF.preload('/animations/M_Standing_Expressions_001.glb')
useGLTF.preload('/animations/M_Dances_001.glb')
useGLTF.preload('/animations/M_Dances_005.glb')
useGLTF.preload('/animations/M_Jump_Idle.glb')
useGLTF.preload('/animations/M_Falling_Idle_002.glb')
useGLTF.preload('/animations/M_Jog_001.glb')

/**
 * Character animation set preset
 */
export const animationSet = {
  idle: 'M_Standing_Idle_001',
  walk: 'M_Walk_001',
  run: 'M_Jog_001',
  jump: 'CharacterArmature|Jump',
  jumpIdle: 'M_Jog_Jump_001',
  jumpLand: 'CharacterArmature|Jump_Land',
  fall: 'CharacterArmature|Duck', // This is for falling from high sky
  action1: 'M_Standing_Expressions_001',
  action2: 'M_Dances_001',
  action3: 'M_Dances_005',
  action4: 'M_Standing_Idle_002',
}
