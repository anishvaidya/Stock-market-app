import { Component, OnInit } from '@angular/core';

// DataStorage service
import {DatastorageService} from '../../services/datastorage.service';

// modal
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  myPortfolios = [];

  constructor(private dataStorage: DatastorageService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.myPortfolios = this.dataStorage.getStocks();
    // console.log(this.myPortfolios);

    this.dataStorage.watchStorage().subscribe((data) => {
      this.myPortfolios = data;
      console.log("watched for change");
    });
  }

}
