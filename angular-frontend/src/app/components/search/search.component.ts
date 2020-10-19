import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Autocomplete
import { FormControl } from '@angular/forms';
import {DataService} from '../../services/dataservice.service'
import { debounceTime, tap } from 'rxjs/operators';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchTerm : FormControl = new FormControl();
  suggestions = [];
  isLoading = false;

  constructor(private service: DataService, private router: Router) { }

  ngOnInit(): void {

    this.searchTerm.valueChanges.pipe(debounceTime(500), tap(() => this.isLoading = true)).subscribe(
      (term) => {
        if (term != ""){
          this.suggestions = [];
          // console.log(this.suggestions.length);
          this.service.getSearchSuggestions(term).then((data) => {
            this.suggestions = data;
            this.isLoading = false;
          })
        }
        else{
          this.suggestions = [];
        }
      }
    );

  }

  searchStock(){
    this.router.navigate([`/details/${this.searchTerm.value}`]);
  }

}
