import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { HomeComponent } from './home/components/home/home.component';
import { PpsComponent } from './modules/pps/pps.component';
import { PacComponent } from './modules/pac/pac.component';
import { ModelComponent } from './modules/model/model.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth/login',
    component: LoginComponent
  },
  {
    path: 'fwfps',
    component: HomeComponent
  },
  {
    path: 'model',
    component: ModelComponent
  },
  {
    path: 'pps',
    component: PpsComponent
  },
  {
    path: 'pac/:id',
    component: PacComponent
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];
