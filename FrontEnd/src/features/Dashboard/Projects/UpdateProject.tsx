import React, { useEffect } from "react";
import { useLocation, useNavigate, type Location } from "react-router";
import type { Project } from "../../../Types/Project.ts";
import type { AxiosResponse } from "axios";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import {
  Box,
  Button,
  Typography,
  FormControl,
  Input,
  InputLabel,
  TextField,
  Switch,
  IconButton,
} from "@mui/material";
import {
  generateData,
  generateFromDataFromRefObject,
  handleInputChangeIntoARefObject,
} from "../../../Helpers/FieldVerifier.ts";
import { Add, Close, UploadFile } from "@mui/icons-material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { handleSuccess } from "../../../Helpers/Sweetalert.ts";
import { api } from "../../../ApiService/ApiBrain.ts";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "update-project-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=DM+Serif+Display:ital@0;1&display=swap');

    /* ── Wrapper ── */
    .up-wrap {
      padding: 32px 28px;
      font-family: 'DM Sans', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    /* ── Inner col ── */
    .up-col {
      width: 100%;
      max-width: 660px;
      display: flex;
      flex-direction: column;
    }

    /* ── Back button ── */
    .up-back-btn {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      color: #818cf8;
      background: rgba(99,102,241,0.08);
      border: 1px solid rgba(99,102,241,0.28);
      border-radius: 999px;
      padding: 6px 16px;
      cursor: pointer;
      margin-bottom: 28px;
      align-self: flex-start;
      transition: color 0.2s ease, border-color 0.2s ease,
                  background 0.2s ease, transform 0.2s ease;
    }
    .up-back-btn:hover {
      color: #a5b4fc;
      border-color: rgba(99,102,241,0.5);
      background: rgba(99,102,241,0.14);
      transform: translateX(-3px);
    }

    /* ── Card ── */
    .up-card {
      border-radius: 20px;
      background: rgba(255,255,255,0.032);
      border: 1px solid rgba(255,255,255,0.07);
      overflow: hidden;
      position: relative;
    }
    .up-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(99,102,241,0.06) 0%, transparent 60%);
      pointer-events: none;
    }

    /* ── Card header ── */
    .up-card-header {
      padding: 28px 32px 24px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      position: relative;
      z-index: 1;
    }
    .up-pill-tag {
      display: inline-block;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.68rem;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #818cf8;
      background: rgba(99,102,241,0.12);
      border: 1px solid rgba(99,102,241,0.25);
      border-radius: 999px;
      padding: 3px 12px;
      margin-bottom: 14px;
    }
    .up-title {
      font-family: 'DM Serif Display', Georgia, serif !important;
      font-size: 1.7rem !important;
      font-weight: 400 !important;
      color: #f1f5f9 !important;
      letter-spacing: -0.01em !important;
      line-height: 1.2 !important;
      margin-bottom: 6px !important;
    }
    .up-subtitle {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.85rem !important;
      color: rgba(255,255,255,0.32) !important;
    }

    /* ── Form body ── */
    .up-form-body {
      padding: 28px 32px 32px;
      position: relative;
      z-index: 1;
    }

    /* ── Section label ── */
    .up-section-label {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.68rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.12em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.22) !important;
      margin-bottom: 16px !important;
    }

    /* ── Current value row ── */
    .up-current-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }
    .up-current-label {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.68rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.2);
      flex-shrink: 0;
    }
    .up-current-value {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.82rem !important;
      color: rgba(99,102,241,0.7) !important;
      font-weight: 600 !important;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* ── Field label ── */
    .up-label {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.78rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.08em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.45) !important;
    }
    .up-label.Mui-focused {
      color: #818cf8 !important;
    }

    /* ── Input underline ── */
    .up-input input {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.92rem !important;
      color: rgba(255,255,255,0.82) !important;
      padding-bottom: 8px !important;
    }
    .up-input::before {
      border-bottom-color: rgba(255,255,255,0.1) !important;
    }
    .up-input::after {
      border-bottom-color: #818cf8 !important;
    }
    .up-input:hover::before {
      border-bottom-color: rgba(255,255,255,0.22) !important;
    }

    /* ── Multiline textarea ── */
    .up-textarea .MuiOutlinedInput-root {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.92rem !important;
      color: rgba(255,255,255,0.82) !important;
      background: rgba(255,255,255,0.025) !important;
      border-radius: 12px !important;
    }
    .up-textarea .MuiOutlinedInput-root fieldset {
      border-color: rgba(255,255,255,0.1) !important;
      transition: border-color 0.2s ease;
    }
    .up-textarea .MuiOutlinedInput-root:hover fieldset {
      border-color: rgba(255,255,255,0.22) !important;
    }
    .up-textarea .MuiOutlinedInput-root.Mui-focused fieldset {
      border-color: #818cf8 !important;
      box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
    }
    .up-textarea .MuiInputLabel-root {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.78rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.08em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.45) !important;
    }
    .up-textarea .MuiInputLabel-root.Mui-focused {
      color: #818cf8 !important;
    }

    /* ── Divider ── */
    .up-divider {
      height: 1px;
      background: rgba(255,255,255,0.07);
      margin: 20px 0;
    }

    /* ── Published toggle row ── */
    .up-toggle-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 18px;
      border-radius: 12px;
      background: rgba(255,255,255,0.025);
      border: 1px solid rgba(255,255,255,0.07);
    }
    .up-toggle-label {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.88rem !important;
      font-weight: 600 !important;
      color: rgba(255,255,255,0.65) !important;
    }
    .up-toggle-status {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.72rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.1em !important;
      text-transform: uppercase !important;
    }
    .up-toggle-status.published {
      color: #4ade80 !important;
    }
    .up-toggle-status.unpublished {
      color: rgba(255,255,255,0.25) !important;
    }

    /* ── Switch override ── */
    .up-toggle-row .MuiSwitch-switchBase.Mui-checked {
      color: #818cf8 !important;
    }
    .up-toggle-row .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track {
      background-color: #6366f1 !important;
    }

    /* ── Upload button ── */
    .up-upload-btn {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.78rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.07em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.65) !important;
      border: 1px solid rgba(255,255,255,0.12) !important;
      border-radius: 999px !important;
      padding: 7px 20px !important;
      transition: border-color 0.2s, color 0.2s, background 0.2s !important;
    }
    .up-upload-btn:hover {
      border-color: rgba(255,255,255,0.3) !important;
      color: #fff !important;
      background: rgba(255,255,255,0.06) !important;
    }

    /* ── Tech stack input row ── */
    .up-techstack-input-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 14px;
    }
    .up-add-tech-field .MuiOutlinedInput-root {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.88rem !important;
      color: rgba(255,255,255,0.82) !important;
      background: rgba(255,255,255,0.025) !important;
      border-radius: 12px !important;
    }
    .up-add-tech-field .MuiOutlinedInput-root fieldset {
      border-color: rgba(255,255,255,0.1) !important;
    }
    .up-add-tech-field .MuiOutlinedInput-root:hover fieldset {
      border-color: rgba(255,255,255,0.22) !important;
    }
    .up-add-tech-field .MuiOutlinedInput-root.Mui-focused fieldset {
      border-color: #818cf8 !important;
    }
    .up-add-tech-field .MuiInputLabel-root {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.78rem !important;
      color: rgba(255,255,255,0.35) !important;
    }
    .up-add-tech-field .MuiInputLabel-root.Mui-focused {
      color: #818cf8 !important;
    }

    /* ── Add icon button ── */
    .up-add-btn {
      width: 38px !important;
      height: 38px !important;
      border-radius: 10px !important;
      background: rgba(99,102,241,0.15) !important;
      border: 1px solid rgba(99,102,241,0.3) !important;
      color: #818cf8 !important;
      flex-shrink: 0;
      transition: background 0.2s ease, border-color 0.2s ease,
                  transform 0.2s ease, box-shadow 0.2s ease !important;
    }
    .up-add-btn:hover {
      background: rgba(99,102,241,0.25) !important;
      border-color: rgba(99,102,241,0.5) !important;
      transform: scale(1.08) !important;
      box-shadow: 0 0 14px rgba(99,102,241,0.25) !important;
    }
    .up-add-btn svg {
      font-size: 1rem !important;
    }

    /* ── Tech chips row ── */
    .up-chips-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .up-tech-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.06em;
      color: #818cf8;
      background: rgba(99,102,241,0.1);
      border: 1px solid rgba(99,102,241,0.25);
      border-radius: 8px;
      padding: 4px 10px 4px 12px;
      transition: background 0.18s ease, border-color 0.18s ease;
    }
    .up-tech-chip:hover {
      background: rgba(99,102,241,0.18);
      border-color: rgba(99,102,241,0.45);
    }
    .up-chip-delete {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      border-radius: 4px;
      cursor: pointer;
      color: rgba(255,255,255,0.3);
      transition: color 0.18s ease, background 0.18s ease;
    }
    .up-chip-delete:hover {
      color: #f87171;
      background: rgba(248,113,113,0.12);
    }
    .up-chip-delete svg {
      font-size: 0.7rem !important;
    }

    /* ── Submit button ── */
    .up-submit {
      font-family: 'DM Sans', sans-serif !important;
      font-weight: 600 !important;
      font-size: 0.88rem !important;
      letter-spacing: 0.06em !important;
      text-transform: uppercase !important;
      background: linear-gradient(135deg, #6366f1, #818cf8) !important;
      color: #fff !important;
      border-radius: 999px !important;
      padding: 13px 40px !important;
      box-shadow: 0 6px 28px rgba(99,102,241,0.38) !important;
      border: none !important;
      margin-top: 8px !important;
      align-self: flex-start !important;
      transition: transform 0.2s ease, box-shadow 0.2s ease !important;
    }
    .up-submit:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 10px 36px rgba(99,102,241,0.52) !important;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Component ──────────────────────────────────────────────────────────── */
type Props = {};

function UpdateProject({}: Props) {
  useEffect(() => { injectStyles(); }, []);

  // ── Logic untouched ──────────────────────────────────────────────────────
  const location: Location<{ id?: number }> = useLocation();
  const navigate = useNavigate();
  const id: number | undefined = location.state.id;
  const [projectToEdit, setProjectToEdit] = React.useState<Project | null>(null);
  const [trigg, setTrigg] = React.useState<boolean>(false);
  const data = React.useRef<Partial<Project>>({});
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [addedTechStak, setAddedTechStack] = React.useState<string>("");

  const fetchTheProjectToEdit: () => Promise<void> = async () => {
    try {
      const response: AxiosResponse<Project> = await api.get(`/api/projects/${id}`);
      setProjectToEdit(response.data);
    } catch (error) {
      handleComponentError(error);
    }
  };

  const applyChanges: () => Promise<void> = async () => {
    try {
      await api.put(
        `/api/projects/${id}`,
        data.current.file
          ? generateFromDataFromRefObject(data).append("publicId", projectToEdit?.publicId as string)
          : { ...generateData(data.current), publicId: projectToEdit?.publicId }
      );
      handleSuccess("Success", "The Project has been updated");
      setTrigg(!trigg);
    } catch (error) {
      handleComponentError(error);
    }
  };

  const handleToggleChange: () => void = () => {
    data.current.published = !projectToEdit?.published;
    setProjectToEdit((state) =>
      state ? { ...state, published: !state?.published } : null
    );
  };

  const handleDeletedChip: (value: string) => void = (value) => {
    const filterFunc: (proj: Project) => string[] = (proj) => {
      const stack: string[] = proj.techStack.filter((val) => val !== value);
      data.current.techStack = stack;
      return stack;
    };
    setProjectToEdit((state) =>
      state ? { ...state, techStack: filterFunc(state) } : null
    );
  };

  const handleAddingTechStackElement: () => void = () => {
    data.current.techStack = projectToEdit?.techStack;
    data.current.techStack?.push(addedTechStak);
    setProjectToEdit((state) =>
      state ? { ...state, techStack: data.current.techStack ?? [] } : null
    );
    setAddedTechStack("");
  };

  const handleButtonClick = () => { fileInputRef.current?.click(); };

  const handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddingTechStackElement();
    }
  };

  React.useEffect(() => {
    fetchTheProjectToEdit();
    data.current.publicId = projectToEdit?.publicId;
  }, [trigg]);
  // ────────────────────────────────────────────────────────────────────────

  return (
    <Box className="up-wrap">
      <Box className="up-col">

        {/* ── Back button ── */}
        <button
          className="up-back-btn"
          onClick={() => navigate("/dashboard/projectlist")}
        >
          <ArrowBackRoundedIcon sx={{ fontSize: "0.9rem" }} />
          Back to Projects
        </button>

        {/* ── Card ── */}
        <Box className="up-card">

          {/* Header */}
          <Box className="up-card-header">
            <div className="up-pill-tag">Edit Project</div>
            <Typography className="up-title">Update Project</Typography>
            <Typography className="up-subtitle">
              Leave fields empty to keep their current values.
            </Typography>
          </Box>

          {/* Form */}
          <Box
            className="up-form-body"
            display="flex"
            flexDirection="column"
            gap={2.5}
          >
            <Typography className="up-section-label">Basic Info</Typography>

            {/* Project Name */}
            <Box>
              <Box className="up-current-row">
                <span className="up-current-label">Current</span>
                <Typography className="up-current-value">
                  {projectToEdit?.projectName}
                </Typography>
              </Box>
              <FormControl fullWidth>
                <InputLabel className="up-label">Project Name</InputLabel>
                <Input
                  className="up-input"
                  onChange={(e) =>
                    handleInputChangeIntoARefObject(data, e, "projectName")
                  }
                />
              </FormControl>
            </Box>

            {/* Description */}
            <Box>
              <Box className="up-current-row">
                <span className="up-current-label">Current</span>
                <Typography className="up-current-value">
                  {projectToEdit?.description}
                </Typography>
              </Box>
              <FormControl fullWidth>
                <TextField
                  className="up-textarea"
                  label="Description"
                  onChange={(e) =>
                    handleInputChangeIntoARefObject(data, e, "description")
                  }
                />
              </FormControl>
            </Box>

            <div className="up-divider" />
            <Typography className="up-section-label">Links</Typography>

            {/* Live URL */}
            <Box>
              <Box className="up-current-row">
                <span className="up-current-label">Current</span>
                <Typography className="up-current-value">
                  {projectToEdit?.liveUrl}
                </Typography>
              </Box>
              <FormControl fullWidth>
                <InputLabel className="up-label">Live URL</InputLabel>
                <Input
                  className="up-input"
                  onChange={(e) =>
                    handleInputChangeIntoARefObject(data, e, "liveUrl")
                  }
                />
              </FormControl>
            </Box>

            {/* GitHub URL */}
            <Box>
              <Box className="up-current-row">
                <span className="up-current-label">Current</span>
                <Typography className="up-current-value">
                  {projectToEdit?.githubUrl}
                </Typography>
              </Box>
              <FormControl fullWidth>
                <InputLabel className="up-label">GitHub Repository</InputLabel>
                <Input
                  className="up-input"
                  onChange={(e) =>
                    handleInputChangeIntoARefObject(data, e, "githubUrl")
                  }
                />
              </FormControl>
            </Box>

            <div className="up-divider" />
            <Typography className="up-section-label">Settings</Typography>

            {/* Published toggle */}
            <Box className="up-toggle-row">
              <Box>
                <Typography className="up-toggle-label">Visibility</Typography>
                <Typography
                  className={`up-toggle-status ${
                    projectToEdit?.published ? "published" : "unpublished"
                  }`}
                >
                  {projectToEdit?.published ? "Published" : "Unpublished"}
                </Typography>
              </Box>
              <Switch
                checked={projectToEdit?.published}
                value={projectToEdit?.published}
                onChange={handleToggleChange}
                slotProps={{ input: { "aria-label": "controlled" } }}
              />
            </Box>

            {/* File upload */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={(e) => handleInputChangeIntoARefObject(data, e, "file")}
            />
            <Box>
              <Button
                className="up-upload-btn"
                startIcon={<UploadFile sx={{ fontSize: "0.9rem !important" }} />}
                onClick={handleButtonClick}
                disableElevation
              >
                Replace Preview Image
              </Button>
            </Box>

            <div className="up-divider" />
            <Typography className="up-section-label">Tech Stack</Typography>

            {/* Add tech input */}
            <Box className="up-techstack-input-row">
              <TextField
                className="up-add-tech-field"
                label="Add Technology"
                variant="outlined"
                size="small"
                value={addedTechStak}
                onChange={(e) => setAddedTechStack(e.target.value)}
                onKeyDown={handleKeyDown}
                sx={{ flexGrow: 1 }}
              />
              <IconButton
                className="up-add-btn"
                onClick={handleAddingTechStackElement}
              >
                <Add />
              </IconButton>
            </Box>

            {/* Tech chips */}
            <Box className="up-chips-row">
              {projectToEdit?.techStack.map((val, index) => (
                <span key={index} className="up-tech-chip">
                  {val}
                  <span
                    className="up-chip-delete"
                    onClick={() => handleDeletedChip(val)}
                  >
                    <Close fontSize="small" />
                  </span>
                </span>
              ))}
            </Box>

            {/* Submit */}
            <Button
              className="up-submit"
              onClick={applyChanges}
              variant="contained"
              disableElevation
            >
              Save Changes
            </Button>

          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default UpdateProject;