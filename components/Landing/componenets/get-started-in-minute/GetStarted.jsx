import React from 'react'
import Card from '../ui/Card'
import reactIcon from "../../assets/React-icon.svg"
import editorMobileImg from "../../assets/image 36 (3).png"
import editorMobileImg2 from "../../assets/editorMobile.png"
import editorDesktopImg from "../../assets/editorbgdesktop2.png"
import regionImg from "../../assets/region.svg"
import unityIcon from "../../assets/unityIcon.svg"
import threejsIcon from "../../assets/threejsIcon.svg"
import godotIcon from "../../assets/godotIcon.svg"
import cocosIcon from "../../assets/cocosIcon.svg"
import webxrIcon from "../../assets/webxrIcon.svg"
import phaserIcon from "../../assets/phaserIcon.svg"
import { Container } from '../ui/Container'
import pixijsIcon from "../../assets/PixijsIcon.svg"
import playcanvasIcon from "../../assets/playcanvasIcon.svg"

const techCards = [
  { icon: reactIcon, title: 'React' },
  { icon: unityIcon, title: 'Unity' },
  { icon: threejsIcon, title: 'Threejs' },
  { icon: godotIcon, title: 'Godot' },
  { icon: cocosIcon, title: 'Cocos' },
  { icon: phaserIcon, title: 'Phaser' },
  { icon: pixijsIcon, title: 'PixiJs' },
  { icon: webxrIcon, title: 'WebXR' },
  { icon: playcanvasIcon, title: 'Playcanvas' },
];

const GetStarted = () => {
  return (
    <Container>

    <div className='p-4'>
             <div className="text-center mt-20">
                     <h2>Get started in <br className='block md:hidden' />  minutes  </h2>
                     <p className="my-6 md:mb-10">
                     Simple API to set or get the state of game room. The state is <br className='hidden md:block' /> automatically synced between all players and screens.        </p>
                   </div>
                    <Card className="w-full rounded-[16px] text-center md:w-[75%] md:mx-auto md:py-8">
                     <p className='text-white sm:text-[1.4rem] font-extralight text-[1.2rem] md:text-[2rem]'>
                     npm install --save playroomkit react react-dom
                     </p>
                    </Card>
                    <div className='mt-2 grid grid-cols-3 gap-3 p-4 md:flex md:justify-between  lg:w-[70%] lg:mx-auto '>
      {techCards.map((card, index) => (
        <div key={index} className="h-[90px] w-fit border-[#3E3E47] border-[0.87px] md:h-[34px] w-full md:min-w-fit md:w-full md:px-2 md:py-1 flex items-center md:gap-2 rounded-xl justify-center ">
          <img className='md:h-[16px] md:w-[16px] ' src={card.icon} alt={`${card.title} icon`} />
          <h6 className='text-white font-bold hidden md:block'>{card.title}</h6>
        </div>
      ))}
    </div>


       {/* EDITOR */}
       <div>
       <svg className='md:hidden'  viewBox="0 0 374 192" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.402832" y="0.622681" width="183.516" height="190.868" fill="#161718"/>
<circle cx="92.4807" cy="98.646" r="31.8557" fill="#8C72F4"/>
<rect x="63.3477" y="130.502" width="60.9886" height="60.9886" fill="#5BEDB0"/>
<rect x="189.984" y="0.622681" width="183.516" height="190.868" fill="#161718"/>
<circle cx="276.609" cy="98.646" r="31.8557" fill="#8C72F4"/>
<rect x="247.476" y="130.502" width="60.9886" height="60.9886" fill="#5BEDB0"/>
</svg>
<div className='mt-6'>
    <img className='w-full md:hidden' src={editorMobileImg} alt="" /></div>
    <img className='w-full hidden md:block' src={editorDesktopImg} alt="" />

       </div>
     
       
    </div>
    </Container>

  )
}

export default GetStarted