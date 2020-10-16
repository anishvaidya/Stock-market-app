import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {DataService} from '../../services/dataservice.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  keyword: string;
  data;
  description;
  latestPrice;
  setInterval = setInterval;

  constructor(private service: DataService, private router: Router) {
    this.description = null;
    this.keyword = this.router.url.split("/")[2];
   }

  ngOnInit(): void {
    this.service.getCompanyDescription(this.keyword).then((data) => {
      this.data = data;
      console.log(this.data);
      this.description = data.description;
    });

    this.latestPrice = setInterval(() => this.getLatestPrice(), 15000);
  }

  getLatestPrice(){
    console.log(Date);
    // this.service.getCompanyLatestPrice(this.keyword).then((data) => {
    //   this.latestPrice = data;
    // });
  }

}
