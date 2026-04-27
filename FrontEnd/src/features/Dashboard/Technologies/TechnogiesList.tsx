import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Pagination,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import type { Technology } from "../../../Types/Technology.ts";
import type { AxiosResponse } from "axios";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import EditIcon from "@mui/icons-material/Edit";
import DeleteTechnology from "./DeleteTechnology.tsx";
import { api } from "../../../ApiService/ApiBrain.ts";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "technologies-list-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=DM+Serif+Display:ital@0;1&display=swap');

    /* ── Wrapper ── */
    .tl-wrap {
      padding: 32px 28px;
      font-family: 'DM Sans', sans-serif;
      height: 100%;
      box-sizing: border-box;
    }

    /* ── Header ── */
    .tl-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }
    .tl-tag {
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
      margin-bottom: 14px;
    }
    .tl-title {
      font-family: 'DM Serif Display', Georgia, serif !important;
      font-size: 1.7rem !important;
      font-weight: 400 !important;
      color: #f1f5f9 !important;
      letter-spacing: -0.01em !important;
      line-height: 1.2 !important;
      margin-bottom: 4px !important;
    }
    .tl-subtitle {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.82rem !important;
      color: rgba(255,255,255,0.28) !important;
    }

    /* ── Add button ── */
    .tl-add-btn {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.78rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.06em !important;
      text-transform: uppercase !important;
      background: linear-gradient(135deg, #6366f1, #818cf8) !important;
      color: #fff !important;
      border-radius: 999px !important;
      padding: 8px 22px !important;
      box-shadow: 0 4px 18px rgba(99,102,241,0.35) !important;
      border: none !important;
      align-self: flex-start !important;
      transition: transform 0.2s ease, box-shadow 0.2s ease !important;
    }
    .tl-add-btn:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 26px rgba(99,102,241,0.5) !important;
    }

    /* ── Divider ── */
    .tl-divider {
      height: 1px;
      background: rgba(255,255,255,0.07);
      margin: 0 0 24px;
    }

    /* ── Table ── */
    .tl-table-container {
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.07);
    }
    .tl-thead-row {
      background: rgba(255,255,255,0.03) !important;
    }
    .tl-thead-cell {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.68rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.12em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.28) !important;
      border-bottom: 1px solid rgba(255,255,255,0.07) !important;
      padding: 14px 16px !important;
    }
    .tl-tbody-row {
      transition: background 0.18s ease !important;
    }
    .tl-tbody-row:hover {
      background: rgba(99,102,241,0.05) !important;
    }
    .tl-tbody-cell {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.85rem !important;
      color: rgba(255,255,255,0.55) !important;
      border-bottom: 1px solid rgba(255,255,255,0.05) !important;
      padding: 14px 16px !important;
    }
    .tl-tbody-row:last-child .tl-tbody-cell {
      border-bottom: none !important;
    }

    /* ── ID badge ── */
    .tl-id-badge {
      display: inline-block;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.72rem;
      font-weight: 600;
      color: rgba(255,255,255,0.25);
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 6px;
      padding: 2px 8px;
      letter-spacing: 0.04em;
    }

    /* ── Clickable name ── */
    .tl-name-cell {
      font-weight: 600 !important;
      color: #818cf8 !important;
      cursor: pointer;
      transition: color 0.18s ease !important;
    }
    .tl-name-cell:hover {
      color: #a5b4fc !important;
    }

    /* ── Type badge ── */
    .tl-type-badge {
      display: inline-block;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.68rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.5);
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.09);
      border-radius: 6px;
      padding: 3px 9px;
    }

    /* ── Score badge ── */
    .tl-score-badge {
      display: inline-block;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.75rem;
      font-weight: 700;
      color: #4ade80;
      background: rgba(74,222,128,0.08);
      border: 1px solid rgba(74,222,128,0.2);
      border-radius: 6px;
      padding: 3px 9px;
      letter-spacing: 0.04em;
    }

    /* ── Edit button ── */
    .tl-edit-btn {
      width: 34px !important;
      height: 34px !important;
      border-radius: 9px !important;
      border: 1px solid rgba(255,255,255,0.07) !important;
      background: rgba(255,255,255,0.03) !important;
      color: rgba(255,255,255,0.28) !important;
      transition:
        color 0.2s ease,
        background 0.2s ease,
        border-color 0.2s ease,
        transform 0.2s ease,
        box-shadow 0.2s ease !important;
    }
    .tl-edit-btn:hover {
      color: #818cf8 !important;
      background: rgba(99,102,241,0.1) !important;
      border-color: rgba(99,102,241,0.35) !important;
      transform: scale(1.1) !important;
      box-shadow: 0 0 14px rgba(99,102,241,0.2) !important;
    }
    .tl-edit-btn svg {
      font-size: 1rem !important;
    }

    /* ── Pagination ── */
    .tl-pagination-wrap {
      display: flex;
      justify-content: center;
      padding-top: 24px;
      padding-bottom: 8px;
    }
    .tl-pagination-wrap .MuiPaginationItem-root {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.8rem !important;
      color: rgba(255,255,255,0.4) !important;
      border: 1px solid rgba(255,255,255,0.08) !important;
      border-radius: 8px !important;
      transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease !important;
    }
    .tl-pagination-wrap .MuiPaginationItem-root:hover {
      background: rgba(99,102,241,0.1) !important;
      border-color: rgba(99,102,241,0.3) !important;
      color: #818cf8 !important;
    }
    .tl-pagination-wrap .Mui-selected {
      background: rgba(99,102,241,0.18) !important;
      border-color: rgba(99,102,241,0.4) !important;
      color: #818cf8 !important;
    }
    .tl-pagination-wrap .Mui-selected:hover {
      background: rgba(99,102,241,0.26) !important;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Component ──────────────────────────────────────────────────────────── */
function TechnogiesList() {
  useEffect(() => { injectStyles(); }, []);

  // ── Logic untouched ──────────────────────────────────────────────────────
  const navigate = useNavigate();
  const [trigg, setTrigg] = React.useState<boolean>(false);
  const [technologies, setTechnologies] = React.useState<Technology[]>([]);
  const [total, setTotal] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(1);
  const limit: number = 6;

  const handleFetchTechnologies = async () => {
    try {
      const result: AxiosResponse<{
        total: number;
        page: number;
        lastPage: number;
        data: Technology[];
      }> = await api.get(`/api/technologies/paginate/${limit}/${page}`);
      setTechnologies(result.data.data);
      setTotal(result.data.total);
    } catch (error) {
      handleComponentError(error);
    }
  };

  React.useEffect(() => {
    handleFetchTechnologies();
  }, [trigg, page]);

  const navigateToCreateTechnology = () =>
    navigate("/dashboard/createtechnology");

  const navigateToEditTechnology = (techId?: number) =>
    navigate("/dashboard/modifytechnology", { state: { id: techId } });

  const navigateToSomething = (partialPath: string, techId?: number) =>
    navigate(
      `/dashboard/${partialPath}`,
      techId ? { state: { id: techId } } : undefined
    );
  // ────────────────────────────────────────────────────────────────────────

  return (
    <Box className="tl-wrap">

      {/* ── Header ── */}
      <Box className="tl-header">
        <Box>
          <div className="tl-tag">Stack</div>
          <Typography className="tl-title">Technologies</Typography>
          <Typography className="tl-subtitle">
            {total} technolog{total !== 1 ? "ies" : "y"} registered
          </Typography>
        </Box>
        <Button
          className="tl-add-btn"
          onClick={navigateToCreateTechnology}
          disableElevation
        >
          + Add Technology
        </Button>
      </Box>

      <div className="tl-divider" />

      {/* ── Table ── */}
      <TableContainer className="tl-table-container">
        <Table>
          <TableHead>
            <TableRow className="tl-thead-row">
              <TableCell className="tl-thead-cell">ID</TableCell>
              <TableCell className="tl-thead-cell">Name</TableCell>
              <TableCell className="tl-thead-cell">Type</TableCell>
              <TableCell className="tl-thead-cell">Score</TableCell>
              <TableCell className="tl-thead-cell">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {technologies.map((tech, index) => (
              <TableRow key={index} className="tl-tbody-row">

                <TableCell className="tl-tbody-cell">
                  <span className="tl-id-badge">#{tech?.id}</span>
                </TableCell>

                <TableCell
                  className="tl-tbody-cell tl-name-cell"
                  onClick={() => navigateToSomething("onetechnology", tech?.id)}
                >
                  {tech.name}
                </TableCell>

                <TableCell className="tl-tbody-cell">
                  <span className="tl-type-badge">{tech.technologyType}</span>
                </TableCell>

                <TableCell className="tl-tbody-cell">
                  <span className="tl-score-badge">{tech.score}</span>
                </TableCell>

                <TableCell className="tl-tbody-cell">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <DeleteTechnology id={tech?.id} setTrigg={setTrigg} />
                    <IconButton
                      className="tl-edit-btn"
                      title="Modify"
                      onClick={() => navigateToEditTechnology(tech?.id)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ── Pagination ── */}
      <Box className="tl-pagination-wrap">
        <Pagination
          count={Math.ceil(total / limit)}
          page={page}
          onChange={(_, newPage) => setPage(newPage)}
          color="primary"
        />
      </Box>

    </Box>
  );
}

export default TechnogiesList;