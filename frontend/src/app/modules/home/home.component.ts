import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HomeComponent implements OnInit {
  currentYear = 2025;
  upcomingYear = 2026;
  
  fiscalYears = [
    { 
      year: this.currentYear, 
      workplan: `Workplan 0 - ${this.currentYear}.0`, 
      totalTasks: 150, 
      completion: 75,
      status: 'current'
    },
    { 
      year: this.upcomingYear, 
      workplan: `Workplan 0 - ${this.upcomingYear}.0`, 
      totalTasks: 0, 
      completion: 0,
      status: 'upcoming'
    }
  ];

  selectedWorkplan: string = '';
  olderWorkplans: string[] = [
    'Workplan 0 - 2024.0',
    'Workplan 0 - 2023.0', 
    'Workplan 0 - 2022.0',
    'Workplan 0 - 2021.0',
    'Workplan 0 - 2020.0',
    'Workplan 0 - 2019.0',
    'Workplan 0 - 2018.0',
    'Workplan 0 - 2017.0',
    'Workplan 0 - 2016.0',
    'Workplan 0 - 2015.0'
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  selectWorkplan(workplan: string): void {
    console.log('Selected workplan:', workplan);
    this.selectedWorkplan = workplan;
    
    // Navigate to PPS with workplan information
    this.router.navigate(['/pps'], { 
      queryParams: { 
        workplan: workplan,
        year: this.getYearFromWorkplan(workplan)
      }
    });
  }

  getYearFromWorkplan(workplan: string): string {
    // Extract year from workplan name (e.g., "Workplan 0 - 2025.0" -> "2025")
    const match = workplan.match(/(\d{4})/);
    return match ? match[1] : '2025';
  }

  onWorkplanSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    if (select.value) {
      this.selectWorkplan(select.value);
      // Reset the select dropdown after navigation
      setTimeout(() => {
        select.value = '';
      }, 100);
    }
  }

  navigateToPPS(): void {
    if (this.selectedWorkplan) {
      this.router.navigate(['/pps'], { 
        queryParams: { workplan: this.selectedWorkplan }
      });
    }
  }

  // Navigation methods for top menu
  navigateToReports(): void {
    // For now, show alert - can implement when Report module is ready
    alert('Report Module - Coming Soon!\n\nThis will navigate to comprehensive reporting and analytics dashboard.');
  }

  navigateToTasks(): void {
    // For now, show alert - can implement when TO module is ready  
    alert('TO (Task Operations) Module - Coming Soon!\n\nThis will navigate to task management and operations tracking.');
  }

  navigateToGroupPAC(): void {
    // For now, navigate to PAC with default ID
    this.router.navigate(['/pac', '11a'], {
      queryParams: {
        fromHome: true,
        workplan: this.fiscalYears[0].workplan
      }
    });
  }

  logout(): void {
    // Navigate to login page
    this.router.navigate(['/auth/login']);
  }
}
