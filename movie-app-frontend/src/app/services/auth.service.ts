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

  constructor(private http: HttpClient) {
    console.log('AuthService initialized');
    this.checkTokenExpiration();
  }

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
    const token = localStorage.getItem(this.tokenKey);
    if (token && this.jwtHelper.isTokenExpired(token)) {
      this.logout();
      return null;
    }
    return token;
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  // checkTokenExpiration() {
  //   const token = localStorage.getItem(this.tokenKey);
  //   if (!token || this.jwtHelper.isTokenExpired(token)) {
  //     this.logout();
  //   } else {
  //     this.isLoggedIn.set(true);
  //   }
  // }

  checkTokenExpiration() {
  const token = this.getToken();
  console.log('🟡 Provjera tokena...');

  if (!token) {
    console.warn('⚠️ Nema tokena u localStorage.');
    this.logout();
    return;
  }

  try {
    const decoded: any = this.jwtHelper.decodeToken(token);
    const exp = decoded?.exp ? new Date(decoded.exp * 1000) : null;
    const now = new Date();
    const expired = this.jwtHelper.isTokenExpired(token);

    console.log('🔹 Trenutno vrijeme:', now.toISOString());
    console.log('🔹 Token exp (UTC):', exp ? exp.toISOString() : 'nema exp');
    console.log('🔹 Token exp (lokalno):', exp ? exp.toLocaleString() : 'nema exp');
    console.log('🔹 JWT Helper kaže da je istekao:', expired);

    if (expired) {
      console.warn('🚫 Token je istekao — korisnik će biti odjavljen.');
      this.logout();
    } else {
      console.log('✅ Token je još važeći.');
    }
  } catch (e) {
    console.error('❌ Greška pri dekodiranju tokena:', e);
    this.logout();
  }
}
}
