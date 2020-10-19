import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/dataservice.service';


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
  public latestPrice;
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
  // modalRef;


  constructor(private service: DataService, private router: Router, private modalService: NgbModal) {
    this.companyDescription = null;
    this.latestPrice = null;
    this.isValid = true;
    this.isLoading = true;
    this.keyword = this.router.url.split("/")[2];
    this.companyHistoricalData = null;
    this.newsData = null;
    this.dailyChartDataID = null;
  }

  ngOnInit(): void {
    this.retrieveData();
  }

  // ngOnChanges(changes: SimpleChanges){
  //   console.log("price changed");
  //   this.modalRef.componentInstance.latestPrice = this.currentPriceLatest.last;
  // }

  retrieveData() {
    this.service.getCompanyDescription(this.keyword).then((data) => {
      this.companyDescription = data;
      console.log(this.companyDescription);
      if (Object.keys(this.companyDescription).length != 0) {
        console.log("this runs");
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
      this.latestPrice = data;
      // this.currentPriceLatest = new String(this.latestPrice.last);
      this.updateCurrentLatestPrice();

      // let startDate = new Date(this.latestPrice.timestamp).toLocaleDateString();
      // let startDate = new Date(this.latestPrice.timestamp).toISOString().slice(0,10);

      // current date time
      let currentDateTime = new Date().toLocaleString('en-US', { hour12: false }).split(",");
      let currentDate = currentDateTime[0].split("/");
      this.currentDateTime = currentDate[2] + "-" + currentDate[0] + "-" + currentDate[1] + currentDateTime[1];


      // date time when market closed
      this.latestDate = this.latestPrice.timestamp.slice(0, 10);
      let latestDateTime = new Date(this.latestPrice.timestamp).toLocaleString('en-US', { hour12: false }).split(",");
      let latestDate = latestDateTime[0].split("/");
      this.latestDateTime = latestDate[2] + "-" + latestDate[0] + "-" + latestDate[1] + latestDateTime[1];

      console.log(this.latestDate);
      console.log(this.latestDateTime);

      // getting daily chart data
      this.getDailyChartData();
      if (this.dailyChartDataID == null){
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

  updateCurrentLatestPrice(){
    console.log("price updated");
    this.currentPriceLatest = new Number(this.latestPrice.last);
  }

  openBuyModal() {
    const modalRef = this.modalService.open(BuyComponent, { backdrop: 'static' });
    modalRef.componentInstance.ticker = this.companyDescription.ticker;
    modalRef.componentInstance.latestPrice = this.latestPrice;
    // modalRef.componentInstance.stockPrice = this.currentPriceLatest;
  }

  ngOnDestroy() {
    if (this.latestPriceID) {
      console.log("latest price API stopped");
      clearInterval(this.latestPriceID);
    }
    if (this.dailyChartDataID) {
      console.log("daily chart data API stopped");
      clearInterval(this.dailyChartDataID);
    }
  }
}
