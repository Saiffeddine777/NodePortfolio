import {
  Box,
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  InputAdornment,
  IconButton,
} from "@mui/material";
import React from "react";
import type { User } from "../../Types/User.ts";
import type { RefChangerFunction } from "../../Types/Utilities.ts";
import type { AxiosResponse } from "axios";
import { handleComponentError } from "../../Helpers/ErrorHandler.ts";
import { handleSuccess } from "../../Helpers/Sweetalert.ts";
import { verifyEmptiness } from "../../Helpers/FieldVerifier.ts";
import { useNavigate } from "react-router";
import { api } from "../../ApiService/ApiBrain.ts";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import BackToHome from "../HomeComponents/BackToHome.tsx";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type Props = {};

const SignUpUser = ({}: Props) => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    React.useState<boolean>(false);

  const { executeRecaptcha } = useGoogleReCaptcha();

  const signInRef = React.useRef<User>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    occupation: "",
    userName: "",
  });

  const handleChange: RefChangerFunction<User> = (event, key) => {
    signInRef.current[key] = event.target.value as never;
  };

  const handleSignUp = async () => {
    try {
      if (!executeRecaptcha) {
        throw new Error("Recaptcha is not Ready");
      }
      const token = await executeRecaptcha("contact_form");
      const {
        email,
        userName,
        lastName,
        phoneNumber,
        password,
        occupation,
        firstName,
        confirmPassword,
      } = signInRef.current;

      if (password !== confirmPassword) throw Error("Passwords don't match");

      const result: AxiosResponse<User> = await api.post(
        `/api/users/register`,
        verifyEmptiness({
          email,
          userName,
          lastName,
          phoneNumber,
          password,
          occupation,
          firstName,
        }),
        {
          headers: {
            recaptcha: token,
          },
        },
      );
      handleSuccess("Hello", `Welcome ${result?.data?.firstName}`);
      navigate("/login");
    } catch (error) {
      handleComponentError(error);
    }
  };

  return (
    <Box>
      <BackToHome />
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card elevation={4} sx={{ maxWidth: 700, width: "100%" }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight={600} textAlign="center" mb={1}>
              Create an Account
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              mb={4}
            >
              Fill in your information to get started
            </Typography>

            <Grid container spacing={3}>
              <FormControl fullWidth>
                <InputLabel>Email</InputLabel>
                <Input onChange={(e) => handleChange(e, "email")} />
                <FormHelperText>example@email.com</FormHelperText>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>User Name</InputLabel>
                <Input onChange={(e) => handleChange(e, "userName")} />
                <FormHelperText>Ex: saif123</FormHelperText>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>First Name</InputLabel>
                <Input onChange={(e) => handleChange(e, "firstName")} />
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Last Name</InputLabel>
                <Input onChange={(e) => handleChange(e, "lastName")} />
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Phone Number</InputLabel>
                <Input onChange={(e) => handleChange(e, "phoneNumber")} />
                <FormHelperText>+216 XX XXX XXX</FormHelperText>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Occupation</InputLabel>
                <Input onChange={(e) => handleChange(e, "occupation")} />
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Password</InputLabel>
                <Input
                  type={showPassword?"text":"password"}
                  onChange={(e) => handleChange(e, "password")}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Confirm Password</InputLabel>
                <Input
                  type={showConfirmPassword?"text":"password"}
                  onChange={(e) => handleChange(e, "confirmPassword")}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        edge="end"
                      >
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>

            <Button
              onClick={handleSignUp}
              variant="contained"
              fullWidth
              sx={{
                mt: 4,
                py: 1.3,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              Create Account
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default SignUpUser;
