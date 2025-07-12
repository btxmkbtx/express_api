const { format, addDays } = require("date-fns");
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

/**
 *画像アップロードテスト用
 */
// 设置Multer存储配置
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/";
    // 创建uploads目录（如果不存在）
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
// 使用Multer中间件
const upload = multer({ storage: storage });
// 定义文件上传路由
router.post("/api/orderers/order-img", upload.single("image"), (req, res) => {
  console.log("/api/orderers/upload/single:", req.headers["x-access-token"]);
  setTimeout(() => {
    // 文件信息保存在req.file中
    const file = req.file;
    if (!file) {
      return res.status(400).send("No file uploaded.");
    }
    // if (file.size > 1024 * 1024) {
    //   return res.status(400).send("File size over.");
    // }
    console.log("Uploaded file:", file);
    if (file.originalname === "error1.jpg") {
      return res.status(400).send("File error.");
    }

    // 发送响应
    res.status(200).json({
      img_name: file.originalname,
    });
  }, 2000);
});

module.exports = router;
