import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { DetailsComponent } from './components/details/details.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';

const routes: Routes = [
  {
    path: '',
    component: SearchComponent
  },
  {
    path: 'details',
    component: DetailsComponent,
    children: [
      {
        path: ':ticker',
        component: DetailsComponent,
      }
    ]
  },
  {
    path: 'portfolio',
    component: PortfolioComponent,
  },
  {
    path: 'watchlist',
    component: WatchlistComponent,
  },
  {
    path: '**', component: SearchComponent,
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
