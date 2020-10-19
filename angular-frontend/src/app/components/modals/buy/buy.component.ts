import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';

// buy service
import { DatastorageService } from '../../../services/datastorage.service';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css']
})
export class BuyComponent implements OnInit {

  @Input() ticker;
  @Input() stockPrice: Number;
  @Input() public latestPrice;
  currentStockPrice;

  quantity: FormControl = new FormControl();
  totalPrice;
  isValid = false;

  constructor(public activeModal: NgbActiveModal, private dataStorage: DatastorageService) {
  }

  ngOnInit(): void {
    console.log("modal buy open");
    console.log("latest price", this.latestPrice);
    // this.currentStockPrice = this.stockPrice;
    // console.log(typeof this.currentStockPrice);
    // console.log(this.currentStockPrice);
    this.quantity.setValue(0);
    this.totalPrice = 0.00;
    this.quantity.valueChanges.subscribe(() => {
      this.isValid = false;
      // this.totalPrice = this.quantity.value * this.currentStockPrice;
      // this.totalPrice = this.quantity.value * this.stockPrice;
      this.totalPrice = this.quantity.value * this.latestPrice.last;
      console.log(this.totalPrice);
      if (this.totalPrice > 0) {
        this.isValid = true;
      }
    });
  }

  // ngOnChanges(changes: SimpleChanges) {

  //   this.currentStockPrice = changes.stockPrice.currentValue;
  //   console.log("price changed");
  //   // You can also use categoryId.previousValue and 
  //   // categoryId.firstChange for comparing old and new values

  // }

  buyStock() {

    let buyReceipt = this.dataStorage.buyStock(this.ticker, this.quantity.value, this.totalPrice);
    console.log("Successful purchase", buyReceipt);
  }


}
