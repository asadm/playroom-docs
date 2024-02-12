
const PackageList = ({packageOffres,packageName,className,hasBorder=true}) => {
  return (
    <div className={`md:my-20 my-20 text-[#D2D2D2] md:h-[410px] ${className}`}>
    <h6 className={` h-14  text-[13px] font-semibold ${hasBorder ? "border-b-[1.5px] pb-6 border-[#8f8d8d73] text-[#D2D2D2]" : "text-white text-[2.3rem]"} `}>{packageName}</h6>
    <ul className="text-[#D2D2D2]">
      {packageOffres.map(item =>{
        return   <li className={`${hasBorder ? "text-[#D2D2D2]" :"text-white"} my-8 text-[13px]`}>
           {!item.hasCheck && <span>{item.text}</span>}
           {item.hasCheck &&  <img className="h-6 mx-auto w-8" src={item.iconSource} />}
           </li>

      })}
    </ul>
  </div>
  )
}




export default PackageList


