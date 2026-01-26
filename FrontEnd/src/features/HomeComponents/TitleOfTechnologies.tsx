import { Box, Typography } from "@mui/material";

type Props = {};

const TitleOfTechnologies = ({}: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: "5%",
        mb: "5%",
      }}
    >
      <Typography
        variant="h4"
        component="h2"
        fontWeight={500}
        color="text.primary"
      >
        Skill Set
      </Typography>
    </Box>
  );
};

export default TitleOfTechnologies;
