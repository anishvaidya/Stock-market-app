import { Injectable } from '@angular/core';

// watch for value changes
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatastorageService {
  localStorage: Storage;

  // create subject
  private subject = new Subject();

  constructor() {
    this.localStorage = window.localStorage;
    // this.localStorage.setItem("myStocks", JSON.stringify([]));
    // this.localStorage.setItem("myWatchlist", JSON.stringify([]));
  }

  watchStorage(): Observable<any> {
    return this.subject.asObservable();
  }

  get isLocalStorageSupported(): boolean {
    return !!this.localStorage;
  }

  buyStock(stock: string, name: string, quantity: number, orderPrice: number) {
    if (this.isLocalStorageSupported) {
      let myStocks = JSON.parse(this.localStorage.getItem("myStocks")) || [];
      if (myStocks.length == 0) {
        let order = { "ticker": stock, "name": name, "quantity": Number(quantity.toFixed(2)), "totalCost": orderPrice };
        myStocks.push(order);
        this.localStorage.setItem("myStocks", JSON.stringify(myStocks));
        // this.subject.next(myStocks);
      }
      else {
        for (let i = 0; i < myStocks.length; i++) {
          if (myStocks[i]["ticker"] === stock) {
            // stock already purchased
            console.log("stock already purchased");
            myStocks[i]["quantity"] = Number((quantity + myStocks[i]["quantity"]).toFixed(2));
            myStocks[i]["totalCost"] = orderPrice + myStocks[i]["totalCost"];
            this.localStorage.setItem("myStocks", JSON.stringify(myStocks));
            this.subject.next(myStocks);
            return true;
          }
        }
        // new stock
        console.log("stock bought");
        let order = { "ticker": stock, "name": name, "quantity": Number(quantity.toFixed(2)), "totalCost": orderPrice };
        myStocks.push(order);
        myStocks.sort((a, b) => a.ticker.localeCompare(b.ticker));
        this.localStorage.setItem("myStocks", JSON.stringify(myStocks));
        // this.subject.next(myStocks);
      }

      return true;
    }
    return false;
  }

  sellStock(stock: string, quantity: number, orderPrice: number) {
    if (this.isLocalStorageSupported) {
      let myStocks = JSON.parse(this.localStorage.getItem("myStocks")) || [];
      let myUpdatedStocks = [];
      if (myStocks.length != 0) {
        for (var i = 0; i < myStocks.length; i++) {
          if (myStocks[i]["ticker"] == stock) {
            myStocks[i]["quantity"] = Number((myStocks[i]["quantity"] - quantity).toFixed(2));
            myStocks[i]["totalCost"] -= orderPrice;
            // break;
            if (myStocks[i]["quantity"] != 0) {
              myUpdatedStocks.push(myStocks[i]);
            }
          }
          else {
            myUpdatedStocks.push(myStocks[i]);
          }
        }
        this.localStorage.setItem("myStocks", JSON.stringify(myUpdatedStocks));
        this.subject.next(myUpdatedStocks);
        return true;
      }
    }
    return false;
  }

  getStocks() {
    let myStocks = JSON.parse(this.localStorage.getItem("myStocks")) || [];
    return myStocks;
  }

  addToWatchlist(ticker: string, companyName: string) {
    if (this.isLocalStorageSupported) {
      let myWatchlist = JSON.parse(this.localStorage.getItem("myWatchlist")) || [];
      // if (myWatchlist.length == 0){

      // }
      myWatchlist.push({"ticker": ticker, "name": companyName});
      myWatchlist.sort((a, b) => a.ticker.localeCompare(b.ticker));
      this.localStorage.setItem("myWatchlist", JSON.stringify(myWatchlist));
      this.subject.next(myWatchlist);
      return true;
    }
    return false;
  }

  removeFromWatchlist(ticker: string) {
    // assuming ticker is present in the watchlist
    if (this.isLocalStorageSupported) {
      let myUpdatedWatchlist = [];
      let myWatchlist = this.seeWatchlist();
      for (let i = 0; i < myWatchlist.length; i++) {
        if (myWatchlist[i].ticker !== ticker) {
          myUpdatedWatchlist.push(myWatchlist[i]);
        }
      }
      this.localStorage.setItem("myWatchlist", JSON.stringify(myUpdatedWatchlist));
      this.subject.next(myUpdatedWatchlist);
      return true;
    }
    return false;
  }

  seeWatchlist() {
    let myWatchlist = JSON.parse(this.localStorage.getItem("myWatchlist")) || [];
    return myWatchlist;
  }

}
