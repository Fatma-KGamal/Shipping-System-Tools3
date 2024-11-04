import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

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

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.errorMessages = {};
    this.successMessage = '';

    if (!this.email) {
      this.errorMessages.email = 'Email is required';
    }
    if (!this.password) {
      this.errorMessages.password = 'Password is required';
    }

    if (Object.keys(this.errorMessages).length > 0) {
      return;
    }

    const credentials = { email: this.email, password: this.password };

    this.authService.login(credentials).subscribe(
      response => {
        if (response.message === 'Login successful') {
          this.successMessage = 'Login successful!';
          const userId = this.authService.getUserId(); // Retrieve user ID
          console.log('Logged in user ID:', userId); // You can use this ID in other functions
          this.router.navigate(['/home']);  // Redirect to 'home'
        }
      },
      error => {
        this.errorMessages.general = error.error?.error || 'Login failed';
      }
    );
  }
}
