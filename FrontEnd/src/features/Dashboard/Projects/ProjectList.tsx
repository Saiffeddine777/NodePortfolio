import React, { useEffect } from "react";
import type { Project } from "../../../Types/Project.tsx";
import type { AxiosResponse } from "axios";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Button,
  IconButton,
  Pagination,
  Typography,
} from "@mui/material";
import DeleteProject from "./DeleteProject.tsx";
import { useNavigate, type NavigateFunction } from "react-router";
import EditIcon from "@mui/icons-material/Edit";
import { api } from "../../../ApiService/ApiBrain.ts";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "project-list-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=DM+Serif+Display:ital@0;1&display=swap');

    /* ── Wrapper ── */
    .pl-wrap {
      padding: 32px 28px;
      font-family: 'DM Sans', sans-serif;
      height: 100%;
      box-sizing: border-box;
    }

    /* ── Header ── */
    .pl-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }
    .pl-tag {
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
    .pl-title {
      font-family: 'DM Serif Display', Georgia, serif !important;
      font-size: 1.7rem !important;
      font-weight: 400 !important;
      color: #f1f5f9 !important;
      letter-spacing: -0.01em !important;
      line-height: 1.2 !important;
      margin-bottom: 4px !important;
    }
    .pl-subtitle {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.82rem !important;
      color: rgba(255,255,255,0.28) !important;
    }

    /* ── Add button ── */
    .pl-add-btn {
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
    .pl-add-btn:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 26px rgba(99,102,241,0.5) !important;
    }

    /* ── Divider ── */
    .pl-divider {
      height: 1px;
      background: rgba(255,255,255,0.07);
      margin: 0 0 24px;
    }

    /* ── Table ── */
    .pl-table-container {
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.07);
    }
    .pl-thead-row {
      background: rgba(255,255,255,0.03) !important;
    }
    .pl-thead-cell {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.68rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.12em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.28) !important;
      border-bottom: 1px solid rgba(255,255,255,0.07) !important;
      padding: 14px 16px !important;
    }
    .pl-tbody-row {
      transition: background 0.18s ease !important;
    }
    .pl-tbody-row:hover {
      background: rgba(99,102,241,0.05) !important;
    }
    .pl-tbody-cell {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.85rem !important;
      color: rgba(255,255,255,0.55) !important;
      border-bottom: 1px solid rgba(255,255,255,0.05) !important;
      padding: 14px 16px !important;
    }
    .pl-tbody-row:last-child .pl-tbody-cell {
      border-bottom: none !important;
    }

    /* ── ID badge ── */
    .pl-id-badge {
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
    .pl-name-cell {
      font-weight: 600 !important;
      color: #818cf8 !important;
      cursor: pointer;
      transition: color 0.18s ease !important;
    }
    .pl-name-cell:hover {
      color: #a5b4fc !important;
    }

    /* ── Category badge ── */
    .pl-category-badge {
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

    /* ── Edit button ── */
    .pl-edit-btn {
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
    .pl-edit-btn:hover {
      color: #818cf8 !important;
      background: rgba(99,102,241,0.1) !important;
      border-color: rgba(99,102,241,0.35) !important;
      transform: scale(1.1) !important;
      box-shadow: 0 0 14px rgba(99,102,241,0.2) !important;
    }
    .pl-edit-btn svg {
      font-size: 1rem !important;
    }

    /* ── Pagination ── */
    .pl-pagination-wrap {
      display: flex;
      justify-content: center;
      padding-top: 24px;
      padding-bottom: 8px;
    }
    .pl-pagination-wrap .MuiPaginationItem-root {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.8rem !important;
      color: rgba(255,255,255,0.4) !important;
      border: 1px solid rgba(255,255,255,0.08) !important;
      border-radius: 8px !important;
      transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease !important;
    }
    .pl-pagination-wrap .MuiPaginationItem-root:hover {
      background: rgba(99,102,241,0.1) !important;
      border-color: rgba(99,102,241,0.3) !important;
      color: #818cf8 !important;
    }
    .pl-pagination-wrap .Mui-selected {
      background: rgba(99,102,241,0.18) !important;
      border-color: rgba(99,102,241,0.4) !important;
      color: #818cf8 !important;
    }
    .pl-pagination-wrap .Mui-selected:hover {
      background: rgba(99,102,241,0.26) !important;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Component ──────────────────────────────────────────────────────────── */
type Props = {};

function ProjectList({}: Props) {
  useEffect(() => { injectStyles(); }, []);

  // ── Logic untouched ──────────────────────────────────────────────────────
  const navigate: NavigateFunction = useNavigate();
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [page, setPage] = React.useState<number>(1);
  const [total, setTotal] = React.useState<number>(0);
  const [trigg, setTrigg] = React.useState<boolean>(false);
  const limit: number = 6;

  const arrayOfColumns: string[] = ["Id", "Project Name", "Category", "Actions"];

  const handleFetchProjects: () => Promise<void> = async () => {
    try {
      const result: AxiosResponse<{
        total: number;
        page: number;
        lastPage: number;
        data: Project[];
      }> = await api.get(`/api/projects/getpaginatedprojects/${limit}/${page}`);
      setProjects(result.data.data);
      setTotal(result.data.total);
    } catch (error) {
      handleComponentError(error);
    }
  };

  const navigateToOneProject = (id?: number): void => {
    navigate("/dashboard/oneproject", { state: { id } });
  };

  const navigateToCreateAProject = (): void => {
    navigate("/dashboard/createproject");
  };

  const navigateSomeWhere = (unSlachedPath: string, id?: number): void => {
    navigate(`/dashboard/${unSlachedPath}`, id ? { state: { id } } : undefined);
  };

  React.useEffect(() => {
    handleFetchProjects();
  }, [trigg, page]);
  // ────────────────────────────────────────────────────────────────────────

  return (
    <Box className="pl-wrap">

      {/* ── Header ── */}
      <Box className="pl-header">
        <Box>
          <div className="pl-tag">Portfolio</div>
          <Typography className="pl-title">Projects</Typography>
          <Typography className="pl-subtitle">
            {total} project{total !== 1 ? "s" : ""} in your portfolio
          </Typography>
        </Box>
        <Button
          className="pl-add-btn"
          onClick={navigateToCreateAProject}
          disableElevation
        >
          + Create Project
        </Button>
      </Box>

      <div className="pl-divider" />

      {/* ── Table ── */}
      <TableContainer className="pl-table-container">
        <Table>
          <TableHead>
            <TableRow className="pl-thead-row">
              {arrayOfColumns.map((col, index) => (
                <TableCell key={index} className="pl-thead-cell">
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {projects.map((project, index) => (
              <TableRow key={index} className="pl-tbody-row">

                <TableCell className="pl-tbody-cell">
                  <span className="pl-id-badge">#{project.id}</span>
                </TableCell>

                <TableCell
                  className="pl-tbody-cell pl-name-cell"
                  onClick={() => navigateToOneProject(project.id)}
                >
                  {project.projectName}
                </TableCell>

                <TableCell className="pl-tbody-cell">
                  <span className="pl-category-badge">{project.category}</span>
                </TableCell>

                <TableCell className="pl-tbody-cell">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton
                      className="pl-edit-btn"
                      title="Modify"
                      onClick={() => navigateSomeWhere("updateproject", project.id)}
                    >
                      <EditIcon />
                    </IconButton>
                    <DeleteProject id={project.id} setTrigg={setTrigg} />
                  </Box>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ── Pagination ── */}
      <Box className="pl-pagination-wrap">
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

export default ProjectList;