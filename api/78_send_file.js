const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();

router.get("/api/preview/pdf", (_, res) => {
  console.log("/api/preview/pdf");
  const filePath = path.join(process.cwd(), "public", "pdf", "sample.pdf");

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename=test.pdf`);

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
});

router.get("/api/preview/video", (req, res) => {
  const filePath = path.join(process.cwd(), "public", "video", "IMG_1336.MOV");
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    // 客户端请求了部分内容
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunkSize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      // "Content-Type": "video/mp4", // 如果是 mp4
      "Content-Type": "video/quicktime", // 如果是 MOV
      // "Content-Type": "video/webm", // 如果是 webm
    });

    file.pipe(res);
  } else {
    // 客户端没有 Range 请求，返回整个文件（非流式）
    res.writeHead(200, {
      "Content-Length": fileSize,
      // "Content-Type": "video/mp4", // 如果是 mp4
      "Content-Type": "video/quicktime", // 如果是 MOV
      // "Content-Type": "video/webm", // 如果是 webm
    });

    fs.createReadStream(filePath).pipe(res);
  }
});

module.exports = router;
