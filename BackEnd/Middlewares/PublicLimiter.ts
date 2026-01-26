import rateLimiter from "express-rate-limit";

export const publicLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
