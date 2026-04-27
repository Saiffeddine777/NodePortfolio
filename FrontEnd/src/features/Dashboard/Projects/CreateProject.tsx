import React, { useEffect } from "react";
import { ProjectCategory, type Project } from "../../../Types/Project.ts";
import {
  Box,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Button,
  TextField,
  Select,
  MenuItem,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import {
  generateData,
  generateFromDataFromRefObject,
  handleInputChangeIntoARefObject,
} from "../../../Helpers/FieldVerifier.ts";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import { handleSuccess } from "../../../Helpers/Sweetalert.ts";
import { api } from "../../../ApiService/ApiBrain.ts";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useNavigate } from "react-router";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "create-project-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=DM+Serif+Display:ital@0;1&display=swap');

    /* ── Wrapper ── */
    .cp-wrap {
      padding: 32px 28px;
      font-family: 'DM Sans', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    /* ── Inner col ── */
    .cp-col {
      width: 100%;
      max-width: 620px;
      display: flex;
      flex-direction: column;
    }

    /* ── Back button ── */
    .cp-back-btn {
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
    .cp-back-btn:hover {
      color: #a5b4fc;
      border-color: rgba(99,102,241,0.5);
      background: rgba(99,102,241,0.14);
      transform: translateX(-3px);
    }

    /* ── Card ── */
    .cp-card {
      border-radius: 20px;
      background: rgba(255,255,255,0.032);
      border: 1px solid rgba(255,255,255,0.07);
      overflow: hidden;
      position: relative;
    }
    .cp-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(99,102,241,0.06) 0%, transparent 60%);
      pointer-events: none;
    }

    /* ── Card header ── */
    .cp-card-header {
      padding: 28px 32px 24px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      position: relative;
      z-index: 1;
    }
    .cp-tag {
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
    .cp-title {
      font-family: 'DM Serif Display', Georgia, serif !important;
      font-size: 1.7rem !important;
      font-weight: 400 !important;
      color: #f1f5f9 !important;
      letter-spacing: -0.01em !important;
      line-height: 1.2 !important;
      margin-bottom: 6px !important;
    }
    .cp-subtitle {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.85rem !important;
      color: rgba(255,255,255,0.32) !important;
    }

    /* ── Form body ── */
    .cp-form-body {
      padding: 28px 32px 32px;
      position: relative;
      z-index: 1;
    }

    /* ── Section label ── */
    .cp-section-label {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.68rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.12em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.22) !important;
      margin-bottom: 16px !important;
    }

    /* ── Field label ── */
    .cp-label {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.78rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.08em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.45) !important;
    }
    .cp-label.Mui-focused {
      color: #818cf8 !important;
    }

    /* ── Input underline ── */
    .cp-input input {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.92rem !important;
      color: rgba(255,255,255,0.82) !important;
      padding-bottom: 8px !important;
    }
    .cp-input::before {
      border-bottom-color: rgba(255,255,255,0.1) !important;
    }
    .cp-input::after {
      border-bottom-color: #818cf8 !important;
    }
    .cp-input:hover::before {
      border-bottom-color: rgba(255,255,255,0.22) !important;
    }

    /* ── Multiline textarea ── */
    .cp-textarea .MuiOutlinedInput-root {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.92rem !important;
      color: rgba(255,255,255,0.82) !important;
      background: rgba(255,255,255,0.025) !important;
      border-radius: 12px !important;
    }
    .cp-textarea .MuiOutlinedInput-root fieldset {
      border-color: rgba(255,255,255,0.1) !important;
      transition: border-color 0.2s ease;
    }
    .cp-textarea .MuiOutlinedInput-root:hover fieldset {
      border-color: rgba(255,255,255,0.22) !important;
    }
    .cp-textarea .MuiOutlinedInput-root.Mui-focused fieldset {
      border-color: #818cf8 !important;
      box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
    }
    .cp-textarea .MuiInputLabel-root {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.78rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.08em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.45) !important;
    }
    .cp-textarea .MuiInputLabel-root.Mui-focused {
      color: #818cf8 !important;
    }

    /* ── Select ── */
    .cp-select {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.92rem !important;
      color: rgba(255,255,255,0.82) !important;
    }
    .cp-select .MuiOutlinedInput-notchedOutline {
      border-color: rgba(255,255,255,0.1) !important;
    }
    .cp-select:hover .MuiOutlinedInput-notchedOutline {
      border-color: rgba(255,255,255,0.22) !important;
    }
    .cp-select.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: #818cf8 !important;
    }
    .cp-select .MuiSvgIcon-root {
      color: rgba(255,255,255,0.35) !important;
    }
    .cp-menu-item {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.88rem !important;
    }

    /* ── File input ── */
    .cp-file-input input[type="file"] {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.82rem !important;
      color: rgba(255,255,255,0.45) !important;
    }

    /* ── Helper text ── */
    .cp-helper {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.72rem !important;
      color: rgba(255,255,255,0.22) !important;
      margin-top: 4px !important;
    }

    /* ── Divider ── */
    .cp-divider {
      height: 1px;
      background: rgba(255,255,255,0.07);
      margin: 20px 0;
    }

    /* ── Submit ── */
    .cp-submit {
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
    .cp-submit:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 10px 36px rgba(99,102,241,0.52) !important;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Component ──────────────────────────────────────────────────────────── */
type Props = {};

function CreateProject({}: Props) {
  useEffect(() => { injectStyles(); }, []);

  // ── Logic untouched ──────────────────────────────────────────────────────
  const navigate = useNavigate();

  const projectRef = React.useRef<Project>({
    projectName: "",
    githubUrl: "",
    liveUrl: "",
    published: false,
    description: "",
    techStack: [],
    category: ProjectCategory.WEB,
    file: undefined,
  });

  const [projectCategory, setProjectCategory] =
    React.useState<ProjectCategory>(projectRef.current.category);

  const handleChangeProjectCategoryUI: (e: SelectChangeEvent) => void = (e) => {
    const value = e.target.value as ProjectCategory;
    setProjectCategory(value);
  };

  const handlePostProject: () => Promise<void> = async () => {
    try {
      const nonEmpty = generateData(projectRef.current);
      await api.post(
        `/api/projects`,
        nonEmpty.file
          ? generateFromDataFromRefObject({ current: nonEmpty })
          : nonEmpty
      );
      handleSuccess("Project Inserted", "Project has been Successfully Inserted");
    } catch (error) {
      handleComponentError(error);
    }
  };

  const handleTechStackChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void = (e) => {
    const value: string = e.target.value;
    projectRef.current.techStack = value.split(",").map((e) => e.trim());
  };
  // ────────────────────────────────────────────────────────────────────────

  return (
    <Box className="cp-wrap">
      <Box className="cp-col">

        {/* ── Back button ── */}
        <button
          className="cp-back-btn"
          onClick={() => navigate("/dashboard/projectlist")}
        >
          <ArrowBackRoundedIcon sx={{ fontSize: "0.9rem" }} />
          Back to Projects
        </button>

        {/* ── Card ── */}
        <Box className="cp-card">

          {/* Header */}
          <Box className="cp-card-header">
            <div className="cp-tag">New Project</div>
            <Typography className="cp-title">Create Project</Typography>
            <Typography className="cp-subtitle">
              Add a new project to your portfolio.
            </Typography>
          </Box>

          {/* Form */}
          <Box
            className="cp-form-body"
            display="flex"
            flexDirection="column"
            gap={2.5}
          >
            <Typography className="cp-section-label">Basic Info</Typography>

            {/* Name */}
            <FormControl fullWidth>
              <InputLabel className="cp-label">Project Name</InputLabel>
              <Input
                className="cp-input"
                onChange={(e) =>
                  handleInputChangeIntoARefObject(projectRef, e, "projectName")
                }
              />
              <FormHelperText className="cp-helper">
                Example: Developer Portfolio
              </FormHelperText>
            </FormControl>

            {/* Description */}
            <FormControl fullWidth>
              <TextField
                className="cp-textarea"
                multiline
                minRows={3}
                label="Description"
                onChange={(e) =>
                  handleInputChangeIntoARefObject(projectRef, e, "description")
                }
              />
              <FormHelperText className="cp-helper">
                The story behind the project.
              </FormHelperText>
            </FormControl>

            {/* Category */}
            <FormControl fullWidth>
              <InputLabel className="cp-label" id="cp-category-label">
                Category
              </InputLabel>
              <Select
                labelId="cp-category-label"
                className="cp-select"
                value={projectCategory}
                label="Category"
                onChange={(e) => {
                  handleChangeProjectCategoryUI(e);
                  handleInputChangeIntoARefObject(projectRef, e, "category");
                }}
              >
                <MenuItem value={ProjectCategory.WEB} className="cp-menu-item">
                  {ProjectCategory.WEB}
                </MenuItem>
                <MenuItem value={ProjectCategory.API} className="cp-menu-item">
                  {ProjectCategory.API}
                </MenuItem>
                <MenuItem value={ProjectCategory.MOBILE} className="cp-menu-item">
                  {ProjectCategory.MOBILE}
                </MenuItem>
                <MenuItem value={ProjectCategory.OTHER} className="cp-menu-item">
                  {ProjectCategory.OTHER}
                </MenuItem>
              </Select>
              <FormHelperText className="cp-helper">
                What kind of project was this?
              </FormHelperText>
            </FormControl>

            <div className="cp-divider" />

            <Typography className="cp-section-label">Links</Typography>

            {/* GitHub */}
            <FormControl fullWidth>
              <InputLabel className="cp-label">Repository Link</InputLabel>
              <Input
                className="cp-input"
                onChange={(e) =>
                  handleInputChangeIntoARefObject(projectRef, e, "githubUrl")
                }
              />
              <FormHelperText className="cp-helper">
                https://github.com/username/project
              </FormHelperText>
            </FormControl>

            {/* Live URL */}
            <FormControl fullWidth>
              <InputLabel className="cp-label">Live Link</InputLabel>
              <Input
                className="cp-input"
                onChange={(e) =>
                  handleInputChangeIntoARefObject(projectRef, e, "liveUrl")
                }
              />
              <FormHelperText className="cp-helper">
                https://example.com
              </FormHelperText>
            </FormControl>

            <div className="cp-divider" />

            <Typography className="cp-section-label">Stack & Media</Typography>

            {/* Tech stack */}
            <FormControl fullWidth>
              <InputLabel className="cp-label">Tech Stack</InputLabel>
              <Input
                className="cp-input"
                onChange={handleTechStackChange}
              />
              <FormHelperText className="cp-helper">
                Comma-separated — Spring Boot, Java, Angular, PostgreSQL
              </FormHelperText>
            </FormControl>

            {/* File */}
            <FormControl fullWidth>
              <Input
                className="cp-file-input"
                type="file"
                onChange={(e) =>
                  handleInputChangeIntoARefObject(projectRef, e, "file")
                }
              />
              <FormHelperText className="cp-helper">
                Project preview image — optional.
              </FormHelperText>
            </FormControl>

            <Button
              className="cp-submit"
              onClick={handlePostProject}
              variant="contained"
              disableElevation
            >
              Submit Project
            </Button>

          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default CreateProject;