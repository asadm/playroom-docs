import PricingCard from "../../componenets/ui/PricingCard"
import { Container } from "../../componenets/ui/Container"
import PackageList from "../../componenets/multiplayer/PackageList"
import { plansData } from "../../data/data"
import { packageOffersData1,packageOffersData2,packageOffersData3 } from "../../data/data"


const Pricing = () => {
  return (  
    <Container>
      <div className="mt-20 gap-6 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
        {plansData.map((plan, index) => {
          return <PricingCard key={index} {...plan} />
        })}
      </div>
      <div className="text-center mt-40">
        <h2>Multiplayer & More </h2>
        <p className='mt-4 md:my-[3vh]'>
          Building multiplayer is hard and its more than just networking. Leverage Playroom to you ship your games faster and across platforms.
        </p>
        <div className="md:grid sm:w-[80%] sm:mx-auto md:w-full lg:w-[90%] mt-20 md:mt-40   md:grid-cols-3 md:grid-rows-auto ">
          <div>
            {packageOffersData1.map(({ packageName, packageFeatures }, index) => {
              return <PackageList key={index} packageOffres={packageFeatures} packageName={packageName} />;
            })}  
          </div>
          <div className="bg-[#1B1125] rounded-3xl py-6 md:py-0 h-full">
            {packageOffersData2.map(({ packageName, packageFeatures }, index) => {
              return <PackageList  className=" text-white"  key={index} packageOffres={packageFeatures} packageName={packageName} hasBorder={false}/>;
            })}
          </div>
          <div>           
          {packageOffersData3.map(({ packageName, packageFeatures }, index) => {
              return <PackageList  className=" text-white"  key={index} packageOffres={packageFeatures} packageName={packageName} />;
            })}
          </div>
        </div>
      </div>
    </Container>
  )
}

export default Pricing