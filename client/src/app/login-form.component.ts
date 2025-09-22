import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {
  username = '';
  password = '';
  message = '';

  constructor(private http: HttpClient) {}

  onLogin() {
    this.http.post('http://localhost:3000/login', { username: this.username, password: this.password }).subscribe(
      (response: any) => {
        this.message = 'Login successful!';
        localStorage.setItem('accessToken', response.accessToken);
        console.log(response);
      },
      (error) => {
        this.message = `Login failed: ${error.error}`;
        console.error(error);
      }
    );
  }
}
