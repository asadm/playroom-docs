import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar'
import { Footer } from '../footer/Footer'
import { Container } from './Container'
import Hero from '../Hero'
import rectangleLight from '../../assets/RectangleLight.png'
import { useLocation } from 'react-router-dom';
import Button from './Button'
const AppLayout = () => {
    const location = useLocation();

    console.log("path", location.pathname); 
  return (
    <>
     <div  className='p-4 heroWrraper min-h-[100vh] md:h-[100vh] z-10 relative'>
          <Container>
              <Navbar />
           {location.pathname === "/" && <Hero/>}
           {location.pathname === "/pricing" &&  
          <div className='mt-32 text-left md:text-center  p-5'>
            <h2>Simple Pricing </h2>
            <p className='mt-4 md:my-[3vh]'>
              Transparent pricing based on MAU (Monthly active users). Pay Zero for non-commercial and low-usage games.
            </p>
            <Button>Price Comparison</Button>
          </div>

      }  
           {location.pathname === "/resources" &&  
          <div className=" text-left md:text-center mt-20 md:mt-40">
          <h2>Resources</h2>
          <p className="my-6  md:w-auto mx-auto ">
            Multiplayer configurations and tools to create games previously <br className='hidden md:block' /> only feasible by large-scale teams now possible by EVERYONE.
          </p>
          <Button>Ressources</Button>
      </div>
      }  
          </Container>
         
        <img className='w-full absolute left-0 right-0 bottom-0 h-[180px]' src={rectangleLight} alt="" />
        </div>
    <Outlet/>
     <Footer/>
    </>
  )
}

export default AppLayout