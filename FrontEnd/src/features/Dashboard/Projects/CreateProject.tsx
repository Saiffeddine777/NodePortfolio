import React from "react"
import { ProjectCategory, type Project } from "../../../Types/Project"
import { Box  , FormControl , InputLabel , Input , FormHelperText, Button } from "@mui/material"
import axios from "axios"
import { apiUrl } from "../../../Urls"
import { generateData, generateFromDataFromRefObject, handleInputChangeIntoARefObject } from "../../../Helpers/FieldVerifier"
import { handleComponentError } from "../../../Helpers/ErrorHandler"
import { handleSuccess } from "../../../Helpers/Sweetalert"


type Props = {}

function CreateProject({}: Props) {
  const projectRef = React.useRef<Project> ({
    projectName:"",
    githubUrl: "",
      liveUrl: "",
      published: false,
      description: "",
      techStack: [],
      category: ProjectCategory.WEB,
      file : undefined,

  })

  const handlePostProject : ()=>Promise<void> = async() =>{
    try {
      const nonEmpty = generateData(projectRef.current)
      await axios.post(`${apiUrl}/api/projects` ,generateFromDataFromRefObject({current: nonEmpty}))
      handleSuccess("Project Inserted","Project has been Successfully Inserted")
    } catch (error) {
      handleComponentError(error)      
    }
  }
  return (
    <Box> 
      <FormControl
          sx={{
            width: "200%",
          }}
        >
          <InputLabel htmlFor="my-input">Wa </InputLabel>
          <Input
            onChange={(e) =>
              handleInputChangeIntoARefObject(projectRef, e, "projectName")
            }
          />
          <FormHelperText id="my-helper-text">EX: java</FormHelperText>
        </FormControl>
        <Button onClick={handlePostProject}>Submit the Project</Button>
        </Box>
  )
}

export default CreateProject