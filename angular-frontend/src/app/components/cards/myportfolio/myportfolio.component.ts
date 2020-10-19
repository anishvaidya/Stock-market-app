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
  currentPrice;

  constructor(private service: DataService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.service.getCompanyLatestPrice(this.portfolio.value.ticker).then((data) => {
      this.currentPrice = data.last;
    });
}

  openBuyModal() {
    const modalRef = this.modalService.open(BuyComponent, { backdrop: 'static' });
    modalRef.componentInstance.ticker = this.portfolio.value.ticker;
    modalRef.componentInstance.stockPrice = this.currentPrice;

  }

  openSellModal(){
    const modalRef = this.modalService.open(SellComponent, { backdrop: 'static' });
    modalRef.componentInstance.ticker = this.portfolio.value.ticker;
    modalRef.componentInstance.stockPrice = this.currentPrice;
    modalRef.componentInstance.availableQuantity = this.portfolio.value.quantity;
  }

}
