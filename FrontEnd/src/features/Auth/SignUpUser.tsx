import {
  Box,
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  Button
} from "@mui/material";
import React from "react";
import type { User } from "../../Types/User";
import type { RefChangerFunction } from "../../Types/Utilities";
import type { AxiosResponse } from "axios";
import axios from "axios";
import { handleComponentError } from "../../Helpers/ErrorHandler";
import { handleSuccess } from "../../Helpers/Sweetalert";
import { verifyEmptiness } from "../../Helpers/FieldVerifier";
import { useNavigate } from "react-router";

type Props = {};

const SignUpUser = ({}: Props) => {
const navigate = useNavigate()
const apiUrl = import.meta.env.VITE_API_URL
  const signInRef = React.useRef<User>({
    firstName: "",
    lastName :"",
    email :"",
    password :"",
    confirmPassword :"",
    phoneNumber :"",
    occupation :"",
    userName:""
  })

   const handleChange : RefChangerFunction<User> = (event, key)=>{
       signInRef.current[key]= event.target.value as never
   } 


  
  const handleSignUp  : ()=>Promise<void | string> = async()=>{
     try {
      console.log(signInRef)
      const {email , userName , lastName , phoneNumber , password ,occupation ,firstName ,confirmPassword} = signInRef.current
      if (password !== confirmPassword ) throw Error ("Password's don't Matchs") ;
      const result :AxiosResponse<User> = await axios.post(`${apiUrl}/api/users/`  ,verifyEmptiness({email , userName , lastName , phoneNumber , password ,occupation ,firstName}))
      if (result.data.id){
        handleSuccess("User Insertion" , "User inserted Sucessfully")
        navigate("/login")
      }
      
     } catch (error) {
        handleComponentError(error)
     }
  }
  return (
    <Box sx={{
      display: "flex", 
      flexDirection :"column",
      justifySelf: "center",
      marginTop :"5%",
      alignItems :"center"
    }}>
      <FormControl sx={{
        width :"200%"
      }}>
        <InputLabel htmlFor="my-input">Email address</InputLabel>
        <Input  onChange={(e)=>handleChange(e, "email")}/>
        <FormHelperText id="my-helper-text">
          We'll never share your email. 
        </FormHelperText>
      </FormControl>
      <FormControl
      sx={{
        width :"200%"
      }}
      >
        <InputLabel htmlFor="my-input">First Name</InputLabel>
        <Input onChange={(e)=>handleChange(e,"firstName")} />
        <FormHelperText id="my-helper-text">
          EX : Saiffeddine 
        </FormHelperText>
      </FormControl>
      <FormControl
      sx={{
        width :"200%"
      }}
      >
        <InputLabel htmlFor="my-input">Last name</InputLabel>
        <Input onChange={(e)=>handleChange(e, "lastName")} />
        <FormHelperText id="my-helper-text">
          Ex : Zouaghi
        </FormHelperText>
      </FormControl>
      <FormControl
      sx={{
        width :"200%"
      }}
      >
        <InputLabel htmlFor="my-input">User Name</InputLabel>
        <Input onChange={(e)=>handleChange(e, "userName")} />
        <FormHelperText id="my-helper-text">
          Ex: Saif123
        </FormHelperText>
      </FormControl>
      <FormControl
      sx={{
        width :"200%"
      }}
      >
        <InputLabel htmlFor="my-input">Phone number</InputLabel>
        <Input onChange={(e)=>handleChange(e, "phoneNumber")} />
        <FormHelperText id="my-helper-text">
          +216 23******
        </FormHelperText>
      </FormControl>
      <FormControl
      sx={{
        width :"200%"
      }}
      >
        <InputLabel htmlFor="my-input">Occupation</InputLabel>
        <Input onChange={(e)=>handleChange(e, "occupation")} />
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
        <Input onChange={(e)=>handleChange(e, "password")} type="password" />
        <FormHelperText id="my-helper-text">
           Password
        </FormHelperText>
      </FormControl>
      
      <FormControl
      sx={{
        width :"200%"
      }}
      >
        <InputLabel htmlFor="my-input">Confirm Password</InputLabel>
        <Input onChange={(e)=>handleChange(e, "confirmPassword")}  type="password" />
        <FormHelperText id="my-helper-text">
          Confirm that passoword
        </FormHelperText>
      </FormControl>
      <Button
        onClick={handleSignUp}
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
  );
};

export default SignUpUser;