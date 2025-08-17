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
  返回1个 视频 的文件流（支持多文件和Range请求）
  前端实现参考：https://github.com/btxmkbtx/next14_storybook8_init/blob/main/app/video/page.tsx
*/
router.get("/api/preview/video", (req, res) => {
  console.log("/api/preview/video", req.query.file);
  const fileName = req.query.file || "IMG_1336.MOV"; // 支持通过query参数指定文件
  const filePath = path.join(process.cwd(), "public", "video", fileName);

  // 指定文件根路径
  const videoDir = path.join(process.cwd(), "public", "video");
  // 安全检查：防止路径遍历攻击
  if (!filePath.startsWith(videoDir)) {
    return res.status(400).json({ error: "Invalid file path" });
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Video file not found" });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;
  const ext = path.extname(fileName).toLowerCase();

  // 动态设置 Content-Type
  let contentType = "video/mp4";
  if (ext === ".mov") contentType = "video/quicktime";
  else if (ext === ".webm") contentType = "video/webm";
  else if (ext === ".avi") contentType = "video/x-msvideo";
  else if (ext === ".mkv") contentType = "video/x-matroska";

  if (range) {
    // 这部分代码未经过测试，暂时不可信，实际测试表明返回整个文件也不影响拖拽
    // 客户端请求了部分内容（支持视频拖拽播放）
    // const parts = range.replace(/bytes=/, "").split("-");
    // const start = parseInt(parts[0], 10);
    // const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    // const chunkSize = end - start + 1;
    // res.writeHead(206, {
    //   "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    //   "Accept-Ranges": "bytes",
    //   "Content-Length": chunkSize,
    //   "Content-Type": contentType,
    //   "Cache-Control": "public, max-age=3600",
    // });
    // const stream = fs.createReadStream(filePath, { start, end });
    // stream.pipe(res);
  } else {
    // 客户端没有 Range 请求，返回整个文件
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": contentType,
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=3600",
    });

    fs.createReadStream(filePath).pipe(res);
  }
});

/* 
  返回多个视频文件的列表和元信息（推荐方案）
  客户端可根据列表按需请求单个视频流
  前端实现参考：https://github.com/btxmkbtx/next14_storybook8_init/blob/main/app/videos/page.tsx
*/
router.get("/api/preview/videos", (req, res) => {
  console.log("/api/preview/videos");
  const videoDir = path.join(process.cwd(), "public", "video");
  const fileNames = ["IMG_1336.MOV", "IMG_1337.mp4"]; // 基于实际文件
  const existing = fileNames.filter((f) =>
    fs.existsSync(path.join(videoDir, f))
  );

  if (!existing.length) {
    res.status(404).json({ message: "No video files found" });
    return;
  }

  const videoList = existing.map((name) => {
    const filePath = path.join(videoDir, name);
    const stat = fs.statSync(filePath);
    const ext = path.extname(name).toLowerCase();

    // 根据文件扩展名设置 MIME 类型
    let mimeType = "video/mp4";
    if (ext === ".mov") mimeType = "video/quicktime";
    else if (ext === ".webm") mimeType = "video/webm";
    else if (ext === ".avi") mimeType = "video/x-msvideo";
    else if (ext === ".mkv") mimeType = "video/x-matroska";

    return {
      fileName: name,
      size: stat.size,
      mimeType,
      sizeFormatted: formatFileSize(stat.size),
      lastModified: stat.mtime.toISOString(),
    };
  });

  res.json({
    total: videoList.length,
    videos: videoList,
  });
});

// 工具函数：格式化文件大小
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

module.exports = router;
