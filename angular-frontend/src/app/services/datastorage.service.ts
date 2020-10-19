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

  }

  watchStorage(): Observable<any> {
    return this.subject.asObservable();
  }

  get isLocalStorageSupported(): boolean {
    return !!this.localStorage;
  }

  buyStock(stock: string, quantity: number, orderPrice: number) {
    if (this.isLocalStorageSupported) {
      let myStocks = JSON.parse(this.localStorage.getItem("myStocks")) || [];
      if (myStocks.length == 0) {
        let order = { "ticker": stock, "quantity": quantity, "totalCost": orderPrice };
        myStocks.push(order);
        this.localStorage.setItem("myStocks", JSON.stringify(myStocks));
        // this.subject.next(myStocks);
      }
      else {
        for (let i = 0; i < myStocks.length; i++) {
          if (myStocks[i]["ticker"] === stock) {
            // stock already purchased
            console.log("stock already purchased");
            myStocks[i]["quantity"] = quantity + myStocks[i]["quantity"];
            myStocks[i]["totalCost"] = orderPrice + myStocks[i]["totalCost"];
            this.localStorage.setItem("myStocks", JSON.stringify(myStocks));
            this.subject.next(myStocks);
            return true;
          }
        }
        // new stock
        console.log("stock bought");
        let order = { "ticker": stock, "quantity": quantity, "totalCost": orderPrice };
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
          if (myStocks[i]["ticker"] == stock){
            myStocks[i]["quantity"] -= quantity;
            myStocks[i]["totalCost"] -= orderPrice;
            // break;
            if (myStocks[i]["quantity"] != 0){
              myUpdatedStocks.push(myStocks[i]);
            }
          }
          else{
            myUpdatedStocks.push(myStocks[i]);
          }
        }
        // if (myStocks[i]["quantity"] == 0){
        //   // delete stock

        // }
        this.localStorage.setItem("myStocks", JSON.stringify(myUpdatedStocks));
        this.subject.next(myUpdatedStocks);
        return true;
      }
    }
    return false;
  }

  getStocks() {
    let myStocks = this.localStorage.getItem("myStocks");
    return JSON.parse(myStocks);
  }
}
