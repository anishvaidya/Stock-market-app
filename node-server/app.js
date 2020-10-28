const { request, response } = require('express');
const express = require('express');
const cors = require('cors');
const api = require('./API/api');

// serve html
const bodyParser = require("body-parser");

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

// serve html
app.use(express.static('public'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(process.cwd()+"/public/angular-frontend/"));
app.get('*', (req,res) => {
    res.sendFile(process.cwd()+"/public/angular-frontend/")
  });



const port = process.env.PORT || 8088;
app.listen(port, () => console.log(`Listening on port ${port}`));