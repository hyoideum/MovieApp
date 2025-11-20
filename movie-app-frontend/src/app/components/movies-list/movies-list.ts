import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Movie } from '../../models/movie';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-movies-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './movies-list.html',
  styleUrl: './movies-list.css'
})
export class MoviesListComponent {
  @Input() initialValue?: number | null;
  @Output() ratingChanged = new EventEmitter<number>();

  movies: Movie[] = [];
  page: number = 1;
  pageSize: number = 5;
  sortBy: string = 'title';
  sortOrder: string = 'asc';
  totalCount: number = 0;
  totalPages: number = 1;
  loading = true;
  stars = [1,2,3,4,5,6,7,8,9,10];

  tempRatings: { [movieId: number]: number | null } = {};
  messages: { [movieId: number]: { text: string, type: string, fade: boolean } } = {};

  constructor(
    private movieService: MovieService,
    public authService: AuthService,
    public i18n: I18nService
  ) {
    this.loadMovies();
  }

  loadMovies() {
    this.loading = true;
    this.movieService.getMovies(this.page, this.pageSize, this.sortBy, this.sortOrder).subscribe({
      next: (data) => {
        this.movies = data.items;
        this.totalCount = data.totalCount;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);

        // postavi tempRatings za svaki film (placeholder / početna vrijednost)
        this.movies.forEach(movie => {
          this.tempRatings[movie.id] = movie.userRating || null;
        });

        this.loading = false;
      },
      error: (err) => {
        console.error(this.i18n.get("messages.errorLoadingMovies"), err);
        this.loading = false;
      }
    });
  }

  RateMovie(movieId: number) {
    const ratingValue = this.tempRatings[movieId];
    if (!ratingValue || ratingValue < 1 || ratingValue > 10) return;

    const ratingDto = { value: ratingValue };

    this.movieService.postRating(movieId, ratingDto).subscribe({
      next: (data) => {
        this.messages[movieId] = { text: 'Hvala! Vaša ocjena je zabilježena.', type: 'success', fade: false };

        const movie = this.movies.find(m => m.id === movieId);
        if (movie) {
          movie.userRating = ratingValue;
          movie.averageRating = data.averageRating;
        }

        setTimeout(() => this.messages[movieId].fade = true, 2500);
        setTimeout(() => delete this.messages[movieId], 3000);
      },
      error: (err) => {
        if (err.status === 400 && err.error && typeof err.error === 'string' && err.error.includes('ocijenili')) {
          this.messages[movieId] = { text: 'Već ste ocijenili ovaj film.', type: 'info', fade: false };
        } else if (err.status === 401) {
          this.messages[movieId] = { text: 'Morate biti prijavljeni da biste ocijenili film.', type: 'warning', fade: false };
        } else {
          this.messages[movieId] = { text: 'Došlo je do greške pri slanju ocjene.', type: 'error', fade: false };
        }

        setTimeout(() => this.messages[movieId].fade = true, 2500);
        setTimeout(() => delete this.messages[movieId], 3000);
      }
    });
  }

  setTempRating(movieId: number, value: number) {
    this.tempRatings[movieId] = value;
  }

  isStarFilled(movieId: number, star: number): boolean {
    return (this.tempRatings[movieId] || 0) >= star;
  }

  nextPage() {
    if (this.page * this.pageSize < this.totalCount) {
      this.page++;
      this.loadMovies();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadMovies();
    }
  }

  onSortChange(event: any) {
    this.sortBy = event.target.value;
    this.loadMovies();
  }

  onSortOrderChange(event: any) {
    this.sortOrder = event.target.value;
    this.loadMovies();
  }
}
