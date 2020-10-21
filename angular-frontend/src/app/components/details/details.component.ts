import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/dataservice.service';
import { DatastorageService } from '../../services/datastorage.service';


// modal
import { BuyComponent } from '../modals/buy/buy.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  }

  retrieveData() {
    this.service.getCompanyDescription(this.keyword).then((data) => {
      this.companyDescription = data;
      console.log(this.companyDescription);
      if (Object.keys(this.companyDescription).length != 0) {
        console.log("this runs");
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
      this.latestDateTime = latestDate[2] + "-" + latestDate[0] + "-" + latestDate[1] + latestDateTime[1];

      console.log(this.latestDate);
      console.log(this.latestDateTime);

      // getting daily chart data
      if (this.dailyChartData == null) {
        console.log("new API called for daily chart data");
        this.getDailyChartData();
      }
      if (this.dailyChartDataID == null) {
        console.log("daily chart interval set");
        this.dailyChartDataID = setInterval(() => this.getDailyChartData(), (1000 * 60 * 4));
      }


      // check if market is open
      let browserTime = Date.now();
      // browserTime = 1601877086317;
      let APITime = new Date(this.latestPrice.timestamp).getTime()
      console.log(this.latestPrice);
      console.log(new Date(this.latestPrice.timestamp).getTime());
      if (Math.abs(browserTime - APITime) <= (60 * 1000)) {
        this.isMarketOpen = true;
        console.log("market is open");
      }
      else {
        this.isMarketOpen = false;
        clearInterval(this.latestPriceID);
        clearInterval(this.dailyChartDataID);
        console.log("market is closed");
      }
    });
  }

  getDailyChartData() {
    this.service.getDailyChartData(this.keyword, this.latestDate).then((data) => {
      this.dailyChartData = data;
      console.log(this.dailyChartData);

      // remove loading
      if (this.companyDescription != null && this.latestPrice != null && this.dailyChartData != null) {
        this.isLoading = false;
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
    const modalRef = this.modalService.open(BuyComponent, { backdrop: 'static' });
    modalRef.componentInstance.ticker = this.companyDescription.ticker;
    modalRef.componentInstance.name = this.companyDescription.name;
    modalRef.componentInstance.currentPriceLatest = this.currentPriceLatest;
  }

  checkInWatchlist() {
    let myWatchlist = this.localStorage.seeWatchlist();
    console.log(myWatchlist);
    for (let i = 0; i < myWatchlist.length; i++) {
      console.log(myWatchlist[i]);
      if (myWatchlist[i].ticker == this.companyDescription.ticker){
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
    }
    else {
      this.localStorage.addToWatchlist(this.companyDescription.ticker, this.companyDescription.name);
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
}
