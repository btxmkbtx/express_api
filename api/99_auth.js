const express = require("express");
const router = express.Router();

// 定义 POST 接口
// ACCESS token get
router.post("/oauth2/token", (req, res) => {
  console.log("###access token query by session id:", req.body["session_id"]);
  // 调用 res.send() 方法，向客户端响应结果
  if (req.body["session_id"] === "2F44CD779DEFFDC747EAEF7CB800B419") {
    res.send({
      access_token: "access_token_xxxxxxxx",
      refresh_token: "refresh_token_yyyyyyyy",
    });
  } else {
    res.status(401).send({ code: "aaa", message: "bbb" }); // access token refresh test
  }
});

// REFRESH token
router.post("/oauth2/refresh", (req, res) => {
  // console.log("###refresh header access:", req.headers["x-access-token"]);

  const body = req.body;
  console.log("###refresh body access:", body);
  const { refresh_token, access_token } = body;
  // 调用 res.send() 方法，向客户端响应结果
  if (
    refresh_token === "refresh_token_yyyyyyyy" &&
    (access_token === "xxx" || access_token === "access_token_xxxxxxxx")
    // req.headers["x-access-token"] === "xxx"
  ) {
    res.send({
      access_token: "access_token_xxxxxxxx",
      refresh_token: "refresh_token_yyyyyyyy",
    });
  } else {
    res.status(401).send({ code: "aaa", message: "bbb" }); // access token refresh test
  }
});

module.exports = router;
