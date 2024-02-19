const fs = require("fs");
const url = require("url");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
// const path = require("path");
require("dotenv").config({ path: `${__dirname}/env/.env.local` });
const port = process.env.PORT;

const app = express(); //執行express 函示-一般做法

//import routes
const studentRoutes = require("./routes/student-routes");
const weatherRoutes = require("./routes/weather-routes");
const accountRoutes = require("./routes/account-routes");

//cors
const cors = require("cors");

//DB
// const mongoose = require('mongoose');
// const { Schema } = mongoose;//destroction mongose 中有Schema 參數的物件
const { personSchema } = require("./models/student");

//middleware
//1.設定 cotent-typen
// app.use(bodyparser.urlencoded({ extended: true }));//post urlencoded -> type:application/x-www-form-urlencoded
app.use(express.json()); //post json -> type:application/json
app.use(express.static("public")); //css, js and other folder position
//2.設定 進入任何 routes 前置作業
app.use((req, res, next) => {
  console.log("I am middleware all!!!");

  // 可以寫判斷式來預處理
  // 如果都符合才執行 next 執行所要的 routes
  if (true) {
    next();
  } else {
    res.redirect("https://google.com");
  }
});
//3.設定 Routes
app.use("/api/students", studentRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/accounts", accountRoutes);
//4.是否設定所有 router 都能跨網域執行
//app.use(cors());
//5.設定 swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//設定 view engine 使用 ejs ，則 render 時就能不寫副檔名
app.set("view engine", "ejs");

app.get("/*", (req, res) => {
  // for (var i = 0; i < 5; i++) {
  //   setTimeout(() => {
  //     console.log(i);
  //   }, 1000);
  // }

  // for (let j = 0; j < 5; j++) {
  //   setTimeout(() => {
  //     console.log(j);
  //   }, 1000);
  // }

  for (var k = 0; k < 5; k++) {
    (function (data) {
      setTimeout(() => {
        console.log(data);
      }, 1000);
    })(k);
  }

  return res.render("error");
});

app.listen(port, () => {
  console.log(`port ${port} is Running!!!`);
});
