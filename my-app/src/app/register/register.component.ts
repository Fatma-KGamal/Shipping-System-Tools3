import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Import Router

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

  constructor(private http: HttpClient, private router: Router) {} // Inject Router

  onSubmit() {
    const user = {
      username: this.username,
      email: this.email,
      phone: this.phone,
      password: this.password
    };

    this.http.post('http://localhost:4300/register', user).subscribe(
        response => {
          console.log('User registered successfully!', response);
          // Navigate to the login page on successful registration
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Error registering user:', error);
          // Show alert message on error
          alert('Error registering user: ' + error.error.message || error.message);
        }
    );
  }
}
