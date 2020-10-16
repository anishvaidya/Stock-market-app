import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  getSearchSuggestions(term: string) {
    // return Date();
    let url = `http://localhost:3000/search?keyword=${term}`;
    let fetchData = fetch(url);
    let searchResults = null;
    return fetchData.then((res) => res.json()).then((json) => {
      searchResults = json;
      return searchResults;
    });
  }

  getCompanyDescription(keyword: string) {
    let url = `http://localhost:3000/getCompanyDescription?keyword=${keyword}`;
    let fetchData = fetch(url);
    let companyDescription = null;
    return fetchData.then((res) => res.json()).then((json) => {
      companyDescription = json;
      // console.log(companyDescription);
      return companyDescription;
    });
  }

  getCompanyLatestPrice(keyword: string) {
    let url = `http://localhost:3000/getCompanyLatestPrice?keyword=${keyword}`;
    let fetchData = fetch(url);
    let companyLatestPrice = null;
    return fetchData.then((res) => res.json()).then((json) => {
      companyLatestPrice = json;
      // console.log(companyDescription);
      return companyLatestPrice;
    });
  }

  getCompanyHistoricalData(keyword: string) {
    let url = `http://localhost:3000/getCompanyHistoricalData?keyword=${keyword}`;
    let fetchData = fetch(url);
    let historicalData = null;
    fetchData.then((res) => res.json()).then((json) => {
      historicalData = json;
      return historicalData;
    });
  }

  getDailyChartData(keyword: string) {
    let url = `http://localhost:3000/getDailyChartData?keyword=${keyword}`;
    let fetchData = fetch(url);
    let dailyChartData = null;
    fetchData.then((res) => res.json()).then((json) => {
      dailyChartData = json;
      return dailyChartData;
    });
  }

  getNewsData(keyword) {
    let url = `http://localhost:3000/getNewsData?keyword=${keyword}`;
    let fetchData = fetch(url);
    let newsData = null;
    fetchData.then((res) => res.json()).then((json) => {
      newsData = json;
      return newsData
    });
  }

}
