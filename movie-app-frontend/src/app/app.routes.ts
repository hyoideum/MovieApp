import { Routes } from '@angular/router';
import { MoviesListComponent } from './components/movies-list/movies-list';
import { MovieDetailComponent } from './components/movie-detail/movie-detail';
import { CreateMovieComponent } from './components/create-movie/create-movie';
import { LoginComponent } from './components/login-register/login/login';
import { RegisterComponent } from './components/login-register/register/register';

export const routes: Routes = [
    { path: '', redirectTo: 'movies', pathMatch: 'full' },
    { path: 'movies', component: MoviesListComponent},
    { path: 'movies/:id', component: MovieDetailComponent},
    { path: 'add-movie', component: CreateMovieComponent},
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: '**', redirectTo: 'movies'}
];