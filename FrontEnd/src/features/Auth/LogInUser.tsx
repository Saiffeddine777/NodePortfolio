import {
  Box,
  Input,
  FormControl,
  InputLabel,
  FormHelperText,
  Button,
  Card,
  CardContent,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import React from "react";
import type { RefChangerFunction } from "../../Types/Utilities.ts";
import { useAppDispatch } from "../../app/Hooks.ts";
import { authApiThunk } from "./UserAuthReducer.ts";
import { type SignInData } from "../../Types/User.ts";
import { handleSuccess } from "../../Helpers/Sweetalert.ts";
import { useNavigate, type NavigateFunction } from "react-router";
import { handleComponentError } from "../../Helpers/ErrorHandler.ts";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import BackToHome from "../HomeComponents/BackToHome.tsx";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type Props = {};

const LogInUser = ({}: Props) => {
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const dispatch = useAppDispatch();
  const signInCredentials = React.useRef<SignInData>({
    email: "",
    password: "",
  });
  const navigate: NavigateFunction = useNavigate();

  const handleChange: RefChangerFunction<SignInData> = (event, key) => {
    signInCredentials.current[key] = event.target.value as never;
  };

  const handleSignIn = async () => {
    if (!executeRecaptcha) {
      throw new Error("Recaptcha is not Ready");
    }
    try {
      const token = await executeRecaptcha("login");
      await dispatch(
        authApiThunk({ token, ...signInCredentials.current }),
      ).unwrap();
      handleSuccess("Welcome", "Successfully Signed In!");
      navigate("/");
    } catch (error) {
      handleComponentError(error);
    }
  };

  const handleNavigateInOrderToChangeForgetPassword: () => void = () => {
    navigate("/sendemail", {
      state: {
        from: "forget",
      },
    });
  };

  return (
    <Box>
      <BackToHome />
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card elevation={4} sx={{ width: 420 }}>
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Typography variant="h5" fontWeight={600} textAlign="center">
              Sign In
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              Access your dashboard
            </Typography>

            <FormControl fullWidth>
              <InputLabel>Email</InputLabel>
              <Input onChange={(e) => handleChange(e, "email")} 
              onKeyDown={(e)=>{
                if(e.key==="Enter") handleSignIn();
              }}
              />
              <FormHelperText>example@email.com</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Password</InputLabel>
              <Input
                type={showPassword?"text":"password"}
                onChange={(e) => handleChange(e, "password")}
                onKeyDown={(e)=>{
                if(e.key==="Enter") handleSignIn();
              }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                    onClick={()=>setShowPassword(prev=>!prev)}
                    edge="end"
                    >
                      {showPassword ?<Visibility/> :<VisibilityOff/>}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText>Enter your secure password</FormHelperText>
            </FormControl>

            <Button
              onClick={handleSignIn}
              variant="contained"
              sx={{
                mt: 1,
                py: 1.2,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
              }}
              fullWidth
            >
              Sign In
            </Button>
            <Typography
              variant="body2"
              onClick={handleNavigateInOrderToChangeForgetPassword}
              sx={{
                alignSelf: "flex-end",
                cursor: "pointer",
                color: "primary.main",
                fontWeight: 500,
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Forgot password?
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default LogInUser;
