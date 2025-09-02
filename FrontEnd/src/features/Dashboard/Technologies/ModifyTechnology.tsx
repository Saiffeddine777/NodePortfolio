import { Box  , Button , Typography, FormControl, Input ,InputLabel , Select , FormHelperText , MenuItem} from "@mui/material"
import type { AxiosResponse } from "axios"
import React from "react"
import { useLocation, useNavigate, type Location } from "react-router"
import { TechType, type Technology } from "../../../Types/Technology"
import axios from "axios"
import { handleComponentError } from "../../../Helpers/ErrorHandler"
import { generateData, generateFromDataFromRefObject, handleInputChangeIntoARefObject } from "../../../Helpers/FieldVerifier"
import { handleSuccess } from "../../../Helpers/Sweetalert"


type Props = {

}
const apiUrl :string = import.meta.env.VITE_API_URL 
function ModifyTechnology({}: Props) {
  

  const location : Location<{id?:number}> = useLocation()
  const navigte = useNavigate()
  
  
  const [trigg, setTrigg] = React.useState<boolean>(false)
  const [tech, setTech] = React.useState<Technology |null>(null)
 
  const techRef = React.useRef<Technology>({
    name : "",
    technologyType : TechType.TOOLS,
    file :null,
    score : 0
  })
  const arrayOftechTypes : TechType []=[
        TechType.BACKEND,
        TechType.DATABASE,
        TechType.FRONTEND ,
        TechType.INFRASTRUCTURE,
        TechType.LANGUAGE,
        TechType.TOOLS
      ]
  
  const handleFetchOnetech : ()=>Promise <void>= async ()=>{
    try {
      const result : AxiosResponse<Technology> = await axios.get (`${apiUrl}/api/technologies/${location.state.id}`)
      setTech(result.data)
      
    } catch (error) {
      handleComponentError(error)
    }
  }

  const handleSubmit :()=>Promise<void >=async()=>{
    try {
      const formData=  generateFromDataFromRefObject({current :  generateData(techRef.current)})
      await axios.put(`${apiUrl}/api/technologies/${location.state.id}`, formData)
      setTrigg(!trigg)
      handleSuccess("Modifiying tech" ,"Technologi modified Sccessfully")
    } catch (error) {
      handleComponentError(error)
    }
  }

  const navigateBackToTechnologies :()=>void =()=>{
    navigte("/dashboard/technologies")
  }

  React.useEffect(()=>{
    handleFetchOnetech()
  },[trigg])

  

  return (
       <>
    <Button 
      variant="contained"
      onClick={navigateBackToTechnologies}
    >
      back to Technologies
    </Button>
       <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifySelf: "center",
            marginTop: "-2%",
            alignItems: "center",
          }}
        >
    
        <Typography variant="h5">Modify A technology Skill</Typography>
      <FormControl
        sx={{
          width: "200%",
        }}
      >
        <InputLabel htmlFor="my-input">What did I learn</InputLabel>
        <Input 
        
          onChange={(e) => handleInputChangeIntoARefObject( techRef ,e, "name")} 
        
        />
        <FormHelperText id="my-helper-text">
           {tech?.name}
        </FormHelperText>
      </FormControl>  
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Select A type</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          aria-placeholder={tech?.technologyType}
          value={tech?.technologyType}
          label="Age"
         
          onChange={(e)=>handleInputChangeIntoARefObject(techRef , e,  "technologyType")}
        >
          {arrayOftechTypes.map((element , index)=>{
            return<MenuItem key={index} value ={element}>{element}</MenuItem>
          })}
        </Select>
      </FormControl>
       <FormControl
        sx={{
          width: "200%",
        }}
      >
        <InputLabel htmlFor="my-input">I will give My Self a Score</InputLabel>
        <Input 
          onChange={(e) => handleInputChangeIntoARefObject( techRef ,e,"score")} 
        />
        <FormHelperText id="my-helper-text">
          {tech?.score}
        </FormHelperText>
      </FormControl>
        <FormControl
        sx={{
          width: "200%",
        }}
      >

        <Input 
          onChange={(e) => handleInputChangeIntoARefObject( techRef ,e,"file")} type="file" 
          />
        <FormHelperText id="my-helper-text">
          Insert a referencing photo
        </FormHelperText>
      </FormControl>
      <Button 
         variant="outlined"
         onClick={handleSubmit}
         >
         Submit Technology
      </Button>
    </Box>
    </>
  )
}

export default ModifyTechnology