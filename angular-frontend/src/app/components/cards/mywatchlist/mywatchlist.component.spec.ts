import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MywatchlistComponent } from './mywatchlist.component';

describe('MywatchlistComponent', () => {
  let component: MywatchlistComponent;
  let fixture: ComponentFixture<MywatchlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MywatchlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MywatchlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
