import { Box ,Button ,Card , Avatar , CardContent, Typography ,Divider , IconButton } from '@mui/material'
import React from 'react'
import type { Technology } from '../../../Types/Technology.ts'
import { useLocation, useNavigate, type Location } from 'react-router'
import type { AxiosResponse } from 'axios'
import { handleComponentError } from '../../../Helpers/ErrorHandler.ts'
import EditIcon from "@mui/icons-material/Edit";
import { api } from '../../../ApiService/ApiBrain.ts'

type Props = {}
function OneTechnology({}: Props) {
  const navigate = useNavigate()
  const location :Location<{id?:number}> = useLocation();
  const [tech, setTech]  = React.useState<Technology|null>(null)
  
  const handleFetchOneTech :()=> Promise<void> = async()=>{
    try {
      const result :AxiosResponse<Technology> = await api.get(`/api/technologies/${location.state.id}`)   
      result && setTech(result.data) 
    } catch (error) {
      handleComponentError(error)
    } 
  }
   
  React.useEffect(()=>{
    handleFetchOneTech()
  },[])

  // const navigateToTechnologies = ()=>{ 
  //   navigate("/dashboard/technologies")
  // }
  // const navigateToModify = (techId ?:number)=>{
      
  // }
  const navigateToSomething =(path:string  , techId ?:number):void =>{
    navigate(`/dashboard/${path}`, techId?{state : {id:techId}}:undefined)
  }

  return (    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="50vh"
      bgcolor="#f5f6fa"
      p={2}
    >
      <Card
        sx={{
          width: 400,
          borderRadius: "16px",
          boxShadow: "0px 8px 20px rgba(0,0,0,0.1)",
          p: 2,
          background: "white",
        }}
      >
        <Button variant="text" onClick={()=>navigateToSomething("technologies")}>
          Back To Technologies
        </Button>
        <Box display="flex" justifyContent="center" mt={2}>
          <Avatar
            src={tech?.logoUrl}
            alt={tech?.name}
            sx={{ width: 100, height: 100, boxShadow: 2 }}
          />
        </Box>
        <CardContent>
          <Typography
            variant="h5"
            align="center"
            sx={{ fontWeight: "bold", mb: 1 }}
          >
            {tech?.name}
          </Typography>
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            {tech?.technologyType}
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Typography variant="body1">
              <strong>Score:</strong> {tech?.score}
            </Typography>
            <Typography variant="body1">
              <strong>Public ID:</strong> {tech?.publicId}
            </Typography>
            <Typography variant="body1">
              <strong>Technology ID:</strong> {tech?.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Created At:</strong>{" "}
              {tech?.createdAt && new Date(tech.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Updated At:</strong>{" "}
              {tech?.updatedAt && new Date(tech.updatedAt).toLocaleString()}
            </Typography>
          </Box>

          {/* <DeleteTechnology id={tech?.id} componentName={OneTechnology.name} /> */}

          <IconButton onClick={()=>navigateToSomething("modifytechnology" , tech?.id)}>
            <EditIcon />
          </IconButton>
        </CardContent>
      </Card>
    </Box>
  )
}

export default OneTechnology