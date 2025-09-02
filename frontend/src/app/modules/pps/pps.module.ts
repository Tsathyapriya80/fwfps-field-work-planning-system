import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PpsComponent } from './pps.component';

const routes: Routes = [
  { path: '', component: PpsComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PpsComponent,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class PpsModule { }
