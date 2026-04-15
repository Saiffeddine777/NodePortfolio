import React from "react";
import { useLocation, useNavigate, type Location, type NavigateFunction } from "react-router";
import { handleComponentError } from "../../Helpers/ErrorHandler.ts";
import type { AxiosResponse } from "axios";
import { api } from "../../ApiService/ApiBrain.ts";
import { handleSuccess } from "../../Helpers/Sweetalert.ts";
import type { JiraIssue } from "../../Types/JiraProjects.ts";
import { useAppSelector } from "../../app/Hooks.ts";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";
import BugReportRoundedIcon from "@mui/icons-material/BugReportRounded";
import { handleInputChangeIntoARefObject } from "../../Helpers/FieldVerifier.ts";
import BackToHome from "../HomeComponents/BackToHome.tsx";

type Props = {};

const ISSUE_TYPES = ["Bug", "Task", "Story", "Epic", "Subtask"];

const issueTypeColorMap: Record<string, { bg: string; color: string }> = {
  Bug: { bg: "#fee2e2", color: "#dc2626" },
  Task: { bg: "#e0e7ff", color: "#4338ca" },
  Story: { bg: "#dcfce7", color: "#15803d" },
  Epic: { bg: "#f3e8ff", color: "#7c3aed" },
  Subtask: { bg: "#e0f2fe", color: "#0369a1" },
};

function CreateAnIssue({}: Props) {
  const authenticatedUser = useAppSelector((state) => state.userAuth.authUser);
  const location: Location<{ key: string }> = useLocation();
  const key = location.state.key;
  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectedType, setSelectedType] = React.useState<string>("");
  const navigate :NavigateFunction = useNavigate()

  const issueRef = React.useRef<JiraIssue>({
    userId: authenticatedUser?.id,
    keyProject: key,
    summary: "",
    description: "",
    name: "",
  });

  const handlePostAnIssue: () => Promise<void> = async () => {
    setLoading(true);

    console.log(issueRef.current)
    try {
      const issueResult: AxiosResponse = await api.post(
        `/api/tickets/createjiraticket`,
        issueRef.current,
      );
      if (issueResult.data.message) {
        handleSuccess("Success", issueResult.data.message);
      }
    } catch (error) {
      handleComponentError(error);
    } finally {
      setLoading(false);
      navigate("/");
      
    }
  };
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 600, mx: "auto" }}>
      <BackToHome/>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
          <BugReportRoundedIcon sx={{ color: "text.disabled", fontSize: 20 }} />
          <Typography variant="h5" fontWeight={600}>
            Create an Issue
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Filing against project{" "}
          <Chip
            label={key}
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: "0.7rem",
              borderRadius: 1.5,
              bgcolor: "#e0e7ff",
              color: "#4338ca",
              verticalAlign: "middle",
              ml: 0.5,
            }}
          />
        </Typography>
      </Box>

      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardContent
          sx={{ display: "flex", flexDirection: "column", gap: 2.5, p: 3 }}
        >
          {/* Issue Type */}
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: "0.875rem" }}>Issue Type</InputLabel>
            <Select
              label="Issue Type"
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                handleInputChangeIntoARefObject(issueRef, e as any, "name");
              }}
              sx={{ borderRadius: 2, fontSize: "0.875rem" }}
              renderValue={(value) => {
                const style = issueTypeColorMap[value];
                return (
                  <Chip
                    label={value}
                    size="small"
                    sx={{
                      bgcolor: style?.bg,
                      color: style?.color,
                      fontWeight: 600,
                      fontSize: "0.7rem",
                      borderRadius: 1.5,
                    }}
                  />
                );
              }}
            >
              {ISSUE_TYPES.map((type) => {
                const style = issueTypeColorMap[type];
                return (
                  <MenuItem
                    key={type}
                    value={type}
                    sx={{ fontSize: "0.875rem" }}
                  >
                    <Chip
                      label={type}
                      size="small"
                      sx={{
                        bgcolor: style?.bg,
                        color: style?.color,
                        fontWeight: 600,
                        fontSize: "0.7rem",
                        borderRadius: 1.5,
                        pointerEvents: "none",
                      }}
                    />
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <Divider />

          {/* Summary */}
          <TextField
            label="Description"
            placeholder="e.g. Submit button unresponsive on sign-in page"
            fullWidth
            size="small"
            onChange={(e) =>
              handleInputChangeIntoARefObject(issueRef, e, "description")
            }
          />

          {/* Description */}
          <TextField
            label="Summary"
            placeholder="Steps to reproduce, expected vs actual behavior, environment details…"
            multiline
            rows={5}
            fullWidth
            size="small"
            onChange={(e) =>
              handleInputChangeIntoARefObject(issueRef, e, "summary")
            }
            InputProps={{ sx: { borderRadius: 2, fontSize: "0.875rem" } }}
            InputLabelProps={{ sx: { fontSize: "0.875rem" } }}
          />

          <Divider />

          {/* Actions */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              fullWidth
              disabled={loading}
              onClick={handlePostAnIssue}
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
              {loading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress
                    size={14}
                    thickness={5}
                    sx={{ color: "inherit" }}
                  />
                  Submitting…
                </Box>
              ) : (
                "Submit Issue"
              )}
            </Button>
            <Button
              variant="outlined"
              fullWidth
              disabled={loading}
              onClick={() => window.history.back()}
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
              Cancel
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default CreateAnIssue;
