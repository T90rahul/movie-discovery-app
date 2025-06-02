import { Component, OnInit } from '@angular/core';
import { WatchlistService } from './core/services/watchlist.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'movie-discovery-app';
  watchlistCount$!: Observable<number>;
  
  constructor(private watchlistService: WatchlistService) {}
  
  ngOnInit() {
    this.watchlistCount$ = this.watchlistService.getWatchlistCount$();
  }
}