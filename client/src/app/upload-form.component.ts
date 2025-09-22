import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-form',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './upload-form.component.html',
  styleUrl: './upload-form.component.scss',
})
export class UploadFormComponent {
  selectedFile: File | null = null;
  uploadMessage: string = '';

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.uploadMessage = '';
  }

  onUpload() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('dataset', this.selectedFile, this.selectedFile.name);

      this.http.post('http://localhost:3000/upload', formData).subscribe(
        (response: any) => {
          this.uploadMessage = `Upload successful: ${response.message}`;
          console.log(response);
        },
        (error) => {
          this.uploadMessage = `Upload failed: ${error.message}`;
          console.error(error);
        }
      );
    } else {
      this.uploadMessage = 'Please select a file first.';
    }
  }
}
