import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../../../services/dataservice.service';
import {Router} from '@angular/router';


// modal
import { BuyComponent } from '../../modals/buy/buy.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SellComponent } from '../../modals/sell/sell.component';

@Component({
  selector: 'app-myportfolio',
  templateUrl: './myportfolio.component.html',
  styleUrls: ['./myportfolio.component.css']
})
export class MyportfolioComponent implements OnInit {
  @Input() portfolio;
  @Input() currentPriceOfStocks;
  currentPrice;
  change;
  marketValue;
  

  constructor(private service: DataService, private modalService: NgbModal, private router: Router) { }

  ngOnInit(): void {
    // this.service.getCompanyLatestPrice(this.portfolio.value.ticker).then((data) => {
    //   this.currentPrice = {"last": data.last};
    //   console.log(this.currentPrice);
    // });
    console.log(this.portfolio.value.ticker);
    console.log(this.currentPriceOfStocks["data"].length);
    for (let i=0; i< this.currentPriceOfStocks["data"].length; i++){
      console.log(this.currentPriceOfStocks["data"][i].ticker);
      console.log(this.currentPriceOfStocks["data"][i].ticker == this.portfolio.value.ticker);
      if (this.currentPriceOfStocks["data"][i].ticker == this.portfolio.value.ticker){
        console.log("true happened");
        this.currentPrice = {"last": this.currentPriceOfStocks["data"][i]["last"]};
        this.change = ((this.portfolio.value.totalCost / this.portfolio.value.quantity) - this.currentPriceOfStocks["data"][i].last).toFixed(2);
      }
    }
    console.log(this.currentPrice);
}

  openBuyModal() {
    // const modalRef = this.modalService.open(BuyComponent, { backdrop: 'static' });
    const modalRef = this.modalService.open(BuyComponent);
    modalRef.componentInstance.ticker = this.portfolio.value.ticker;
    modalRef.componentInstance.name = this.portfolio.value.name;
    modalRef.componentInstance.currentPriceLatest = this.currentPrice;

  }

  openSellModal(){
    // const modalRef = this.modalService.open(SellComponent, { backdrop: 'static' });
    const modalRef = this.modalService.open(SellComponent);
    modalRef.componentInstance.ticker = this.portfolio.value.ticker;
    modalRef.componentInstance.stockPrice = this.currentPrice;
    modalRef.componentInstance.availableQuantity = this.portfolio.value.quantity;
    modalRef.componentInstance.currentTotalCost = this.portfolio.value.totalCost;
  }

  openStockDetails(){
    console.log("card clicked");
    this.router.navigate([`/details/${this.portfolio.value.ticker}`]);
  }

}
