  import {
    Box,
    FormControl,
    Input,
    InputLabel,
    FormHelperText,
    Button,
    Typography,
  } from "@mui/material";
  import React, { useEffect } from "react";
  import type { User } from "../../../Types/User.tsx";
  import type { RefChangerFunction } from "../../../Types/Utilities.ts";
  import type { AxiosResponse } from "axios";
  import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
  import { handleSuccess } from "../../../Helpers/Sweetalert.ts";
  import { generateData } from "../../../Helpers/FieldVerifier.ts";
  import { useLocation, useNavigate, type Location } from "react-router";
  import { api } from "../../../ApiService/ApiBrain.ts";
  import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

  /* ─── Styles ─────────────────────────────────────────────────────────────── */
  const injectStyles = () => {
    const id = "modify-user-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=DM+Serif+Display:ital@0;1&display=swap');

      /* ── Wrapper ── */
      .mu-wrap {
        padding: 32px 28px;
        font-family: 'DM Sans', sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      /* ── Inner col ── */
      .mu-col {
        width: 100%;
        max-width: 580px;
        display: flex;
        flex-direction: column;
      }
        /* ── Standalone page mode (modifyyourprofile route) ── */
      .mu-wrap-page {
        min-height: 100vh;
        background: #0b0c10;
        background-image:
          radial-gradient(ellipse 70% 50% at 10% -10%, rgba(99,102,241,0.13) 0%, transparent 60%),
          radial-gradient(ellipse 50% 40% at 90% 110%, rgba(129,140,248,0.09) 0%, transparent 55%);
        padding: 32px 0 80px;
      }

      /* ── Back button ── */
      .mu-back-btn {
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
      .mu-back-btn:hover {
        color: #a5b4fc;
        border-color: rgba(99,102,241,0.5);
        background: rgba(99,102,241,0.14);
        transform: translateX(-3px);
      }

      /* ── Card ── */
      .mu-card {
        border-radius: 20px;
        background: rgba(255,255,255,0.032);
        border: 1px solid rgba(255,255,255,0.07);
        overflow: hidden;
        position: relative;
      }
      .mu-card::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(99,102,241,0.06) 0%, transparent 60%);
        pointer-events: none;
      }

      /* ── Card header ── */
      .mu-card-header {
        padding: 28px 32px 24px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
        position: relative;
        z-index: 1;
      }
      .mu-tag {
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
      .mu-title {
        font-family: 'DM Serif Display', Georgia, serif !important;
        font-size: 1.7rem !important;
        font-weight: 400 !important;
        color: #f1f5f9 !important;
        letter-spacing: -0.01em !important;
        line-height: 1.2 !important;
        margin-bottom: 6px !important;
      }
      .mu-subtitle {
        font-family: 'DM Sans', sans-serif !important;
        font-size: 0.85rem !important;
        color: rgba(255,255,255,0.32) !important;
        line-height: 1.6 !important;
      }

      /* ── Form body ── */
      .mu-form-body {
        padding: 28px 32px 32px;
        position: relative;
        z-index: 1;
      }

      /* ── Section label ── */
      .mu-section-label {
        font-family: 'DM Sans', sans-serif !important;
        font-size: 0.68rem !important;
        font-weight: 600 !important;
        letter-spacing: 0.12em !important;
        text-transform: uppercase !important;
        color: rgba(255,255,255,0.22) !important;
        margin-bottom: 16px !important;
      }

      /* ── Field label ── */
      .mu-label {
        font-family: 'DM Sans', sans-serif !important;
        font-size: 0.78rem !important;
        font-weight: 600 !important;
        letter-spacing: 0.08em !important;
        text-transform: uppercase !important;
        color: rgba(255,255,255,0.45) !important;
      }
      .mu-label.Mui-focused {
        color: #818cf8 !important;
      }

      /* ── Input ── */
      .mu-input input {
        font-family: 'DM Sans', sans-serif !important;
        font-size: 0.92rem !important;
        color: rgba(255,255,255,0.82) !important;
        padding-bottom: 8px !important;
      }
      .mu-input::before {
        border-bottom-color: rgba(255,255,255,0.1) !important;
      }
      .mu-input::after {
        border-bottom-color: #818cf8 !important;
      }
      .mu-input:hover::before {
        border-bottom-color: rgba(255,255,255,0.22) !important;
      }

      /* ── Helper text (current value) ── */
      .mu-helper {
        font-family: 'DM Sans', sans-serif !important;
        font-size: 0.72rem !important;
        color: rgba(255,255,255,0.22) !important;
        margin-top: 4px !important;
      }
      .mu-helper span {
        color: rgba(99,102,241,0.7);
        font-weight: 600;
      }

      /* ── Divider ── */
      .mu-divider {
        height: 1px;
        background: rgba(255,255,255,0.07);
        margin: 20px 0;
      }

      /* ── Upload zone ── */
      .mu-upload-zone {
        border: 1px dashed rgba(99,102,241,0.3);
        border-radius: 14px;
        padding: 28px 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        background: rgba(99,102,241,0.03);
        transition: background 0.22s ease, border-color 0.22s ease,
                    transform 0.22s ease;
      }
      .mu-upload-zone:hover {
        background: rgba(99,102,241,0.08);
        border-color: rgba(99,102,241,0.55);
        transform: translateY(-2px);
      }
      .mu-upload-icon {
        font-size: 1.8rem;
        transition: transform 0.22s ease;
      }
      .mu-upload-zone:hover .mu-upload-icon {
        transform: translateY(-3px);
      }
      .mu-upload-name {
        font-family: 'DM Sans', sans-serif !important;
        font-size: 0.85rem !important;
        font-weight: 600 !important;
        color: #818cf8 !important;
        text-align: center !important;
        transition: color 0.22s ease !important;
      }
      .mu-upload-hint {
        font-family: 'DM Sans', sans-serif !important;
        font-size: 0.72rem !important;
        color: rgba(255,255,255,0.25) !important;
        text-align: center !important;
      }

      /* ── Submit button ── */
      .mu-submit {
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
      .mu-submit:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 10px 36px rgba(99,102,241,0.52) !important;
      }
    `;
    document.head.appendChild(style);
  };

  /* ─── Component ──────────────────────────────────────────────────────────── */
  type Props = {};

  const ModifyUser = ({}: Props) => {
    useEffect(() => { injectStyles(); }, []);

    // ── Logic untouched ──────────────────────────────────────────────────────
    const location: Location<{ id?: number }> = useLocation();
    const id = location.state.id;
    const [selectedFileName, setSelectedFileName] = React.useState<string | null>(null);
    const navigate = useNavigate();

    const signInRef = React.useRef<User>({
      firstName: "", lastName: "", email: "",
      phoneNumber: "", occupation: "", userName: "", file: null,
    });

    const [userToModify, setUserToModify] = React.useState<User>({
      firstName: "", lastName: "", email: "",
      phoneNumber: "", occupation: "", userName: "",
    });

    const [trigg, setTrigg] = React.useState<boolean>(false);

    const navigateToUsers = () => {
      navigate(
        location.pathname !== "/modifyyourprofile" ? "/dashboard/userlist" : "/"
      );
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

    const handleSubmitModification: () => Promise<void | string> = async () => {
      try {
        const { email, userName, lastName, phoneNumber, occupation, firstName, file } =
          signInRef.current;
        const nonEmptUserObject = generateData({
          email, userName, lastName, phoneNumber, occupation, firstName, file,
        });
        let formData: FormData = new FormData();
        Object.entries(nonEmptUserObject).forEach(([key, value]) => {
          if (value instanceof Blob) formData.append(key, value);
          else formData.append(key, String(value));
        });
        await api.put(
          `/api/users/${id}`,
          nonEmptUserObject.file ? formData : nonEmptUserObject,
          formData.has("file")
            ? { headers: { "Content-Type": "multipart/form-data" } }
            : undefined
        );
        handleSuccess("User Update", "User updated successfully");
        setTrigg(!trigg);
      } catch (error) {
        handleComponentError(error);
      } finally {
        setTimeout(() => { window.location.reload(); }, 500);
      }
    };

    const fetchUserToModify: () => Promise<void> = async () => {
      try {
        const result: AxiosResponse<User> = await api.get(`/api/users/${id}`);
        setUserToModify(result.data);
      } catch (error) {
        handleComponentError(error);
      }
    };

    React.useEffect(() => {
      fetchUserToModify();
    }, [trigg]);
    // ────────────────────────────────────────────────────────────────────────

    return (
      <Box className={`mu-wrap ${location.pathname === "/modifyyourprofile" ? "mu-wrap-page" : ""}`}>
        <Box className="mu-col">

          {/* ── Back button ── */}
          <button className="mu-back-btn" onClick={navigateToUsers}>
            <ArrowBackRoundedIcon sx={{ fontSize: "0.9rem" }} />
            {location.pathname !== "/modifyyourprofile"
              ? "Back to Users"
              : "Back Home"}
          </button>

          {/* ── Card ── */}
          <Box className="mu-card">

            {/* Header */}
            <Box className="mu-card-header">
              <div className="mu-tag">Edit User</div>
              <Typography className="mu-title">Modify User</Typography>
              <Typography className="mu-subtitle">
                Leave fields empty to keep the current values.
              </Typography>
            </Box>

            {/* Form */}
            <Box
              className="mu-form-body"
              display="flex"
              flexDirection="column"
              gap={2.5}
            >
              <Typography className="mu-section-label">Account Details</Typography>

              <FormControl fullWidth>
                <InputLabel className="mu-label">Email address</InputLabel>
                <Input className="mu-input" onChange={(e) => handleChange(e, "email")} />
                <FormHelperText className="mu-helper">
                  Current: <span>{userToModify.email}</span>
                </FormHelperText>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel className="mu-label">User Name</InputLabel>
                <Input className="mu-input" onChange={(e) => handleChange(e, "userName")} />
                <FormHelperText className="mu-helper">
                  Current: <span>{userToModify.userName}</span>
                </FormHelperText>
              </FormControl>

              <div className="mu-divider" />

              <Typography className="mu-section-label">Personal Info</Typography>

              <FormControl fullWidth>
                <InputLabel className="mu-label">First Name</InputLabel>
                <Input className="mu-input" onChange={(e) => handleChange(e, "firstName")} />
                <FormHelperText className="mu-helper">
                  Current: <span>{userToModify.firstName}</span>
                </FormHelperText>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel className="mu-label">Last Name</InputLabel>
                <Input className="mu-input" onChange={(e) => handleChange(e, "lastName")} />
                <FormHelperText className="mu-helper">
                  Current: <span>{userToModify.lastName}</span>
                </FormHelperText>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel className="mu-label">Phone Number</InputLabel>
                <Input className="mu-input" onChange={(e) => handleChange(e, "phoneNumber")} />
                <FormHelperText className="mu-helper">
                  Current: <span>{userToModify.phoneNumber}</span>
                </FormHelperText>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel className="mu-label">Occupation</InputLabel>
                <Input className="mu-input" onChange={(e) => handleChange(e, "occupation")} />
                <FormHelperText className="mu-helper">
                  Current: <span>{userToModify.occupation}</span>
                </FormHelperText>
              </FormControl>

              <div className="mu-divider" />

              <Typography className="mu-section-label">Profile Image</Typography>

              {/* Upload zone */}
              <Box
                className="mu-upload-zone"
                onClick={() => document.getElementById("mu-file-input")?.click()}
              >
                <input
                  id="mu-file-input"
                  type="file"
                  hidden
                  onChange={(e) => {
                    handleChange(e, "file");
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) setSelectedFileName(file.name);
                  }}
                />
                <span className="mu-upload-icon">📷</span>
                <Typography className="mu-upload-name">
                  {selectedFileName ?? "Click to upload a profile image"}
                </Typography>
                <Typography className="mu-upload-hint">
                  PNG, JPG, WEBP accepted — replaces current image
                </Typography>
              </Box>

              <Button
                className="mu-submit"
                onClick={handleSubmitModification}
                type="button"
                variant="contained"
                disableElevation
              >
                Save Changes
              </Button>

            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  export default ModifyUser;