import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PacComponent } from './pac.component';

const routes: Routes = [
  { path: '', component: PacComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PacComponent,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class PacModule { }
