const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();

router.get("/api/preview/pdf", (_, res) => {
  console.log("/api/preview/pdf");
  const filePath = path.join(__dirname, "sample.pdf");

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename=test.pdf`);

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
});

module.exports = router;
