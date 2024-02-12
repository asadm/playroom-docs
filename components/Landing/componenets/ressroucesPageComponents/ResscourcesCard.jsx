
import forkIcon from "../../assets/forkIcon.svg"

const ResscourcesCard = ({imgSrc}) => {
  return (
    <div className='w-fit '>
        <img className=' mb-4 w-full' src={imgSrc} alt="ressource image " />
        <div className='flex justify-between items-center'>
            <span className='text-white text-[12px]'>By: Playroom</span>   
            <img src={forkIcon} alt="fork Icon" />
        </div>
    </div>
  )
}

export default ResscourcesCard