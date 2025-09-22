import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink, DatePipe],
  templateUrl: './dashboard-list.component.html',
  styleUrl: './dashboard-list.component.scss',
})
export class DashboardListComponent implements OnInit {
  dashboards: any[] = [];
  message: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchDashboards();
  }

  fetchDashboards() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      this.message = 'Please log in to view dashboards.';
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get('http://localhost:3000/dashboards', { headers }).subscribe(
      (response: any) => {
        this.dashboards = response;
        this.message = '';
      },
      (error) => {
        this.message = `Failed to fetch dashboards: ${error.error}`;
        console.error(error);
      }
    );
  }

  onDeleteDashboard(id: string) {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      this.message = 'Please log in to delete a dashboard.';
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.delete(`http://localhost:3000/dashboards/${id}`, { headers }).subscribe(
      (response: any) => {
        this.message = 'Dashboard deleted successfully!';
        this.fetchDashboards(); // Refresh the list
      },
      (error) => {
        this.message = `Failed to delete dashboard: ${error.error}`;
        console.error(error);
      }
    );
  }
}
