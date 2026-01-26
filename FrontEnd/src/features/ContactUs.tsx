import {
  Box,
  FormControl,
  InputLabel,
  Typography,
  Input,
  FormHelperText,
  TextField,
  Button,
  Paper,
  Container,
} from "@mui/material";
import React from "react";
import type { EmailInterface } from "../Types/EmailType.ts";
import { handleInputChangeIntoARefObject } from "../Helpers/FieldVerifier.ts";
import { handleComponentError } from "../Helpers/ErrorHandler.ts";
import { handleSuccess } from "../Helpers/Sweetalert.ts";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { api } from "../ApiService/ApiBrain.ts";
import BackToHome from "./HomeComponents/BackToHome.tsx";

type Props = {};
const apiUrl: string = import.meta.env.VITE_API_URL;

const ContactUs = ({}: Props) => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const emailCreated = React.useRef<EmailInterface>({
    fromEmail: "",
    fromName: "",
    subject: "",
    body: "",
  });

  const handleSubmitTheMessage = async (): Promise<void> => {
    try {
      if (!executeRecaptcha) {
        throw new Error("Recaptcha is not Ready");
      }
      const token = await executeRecaptcha("contact_form");
      await api.post(`${apiUrl}/api/emails`, emailCreated.current, {
        headers: {
          recaptcha: token,
        },
      });
      handleSuccess(
        "Message sent",
        "Your message has been sent. We will contact you soon via email."
      );
    } catch (error) {
      handleComponentError(error);
    }
  };

  return (
    <Box>
      <BackToHome/>
        <Container maxWidth="sm">
      <Paper
        elevation={4}
        sx={{
          mt: 8,
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Contact Us
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Send us a message and we’ll get back to you as soon as possible.
        </Typography>

        <Box display="flex" flexDirection="column" gap={3}>
          <FormControl fullWidth>
            <InputLabel>Email address</InputLabel>
            <Input
              onChange={(e) =>
                handleInputChangeIntoARefObject(emailCreated, e, "fromEmail")
              }
            />
            <FormHelperText>We'll never share your email.</FormHelperText>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Name</InputLabel>
            <Input
              onChange={(e) =>
                handleInputChangeIntoARefObject(emailCreated, e, "fromName")
              }
            />
            <FormHelperText>Example: John</FormHelperText>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Subject</InputLabel>
            <Input
              onChange={(e) =>
                handleInputChangeIntoARefObject(emailCreated, e, "subject")
              }
            />
            <FormHelperText>Example: Question</FormHelperText>
          </FormControl>

          <TextField
            label="Message"
            multiline
            rows={4}
            fullWidth
            onChange={(e) =>
              handleInputChangeIntoARefObject(emailCreated, e, "body")
            }
          />

          <Button
            variant="contained"
            size="large"
            sx={{
              mt: 2,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
            }}
            onClick={handleSubmitTheMessage}
          >
            Send Message
          </Button>
        </Box>
      </Paper>
    </Container>
    </Box>

  );
};

export default ContactUs;
