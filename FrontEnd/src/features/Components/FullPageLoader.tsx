import { Backdrop, CircularProgress } from "@mui/material"

type Props = {open :boolean}

const FullPageLoader = ({open}: Props) => {
  
    return (
    <Backdrop sx={{
        color : "#fff",
        zIndex : (theme)=>theme.zIndex.drawer +1 
    }}
     open={open}
    >
      <CircularProgress color="inherit" />

    </Backdrop>
  )
}

export default FullPageLoader