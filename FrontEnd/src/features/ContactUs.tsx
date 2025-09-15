import {
  Box,
  FormControl,
  InputLabel,
  Typography,
  Input,
  FormHelperText,
  TextField,
  Button,
} from "@mui/material";
import React from "react";
import type { EmailInterface } from "../Types/EmailType";
import { handleInputChangeIntoARefObject } from "../Helpers/FieldVerifier";
import { handleComponentError } from "../Helpers/ErrorHandler";
import axios from "axios";
import { handleSuccess } from "../Helpers/Sweetalert";

type Props = {};
const apiUrl: string = import.meta.env.VITE_API_URL;
const ContactUs = ({}: Props) => {
  const emailCreated = React.useRef<EmailInterface>({
    fromEmail: "",
    fromName: "",
    subject: "",
    body: "",
  });

  const handleSubmitTheMessage: () => Promise<void> = async () => {
    try {
      await axios.post(`${apiUrl}/api/emails`, emailCreated.current);
      handleSuccess(
        "Message sent",
        "You message has been sent we will contact you soon via email"
      );
    } catch (error) {
      handleComponentError(error);
    }
  };
  return (
    <Box
      sx={{
        justifyItems: "center",
        gap: "20px",
        display: "flex",
        flexDirection: "column",
        width: "50%",
        marginLeft: "10%",
        paddingTop: "5%",
      }}
    >
      <Typography>Send us a message</Typography>
      <FormControl>
        <InputLabel htmlFor="my-input">Email address</InputLabel>
        <Input
          onChange={(e) =>
            handleInputChangeIntoARefObject(emailCreated, e, "fromEmail")
          }
        />
        <FormHelperText id="my-helper-text">
          We'll never share your email.
        </FormHelperText>
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="my-input">Name</InputLabel>
        <Input
          onChange={(e) =>
            handleInputChangeIntoARefObject(emailCreated, e, "fromName")
          }
        />
        <FormHelperText id="my-helper-text">Exmaple: John</FormHelperText>
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="my-input">Subject</InputLabel>
        <Input
          onChange={(e) =>
            handleInputChangeIntoARefObject(emailCreated, e, "subject")
          }
        />
        <FormHelperText id="my-helper-text">Example : Question</FormHelperText>
      </FormControl>
      <Typography>Give us details</Typography>
      <FormControl>
        <TextField
          onChange={(e) =>
            handleInputChangeIntoARefObject(emailCreated, e, "body")
          }
          rows={4}
        />
      </FormControl>
      <Button onClick={handleSubmitTheMessage}>Submit Messaage</Button>
    </Box>
  );
};

export default ContactUs;
