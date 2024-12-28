const express = require("express");
require("dotenv").config();
const router = require("./routes/index");
const path = require("path");

const PORT = process.env.PORT || 5001;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res, next) => {
  if (!req.query.business_link) {
    return res.redirect(
      301,
      `?business_link=${encodeURIComponent(
        process.env.GOOGLE_REVIEW_REDIRECT_LINK
      )}`
    );
  }

  // Serve the index.html when the query parameter is present
  const filePath = path.join(__dirname, "../dist/index.html");

  return res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error serving index.html:", err);
      res.status(500).send("Internal Server Error");
    }
  });
});

app.use(express.static(path.join(__dirname, "../dist")));

app.use(router);

app.get("*", (req, res) => {
  const filePath = path.join(__dirname, "../dist/404.html");
  res.status(404).sendFile(filePath, (err) => {
    if (err) {
      console.error("Error serving 404.html:", err);
      res.status(500).send("Internal Server Error");
    }
  });
});

app.listen(PORT, () => {
  console.log(`[server]: Server running on http://localhost:${PORT}`);
});
