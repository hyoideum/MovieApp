import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  form: any;

  message = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submit() {
    if(this.form.invalid) return;

     this.auth.register(this.form.value).subscribe({
      next: () => {
        this.message = 'Registracija uspješna! Sada se možete prijaviti.';
        this.router.navigate(['/login']);
      },
      error: () => (this.errorMessage = 'Došlo je do greške pri registraciji.')
    });
  }
}
