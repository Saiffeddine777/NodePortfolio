import React, { useEffect } from "react";
import type { EmailInterface } from "../../../Types/EmailType.ts";
import type { AxiosResponse } from "axios";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Pagination,
  Box,
} from "@mui/material";
import DeleteEmail from "./DeleteEmail.tsx";
import { useNavigate } from "react-router";
import { api } from "../../../ApiService/ApiBrain.ts";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "email-list-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=DM+Serif+Display:ital@0;1&display=swap');

    /* ── Wrapper ── */
    .el-wrap {
      padding: 32px 28px;
      font-family: 'DM Sans', sans-serif;
      height: 100%;
      box-sizing: border-box;
    }

    /* ── Heading ── */
    .el-tag {
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
    .el-title {
      font-family: 'DM Serif Display', Georgia, serif !important;
      font-size: 1.7rem !important;
      font-weight: 400 !important;
      color: #f1f5f9 !important;
      letter-spacing: -0.01em !important;
      line-height: 1.2 !important;
      margin-bottom: 4px !important;
    }
    .el-subtitle {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.82rem !important;
      color: rgba(255,255,255,0.28) !important;
      margin-bottom: 0 !important;
    }

    /* ── Divider ── */
    .el-divider {
      height: 1px;
      background: rgba(255,255,255,0.07);
      margin: 24px 0;
    }

    /* ── Empty state ── */
    .el-empty {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.9rem !important;
      color: rgba(255,255,255,0.28) !important;
      text-align: center;
      padding: 48px 0 !important;
    }

    /* ── Table ── */
    .el-table-container {
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.07);
    }
    .el-table {
      background: transparent !important;
    }

    /* Head row */
    .el-thead-row {
      background: rgba(255,255,255,0.03) !important;
    }
    .el-thead-cell {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.68rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.12em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.28) !important;
      border-bottom: 1px solid rgba(255,255,255,0.07) !important;
      padding: 14px 16px !important;
    }

    /* Body row */
    .el-tbody-row {
      transition: background 0.18s ease !important;
    }
    .el-tbody-row:hover {
      background: rgba(99,102,241,0.05) !important;
    }
    .el-tbody-cell {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.85rem !important;
      color: rgba(255,255,255,0.55) !important;
      border-bottom: 1px solid rgba(255,255,255,0.05) !important;
      padding: 14px 16px !important;
    }
    .el-tbody-row:last-child .el-tbody-cell {
      border-bottom: none !important;
    }

    /* ID badge */
    .el-id-badge {
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

    /* Clickable name */
    .el-name-cell {
      font-weight: 600 !important;
      color: #818cf8 !important;
      cursor: pointer;
      transition: color 0.18s ease !important;
    }
    .el-name-cell:hover {
      color: #a5b4fc !important;
    }

    /* Subject */
    .el-subject-cell {
      color: rgba(255,255,255,0.65) !important;
    }

    /* ── Pagination ── */
    .el-pagination-wrap {
      display: flex;
      justify-content: center;
      padding-top: 24px;
      padding-bottom: 8px;
    }
    .el-pagination-wrap .MuiPaginationItem-root {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.8rem !important;
      color: rgba(255,255,255,0.4) !important;
      border: 1px solid rgba(255,255,255,0.08) !important;
      border-radius: 8px !important;
      transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease !important;
    }
    .el-pagination-wrap .MuiPaginationItem-root:hover {
      background: rgba(99,102,241,0.1) !important;
      border-color: rgba(99,102,241,0.3) !important;
      color: #818cf8 !important;
    }
    .el-pagination-wrap .Mui-selected {
      background: rgba(99,102,241,0.18) !important;
      border-color: rgba(99,102,241,0.4) !important;
      color: #818cf8 !important;
    }
    .el-pagination-wrap .Mui-selected:hover {
      background: rgba(99,102,241,0.26) !important;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Component ──────────────────────────────────────────────────────────── */
const EmailList = () => {
  useEffect(() => { injectStyles(); }, []);

  // ── Logic untouched ──────────────────────────────────────────────────────
  const navigate = useNavigate();
  const [emails, setEmails] = React.useState<EmailInterface[]>([]);
  const [trigg, setTrigg] = React.useState(false);
  const [total, setTotal] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(1);
  const limit: number = 6;

  const handleFetchEmails = async (): Promise<void> => {
    try {
      const result: AxiosResponse<{
        total: number;
        page: number;
        lastPage: number;
        data: EmailInterface[];
      }> = await api.get(`/api/emails/getpaginatedemails/${limit}/${page}`);
      setEmails(result.data.data);
      setTotal(result.data.total);
    } catch (error) {
      handleComponentError(error);
    }
  };

  const navigateToOneEmail = (id?: number) => {
    navigate("/dashboard/onemail", { state: { id } });
  };

  React.useEffect(() => {
    handleFetchEmails();
  }, [trigg, page]);
  // ────────────────────────────────────────────────────────────────────────

  return (
    <Box className="el-wrap">

      {/* ── Heading ── */}
      <div className="el-tag">Inbox</div>
      <Typography className="el-title">Emails</Typography>
      <Typography className="el-subtitle">
        {total} message{total !== 1 ? "s" : ""} received
      </Typography>

      <div className="el-divider" />

      {/* ── Empty state ── */}
      {emails.length === 0 ? (
        <Typography className="el-empty">No emails found.</Typography>
      ) : (
        <>
          {/* ── Table ── */}
          <TableContainer className="el-table-container">
            <Table className="el-table">

              <TableHead>
                <TableRow className="el-thead-row">
                  <TableCell className="el-thead-cell" width={100}>ID</TableCell>
                  <TableCell className="el-thead-cell">Name</TableCell>
                  <TableCell className="el-thead-cell">Subject</TableCell>
                  <TableCell className="el-thead-cell" align="right" width={100}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {emails.map((email) => (
                  <TableRow key={email.id} className="el-tbody-row">

                    <TableCell className="el-tbody-cell">
                      <span className="el-id-badge">#{email.id}</span>
                    </TableCell>

                    <TableCell
                      className={`el-tbody-cell el-name-cell`}
                      onClick={() => navigateToOneEmail(email.id)}
                    >
                      {email.fromName}
                    </TableCell>

                    <TableCell className={`el-tbody-cell el-subject-cell`}>
                      {email.subject}
                    </TableCell>

                    <TableCell className="el-tbody-cell" align="right">
                      <DeleteEmail id={email.id} setTrigg={setTrigg} />
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>

            </Table>
          </TableContainer>

          {/* ── Pagination ── */}
          <Box className="el-pagination-wrap">
            <Pagination
              count={Math.ceil(total / limit)}
              page={page}
              onChange={(_, newPage) => setPage(newPage)}
              color="primary"
            />
          </Box>
        </>
      )}

    </Box>
  );
};

export default EmailList;