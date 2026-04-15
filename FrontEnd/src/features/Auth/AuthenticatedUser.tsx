import {
  Avatar,
  Box,
  Typography,
  Divider,
  Paper,
  Button,
} from "@mui/material";
import { useAppSelector } from "../../app/Hooks.ts";
import ProfileRow from "../Components/ProfileRow.tsx";
import { useNavigate } from "react-router";
import BackToHome from "../HomeComponents/BackToHome.tsx";


type Props = {};

const AuthenticatedUser = ({}: Props) => {

  const navigate = useNavigate();

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

  const handleNavigateToChangePassword  : ()=>void = ()=>{
    navigate("/changepassword")
  }

  return (
    <Box>
      <BackToHome/>
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      mt: 8,
      px: 2,
    }}
  >
    <Paper
      elevation={6}
      sx={{
        width: "100%",
        maxWidth: 640,
        p: 5,
        borderRadius: 4,
        position: "relative",
      }}
    >
      {/* Change Password Button (Top Right Clean Placement) */}
      <Box
        sx={{
          position: "absolute",
          top: 24,
          right: 24,
        }}
      >
        <Button
          variant="outlined"
          size="small"
          onClick={handleNavigateToChangePassword}
          sx={{
            textTransform: "none",
            fontWeight: 500,
            borderRadius: 2,
          }}
        >
          Change Password
        </Button>
      </Box>

      {/* Avatar Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <Avatar
          src={imageUrl}
          sx={{
            width: 130,
            height: 130,
            boxShadow: 3,
          }}
        />
      </Box>

      {/* Name */}
      <Typography
        variant="h5"
        textAlign="center"
        fontWeight={600}
        gutterBottom
      >
        {firstName} {lastName}
      </Typography>

      {/* Username + Role */}
      <Typography
        variant="body2"
        textAlign="center"
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        @{userName} • {role}
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {/* Info Rows */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <ProfileRow label="Email" value={email} />
        <ProfileRow label="Occupation" value={occupation} />
        <ProfileRow label="Phone" value={phoneNumber} />
        <ProfileRow
          label="Joined"
          value={new Date(createdAt as Date).toLocaleDateString()}
        />
      </Box>
    </Paper>
  </Box>
  </Box>
);

};

export default AuthenticatedUser;
