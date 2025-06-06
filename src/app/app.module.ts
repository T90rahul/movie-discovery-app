import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { MovieHubModule } from './movie-hub/movie-hub.module';
import { MovieDetailModule } from './movie-detail/movie-detail.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    MovieHubModule,
    MovieDetailModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }