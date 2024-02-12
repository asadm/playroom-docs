import React from 'react'
import ressorces from "../../assets/resourcesImg.svg"
import Card from '../ui/Card'
import Button from '../ui/Button'
const Resources = () => {
  return (
    <div className=" mt-20   bg-lightBlack    rounded-[18px] border-[0.67px] border-primaryBorderColor overflow-hidden   md:grid md:grid-cols-2 md:gap-x-20 ">
           <div className="text-center md:text-left  p-4 pt-10 md:self-center md:pl-10 ">
        <h2>Resources</h2>
        <p className="my-5 mx-auto px-8 md:px-1 lg:w-[70%] lg:mx-0">
        Never start from Zero. A growing library of open-source game templates and cross-platform resources with Playroom to help you quick start your next hit game.        </p>
      <Button >View Templates</Button>
      </div>
   <img className=' mt-10 md:mt-0 w-full h-full overflow-hidden' src={ressorces} alt="" />


    </div>
  )
}

export default Resources