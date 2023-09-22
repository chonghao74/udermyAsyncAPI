const express = require('express');
const router = express.Router();
const { default: axios, Axios } = require("axios");

router.get("/xmlhttprequestgetapi/:city", async (req, res) => {
    let { city } = req.params;

    if (city == null) {
        city = "London";
    }

    const dataUrl = `https://api.weatherapi.com/v1/current.json?key=2e7758f384d64736b06154338232208&q=${city}&aqi=no`;
});

router.get("/fetchgetapi/:city", async (req, res) => {
    let { city } = req.params;

    if (city == null) {
        city = "London";
    }

    const dataUrl = `https://api.weatherapi.com/v1/current.json?key=2e7758f384d64736b06154338232208&q=${city}&aqi=no`;

    let resData = await fetch(dataUrl, { method: 'GET' }).then(res => {
        return res.json();
    }).catch(e => {
        return e;
    });

    // console.log(resData);
    res.send(resData);
});

router.get("/axiosgetapi/:city", async (req, res) => {
    let { city } = req.params;
    if (city == null) {
        city = "London";
    }

    //url
    const baseURL = "https://api.weatherapi.com/v1/current.json";
    //作法1
    // const dataUrl = `${baseURL}?key=2e7758f384d64736b06154338232208&q=${city}&aqi=no`;
    // console.log(dataUrl);
    // let resData = await axios.get(dataUrl)
    //     .then(res => { return res.data })
    //     .catch(e => { return e })
    //     .finally(console.log("Axios GO1"));

    //作法2
    const parameterData = { params: { key: "2e7758f384d64736b06154338232208", q: city, api: "no" } }
    let resData = await axios.get(baseURL, parameterData)
        .then(res => { return res.data })
        .catch(e => { return e })
        .finally(console.log("Axios GO2"));


    res.send(resData);

});

module.exports = router;