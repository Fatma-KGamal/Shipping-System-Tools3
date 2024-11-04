import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface LoginResponse {
  message: string;
  userId: number; // Expecting userId in the response
}

interface RegisterResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userId: number | null = null;

  constructor(private http: HttpClient) {}

  // Login method
  login(credentials: { email: string, password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('http://localhost:4300/login', credentials).pipe(
      tap(response => {
        if (response.message === 'Login successful') {
          this.userId = response.userId;  // Store userId in the service
          localStorage.setItem('userId', String(response.userId));  // Save to localStorage for persistent access
        }
      })
    );
  }

  // Register method
  register(user: { email: string, password: string }): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>('http://localhost:4300/register', user);
  }

  getUserId(): number | null {
    if (this.userId === null) {
      const storedUserId = localStorage.getItem('userId');
      this.userId = storedUserId ? Number(storedUserId) : null;
    }
    return this.userId;
  }

  logout() {
    this.userId = null;
    localStorage.removeItem('userId');  // Clear userId on logout
  }

  isLoggedIn(): boolean {
    return this.getUserId() !== null;
  }
}
