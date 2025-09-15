import React from "react";
import axios, { type AxiosResponse } from "axios";
import { useLocation, useNavigate, type Location } from "react-router";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import { handleComponentError } from "../../../Helpers/ErrorHandler";
import type { EmailInterface } from "../../../Types/EmailType";

type Props = {};

const apiUrl: string = import.meta.env.VITE_API_URL;

function OneEmail({}: Props) {
  const navigate = useNavigate();
  const location: Location<{ id: number }> = useLocation();
  const [email, setEmail] = React.useState<EmailInterface | null>(null);

  const handleFetchEmail: () => Promise<void> = async () => {
    try {
      const response: AxiosResponse<EmailInterface> = await axios.get(
        `${apiUrl}/api/emails/${location.state.id}`
      );
      setEmail(response.data);

      if (!response.data.isRead) {
        await axios.put(`${apiUrl}/api/emails/${location.state.id}`);
      }
    } catch (error) {
      handleComponentError(error);
    }
  };

  React.useEffect(() => {
    handleFetchEmail();
  }, []);

  const navigateBackToEmails: () => void = () => {
    navigate("/dashboard/emaillist");
  };

  if (!email) {
    return <Typography>Loading email...</Typography>;
  }

  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Card sx={{ maxWidth: 600, width: "100%", p: 2, boxShadow: 3 }}>
        <Button onClick={() => navigateBackToEmails()}>Back to List</Button>
        <CardContent>
          {/* Subject */}
          <Typography variant="h6" gutterBottom>
            {email.subject}
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {/* From */}
          <Typography variant="body2" color="text.secondary">
            From: <strong>{email.fromName}</strong> ({email.fromEmail})
          </Typography>

          {/* Created At */}
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Received: {new Date(email.createdAt as Date).toLocaleString()}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Body */}
          <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
            {email.body}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default OneEmail;
