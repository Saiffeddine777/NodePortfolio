import {
  Avatar,
  Box,
  Typography,
  Divider,
  Paper,
} from "@mui/material";
import { useAppSelector } from "../../app/Hooks.ts";
import ProfileRow from "../Components/ProfileRow.tsx";


type Props = {};

const AuthenticatedUser = ({}: Props) => {
  const authenticatedUser = useAppSelector(
    (state) => state.userAuth.authUser
  );

  if (!authenticatedUser?.id) {
    return (
      <Typography variant="h6" textAlign="center">
        No authenticated user
      </Typography>
    );
  }

  const {
    firstName,
    lastName,
    email,
    role,
    occupation,
    userName,
    phoneNumber,
    imageUrl,
    createdAt,
  } = authenticatedUser;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 6,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 600,
          p: 4,
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <Avatar
            src={imageUrl}
            sx={{ width: 120, height: 120 }}
          />
        </Box>

        <Typography variant="h5" textAlign="center">
          {firstName} {lastName}
        </Typography>

        <Typography
          variant="body2"
          textAlign="center"
          color="text.secondary"
        >
          @{userName} • {role}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <ProfileRow label="Email" value={email} />
        <ProfileRow label="Occupation" value={occupation} />
        <ProfileRow label="Phone" value={phoneNumber} />
        <ProfileRow
          label="Joined"
          value={new Date(createdAt as Date).toLocaleDateString()}
        />
      </Paper>
    </Box>
  );
};

export default AuthenticatedUser;
