import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  template: '<router-outlet></router-outlet>',
  styleUrl: './app.css'
})
export class App {
  title = 'FWFPS';
}
