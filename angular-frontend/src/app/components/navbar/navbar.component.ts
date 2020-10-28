import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public isMenuCollapsed = true;
  active;

  active1;
  active2;
  active3;
  url;

  constructor(private location: Location) { }

  ngOnInit(): void {
    setInterval(() => {
      this.checkWhichActive();
    }, 100);
  }

  checkWhichActive(){
    this.url = this.location.path();
    // console.log(this.url);
    this.active1 = false;
    this.active2 = false;
    this.active3 = false;
    if (this.url.length == 0){
      this.active1 = true;
    }
    if (this.url.includes("watchlist")){
      this.active2 = true;
    }
    if (this.url.includes("portfolio")){
      this.active3 = true;
    }
    if (!this.url.includes("watchlist") && !this.url.includes("portfolio") && !(this.url.length == 0)){
      // console.log("this happend");
      this.active1 = false;
      this.active2 = false;
      this.active3 = false;
    }
  }
  
  navSet1Active(){
    console.log("1 clicked");
    this.active1 = true;
    this.active2 = false;
    this.active3 = false;

  }
  navSet2Active(){
    this.active1 = false;
    this.active2 = true;
    this.active3 = false;
    console.log("2 clicked");

  }
  navSet3Active(){
    this.active1 = false;
    this.active2 = false;
    this.active3 = true;
    console.log("3 clicked");

  }

}
