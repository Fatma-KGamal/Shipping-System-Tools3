// login.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessages: { email?: string; password?: string; general?: string } = {};
  successMessage: string = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.errorMessages = {};
    this.successMessage = '';

    // Check for empty fields
    if (!this.email) {
      this.errorMessages.email = 'Email is required';
    }
    if (!this.password) {
      this.errorMessages.password = 'Password is required';
    }

    // If there are errors, do not proceed
    if (Object.keys(this.errorMessages).length > 0) {
      return;
    }

    const credentials = {
      email: this.email,
      password: this.password
    };

    // Attempt to login
    this.authService.login(credentials).subscribe(
      response => {
        if (response.message === 'Login successful') {
          console.log('User Logged in successfully!', response);
          this.successMessage = 'Login successful!';
        }
      },
      error => {
        console.error('Login failed:', error);
        this.errorMessages.general = error.error?.error || 'Login failed';
      }
    );
  }
}
