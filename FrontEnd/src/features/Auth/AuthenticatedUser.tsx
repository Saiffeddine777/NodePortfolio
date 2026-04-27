import { Avatar, Box, Typography, Button } from "@mui/material";
import { useAppSelector } from "../../app/Hooks.ts";
import ProfileRow from "../Components/ProfileRow.tsx";
import { useNavigate } from "react-router";
import BackToHome from "../HomeComponents/BackToHome.tsx";
import { useEffect } from "react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "authenticated-user-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=DM+Serif+Display:ital@0;1&display=swap');

    /* ── Page ── */
    .au-page {
      min-height: 100vh;
      background: #0b0c10;
      background-image:
        radial-gradient(ellipse 70% 50% at 10% -10%, rgba(99,102,241,0.13) 0%, transparent 60%),
        radial-gradient(ellipse 50% 40% at 90% 110%, rgba(129,140,248,0.09) 0%, transparent 55%);
      font-family: 'DM Sans', sans-serif;
      padding: 32px 0 80px;
    }

    /* ── Inner col ── */
    .au-col {
      width: 100%;
      max-width: 580px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      flex-direction: column;
    }

    /* ── Back row ── */
    .au-back-row {
      margin-bottom: 28px;
    }

    /* ── Card ── */
    .au-card {
      border-radius: 20px;
      background: rgba(255,255,255,0.032);
      border: 1px solid rgba(255,255,255,0.07);
      overflow: hidden;
      position: relative;
    }
    .au-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(99,102,241,0.07) 0%, transparent 60%);
      pointer-events: none;
    }

    /* ── Avatar section ── */
    .au-avatar-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px 32px 24px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      position: relative;
      z-index: 1;
    }

    /* ── Change password button ── */
    .au-change-pwd-btn {
      position: absolute !important;
      top: 20px !important;
      right: 20px !important;
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.72rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.07em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.45) !important;
      border: 1px solid rgba(255,255,255,0.1) !important;
      border-radius: 999px !important;
      padding: 5px 14px !important;
      transition: color 0.2s ease, border-color 0.2s ease,
                  background 0.2s ease !important;
    }
    .au-change-pwd-btn:hover {
      color: #818cf8 !important;
      border-color: rgba(99,102,241,0.4) !important;
      background: rgba(99,102,241,0.08) !important;
    }

    /* ── Avatar ── */
    .au-avatar {
      width: 110px !important;
      height: 110px !important;
      border: 2px solid rgba(99,102,241,0.35) !important;
      box-shadow: 0 0 32px rgba(99,102,241,0.22) !important;
      margin-bottom: 20px !important;
    }

    /* ── Name ── */
    .au-name {
      font-family: 'DM Serif Display', Georgia, serif !important;
      font-size: 1.65rem !important;
      font-weight: 400 !important;
      color: #f1f5f9 !important;
      letter-spacing: -0.01em !important;
      text-align: center !important;
      margin-bottom: 8px !important;
    }

    /* ── Username + role row ── */
    .au-username-row {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: center;
    }
    .au-username {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.82rem !important;
      color: rgba(255,255,255,0.35) !important;
    }
    .au-role-badge {
      display: inline-block;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #818cf8;
      background: rgba(99,102,241,0.12);
      border: 1px solid rgba(99,102,241,0.25);
      border-radius: 999px;
      padding: 2px 10px;
    }

    /* ── Info section ── */
    .au-info-section {
      padding: 24px 32px 32px;
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    /* ── Empty state ── */
    .au-empty {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.9rem !important;
      color: rgba(255,255,255,0.28) !important;
      text-align: center !important;
      padding: 64px 0 !important;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Component ──────────────────────────────────────────────────────────── */
type Props = {};

const AuthenticatedUser = ({}: Props) => {
  useEffect(() => { injectStyles(); }, []);

  // ── Logic untouched ──────────────────────────────────────────────────────
  const navigate = useNavigate();
  const authenticatedUser = useAppSelector(
    (state) => state.userAuth.authUser
  );

  const handleNavigateToChangePassword: () => void = () => {
    navigate("/changepassword");
  };
  // ────────────────────────────────────────────────────────────────────────

  if (!authenticatedUser?.id) {
    return (
      <Box className="au-page">
        <Typography className="au-empty">No authenticated user.</Typography>
      </Box>
    );
  }

  const {
    firstName,
    lastName,
    email,
    role,
    occupation,
    userName,
    phoneNumber,
    imageUrl,
    createdAt,
  } = authenticatedUser;

  return (
    <Box className="au-page">
      <Box className="au-col">

        {/* ── Back button ── */}
        <Box className="au-back-row">
          <BackToHome />
        </Box>

        {/* ── Card ── */}
        <Box className="au-card">

          {/* Avatar + name section */}
          <Box className="au-avatar-section">

            {/* Change password — top right */}
            <Button
              className="au-change-pwd-btn"
              onClick={handleNavigateToChangePassword}
              disableElevation
            >
              Change Password
            </Button>

            <Avatar src={imageUrl} className="au-avatar" />

            <Typography className="au-name">
              {firstName} {lastName}
            </Typography>

            <Box className="au-username-row">
              <Typography className="au-username">@{userName}</Typography>
              <span className="au-role-badge">{role}</span>
            </Box>

          </Box>

          {/* Info rows */}
          <Box className="au-info-section">
            <ProfileRow label="Email" value={email} />
            <ProfileRow label="Occupation" value={occupation} />
            <ProfileRow label="Phone" value={phoneNumber} />
            <ProfileRow
              label="Joined"
              value={new Date(createdAt as Date).toLocaleDateString()}
            />
          </Box>

        </Box>
      </Box>
    </Box>
  );
};

export default AuthenticatedUser;