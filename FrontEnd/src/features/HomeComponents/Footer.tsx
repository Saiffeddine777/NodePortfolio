import { Box, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import type { SvgIconTypeMap } from "@mui/material";

type ArrayOfRedirectionIcons = {
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  };
  url: string;
  text: string;
}[];
type Props = {};

const Footer = ({}: Props) => {
  const socialMediaButtons: ArrayOfRedirectionIcons = [
    {
      icon: FacebookIcon,
      url: "https://www.facebook.com/saiffeddine.zouaghi",
      text: "facebook",
    },
    {
      icon: LinkedInIcon,
      url: "https://www.linkedin.com/in/saiffeddine-zouaghi",
      text: "linkedIn",
    },
    {
      icon: InstagramIcon,
      url: "https://www.instagram.com/zouaghisaiffeddine",
      text: "InstaGram",
    },
    {
      icon: GitHubIcon,
      url: "https://github.com/Saiffeddine777",
      text: "Github",
    },
  ];
  return (
    <Box
      sx={{
        backgroundColor: "ButtonShadow",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {socialMediaButtons.map((e, i) => (
        <IconButton
          sx={{
            color: "Highlight",
          }}
          key={i}
          onClick={() => window.open(e.url, "_blank")}
        >
          <e.icon />
        </IconButton>
      ))}
    </Box>
  );
};

export default Footer;
