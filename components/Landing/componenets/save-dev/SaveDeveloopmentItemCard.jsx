import Card from "../ui/Card";

export const SaveDeveloopmentItemCard = ({ image, icon, title, description, className }) => (
    <Card className={`w-full mb-4 md:px-8 md:w-full px-4 py-10 ${className}`}>
      <img className='hidden md:block h-[120px] mb-12' src={image} alt="" />
      <img src={icon} alt="feature icon" />
      <h6 className='font-bold text-[1.4rem] my-2'>{title}</h6>
      <span className='text-[1.2rem] text-smallTextColor'>{description}</span>
    </Card>
  );