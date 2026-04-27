import type { AxiosResponse } from "axios";
import React, { useEffect } from "react";
import { useParams } from "react-router";
import { api } from "../../ApiService/ApiBrain.ts";
import { handleComponentError } from "../../Helpers/ErrorHandler.ts";
import { handleInputChangeIntoARefObject } from "../../Helpers/FieldVerifier.ts";
import {
  Typography,
  Box,
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import FullPageLoader from "../Components/FullPageLoader.tsx";
import BackToHome from "../HomeComponents/BackToHome.tsx";
import { handleSuccess } from "../../Helpers/Sweetalert.ts";
import { useAppSelector } from "../../app/Hooks.ts";
import { Visibility, VisibilityOff } from "@mui/icons-material";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "change-password-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=DM+Serif+Display:ital@0;1&display=swap');

    /* ── Page ── */
    .chp-page {
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

    /* ── Card ── */
    .chp-card {
      width: 100%;
      max-width: 420px;
      border-radius: 20px;
      background: rgba(255,255,255,0.032);
      border: 1px solid rgba(255,255,255,0.07);
      overflow: hidden;
      position: relative;
      margin-top: 24px;
    }
    .chp-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(99,102,241,0.07) 0%, transparent 60%);
      pointer-events: none;
    }

    /* ── Card header ── */
    .chp-card-header {
      padding: 28px 32px 22px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      position: relative;
      z-index: 1;
    }
    .chp-tag {
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
    .chp-title {
      font-family: 'DM Serif Display', Georgia, serif !important;
      font-size: 1.55rem !important;
      font-weight: 400 !important;
      color: #f1f5f9 !important;
      letter-spacing: -0.01em !important;
      line-height: 1.2 !important;
      margin-bottom: 6px !important;
    }
    .chp-subtitle {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.82rem !important;
      color: rgba(255,255,255,0.3) !important;
    }

    /* ── Form body ── */
    .chp-form-body {
      padding: 26px 32px 32px;
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    /* ── Field label ── */
    .chp-label {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.78rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.08em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.45) !important;
    }
    .chp-label.Mui-focused {
      color: #818cf8 !important;
    }

    /* ── Input ── */
    .chp-input input {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.92rem !important;
      color: rgba(255,255,255,0.82) !important;
      padding-bottom: 8px !important;
    }
    .chp-input::before {
      border-bottom-color: rgba(255,255,255,0.1) !important;
    }
    .chp-input::after {
      border-bottom-color: #818cf8 !important;
    }
    .chp-input:hover::before {
      border-bottom-color: rgba(255,255,255,0.22) !important;
    }

    /* ── Visibility toggle ── */
    .chp-visibility-btn {
      color: rgba(255,255,255,0.25) !important;
      transition: color 0.18s ease !important;
    }
    .chp-visibility-btn:hover {
      color: #818cf8 !important;
    }
    .chp-visibility-btn svg {
      font-size: 1rem !important;
    }

    /* ── Helper text ── */
    .chp-helper {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.72rem !important;
      color: rgba(255,255,255,0.22) !important;
      margin-top: 4px !important;
    }

    /* ── Submit ── */
    .chp-submit {
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
    .chp-submit:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 10px 36px rgba(99,102,241,0.52) !important;
    }

    /* ── Expired state ── */
    .chp-expired-page {
      min-height: 100vh;
      background: #0b0c10;
      background-image:
        radial-gradient(ellipse 70% 50% at 10% -10%, rgba(99,102,241,0.13) 0%, transparent 60%),
        radial-gradient(ellipse 50% 40% at 90% 110%, rgba(129,140,248,0.09) 0%, transparent 55%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      text-align: center;
      gap: 0;
      font-family: 'DM Sans', sans-serif;
    }
    .chp-expired-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      border-radius: 16px;
      background: rgba(248,113,113,0.1);
      border: 1px solid rgba(248,113,113,0.25);
      font-size: 1.5rem;
      margin-bottom: 20px;
    }
    .chp-expired-title {
      font-family: 'DM Serif Display', Georgia, serif !important;
      font-size: 1.6rem !important;
      font-weight: 400 !important;
      color: #f87171 !important;
      margin-bottom: 10px !important;
    }
    .chp-expired-sub {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.88rem !important;
      color: rgba(255,255,255,0.32) !important;
      margin-bottom: 28px !important;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Component ──────────────────────────────────────────────────────────── */
type Props = {};

function ChangePassword({}: Props) {
  useEffect(() => { injectStyles(); }, []);

  // ── Logic untouched ──────────────────────────────────────────────────────
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState<boolean>(false);
  const user = useAppSelector((state) => state.userAuth.authUser);

  const passwordRef: React.RefObject<{ password: string; confirmPassword: string }> =
    React.useRef({ password: "", confirmPassword: "" });

  const params = useParams<{ token: string }>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [renderElements, setRenderElements] = React.useState<boolean>(false);

  const handleTheVerficationOfTheToken = async (token: string) => {
    try {
      setLoading(true);
      const result: AxiosResponse = await api.post("/api/tokens/verify", { token });
      setRenderElements(!!result.data?.isValid);
    } catch (error) {
      handleComponentError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChangeIntoARefObject(passwordRef, e, "password");
  };

  const handleChangeConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChangeIntoARefObject(passwordRef, e, "confirmPassword");
  };

  const handleTheSubmitChangePassword = async () => {
    try {
      const { confirmPassword, password } = passwordRef.current;
      if (confirmPassword !== password) throw new Error("Passwords do not match please verify");
      const result: AxiosResponse = !user
        ? await api.put(`/api/users/changepassword`, { password }, {
            headers: { "special-token": decodeURIComponent(params.token!) },
          })
        : await api.put(`/api/users/userchangepassword`, { password, email: user.email });
      handleSuccess("Message", result.data.message);
    } catch (error) {
      handleComponentError(error);
    }
  };

  React.useEffect(() => {
    if (!user) handleTheVerficationOfTheToken(params.token as string);
  }, []);
  // ────────────────────────────────────────────────────────────────────────

  if (loading) return <FullPageLoader open={loading} />;

  if (!renderElements && !user) {
    return (
      <Box className="chp-expired-page">
        <BackToHome />
        <div className="chp-expired-badge">🔗</div>
        <Typography className="chp-expired-title">Link has expired</Typography>
        <Typography className="chp-expired-sub">
          Please generate another link to change your password.
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="chp-page">

      <BackToHome />

      {/* ── Card ── */}
      <Box className="chp-card">

        {/* Header */}
        <Box className="chp-card-header">
          <div className="chp-tag">Security</div>
          <Typography className="chp-title">Change Password</Typography>
          <Typography className="chp-subtitle">
            Choose a strong new password for your account.
          </Typography>
        </Box>

        {/* Form */}
        <Box className="chp-form-body">

          {/* Password */}
          <FormControl fullWidth>
            <InputLabel className="chp-label">Password</InputLabel>
            <Input
              className="chp-input"
              onChange={handleChangePassword}
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    className="chp-visibility-btn"
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText className="chp-helper">
              Enter your new password.
            </FormHelperText>
          </FormControl>

          {/* Confirm password */}
          <FormControl fullWidth>
            <InputLabel className="chp-label">Confirm Password</InputLabel>
            <Input
              className="chp-input"
              type={showConfirmPassword ? "text" : "password"}
              onChange={handleChangeConfirmPassword}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    className="chp-visibility-btn"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText className="chp-helper">
              Re-enter your new password.
            </FormHelperText>
          </FormControl>

          <Button
            className="chp-submit"
            onClick={handleTheSubmitChangePassword}
            variant="contained"
            disableElevation
          >
            Change Password
          </Button>

        </Box>
      </Box>
    </Box>
  );
}

export default ChangePassword;