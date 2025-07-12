const express = require("express");
const router = express.Router();

//access token refresh確認
// 都道府県取得
router.get("/api/prefecture", (req, res) => {
  console.log(`GET:/area/prefecture`, req.headers["x-access-token"]);
  const rsp = {
    pref_region: [
      {
        pref_region_cd: "01",
        pref_region_name: "北海道・東北",
        prefectures: [
          {
            pref_cd: "01",
            pref_name: "北海道",
          },
          {
            pref_cd: "02",
            pref_name: "青森県",
          },
          {
            pref_cd: "03",
            pref_name: "岩手県",
          },
          {
            pref_cd: "04",
            pref_name: "宮城県",
          },
          {
            pref_cd: "05",
            pref_name: "秋田県",
          },
          {
            pref_cd: "06",
            pref_name: "山形県",
          },
          {
            pref_cd: "07",
            pref_name: "福島県",
          },
        ],
      },
      {
        pref_region_cd: "02",
        pref_region_name: "関東",
        prefectures: [
          {
            pref_cd: "08",
            pref_name: "茨城県",
          },
          {
            pref_cd: "09",
            pref_name: "栃木県",
          },
          {
            pref_cd: "10",
            pref_name: "群馬県",
          },
          {
            pref_cd: "11",
            pref_name: "埼玉県",
          },
          {
            pref_cd: "12",
            pref_name: "千葉県",
          },
          {
            pref_cd: "13",
            pref_name: "東京都",
          },
          {
            pref_cd: "14",
            pref_name: "神奈川県",
          },
        ],
      },
    ],
  };

  // 调用 res.send() 方法，向客户端响应处理的结果
  setTimeout(() => {
    // throw new Error(); //http 500 test
    // res.send(403, { code: "aaa", message: "bbb" })
    // if (req.headers["x-access-token"] === "access_token_xxxxxxxx") {
    //   res.send(rsp);
    // } else {
    //   res.status(401).send({ code: "aaa", message: "bbb" }); // access token refresh test
    // }
    res.send(rsp);
    // res.send(401, { code: "aaa", message: "bbb" }); // access token refresh test
  }, 200);
});

// 都道府県地域取得
router.get("/api/prefecture-area", (req, res) => {
  console.log(
    `GET:/area/prefecture-area?pref_cd=${req.query.pref_cd}`,
    req.headers["x-access-token"]
  );

  const rsp = {
    prefecture: [
      {
        region_cd: "01",
        pref_cd: "06",
        pref_name: "山形県",
        prefecture_area: [
          {
            region_cd: "01",
            pref_cd: "06",
            pref_area_cd: "0601",
            pref_area_name: "村山",
          },
          {
            region_cd: "01",
            pref_cd: "06",
            pref_area_cd: "0602",
            pref_area_name: "最上",
          },
          {
            region_cd: "01",
            pref_cd: "06",
            pref_area_cd: "0603",
            pref_area_name: "置賜",
          },
          {
            region_cd: "01",
            pref_cd: "06",
            pref_area_cd: "0604",
            pref_area_name: "庄内",
          },
          {
            region_cd: "01",
            pref_cd: "06",
            pref_area_cd: "0699",
            pref_area_name: "全域",
          },
          {
            region_cd: "01",
            pref_cd: "06",
            pref_area_cd: "0700",
            pref_area_name: "全域1",
          },
          {
            region_cd: "01",
            pref_cd: "06",
            pref_area_cd: "0701",
            pref_area_name: "全域2",
          },
          {
            region_cd: "01",
            pref_cd: "06",
            pref_area_cd: "0702",
            pref_area_name: "全域3",
          },
          {
            region_cd: "01",
            pref_cd: "06",
            pref_area_cd: "0703",
            pref_area_name: "全域4",
          },
          {
            region_cd: "01",
            pref_cd: "06",
            pref_area_cd: "0704",
            pref_area_name: "全域5",
          },
          {
            region_cd: "01",
            pref_cd: "06",
            pref_area_cd: "0705",
            pref_area_name: "全域6",
          },
        ],
      },
    ],
  };

  // 调用 res.send() 方法，向客户端响应处理的结果
  setTimeout(() => {
    res.send(rsp);
    // res.send(403,{code:"aaa", message:"bbb"});
  }, 200);
});

// 市区町村選択取得
router.get("/api/prefecture-city", (req, res) => {
  console.log(
    `GET:/area/prefecture-city?pref_cd=${req.query.pref_cd}&pref_area_cd=${req.query.pref_area_cd}`,
    req.headers["x-access-token"]
  );

  const rsp = {
    prefecture: [
      {
        region_cd: "01",
        pref_cd: "01",
        pref_name: "北海道",
        prefecture_area: [
          {
            region_cd: "01",
            pref_cd: "01",
            pref_area_cd: "0601",
            pref_area_name: "村山",
            prefecture_city: [
              {
                pref_city_cd: "01",
                pref_city_name: "新庄市",
              },
              {
                pref_city_cd: "02",
                pref_city_name: "金山町",
              },
              {
                pref_city_cd: "03",
                pref_city_name: "最上町",
              },
              {
                pref_city_cd: "04",
                pref_city_name: "舟形町",
              },
              {
                pref_city_cd: "05",
                pref_city_name: "真室川町",
              },
              {
                pref_city_cd: "06",
                pref_city_name: "大蔵村",
              },
              {
                pref_city_cd: "07",
                pref_city_name: "鮭川村",
              },
              {
                pref_city_cd: "08",
                pref_city_name: "戸沢村",
              },
              {
                pref_city_cd: "99",
                pref_city_name: "全域",
              },
            ],
          },
        ],
      },
    ],
  };

  // 调用 res.send() 方法，向客户端响应处理的结果
  setTimeout(() => {
    res.send(rsp);
    // res.send(403,{code:"aaa", message:"bbb"});
  }, 200);
});

router.post("/api/consent", (req, res) => {
  console.log(`POST:/api/consent`, req.headers["x-access-token"], req.body);

  const rsp = {
    result: true,
  };

  // 调用 res.send() 方法，向客户端响应处理的结果
  setTimeout(() => {
    if (req.headers["x-access-token"] === "access_token_xxxxxxxx") {
      res.send(rsp);
    } else {
      res.status(401).send({ code: "aaa", message: "bbb" });
    }
  }, 200);
});

module.exports = router;
