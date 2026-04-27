import React, { useEffect } from "react";
import { api } from "../../../ApiService/ApiBrain.ts";
import type { AxiosResponse } from "axios";
import type { Ticket } from "../../../Types/JiraProjects.ts";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  Typography,
  Tooltip,
  IconButton,
  Pagination,
} from "@mui/material";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import DeleteTicket from "./DeleteTicket.tsx";
import { useNavigate, type NavigateFunction } from "react-router";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "tickets-list-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&family=JetBrains+Mono:wght@500&display=swap');

    .tl-wrap {
      padding: 32px;
      font-family: 'DM Sans', sans-serif;
      max-width: 1400px;
      margin: 0 auto;
    }

    /* ── Header ── */
    .tl-header-title {
      font-family: 'DM Serif Display', serif !important;
      font-size: 2rem !important;
      color: #f1f5f9 !important;
    }
    .tl-refresh-btn {
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      background: rgba(255, 255, 255, 0.03) !important;
      color: rgba(255, 255, 255, 0.6) !important;
      border-radius: 10px !important;
      transition: all 0.2s ease !important;
    }
    .tl-refresh-btn:hover {
      background: rgba(99, 102, 241, 0.1) !important;
      color: #818cf8 !important;
      border-color: #6366f1 !important;
    }

    /* ── Table Container ── */
    .tl-table-container {
      background: rgba(255, 255, 255, 0.02) !important;
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      border-radius: 16px !important;
      margin-top: 24px;
    }

    /* ── Cells & Rows ── */
    .tl-th {
      background: rgba(255, 255, 255, 0.04) !important;
      color: rgba(255, 255, 255, 0.4) !important;
      text-transform: uppercase !important;
      font-size: 0.7rem !important;
      letter-spacing: 0.12em !important;
      font-weight: 700 !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
      padding: 16px !important;
    }
    .tl-td {
      border-bottom: 1px solid rgba(255, 255, 255, 0.04) !important;
      color: rgba(255, 255, 255, 0.8) !important;
      padding: 16px !important;
    }
    .tl-row {
      transition: all 0.2s ease !important;
    }
    .tl-row:hover {
      background: rgba(255, 255, 255, 0.04) !important;
    }

    /* ── Specialized Content ── */
    .tl-issue-key {
      font-family: 'JetBrains Mono', monospace !important;
      color: #818cf8 !important;
      font-weight: 600 !important;
      cursor: pointer;
    }
    .tl-issue-key:hover {
      color: #a5b4fc !important;
      text-decoration: underline;
    }
    .tl-summary-text {
      color: #f1f5f9 !important;
      font-weight: 500 !important;
    }

    /* ── Pagination ── */
    .tl-pagination-box {
      display: flex;
      justify-content: center;
      margin-top: 32px;
    }
    .MuiPaginationItem-root {
      color: rgba(255, 255, 255, 0.5) !important;
      font-family: 'DM Sans', sans-serif !important;
    }
    .MuiPaginationItem-root.Mui-selected {
      background: rgba(99, 102, 241, 0.2) !important;
      color: #818cf8 !important;
      border: 1px solid rgba(99, 102, 241, 0.4) !important;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Color Maps ─────────────────────────────────────────────────────────── */
const issueTypeColorMap: Record<string, { bg: string; color: string }> = {
  Bug: { bg: "rgba(248, 113, 113, 0.15)", color: "#f87171" },
  Task: { bg: "rgba(99, 102, 241, 0.15)", color: "#818cf8" },
  Story: { bg: "rgba(52, 211, 153, 0.15)", color: "#34d399" },
  Epic: { bg: "rgba(167, 139, 250, 0.15)", color: "#a78bfa" },
  Subtask: { bg: "rgba(56, 189, 248, 0.15)", color: "#38bdf8" },
};

const statusColorMap: Record<string, { bg: string; color: string }> = {
  "To Do": { bg: "rgba(148, 163, 184, 0.15)", color: "#94a3b8" },
  "In Progress": { bg: "rgba(251, 191, 36, 0.15)", color: "#fbbf24" },
  Done: { bg: "rgba(16, 185, 129, 0.15)", color: "#10b981" },
};

const getChipStyle = (map: Record<string, { bg: string; color: string }>, key: string) => 
  map[key] ?? { bg: "rgba(255,255,255,0.05)", color: "#94a3b8" };

const arrayOfColumns = ["Issue Key", "Summary", "Type", "Status", "Project", "Reporter", "Created", "Actions"];

function TicketsList() {
  const [tickets, setTickets] = React.useState<Ticket[]>([]);
  const [trigg, setTrigg] = React.useState<boolean>(false);
  const [total, setTotal] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(1);
  const limit: number = 6;

  const navigate: NavigateFunction = useNavigate();

  useEffect(() => { injectStyles(); }, []);

  const handleNavigationToOneTicket = (id: string) => {
    navigate("/dashboard/oneticket", { state: { id } });
  };

  const handleFetchTickets = async () => {
    try {
      const result: AxiosResponse<{
        total: number;
        page: number;
        lastPage: number;
        data: Ticket[];
      }> = await api.get(`/api/tickets/getpaginatedtickets/${limit}/${page}`);
      setTickets(result.data.data);
      setTotal(result.data.total);
    } catch (error) {
      handleComponentError(error);
    }
  };

  React.useEffect(() => {
    handleFetchTickets();
  }, [trigg, page]);

  return (
    <Box className="tl-wrap">
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
        <Box>
          <Typography className="tl-header-title">Ticket Registry</Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.4)", mt: 0.5 }}>
            {total} issues synchronized from Jira
          </Typography>
        </Box>

        <Tooltip title="Sync with Jira">
          <IconButton onClick={handleFetchTickets} className="tl-refresh-btn">
            <RefreshRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} elevation={0} className="tl-table-container">
        <Table>
          <TableHead>
            <TableRow>
              {arrayOfColumns.map((col, i) => (
                <TableCell key={i} className="tl-th">{col}</TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {tickets.map((ticket, index) => {
              const typeStyle = getChipStyle(issueTypeColorMap, ticket.issueType);
              const statusStyle = getChipStyle(statusColorMap, ticket.status);
              const initials = `${ticket.user?.firstName?.[0] ?? ""}${ticket.user?.lastName?.[0] ?? ""}`.toUpperCase();

              return (
                <TableRow key={index} className="tl-row">
                  <TableCell className="tl-td" onClick={() => handleNavigationToOneTicket(ticket.id)}>
                    <Typography className="tl-issue-key">{ticket.issueKey}</Typography>
                  </TableCell>

                  <TableCell className="tl-td" sx={{ maxWidth: 220 }}>
                    <Typography className="tl-summary-text" variant="body2" noWrap title={ticket.description}>
                      {ticket.description}
                    </Typography>
                    {ticket.summary && (
                      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.3)", display: "block" }} noWrap>
                        {ticket.summary}
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell className="tl-td">
                    <Chip
                      label={ticket.issueType}
                      size="small"
                      sx={{ bgcolor: typeStyle.bg, color: typeStyle.color, fontWeight: 700, fontSize: "0.65rem", borderRadius: "6px" }}
                    />
                  </TableCell>

                  <TableCell className="tl-td">
                    <Chip
                      label={ticket.status}
                      size="small"
                      sx={{ bgcolor: statusStyle.bg, color: statusStyle.color, fontWeight: 700, fontSize: "0.65rem", borderRadius: "6px" }}
                    />
                  </TableCell>

                  <TableCell className="tl-td">
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>
                      {ticket.projectKey}
                    </Typography>
                  </TableCell>

                  <TableCell className="tl-td">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar src={ticket.user?.imageUrl as string} sx={{ width: 24, height: 24, fontSize: "0.6rem", bgcolor: "#334155" }}>
                        {initials}
                      </Avatar>
                      <Typography variant="body2" sx={{ color: "#cbd5e1", fontSize: "0.8rem" }}>
                        {ticket.user?.firstName}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell className="tl-td">
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>
                      {new Date(ticket.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                    </Typography>
                  </TableCell>

                  <TableCell className="tl-td">
                    <Box display="flex" gap={1}>
                      <Tooltip title="View in Source">
                        <IconButton
                          size="small"
                          component="a"
                          href={ticket.issueUrl}
                          target="_blank"
                          sx={{ color: "rgba(255,255,255,0.2)", "&:hover": { color: "#fff" } }}
                        >
                          <OpenInNewRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <DeleteTicket id={ticket.id} setTrigg={setTrigg} />
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {tickets.length === 0 && (
          <Box sx={{ textAlign: "center", py: 12 }}>
            <Typography sx={{ color: "rgba(255,255,255,0.2)", fontWeight: 500 }}>
              No tickets currently tracked.
            </Typography>
          </Box>
        )}
      </TableContainer>

      <Box className="tl-pagination-box">
        <Pagination
          count={Math.ceil(total / limit)}
          page={page}
          onChange={(_, newPage) => setPage(newPage)}
          shape="rounded"
        />
      </Box>
    </Box>
  );
}

export default TicketsList;