import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovieHubComponent } from './movie-hub/movie-hub.component';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';

const routes: Routes = [
  { path: '', component: MovieHubComponent },
  { path: 'movie-hub', redirectTo: '', pathMatch: 'full' },
  { path: 'movie/:id', component: MovieDetailComponent },
  { 
    path: 'watchlist', 
    loadChildren: () => import('./watchlist/watchlist.module').then(m => m.WatchlistModule) 
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }