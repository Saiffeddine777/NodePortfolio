import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Button,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from "@mui/material";
import React, { useEffect } from "react";
import { TechType, type Technology } from "../../../Types/Technology.ts";
import {
  generateFromDataFromRefObject,
  handleInputChangeIntoARefObject,
} from "../../../Helpers/FieldVerifier.ts";
import { useNavigate } from "react-router";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import { handleSuccess } from "../../../Helpers/Sweetalert.ts";
import { api } from "../../../ApiService/ApiBrain.ts";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "create-technology-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=DM+Serif+Display:ital@0;1&display=swap');

    /* ── Wrapper ── */
    .ct-wrap {
      padding: 32px 28px;
      font-family: 'DM Sans', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    /* ── Inner col ── */
    .ct-col {
      width: 100%;
      max-width: 560px;
      display: flex;
      flex-direction: column;
    }

    /* ── Back button ── */
    .ct-back-btn {
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
    .ct-back-btn:hover {
      color: #a5b4fc;
      border-color: rgba(99,102,241,0.5);
      background: rgba(99,102,241,0.14);
      transform: translateX(-3px);
    }

    /* ── Card ── */
    .ct-card {
      border-radius: 20px;
      background: rgba(255,255,255,0.032);
      border: 1px solid rgba(255,255,255,0.07);
      overflow: hidden;
      position: relative;
    }
    .ct-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(99,102,241,0.06) 0%, transparent 60%);
      pointer-events: none;
    }

    /* ── Card header ── */
    .ct-card-header {
      padding: 28px 32px 24px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      position: relative;
      z-index: 1;
    }
    .ct-tag {
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
    .ct-title {
      font-family: 'DM Serif Display', Georgia, serif !important;
      font-size: 1.7rem !important;
      font-weight: 400 !important;
      color: #f1f5f9 !important;
      letter-spacing: -0.01em !important;
      line-height: 1.2 !important;
      margin-bottom: 6px !important;
    }
    .ct-subtitle {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.85rem !important;
      color: rgba(255,255,255,0.32) !important;
    }

    /* ── Form body ── */
    .ct-form-body {
      padding: 28px 32px 32px;
      position: relative;
      z-index: 1;
    }

    /* ── Section label ── */
    .ct-section-label {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.68rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.12em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.22) !important;
      margin-bottom: 16px !important;
    }

    /* ── Field label ── */
    .ct-label {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.78rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.08em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.45) !important;
    }
    .ct-label.Mui-focused {
      color: #818cf8 !important;
    }

    /* ── Input ── */
    .ct-input input {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.92rem !important;
      color: rgba(255,255,255,0.82) !important;
      padding-bottom: 8px !important;
    }
    .ct-input::before {
      border-bottom-color: rgba(255,255,255,0.1) !important;
    }
    .ct-input::after {
      border-bottom-color: #818cf8 !important;
    }
    .ct-input:hover::before {
      border-bottom-color: rgba(255,255,255,0.22) !important;
    }

    /* ── Helper ── */
    .ct-helper {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.72rem !important;
      color: rgba(255,255,255,0.22) !important;
      margin-top: 4px !important;
    }

    /* ── Select ── */
    .ct-select {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.92rem !important;
      color: rgba(255,255,255,0.82) !important;
    }
    .ct-select .MuiOutlinedInput-notchedOutline {
      border-color: rgba(255,255,255,0.1) !important;
    }
    .ct-select:hover .MuiOutlinedInput-notchedOutline {
      border-color: rgba(255,255,255,0.22) !important;
    }
    .ct-select.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: #818cf8 !important;
    }
    .ct-select .MuiSvgIcon-root {
      color: rgba(255,255,255,0.35) !important;
    }
    .ct-menu-item {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.88rem !important;
    }

    /* ── File input ── */
    .ct-file-input input[type="file"] {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.82rem !important;
      color: rgba(255,255,255,0.45) !important;
    }

    /* ── Divider ── */
    .ct-divider {
      height: 1px;
      background: rgba(255,255,255,0.07);
      margin: 20px 0;
    }

    /* ── Submit ── */
    .ct-submit {
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
    .ct-submit:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 10px 36px rgba(99,102,241,0.52) !important;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Component ──────────────────────────────────────────────────────────── */
type Props = {};

function CreateTechnology({}: Props) {
  useEffect(() => { injectStyles(); }, []);

  // ── Logic untouched ──────────────────────────────────────────────────────
  const navigate = useNavigate();

  const createdTech = React.useRef<Technology>({
    name: "",
    technologyType: TechType.TOOLS,
    score: 0,
    file: null,
  });

  const [techTypeState, setTechTypeState] = React.useState<TechType>(
    createdTech.current.technologyType
  );

  const handleSelectChangeUI: (e: SelectChangeEvent) => void = (e) => {
    const value = e.target.value as TechType;
    setTechTypeState(value);
  };

  const arrayOftechTypes: TechType[] = [
    TechType.BACKEND,
    TechType.DATABASE,
    TechType.FRONTEND,
    TechType.INFRASTRUCTURE,
    TechType.LANGUAGE,
    TechType.TOOLS,
  ];

  const navigateBackToTechnologies = () => {
    navigate("/dashboard/technologies");
  };

  const handleSubmit: () => Promise<void> = async () => {
    try {
      const result = await api.post(
        `/api/technologies/`,
        generateFromDataFromRefObject(createdTech)
      );
      result &&
        handleSuccess("Inserting the Technology", "Success Inserting Technology");
      navigateBackToTechnologies();
    } catch (error) {
      handleComponentError(error);
    }
  };
  // ────────────────────────────────────────────────────────────────────────

  return (
    <Box className="ct-wrap">
      <Box className="ct-col">

        {/* ── Back button ── */}
        <button className="ct-back-btn" onClick={navigateBackToTechnologies}>
          <ArrowBackRoundedIcon sx={{ fontSize: "0.9rem" }} />
          Back to Technologies
        </button>

        {/* ── Card ── */}
        <Box className="ct-card">

          {/* Header */}
          <Box className="ct-card-header">
            <div className="ct-tag">New Stack</div>
            <Typography className="ct-title">Create Technology</Typography>
            <Typography className="ct-subtitle">
              Add a new skill to your portfolio stack.
            </Typography>
          </Box>

          {/* Form */}
          <Box
            className="ct-form-body"
            display="flex"
            flexDirection="column"
            gap={2.5}
          >
            <Typography className="ct-section-label">Details</Typography>

            {/* Name */}
            <FormControl fullWidth>
              <InputLabel className="ct-label">Technology Name</InputLabel>
              <Input
                className="ct-input"
                onChange={(e) =>
                  handleInputChangeIntoARefObject(createdTech, e, "name")
                }
              />
              <FormHelperText className="ct-helper">Ex: Java</FormHelperText>
            </FormControl>

            {/* Score */}
            <FormControl fullWidth>
              <InputLabel className="ct-label">Score</InputLabel>
              <Input
                className="ct-input"
                type="number"
                onChange={(e) =>
                  handleInputChangeIntoARefObject(createdTech, e, "score")
                }
              />
              <FormHelperText className="ct-helper">0 to 100</FormHelperText>
            </FormControl>

            {/* Type */}
            <FormControl fullWidth>
              <InputLabel className="ct-label" id="ct-type-label">
                Technology Type
              </InputLabel>
              <Select
                labelId="ct-type-label"
                className="ct-select"
                value={techTypeState}
                label="Technology Type"
                onChange={(e) => {
                  handleSelectChangeUI(e);
                  handleInputChangeIntoARefObject(createdTech, e, "technologyType");
                }}
              >
                {arrayOftechTypes.map((element, index) => (
                  <MenuItem key={index} value={element} className="ct-menu-item">
                    {element}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <div className="ct-divider" />

            <Typography className="ct-section-label">Logo</Typography>

            {/* File */}
            <FormControl fullWidth>
              <Input
                className="ct-file-input"
                type="file"
                onChange={(e) =>
                  handleInputChangeIntoARefObject(createdTech, e, "file")
                }
              />
              <FormHelperText className="ct-helper">
                Upload a referencing logo — optional.
              </FormHelperText>
            </FormControl>

            <Button
              className="ct-submit"
              onClick={handleSubmit}
              variant="contained"
              disableElevation
            >
              Submit Technology
            </Button>

          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default CreateTechnology;