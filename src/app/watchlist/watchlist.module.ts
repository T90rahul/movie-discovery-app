import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WatchlistComponent } from './watchlist.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    WatchlistComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: WatchlistComponent }
    ])
  ]
})
export class WatchlistModule { }