
console.log("get personjs");
const divSelector = document.querySelector('div.div-block');
const divSelectorlab = document.querySelector('main label');


function clearAllChildNodes(clearContainor) {
    while (divSelector.lastChild) {
        divSelector.lastChild.remove();
    }

    // while (divSelector.firstChild) {
    //     divSelector.firstChild.remove();
    // }

}

function addLabelevent() {
    divSelectorlab.addEventListener("click", () => {
        getAxios('London');
    });
}


async function getFetch(city) {
    const dataUrl = `https://api.weatherapi.com/v1/current.json?key=2e7758f384d64736b06154338232208&q=${city}&aqi=yes`;

    console.log(dataUrl);

    await fetch(dataUrl, { method: 'GET' }).then(res => {

        return res.text;
    })
        .then(data => {
            let parser = new DOMParser();
            let fff = parser.parseFromString(data, "application/xml");
            console.log(fff);
        })
        .catch(e => {
            console.log("Error " + e);
            return e;
        });
}

async function getFetch(city) {
    const dataUrl = `https://api.weatherapi.com/v1/current.json?key=2e7758f384d64736b06154338232208&q=${city}&aqi=yes`;

    console.log(dataUrl);

    await fetch(dataUrl, { method: 'GET' }).then(res => {

        return res.json();
    })
        .then(data => {
            console.log(data);
        })
        .catch(e => {
            console.log("Error " + e);
            return e;
        });
}

async function getAxios(city) {
    const baseURL = "https://api.weatherapi.com/v1/current.json";
    const parameterData = { params: { key: "2e7758f384d64736b06154338232208", q: city, api: "no" } }

    let resData = await axios.get(baseURL, parameterData)
        .then(res => { return res })
        .catch(e => { return e })
        .finally(console.log("Axios GO2"));


    window.console.log("data");
    window.console.log(resData.data);
    window.console.log("status");
    window.console.log(resData.status);
    window.console.log("headers");
    window.console.log(resData.headers);
    window.console.log("statusText");
    window.console.log(resData.statusText);
    window.console.log("config");
    window.console.log(resData.config);
}

// getFetch('London');
// getAxios('London');
addLabelevent();

