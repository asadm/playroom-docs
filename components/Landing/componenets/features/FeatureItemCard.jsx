import React from 'react'
import Card from '../ui/Card'
import moderationIcon from "../../assets/moderationIcon.svg"
const FeatureItemCard = ({imgSrc,title,subheading}) => {
  return (
    <Card className="pt-10 carousel-item w-[172px]  md:m-6 px-12 md:pb-10 h-[150px] md:h-[180px] flex flex-col items-start justify-end md:w-full">
        <img className='h-12 mb-2' src={imgSrc} alt="feature icon" />
        <h6 className='my-2 text-[1.6rem] font-bold'>{title}</h6>
        <span className='hidden md:block text-[1.4rem] text-smallTextColor'>
        {subheading}
        </span>
    </Card>
  )
}

export default FeatureItemCard