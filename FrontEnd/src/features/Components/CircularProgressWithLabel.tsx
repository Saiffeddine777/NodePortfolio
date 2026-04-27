import { useEffect, useState } from "react";
import { CircularProgress, Box, Typography } from "@mui/material";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const injectStyles = () => {
  const id = "circular-progress-label-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700&display=swap');

    .cpl-wrap {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    /* Faint dark ring sitting behind the progress arc */
    .cpl-track {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 5px solid rgba(255,255,255,0.06);
      pointer-events: none;
    }

    /* Soft glow halo that pulses behind the arc */
    .cpl-glow {
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      pointer-events: none;
      opacity: 0.35;
      filter: blur(6px);
      transition: background 0.7s ease-in-out;
    }

    .cpl-label {
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.72rem !important;
      font-weight: 700 !important;
      letter-spacing: -0.01em !important;
      color: rgba(255,255,255,0.75) !important;
      line-height: 1 !important;
    }
  `;
  document.head.appendChild(style);
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const getColor = (v: number) =>
  v > 70 ? "#4ade80" : v > 40 ? "#fbbf24" : "#f87171";

const getGlow = (v: number) =>
  v > 70
    ? "radial-gradient(circle, #4ade80, transparent)"
    : v > 40
    ? "radial-gradient(circle, #fbbf24, transparent)"
    : "radial-gradient(circle, #f87171, transparent)";

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function CircularProgressWithLabel({ value }: { value: number }) {
  useEffect(() => { injectStyles(); }, []);

  // ── Logic untouched ──────────────────────────────────────────────────────
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    let start = animatedValue;
    let end = value;
    let duration = 1000;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = start + (end - start) * progress;
      setAnimatedValue(current);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);
  // ────────────────────────────────────────────────────────────────────────

  return (
    <Box className="cpl-wrap" sx={{ width: 56, height: 56 }}>

      {/* Glow halo */}
      <Box
        className="cpl-glow"
        sx={{ background: getGlow(animatedValue) }}
      />

      {/* Track ring */}
      <Box className="cpl-track" />

      {/* Arc */}
      <CircularProgress
        variant="determinate"
        value={animatedValue}
        size={56}
        thickness={4.5}
        sx={{
          color: getColor(animatedValue),
          transition: "color 0.7s ease-in-out",
          "& .MuiCircularProgress-circle": {
            strokeLinecap: "round",
          },
        }}
      />

      {/* Label */}
      <Box
        position="absolute"
        top={0}
        left={0}
        bottom={0}
        right={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography className="cpl-label" component="div">
          {`${Math.round(animatedValue)}%`}
        </Typography>
      </Box>
    </Box>
  );
}