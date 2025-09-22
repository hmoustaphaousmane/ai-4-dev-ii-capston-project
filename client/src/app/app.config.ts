import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { RegisterFormComponent } from './register-form.component';
import { LoginFormComponent } from './login-form.component';
import { UploadFormComponent } from './upload-form.component';
import { DatasetListComponent } from './dataset-list.component';
import { DashboardCreateComponent } from './dashboard-create.component';
import { DashboardListComponent } from './dashboard-list.component';
import { DashboardDetailComponent } from './dashboard-detail.component';

const routes: Routes = [
  { path: 'register', component: RegisterFormComponent },
  { path: 'login', component: LoginFormComponent },
  { path: 'upload', component: UploadFormComponent },
  { path: 'datasets', component: DatasetListComponent },
  { path: 'create-dashboard', component: DashboardCreateComponent },
  { path: 'dashboards', component: DashboardListComponent },
  { path: 'dashboards/:id', component: DashboardDetailComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withFetch()),
    provideRouter(routes)
  ]
};
