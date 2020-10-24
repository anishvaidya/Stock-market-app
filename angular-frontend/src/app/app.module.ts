import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { SearchComponent } from './components/search/search.component';
import { DetailsComponent } from './components/details/details.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';

// fontawesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


// autocomplete practice
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// material tabs
import {MatTabsModule} from '@angular/material/tabs';

//modal
import { BuyComponent } from './components/modals/buy/buy.component';
import { MyportfolioComponent } from './components/cards/myportfolio/myportfolio.component';
import { SellComponent } from './components/modals/sell/sell.component';
import { MywatchlistComponent } from './components/cards/mywatchlist/mywatchlist.component';
import { NewscardComponent } from './components/cards/newscard/newscard.component';
import { NewsmodalComponent } from './components/modals/newsmodal/newsmodal.component';

// highcharts
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartComponent } from './components/chart/chart.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    SearchComponent,
    DetailsComponent,
    WatchlistComponent,
    PortfolioComponent,
    BuyComponent,
    MyportfolioComponent,
    SellComponent,
    MywatchlistComponent,
    NewscardComponent,
    NewsmodalComponent,
    ChartComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    NgbModule,
    MatTabsModule,
    FontAwesomeModule,
    HighchartsChartModule
  ],
  providers: [],
  bootstrap: [AppComponent],

  entryComponents: [BuyComponent]
})
export class AppModule { }
