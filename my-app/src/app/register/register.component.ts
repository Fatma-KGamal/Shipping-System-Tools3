import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

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
  errorMessages: { username?: string; email?: string; phone?: string; password?: string } = {};
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.errorMessages = {};
    this.successMessage = '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check for empty fields
    if (!this.username) {
      this.errorMessages.username = 'Username is required';
    }
    if (!this.phone) {
      this.errorMessages.phone = 'Phone is required';
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

    // If there are errors, do not proceed
    if (Object.keys(this.errorMessages).length > 0) {
      return;
    }

    const user = {
      username: this.username,
      email: this.email,
      phone: this.phone,
      password: this.password
    };

    this.authService.register(user).subscribe(
      response => {
        console.log('User registered successfully!', response);
        this.successMessage = 'Registered successfully!';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 5000);
      },
      error => {
        console.error('Error registering user:', error);
        this.errorMessages.username = error.error.username || '';
        this.errorMessages.email = error.error.email || '';
        this.errorMessages.phone = error.error.phone || '';
        this.errorMessages.password = error.error.password || 'Registration failed';
      }
    );
  }
}
