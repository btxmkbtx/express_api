const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();

/* 
  返回1个 PDF 的文件流
  前端实现参考：https://github.com/btxmkbtx/next14_storybook8_init/blob/main/app/pdf/page.tsx
*/
router.get("/api/preview/pdf", (_, res) => {
  console.log("/api/preview/pdf");
  const filePath = path.join(process.cwd(), "public", "pdf", "sample.pdf");

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename=test.pdf`);

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
});

/* 
  返回多个 PDF 的文件流（multipart/mixed）
  客户端需解析 multipart 边界并分别读取各部分的二进制内容
  前端实现参考：https://github.com/btxmkbtx/next14_storybook8_init/blob/main/app/pdfs/page.tsx
*/
router.get("/api/preview/pdfs", async (_, res) => {
  console.log("/api/preview/pdfs");
  const pdfDir = path.join(process.cwd(), "public", "pdf");
  const fileNames = ["sample.pdf", "sample01.pdf", "sample02.pdf"]; // 需要返回的 PDF 文件名
  const existing = fileNames.filter((f) => fs.existsSync(path.join(pdfDir, f)));

  if (!existing.length) {
    res.status(404).json({ message: "No pdf files found" });
    return;
  }

  const boundary = "PDFBOUNDARY" + Date.now();
  res.setHeader("Content-Type", `multipart/mixed; boundary=${boundary}`);
  res.setHeader("Cache-Control", "no-cache");

  // 顺序写入每个文件; 使用 Promise 串行，确保边界分隔正确
  for (const name of existing) {
    const filePath = path.join(pdfDir, name);
    try {
      const stat = fs.statSync(filePath);
      res.write(`--${boundary}\r\n`);
      res.write(`Content-Type: application/pdf\r\n`);
      res.write(
        `Content-Disposition: inline; filename="${encodeURIComponent(
          name
        )}"\r\n`
      );
      res.write(`Content-Length: ${stat.size}\r\n`);
      res.write(`\r\n`);

      await new Promise((resolve, reject) => {
        const stream = fs.createReadStream(filePath);
        stream.on("error", reject);
        stream.on("end", () => {
          // 每个 part 结束需要换行，避免粘连
          res.write(`\r\n`);
          resolve();
        });
        stream.pipe(res, { end: false });
      });
    } catch (e) {
      // 如果单个文件出错，写一个错误 part（纯文本）并继续其它文件
      res.write(`--${boundary}\r\n`);
      res.write(`Content-Type: text/plain; charset=utf-8\r\n`);
      res.write(
        `Content-Disposition: inline; filename="error-${encodeURIComponent(
          name
        )}.txt"\r\n`
      );
      const msg = `读取文件 ${name} 失败: ${e.message}`;
      res.write(`Content-Length: ${Buffer.byteLength(msg, "utf-8")}\r\n\r\n`);
      res.write(msg + `\r\n`);
    }
  }

  res.end(`--${boundary}--\r\n`);
});

/* 
  返回1个 视频 的文件流
  前端实现参考：https://github.com/btxmkbtx/next14_storybook8_init/blob/main/app/video/page.tsx
*/
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
