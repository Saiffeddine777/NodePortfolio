import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Input,
  InputLabel,
  Typography,
} from "@mui/material";
import { UploadFile } from "@mui/icons-material";
import { api } from "../../../ApiService/ApiBrain.ts";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import { useEffect, useRef } from "react";
import type { PortfolioFile } from "../../../Types/PortfolioFileType.ts";
import {
  generateFromDataFromRefObject,
  handleInputChangeIntoARefObject,
} from "../../../Helpers/FieldVerifier.ts";
import { handleSuccess } from "../../../Helpers/Sweetalert.ts";
import CreateFullStoryCV from "./CreateComponents/CreateFullStoryCV.tsx";
import CreateITCV from "./CreateComponents/CreateITCV.tsx";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "portfolio-file-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');

    .pf-wrap {
      padding: 40px 24px;
      font-family: 'DM Sans', sans-serif;
      max-width: 1000px;
      margin: 0 auto;
    }

    /* ── Header ── */
    .pf-header {
      font-family: 'DM Serif Display', serif !important;
      font-size: 2.2rem !important;
      color: #f1f5f9 !important;
      margin-bottom: 8px !important;
    }
    .pf-subtitle {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.95rem !important;
      color: rgba(255, 255, 255, 0.4) !important;
      margin-bottom: 40px !important;
    }

    /* ── Main Card ── */
    .pf-main-card {
      background: rgba(255, 255, 255, 0.03) !important;
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      border-radius: 24px !important;
      overflow: hidden;
      position: relative;
    }
    .pf-main-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), transparent);
    }

    /* ── Form Inputs ── */
    .pf-label {
      color: rgba(255, 255, 255, 0.45) !important;
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.75rem !important;
      font-weight: 600 !important;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .pf-label.Mui-focused {
      color: #818cf8 !important;
    }
    .pf-input input {
      color: #fff !important;
      font-family: 'DM Sans', sans-serif !important;
      padding: 12px 0 !important;
    }
    .pf-input::before { border-bottom-color: rgba(255, 255, 255, 0.1) !important; }
    .pf-input:hover:not(.Mui-disabled)::before { border-bottom-color: rgba(255, 255, 255, 0.3) !important; }
    .pf-input::after { border-bottom-color: #6366f1 !important; }

    /* ── Upload Button (Dashed Dropzone Style) ── */
    .pf-upload-btn {
      border: 2px dashed rgba(99, 102, 241, 0.25) !important;
      background: rgba(99, 102, 241, 0.03) !important;
      color: #818cf8 !important;
      padding: 32px !important;
      border-radius: 16px !important;
      text-transform: none !important;
      font-size: 1rem !important;
      font-weight: 500 !important;
      transition: all 0.2s ease-in-out !important;
    }
    .pf-upload-btn:hover {
      border-color: #818cf8 !important;
      background: rgba(99, 102, 241, 0.07) !important;
      transform: translateY(-2px);
    }

    /* ── Submit Button ── */
    .pf-submit-btn {
      background: linear-gradient(135deg, #6366f1, #4f46e5) !important;
      color: #fff !important;
      border-radius: 12px !important;
      padding: 14px !important;
      font-weight: 600 !important;
      letter-spacing: 0.05em !important;
      text-transform: uppercase !important;
      box-shadow: 0 8px 24px rgba(79, 70, 229, 0.25) !important;
      transition: all 0.2s ease !important;
    }
    .pf-submit-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(79, 70, 229, 0.4) !important;
      filter: brightness(1.1);
    }

    /* ── Grid for CV Components ── */
    .pf-cv-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-top: 24px;
    }
    @media (max-width: 768px) {
      .pf-cv-grid { grid-template-columns: 1fr; }
    }
  `;
  document.head.appendChild(style);
};

const CreatePortfolioFile = () => {
  // ── Logic untouched ──────────────────────────────────────────────────────
  const portfolioFileRef = useRef<PortfolioFile>({
    fileName: "",
    file: null,
  });

  useEffect(() => {
    injectStyles();
  }, []);

  const handlePostAPortfolioFile = async (ref: React.RefObject<PortfolioFile>) => {
    try {
      await api.post("/api/files/", generateFromDataFromRefObject(ref));
      handleSuccess("Success", "File inserted successfully");
    } catch (error) {
      handleComponentError(error);
    } finally {
      portfolioFileRef.current = { fileName: "", file: null };
    }
  };
  // ────────────────────────────────────────────────────────────────────────

  return (
    <Box className="pf-wrap">
      {/* Header Section */}
      <Box mb={4}>
        <Typography className="pf-header">
          Asset Management
        </Typography>
        <Typography className="pf-subtitle">
          Upload and organize your professional documents and CVs.
        </Typography>
      </Box>

      {/* Main Upload Card */}
      <Card className="pf-main-card" elevation={0}>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 4, p: 4 }}>
          <FormControl fullWidth>
            <InputLabel className="pf-label">File Name / Label</InputLabel>
            <Input
              className="pf-input"
              placeholder="e.g., Software Engineer Resume 2026"
              onChange={(e) =>
                handleInputChangeIntoARefObject(
                  portfolioFileRef,
                  e,
                  "fileName"
                )
              }
            />
          </FormControl>

          <Button
            component="label"
            variant="outlined"
            startIcon={<UploadFile sx={{ fontSize: "1.5rem" }} />}
            className="pf-upload-btn"
          >
            Click to upload or drag & drop PDF
            <input
              hidden
              type="file"
              accept=".pdf"
              onChange={(e) =>
                handleInputChangeIntoARefObject(
                  portfolioFileRef,
                  e,
                  "file"
                )
              }
            />
          </Button>

          <Button
            variant="contained"
            className="pf-submit-btn"
            onClick={() => handlePostAPortfolioFile(portfolioFileRef)}
          >
            Save Asset to Cloud
          </Button>
        </CardContent>
      </Card>

      {/* Sub-components Grid */}
      <Box className="pf-cv-grid">
        <CreateFullStoryCV handlePostAPortfolioFile={handlePostAPortfolioFile} />
        <CreateITCV handlePostAPortfolioFile={handlePostAPortfolioFile} />
      </Box>
    </Box>
  );
};

export default CreatePortfolioFile;