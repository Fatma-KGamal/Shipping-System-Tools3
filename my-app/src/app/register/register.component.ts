import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';   // Declare username
  email: string = '';
  phone: string = '';       // Declare phone
  password: string = '';
  errorMessages: { email?: string; password?: string; username?: string; phone?: string; general?: string } = {};
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.errorMessages = {};
    this.successMessage = '';

    // Validate inputs
    if (!this.username) {
      this.errorMessages.username = 'Username is required';
    }
    if (!this.email) {
      this.errorMessages.email = 'Email is required';
    }
    if (!this.phone) {
      this.errorMessages.phone = 'Phone is required';
    }
    if (!this.password) {
      this.errorMessages.password = 'Password is required';
    }

    // If there are any errors, return early
    if (Object.keys(this.errorMessages).length > 0) {
      return;
    }

    const user = { username: this.username, email: this.email, phone: this.phone, password: this.password };

    this.authService.register(user).subscribe(
      response => {
        this.successMessage = response.message; // Show success message
        this.router.navigate(['/login']); // Navigate to login after registration
      },
      error => {
        this.errorMessages.general = error.error?.error || 'Registration failed';
      }
    );
  }
}
