import {
  Box,
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  Button,
} from "@mui/material";
import React from "react";
import type { User } from "../../../Types/User.tsx";
import type { RefChangerFunction } from "../../../Types/Utilities.ts";
import type { AxiosResponse } from "axios";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import { handleSuccess } from "../../../Helpers/Sweetalert.ts";
import { generateData } from "../../../Helpers/FieldVerifier.ts";
import { useLocation, useNavigate, type Location } from "react-router";
import { api } from "../../../ApiService/ApiBrain.ts";

type Props = {};

const ModifyUser = ({}: Props) => {
  const location: Location<{ id?: number }> = useLocation();
  const id = location.state.id;
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

  const [userToModify, setUserToModify] = React.useState<User>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    occupation: "",
    userName: "",
  });

  const [trigg, setTrigg] = React.useState<boolean>(false);
  const navigateToUsers = () => {
    navigate("/dashboard/userlist");
  };

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

  const handleSubmitModification: () => Promise<void | string> = async () => {
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

      const nonEmptUserObject = generateData({
        email,
        userName,
        lastName,
        phoneNumber,
        occupation,
        firstName,
        file,
      });

      let formData: FormData = new FormData();
      Object.entries(nonEmptUserObject).forEach(([key, value]) => {
        if (value instanceof Blob) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      });
      await api.put(
        `/api/users/${id}`,
        nonEmptUserObject.file ? formData : nonEmptUserObject,
        formData.has("file")
          ? {
              headers: { "Content-Type": "multipart/form-data" },
            }
          : undefined
      );

      handleSuccess("User Insertion", "User inserted Sucessfully");
      setTrigg(!trigg);
    } catch (error) {
      handleComponentError(error);
    }
  };

  const fetchUserToModify: () => Promise<void> = async () => {
    try {
      const result: AxiosResponse<User> = await api.get(
        `/api/users/${id}`
      );
      setUserToModify(result.data);
    } catch (error) {
      handleComponentError(error);
    }
  };

  React.useEffect(() => {
    fetchUserToModify();
  }, [trigg]);
  return (
    <>
      <Button onClick={navigateToUsers}>Back to Users</Button>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifySelf: "center",
          marginTop: "-2%",
          alignItems: "center",
        }}
      >
        <FormControl
          sx={{
            width: "200%",
          }}
        >
          <InputLabel htmlFor="my-input">Email address</InputLabel>
          <Input onChange={(e) => handleChange(e, "email")} />
          <FormHelperText id="my-helper-text">
            {userToModify.email}
          </FormHelperText>
        </FormControl>
        <FormControl
          sx={{
            width: "200%",
          }}
        >
          <InputLabel htmlFor="my-input">First Name</InputLabel>
          <Input onChange={(e) => handleChange(e, "firstName")} />
          <FormHelperText id="my-helper-text">
            {userToModify.firstName}
          </FormHelperText>
        </FormControl>
        <FormControl
          sx={{
            width: "200%",
          }}
        >
          <InputLabel htmlFor="my-input">Last name</InputLabel>
          <Input onChange={(e) => handleChange(e, "lastName")} />
          <FormHelperText id="my-helper-text">
            {userToModify.lastName}
          </FormHelperText>
        </FormControl>
        <FormControl
          sx={{
            width: "200%",
          }}
        >
          <InputLabel htmlFor="my-input">User Name</InputLabel>
          <Input onChange={(e) => handleChange(e, "userName")} />
          <FormHelperText id="my-helper-text">
            {userToModify.userName}
          </FormHelperText>
        </FormControl>
        <FormControl
          sx={{
            width: "200%",
          }}
        >
          <InputLabel htmlFor="my-input">Phone number</InputLabel>
          <Input onChange={(e) => handleChange(e, "phoneNumber")} />
          <FormHelperText id="my-helper-text">
            {userToModify.phoneNumber}
          </FormHelperText>
        </FormControl>
        <FormControl
          sx={{
            width: "200%",
          }}
        >
          <InputLabel htmlFor="my-input">Occupation</InputLabel>
          <Input onChange={(e) => handleChange(e, "occupation")} />
          <FormHelperText id="my-helper-text">
            {userToModify.occupation}
          </FormHelperText>
        </FormControl>

        <InputLabel htmlFor="my-input">Insert An Image</InputLabel>
        <Input onChange={(e) => handleChange(e, "file")} type="file" />
        <Button
          onClick={handleSubmitModification}
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

export default ModifyUser;
