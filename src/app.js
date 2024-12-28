const express = require("express");
require("dotenv").config();
const router = require("./routes/index");
const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 5001;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (_, res) => {
  const filePath = path.join(__dirname, "../dist/index.html");

  fs.readFile(filePath, "utf8", (err, html) => {
    if (err) {
      console.error("Error reading HTML file:", err);
      return res.status(500).send("Internal Server Error");
    }

    const injectedHtml = html
      .replaceAll("BUSINESS_NAME", process.env.BUSINESS_NAME)
      .replace(
        `<div id="business-link-placeholder"></div>`,
        `<script>const businessLink = "${process.env.GOOGLE_REVIEW_REDIRECT_LINK}";</script>`
      );

    return res.send(injectedHtml);
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
