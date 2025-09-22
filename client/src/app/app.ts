import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { RegisterFormComponent } from './register-form.component';
import { LoginFormComponent } from './login-form.component';
import { UploadFormComponent } from './upload-form.component';
import { DatasetListComponent } from './dataset-list.component';
import { DashboardCreateComponent } from './dashboard-create.component';
import { DashboardListComponent } from './dashboard-list.component';
import { DashboardDetailComponent } from './dashboard-detail.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RegisterFormComponent, LoginFormComponent, UploadFormComponent, DatasetListComponent, DashboardCreateComponent, DashboardListComponent, DashboardDetailComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'client';
}
