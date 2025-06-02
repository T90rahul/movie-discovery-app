import { Component, OnInit } from '@angular/core';
import { WatchlistService } from '../core/services/watchlist.service';
import { Movie } from '../core/models/movie.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss']
})
export class WatchlistComponent implements OnInit {
  watchlist$!: Observable<Movie[]>;

  constructor(private watchlistService: WatchlistService) { }

  ngOnInit(): void {
    this.watchlist$ = this.watchlistService.getWatchlist();
  }

  clearWatchlist(): void {
    this.watchlistService.clearWatchlist();
  }
}