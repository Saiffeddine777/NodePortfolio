import { FileOpen } from "@mui/icons-material";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate, type NavigateFunction } from "react-router";
import type { PortfolioFile } from "../../../Types/PortfolioFileType.ts";
import { api } from "../../../ApiService/ApiBrain.ts";
import type { AxiosResponse } from "axios";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import DeletePortfolioFile from "./DeletePortfolioFile.tsx";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "portfolio-list-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    .pl-wrap {
      padding: 24px;
      font-family: 'DM Sans', sans-serif;
    }

    /* ── Header ── */
    .pl-header-title {
      font-family: 'DM Serif Display', serif !important;
      font-size: 1.8rem !important;
      color: #f1f5f9 !important;
    }
    .pl-create-btn {
      background: rgba(99, 102, 241, 0.1) !important;
      border: 1px solid rgba(99, 102, 241, 0.4) !important;
      color: #818cf8 !important;
      border-radius: 12px !important;
      padding: 8px 20px !important;
      transition: all 0.2s ease !important;
    }
    .pl-create-btn:hover {
      background: #6366f1 !important;
      color: #fff !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4) !important;
    }

    /* ── Table Container ── */
    .pl-table-container {
      background: rgba(255, 255, 255, 0.02) !important;
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      border-radius: 16px !important;
      overflow: hidden !important;
    }

    /* ── Table Cells ── */
    .pl-th {
      background: rgba(255, 255, 255, 0.03) !important;
      color: rgba(255, 255, 255, 0.5) !important;
      text-transform: uppercase !important;
      font-size: 0.75rem !important;
      letter-spacing: 0.1em !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
      font-weight: 600 !important;
    }
    .pl-td {
      color: rgba(255, 255, 255, 0.8) !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04) !important;
      font-family: 'DM Sans', sans-serif !important;
    }
    .pl-row {
      transition: background 0.2s ease !important;
    }
    .pl-row:hover {
      background: rgba(255, 255, 255, 0.04) !important;
    }

    /* ── Cloudinary ID Badge ── */
    .pl-id-badge {
      font-family: 'JetBrains Mono', monospace; /* Technical feel */
      font-size: 0.8rem;
      background: rgba(16, 185, 129, 0.1);
      color: #34d399;
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }
  `;
  document.head.appendChild(style);
};

type Props = {};

const PortfolioFileList = ({}: Props) => {
  const navigate: NavigateFunction = useNavigate();
  const [portfolioFiles, setPortfolioFiles] = React.useState<PortfolioFile[]>([]);
  const [trigger, setTrigger] = React.useState<boolean>(false);

  useEffect(() => { injectStyles(); }, []);

  const tableHeadTitles: string[] = ["ID", "File Name", "Cloudinary ID", "Actions"];

  const handleFetchFiles: () => Promise<void> = async () => {
    try {
      const result: AxiosResponse<PortfolioFile[]> = await api.get("/api/files");
      setPortfolioFiles(result.data);
    } catch (error) {
      handleComponentError(error);
    }
  };

  const getPureID: (str: string) => string | undefined = (str) => {
    return str?.split("/")[1] || str;
  };

  const navigateToCreateOnePortfolio: () => void = () => {
    navigate("/dashboard/createportfoliofile");
  };

  React.useEffect(() => {
    handleFetchFiles();
  }, [trigger]);

  return (
    <Box className="pl-wrap">
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h6" className="pl-header-title">
          Portfolio Files
        </Typography>

        <Button
          startIcon={<FileOpen />}
          variant="contained"
          className="pl-create-btn"
          onClick={navigateToCreateOnePortfolio}
          sx={{ textTransform: "none" }}
        >
          Create File
        </Button>
      </Box>

      {/* TABLE */}
      <TableContainer component={Paper} elevation={0} className="pl-table-container">
        <Table>
          <TableHead>
            <TableRow>
              {tableHeadTitles.map((title, index) => (
                <TableCell key={index} className="pl-th">
                  {title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {portfolioFiles.map((file, index) => (
              <TableRow key={index} className="pl-row">
                <TableCell className="pl-td" sx={{ opacity: 0.5 }}>
                  {file.id}
                </TableCell>
                <TableCell className="pl-td" sx={{ fontWeight: 500 }}>
                  {file.fileName}
                </TableCell>
                <TableCell className="pl-td">
                  <span className="pl-id-badge">
                    {getPureID(file.publicId as string)}
                  </span>
                </TableCell>
                <TableCell className="pl-td">
                  <DeletePortfolioFile
                    setTrigger={setTrigger}
                    id={file.id}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PortfolioFileList;