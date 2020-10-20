import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../../../services/dataservice.service';


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

  constructor(private service: DataService, private modalService: NgbModal) { }

  ngOnInit(): void {
    // this.service.getCompanyLatestPrice(this.portfolio.value.ticker).then((data) => {
    //   this.currentPrice = {"last": data.last};
    //   console.log(this.currentPrice);
    // });
    console.log(this.portfolio.value.ticker);
    console.log(this.currentPriceOfStocks);
    for (let i=0; i< this.currentPriceOfStocks.length; i++){
      console.log(this.currentPriceOfStocks[i].ticker);
      console.log(this.currentPriceOfStocks[i].ticker == this.portfolio.value.ticker);
      if (this.currentPriceOfStocks[i].ticker == this.portfolio.value.ticker){
        console.log("true happened");
        this.currentPrice = {"last": this.currentPriceOfStocks[i]["last"]};
      }
    }
    // this.currentPrice = {"last": this.currentPriceOfStocks[this.portfolio.value.ticker]};
    console.log(this.currentPrice);
}

  openBuyModal() {
    const modalRef = this.modalService.open(BuyComponent, { backdrop: 'static' });
    modalRef.componentInstance.ticker = this.portfolio.value.ticker;
    modalRef.componentInstance.currentPriceLatest = this.currentPrice;

  }

  openSellModal(){
    const modalRef = this.modalService.open(SellComponent, { backdrop: 'static' });
    modalRef.componentInstance.ticker = this.portfolio.value.ticker;
    modalRef.componentInstance.stockPrice = this.currentPrice;
    modalRef.componentInstance.availableQuantity = this.portfolio.value.quantity;
    modalRef.componentInstance.currentTotalCost = this.portfolio.value.totalCost;
  }

}
