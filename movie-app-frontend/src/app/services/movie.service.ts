import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie';
import { MovieDto } from '../models/dtos/movieDto';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = `${environment.apiUrl}/movies`;

  constructor(private http: HttpClient) {}

  getMovies(page: number = 1, pageSize: number = 10, sortBy: string = 'title', sortOrder: string = 'asc'): Observable<{items: Movie[], totalCount: number}> {
     let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize)
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder);
      
    return this.http.get<{items: Movie[], totalCount: number }>(this.apiUrl, {params});
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