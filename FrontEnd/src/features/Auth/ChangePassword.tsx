import type { AxiosResponse } from "axios";
import React from "react";
import { useParams } from "react-router";
import { api } from "../../ApiService/ApiBrain.ts";
import { handleComponentError } from "../../Helpers/ErrorHandler.ts";
import { handleInputChangeIntoARefObject } from "../../Helpers/FieldVerifier.ts";
import { Typography, Box, FormControl, Card, Input , InputLabel , CardContent ,FormHelperText , Button} from "@mui/material";
import FullPageLoader from "../Components/FullPageLoader.tsx";
import BackToHome from "../HomeComponents/BackToHome.tsx";
import { handleSuccess } from "../../Helpers/Sweetalert.ts";
import { useAppSelector } from "../../app/Hooks.ts";


type Props = {};

function ChangePassword({}: Props) {
  const user  = useAppSelector(state=>state.userAuth.authUser)
  const passwordRef: React.RefObject<{
    password: string;
    confirmPassword: string;
  }> = React.useRef({
    password: "",
    confirmPassword: "",
  });

  const params = useParams<{ token: string }>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [renderElements, setRenderElements] = React.useState<boolean>(false);

  const handleTheVerficationOfTheToken: (
    token: string,
  ) => Promise<void> = async (token) => {
    try {
      setLoading(true);
      const result: AxiosResponse = await api.post("/api/tokens/verify", {
        token,
      });
      if (result.data?.isValid) {
        setRenderElements(true);
      } else {
        setRenderElements(false);
      }
    } catch (error) {
      handleComponentError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword : (e: React.ChangeEvent<HTMLInputElement>) =>void = (e)=>{
    handleInputChangeIntoARefObject(passwordRef, e , "password");
  }

  
  const handleChangeConfirmPassword : (e: React.ChangeEvent<HTMLInputElement>) =>void = (e)=>{
    handleInputChangeIntoARefObject(passwordRef, e , "confirmPassword");
  }

  const handleTheSubmitChangePassword : ()=>Promise<void> = async ()=>{
    try {
      const {confirmPassword , password} = passwordRef.current
      if (confirmPassword !== password){
        throw new Error ("Passwords do not match please verify");
      }
      const result : AxiosResponse =!user? await api.put(`/api/users/changepassword` ,{password} ,{headers :{
        "special-token" : decodeURIComponent(params.token!)
      }}) :  await api.put(`/api/users/userchangepassword` ,{password , email : user.email})
      handleSuccess("Message" ,result.data.message);
    } catch (error) {
      handleComponentError(error)
    }
  }

  React.useEffect(() => {
    if (!user){
      handleTheVerficationOfTheToken(params.token as string);
    }
  }, []);
return loading ? (
  <FullPageLoader open={loading} />
) : renderElements ||user ? (
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      bgcolor: "background.default",
      px: 2,
    }}
  >
    <BackToHome />

    <Card
      elevation={6}
      sx={{
        width: { xs: "100%", sm: 420 },
        p: 3,
        borderRadius: 3,
        boxShadow: 3,
        mt: 4,
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Typography
          variant="h6"
          color="text.primary"
          textAlign="center"
          fontWeight={600}
        >
          Change your password
        </Typography>

        <FormControl fullWidth>
          <InputLabel>Password</InputLabel>
          <Input onChange={handleChangePassword} type="password" />
          <FormHelperText>Enter your new password</FormHelperText>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Confirm Password</InputLabel>
          <Input
            type="password"
            onChange={handleChangeConfirmPassword}
          />
          <FormHelperText>Re-enter your new password</FormHelperText>
        </FormControl>

        <Button
          onClick={handleTheSubmitChangePassword}
          variant="contained"
          sx={{
            mt: 1,
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "1rem",
          }}
          fullWidth
        >
          Change Password
        </Button>
      </CardContent>
    </Card>
  </Box>
) : (
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      px: 2,
      textAlign: "center",
      gap: 3,
    }}
  >
    <BackToHome />
    <Typography variant="h6" color="error" fontWeight={600}>
      Link has expired
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Please generate another link to change your password.
    </Typography>
  </Box>
);

}

export default ChangePassword;
