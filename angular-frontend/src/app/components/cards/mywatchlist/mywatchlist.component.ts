import { Component, Input, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {DatastorageService} from '../../../services/datastorage.service';

@Component({
  selector: 'app-mywatchlist',
  templateUrl: './mywatchlist.component.html',
  styleUrls: ['./mywatchlist.component.css']
})
export class MywatchlistComponent implements OnInit {
  @Input() stock;
  @Input() currentPriceOfStocks;
  
  watchlistStock;
  change;
  changePercent;

  constructor(private localStorage: DatastorageService, private router: Router) {
    this.watchlistStock = null;
    this.change = null;
    this.changePercent = null;
   }

  ngOnInit(): void {
    for (let i = 0; i < this.currentPriceOfStocks.length; i++){
      if (this.stock.value.ticker == this.currentPriceOfStocks[i].ticker){
        this.watchlistStock = this.currentPriceOfStocks[i];
        break;
      }
    }
    this.change = (this.watchlistStock.last - this.watchlistStock.prevClose).toFixed(2);
    this.changePercent = ((this.change * 100) / this.watchlistStock.prevClose).toFixed(2);
  }

  removeFromWatchlist(){
    this.localStorage.removeFromWatchlist(this.stock.value.ticker);
  }

  openStockDetails(){
    console.log("card clicked");
    this.router.navigate([`/details/${this.stock.value.ticker}`]);
  }
}
