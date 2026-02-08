import React from "react";
import {
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Box,
  Button,
  Paper,
} from "@mui/material";
import { useLocation, type Location } from "react-router";
import { handleInputChangeIntoARefObject } from "../../Helpers/FieldVerifier.ts";
import type { AxiosResponse } from "axios";
import { api } from "../../ApiService/ApiBrain.ts";
import { apiUrl } from "../../Urls.ts";
import { handleSuccess } from "../../Helpers/Sweetalert.ts";
import { handleComponentError } from "../../Helpers/ErrorHandler.ts";

type Props = {};
type FromType = "change" | "forget";

const InputEmail = ({}: Props) => {
  const location: Location<{ from: FromType }> = useLocation();

  const refEmail = React.useRef<{ from: FromType; email: string }>({
    from: location.state.from,
    email: "",
  });

  const handleSubmiTheEmailToSendTo: () => Promise<void> = async () => {
    try {
      const result: AxiosResponse = await api.post(
        `${apiUrl}/api/emails/send`,
        refEmail.current
      );

      result.data
        ? handleSuccess(
            "Address Submitted",
            `An email will be issued to ${refEmail.current.email}`
          )
        : undefined;
    } catch (error) {
      handleComponentError(error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        bgcolor: "background.default",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 420,
          p: 4,
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <FormControl fullWidth variant="standard">
          <InputLabel>Email address</InputLabel>
          <Input
            onChange={(e) =>
              handleInputChangeIntoARefObject(refEmail, e, "email")
            }
          />
          <FormHelperText>example@email.com</FormHelperText>
        </FormControl>

        <Button
          onClick={handleSubmiTheEmailToSendTo}
          variant="contained"
          size="large"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            py: 1.2,
          }}
        >
          Submit email address
        </Button>
      </Paper>
    </Box>
  );
};

export default InputEmail;
