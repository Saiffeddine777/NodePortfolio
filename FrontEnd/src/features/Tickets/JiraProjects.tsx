import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  InputBase,
  IconButton,
  Skeleton,
  Tooltip,
  Divider,
  Button,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import { api } from "../../ApiService/ApiBrain.ts";
import { handleComponentError } from "../../Helpers/ErrorHandler.ts";
import { type JiraProject } from "../../Types/JiraProjects.ts";
import { useNavigate, type NavigateFunction } from "react-router";

type Props = {};

const typeColorMap: Record<string, { bg: string; color: string }> = {
  software: { bg: "#e0e7ff", color: "#4338ca" },
  business: { bg: "#e0f2fe", color: "#0369a1" },
  service_desk: { bg: "#dcfce7", color: "#15803d" },
  ops: { bg: "#fef9c3", color: "#a16207" },
};

const getTypeStyle = (type: string) =>
  typeColorMap[type?.toLowerCase()] ?? { bg: "#f1f5f9", color: "#475569" };

const JiraProjects = ({}: Props) => {
  const [jiraProjects, setJiraProjects] = React.useState<JiraProject[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");

  const navigate :NavigateFunction  = useNavigate()

  const handleNavigateToJiraComponent  : (param :string ,key:string )=>void = (param , key)=>{
    switch (param) {
      case "createanissue":
        navigate("/createanissue" , {state:{key:key}})
        break;
      case "suggestafeature":
        navigate("/suggestafeature" , {state:{key:key}})
        break;
      default:
        break;
    }
  }

  const handleFetchingJiraProjects = async () => {
    setLoading(true);
    try {
      const projects = await api.get(`/api/tickets/getjiraprojects`);
      const data = projects.data;
      console.log(data);
      setJiraProjects(Array.isArray(data) ? data : Object.values(data));
    } catch (error) {
      handleComponentError(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    handleFetchingJiraProjects();
  }, []);

  const filtered = jiraProjects.filter((p) =>
    [p.name, p.key, p.projectTypeKey]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1100, mx: "auto" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Jira Projects
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {loading
              ? "Loading projects..."
              : `${filtered.length} project${filtered.length !== 1 ? "s" : ""} found`}
          </Typography>
        </Box>

        {/* Search + Refresh */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Card
            elevation={1}
            sx={{
              display: "flex",
              alignItems: "center",
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              width: 240,
            }}
          >
            <SearchRoundedIcon
              fontSize="small"
              sx={{ color: "text.disabled", mr: 1 }}
            />
            <InputBase
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ fontSize: "0.875rem", flex: 1 }}
            />
          </Card>
          <Tooltip title="Refresh">
            <IconButton
              onClick={handleFetchingJiraProjects}
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
      </Box>

      {/* Project Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 2.5,
        }}
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} elevation={2} sx={{ borderRadius: 3 }}>
                <CardContent
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Skeleton variant="rounded" width={44} height={44} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton width="70%" height={20} />
                      <Skeleton width="40%" height={16} />
                    </Box>
                  </Box>
                  <Skeleton width="50%" height={24} sx={{ borderRadius: 4 }} />
                </CardContent>
              </Card>
            ))
          : filtered.map((project) => {
              const typeStyle = getTypeStyle(project.projectTypeKey);
              return (
                <Card
                  key={project.id}
                  elevation={3}
                  sx={{
                    borderRadius: 3,
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {/* Avatar + Name row */}
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Avatar
                        src={project.avatarUrls?.["48x48"]}
                        alt={project.name}
                        variant="rounded"
                        sx={{ width: 44, height: 44, borderRadius: 2 }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography fontWeight={600} fontSize="0.95rem" noWrap>
                          {project.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontWeight={500}
                        >
                          {project.key}
                        </Typography>
                      </Box>
                      <Tooltip title="Open in Jira">
                        <IconButton
                          size="small"
                          component="a"
                          href={`https://saiffeddinezouaghi.atlassian.net/jira/software/projects/${project.key}/boards/1`}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ color: "text.disabled" }}
                        >
                          <OpenInNewRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    <Divider />

                    {/* Type + Style chips */}
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
                      <Chip
                        label={project.projectTypeKey}
                        size="small"
                        sx={{
                          bgcolor: typeStyle.bg,
                          color: typeStyle.color,
                          fontWeight: 600,
                          fontSize: "0.7rem",
                          textTransform: "capitalize",
                          borderRadius: 1.5,
                        }}
                      />
                      <Chip
                        label={project.style}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontSize: "0.7rem",
                          borderRadius: 1.5,
                          textTransform: "capitalize",
                        }}
                      />
                      <Tooltip title={project.isPrivate ? "Private" : "Public"}>
                        <Box
                          sx={{
                            ml: "auto",
                            display: "flex",
                            alignItems: "center",
                            color: project.isPrivate
                              ? "warning.main"
                              : "success.main",
                          }}
                        >
                          {project.isPrivate ? (
                            <LockRoundedIcon sx={{ fontSize: 16 }} />
                          ) : (
                            <PublicRoundedIcon sx={{ fontSize: 16 }} />
                          )}
                        </Box>
                      </Tooltip>
                    </Box>

                    {/* Action buttons — full width row */}
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={()=>handleNavigateToJiraComponent("createanissue", project.key)}
                        fullWidth
                        sx={{
                          fontSize: "0.75rem",
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                          py: 0.7,
                          boxShadow: "none",
                          "&:hover": { boxShadow: "none", bgcolor: "primary.dark" },
                        }}
                      >
                        Create an Issue
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        fullWidth
                        onClick={()=>handleNavigateToJiraComponent("suggestafeature", project.key)}
                        sx={{
                          fontSize: "0.75rem",
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                          py: 0.7,
                          borderColor: "primary.main",
                          color: "primary.main",
                          "&:hover": {
                            bgcolor: "action.hover",
                            borderColor: "primary.dark",
                          },
                        }}
                      >
                        Suggest a Feature
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
      </Box>

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
          <Typography variant="h6" fontWeight={500}>
            No projects found
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            Try adjusting your search query
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default JiraProjects;