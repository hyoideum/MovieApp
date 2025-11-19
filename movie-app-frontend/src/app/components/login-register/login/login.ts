import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { I18nService } from '../../../services/i18n.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
 form: any;

   errorMessage = '';

   constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, public i18n: I18nService) {
    this.form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
    });
   }

   submit() {
    if (this.form.invalid) return;

    this.auth.login(this.form.value).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => (this.errorMessage = this.i18n.get("messages.loginError"))
    });
  }
}
