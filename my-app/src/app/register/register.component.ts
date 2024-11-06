import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  user_type: string = '';
  errorMessages: { email?: string; password?: string; username?: string; phone?: string; general?: string } = {};
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    this.errorMessages = {};
    this.successMessage = '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate inputs
    if (!this.username) {
      this.errorMessages.username = 'Username is required';
    }
    if (!this.email) {
      this.errorMessages.email = 'Email is required';
    } else {
      // Email validation
      if (!emailRegex.test(this.email)) {
        this.errorMessages.email = 'Invalid email format';
      }
    }
    if (!this.password) {
      this.errorMessages.password = 'Password is required';
    } else {
      // Password validation
      if (this.password.length < 6) {
        this.errorMessages.password = 'Password must be at least 6 characters long';
      }
    }
    if (!this.password) {
      this.errorMessages.password = 'Password is required';
    }

    // If there are any errors, return early
    if (Object.keys(this.errorMessages).length > 0) {
      return;
    }

    const user = { username: this.username, email: this.email, phone: this.phone, password: this.password, user_type: this.user_type };

    this.authService.register(user).subscribe(
      response => {
        this.successMessage = response.message;
        this.successMessage = 'Registered successfully!';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error => {
        this.errorMessages.general = error.error?.error || 'Registration failed';
      }
    );
  }
}
