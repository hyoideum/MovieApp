import { Component } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Movie } from '../../models/movie';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-movies-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './movies-list.html',
  styleUrl: './movies-list.css'
})

export class MoviesListComponent {
  movies: Movie[] = [];
  loading = true;
  rating: Record<number, number>  = {};
  lastRatedMovieId: number | null = null;
  form: any;
  // message: string | null = null;
  messageType: 'success' | 'error' | 'warning' | 'info' | null = null;
  messages: { [movieId: number]: { text: string, type: string, fade: boolean } } = {};

   constructor(private movieService: MovieService, private fb: FormBuilder, public authService: AuthService) {
    this.form = this.fb.group({
    rating: [null, [Validators.required, Validators.min(1), Validators.max(10)]]
    });
   }

   ngOnInit(): void {
    this.movieService.getMovies().subscribe({
      next: (data) => {
        this.movies = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Greška pri dohvaćanju filmova:', err);
        this.loading = false;
      }
    });
  }

  RateMovie(movieId: number) {
   if (this.form.invalid) return;

    const ratingDto = {
    value: this.form.value.rating!
  };

    this.movieService.postRating(movieId, ratingDto).subscribe({
      next: (data) => {
        this.messages[movieId] = { text: 'Hvala! Vaša ocjena je zabilježena.', type: 'success', fade: false };
        this.movies.forEach(movie => {
          if(movie.id == movieId) {
            movie.averageRating = data.averageRating;
          }
        });
        setTimeout(() => {
          this.messages[movieId].fade = true;
        }, 2500);
        setTimeout(() => {
          delete this.messages[movieId];
        }, 3000);
      },
      error: (err) => {
        if (err.status === 400 && err.error && typeof err.error === 'string' && err.error.includes('ocijenili')) {
          this.messages[movieId] = { text: 'Već ste ocijenili ovaj film.', type: 'info', fade: false };
        } else if (err.status === 401) {
          this.messages[movieId] = { text: 'Morate biti prijavljeni da biste ocijenili film.', type: 'warning', fade: false };
        } else {
          this.messages[movieId] = { text: 'Došlo je do greške pri slanju ocjene.', type: 'error', fade: false };
        }
        setTimeout(() => {
          this.messages[movieId].fade = true;
        }, 2500);
        setTimeout(() => {
          delete this.messages[movieId];
        }, 3000);
      }
    })
  }
}