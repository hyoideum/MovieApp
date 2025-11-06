import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private jwtHelper = new JwtHelperService();
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'auth_token';

  isLoggedIn = signal<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  // private hasValidToken(): boolean {
  //   const token = localStorage.getItem('token');
  //   return token != null && !this.jwtHelper.isTokenExpired(token);
  // }

  register(data: { username: string; password: string }) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

   login(data: { username: string; password: string }) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, data).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey, response.token);
        this.isLoggedIn.set(true);
      })
    );
  }

  // checkIsLoggedIn(): boolean {
  //   const token = this.getToken();
  //   if (!token) return false;

  //   try {
  //     const payload = JSON.parse(atob(token.split('.')[1]));
  //     const isExpired = Date.now() >= payload.exp * 1000;
  //     if (isExpired) {
  //       this.removeToken();
  //       return false;
  //     }
  //     return true;
  //   } catch {
  //     this.removeToken();
  //     return false;
  //   }
  // }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.isLoggedIn.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  checkTokenExpiration() {
    const token = localStorage.getItem('token');
    if (!token || this.jwtHelper.isTokenExpired(token)) {
      this.logout();
    }
  }
}
