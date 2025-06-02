import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MovieHubComponent } from './movie-hub.component';
import { SharedModule } from '../shared/shared.module';
import { SearchModule } from '../search/search.module';

@NgModule({
  declarations: [
    MovieHubComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    SearchModule
  ],
  exports: [
    MovieHubComponent
  ]
})
export class MovieHubModule { }