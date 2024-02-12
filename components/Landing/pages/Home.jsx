
import GetStarted from '../componenets/get-started-in-minute/GetStarted'
import SaveDevelopment from '../componenets/save-dev/SaveDevelopment'
import Features from '../componenets/features/Features'
import { Container } from '../componenets/ui/Container'
import Resources from '../componenets/ressources/Resources'
import {BuiltForNextGeneration} from '../componenets/built-for-nextGeneration/BuiltForNextGeneration'
import { LetsConnect } from '../componenets/lets-connect/LetsConnect'
const Home = () => {

 return (

    <>
    
    
    <Container><BuiltForNextGeneration/></Container>
    <GetStarted />
    <Container>
      <SaveDevelopment />
    <Features/>
    <Resources />
    <LetsConnect />
    </Container>
  
    
    </>


  
 )
}

export default Home