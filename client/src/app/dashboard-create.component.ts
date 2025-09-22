import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-create',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './dashboard-create.component.html',
  styleUrl: './dashboard-create.component.scss',
})
export class DashboardCreateComponent implements OnInit {
  title: string = '';
  description: string = '';
  selectedDatasets: string[] = [];
  availableDatasets: any[] = [];
  message: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchAvailableDatasets();
  }

  fetchAvailableDatasets() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      this.message = 'Please log in to view datasets.';
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get('http://localhost:3000/datasets', { headers }).subscribe(
      (response: any) => {
        this.availableDatasets = response;
      },
      (error) => {
        this.message = `Failed to fetch available datasets: ${error.error}`;
        console.error(error);
      }
    );
  }

  onCreateDashboard() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      this.message = 'Please log in to create a dashboard.';
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const newDashboard = {
      title: this.title,
      description: this.description,
      datasets: this.selectedDatasets,
      layout: {}, // Initial empty layout
    };

    this.http.post('http://localhost:3000/dashboards', newDashboard, { headers }).subscribe(
      (response: any) => {
        this.message = 'Dashboard created successfully!';
        console.log(response);
        this.router.navigate(['/dashboards']);
      },
      (error) => {
        this.message = `Failed to create dashboard: ${error.error}`;
        console.error(error);
      }
    );
  }
}
