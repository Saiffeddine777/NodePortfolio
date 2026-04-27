import {
  Box,
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  Button,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import React, { useEffect } from "react";
import type { User } from "../../Types/User.ts";
import type { RefChangerFunction } from "../../Types/Utilities.ts";
import type { AxiosResponse } from "axios";
import { handleComponentError } from "../../Helpers/ErrorHandler.ts";
import { handleSuccess } from "../../Helpers/Sweetalert.ts";
import { verifyEmptiness } from "../../Helpers/FieldVerifier.ts";
import { useNavigate } from "react-router";
import { api } from "../../ApiService/ApiBrain.ts";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import BackToHome from "../HomeComponents/BackToHome.tsx";
import { Visibility, VisibilityOff } from "@mui/icons-material";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "signup-user-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=DM+Serif+Display:ital@0;1&display=swap');

    /* ── Page ── */
    .su-page {
      min-height: 100vh;
      background: #0b0c10;
      background-image:
        radial-gradient(ellipse 70% 50% at 10% -10%, rgba(99,102,241,0.13) 0%, transparent 60%),
        radial-gradient(ellipse 50% 40% at 90% 110%, rgba(129,140,248,0.09) 0%, transparent 55%);
      font-family: 'DM Sans', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
    }

    /* ── Back row ── */
    .su-back-row {
      position: absolute;
      top: 28px;
      left: 28px;
    }

    /* ── Card ── */
    .su-card {
      width: 100%;
      max-width: 620px;
      border-radius: 20px;
      background: rgba(255,255,255,0.032);
      border: 1px solid rgba(255,255,255,0.07);
      overflow: hidden;
      position: relative;
    }
    .su-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(99,102,241,0.07) 0%, transparent 60%);
      pointer-events: none;
    }

    /* ── Card header ── */
    .su-card-header {
      padding: 36px 32px 24px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .su-icon-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 52px;
      height: 52px;
      border-radius: 14px;
      background: rgba(99,102,241,0.1);
      border: 1px solid rgba(99,102,241,0.25);
      font-size: 1.4rem;
      margin-bottom: 20px;
    }
    .su-tag {
      display: inline-block;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.68rem;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #818cf8;
      background: rgba(99,102,241,0.12);
      border: 1px solid rgba(99,102,241,0.25);
      border-radius: 999px;
      padding: 3px 12px;
      margin-bottom: 14px;
    }
    .su-title {
      font-family: 'DM Serif Display', Georgia, serif !important;
      font-size: 1.7rem !important;
      font-weight: 400 !important;
      color: #f1f5f9 !important;
      letter-spacing: -0.01em !important;
      line-height: 1.2 !important;
      margin-bottom: 6px !important;
      text-align: center !important;
    }
    .su-subtitle {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.82rem !important;
      color: rgba(255,255,255,0.3) !important;
      text-align: center !important;
    }

    /* ── Form body ── */
    .su-form-body {
      padding: 28px 32px 32px;
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    /* ── Section label ── */
    .su-section-label {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.68rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.12em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.22) !important;
      margin-bottom: 16px !important;
    }

    /* ── Two-col grid ── */
    .su-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px 24px;
      margin-bottom: 0;
    }
    @media (max-width: 500px) {
      .su-grid { grid-template-columns: 1fr; }
    }

    /* ── Divider ── */
    .su-divider {
      height: 1px;
      background: rgba(255,255,255,0.07);
      margin: 24px 0;
    }

    /* ── Field label ── */
    .su-label {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.78rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.08em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.45) !important;
    }
    .su-label.Mui-focused {
      color: #818cf8 !important;
    }

    /* ── Input ── */
    .su-input input {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.92rem !important;
      color: rgba(255,255,255,0.82) !important;
      padding-bottom: 8px !important;
    }
    .su-input::before {
      border-bottom-color: rgba(255,255,255,0.1) !important;
    }
    .su-input::after {
      border-bottom-color: #818cf8 !important;
    }
    .su-input:hover::before {
      border-bottom-color: rgba(255,255,255,0.22) !important;
    }

    /* ── Visibility toggle ── */
    .su-visibility-btn {
      color: rgba(255,255,255,0.25) !important;
      transition: color 0.18s ease !important;
    }
    .su-visibility-btn:hover {
      color: #818cf8 !important;
    }
    .su-visibility-btn svg {
      font-size: 1rem !important;
    }

    /* ── Helper text ── */
    .su-helper {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.72rem !important;
      color: rgba(255,255,255,0.22) !important;
      margin-top: 4px !important;
    }

    /* ── Submit ── */
    .su-submit {
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
      width: 100% !important;
      margin-top: 8px !important;
      transition: transform 0.2s ease, box-shadow 0.2s ease !important;
    }
    .su-submit:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 10px 36px rgba(99,102,241,0.52) !important;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Component ──────────────────────────────────────────────────────────── */
type Props = {};

const SignUpUser = ({}: Props) => {
  useEffect(() => { injectStyles(); }, []);

  // ── Logic untouched ──────────────────────────────────────────────────────
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState<boolean>(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const signInRef = React.useRef<User>({
    firstName: "", lastName: "", email: "", password: "",
    confirmPassword: "", phoneNumber: "", occupation: "", userName: "",
  });

  const handleChange: RefChangerFunction<User> = (event, key) => {
    signInRef.current[key] = event.target.value as never;
  };

  const handleSignUp = async () => {
    try {
      if (!executeRecaptcha) throw new Error("Recaptcha is not Ready");
      const token = await executeRecaptcha("contact_form");
      const { email, userName, lastName, phoneNumber, password,
        occupation, firstName, confirmPassword } = signInRef.current;
      if (password !== confirmPassword) throw Error("Passwords don't match");
      const result: AxiosResponse<User> = await api.post(
        `/api/users/register`,
        verifyEmptiness({ email, userName, lastName, phoneNumber, password, occupation, firstName }),
        { headers: { recaptcha: token } }
      );
      handleSuccess("Hello", `Welcome ${result?.data?.firstName}`);
      navigate("/login");
    } catch (error) {
      handleComponentError(error);
    }
  };
  // ────────────────────────────────────────────────────────────────────────

  return (
    <Box className="su-page">

      {/* ── Back button ── */}
      <Box className="su-back-row">
        <BackToHome />
      </Box>

      {/* ── Card ── */}
      <Box className="su-card">

        {/* Header */}
        <Box className="su-card-header">
          <div className="su-icon-badge">✨</div>
          <div className="su-tag">Get started</div>
          <Typography className="su-title">Create an Account</Typography>
          <Typography className="su-subtitle">
            Fill in your information to get started.
          </Typography>
        </Box>

        {/* Form */}
        <Box className="su-form-body">

          <Typography className="su-section-label" sx={{ mt: 0 }}>
            Account Details
          </Typography>

          {/* Account details — two col */}
          <Box className="su-grid" mb={0}>
            <FormControl fullWidth>
              <InputLabel className="su-label">Email</InputLabel>
              <Input className="su-input" onChange={(e) => handleChange(e, "email")} />
              <FormHelperText className="su-helper">example@email.com</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel className="su-label">User Name</InputLabel>
              <Input className="su-input" onChange={(e) => handleChange(e, "userName")} />
              <FormHelperText className="su-helper">Ex: saif123</FormHelperText>
            </FormControl>
          </Box>

          <div className="su-divider" />
          <Typography className="su-section-label">Personal Info</Typography>

          {/* Personal info — two col */}
          <Box className="su-grid" mb={0}>
            <FormControl fullWidth>
              <InputLabel className="su-label">First Name</InputLabel>
              <Input className="su-input" onChange={(e) => handleChange(e, "firstName")} />
            </FormControl>

            <FormControl fullWidth>
              <InputLabel className="su-label">Last Name</InputLabel>
              <Input className="su-input" onChange={(e) => handleChange(e, "lastName")} />
            </FormControl>

            <FormControl fullWidth>
              <InputLabel className="su-label">Phone Number</InputLabel>
              <Input className="su-input" onChange={(e) => handleChange(e, "phoneNumber")} />
              <FormHelperText className="su-helper">+216 XX XXX XXX</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel className="su-label">Occupation</InputLabel>
              <Input className="su-input" onChange={(e) => handleChange(e, "occupation")} />
            </FormControl>
          </Box>

          <div className="su-divider" />
          <Typography className="su-section-label">Security</Typography>

          {/* Password — two col */}
          <Box className="su-grid" mb={0}>
            <FormControl fullWidth>
              <InputLabel className="su-label">Password</InputLabel>
              <Input
                className="su-input"
                type={showPassword ? "text" : "password"}
                onChange={(e) => handleChange(e, "password")}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      className="su-visibility-btn"
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            <FormControl fullWidth>
              <InputLabel className="su-label">Confirm Password</InputLabel>
              <Input
                className="su-input"
                type={showConfirmPassword ? "text" : "password"}
                onChange={(e) => handleChange(e, "confirmPassword")}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      className="su-visibility-btn"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Box>

          {/* Submit */}
          <Button
            className="su-submit"
            onClick={handleSignUp}
            variant="contained"
            disableElevation
          >
            Create Account
          </Button>

        </Box>
      </Box>
    </Box>
  );
};

export default SignUpUser;