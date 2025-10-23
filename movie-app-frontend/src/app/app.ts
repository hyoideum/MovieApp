import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { I18nService } from './services/i18n.service';
import { AuthService } from './services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('movie-app-frontend');

  constructor(public i18nService: I18nService, public authService: AuthService) {}

  changeLanguage(lang: 'en' | 'hr') {
    this.i18nService.setLanguage(lang);
  }

  logout() {
    Swal.fire({
    title: this.i18nService.get('routes.logout'),
    text: this.i18nService.get('messages.logoutConfirm'),
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: this.i18nService.get('login.logoutYes'),
    cancelButtonText: this.i18nService.get('form.cancel')
  }).then((result) => {
    if (result.isConfirmed) {
      this.authService.logout();
      Swal.fire({
        title: this.i18nService.get('messages.logoutSuccessTitle'),
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    }
  });
  }
}