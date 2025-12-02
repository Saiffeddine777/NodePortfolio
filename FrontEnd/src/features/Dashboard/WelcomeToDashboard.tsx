import { Typography } from "@mui/material"
import { useAppSelector } from "../../app/Hooks.ts"
type Props = {}

const WelcomeToDashboard = ({}: Props) => {
  const user = useAppSelector(state=>state.userAuth)
  console.log(`${user}`)
  return (
    <Typography>WelcomeToDashboard</Typography>
  )
}

export default WelcomeToDashboard