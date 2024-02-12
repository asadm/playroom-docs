import React from 'react'
import Card from '../ui/Card'
import noBackendIcon from "../../assets/noBackendIcon.svg"
import noBackendImage from "../../assets/noBackend.svg"
import lowlatencyImg from "../../assets/lowLatency.svg"
import region from "../../assets/region.svg"
import insertCoin from "../../assets/insertCoin.svg"
import lowlatencyicon from "../../assets/lowlatencyIcon.svg"
import earthIcon from "../../assets/earthIcon.svg"
import lowcodeIcon from "../../assets/lowCodeIcon.svg" 
import Button from '../ui/Button'
import { SaveDeveloopmentItemCard } from './SaveDeveloopmentItemCard'

export const saveDevCardsData = [
  {
    image: noBackendImage,
    icon: noBackendIcon,
    title: "No Backend",
    description: "Get people together for deeper casual games",
  },
  {
    image: region,
    icon: earthIcon,
    title: "Region: Earth",
    description: "Get people together for deeper casual games",
    className: "md:col-start-1 md:col-end-2 md:row-start-2",
  },
  {
    image: lowlatencyImg,
    icon: lowlatencyicon,
    title: "Low Latency",
    description: "Get people together for deeper casual games",
  },
  {
    image: insertCoin,
    icon: lowcodeIcon,
    title: "Low code SDK",
    description: "Get people together for deeper casual games",
  },
];
const SaveDevelopment = () => {
  return (
    <div 
  
     className='  mt-40 lg:grid lg:grid-cols-2 lg:gap-8'>
           <div className="text-center  md:text-left md:self-center ">
        <h2>Save development & maintenance time</h2>
        <p className="my-5 w-[80%] md:w-full mx-auto lg:mx-1 lg:w-[80%]">
        No longer will you have to oversee WebSocket, TCP, and webRTC protocols, along with server monitoring. You focus on your game and Playroom manages all other aspects.
        </p>
       <Button>Read about architecture</Button>
      </div>

<div className='sm:grid sm:grid-cols-2 mt-10 sm:gap-3 '>
    
{saveDevCardsData.map((feature, index) => (
      <SaveDeveloopmentItemCard key={index} {...feature} />
    ))}
</div>


    </div>
  )
}

export default SaveDevelopment