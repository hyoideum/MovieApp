import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Movie, Rating } from '../models/movie';
import { MovieDto, RatingDto } from '../models/dtos/movieDto';
import { environment } from '../../environments/environment.development';
import { PagedResultDto } from '../models/dtos/PagedResultDto';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = `${environment.apiUrl}/movies`;

  constructor(private http: HttpClient) {}

  getMovies(page: number = 1, pageSize: number = 10, sortBy: string = 'title', sortOrder: string = 'asc'): Observable<PagedResultDto<Movie>> {
     let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize)
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder);
      
    return this.http.get<PagedResultDto<Movie>>(this.apiUrl, {params});
  }

  getMovieDetails(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/${id}`);
  }

  postRating(id: number, value: RatingDto): Observable<Movie> {
    return this.http.post<Movie>(`${this.apiUrl}/${id}/ratings`, value);
  }

  postMovie(movie: MovieDto): Observable<Movie> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Movie>(this.apiUrl, movie, {headers});
  }
}