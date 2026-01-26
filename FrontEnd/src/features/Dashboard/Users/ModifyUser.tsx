import {
  Box,
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  Button,
  Paper,
  Typography,
  Divider,
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
          ? { headers: { "Content-Type": "multipart/form-data" } }
          : undefined
      );

      handleSuccess("User Update", "User updated successfully");
      setTrigg(!trigg);
    } catch (error) {
      handleComponentError(error);
    }
  };

  const fetchUserToModify: () => Promise<void> = async () => {
    try {
      const result: AxiosResponse<User> = await api.get(`/api/users/${id}`);
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
      <Button
        onClick={navigateToUsers}
        sx={{ mb: 2, textTransform: "none" }}
      >
        ← Back to Users
      </Button>

      <Paper
        elevation={2}
        sx={{
          maxWidth: 600,
          mx: "auto",
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography variant="h6" fontWeight="bold" mb={1}>
          Modify User
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Leave fields empty to keep the current values.
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          <FormControl fullWidth>
            <InputLabel>Email address</InputLabel>
            <Input onChange={(e) => handleChange(e, "email")} />
            <FormHelperText>
              Current: {userToModify.email}
            </FormHelperText>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>First Name</InputLabel>
            <Input onChange={(e) => handleChange(e, "firstName")} />
            <FormHelperText>
              Current: {userToModify.firstName}
            </FormHelperText>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Last Name</InputLabel>
            <Input onChange={(e) => handleChange(e, "lastName")} />
            <FormHelperText>
              Current: {userToModify.lastName}
            </FormHelperText>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>User Name</InputLabel>
            <Input onChange={(e) => handleChange(e, "userName")} />
            <FormHelperText>
              Current: {userToModify.userName}
            </FormHelperText>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Phone Number</InputLabel>
            <Input onChange={(e) => handleChange(e, "phoneNumber")} />
            <FormHelperText>
              Current: {userToModify.phoneNumber}
            </FormHelperText>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Occupation</InputLabel>
            <Input onChange={(e) => handleChange(e, "occupation")} />
            <FormHelperText>
              Current: {userToModify.occupation}
            </FormHelperText>
          </FormControl>

          <Divider sx={{ my: 2 }} />

          <FormControl>
            <InputLabel shrink>Profile Image</InputLabel>
            <Input type="file" onChange={(e) => handleChange(e, "file")} />
            <FormHelperText>
              Upload only if you want to replace the current image
            </FormHelperText>
          </FormControl>

          <Button
            onClick={handleSubmitModification}
            type="button"
            variant="contained"
            sx={{
              mt: 3,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Paper>
    </>
  );
};

export default ModifyUser;
