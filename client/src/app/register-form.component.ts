import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
})
export class RegisterFormComponent {
  username = '';
  password = '';
  message = '';

  constructor(private http: HttpClient) {}

  onRegister() {
    this.http.post('http://localhost:3000/register', { username: this.username, password: this.password }).subscribe(
      (response: any) => {
        this.message = 'Registration successful!';
        console.log(response);
      },
      (error) => {
        this.message = `Registration failed: ${error.error}`;
        console.error(error);
      }
    );
  }
}
