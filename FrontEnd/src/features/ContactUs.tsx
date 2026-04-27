import {
  Box,
  FormControl,
  InputLabel,
  Typography,
  Input,
  FormHelperText,
  TextField,
  Button,
  Container,
} from "@mui/material";
import React, { useEffect } from "react";
import type { EmailInterface } from "../Types/EmailType.ts";
import { handleInputChangeIntoARefObject } from "../Helpers/FieldVerifier.ts";
import { handleComponentError } from "../Helpers/ErrorHandler.ts";
import { handleSuccess } from "../Helpers/Sweetalert.ts";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { api } from "../ApiService/ApiBrain.ts";
import BackToHome from "./HomeComponents/BackToHome.tsx";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "contact-us-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=DM+Serif+Display:ital@0;1&display=swap');

    /* ── Page ── */
    .cu-page {
      min-height: 100vh;
      background: #0b0c10;
      background-image:
        radial-gradient(ellipse 70% 50% at 10% -10%, rgba(99,102,241,0.13) 0%, transparent 60%),
        radial-gradient(ellipse 50% 40% at 90% 110%, rgba(129,140,248,0.09) 0%, transparent 55%);
      font-family: 'DM Sans', sans-serif;
      padding: 32px 0 80px;
    }

    /* ── Back button row ── */
    .cu-back-row {
      padding: 0 24px;
      margin-bottom: 8px;
    }

    /* ── Card ── */
    .cu-card {
      position: relative;
      border-radius: 20px !important;
      background: rgba(255,255,255,0.035) !important;
      border: 1px solid rgba(255,255,255,0.08) !important;
      padding: 48px 52px !important;
      box-shadow: none !important;
      overflow: hidden;
    }
    .cu-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(99,102,241,0.07) 0%, transparent 60%);
      pointer-events: none;
    }

    /* ── Heading ── */
    .cu-tag {
      display: inline-block;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #818cf8;
      background: rgba(99,102,241,0.12);
      border: 1px solid rgba(99,102,241,0.25);
      border-radius: 999px;
      padding: 4px 14px;
      margin-bottom: 16px;
    }
    .cu-title {
      font-family: 'DM Serif Display', Georgia, serif !important;
      font-size: clamp(1.6rem, 4vw, 2.1rem) !important;
      font-weight: 400 !important;
      color: #f1f5f9 !important;
      letter-spacing: -0.01em !important;
      line-height: 1.2 !important;
      margin-bottom: 10px !important;
    }
    .cu-subtitle {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.9rem !important;
      color: rgba(255,255,255,0.42) !important;
      line-height: 1.7 !important;
      margin-bottom: 36px !important;
    }

    /* ── Field label ── */
    .cu-label {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.78rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.08em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.45) !important;
    }
    .cu-label.Mui-focused {
      color: #818cf8 !important;
    }

    /* ── Input underline ── */
    .cu-input input,
    .cu-input textarea {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.95rem !important;
      color: rgba(255,255,255,0.85) !important;
      padding-bottom: 8px !important;
    }
    .cu-input::before {
      border-bottom-color: rgba(255,255,255,0.1) !important;
    }
    .cu-input::after {
      border-bottom-color: #818cf8 !important;
    }
    .cu-input:hover::before {
      border-bottom-color: rgba(255,255,255,0.22) !important;
    }

    /* ── Multiline TextField override ── */
    .cu-textarea .MuiOutlinedInput-root {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.95rem !important;
      color: rgba(255,255,255,0.85) !important;
      background: rgba(255,255,255,0.025) !important;
      border-radius: 12px !important;
    }
    .cu-textarea .MuiOutlinedInput-root fieldset {
      border-color: rgba(255,255,255,0.1) !important;
      transition: border-color 0.2s ease;
    }
    .cu-textarea .MuiOutlinedInput-root:hover fieldset {
      border-color: rgba(255,255,255,0.22) !important;
    }
    .cu-textarea .MuiOutlinedInput-root.Mui-focused fieldset {
      border-color: #818cf8 !important;
      box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
    }
    .cu-textarea .MuiInputLabel-root {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.78rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.08em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.45) !important;
    }
    .cu-textarea .MuiInputLabel-root.Mui-focused {
      color: #818cf8 !important;
    }

    /* ── Helper text ── */
    .cu-helper {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.74rem !important;
      color: rgba(255,255,255,0.25) !important;
      margin-top: 4px !important;
    }

    /* ── Submit button ── */
    .cu-submit {
      font-family: 'DM Sans', sans-serif !important;
      font-weight: 600 !important;
      font-size: 0.88rem !important;
      letter-spacing: 0.06em !important;
      text-transform: uppercase !important;
      background: linear-gradient(135deg, #6366f1, #818cf8) !important;
      color: #fff !important;
      border-radius: 999px !important;
      padding: 13px 40px !important;
      box-shadow: 0 6px 28px rgba(99,102,241,0.38) !important;
      border: none !important;
      transition: transform 0.2s ease, box-shadow 0.2s ease !important;
      align-self: flex-start !important;
    }
    .cu-submit:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 10px 36px rgba(99,102,241,0.52) !important;
    }

    /* ── Divider ── */
    .cu-divider {
      width: 100%;
      height: 1px;
      background: rgba(255,255,255,0.07);
      margin: 8px 0 32px;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Component ──────────────────────────────────────────────────────────── */
type Props = {};
const apiUrl: string = import.meta.env.VITE_API_URL;

const ContactUs = ({}: Props) => {
  useEffect(() => { injectStyles(); }, []);

  // ── Logic untouched ──────────────────────────────────────────────────────
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
  // ────────────────────────────────────────────────────────────────────────

  return (
    <Box className="cu-page">

      {/* ── Back button ── */}
      <Container maxWidth="sm">
        <Box className="cu-back-row" mb={3}>
          <BackToHome />
        </Box>

        {/* ── Card ── */}
        <Box className="cu-card">

          {/* Heading */}
          <div className="cu-tag">Get in Touch</div>
          <Typography className="cu-title">Contact Me</Typography>
          <Typography className="cu-subtitle">
            Send me a message and I'll get back to you as soon as possible.
          </Typography>

          <div className="cu-divider" />

          {/* Fields */}
          <Box display="flex" flexDirection="column" gap={3.5}>

            <FormControl fullWidth>
              <InputLabel className="cu-label">Email address</InputLabel>
              <Input
                className="cu-input"
                onChange={(e) =>
                  handleInputChangeIntoARefObject(emailCreated, e, "fromEmail")
                }
              />
              <FormHelperText className="cu-helper">
                We'll never share your email.
              </FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel className="cu-label">Name</InputLabel>
              <Input
                className="cu-input"
                onChange={(e) =>
                  handleInputChangeIntoARefObject(emailCreated, e, "fromName")
                }
              />
              <FormHelperText className="cu-helper">
                Example: John
              </FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel className="cu-label">Subject</InputLabel>
              <Input
                className="cu-input"
                onChange={(e) =>
                  handleInputChangeIntoARefObject(emailCreated, e, "subject")
                }
              />
              <FormHelperText className="cu-helper">
                Example: Question
              </FormHelperText>
            </FormControl>

            <TextField
              label="Message"
              multiline
              rows={4}
              fullWidth
              className="cu-textarea"
              onChange={(e) =>
                handleInputChangeIntoARefObject(emailCreated, e, "body")
              }
            />

            <Button
              variant="contained"
              size="large"
              className="cu-submit"
              onClick={handleSubmitTheMessage}
              disableElevation
            >
              Send Message
            </Button>

          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ContactUs;