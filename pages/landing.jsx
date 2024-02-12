// import GetStarted from '../components/Landing/componenets/get-started-in-minute/GetStarted'
// import SaveDevelopment from '../components/Landing/componenets/save-dev/SaveDevelopment'
// import Features from '../components/Landing/componenets/features/Features'
// import { Container } from '../components/Landing/componenets/ui/Container'
// import Resources from '../components/Landing/componenets/ressources/Resources'
// import {BuiltForNextGeneration} from '../components/Landing/componenets/built-for-nextGeneration/BuiltForNextGeneration'
// import { LetsConnect } from '../components/Landing/componenets/lets-connect/LetsConnect'


// import { Outlet } from 'react-router-dom'
import Navbar from '../components/Landing/componenets/Navbar'
import { Footer } from '../components/Landing/componenets/footer/Footer'
import { Container } from '../components/Landing/componenets/ui/Container'
import Hero from '../components/Landing/componenets/Hero'
import rectangleLight from '../components/Landing/assets/RectangleLight.png'
// import Button from '../components/Landing/componenets/ui/Button'

const Home = () => {

 return (

    <div className='landing-container'>
    
    <div  className='p-4 heroWrraper min-h-[100vh] md:h-[100vh] z-10 relative'>
          <Container>
              <Navbar />
              <Hero/>
           
          </Container>
         
        <img className='w-full absolute left-0 right-0 bottom-0 h-[180px]' src={rectangleLight} alt="" />
        </div>
    {/* <Outlet/> */}
     <Footer/>
    {/* <Container><BuiltForNextGeneration/></Container>
    <GetStarted />
    <Container>
      <SaveDevelopment />
    <Features/>
    <Resources />
    <LetsConnect />
    </Container> */}
  
    
    </div>


  
 )
}

export default Home