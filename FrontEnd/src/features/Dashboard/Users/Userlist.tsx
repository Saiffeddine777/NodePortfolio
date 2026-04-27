import {
  Box,
  Button,
  IconButton,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { AxiosResponse } from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import type { User } from "../../../Types/User.tsx";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import DeleteUser from "./DeleteUser.tsx";
import EditIcon from "@mui/icons-material/Edit";
import { api } from "../../../ApiService/ApiBrain.ts";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "userlist-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=DM+Serif+Display:ital@0;1&display=swap');

    /* ── Wrapper ── */
    .ul-wrap {
      padding: 32px 28px;
      font-family: 'DM Sans', sans-serif;
      height: 100%;
      box-sizing: border-box;
    }

    /* ── Header row ── */
    .ul-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }

    /* ── Heading ── */
    .ul-tag {
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
    .ul-title {
      font-family: 'DM Serif Display', Georgia, serif !important;
      font-size: 1.7rem !important;
      font-weight: 400 !important;
      color: #f1f5f9 !important;
      letter-spacing: -0.01em !important;
      line-height: 1.2 !important;
      margin-bottom: 4px !important;
    }
    .ul-subtitle {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.82rem !important;
      color: rgba(255,255,255,0.28) !important;
    }

    /* ── Add button ── */
    .ul-add-btn {
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
      transition: transform 0.2s ease, box-shadow 0.2s ease !important;
      align-self: flex-start !important;
    }
    .ul-add-btn:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 26px rgba(99,102,241,0.5) !important;
    }

    /* ── Divider ── */
    .ul-divider {
      height: 1px;
      background: rgba(255,255,255,0.07);
      margin: 0 0 24px;
    }

    /* ── Table ── */
    .ul-table-container {
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.07);
    }
    .ul-thead-row {
      background: rgba(255,255,255,0.03) !important;
    }
    .ul-thead-cell {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.68rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.12em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.28) !important;
      border-bottom: 1px solid rgba(255,255,255,0.07) !important;
      padding: 14px 16px !important;
    }
    .ul-tbody-row {
      transition: background 0.18s ease !important;
    }
    .ul-tbody-row:hover {
      background: rgba(99,102,241,0.05) !important;
    }
    .ul-tbody-cell {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.85rem !important;
      color: rgba(255,255,255,0.55) !important;
      border-bottom: 1px solid rgba(255,255,255,0.05) !important;
      padding: 14px 16px !important;
    }
    .ul-tbody-row:last-child .ul-tbody-cell {
      border-bottom: none !important;
    }

    /* ── ID badge ── */
    .ul-id-badge {
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
    .ul-name-cell {
      font-weight: 600 !important;
      color: #818cf8 !important;
      cursor: pointer;
      transition: color 0.18s ease !important;
    }
    .ul-name-cell:hover {
      color: #a5b4fc !important;
    }

    /* ── Edit button ── */
    .ul-edit-btn {
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
    .ul-edit-btn:hover {
      color: #818cf8 !important;
      background: rgba(99,102,241,0.1) !important;
      border-color: rgba(99,102,241,0.35) !important;
      transform: scale(1.1) !important;
      box-shadow: 0 0 14px rgba(99,102,241,0.2) !important;
    }
    .ul-edit-btn svg {
      font-size: 1rem !important;
    }

    /* ── Pagination ── */
    .ul-pagination-wrap {
      display: flex;
      justify-content: center;
      padding-top: 24px;
      padding-bottom: 8px;
    }
    .ul-pagination-wrap .MuiPaginationItem-root {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.8rem !important;
      color: rgba(255,255,255,0.4) !important;
      border: 1px solid rgba(255,255,255,0.08) !important;
      border-radius: 8px !important;
      transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease !important;
    }
    .ul-pagination-wrap .MuiPaginationItem-root:hover {
      background: rgba(99,102,241,0.1) !important;
      border-color: rgba(99,102,241,0.3) !important;
      color: #818cf8 !important;
    }
    .ul-pagination-wrap .Mui-selected {
      background: rgba(99,102,241,0.18) !important;
      border-color: rgba(99,102,241,0.4) !important;
      color: #818cf8 !important;
    }
    .ul-pagination-wrap .Mui-selected:hover {
      background: rgba(99,102,241,0.26) !important;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Component ──────────────────────────────────────────────────────────── */
type Props = {};

const Userlist = ({}: Props) => {
  useEffect(() => { injectStyles(); }, []);

  // ── Logic untouched ──────────────────────────────────────────────────────
  const navigate = useNavigate();
  const [users, setUsers] = React.useState<User[]>([]);
  const [trigg, setTrigg] = React.useState<boolean>(false);
  const [total, setTotal] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(1);
  const limit: number = 6;

  const navigateToCreateAuser = () => {
    navigate("/dashboard/createuser");
  };

  const headTitles: string[] = [
    "ID",
    "First Name",
    "Last Name",
    "Occupation",
    "Actions",
  ];

  const fetchUserList: () => Promise<void> = async () => {
    try {
      const response: AxiosResponse<{
        data: User[];
        page: number;
        lastPage: number;
        total: number;
      }> = await api.get(`/api/users/getpaginatedusers/${limit}/${page}`);
      setUsers(response.data.data);
      setTotal(response.data.total);
    } catch (error) {
      handleComponentError(error);
    }
  };

  const navigateToUserSomething: (path: string, id?: number) => void = (
    path,
    id
  ) => {
    navigate(`/dashboard/${path}`, { state: { id } });
  };

  React.useEffect(() => {
    fetchUserList();
  }, [trigg, page]);
  // ────────────────────────────────────────────────────────────────────────

  return (
    <Box className="ul-wrap">

      {/* ── Header ── */}
      <Box className="ul-header">
        <Box>
          <div className="ul-tag">Team</div>
          <Typography className="ul-title">Users</Typography>
          <Typography className="ul-subtitle">
            {total} user{total !== 1 ? "s" : ""} registered
          </Typography>
        </Box>
        <Button
          className="ul-add-btn"
          onClick={navigateToCreateAuser}
          disableElevation
        >
          + Add User
        </Button>
      </Box>

      <div className="ul-divider" />

      {/* ── Table ── */}
      <TableContainer className="ul-table-container">
        <Table>
          <TableHead>
            <TableRow className="ul-thead-row">
              {headTitles.map((title, index) => (
                <TableCell key={index} className="ul-thead-cell">
                  {title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user) => (
              <TableRow key={user?.id} className="ul-tbody-row">

                <TableCell className="ul-tbody-cell">
                  <span className="ul-id-badge">#{user?.id}</span>
                </TableCell>

                <TableCell
                  className="ul-tbody-cell ul-name-cell"
                  onClick={() => navigateToUserSomething("oneuser", user?.id)}
                >
                  {user.firstName}
                </TableCell>

                <TableCell className="ul-tbody-cell">
                  {user.lastName}
                </TableCell>

                <TableCell className="ul-tbody-cell">
                  {user.occupation}
                </TableCell>

                <TableCell className="ul-tbody-cell">
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <DeleteUser id={user?.id} setTrigg={setTrigg} />
                    <IconButton
                      className="ul-edit-btn"
                      title="Modify"
                      onClick={() =>
                        navigateToUserSomething("modifyuser", user?.id)
                      }
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
      <Box className="ul-pagination-wrap">
        <Pagination
          count={Math.ceil(total / limit)}
          page={page}
          onChange={(_, newPage) => setPage(newPage)}
          color="primary"
        />
      </Box>

    </Box>
  );
};

export default Userlist;