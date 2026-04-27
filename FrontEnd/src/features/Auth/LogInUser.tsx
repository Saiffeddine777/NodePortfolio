import {
  Box,
  Input,
  FormControl,
  InputLabel,
  FormHelperText,
  Button,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import React, { useEffect } from "react";
import type { RefChangerFunction } from "../../Types/Utilities.ts";
import { useAppDispatch } from "../../app/Hooks.ts";
import { authApiThunk } from "./UserAuthReducer.ts";
import { type SignInData } from "../../Types/User.ts";
import { handleSuccess } from "../../Helpers/Sweetalert.ts";
import { useNavigate, type NavigateFunction } from "react-router";
import { handleComponentError } from "../../Helpers/ErrorHandler.ts";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import BackToHome from "../HomeComponents/BackToHome.tsx";
import { Visibility, VisibilityOff } from "@mui/icons-material";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "login-user-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=DM+Serif+Display:ital@0;1&display=swap');

    /* ── Page ── */
    .li-page {
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
    .li-back-row {
      position: absolute;
      top: 28px;
      left: 28px;
    }

    /* ── Card ── */
    .li-card {
      width: 100%;
      max-width: 420px;
      border-radius: 20px;
      background: rgba(255,255,255,0.032);
      border: 1px solid rgba(255,255,255,0.07);
      overflow: hidden;
      position: relative;
    }
    .li-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(99,102,241,0.07) 0%, transparent 60%);
      pointer-events: none;
    }

    /* ── Card header ── */
    .li-card-header {
      padding: 36px 32px 24px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    /* ── Icon badge ── */
    .li-icon-badge {
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

    .li-tag {
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
    .li-title {
      font-family: 'DM Serif Display', Georgia, serif !important;
      font-size: 1.7rem !important;
      font-weight: 400 !important;
      color: #f1f5f9 !important;
      letter-spacing: -0.01em !important;
      line-height: 1.2 !important;
      margin-bottom: 6px !important;
      text-align: center !important;
    }
    .li-subtitle {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.82rem !important;
      color: rgba(255,255,255,0.3) !important;
      text-align: center !important;
    }

    /* ── Form body ── */
    .li-form-body {
      padding: 28px 32px 32px;
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    /* ── Field label ── */
    .li-label {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.78rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.08em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.45) !important;
    }
    .li-label.Mui-focused {
      color: #818cf8 !important;
    }

    /* ── Input ── */
    .li-input input {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.92rem !important;
      color: rgba(255,255,255,0.82) !important;
      padding-bottom: 8px !important;
    }
    .li-input::before {
      border-bottom-color: rgba(255,255,255,0.1) !important;
    }
    .li-input::after {
      border-bottom-color: #818cf8 !important;
    }
    .li-input:hover::before {
      border-bottom-color: rgba(255,255,255,0.22) !important;
    }

    /* ── Visibility toggle ── */
    .li-visibility-btn {
      color: rgba(255,255,255,0.25) !important;
      transition: color 0.18s ease !important;
    }
    .li-visibility-btn:hover {
      color: #818cf8 !important;
    }
    .li-visibility-btn svg {
      font-size: 1rem !important;
    }

    /* ── Helper text ── */
    .li-helper {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.72rem !important;
      color: rgba(255,255,255,0.22) !important;
      margin-top: 4px !important;
    }

    /* ── Submit ── */
    .li-submit {
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
      transition: transform 0.2s ease, box-shadow 0.2s ease !important;
    }
    .li-submit:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 10px 36px rgba(99,102,241,0.52) !important;
    }

    /* ── Forgot password ── */
    .li-forgot {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.78rem !important;
      font-weight: 600 !important;
      color: #818cf8 !important;
      cursor: pointer;
      align-self: flex-end;
      letter-spacing: 0.02em !important;
      transition: color 0.18s ease, opacity 0.18s ease !important;
    }
    .li-forgot:hover {
      color: #a5b4fc !important;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Component ──────────────────────────────────────────────────────────── */
type Props = {};

const LogInUser = ({}: Props) => {
  useEffect(() => { injectStyles(); }, []);

  // ── Logic untouched ──────────────────────────────────────────────────────
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const dispatch = useAppDispatch();
  const signInCredentials = React.useRef<SignInData>({ email: "", password: "" });
  const navigate: NavigateFunction = useNavigate();

  const handleChange: RefChangerFunction<SignInData> = (event, key) => {
    signInCredentials.current[key] = event.target.value as never;
  };

  const handleSignIn = async () => {
    if (!executeRecaptcha) throw new Error("Recaptcha is not Ready");
    try {
      const token = await executeRecaptcha("login");
      await dispatch(authApiThunk({ token, ...signInCredentials.current })).unwrap();
      handleSuccess("Welcome", "Successfully Signed In!");
      navigate("/");
    } catch (error) {
      handleComponentError(error);
    }
  };

  const handleNavigateInOrderToChangeForgetPassword: () => void = () => {
    navigate("/sendemail", { state: { from: "forget" } });
  };
  // ────────────────────────────────────────────────────────────────────────

  return (
    <Box className="li-page">

      {/* ── Back button ── */}
      <Box className="li-back-row">
        <BackToHome />
      </Box>

      {/* ── Card ── */}
      <Box className="li-card">

        {/* Header */}
        <Box className="li-card-header">
          <div className="li-icon-badge">🔐</div>
          <div className="li-tag">Welcome back</div>
          <Typography className="li-title">Sign In</Typography>
          <Typography className="li-subtitle">
            Access your dashboard
          </Typography>
        </Box>

        {/* Form */}
        <Box className="li-form-body">

          {/* Email */}
          <FormControl fullWidth>
            <InputLabel className="li-label">Email</InputLabel>
            <Input
              className="li-input"
              onChange={(e) => handleChange(e, "email")}
              onKeyDown={(e) => { if (e.key === "Enter") handleSignIn(); }}
            />
            <FormHelperText className="li-helper">
              example@email.com
            </FormHelperText>
          </FormControl>

          {/* Password */}
          <FormControl fullWidth>
            <InputLabel className="li-label">Password</InputLabel>
            <Input
              className="li-input"
              type={showPassword ? "text" : "password"}
              onChange={(e) => handleChange(e, "password")}
              onKeyDown={(e) => { if (e.key === "Enter") handleSignIn(); }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    className="li-visibility-btn"
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText className="li-helper">
              Enter your secure password.
            </FormHelperText>
          </FormControl>

          {/* Submit */}
          <Button
            className="li-submit"
            onClick={handleSignIn}
            variant="contained"
            disableElevation
          >
            Sign In
          </Button>

          {/* Forgot password */}
          <Typography
            className="li-forgot"
            onClick={handleNavigateInOrderToChangeForgetPassword}
          >
            Forgot password?
          </Typography>

        </Box>
      </Box>
    </Box>
  );
};

export default LogInUser;