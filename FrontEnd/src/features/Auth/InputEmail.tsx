import React, { useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Box,
  Button,
  Typography,
} from "@mui/material";
import { useLocation, type Location } from "react-router";
import { handleInputChangeIntoARefObject } from "../../Helpers/FieldVerifier.ts";
import type { AxiosResponse } from "axios";
import { api } from "../../ApiService/ApiBrain.ts";
import { apiUrl } from "../../Urls.ts";
import { handleSuccess } from "../../Helpers/Sweetalert.ts";
import { handleComponentError } from "../../Helpers/ErrorHandler.ts";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "input-email-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=DM+Serif+Display:ital@0;1&display=swap');

    /* ── Page ── */
    .ie-page {
      min-height: 100vh;
      background: #0b0c10;
      background-image:
        radial-gradient(ellipse 70% 50% at 10% -10%, rgba(99,102,241,0.13) 0%, transparent 60%),
        radial-gradient(ellipse 50% 40% at 90% 110%, rgba(129,140,248,0.09) 0%, transparent 55%);
      font-family: 'DM Sans', sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
    }

    /* ── Card ── */
    .ie-card {
      width: 100%;
      max-width: 420px;
      border-radius: 20px;
      background: rgba(255,255,255,0.032);
      border: 1px solid rgba(255,255,255,0.07);
      overflow: hidden;
      position: relative;
    }
    .ie-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(99,102,241,0.07) 0%, transparent 60%);
      pointer-events: none;
    }

    /* ── Card header ── */
    .ie-card-header {
      padding: 28px 32px 22px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      position: relative;
      z-index: 1;
    }
    .ie-tag {
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
    .ie-title {
      font-family: 'DM Serif Display', Georgia, serif !important;
      font-size: 1.55rem !important;
      font-weight: 400 !important;
      color: #f1f5f9 !important;
      letter-spacing: -0.01em !important;
      line-height: 1.2 !important;
      margin-bottom: 6px !important;
    }
    .ie-subtitle {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.82rem !important;
      color: rgba(255,255,255,0.3) !important;
    }

    /* ── Form body ── */
    .ie-form-body {
      padding: 26px 32px 32px;
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    /* ── Field label ── */
    .ie-label {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.78rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.08em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.45) !important;
    }
    .ie-label.Mui-focused {
      color: #818cf8 !important;
    }

    /* ── Input ── */
    .ie-input input {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.92rem !important;
      color: rgba(255,255,255,0.82) !important;
      padding-bottom: 8px !important;
    }
    .ie-input::before {
      border-bottom-color: rgba(255,255,255,0.1) !important;
    }
    .ie-input::after {
      border-bottom-color: #818cf8 !important;
    }
    .ie-input:hover::before {
      border-bottom-color: rgba(255,255,255,0.22) !important;
    }

    /* ── Helper text ── */
    .ie-helper {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.72rem !important;
      color: rgba(255,255,255,0.22) !important;
      margin-top: 4px !important;
    }

    /* ── Submit ── */
    .ie-submit {
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
    .ie-submit:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 10px 36px rgba(99,102,241,0.52) !important;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Component ──────────────────────────────────────────────────────────── */
type Props = {};
type FromType = "change" | "forget";

const InputEmail = ({}: Props) => {
  useEffect(() => { injectStyles(); }, []);

  // ── Logic untouched ──────────────────────────────────────────────────────
  const location: Location<{ from: FromType }> = useLocation();

  const refEmail = React.useRef<{ from: FromType; email: string }>({
    from: location.state.from,
    email: "",
  });

  const handleSubmiTheEmailToSendTo: () => Promise<void> = async () => {
    try {
      const result: AxiosResponse = await api.post(
        `${apiUrl}/api/emails/send`,
        refEmail.current
      );
      result.data
        ? handleSuccess(
            "Address Submitted",
            `An email will be issued to ${refEmail.current.email}`
          )
        : undefined;
    } catch (error) {
      handleComponentError(error);
    }
  };
  // ────────────────────────────────────────────────────────────────────────

  const isForget = location.state.from === "forget";

  return (
    <Box className="ie-page">
      <Box className="ie-card">

        {/* Header */}
        <Box className="ie-card-header">
          <div className="ie-tag">{isForget ? "Recovery" : "Security"}</div>
          <Typography className="ie-title">
            {isForget ? "Forgot Password?" : "Change Password"}
          </Typography>
          <Typography className="ie-subtitle">
            {isForget
              ? "Enter your email and we'll send you a reset link."
              : "Enter your email to receive a password change link."}
          </Typography>
        </Box>

        {/* Form */}
        <Box className="ie-form-body">
          <FormControl fullWidth variant="standard">
            <InputLabel className="ie-label">Email address</InputLabel>
            <Input
              className="ie-input"
              onChange={(e) =>
                handleInputChangeIntoARefObject(refEmail, e, "email")
              }
            />
            <FormHelperText className="ie-helper">
              example@email.com
            </FormHelperText>
          </FormControl>

          <Button
            className="ie-submit"
            onClick={handleSubmiTheEmailToSendTo}
            variant="contained"
            disableElevation
          >
            Submit Email Address
          </Button>
        </Box>

      </Box>
    </Box>
  );
};

export default InputEmail;