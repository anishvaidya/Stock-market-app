import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {faFacebookSquare, faTwitter} from '@fortawesome/free-brands-svg-icons/';

@Component({
  selector: 'app-newsmodal',
  templateUrl: './newsmodal.component.html',
  styleUrls: ['./newsmodal.component.css']
})
export class NewsmodalComponent implements OnInit {
  @Input() news;
  twitterURL;
  facebookURL;
  facebookIcon;
  twitterIcon

  constructor(public activeModal: NgbActiveModal) {
    this.facebookIcon = faFacebookSquare;
    this.twitterIcon = faTwitter;
   }

  ngOnInit(): void {
    this.twitterURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(this.news.title)}&url=${encodeURIComponent(this.news.url)}`;
    this.facebookURL = `https://www.facebook.com/sharer/sharer.php?u=${this.news.url}`;
  }
}
