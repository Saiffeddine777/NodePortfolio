import React from "react";
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
} from "@mui/material";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import DeleteTicket from "./DeleteTicket.tsx";
import { useNavigate, type NavigateFunction } from "react-router";

type Props = {};

const arrayOfColumns = [
  "Issue Key",
  "Summary",
  "Type",
  "Status",
  "Project",
  "Reporter",
  "Created",
  "Actions",
];

const issueTypeColorMap: Record<string, { bg: string; color: string }> = {
  Bug: { bg: "#fee2e2", color: "#dc2626" },
  Task: { bg: "#e0e7ff", color: "#4338ca" },
  Story: { bg: "#dcfce7", color: "#15803d" },
  Epic: { bg: "#f3e8ff", color: "#7c3aed" },
  Subtask: { bg: "#e0f2fe", color: "#0369a1" },
};

const statusColorMap: Record<string, { bg: string; color: string }> = {
  "To Do": { bg: "#f1f5f9", color: "#475569" },
  "In Progress": { bg: "#fef9c3", color: "#a16207" },
  Done: { bg: "#dcfce7", color: "#15803d" },
};

const getChipStyle = (
  map: Record<string, { bg: string; color: string }>,
  key: string,
) => map[key] ?? { bg: "#f1f5f9", color: "#475569" };

function TicketsList({}: Props) {
  const [tickets, setTickets] = React.useState<Ticket[]>([]);
  const [trigg, setTrigg] = React.useState<boolean>(false);

  const navigate: NavigateFunction = useNavigate();
  const handleNavigationToOneTicket = (id: string) => {
    navigate("/dashboard/oneticket", { state: { id } });
  };

  const handleFetchTickets: () => Promise<void> = async () => {
    try {
      const result: AxiosResponse<Ticket[]> = await api.get(
        `/api/tickets/getjiratickets`,
      );
      setTickets(result.data);
    } catch (error) {
      handleComponentError(error);
    }
  };

  React.useEffect(() => {
    handleFetchTickets();
  }, [trigg]);

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: "2rem",
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Tickets
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {tickets.length} ticket{tickets.length !== 1 ? "s" : ""} found
          </Typography>
        </Box>

        <Tooltip title="Refresh">
          <IconButton
            onClick={handleFetchTickets}
            size="small"
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <RefreshRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 2, overflow: "hidden" }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "grey.100" }}>
              {arrayOfColumns.map((col, i) => (
                <TableCell key={i} sx={{ fontWeight: "bold" }}>
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {tickets.map((ticket, index) => {
              const typeStyle = getChipStyle(
                issueTypeColorMap,
                ticket.issueType,
              );
              const statusStyle = getChipStyle(statusColorMap, ticket.status);
              const initials =
                `${ticket.user?.firstName?.[0] ?? ""}${ticket.user?.lastName?.[0] ?? ""}`.toUpperCase();

              return (
                <TableRow
                  key={index}
                  sx={{ "&:hover": { backgroundColor: "grey.50" } }}
                >
                  {/* Issue Key */}
                  <TableCell
                   sx={{"&:hover":{
                    cursor:"pointer"
                   }}}
                   onClick={()=>handleNavigationToOneTicket(ticket.id)}
                  >
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{ fontFamily: "monospace", color: "text.secondary" }}
                    >
                      {ticket.issueKey}
                    </Typography>
                  </TableCell>

                  {/* Summary */}
                  <TableCell sx={{ maxWidth: 220 }}>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      noWrap
                      title={ticket.description}
                    >
                      {ticket.description}
                    </Typography>
                    {ticket.summary && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                        title={ticket.summary}
                        sx={{ display: "block" }}
                      >
                        {ticket.summary}
                      </Typography>
                    )}
                  </TableCell>

                  {/* Issue Type */}
                  <TableCell>
                    <Chip
                      label={ticket.issueType}
                      size="small"
                      sx={{
                        bgcolor: typeStyle.bg,
                        color: typeStyle.color,
                        fontWeight: 600,
                        fontSize: "0.7rem",
                        borderRadius: 1.5,
                        textTransform: "capitalize",
                      }}
                    />
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Chip
                      label={ticket.status}
                      size="small"
                      sx={{
                        bgcolor: statusStyle.bg,
                        color: statusStyle.color,
                        fontWeight: 600,
                        fontSize: "0.7rem",
                        borderRadius: 1.5,
                      }}
                    />
                  </TableCell>

                  {/* Project Key */}
                  <TableCell>
                    <Chip
                      label={ticket.projectKey}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontSize: "0.7rem",
                        borderRadius: 1.5,
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>

                  {/* Reporter */}
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar
                        src={ticket.user?.imageUrl as string}
                        alt={ticket.user?.firstName as string}
                        sx={{ width: 28, height: 28, fontSize: "0.7rem" }}
                      >
                        {initials}
                      </Avatar>
                      <Typography variant="body2" noWrap>
                        {ticket.user?.firstName} {ticket.user?.lastName}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Created At */}
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(ticket.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </Typography>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <Tooltip title="Open in Jira">
                      <IconButton
                        size="small"
                        component="a"
                        href={ticket.issueUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ color: "text.disabled" }}
                      >
                        <OpenInNewRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <DeleteTicket id={ticket.id} setTrigg={setTrigg} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Empty state */}
        {tickets.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
            <Typography variant="h6" fontWeight={500}>
              No tickets found
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              Create your first issue from the Jira Projects page
            </Typography>
          </Box>
        )}
      </TableContainer>
    </Box>
  );
}

export default TicketsList;
