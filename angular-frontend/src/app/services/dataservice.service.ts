import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  baseURL;

  constructor() {
    // this.baseURL = "192.168.1.119:8088";
    // this.baseURL = "http://localhost:8088";
    this.baseURL = "";
   }

  getSearchSuggestions(term: string) {
    // return Date();
    let url = `${this.baseURL}/search?keyword=${term}`;
    // let url = `http://192.168.1.119:3000/search?keyword=${term}`;
    let fetchData = fetch(url);
    let searchResults = null;
    return fetchData.then((res) => res.json()).then((json) => {
      searchResults = json;
      return searchResults;
    });
  }

  getCompanyDescription(keyword: string) {
    let url = `${this.baseURL}/getCompanyDescription?keyword=${keyword}`;
    let fetchData = fetch(url);
    let companyDescription = null;
    return fetchData.then((res) => res.json()).then((json) => {
      companyDescription = json;
      // console.log(companyDescription);
      return companyDescription;
    });
  }

  getCompanyLatestPrice(keyword: string) {
    let url = `${this.baseURL}/getCompanyLatestPrice?keyword=${keyword}`;
    let fetchData = fetch(url);
    let companyLatestPrice = null;
    return fetchData.then((res) => res.json()).then((json) => {
      companyLatestPrice = json;
      // console.log(companyDescription);
      // if (companyLatestPrice.length > 1){
      //   return companyLatestPrice;
      // }
      // return companyLatestPrice[0];
      return companyLatestPrice;
    });
  }

  getCompanyHistoricalData(keyword: string, startDate: string) {
    let url = `${this.baseURL}/getCompanyHistoricalData?keyword=${keyword}&startDate=${startDate}`;
    let fetchData = fetch(url);
    let historicalData = null;
    return fetchData.then((res) => res.json()).then((json) => {
      historicalData = json;
      return historicalData;
    });
  }

  getDailyChartData(keyword: string, startDate: string) {
    let url = `${this.baseURL}/getDailyChartData?keyword=${keyword}&startDate=${startDate}`;
    let fetchData = fetch(url);
    let dailyChartData = null;
    return fetchData.then((res) => res.json()).then((json) => {
      dailyChartData = json;
      return dailyChartData;
    });
  }

  getNewsData(keyword: string) {
    let url = `${this.baseURL}/getNewsData?keyword=${keyword}`;
    let fetchData = fetch(url);
    let newsData = null;
    return fetchData.then((res) => res.json()).then((json) => {
      newsData = json;
      return newsData
    });
  }

}
