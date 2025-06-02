import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MovieDetailComponent } from './movie-detail.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    MovieDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    MovieDetailComponent
  ]
})
export class MovieDetailModule { }