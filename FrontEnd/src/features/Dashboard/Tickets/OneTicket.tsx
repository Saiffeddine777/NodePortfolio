import React from "react";
import { api } from "../../../ApiService/ApiBrain.ts";
import { useLocation, type Location, useNavigate } from "react-router";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import type { Ticket } from "../../../Types/JiraProjects.ts";
import type { AxiosResponse } from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  Skeleton,
  Button,
  Stack,
  Collapse,
  Badge,
  CircularProgress
} from "@mui/material";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import { MuiTextEditor } from "../../Components/MuiEditor.tsx";
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import ReplyIcon from '@mui/icons-material/Reply';
import { handleSuccess } from "../../../Helpers/Sweetalert.ts";
type Props = {};

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
  "Done": { bg: "#dcfce7", color: "#15803d" },
};

const getChipStyle = (
  map: Record<string, { bg: string; color: string }>,
  key: string,
) => map[key] ?? { bg: "#f1f5f9", color: "#475569" };

const MetaRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
    <Typography
      variant="body2"
      color="text.secondary"
      fontWeight={500}
      sx={{ minWidth: 110 }}
    >
      {label}
    </Typography>
    <Box sx={{ flex: 1 }}>{children}</Box>
  </Box>
);

const OneTicket = ({}: Props) => {
  const location: Location<{ id: string }> = useLocation();
  const navigate = useNavigate();
  const [ticket, setTicket] = React.useState<Partial<Ticket>>({});
  const [trigg , setTrigger ] =React.useState<boolean>(false)
  const [responseEmail , setResponseEmail] = React.useState<string>("")
  const [textEditor , setTextEditor ] =React.useState<boolean>(false);
  const [loading, setLoading] = React.useState(true);
  const [loadingSubmit, setLoadingSubmit] = React.useState<boolean>(false);
  const [emailsOpen, setEmailsOpen] = React.useState(false);

  const makeTextEditorVisible = ()=>{
    setTextEditor(!textEditor)
  }

  const handleFetchingTicket: () => Promise<void> = async () => {
    try {
      const result: AxiosResponse<Ticket> = await api.get(
        `/api/tickets/getonejiraticket/${location.state.id}`, 
      );
      setTicket(result.data);
    } catch (error) {
      handleComponentError(error);
    } finally {
      setLoading(false);
    }
  };




  const submitResponse : ()=>Promise<void> = async ()=>{
     try {
      setLoadingSubmit(true)
      const result : AxiosResponse = await api.put(`/api/tickets/solvejiraticket/${location.state.id}`,{
        status :"Done",
        jiraID: ticket.jiraID,
        responseEmail,
        user: ticket.user,
        description : ticket.description
      })
      
      handleSuccess("Success",result.data.message);
     } catch (error) {
      handleComponentError(error);
     }finally{
      setTrigger(!trigg);
      setLoadingSubmit(false);
      setResponseEmail("");
      setTextEditor(false);
    }
     
  }

  React.useEffect(() => {
    handleFetchingTicket();
  }, [trigg]);

   console.log(ticket)

  const t = ticket as Ticket;
  const typeStyle = getChipStyle(issueTypeColorMap, t.issueType);
  const statusStyle = getChipStyle(statusColorMap, t.status);
  const initials =
    `${t.user?.firstName?.[0] ?? ""}${t.user?.lastName?.[0] ?? ""}`.toUpperCase();
  const emailCount = t.emails?.length ?? 0;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 780, mx: "auto" }}>
      {/* Back + Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Tooltip title="Back">
          <IconButton
            size="small"
            onClick={() => navigate(-1)}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <ArrowBackRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        {loading ? (
          <Skeleton width={160} height={32} />
        ) : (
          <Typography variant="h5" fontWeight={600}>
            {t.issueKey}
          </Typography>
        )}
      </Box>

      {loading ? (
        <Skeleton
          variant="text"
          width={240}
          height={20}
          sx={{ mb: 4, ml: 0.5 }}
        />
      ) : (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 4, ml: 0.5 }}
        >
          {t.projectKey} · Ticket detail
        </Typography>
      )}

      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardContent
          sx={{ display: "flex", flexDirection: "column", gap: 2.5, p: 3 }}
        >
          {/* Summary + Jira link */}
          {loading ? (
            <Skeleton width="70%" height={28} />
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{ lineHeight: 1.3 }}
              >
                {t.description}
              </Typography>
              <Tooltip title="Open in Jira">
                <IconButton
                  size="small"
                  component="a"
                  href={t.issueUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: "text.disabled", flexShrink: 0 }}
                >
                  <OpenInNewRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )}

          <Divider />

          {/* Meta grid */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.8 }}>
            <MetaRow label="Status">
              {loading ? (
                <Skeleton width={80} height={24} />
              ) : (
                <Chip
                  label={t.status}
                  size="small"
                  sx={{
                    bgcolor: statusStyle.bg,
                    color: statusStyle.color,
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    borderRadius: 1.5,
                  }}
                />
              )}
            </MetaRow>

            <MetaRow label="Issue Type">
              {loading ? (
                <Skeleton width={80} height={24} />
              ) : (
                <Chip
                  label={t.issueType}
                  size="small"
                  sx={{
                    bgcolor: typeStyle.bg,
                    color: typeStyle.color,
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    borderRadius: 1.5,
                  }}
                />
              )}
            </MetaRow>

            <MetaRow label="Project">
              {loading ? (
                <Skeleton width={80} height={24} />
              ) : (
                <Chip
                  label={t.projectKey}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: "0.7rem",
                    borderRadius: 1.5,
                    fontWeight: 600,
                  }}
                />
              )}
            </MetaRow>

            <MetaRow label="Ticket ID">
              {loading ? (
                <Skeleton width={200} height={28} />
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    bgcolor: "#0f172a",
                    color: "#e2e8f0",
                    px: 1.5,
                    py: 0.6,
                    borderRadius: 2,
                    fontFamily: "monospace",
                    fontSize: "0.75rem",
                    maxWidth: "100%",
                    overflow: "hidden",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: "inherit",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      flex: 1,
                    }}
                  >
                    {t.id}
                  </Typography>
                  <Tooltip title="Copy ID">
                    <IconButton
                      size="small"
                      onClick={() => navigator.clipboard.writeText(t.id)}
                      sx={{ color: "#94a3b8" }}
                    >
                      <ContentCopyRoundedIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </MetaRow>

            <MetaRow label="Priority">
              {loading ? (
                <Skeleton width={80} height={20} />
              ) : (
                <Typography
                  variant="body2"
                  color={t.priority ? "text.primary" : "text.disabled"}
                >
                  {t.priority ?? "Not set"}
                </Typography>
              )}
            </MetaRow>

            <MetaRow label="Assignee">
              {loading ? (
                <Skeleton width={80} height={20} />
              ) : (
                <Typography
                  variant="body2"
                  color={t.assigneeName ? "text.primary" : "text.disabled"}
                >
                  {t.assigneeName ?? "Unassigned"}
                </Typography>
              )}
            </MetaRow>

            <MetaRow label="Reporter">
              {loading ? (
                <Skeleton width={160} height={28} />
              ) : t.user ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar
                    src={t.user?.imageUrl as string}
                    alt={t.user?.firstName as string}
                    sx={{ width: 28, height: 28, fontSize: "0.7rem" }}
                  >
                    {initials}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {t.user?.firstName} {t.user?.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t.user?.email}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.disabled">
                  Unknown
                </Typography>
              )}
            </MetaRow>

            <MetaRow label="Created">
              {loading ? (
                <Skeleton width={120} height={20} />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {new Date(t.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </Typography>
              )}
            </MetaRow>

            <MetaRow label="Updated">
              {loading ? (
                <Skeleton width={120} height={20} />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {new Date(t.updatedAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </Typography>
              )}
            </MetaRow>
          </Box>

          <Divider />

          {/* Summary text */}
          <Box>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
              Summary
            </Typography>
            {loading ? (
              <>
                <Skeleton width="100%" height={20} />
                <Skeleton width="80%" height={20} />
              </>
            ) : (
              <Typography
                variant="body2"
                color={t.summary ? "text.primary" : "text.disabled"}
                sx={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}
              >
                {t.summary ?? "No summary provided."}
              </Typography>
            )}
          </Box>

          <Divider />

          {/* ── Email Exchange ─────────────────────────────── */}
          <Box>
            <Button
              size="small"
              variant={emailsOpen ? "contained" : "outlined"}
              disabled={loading || emailCount === 0}
              onClick={() => setEmailsOpen((prev) => !prev)}
              startIcon={
                <Badge
                  badgeContent={emailCount}
                  color="primary"
                  invisible={emailsOpen}
                >
                  <MailOutlineRoundedIcon fontSize="small" />
                </Badge>
              }
              endIcon={
                emailsOpen ? (
                  <ExpandLessRoundedIcon fontSize="small" />
                ) : (
                  <ExpandMoreRoundedIcon fontSize="small" />
                )
              }
              sx={{
                fontSize: "0.75rem",
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                py: 0.7,
                boxShadow: "none",
                "&:hover": { boxShadow: "none" },
              }}
            >
              {emailCount === 0
                ? "No emails"
                : `${emailCount} email${emailCount !== 1 ? "s" : ""}`}
            </Button>

            <Collapse in={emailsOpen}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                  mt: 2,
                }}
              >
                {t.emails?.map((email) => (
                  <Card
                    key={email.id}
                    variant="outlined"
                    sx={{ borderRadius: 2, bgcolor: "grey.50" }}
                  >
                    <CardContent sx={{ p: "12px 16px !important" }}>
                      {/* Email header */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ lineHeight: 1.3 }}
                          >
                            {email.subject}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            From{" "}
                            <Box
                              component="span"
                              sx={{ fontWeight: 600, color: "text.primary" }}
                            >
                              {email.fromName}
                            </Box>
                            {" · "}
                            {email.fromEmail}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            gap: 0.5,
                            flexShrink: 0,
                          }}
                        >
                          <Chip
                            label={email.isRead ? "Read" : "Unread"}
                            size="small"
                            sx={{
                              fontSize: "0.65rem",
                              borderRadius: 1.5,
                              fontWeight: 600,
                              bgcolor: email.isRead ? "#f1f5f9" : "#e0f2fe",
                              color: email.isRead ? "#475569" : "#0369a1",
                            }}
                          />
                          <Typography variant="caption" color="text.disabled">
                            {new Date(email.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 1 }} />

                      {/* Email body */}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}
                      >
                        {email.body}
                      </Typography>
                    </CardContent>
                    
                  </Card>
                ))}
              </Box>
              <Box 
              sx={{
                marginTop: "1%",
                marginBottom: "1%",
              }}>
              {textEditor&& <MuiTextEditor onChange={setResponseEmail} />}
              </Box>

              <Stack 
                direction="row" 
                spacing={2} 
                justifyContent="flex-end" 
                sx={{ mt: 2, mb: 1, px: 1 }}
              >
                {/* Primary Action: Solve/Send */}
                {responseEmail !== "" && (
                  <Button
                    variant="contained"
                    color="success"
                    size="medium"
                    disabled={loadingSubmit}
                    startIcon={loadingSubmit ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
                    sx={{
                      borderRadius: '10px',
                      textTransform: "none",
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)',
                      '&:hover': {
                        boxShadow: '0 6px 16px rgba(46, 125, 50, 0.3)',
                      }
                    }}
                    onClick={submitResponse}
                  >
                    {loadingSubmit ? "Solving..." : "Solve"}
                  </Button>
                )}

                {/* Toggle Action: Respond/Cancel */}
                <Button
                  variant={textEditor ? "outlined" : "contained"}
                  color={textEditor ? "error" : "primary"}
                  size="medium"
                  startIcon={textEditor ? <CloseIcon /> : <ReplyIcon />}
                  onClick={makeTextEditorVisible}
                  sx={{
                    borderRadius: '10px',
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3,
                    // Transition for smooth color switching
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  {textEditor ? 'Cancel' : 'Respond'}
                </Button>
              </Stack>
              
            </Collapse>
          </Box>

          <Divider />

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              component="a"
              href={t.issueUrl}
              target="_blank"
              rel="noopener noreferrer"
              disabled={loading}
              sx={{
                fontSize: "0.75rem",
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                py: 0.9,
                boxShadow: "none",
                "&:hover": { boxShadow: "none", bgcolor: "primary.dark" },
              }}
            >
              Open in Jira
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate(-1)}
              sx={{
                fontSize: "0.75rem",
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                py: 0.9,
                borderColor: "primary.main",
                color: "primary.main",
                "&:hover": {
                  bgcolor: "action.hover",
                  borderColor: "primary.dark",
                },
              }}
            >
              Back
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OneTicket;
