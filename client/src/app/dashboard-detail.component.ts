import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-detail',
  standalone: true,
  imports: [CommonModule, HttpClientModule, DatePipe],
  templateUrl: './dashboard-detail.component.html',
  styleUrl: './dashboard-detail.component.scss',
})
export class DashboardDetailComponent implements OnInit {
  dashboard: any = null;
  message: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const dashboardId = params.get('id');
      if (dashboardId) {
        this.fetchDashboardDetails(dashboardId);
      }
    });
  }

  fetchDashboardDetails(id: string) {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      this.message = 'Please log in to view dashboard details.';
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(`http://localhost:3000/dashboards/${id}`, { headers }).subscribe(
      (response: any) => {
        this.dashboard = response;
        this.message = '';
      },
      (error) => {
        this.message = `Failed to fetch dashboard details: ${error.error}`;
        console.error(error);
      }
    );
  }
}
