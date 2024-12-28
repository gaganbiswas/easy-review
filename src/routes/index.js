const { Router } = require("express");
const reviewController = require("../controllers/index");
const rateLimit = require("express-rate-limit");

const reviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2, // Limit each user/IP to 2 review submissions per 15 minutes
  standardHeaders: true, // Send rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

const router = Router();

router.post("/create-review", reviewController.create);

module.exports = router;
