const express = require("express");
const cors = require("cors");
const axios = require("axios");

require('dotenv').config({ path: `${__dirname}/env/.env.local` });
const port = process.env.PORT;
const app = express(); //執行express 函示-一般做法

//middleware
//1.設定 cotent-typen
// app.use(bodyparser.urlencoded({ extended: true }));//post urlencoded -> type:application/x-www-form-urlencoded
app.use(express.json()); //post json -> type:application/json
app.use(express.static("public")); //css, js and other folder position
app.use(cors());
//2.設定 進入任何 routes 前置作業
app.use((req, res, next) => {
  next();
});
//3.設定 Routes
// app.use("/api/students", studentRoutes);

//4設定 view engine 使用 ejs ，則 render 時就能不寫副檔名
// app.set("view engine", "ejs");

const userRequest = axios.create({
  baseURL: 'https://openapi.npm.gov.tw',
  headers: { 'apiKey': 'a43b71e8-1e1e-4db6-8065-a3be827cd3d6'},
})

app.get("/proxy/v1/rest/collection/search/", async(req, res)=>{
  let apiData;

  try{
    apiData = await userRequest.get('/v1/rest/collection/search/')
    .then(function (response) {
      let data = response.data;
      if(data.status === 200){
        return {
          status:200,
          data:data.result
        }
      }
      else{
        return {
          status:data.status,
          data:data.result
        }
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      return {
        status: 401,
        data: error,
      };
    })
    .finally(function () {
      // always executed
      console.log('I always Execued');
    });
  }
  catch(e){
    apiData = {
      status: 6999,
      data: e,
    };
  }

  return res.send(apiData);

});

app.get("/proxy/v1/rest/collection/search/:serialNo", async(req, res)=>{
  let apiData;
  let {serialNo} = req.params;

  try{
    apiData = await userRequest.get(`/v1/rest/collection/search/${serialNo}`)
    .then(function (response) {
      let data = response.data;
      if(data.status === 200){
        return {
          status:200,
          data:data.result
        }
      }
      else{
        return {
          status:data.status,
          data:data.result
        }
      }
    })
  }
  catch(e){
    apiData = {
      status: 6999,
      data: e,
    };
  }

  return res.send(apiData);

});


app.listen(port, (e)=>{
  if(!e){
    console.log(`Local API Server ${port} is starting..`);
  }
})


