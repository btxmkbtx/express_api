const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

app.use(
  express.urlencoded({
    extended: false,
  })
);

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const router76 = require("./api/76_get_post");
const router77 = require("./api/77_upload");
const router78 = require("./api/78_send_file");
const router99 = require("./api/99_auth");
app.use(router76, router77, router78, router99);

app.listen(3006, function () {
  console.log("http://localhost:3006");
});
