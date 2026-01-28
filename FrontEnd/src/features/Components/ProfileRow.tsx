import { Box , Typography } from "@mui/material";

type ProfileRowProps = {
  label: string;
  value?: string;
};

const ProfileRow = ({ label, value }: ProfileRowProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        mb: 1.5,
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
      >
        {label}
      </Typography>
      <Typography variant="body2">
        {value || "-"}
      </Typography>
    </Box>
  );
};


export default ProfileRow