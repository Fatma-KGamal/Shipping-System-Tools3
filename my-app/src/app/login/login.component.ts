// src/app/login/login.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  //username: string = '';
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    const credentials = {
      //username: this.username,
      email: this.email,
      password: this.password
    };

    this.http.post('http://localhost:4300/login', credentials, { observe: 'response' }).subscribe(
        response => {
          if (response.status === 200) {
            console.log('Login successful');
            // Redirect or take further action on success
          }
        },
        error => {
          console.error('Login failed:', error);
        }
    );
  }
}
