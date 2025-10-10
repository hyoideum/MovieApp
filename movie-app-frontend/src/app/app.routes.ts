import { Routes } from '@angular/router';
import { MoviesListComponent } from './components/movies-list/movies-list';
import { MovieDetailComponent } from './components/movie-detail/movie-detail';
import { CreateMovieComponent } from './components/create-movie/create-movie';
import { LoginRegisterComponent } from './components/login-register/login-register';

export const routes: Routes = [
    { path: '', redirectTo: 'movies', pathMatch: 'full' },
    { path: 'movies', component: MoviesListComponent},
    { path: 'movies/:id', component: MovieDetailComponent},
    { path: 'add-movie', component: CreateMovieComponent},
    { path: 'login', component: LoginRegisterComponent},
    { path: '**', redirectTo: 'movies'}
];
