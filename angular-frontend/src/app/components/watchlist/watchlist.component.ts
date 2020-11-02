import { Component, OnInit } from '@angular/core';

// services
import {DatastorageService} from '../../services/datastorage.service';
import { DataService } from '../../services/dataservice.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {
  myWatchlist = [];
  currentPriceOfStocks = {"data": []};
  isLoading = true;

  constructor(private dataStorage: DatastorageService, private service: DataService) { }

  ngOnInit(): void {
    this.myWatchlist = this.dataStorage.seeWatchlist();
    this.generateCurrentPrice();

    this.dataStorage.watchStorage().subscribe((data) => {
      this.myWatchlist = data;
      this.generateCurrentPrice();
      console.log("watched for change");
    });
  }

  generateCurrentPrice(){
    let keyword = '';
    for (let i = 0; i < this.myWatchlist.length; i++){
      if (i == 0){
        keyword += this.myWatchlist[i].ticker;
      }
      else{
        keyword += "," + this.myWatchlist[i].ticker;
      }
    }
    this.service.getCompanyLatestPrice(keyword).then((data) => {
      console.log("service called");
      console.log(data);
      // this.currentPriceOfStocks = data;
      this.currentPriceOfStocks["data"] = data;
      this.isLoading = false;
      console.log(this.currentPriceOfStocks);
    });
    
  }

}
