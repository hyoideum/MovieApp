import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = 'https://localhost:44354/api/auth';
  private tokenKey = 'auth_token';

  isLoggedIn = signal<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

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
}
