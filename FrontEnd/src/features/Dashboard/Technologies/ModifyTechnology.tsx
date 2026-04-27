import {
  Box,
  Button,
  Typography,
  FormControl,
  Input,
  InputLabel,
  Select,
  FormHelperText,
  MenuItem,
} from "@mui/material";
import type { AxiosResponse } from "axios";
import React, { useEffect } from "react";
import { useLocation, useNavigate, type Location } from "react-router";
import { TechType, type Technology } from "../../../Types/Technology.ts";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import {
  generateData,
  generateFromDataFromRefObject,
  handleInputChangeIntoARefObject,
} from "../../../Helpers/FieldVerifier.ts";
import { handleSuccess } from "../../../Helpers/Sweetalert.ts";
import { api } from "../../../ApiService/ApiBrain.ts";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "modify-technology-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=DM+Serif+Display:ital@0;1&display=swap');

    /* ── Wrapper ── */
    .mt-wrap {
      padding: 32px 28px;
      font-family: 'DM Sans', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    /* ── Inner col ── */
    .mt-col {
      width: 100%;
      max-width: 560px;
      display: flex;
      flex-direction: column;
    }

    /* ── Back button ── */
    .mt-back-btn {
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
    .mt-back-btn:hover {
      color: #a5b4fc;
      border-color: rgba(99,102,241,0.5);
      background: rgba(99,102,241,0.14);
      transform: translateX(-3px);
    }

    /* ── Card ── */
    .mt-card {
      border-radius: 20px;
      background: rgba(255,255,255,0.032);
      border: 1px solid rgba(255,255,255,0.07);
      overflow: hidden;
      position: relative;
    }
    .mt-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(99,102,241,0.06) 0%, transparent 60%);
      pointer-events: none;
    }

    /* ── Card header ── */
    .mt-card-header {
      padding: 28px 32px 24px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      position: relative;
      z-index: 1;
    }
    .mt-tag {
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
    .mt-title {
      font-family: 'DM Serif Display', Georgia, serif !important;
      font-size: 1.7rem !important;
      font-weight: 400 !important;
      color: #f1f5f9 !important;
      letter-spacing: -0.01em !important;
      line-height: 1.2 !important;
      margin-bottom: 6px !important;
    }
    .mt-subtitle {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.85rem !important;
      color: rgba(255,255,255,0.32) !important;
    }

    /* ── Form body ── */
    .mt-form-body {
      padding: 28px 32px 32px;
      position: relative;
      z-index: 1;
    }

    /* ── Section label ── */
    .mt-section-label {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.68rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.12em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.22) !important;
      margin-bottom: 16px !important;
    }

    /* ── Field label ── */
    .mt-label {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.78rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.08em !important;
      text-transform: uppercase !important;
      color: rgba(255,255,255,0.45) !important;
    }
    .mt-label.Mui-focused {
      color: #818cf8 !important;
    }

    /* ── Input underline ── */
    .mt-input input {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.92rem !important;
      color: rgba(255,255,255,0.82) !important;
      padding-bottom: 8px !important;
    }
    .mt-input::before {
      border-bottom-color: rgba(255,255,255,0.1) !important;
    }
    .mt-input::after {
      border-bottom-color: #818cf8 !important;
    }
    .mt-input:hover::before {
      border-bottom-color: rgba(255,255,255,0.22) !important;
    }

    /* ── Helper text (current value) ── */
    .mt-helper {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.72rem !important;
      color: rgba(255,255,255,0.22) !important;
      margin-top: 4px !important;
    }
    .mt-helper span {
      color: rgba(99,102,241,0.7);
      font-weight: 600;
    }

    /* ── Select ── */
    .mt-select {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.92rem !important;
      color: rgba(255,255,255,0.82) !important;
    }
    .mt-select .MuiOutlinedInput-notchedOutline {
      border-color: rgba(255,255,255,0.1) !important;
    }
    .mt-select:hover .MuiOutlinedInput-notchedOutline {
      border-color: rgba(255,255,255,0.22) !important;
    }
    .mt-select.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: #818cf8 !important;
    }
    .mt-select .MuiSvgIcon-root {
      color: rgba(255,255,255,0.35) !important;
    }

    /* ── Menu items ── */
    .mt-menu-item {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.88rem !important;
    }

    /* ── File input ── */
    .mt-file-input input[type="file"] {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.82rem !important;
      color: rgba(255,255,255,0.45) !important;
    }

    /* ── Divider ── */
    .mt-divider {
      height: 1px;
      background: rgba(255,255,255,0.07);
      margin: 20px 0;
    }

    /* ── Submit button ── */
    .mt-submit {
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
    .mt-submit:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 10px 36px rgba(99,102,241,0.52) !important;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Component ──────────────────────────────────────────────────────────── */
type Props = {};

function ModifyTechnology({}: Props) {
  useEffect(() => { injectStyles(); }, []);

  // ── Logic untouched ──────────────────────────────────────────────────────
  const location: Location<{ id?: number }> = useLocation();
  const navigte = useNavigate();
  const [trigg, setTrigg] = React.useState<boolean>(false);
  const [tech, setTech] = React.useState<Technology | null>(null);
  const techRef = React.useRef<Partial<Technology>>({});

  const arrayOftechTypes: TechType[] = [
    TechType.BACKEND,
    TechType.DATABASE,
    TechType.FRONTEND,
    TechType.INFRASTRUCTURE,
    TechType.LANGUAGE,
    TechType.TOOLS,
  ];

  const handleFetchOnetech: () => Promise<void> = async () => {
    try {
      const result: AxiosResponse<Technology> = await api.get(
        `/api/technologies/${location.state.id}`
      );
      setTech(result.data);
    } catch (error) {
      handleComponentError(error);
    }
  };

  const handleSubmit: () => Promise<void> = async () => {
    try {
      const formData = generateFromDataFromRefObject({
        current: generateData(techRef.current),
      });
      await api.put(`/api/technologies/${location.state.id}`, formData);
      setTrigg(!trigg);
      handleSuccess("Modifiying tech", "Technologi modified Sccessfully");
    } catch (error) {
      handleComponentError(error);
    }
  };

  const navigateBackToTechnologies: () => void = () => {
    navigte("/dashboard/technologies");
  };

  React.useEffect(() => {
    handleFetchOnetech();
  }, [trigg]);
  // ────────────────────────────────────────────────────────────────────────

  return (
    <Box className="mt-wrap">
      <Box className="mt-col">

        {/* ── Back button ── */}
        <button className="mt-back-btn" onClick={navigateBackToTechnologies}>
          <ArrowBackRoundedIcon sx={{ fontSize: "0.9rem" }} />
          Back to Technologies
        </button>

        {/* ── Card ── */}
        <Box className="mt-card">

          {/* Header */}
          <Box className="mt-card-header">
            <div className="mt-tag">Edit Stack</div>
            <Typography className="mt-title">Modify Technology</Typography>
            <Typography className="mt-subtitle">
              Leave fields empty to keep the current values.
            </Typography>
          </Box>

          {/* Form */}
          <Box
            className="mt-form-body"
            display="flex"
            flexDirection="column"
            gap={2.5}
          >
            <Typography className="mt-section-label">Details</Typography>

            {/* Name */}
            <FormControl fullWidth>
              <InputLabel className="mt-label">Technology Name</InputLabel>
              <Input
                className="mt-input"
                onChange={(e) =>
                  handleInputChangeIntoARefObject(techRef, e, "name")
                }
              />
              <FormHelperText className="mt-helper">
                Current: <span>{tech?.name}</span>
              </FormHelperText>
            </FormControl>

            {/* Score */}
            <FormControl fullWidth>
              <InputLabel className="mt-label">Score</InputLabel>
              <Input
                className="mt-input"
                onChange={(e) =>
                  handleInputChangeIntoARefObject(techRef, e, "score")
                }
              />
              <FormHelperText className="mt-helper">
                Current: <span>{tech?.score}</span>
              </FormHelperText>
            </FormControl>

            {/* Type */}
            <FormControl fullWidth>
              <InputLabel className="mt-label" id="tech-type-label">
                Technology Type
              </InputLabel>
              <Select
                labelId="tech-type-label"
                className="mt-select"
                value={tech?.technologyType ?? ""}
                label="Technology Type"
                onChange={(e) =>
                  handleInputChangeIntoARefObject(techRef, e, "technologyType")
                }
              >
                {arrayOftechTypes.map((element, index) => (
                  <MenuItem key={index} value={element} className="mt-menu-item">
                    {element}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <div className="mt-divider" />

            <Typography className="mt-section-label">Logo</Typography>

            {/* File */}
            <FormControl fullWidth>
              <Input
                className="mt-file-input"
                type="file"
                onChange={(e) =>
                  handleInputChangeIntoARefObject(techRef, e, "file")
                }
              />
              <FormHelperText className="mt-helper">
                Upload a new logo to replace the current one.
              </FormHelperText>
            </FormControl>

            <Button
              className="mt-submit"
              onClick={handleSubmit}
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

export default ModifyTechnology;