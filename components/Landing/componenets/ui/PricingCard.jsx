import Card from "./Card"
import Button from "./Button"
import checkIcon from "../../assets/checkIcon.svg"


const FeatureItemToBeYellowText="10,000 MAU extra credits"

const PricingCard = ({title,price,buttonName,planFeatures}) => {
  return (
    <Card className={`rounded-[17px] py-14  ${price === "Custom" ? "bg-purpleCardBackground":""}  px-8 my-4`}>
        <div className="md:text-left">
            <span className="text-white text-[15px] font-semibold">{title}</span>
            <span className="flex ">
              <h3 className="text-[27px] md:text-[43px] font-semibold capitalize">{price}</h3>
              {/\d/.test(price) && <span className="inline-block self-end left-1 text-[13px] relative bottom-5 font-light text-white">/month</span>}
            </span>
        </div>
        <button className={`rounded-[6px]  text-[14px] bg-transparent w-full my-8 p-4 py-5  border-[1.8px] border-[#292a2d83] ${price.toLowerCase() === "free" ? "gradientBtn text-black border-none" : "text-white"} `}>{buttonName}</button>
        <ul>
            {planFeatures.map((feature,index) =>{
                return  <li key={index} className="flex items-center">                
                  <svg className="mr-3" width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M1.39795 5.28658L4.83877 8.72739L12.0332 1.53296" stroke={`${feature === FeatureItemToBeYellowText ? "#FFC909":"#5BEDB0" } ` } stroke-width="1.85663"/>
                  </svg>
                  <span className={`my-2 font-light  text-[13px] ${feature === FeatureItemToBeYellowText ? "text-[#FFC909]":"text-white" }`}>{feature}</span>
            </li> 
            })}
           
        </ul>
    </Card>
  )
}

export default PricingCard