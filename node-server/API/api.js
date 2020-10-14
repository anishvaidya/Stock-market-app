const fetch = require('node-fetch');

const tiingoApiKey = "9a184115d5c963a436040d7dd097d0938b90a47c";
const newsApiKey = "4ca495b0a3e74d09bc6202e4b51b522c";

function buildSearchSuggestions(rawSearch){
    let searchResults = [];
    for (var i = 0; i < rawSearch.length; i++){
        if (rawSearch[i].ticker != null && rawSearch[i].name != null){
            let suggestion = {
                "ticker": rawSearch[i].ticker,
                "name": rawSearch[i].name
            };
            searchResults.push(suggestion);
        }
    }
    return searchResults;
}

function buildCompanyDescription(companyDescription){
    if (companyDescription.name){
        return companyDescription;
    }
    else {
        return {}
    }
}

function buildCompanyLatestPrice(data){
    if (data.length != 0){
        return data[0];
    }
    return {}
}

function buildDailyChartData(data){
    return data;
}

function buildNewsData(data){
    let articles = [];
    for (article of data){
        if (article.url != null && article.title != null && article.description != null && article.source != null && article.urlToImage != null && article.publishedAt != null){
            articles.push(article);
        }
    }
    return articles;
}

function searchSuggestions(keyword, response){
    let url = `https://api.tiingo.com/tiingo/utilities/search?query=${keyword}&limit=10&token=9a184115d5c963a436040d7dd097d0938b90a47c`;
    let fetchData = fetch(url);
    let searchResults = null;
    fetchData.then((res) => res.json()).then((json) => {
        searchResults = buildSearchSuggestions(json);
        // console.log(searchResults);
        response.send(searchResults);
    });    
}

function getCompanyDescription(keyword, response){
    let url = `https://api.tiingo.com/tiingo/daily/${keyword}?token=${tiingoApiKey}`;
    let fetchData = fetch(url);
    let companyDescription = null;
    fetchData.then((res) => res.json()).then((json) => {
        companyDescription = buildCompanyDescription(json);
        // console.log(companyDescription);
        response.send(companyDescription);
    });
}

function getCompanyLatestPrice(keyword, response){
    let url = `https://api.tiingo.com/iex?tickers=${keyword}&token=${tiingoApiKey}`;
    let fetchData = fetch(url);
    let companyLatestPrice = null;
    fetchData.then((res) => res.json()).then((json) => {
        companyLatestPrice = buildCompanyLatestPrice(json);
        // console.log(companyLatestPrice);
        response.send(companyLatestPrice);
    });
}

function getCompanyHistoricalData(keyword, response){
    let url = `https://api.tiingo.com/tiingo/daily/${keyword}/prices?startDate=2019-09-10&resampleFreq=daily&columns=date,open,high,low,close,volume&token=${tiingoApiKey}`;
    let fetchData = fetch(url);
    let historicalData = null;
    fetchData.then((res) => res.json()).then((json) => {
        historicalData = json;
        response.send(historicalData);
    });
}

function getDailyChartData(keyword, response){
    let url = `https://api.tiingo.com/iex/${keyword}/prices?startDate=2019-09-10&resampleFreq=4min&columns=date,open,high,low,close,volume&token=${tiingoApiKey}`;
    let fetchData = fetch(url);
    let dailyChartData = null;
    fetchData.then((res) => res.json()).then((json) => {
        dailyChartData = buildDailyChartData(json);
        // console.log(dailyChartData);
        response.send(dailyChartData);
    });
}

function getNewsData(keyword, response){
    let url = `https://newsapi.org/v2/everything?apiKey=${newsApiKey}&q=${keyword}&page=1&pageSize=25`;
    let fetchData = fetch(url);
    let newsData = null;
    fetchData.then((res) => res.json()).then((json) => {
        newsData = buildNewsData(json.articles);
        // console.log(newsData);
        response.send(newsData);
    });
}



module.exports.searchSuggestions = searchSuggestions;
module.exports.getCompanyDescription = getCompanyDescription;
module.exports.getCompanyLatestPrice = getCompanyLatestPrice;
module.exports.getDailyChartData = getDailyChartData;
module.exports.getCompanyHistoricalData = getCompanyHistoricalData;
module.exports.getNewsData = getNewsData;
