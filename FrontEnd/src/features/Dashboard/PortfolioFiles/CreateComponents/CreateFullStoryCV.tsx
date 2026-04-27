import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import React, { type RefObject, useEffect } from "react";
import { UploadFile, AutoStories } from "@mui/icons-material";
import { handleInputChangeIntoARefObject } from "../../../../Helpers/FieldVerifier.ts";
import type { PortfolioFile } from "../../../../Types/PortfolioFileType.ts";
import { api } from "../../../../ApiService/ApiBrain.ts";
import { handleSuccess } from "../../../../Helpers/Sweetalert.ts";
import { handleComponentError } from "../../../../Helpers/ErrorHandler.ts";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "full-story-cv-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    .fsc-card {
      background: rgba(255, 255, 255, 0.02) !important;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.06) !important;
      border-radius: 20px !important;
      transition: transform 0.3s ease, border-color 0.3s ease !important;
      position: relative;
      overflow: hidden;
    }
    .fsc-card:hover {
      border-color: rgba(251, 191, 36, 0.3) !important; /* Amber accent */
      transform: translateY(-4px);
    }
    .fsc-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; width: 4px; height: 100%;
      background: #fbbf24; /* Amber accent line */
      opacity: 0.5;
    }

    .fsc-title {
      font-family: 'DM Serif Display', serif !important;
      color: #f8fafc !important;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .fsc-desc {
      font-family: 'DM Sans', sans-serif !important;
      color: rgba(255, 255, 255, 0.4) !important;
      line-height: 1.5 !important;
    }

    .fsc-upload-btn {
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      background: rgba(255, 255, 255, 0.03) !important;
      color: #cbd5e1 !important;
      text-transform: none !important;
      padding: 10px !important;
      border-radius: 10px !important;
      font-family: 'DM Sans', sans-serif !important;
    }
    .fsc-upload-btn:hover {
      background: rgba(251, 191, 36, 0.1) !important;
      color: #fbbf24 !important;
      border-color: #fbbf24 !important;
    }

    .fsc-submit-btn {
      background: #fbbf24 !important;
      color: #000 !important; /* High contrast for amber */
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.05em !important;
      border-radius: 8px !important;
      padding: 8px 24px !important;
    }
    .fsc-submit-btn:hover {
      background: #f59e0b !important;
      box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4) !important;
    }
  `;
  document.head.appendChild(style);
};

type Props = {
  handlePostAPortfolioFile: (ref: RefObject<PortfolioFile>) => Promise<void>;
};

function CreateFullStoryCV({ handlePostAPortfolioFile }: Props) {
  useEffect(() => { injectStyles(); }, []);

  // ── Logic untouched ──────────────────────────────────────────────────────
  const fullStoryCV = React.useRef<PortfolioFile>({
    fileName: "fullStoryCV",
    file: null,
  });

  const handleUpdatetingtheFile = async () => {
    try {
      await api.delete(`/api/files/delete/${fullStoryCV.current.fileName}`);
      await handlePostAPortfolioFile(fullStoryCV);
      handleSuccess("Success", "Full Story CV updated");
    } catch (error) {
      handleComponentError(error);
    }
  };
  // ────────────────────────────────────────────────────────────────────────

  return (
    <Card className="fsc-card" elevation={0}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          p: 3,
        }}
      >
        <Typography variant="h6" className="fsc-title">
          <AutoStories sx={{ color: '#fbbf24', fontSize: '1.4rem' }} />
          Full Story CV
        </Typography>

        <Typography variant="body2" className="fsc-desc">
          The comprehensive narrative of your professional journey and marketing expertise.
        </Typography>

        <Button
          component="label"
          variant="outlined"
          startIcon={<UploadFile />}
          className="fsc-upload-btn"
        >
          Select PDF
          <input
            hidden
            type="file"
            accept=".pdf"
            onChange={(e) =>
              handleInputChangeIntoARefObject(fullStoryCV, e, "file")
            }
          />
        </Button>

        <Box display="flex" justifyContent="flex-end" mt={1}>
          <Button
            variant="contained"
            className="fsc-submit-btn"
            onClick={handleUpdatetingtheFile}
          >
            Update Story
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default CreateFullStoryCV;