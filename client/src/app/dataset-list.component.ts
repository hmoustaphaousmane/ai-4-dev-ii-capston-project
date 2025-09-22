import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dataset-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './dataset-list.component.html',
  styleUrl: './dataset-list.component.scss',
})
export class DatasetListComponent implements OnInit {
  datasets: any[] = [];
  message: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchDatasets();
  }

  fetchDatasets() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      this.message = 'Please log in to view datasets.';
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get('http://localhost:3000/datasets', { headers }).subscribe(
      (response: any) => {
        this.datasets = response;
        this.message = '';
      },
      (error) => {
        this.message = `Failed to fetch datasets: ${error.error}`;
        console.error(error);
      }
    );
  }
}
