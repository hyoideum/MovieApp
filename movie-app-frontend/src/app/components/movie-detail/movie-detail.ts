import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './movie-detail.html',
  styleUrl: './movie-detail.css'
})
export class MovieDetailComponent {
  movieId!: number;
  movie!: Movie;
  loading = true;

  constructor(private route: ActivatedRoute, private movieService: MovieService, public i18n: I18nService) {}

  ngOnInit() {
    this.movieId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadMovie();
  }

  loadMovie() {
    this.movieService.getMovieDetails(this.movieId)
      .subscribe({
        next: (data) => {
          this.movie = data,
          this.loading = false
        },
        error: (err) => {
          console.error('Greška pri učitavanju filma:', err), 
          this.loading = false
        }
      });
  }
}