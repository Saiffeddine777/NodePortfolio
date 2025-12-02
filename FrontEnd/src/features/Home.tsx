import { Box } from "@mui/material"
import Nav from "./HomeComponents/Nav.tsx"
import Main from "./HomeComponents/Main.tsx"
import Footer from "./HomeComponents/Footer.tsx"


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