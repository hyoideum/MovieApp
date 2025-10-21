import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie';
import { MovieDto } from '../models/dtos/movieDto';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'https://localhost:44354/api/movies';

  constructor(private http: HttpClient) {}

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl);
  }

  getMovieDetails(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/${id}`);
  }

  postRating(id: number, value: any): Observable<Movie> {
    return this.http.post<Movie>(`${this.apiUrl}/${id}/ratings`, value);
  }

  postMovie(movie: MovieDto): Observable<Movie> {
    return this.http.post<Movie>(this.apiUrl, movie);
  }
}