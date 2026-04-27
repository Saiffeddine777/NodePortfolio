import { Button, Card, CardContent, Typography, Box } from "@mui/material";
import React, { useEffect } from "react";
import { UploadFile, Terminal } from "@mui/icons-material";
import { handleInputChangeIntoARefObject } from "../../../../Helpers/FieldVerifier.ts";
import type { PortfolioFile } from "../../../../Types/PortfolioFileType.ts";
import { api } from "../../../../ApiService/ApiBrain.ts";
import { handleSuccess } from "../../../../Helpers/Sweetalert.ts";
import { handleComponentError } from "../../../../Helpers/ErrorHandler.ts";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "it-cv-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    .itc-card {
      background: rgba(255, 255, 255, 0.02) !important;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.06) !important;
      border-radius: 20px !important;
      transition: all 0.3s ease-in-out !important;
      position: relative;
      overflow: hidden;
    }
    .itc-card:hover {
      border-color: rgba(16, 185, 129, 0.3) !important; /* Emerald accent */
      transform: translateY(-4px);
      box-shadow: 0 10px 30px -15px rgba(16, 185, 129, 0.2) !important;
    }
    .itc-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; width: 4px; height: 100%;
      background: #10b981; /* Emerald accent line */
      opacity: 0.5;
    }

    .itc-title {
      font-family: 'DM Serif Display', serif !important;
      color: #f8fafc !important;
      display: flex;
      align-items: center;
      gap: 10px;
      letter-spacing: 0.02em;
    }

    .itc-desc {
      font-family: 'DM Sans', sans-serif !important;
      color: rgba(255, 255, 255, 0.4) !important;
      font-size: 0.85rem !important;
      line-height: 1.5 !important;
      margin-bottom: 8px !important;
    }

    .itc-upload-btn {
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      background: rgba(255, 255, 255, 0.03) !important;
      color: #cbd5e1 !important;
      text-transform: none !important;
      padding: 10px !important;
      border-radius: 10px !important;
      font-family: 'DM Sans', sans-serif !important;
      transition: all 0.2s ease !important;
    }
    .itc-upload-btn:hover {
      background: rgba(16, 185, 129, 0.1) !important;
      color: #34d399 !important;
      border-color: #34d399 !important;
    }

    .itc-submit-btn {
      background: #10b981 !important;
      color: #064e3b !important; /* Dark green for contrast */
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.05em !important;
      border-radius: 8px !important;
      padding: 8px 24px !important;
    }
    .itc-submit-btn:hover {
      background: #059669 !important;
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4) !important;
    }
  `;
  document.head.appendChild(style);
};

type Props = {
  handlePostAPortfolioFile: (ref: React.RefObject<PortfolioFile>) => Promise<void>;
};

function CreateITCV({ handlePostAPortfolioFile }: Props) {
  useEffect(() => { injectStyles(); }, []);

  // ── Logic untouched ──────────────────────────────────────────────────────
  const itcvRef = React.useRef<PortfolioFile>({
    fileName: "itCv",
    file: null,
  });

  const handleUpdate = async () => {
    try {
      await api.delete(`/api/files/delete/${itcvRef.current.fileName}`);
      await handlePostAPortfolioFile(itcvRef);
      handleSuccess("Success", "IT CV updated");
    } catch (error) {
      handleComponentError(error);
    }
  };
  // ────────────────────────────────────────────────────────────────────────

  return (
    <Card className="itc-card" elevation={0}>
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, p: 3 }}>
        <Typography variant="h6" className="itc-title">
          <Terminal sx={{ color: '#10b981', fontSize: '1.4rem' }} />
          IT / Tech CV
        </Typography>

        <Typography variant="body2" className="itc-desc">
          Focused technical resume highlighting full-stack development, AWS, and system architecture.
        </Typography>

        <Button
          component="label"
          variant="outlined"
          startIcon={<UploadFile />}
          className="itc-upload-btn"
        >
          Upload technical PDF
          <input
            hidden
            type="file"
            accept=".pdf"
            onChange={(e) =>
              handleInputChangeIntoARefObject(itcvRef, e, "file")
            }
          />
        </Button>

        <Box display="flex" justifyContent="flex-end" mt={1}>
          <Button 
            variant="contained" 
            className="itc-submit-btn"
            onClick={handleUpdate}
          >
            Deploy IT CV
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default CreateITCV;