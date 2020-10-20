import { Component, OnInit, Input } from '@angular/core';
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
  @Input() public currentPriceLatest;

  quantity: FormControl = new FormControl();
  totalPrice;
  isValid = false;
  intervalID;

  constructor(public activeModal: NgbActiveModal, private dataStorage: DatastorageService) {
    this.intervalID = null;
  }

  ngOnInit(): void {
    console.log("modal buy open");
    this.quantity.setValue(0);
    this.totalPrice = 0.00;
    

    this.quantity.valueChanges.subscribe(() => {
      this.isValid = false;
      this.totalPrice = this.quantity.value * this.currentPriceLatest.last;
      this.intervalID = setInterval(() => this.updateTotalPrice(), 100);
      console.log(this.totalPrice);
      if (this.totalPrice > 0) {
        this.isValid = true;
      }
    });
  }

  updateTotalPrice(){
    this.totalPrice = this.quantity.value * this.currentPriceLatest.last;
  }

  buyStock() {

    let buyReceipt = this.dataStorage.buyStock(this.ticker, this.quantity.value, this.totalPrice);
    console.log("Successful purchase", buyReceipt);
  }

  ngOnDestroy(){
    if (this.intervalID != null){
      clearInterval(this.intervalID);
    }
  }


}
