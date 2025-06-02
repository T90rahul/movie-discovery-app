import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MovieCardComponent } from './components/movie-card/movie-card.component';
import { SafeUrlPipe } from './pipes/safe-url.pipe';

@NgModule({
  declarations: [
    MovieCardComponent,
    SafeUrlPipe
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    MovieCardComponent,
    SafeUrlPipe
  ]
})
export class SharedModule { }