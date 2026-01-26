import {
  Box,
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  Typography,
  Button,
  Paper,
  Divider,
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
  const [password, setPassword] = React.useState<string>("");
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

      const result: AxiosResponse<User> = await api.post(
        `/api/users/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (result.data.id) {
        handleSuccess("User Insertion", "User inserted successfully");
        setPassword(result.data.password as string);
      }
    } catch (error) {
      handleComponentError(error);
    }
  };

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
          Create User
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Fill in the information below to create a new user.
        </Typography>

        {password !== "" && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              borderRadius: 2,
              bgcolor: "warning.light",
            }}
          >
            <Typography fontWeight="bold">
              Temporary password
            </Typography>
            <Typography>
              <strong>{password}</strong> — copy it now. It will be
              deleted when you leave this page.
            </Typography>
          </Box>
        )}

        <Box display="flex" flexDirection="column" gap={2}>
          <FormControl fullWidth>
            <InputLabel>Email address</InputLabel>
            <Input onChange={(e) => handleChange(e, "email")} />
            <FormHelperText>
              We'll never share your email.
            </FormHelperText>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>First Name</InputLabel>
            <Input onChange={(e) => handleChange(e, "firstName")} />
            <FormHelperText>Ex: Saiffeddine</FormHelperText>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Last Name</InputLabel>
            <Input onChange={(e) => handleChange(e, "lastName")} />
            <FormHelperText>Ex: Zouaghi</FormHelperText>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>User Name</InputLabel>
            <Input onChange={(e) => handleChange(e, "userName")} />
            <FormHelperText>Ex: Saif123</FormHelperText>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Phone Number</InputLabel>
            <Input onChange={(e) => handleChange(e, "phoneNumber")} />
            <FormHelperText>+216 23******</FormHelperText>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Occupation</InputLabel>
            <Input onChange={(e) => handleChange(e, "occupation")} />
            <FormHelperText>Human Resources</FormHelperText>
          </FormControl>

          <Divider sx={{ my: 2 }} />

          <FormControl>
            <InputLabel shrink>Profile Image</InputLabel>
            <Input type="file" onChange={(e) => handleChange(e, "file")} />
          </FormControl>

          <Button
            onClick={handleSignUp}
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
            Create User
          </Button>
        </Box>
      </Paper>
    </>
  );
};

export default CreateUser;
