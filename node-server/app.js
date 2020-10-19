const { request, response } = require('express');
const express = require('express');
const cors = require('cors');
const api = require('./API/api');

const app = express();

const corsOptions = {
    "origin": "*"
};
app.use((cors(corsOptions)));



// app.get('/search', (request, response) => {
//     let keyword = request.query.keyword;
//     let url = `https://api.tiingo.com/tiingo/utilities/search?query=${keyword}&limit=10&token=${tiingoApiKey}`;
//     let fetchData = fetch(url);
//     let searchResults = null;
//     fetchData.then(res => res.json()).then(json => {
//         searchResults = json;
//         console.log(searchResults);
//         response.send(searchResults);
//     });
// });

// app.get('/getCompanyDescription', (request, response) => {
//     let keyword = request.query.keyword;
//     let url = `https://api.tiingo.com/tiingo/daily/${keyword}?token=${tiingoApiKey}`;
//     let fetchData = fetch(url);
//     let companyDescription = null;
//     fetchData.then(res => res.json()).then(json => {
//         companyDescription = json;
//         console.log(companyDescription);
//         response.send(companyDescription);
//     });
// });

app.get('/search', (request, response) => {
    let keyword = request.query.keyword;
    api.searchSuggestions(keyword, response);
});

app.get('/getCompanyDescription', (request, response) => {
    let keyword = request.query.keyword;
    api.getCompanyDescription(keyword, response);
});

app.get('/getCompanyLatestPrice', (request, response) => {
    let keyword = request.query.keyword;
    api.getCompanyLatestPrice(keyword, response);
});

app.get('/getCompanyHistoricalData', (request, response) => {
    let keyword = request.query.keyword;
    let startDate = request.query.startDate;
    api.getCompanyHistoricalData(keyword, startDate, response);
});

app.get('/getDailyChartData', (request, response) => {
    let keyword = request.query.keyword;
    let startDate = request.query.startDate;
    // let startDate = "2020-10-16"
    api.getDailyChartData(keyword, startDate, response);
});

app.get('/getNewsData', (request, response) => {
    let keyword = request.query.keyword;
    api.getNewsData(keyword, response);
});




const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));