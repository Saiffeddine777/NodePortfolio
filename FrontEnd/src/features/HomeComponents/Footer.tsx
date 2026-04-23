import { Box, IconButton, Tooltip } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";

const socialMediaButtons = [
  {
    icon: <FacebookIcon />,
    url: "https://www.facebook.com/saiffeddine.zouaghi",
    label: "Facebook",
  },
  {
    icon: <LinkedInIcon />,
    url: "https://www.linkedin.com/in/saiffeddine-zouaghi",
    label: "LinkedIn",
  },
  {
    icon: <InstagramIcon />,
    url: "https://www.instagram.com/zouaghisaiffeddine",
    label: "Instagram",
  },
  {
    icon: <GitHubIcon />,
    url: "https://github.com/Saiffeddine777",
    label: "GitHub",
  },
];

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "footer-custom-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap');

    .footer-root {
      background: rgba(10, 10, 14, 0.82);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border-top: 1px solid rgba(255,255,255,0.07);
      box-shadow: 0 -4px 32px rgba(0,0,0,0.28);
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 4px;
      padding: 18px 0;
      font-family: 'DM Sans', sans-serif;
    }

    .footer-icon-btn {
      color: rgba(255,255,255,0.35) !important;
      border: 1px solid rgba(255,255,255,0.07) !important;
      border-radius: 10px !important;
      padding: 10px !important;
      transition:
        color 0.22s ease,
        border-color 0.22s ease,
        background 0.22s ease,
        transform 0.22s ease,
        box-shadow 0.22s ease !important;
    }
    .footer-icon-btn:hover {
      color: #818cf8 !important;
      border-color: rgba(99,102,241,0.45) !important;
      background: rgba(99,102,241,0.09) !important;
      transform: translateY(-3px) !important;
      box-shadow: 0 6px 18px rgba(99,102,241,0.22) !important;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Component ──────────────────────────────────────────────────────────── */
import React from "react";

const Footer = () => {
  React.useEffect(() => { injectStyles(); }, []);

  return (
    <Box className="footer-root">
      {socialMediaButtons.map((item, i) => (
        <Tooltip key={i} title={item.label} placement="top" arrow>
          <IconButton
            className="footer-icon-btn"
            onClick={() => window.open(item.url, "_blank")}
          >
            {item.icon}
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  );
};

export default Footer;