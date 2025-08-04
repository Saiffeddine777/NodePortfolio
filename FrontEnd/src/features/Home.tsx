import { Box } from "@mui/material"
import Nav from "./HomeComponents/Nav"
import Main from "./HomeComponents/Main"
import Footer from "./HomeComponents/Footer"


type Props = {}

const Home = ({}: Props) => {
  return (
    <Box sx={{
      
    }}>
      <Nav/>
      <Main/>
      <Footer/>
    </Box>
  )
}

export default Home   