import './css/Scene.css'
import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'

function VinylPlayer({isHovered, isPlaying, onPointerEnter, onPointerLeave, onClick}) {
  const { nodes, materials } = useGLTF('/vinyl_final-processed.glb');
  const vinylRef = useRef();
  const sleeveRef = useRef();
  const recordRef = useRef();
  const hoverTimeRef = useRef(0); 
  const shiftTimeRef = useRef(0);

  useFrame((state, delta) => {
    //Vinyl scaling animation
    const targetScale = isHovered ? 1.1 : 1.0
  
    //Lerp toward target (smooth)
    const lerpFactor1 = 0.1  // Speed of transition (0.05 = slow, 0.2 = fast)
    
    vinylRef.current.scale.x += (targetScale - vinylRef.current.scale.x) * lerpFactor1
    vinylRef.current.scale.y += (targetScale - vinylRef.current.scale.y) * lerpFactor1
    vinylRef.current.scale.z += (targetScale - vinylRef.current.scale.z) * lerpFactor1

    //Record position animation cue
    const DELAY = 0.25;
    const shouldSlide = hoverTimeRef.current > DELAY;
    const targetPosition = shouldSlide ? 0.14 : 0; 

    //1.Playing State
    const sleeveTargetPosition = isPlaying ? -2 : 0
    if (isPlaying) {
      //Sleeve leaves if Playing and sleeve returns if not Playing
      sleeveRef.current.position.x += (sleeveTargetPosition - sleeveRef.current.position.x) * 0.01;

      vinylRef.current.position.x = 0

    } else if (!isPlaying) {
       // Only return sleeve if canvas is back to 100vw
      const canvas = document.querySelector('.scene-container')
        const currentWidth = canvas.offsetWidth
        const viewportWidth = window.innerWidth
        const widthRatio = currentWidth / viewportWidth

        if(widthRatio > 0.6) {
          shiftTimeRef.current = 0;
          sleeveRef.current.position.x += (sleeveTargetPosition - sleeveRef.current.position.x) * 0.025;
        }

      vinylRef.current.position.x = 0
    }

    //2. Closing State
    const isClosing = !isPlaying && sleeveRef.current.position.x < -0.01
    if (isClosing) {
      // Rotate backward based on how far sleeve still needs to travel
      const distanceToCenter = sleeveTargetPosition - sleeveRef.current.position.x   // How far from 0
      const rotationSpeed = distanceToCenter * 10  // Adjust multiplier for speed
      recordRef.current.rotation.z += rotationSpeed * delta
    }

    //3. Hover State
    if (isHovered && !isPlaying && !isClosing) {
        //Hover: slide out + rotate foward
      hoverTimeRef.current += delta;  // Increment
      recordRef.current.position.x += (targetPosition - recordRef.current.position.x) * 0.05
      //Record rotation animation
      recordRef.current.rotation.z -= (targetPosition - recordRef.current.position.x) * 0.5;
    } 

    //4. Idle/Returning from hover
    else {
      //Not hovering and not playing: slide back + rotate backward
      hoverTimeRef.current = 0;  // Reset
      recordRef.current.position.x += (targetPosition - recordRef.current.position.x) * 0.05
      //Record rotation animation
      recordRef.current.rotation.z += (targetPosition - recordRef.current.position.x) - 0.0075;
    }


});

  return (
    <group 
            dispose={null} 
            ref={vinylRef}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
            onClick={onClick}
      >
        <group ref={recordRef}>
          <group rotation={[Math.PI / 2, 0, 0]}>
            <mesh geometry={nodes.Circle_1.geometry} material={materials.VinlyInnerCircle} />
            <mesh geometry={nodes.Circle_2.geometry} material={materials.Material} />
            <mesh geometry={nodes.Circle_3.geometry} material={materials.VinylSurround} />
          </group>
        </group>
      <group ref={sleeveRef}>
        <mesh geometry={nodes.Cube001.geometry} material={materials.vinylcover} />
        <mesh geometry={nodes.Cube001_1.geometry} material={materials.coverart} />
      </group>
    </group>
  )
}

useGLTF.preload('/vinyl_final-processed.glb')

export default function Scene({isHovered, isPlaying, onPointerEnter, onPointerLeave, onClick}) {
    return(
        <Canvas 
          camera={{fov: 10, near: 0.1, far: 2000, position: [0, 0, 4]}}
          resize={{ scroll: false, debounce: 0}}
        >
            <ambientLight intensity={Math.PI / 2} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
            <Suspense>
                <VinylPlayer isHovered={isHovered} isPlaying={isPlaying} onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave} onClick={onClick}/>
            </Suspense>
            {/* <OrbitControls /> */}
        </Canvas>
    )
}

