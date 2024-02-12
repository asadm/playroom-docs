import Navbar from "../componenets/Navbar"
import { Container } from "../componenets/ui/Container"
import ResscourcesCard from "../componenets/ressroucesPageComponents/ResscourcesCard"


import ressourceImg1 from "../assets/ressourcesimg1.png"
import ressourceImg2 from "../assets/ressourcesimg2.png"
import ressourceImg3 from "../assets/ressourcesimg3.png"
import ressourceImg4 from "../assets/ressourcesimg4.png"
import ressourceImg5 from "../assets/ressourcesimg5.png"
import ressourceImg6 from "../assets/ressourcesimg6.png"
import ressourceImg7 from "../assets/ressourcesimg7.png"
import ressourceImg9 from "../assets/ressrourceImg9.png"
import HireDeveloperCard from "../componenets/ressroucesPageComponents/HireDeveloperCard"
const ressourcesListImages=[
ressourceImg9,
ressourceImg1,
ressourceImg2,
ressourceImg3,
ressourceImg4,
ressourceImg5,
ressourceImg6,
ressourceImg7,
ressourceImg3,
]


const ResourcesPage = () => {
  return (


       
    
    <Container>
        <div className="sm:grid mt-20 md:mt-40 sm:grid-cols-2 md:grid-cols-3 sm:gap-10">
        {ressourcesListImages.map((src,index) => {
          return <ResscourcesCard key={index} imgSrc={src} />
        })}  
        </div>
      <HireDeveloperCard />
      </Container>
    
   
  
  
  )
}

export default ResourcesPage