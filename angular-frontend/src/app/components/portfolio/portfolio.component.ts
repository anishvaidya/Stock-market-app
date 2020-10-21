import { Component, OnInit } from '@angular/core';


// services
import {DatastorageService} from '../../services/datastorage.service';
import { DataService } from '../../services/dataservice.service';

// modal
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  myPortfolios = [];
  currentPriceOfStocks = [];
  isLoading = true;

  constructor(private dataStorage: DatastorageService, private modalService: NgbModal, private service: DataService) { }

  ngOnInit(): void {
    this.myPortfolios = this.dataStorage.getStocks();
    // console.log(this.myPortfolios);
    this.generateCurrentPrice();

    this.dataStorage.watchStorage().subscribe((data) => {
      this.myPortfolios = data;
      console.log("watched for change");
    });
  }

  generateCurrentPrice(){
    let keyword = '';
    for (let i = 0; i < this.myPortfolios.length; i++){
      if (i == 0){
        keyword += this.myPortfolios[i].ticker;
      }
      else{
        keyword += "," + this.myPortfolios[i].ticker;
      }
    }
    this.service.getCompanyLatestPrice(keyword).then((data) => {
      console.log("service called");
      console.log(data);
      this.currentPriceOfStocks = data;
      this.isLoading = false;
    });
    console.log(this.currentPriceOfStocks);
  }

}
