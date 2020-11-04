import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/dataservice.service';
import { DatastorageService } from '../../services/datastorage.service';

// modal
import { BuyComponent } from '../modals/buy/buy.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// highcharts
import * as Highcharts from "highcharts/highstock";
import { Options } from "highcharts/highstock";


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  keyword: string;
  companyDescription;
  latestPrice;
  public currentPriceLatest;
  dailyChartData;
  companyHistoricalData;
  newsData;
  isLoading;
  isValid;
  latestPriceID;
  dailyChartDataID;
  isMarketOpen;
  latestDate;
  latestDateTime;
  currentDateTime;
  currentDateTimeID;
  isFilled;
  change;
  changePercent;
  changeColor;

  mid;
  askPrice;
  askSize;
  bidPrice;
  bidSize;


  // alerts new
  showAddWatchlist = false;
  showRemoveWatchlist = false;
  showBuy = false;

  // for charts
  chartOptions: Options;
  Highcharts: typeof Highcharts = Highcharts;
  dailyChartPrice = [];
  chartUpdateFlag = false;


  constructor(private service: DataService, private router: Router, private modalService: NgbModal, private localStorage: DatastorageService) {
    this.companyDescription = null;
    this.latestPrice = null;
    this.isValid = true;
    this.isLoading = true;
    this.keyword = this.router.url.split("/")[2];
    this.companyHistoricalData = null;
    this.newsData = null;
    this.dailyChartData = null;
    this.dailyChartDataID = null;
    this.currentPriceLatest = null;
    this.currentDateTimeID = null;
    this.isFilled = false;


  }

  ngOnInit(): void {
    this.retrieveData();
    this.updateCurrentTime();
    this.currentDateTimeID = setInterval(() => this.updateCurrentTime(), 15000);

    // $('.alert').alert('close')

  }

  retrieveData() {
    if (this.keyword == undefined) {
      console.log("empty keyword");
      this.isValid = false;
      this.isLoading = false;
      return;
    }
    this.service.getCompanyDescription(this.keyword).then((data) => {
      this.companyDescription = data;
      console.log(this.companyDescription);
      if (Object.keys(this.companyDescription).length != 0) {
        console.log("this runs");

        // this.buildChart();
        this.checkInWatchlist();
        this.getLatestPrice();
        this.latestPriceID = setInterval(() => this.getLatestPrice(), 15000);
      }
      else {
        this.isValid = false;
        console.log(this.isValid);
      }
    });
  }

  getLatestPrice() {
    console.log(Date.now());
    this.service.getCompanyLatestPrice(this.keyword).then((data) => {
      this.latestPrice = data[0];
      this.mid = this.latestPrice.mid;
      this.askPrice = this.latestPrice.askPrice;
      this.askSize = this.latestPrice.askSize;
      this.bidPrice = this.latestPrice.bidPrice;
      this.bidSize = this.latestPrice.bidSize;
      if (this.mid == null) {
        // this.mid = "-";
        this.mid = 0;
      }
      else {
        this.mid = Number(this.mid.toFixed(2));
      }
      // if (this.latestPrice.askPrice == null){
      //   this.askPrice = "-";
      // }
      // else{
      //   this.askPrice = this.latestPrice.askPrice;
      // }
      if (this.askPrice != null) {
        this.askPrice = Number(this.askPrice.toFixed(2));
      }
      else{
        this.askPrice = 0;
      }
      if (this.askSize != null) {
        this.askSize = Number(this.askSize.toFixed(2));
      }
      else{
        this.askSize = 0;
      }
      if (this.bidPrice != null) {
        this.bidPrice = Number(this.bidPrice.toFixed(2));
      }
      else{
        this.bidPrice = 0;
      }
      if (this.bidSize != null) {
        this.bidSize = Number(this.bidSize.toFixed(2));
      }
      else{
        this.bidSize = 0;
      }
      this.change = (this.latestPrice.last - this.latestPrice.prevClose).toFixed(2);
      this.changePercent = (this.change * 100 / this.latestPrice.prevClose).toFixed(2);
      if (this.change > 0) {
        this.changeColor = "green";
      }
      else if (this.change < 0) {
        this.changeColor = "red";
      }
      else {
        this.changeColor = "black";
      }

      this.updateCurrentLatestPrice();

      // let startDate = new Date(this.latestPrice.timestamp).toLocaleDateString();
      // let startDate = new Date(this.latestPrice.timestamp).toISOString().slice(0,10);

      // // current date time
      // let currentDateTime = new Date().toLocaleString('en-US', { hour12: false }).split(",");
      // let currentDate = currentDateTime[0].split("/");
      // this.currentDateTime = currentDate[2] + "-" + currentDate[0] + "-" + currentDate[1] + currentDateTime[1];


      // date time when market closed
      this.latestDate = this.latestPrice.timestamp.slice(0, 10);
      let latestDateTime = new Date(this.latestPrice.timestamp).toLocaleString('en-US', { hour12: false }).split(",");
      let latestDate = latestDateTime[0].split("/");
      this.latestDateTime = latestDate[2].padStart(4, '0') + "-" + latestDate[0].padStart(2, '0') + "-" + latestDate[1].padStart(2, '0') + latestDateTime[1];

      console.log(this.latestDate);
      console.log(this.latestDateTime);

      // getting daily chart data
      if (this.dailyChartData == null) {
        console.log("new API called for daily chart data");
        this.getDailyChartData();
      }
      if (this.dailyChartDataID == null) {
        console.log("daily chart interval set");
        // this.dailyChartDataID = setInterval(() => this.getDailyChartData(), (1000 * 60 * 4));
        this.dailyChartDataID = setInterval(() => this.getDailyChartData(), (1000 * 15));
      }


      // check if market is open
      let browserTime = Date.now();
      // browserTime = 1601877086317;
      let APITime = new Date(this.latestPrice.timestamp).getTime()
      console.log(this.latestPrice);
      console.log(new Date(this.latestPrice.timestamp).getTime());
      if (Math.abs(browserTime - APITime) <= (60 * 1000)) {
        this.isMarketOpen = true;
        // manually close market
        // this.isMarketOpen = false;
        // clearInterval(this.latestPriceID);
        // clearInterval(this.dailyChartDataID);
        console.log("market is open");
      }
      else {
        this.isMarketOpen = false;
        clearInterval(this.latestPriceID);
        clearInterval(this.dailyChartDataID);
        clearInterval(this.currentDateTimeID);
        console.log("market is closed");
      }
    });
  }

  getDailyChartData() {
    this.service.getDailyChartData(this.keyword, this.latestDate).then((data) => {
      this.dailyChartData = data;
      console.log(this.dailyChartData);

      // this.buildChart();
      // this.updateDailyChartPrice();
      // this.resize();

      // window.setTimeout(function(){ $(window).trigger('resize'); }, 500);
      // remove loading
      if (this.companyDescription != null && this.latestPrice != null && this.dailyChartData != null) {
        this.isLoading = false;

        setTimeout(() => {
          this.buildChart();
          this.updateDailyChartPrice();
          this.resize();
        }, 50);

        console.log("loading", this.isLoading);
        if (this.newsData == null) {
          this.getNewsData();
        }
        if (this.companyHistoricalData == null) {
          this.getCompanyHistoricalData();
        }

      }
    });
  }

  getCompanyHistoricalData() {
    let startDateString = new Date(new Date().setFullYear(new Date(this.latestPrice.timestamp).getFullYear() - 2)).toLocaleDateString().split("/");
    let startDate = startDateString[2] + "-" + startDateString[0] + "-" + startDateString[1];
    this.service.getCompanyHistoricalData(this.keyword, startDate).then((data) => {
      this.companyHistoricalData = data;
      console.log(this.companyHistoricalData);
    });
  }

  getNewsData() {
    this.service.getNewsData(this.keyword).then((data) => {
      this.newsData = data;
      console.log(this.newsData);
    });
  }

  updateCurrentLatestPrice() {
    console.log("price updated");
    console.log("price was", this.latestPrice.last);
    if (this.currentPriceLatest == null) {
      this.currentPriceLatest = { "last": this.latestPrice.last };
    }
    else {
      this.currentPriceLatest.last = this.latestPrice.last;
    }
  }

  openBuyModal() {
    // const modalRef = this.modalService.open(BuyComponent, { backdrop: 'static' });
    const modalRef = this.modalService.open(BuyComponent);
    modalRef.componentInstance.ticker = this.companyDescription.ticker;
    modalRef.componentInstance.name = this.companyDescription.name;
    modalRef.componentInstance.currentPriceLatest = this.currentPriceLatest;

    modalRef.componentInstance.buyReceipt.subscribe(($e) => {
      console.log($e, "receipt in parent");
      // this.buyAlert = this.buyAlertBought;
      if ($e) {
        this.showBuy = true;
        setTimeout(() => {
          this.showBuy = false;
        }, 5000);
      }

    });
  }

  checkInWatchlist() {
    let myWatchlist = this.localStorage.seeWatchlist();
    console.log(myWatchlist);
    for (let i = 0; i < myWatchlist.length; i++) {
      console.log(myWatchlist[i]);
      if (myWatchlist[i].ticker == this.companyDescription.ticker) {
        this.isFilled = true;
      }
    }
    console.log("for looop ends");
  }

  toggleWatchlist() {
    console.log("watchlist button clicked");
    // this.isFilled = !this.isFilled;
    if (this.isFilled) {
      this.localStorage.removeFromWatchlist(this.companyDescription.ticker);
      this.showAddWatchlist = false;
      this.showRemoveWatchlist = true;
      setTimeout(() => {
        this.showRemoveWatchlist = false;
      }, 5000);
    }
    else {
      this.localStorage.addToWatchlist(this.companyDescription.ticker, this.companyDescription.name);
      this.showRemoveWatchlist = false;
      this.showAddWatchlist = true;
      setTimeout(() => {
        this.showAddWatchlist = false;
      }, 5000);
    }
    this.isFilled = !this.isFilled;

  }

  updateCurrentTime() {
    // current date time
    let currentDateTime = new Date().toLocaleString('en-US', { hour12: false }).split(",");
    let currentDate = currentDateTime[0].split("/");
    this.currentDateTime = currentDate[2] + "-" + currentDate[0] + "-" + currentDate[1] + currentDateTime[1];
  }

  ngOnDestroy() {
    if (this.latestPriceID != null) {
      console.log("latest price API stopped");
      clearInterval(this.latestPriceID);
    }
    if (this.dailyChartDataID != null) {
      console.log("daily chart data API stopped");
      clearInterval(this.dailyChartDataID);
    }
    if (this.currentDateTimeID != null) {
      console.log("current time interval deleted");
      clearInterval(this.currentDateTimeID);
    }
  }



  // Daily chart highcharts
  updateDailyChartPrice() {
    this.dailyChartPrice = [];
    for (let i = 0; i < this.dailyChartData.length; i++) {
      this.dailyChartPrice.push([new Date(this.dailyChartData[i].date).getTime(), Number(this.dailyChartData[i].close.toFixed(2))]);
    }
    console.log(this.dailyChartPrice, "check this");
    this.chartOptions.plotOptions.series['color'] = this.changeColor;
    this.chartOptions.series[0]['data'] = this.dailyChartPrice;
    this.chartOptions.series[0]['name'] = this.companyDescription.ticker;
    this.chartOptions.title['text'] = this.companyDescription.ticker;

    // this.chartOptions.series[0] = {
    //   name: this.companyDescription.ticker,
    //   type: 'line',
    //   data: this.dailyChartPrice,
    // }
    // this.chartOptions.title = {
    //   // text: this.companyDescription.ticker,
    //   text: String(Date.now())
    // }
    // this.chartOptions.plotOptions = {
    //   series: {
    //     color: this.changeColor,
    //   }
    // }
    this.chartUpdateFlag = true;
    console.log(this.dailyChartPrice);
  }

  buildChart() {
    this.chartOptions = {

      chart: {
        type: 'line',
        // width: 400,
        reflow: true,
      },
      title: {
        text: "ANISH",
      },
      rangeSelector: {
        enabled: false
      },
      plotOptions: {
        series: {
          color: 'black'
        }
      },
      time: {
        timezoneOffset: new Date(Date.now()).getTimezoneOffset(),
      },
      series: [
        {
          name: "ANISH",
          type: 'line',
          // pointInterval: 60 * 4 * 1000,
          data: [],
        }
      ]
    };
  }

  closeWatchlistAlert() {
    this.showAddWatchlist = false;
    this.showRemoveWatchlist = false;
  }

  closeBuyAlert() {
    this.showBuy = false;
  }


  // Highcharts: typeof Highcharts = Highcharts;
  // chartOptions: Options = {
  //   title: {
  //     text: this.title,
  //   },
  //   rangeSelector: {
  //     inputEnabled: false,
  //     buttonTheme: {
  //       visibility: 'hidden'
  //     },
  //     labelStyle: {
  //       visibility: 'hidden'
  //     }
  //   },

  //   time: {
  //     timezoneOffset: new Date(Date.now()).getTimezoneOffset(),
  //   },
  //   series: [
  //     {
  //       name: this.title,
  //       type: 'line',
  //       data: this.dailyChartPrice
  //     }
  //   ]
  // };

  resize() {
    console.log("resize called");
    // window.dispatchEvent(new Event('resize'));
    //   window.resizeTo(window.screen.availWidth*(0.5), window.screen.availHeight*(0.5));
    let element: HTMLElement = document.getElementById('batman') as HTMLElement;
    element.click();
  }

}
