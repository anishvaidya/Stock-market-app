import { Component, OnInit, Input } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';

// buy service
import {DatastorageService} from '../../../services/datastorage.service';


@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css']
})
export class SellComponent implements OnInit {

  @Input() availableQuantity;
  @Input() ticker;
  @Input() stockPrice;
  @Input() currentTotalCost;

  quantity: FormControl = new FormControl();
  totalPrice;
  actualTotalPrice;
  isValid = false;

  constructor(public activeModal: NgbActiveModal, private dataStorage: DatastorageService) { }

  ngOnInit(): void {
    this.quantity.setValue(0);
    this.totalPrice = 0.00;
    this.actualTotalPrice = 0.00;

    this.quantity.valueChanges.subscribe(() => {
      this.isValid = false;
      this.totalPrice = this.quantity.value * this.stockPrice.last;
      this.actualTotalPrice = Number((this.quantity.value * (this.currentTotalCost / this.availableQuantity)).toFixed(2));

      console.log(this.totalPrice);
      if (this.quantity.value > 0 && this.quantity.value <= this.availableQuantity){
        this.isValid = true;
      }
    });

  }

  sellStock(){
    let saleReceipt = this.dataStorage.sellStock(this.ticker, this.quantity.value, this.actualTotalPrice);
    console.log("Successful sale" , saleReceipt);
  }

}
