import React from 'react';
import Card from '../ui/Card';

const BuiltForNextGenerationCard = ({id,onClick,selectedTabId,className, img1Src,img2Src, title, desc }) => {

  return (
    <Card  onClick={onClick} className={`cursor-pointer ${id === selectedTabId ? "border-[1px] border-purpleBorder  " :""} transition duration-500 hover:border-[1px] h-full py-6 px-4 w-full ${id === 4 ? "hidden md:block": ""} md:p-6 md:py-8 ${className} `}>
      <div className='flex  h-[30px]  mb-4 gap-4'>
        <img className={`h-[24px] ${id === 1 ? "h-[30px]" : id === 5 ? "h-[20px] self-end" :""} ${id === 3  ? " h-[30px] ml-4  scale-150" : "mb-3"}`} src={img1Src} alt="" />
        {img2Src &&  <img className={` h-[24px] ${id === 5 ? "h-[14px] self-center":''}`} src={img2Src} alt="" />}
        </div>
      <h6 className="text-white font-medium mb-2 text-[1.4rem]">{title}</h6>
      <span className="small-text">{desc}</span>
    </Card>
  );
}

export default BuiltForNextGenerationCard;
