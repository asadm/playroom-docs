import React from 'react'

const Card = ({children,className,onClick}) => {
  return (
    <div onClick={onClick} className={`bg-lightBlack   p-4 rounded-[18px] border-[0.67px] border-primaryBorderColor ${className}`}>{children}</div>
  )
}

export default Card