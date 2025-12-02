import { useEffect, useState } from "react";
import { CircularProgress, Box, Typography } from "@mui/material";

export default function CircularProgressWithLabel({ value }: { value: number }) {
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

  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress
        variant="determinate"
        value={animatedValue}
        size={60}
        thickness={5}
        sx={{
          color: animatedValue > 70 ? "#4caf50" : animatedValue > 40 ? "#ffb300" : "#f44336",
          transition: "color 0.7s ease-in-out",
        }}
      />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(animatedValue)}%`}
        </Typography>
      </Box>
    </Box>
  );
}
