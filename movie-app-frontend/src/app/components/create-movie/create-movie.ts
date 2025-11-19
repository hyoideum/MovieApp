import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { dateTimestampProvider } from 'rxjs/internal/scheduler/dateTimestampProvider';
import { MovieDto } from '../../models/dtos/movieDto';
import { Router } from '@angular/router';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-create-movie',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-movie.html',
  styleUrl: './create-movie.css'
})
export class CreateMovieComponent {
  loading = true;
  form: any;
  message: string | null = null;
  serverErrors: any = {};

  constructor(private movieService: MovieService, private fb: FormBuilder, private router: Router, public i18n: I18nService) {
    this.form = this.fb.group({
    title: ["", [Validators.required, Validators.maxLength(250)]],
    genre: ["", [Validators.required, Validators.maxLength(100)]],
    year: [null, [Validators.required, Validators.min(1900), Validators.max(dateTimestampProvider.now())]]
    });
  }

  CreateMovie() {
    if (this.form.invalid) return;

    const movie: MovieDto = {
      title: this.form.value.title,
      genre: this.form.value.genre,
      year: this.form.value.year
    }

    this.movieService.postMovie(movie).subscribe({
      next: (data) => {
        alert(this.i18n.get("messages.movieAdded"));
        this.form.reset();
        this.router.navigate(['/']);
      }, error: (err) => {
        if (err.status === 400 && err.error?.errors) {
          this.serverErrors = err.error.errors;
        }
      }
    })
  }
}
