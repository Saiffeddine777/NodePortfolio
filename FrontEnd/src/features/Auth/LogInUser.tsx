import { Box , Input ,FormControl , InputLabel , FormHelperText, Button } from "@mui/material"
import React from "react"
import type { RefChangerFunction } from "../../Types/Utilities.ts"
import { useAppDispatch, useAppSelector } from "../../app/Hooks.ts"
import { authApiThunk } from "./UserAuthReducer.ts"

import { type SignInData } from "../../Types/User.ts"
import { handleSuccess } from "../../Helpers/Sweetalert.ts"
import { useNavigate, type NavigateFunction } from "react-router"
import { handleComponentError } from "../../Helpers/ErrorHandler.ts"
type Props = {}


const LogInUser = ({}: Props) => {
  const dispatch = useAppDispatch()
  const signInCredentials = React.useRef<SignInData>({email :"" , password :""})
  const user = useAppSelector(state =>state.userAuth)
  const navigate :NavigateFunction = useNavigate()

  const handleChange : RefChangerFunction<SignInData> = (event ,key)=>{
    signInCredentials.current[key] = event.target.value as never
  }
  const handleSignIn : ()=>Promise <void> =async ()=>{
     dispatch(authApiThunk(signInCredentials.current))
      if (user.error){
        handleComponentError(user.error)
        return
      }
     handleSuccess("Welcome" , "Successfully Signed In !")
     navigate("/")
  }
  return (
        <Box sx={{
      display: "flex", 
      flexDirection :"column",
      justifySelf: "center",
      marginTop :"5%",
      alignItems :"center"
    }}>

      <FormControl
      sx={{
        width :"200%"
      }}
      >
        <InputLabel htmlFor="my-input">Email</InputLabel>
        <Input onChange={(e)=>handleChange(e, "email")} />
        <FormHelperText id="my-helper-text">
          Human ressources
        </FormHelperText>
      </FormControl>
      
      
      <FormControl
      sx={{
        width :"200%"
      }}
      >
        <InputLabel htmlFor="my-input">Password</InputLabel>
        <Input onChange={(e)=>handleChange(e,"password")}  type="password" />
        <FormHelperText id="my-helper-text">
          Confirm that passoword
        </FormHelperText>
      </FormControl>
      <Button
        onClick={handleSignIn}
        type="button"
        variant="contained"
        sx={{
          mt: 3,
          px: 4,
          py: 1.5,
          borderRadius: 2,
          textTransform: "none",
          fontWeight: "bold",
          fontSize: "1rem",
          backgroundColor: "#1976d2",
          '&:hover': {
            backgroundColor: "#1565c0",
          },
          width : "50%",
        }}
      >Submit</Button>
    </Box>
  )
}

export default LogInUser