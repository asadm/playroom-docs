import Card from './Card'
const FeatureSubmenuLinkItem = ({title,description}) => {
  return (
    <div   className='flex gap-4'>
    <Card className="h-[32px] w-[39px] rounded-[1rem] border-[1.4px]" />
    <div>
      <h6 className='mb-2'>{title}</h6>
      <span className='text-[1.1rem] font-medium text-[#595959]'>{description}</span>
    </div>
  </div>  )
}

export default FeatureSubmenuLinkItem