import { Box, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";

const socialMediaButtons = [
  {
    icon: <FacebookIcon />,
    url: "https://www.facebook.com/saiffeddine.zouaghi",
  },
  {
    icon: <LinkedInIcon />,
    url: "https://www.linkedin.com/in/saiffeddine-zouaghi",
  },
  {
    icon: <InstagramIcon />,
    url: "https://www.instagram.com/zouaghisaiffeddine",
  },
  {
    icon: <GitHubIcon />,
    url: "https://github.com/Saiffeddine777",
  },
];

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        py: 2,
        mt: 5,
        display: "flex",
        justifyContent: "center",
        borderTop: "1px solid #ccc",
      }}
    >
      {socialMediaButtons.map((item, i) => (
        <IconButton
          key={i}
          onClick={() => window.open(item.url, "_blank")}
          sx={{
            mx: 1,
            color: "#444",
            "&:hover": { color: "#1976d2" },
          }}
        >
          {item.icon}
        </IconButton>
      ))}
    </Box>
  );
};

export default Footer;
