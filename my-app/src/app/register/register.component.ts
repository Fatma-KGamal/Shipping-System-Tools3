import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {}

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
        },
        error => {
          console.error('Error registering user:', error);
        }
    );
  }
}
