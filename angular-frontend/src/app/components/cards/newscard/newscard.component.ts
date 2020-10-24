import { Component, OnInit, Input } from '@angular/core';

//modal
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {NewsmodalComponent} from '../../modals/newsmodal/newsmodal.component';

@Component({
  selector: 'app-newscard',
  templateUrl: './newscard.component.html',
  styleUrls: ['./newscard.component.css']
})
export class NewscardComponent implements OnInit {
  @Input() news;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    console.log(this.news);
  }

  openNewsModal(){
    console.log(this.news.title, " clicked");
    // const modalRef = this.modalService.open(NewsmodalComponent, { backdrop: 'static' });
    const modalRef = this.modalService.open(NewsmodalComponent);
    modalRef.componentInstance.news = this.news;

  }

}
