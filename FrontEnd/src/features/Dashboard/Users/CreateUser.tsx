import {
  Box,
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  Typography,
  Button,
} from "@mui/material";
import React from "react";
import type { User } from "../../../Types/User.ts";
import type { RefChangerFunction } from "../../../Types/Utilities.ts";
import type { AxiosResponse } from "axios";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import { handleSuccess } from "../../../Helpers/Sweetalert.ts";
import { verifyEmptiness } from "../../../Helpers/FieldVerifier.ts";
import { useNavigate } from "react-router";
import { api } from "../../../ApiService/ApiBrain.ts";

type Props = {};

const CreateUser = ({}: Props) => {
  const [password, setPassword] = React.useState<string>("")
  const navigate = useNavigate();
  const signInRef = React.useRef<User>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    occupation: "",
    userName: "",
    file: null,
  });
  const navigateToUsers = ()=>{
    navigate("/dashboard/userlist")
  }

  const handleChange: RefChangerFunction<User> = (event, key) => {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    if (target instanceof HTMLInputElement && target.type === "file") {
      const files = target.files;
      if (files && files[0] && key === "file") {
        signInRef.current[key] = files[0];
      }
    } else {
      signInRef.current[key] = event.target.value as never;
    }
  };

  const handleSignUp: () => Promise<void | string> = async () => {
    try {
      const {
        email,
        userName,
        lastName,
        phoneNumber,
        occupation,
        firstName,
        file,
      } = signInRef.current;

      const nonEmptUserObject = verifyEmptiness({
        email,
        userName,
        lastName,
        phoneNumber,
        occupation,
        firstName,
        file,
      }) as User;
      let formData: FormData = new FormData();
      Object.entries(nonEmptUserObject).forEach(([key, value]) => {
        formData.append(key, value);
      });
      console.log(formData.get("file"));
      const result: AxiosResponse<User> = await api.post(
        `/api/users/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (result.data.id) {
        handleSuccess("User Insertion", "User inserted Sucessfully");
        setPassword (result.data.password as string)
      }
    } catch (error) {
      handleComponentError(error);
    }
  };
  return (
    <>
    <Button onClick={navigateToUsers}>
      Back to Users
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
      {password!=="" && <Typography>Please copy this password <span style={{fontWeight: "bold"}}>{password}</span> It will be deleted when you leave Tab</Typography>}
      <FormControl
        sx={{
          width: "200%",
        }}
      >
        <InputLabel htmlFor="my-input">Email address</InputLabel>
        <Input onChange={(e) => handleChange(e, "email")} />
        <FormHelperText id="my-helper-text">
          We'll never share your email.
        </FormHelperText>
      </FormControl>
      <FormControl
        sx={{
          width: "200%",
        }}
      >
        <InputLabel htmlFor="my-input">First Name</InputLabel>
        <Input onChange={(e) => handleChange(e, "firstName")} />
        <FormHelperText id="my-helper-text">EX : Saiffeddine</FormHelperText>
      </FormControl>
      <FormControl
        sx={{
          width: "200%",
        }}
      >
        <InputLabel htmlFor="my-input">Last name</InputLabel>
        <Input onChange={(e) => handleChange(e, "lastName")} />
        <FormHelperText id="my-helper-text">Ex : Zouaghi</FormHelperText>
      </FormControl>
      <FormControl
        sx={{
          width: "200%",
        }}
      >
        <InputLabel htmlFor="my-input">User Name</InputLabel>
        <Input onChange={(e) => handleChange(e, "userName")} />
        <FormHelperText id="my-helper-text">Ex: Saif123</FormHelperText>
      </FormControl>
      <FormControl
        sx={{
          width: "200%",
        }}
      >
        <InputLabel htmlFor="my-input">Phone number</InputLabel>
        <Input onChange={(e) => handleChange(e, "phoneNumber")} />
        <FormHelperText id="my-helper-text">+216 23******</FormHelperText>
      </FormControl>
      <FormControl
        sx={{
          width: "200%",
        }}
      >
        <InputLabel htmlFor="my-input">Occupation</InputLabel>
        <Input onChange={(e) => handleChange(e, "occupation")} />
        <FormHelperText id="my-helper-text">Human ressources</FormHelperText>
      </FormControl>

      <InputLabel htmlFor="my-input">Insert An Image</InputLabel>
      <Input onChange={(e) => handleChange(e, "file")} type="file" />
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
          "&:hover": {
            backgroundColor: "#1565c0",
          },
          width: "50%",
        }}
      >
        Submit
      </Button>
    </Box>
    </>

  );
};

export default CreateUser;
