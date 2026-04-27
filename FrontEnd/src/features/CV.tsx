import {
  Box,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import React, { useEffect } from "react";
import type { PortfolioFile } from "../Types/PortfolioFileType.ts";
import { handleComponentError } from "../Helpers/ErrorHandler.ts";
import { api } from "../ApiService/ApiBrain.ts";
import type { AxiosResponse } from "axios";
import BackToHome from "./HomeComponents/BackToHome.tsx";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "cv-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=DM+Serif+Display:ital@0;1&display=swap');

    /* ── Page ── */
    .cv-page {
      min-height: 100vh;
      background: #0b0c10;
      background-image:
        radial-gradient(ellipse 70% 50% at 10% -10%, rgba(99,102,241,0.13) 0%, transparent 60%),
        radial-gradient(ellipse 50% 40% at 90% 110%, rgba(129,140,248,0.09) 0%, transparent 55%);
      font-family: 'DM Sans', sans-serif;
      padding: 32px 0 80px;
    }

    /* ── Heading block ── */
    .cv-tag {
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
    .cv-title {
      font-family: 'DM Serif Display', Georgia, serif !important;
      font-size: clamp(1.6rem, 4vw, 2.2rem) !important;
      font-weight: 400 !important;
      color: #f1f5f9 !important;
      letter-spacing: -0.01em !important;
      line-height: 1.2 !important;
      margin-bottom: 8px !important;
    }
    .cv-subtitle {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.9rem !important;
      color: rgba(255,255,255,0.38) !important;
      margin-bottom: 0 !important;
    }

    /* ── Card ── */
    .cv-card {
      position: relative;
      border-radius: 18px !important;
      background: rgba(255,255,255,0.032) !important;
      border: 1px solid rgba(255,255,255,0.07) !important;
      box-shadow: none !important;
      overflow: hidden;
      transition: border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease !important;
    }
    .cv-card:hover {
      border-color: rgba(99,102,241,0.32) !important;
      transform: translateY(-4px) !important;
      box-shadow: 0 16px 48px rgba(0,0,0,0.35) !important;
    }
    .cv-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(99,102,241,0.05) 0%, transparent 60%);
      pointer-events: none;
    }

    /* ── Card inner ── */
    .cv-card-body {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 28px 32px !important;
      gap: 24px;
    }

    /* ── File icon badge ── */
    .cv-file-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      flex-shrink: 0;
      border-radius: 12px;
      background: rgba(99,102,241,0.1);
      border: 1px solid rgba(99,102,241,0.22);
      font-size: 1.3rem;
    }

    /* ── Card text ── */
    .cv-card-name {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 1rem !important;
      font-weight: 700 !important;
      color: rgba(255,255,255,0.88) !important;
      margin-bottom: 5px !important;
      letter-spacing: -0.01em !important;
    }
    .cv-card-date {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.78rem !important;
      color: rgba(255,255,255,0.32) !important;
    }

    /* ── View button ── */
    .cv-btn {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.78rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.07em !important;
      text-transform: uppercase !important;
      color: #818cf8 !important;
      border: 1px solid rgba(99,102,241,0.3) !important;
      border-radius: 999px !important;
      padding: 7px 22px !important;
      white-space: nowrap;
      flex-shrink: 0;
      transition: border-color 0.2s, background 0.2s, box-shadow 0.2s !important;
    }
    .cv-btn:hover {
      border-color: #818cf8 !important;
      background: rgba(99,102,241,0.1) !important;
      box-shadow: 0 0 16px rgba(99,102,241,0.22) !important;
    }

    /* ── Divider ── */
    .cv-divider {
      width: 100%;
      height: 1px;
      background: rgba(255,255,255,0.07);
      margin: 8px 0 36px;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const formatFileName = (name: string): string => {
  if (name === "fullStoryCV") return "Full Story CV";
  if (name === "itCv") return "IT CV";
  return name;
};

/* ─── Component ──────────────────────────────────────────────────────────── */
const CV = () => {
  useEffect(() => { injectStyles(); }, []);

  // ── Logic untouched ──────────────────────────────────────────────────────
  const [cvs, setCvs] = React.useState<PortfolioFile[]>([]);

  const handleFetchCvs = async (): Promise<void> => {
    try {
      const result: AxiosResponse<PortfolioFile[]> = await api.get(
        "/api/files/cvs/fullStoryCV/itCv"
      );
      setCvs(result.data);
    } catch (error) {
      handleComponentError(error);
    }
  };

  React.useEffect(() => {
    handleFetchCvs();
  }, []);
  // ────────────────────────────────────────────────────────────────────────

  return (
    <Box className="cv-page">
      <Box sx={{ maxWidth: 720, mx: "auto", px: 3 }}>

        {/* ── Back button ── */}
        <Box mb={4}>
          <BackToHome />
        </Box>

        {/* ── Heading ── */}
        <Box mb={2}>
          <div className="cv-tag">Documents</div>
          <Typography className="cv-title">Curriculum Vitae</Typography>
          <Typography className="cv-subtitle">
            Download or preview my latest résumés.
          </Typography>
        </Box>

        <div className="cv-divider" />

        {/* ── CV Cards ── */}
        <Stack spacing={3}>
          {cvs.map((file) => (
            <Box key={file.id} className="cv-card">
              <Box className="cv-card-body">

                {/* Left: icon + text */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                  <div className="cv-file-badge">📄</div>
                  <Box>
                    <Typography className="cv-card-name">
                      {formatFileName(file.fileName)}
                    </Typography>
                    <Typography className="cv-card-date">
                      Last updated:{" "}
                      {file.updatedAt
                        ? new Date(file.updatedAt).toLocaleDateString()
                        : "—"}
                    </Typography>
                  </Box>
                </Box>

                {/* Right: action */}
                {file.publicUrl && (
                  <Button
                    className="cv-btn"
                    onClick={() => window.open(file.publicUrl, "_blank")}
                    disableElevation
                  >
                    View CV
                  </Button>
                )}

              </Box>
            </Box>
          ))}
        </Stack>

      </Box>
    </Box>
  );
};

export default CV;