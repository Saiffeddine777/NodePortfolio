import {
  Box,
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  Typography,
  Button,
} from "@mui/material";
import React, { useEffect } from "react";
import type { User } from "../../../Types/User.ts";
import type { RefChangerFunction } from "../../../Types/Utilities.ts";
import type { AxiosResponse } from "axios";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import { handleSuccess } from "../../../Helpers/Sweetalert.ts";
import { verifyEmptiness } from "../../../Helpers/FieldVerifier.ts";
import { useNavigate } from "react-router";
import { api } from "../../../ApiService/ApiBrain.ts";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "create-user-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=DM+Serif+Display:ital@0;1&display=swap');

    /* ── Wrapper ── */
    .cu2-wrap {
      padding: 32px 28px;
      font-family: 'DM Sans', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    /* ── Inner col ── */
    .cu2-col {
      width: 100%;
      max-width: 580px;
      display: flex;
      flex-direction: column;
    }

    /* ── Back button ── */
    .cu2-back-btn {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      color: #818cf8;
      background: rgba(99,102,241,0.08);
      border: 1px solid rgba(99,102,241,0.28);
      border-radius: 999px;
      padding: 6px 16px;
      cursor: pointer;
      margin-bottom: 28px;
      align-self: flex-start;
      transition: color 0.2s ease, border-color 0.2s ease,
                  background 0.2s ease, transform 0.2s ease;
    }
    .cu2-back-btn:hover {
      color: #a5b4fc;
      border-color: rgba(99,102,241,0.5);
      background: rgba(99,102,241,0.14);
      transform: translateX(-3px);
    }

    /* ── Card ── */
    .cu2-card {
      border-radius: 20px;
      background: rgba(255,255,255,0.032);
      border: 1px solid rgba(255,255,255,0.07);
      overflow: hidden;
      position: relative;
    }
    .cu2-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(99,102,241,0.06) 0%, transparent 60%);
      pointer-events: none;
    }

    /* ── Card header ── */
    .cu2-card-header {
      padding: 28px 32px 24px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      position: relative;
      z-index: 1;
    }
    .cu2-tag {
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
    .cu2-title {
      font-family: 'DM Serif Display', Georgia, serif !important;
      font-size: 1.7rem !important;
      font-weight: 400 !important;
      color: #f1f5f9 !important;
      letter-spacing: -0.01em !important;
      line-height: 1.2 !important;
      margin-bottom: 6px !important;
    }
    .cu2-subtitle {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.85rem !important;
      color: rgba(255,255,255,0.35) !important;
      line-height: 1.6 !important;
    }

    /* ── Password banner ── */
    .cu2-password-banner {
      margin: 0 32px 0;
      padding: 16px 20px;
      border-radius: 12px;
      background: rgba(251,191,36,0.08);
      border: 1px solid rgba(251,191,36,0.25);
      position: relative;
      z-index: 1;
    }
    .cu2-password-label {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.7rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.12em !important;
      text-transform: uppercase !important;
      color: #fbbf24 !important;
      margin-bottom: 8px !important;
    }
    .cu2-password-value {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.95rem !important;
      font-weight: 700 !important;
      color: rgba(255,255,255,0.85) !important;
      letter-spacing: 0.04em !important;
      margin-bottom: 4px !important;
    }
    .cu2-password-hint {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.75rem !important;
      color: rgba(251,191,36,0.6) !important;
    }

    /* ── Form body ── */
    .cu2-form-body {
      padding: 28px 32px 32px;
      position: relative;
      z-index: 1;
    }

    /* ── Section label ── */
    .cu2-section-label {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.68rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.12em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.22) !important;
      margin-bottom: 16px !important;
    }

    /* ── Field label ── */
    .cu2-label {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.78rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.08em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.45) !important;
    }
    .cu2-label.Mui-focused {
      color: #818cf8 !important;
    }

    /* ── Input ── */
    .cu2-input input {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.92rem !important;
      color: rgba(255,255,255,0.82) !important;
      padding-bottom: 8px !important;
    }
    .cu2-input::before {
      border-bottom-color: rgba(255,255,255,0.1) !important;
    }
    .cu2-input::after {
      border-bottom-color: #818cf8 !important;
    }
    .cu2-input:hover::before {
      border-bottom-color: rgba(255,255,255,0.22) !important;
    }

    /* ── File input ── */
    .cu2-file-input input[type="file"] {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.82rem !important;
      color: rgba(255,255,255,0.45) !important;
    }

    /* ── Helper text ── */
    .cu2-helper {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.72rem !important;
      color: rgba(255,255,255,0.22) !important;
      margin-top: 4px !important;
    }

    /* ── Divider ── */
    .cu2-divider {
      height: 1px;
      background: rgba(255,255,255,0.07);
      margin: 20px 0;
    }

    /* ── Submit button ── */
    .cu2-submit {
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
      margin-top: 8px !important;
      align-self: flex-start !important;
      transition: transform 0.2s ease, box-shadow 0.2s ease !important;
    }
    .cu2-submit:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 10px 36px rgba(99,102,241,0.52) !important;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Component ──────────────────────────────────────────────────────────── */
type Props = {};

const CreateUser = ({}: Props) => {
  useEffect(() => { injectStyles(); }, []);

  // ── Logic untouched ──────────────────────────────────────────────────────
  const [password, setPassword] = React.useState<string>("");
  const navigate = useNavigate();

  const signInRef = React.useRef<User>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    occupation: "",
    userName: "",
    file: null,
  });

  const navigateToUsers = () => {
    navigate("/dashboard/userlist");
  };

  const handleChange: RefChangerFunction<User> = (event, key) => {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    if (target instanceof HTMLInputElement && target.type === "file") {
      const files = target.files;
      if (files && files[0] && key === "file") {
        signInRef.current[key] = files[0];
      }
    } else {
      signInRef.current[key] = event.target.value as never;
    }
  };

  const handleSignUp: () => Promise<void | string> = async () => {
    try {
      const { email, userName, lastName, phoneNumber, occupation, firstName, file } =
        signInRef.current;
      const nonEmptUserObject = verifyEmptiness({
        email, userName, lastName, phoneNumber, occupation, firstName, file,
      }) as User;
      let formData: FormData = new FormData();
      Object.entries(nonEmptUserObject).forEach(([key, value]) => {
        formData.append(key, value);
      });
      const result: AxiosResponse<User> = await api.post(`/api/users/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (result.data.id) {
        handleSuccess("User Insertion", "User inserted successfully");
        setPassword(result.data.password as string);
      }
    } catch (error) {
      handleComponentError(error);
    }
  };
  // ────────────────────────────────────────────────────────────────────────

  return (
    <Box className="cu2-wrap">
      <Box className="cu2-col">

        {/* ── Back button ── */}
        <button className="cu2-back-btn" onClick={navigateToUsers}>
          <ArrowBackRoundedIcon sx={{ fontSize: "0.9rem" }} />
          Back to Users
        </button>

        {/* ── Card ── */}
        <Box className="cu2-card">

          {/* Header */}
          <Box className="cu2-card-header">
            <div className="cu2-tag">New User</div>
            <Typography className="cu2-title">Create User</Typography>
            <Typography className="cu2-subtitle">
              Fill in the information below to register a new user.
            </Typography>
          </Box>

          {/* Password banner */}
          {password !== "" && (
            <Box className="cu2-password-banner" mt={3}>
              <Typography className="cu2-password-label">
                ⚠ Temporary Password
              </Typography>
              <Typography className="cu2-password-value">{password}</Typography>
              <Typography className="cu2-password-hint">
                Copy it now — it will be gone when you leave this page.
              </Typography>
            </Box>
          )}

          {/* Form */}
          <Box
            className="cu2-form-body"
            display="flex"
            flexDirection="column"
            gap={2.5}
          >
            <Typography className="cu2-section-label">
              Account Details
            </Typography>

            <FormControl fullWidth>
              <InputLabel className="cu2-label">Email address</InputLabel>
              <Input className="cu2-input" onChange={(e) => handleChange(e, "email")} />
              <FormHelperText className="cu2-helper">
                We'll never share your email.
              </FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel className="cu2-label">User Name</InputLabel>
              <Input className="cu2-input" onChange={(e) => handleChange(e, "userName")} />
              <FormHelperText className="cu2-helper">Ex: Saif123</FormHelperText>
            </FormControl>

            <div className="cu2-divider" />

            <Typography className="cu2-section-label">
              Personal Info
            </Typography>

            <FormControl fullWidth>
              <InputLabel className="cu2-label">First Name</InputLabel>
              <Input className="cu2-input" onChange={(e) => handleChange(e, "firstName")} />
              <FormHelperText className="cu2-helper">Ex: Saiffeddine</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel className="cu2-label">Last Name</InputLabel>
              <Input className="cu2-input" onChange={(e) => handleChange(e, "lastName")} />
              <FormHelperText className="cu2-helper">Ex: Zouaghi</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel className="cu2-label">Phone Number</InputLabel>
              <Input className="cu2-input" onChange={(e) => handleChange(e, "phoneNumber")} />
              <FormHelperText className="cu2-helper">+216 23******</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel className="cu2-label">Occupation</InputLabel>
              <Input className="cu2-input" onChange={(e) => handleChange(e, "occupation")} />
              <FormHelperText className="cu2-helper">Human Resources</FormHelperText>
            </FormControl>

            <div className="cu2-divider" />

            <Typography className="cu2-section-label">
              Profile Image
            </Typography>

            <FormControl fullWidth>
              <InputLabel className="cu2-label" shrink>
                Upload Photo
              </InputLabel>
              <Input
                className="cu2-file-input"
                type="file"
                onChange={(e) => handleChange(e, "file")}
              />
            </FormControl>

            <Button
              className="cu2-submit"
              onClick={handleSignUp}
              type="button"
              variant="contained"
              disableElevation
            >
              Create User
            </Button>

          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateUser;