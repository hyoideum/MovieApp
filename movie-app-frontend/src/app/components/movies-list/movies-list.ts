import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Movie } from '../../models/movie';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { I18nService } from '../../services/i18n.service';
import { RatingDto } from '../../models/dtos/movieDto';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

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

  allMovies: Movie[] = [];
  movies: Movie[] = [];
  page: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  sortBy: string = 'title';
  sortOrder: string = 'asc';
  loading = true;
  stars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  searchTerm$ = new Subject<string>();

  tempRatings: { [movieId: number]: number | null } = {};
  messages: { [movieId: number]: { text: string, type: string, fade: boolean } } = {};

  constructor(
    private movieService: MovieService,
    public authService: AuthService,
    public i18n: I18nService
  ) { }

  ngOnInit() {
    this.loadMovies();

    this.searchTerm$
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(term => {
        this.applyFilter(term);
      });
  }

  loadMovies() {
    this.loading = true;
    this.movieService.getMovies(this.page, this.pageSize, this.sortBy, this.sortOrder).subscribe({
      next: (data) => {
        if (this.page === 1) {
          this.allMovies = data.items;
        } else {
          this.allMovies.push(...data.items);
        }

        this.movies = [...this.allMovies];
        this.movies = [...this.allMovies];
        this.totalPages = data.totalPages;
        this.allMovies.forEach(movie => {
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

    const ratingDto: RatingDto = { value: ratingValue };

    this.movieService.postRating(movieId, ratingDto).subscribe({
      next: (data) => {
        this.messages[movieId] = { text: 'Hvala! Vaša ocjena je zabilježena.', type: 'success', fade: false };

        const movie = this.allMovies.find(m => m.id === movieId);
        if (movie) {
          movie.userRating = ratingValue;
          movie.averageRating = data.averageRating;
        }

        this.fadeMessage(movieId);
      },
      error: (err) => {
        if (err.status === 400 && err.error && typeof err.error === 'string' && err.error.includes('ocijenili')) {
          this.messages[movieId] = { text: 'Već ste ocijenili ovaj film.', type: 'info', fade: false };
        } else if (err.status === 401) {
          this.messages[movieId] = { text: 'Morate biti prijavljeni da biste ocijenili film.', type: 'warning', fade: false };
        } else {
          this.messages[movieId] = { text: 'Došlo je do greške pri slanju ocjene.', type: 'error', fade: false };
        }

        this.fadeMessage(movieId);
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
    if (this.page < this.totalPages) {
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

  fadeMessage(movieId: number, delay: number = 2500) {
    setTimeout(() => this.messages[movieId].fade = true, delay);
    setTimeout(() => delete this.messages[movieId], delay + 500);
  }

  onSearchChange(term: string) {
    this.searchTerm$.next(term);
  }

  applyFilter(term: string) {
    if (!term) {
      this.movies = [...this.allMovies];
    } else {
      const lowerTerm = term.toLowerCase();
      this.movies = this.allMovies.filter(m =>
        m.title.toLowerCase().includes(lowerTerm) ||
        m.genre.toLowerCase().includes(lowerTerm)
      );
    }
  }
}