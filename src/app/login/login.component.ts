import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, HeaderComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: FormGroup;

  showPassword = false;
  loading = false;
  showError = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.form = new FormGroup({
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  handleSubmit() {
    if (this.form.invalid) {
      this.showError = true;
      this.errorMessage = 'Please fill in all fields correctly';

      setTimeout(() => {
        this.showError = false;
        this.errorMessage = '';
      }, 3000);
      return;
    }

    this.loading = true;

    this.authService.login(this.form.value.email, this.form.value.password)
      .subscribe({
        next: (response) => {
          this.loading = false;

          localStorage.setItem('token', response.data);

          this.router.navigate(['']);
        },
        error: (error) => {
          this.loading = false;
          this.showError = true;
          this.errorMessage = error.error.message;

          setTimeout(() => {
            this.showError = false;
            this.errorMessage = '';
          }, 3000);
        }
      });
  }
}
