import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  template: `
    <div class="fwfps-container">
      <!-- FDA Header -->
      <div class="fda-header">
        <div class="header-bar">
          <div class="fda-title">U.S FOOD AND DRUG ADMINISTRATION / ORA - OFFICE OF REGULATORY AFFAIRS</div>
          <div class="system-title">
            <span class="model-badge">MODEL</span>
            <span class="system-name">FIELD WORK FORCE PLANNING SYSTEM</span>
          </div>
        </div>
        
        <!-- Navigation Bar -->
        <div class="nav-bar">
          <button class="nav-btn active">
            <i class="fas fa-home"></i>
            <span>FWFPS HOME</span>
          </button>
          <button class="nav-btn" (click)="navigateToModel()">
            <i class="fas fa-sitemap"></i>
            <span>MODEL MODULE</span>
          </button>
          <button class="nav-btn" (click)="navigateToReports()">
            <i class="fas fa-chart-bar"></i>
            <span>REPORT MODULE</span>
          </button>
          <button class="nav-btn" (click)="navigateToTasks()">
            <i class="fas fa-tasks"></i>
            <span>TO MODULE</span>
          </button>
          <button class="nav-btn" (click)="navigateToGroupPAC()">
            <i class="fas fa-users"></i>
            <span>GROUP PAC UTILITY</span>
          </button>
          <button class="nav-btn logout" (click)="logout()">
            <i class="fas fa-sign-out-alt"></i>
            <span>LOGOUT</span>
          </button>
        </div>
      </div>
      <!-- Main Content -->
      <main class="main-content">
        <div class="page-header">
          <h1><i class="fas fa-home"></i> FWFPS WORKPLAN SELECTION</h1>
        </div>

        <div *ngIf="!showDashboard" class="workplan-sections">
          <!-- Current Year Workplan -->
          <div class="workplan-card current-year">
            <div class="card-header">
              <h2>FISCAL YEAR {{ currentYear }} (CURRENT)</h2>
            </div>
            <div class="card-content">
              <div class="workplan-item">
                <div class="workplan-icon">📋</div>
                <div class="workplan-info">
                  <span class="workplan-title">Workplan {{ currentYear }}</span>
                  <span class="workplan-status active">ACTIVE</span>
                </div>
                <button class="pps-btn" (click)="navigateToPPS('Workplan 0 - {{ currentYear }}.0', currentYear)">
                  View PPS Details
                </button>
              </div>
            </div>
          </div>

          <!-- Upcoming Year Workplan -->
          <div class="workplan-card upcoming-year">
            <div class="card-header">
              <h2>FISCAL YEAR {{ upcomingYear }} (UPCOMING)</h2>
            </div>
            <div class="card-content">
              <div class="workplan-item">
                <div class="workplan-icon">📅</div>
                <div class="workplan-info">
                  <span class="workplan-title">Workplan {{ upcomingYear }}</span>
                  <span class="workplan-status planning">PLANNING</span>
                </div>
                <button class="pps-btn" (click)="navigateToPPS('Workplan 0 - {{ upcomingYear }}.0', upcomingYear)">
                  View PPS Details
                </button>
              </div>
            </div>
          </div>

          <!-- Previous Workplans -->
          <div class="workplan-card previous-years">
            <div class="card-header">
              <h2>PREVIOUS WORKPLANS</h2>
            </div>
            <div class="card-content">
              <mat-form-field appearance="outline" class="workplan-select">
                <mat-label>Select Previous Workplan</mat-label>
                <mat-select [(ngModel)]="selectedWorkplan" (selectionChange)="selectWorkplan($event)" panelClass="custom-select-panel">
                  @for (workplan of oldWorkplans; track workplan.year) {
                    <mat-option [value]="workplan.name">{{ workplan.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
              <div class="dropdown-spacer"></div>
            </div>
          </div>
        </div>

        <div *ngIf="showDashboard" class="dashboard">
          <div class="navigation-buttons">
            <button mat-raised-button (click)="toggleView()">
              <mat-icon>arrow_back</mat-icon> Back to Workplan Selection
            </button>
          </div>
          
          <div class="system-links">
            <button mat-raised-button color="primary" (click)="goToPPS()">
              <mat-icon>work</mat-icon> PPS
            </button>
            <button mat-raised-button color="primary" (click)="goToPAC()">
              <mat-icon>assessment</mat-icon> PAC
            </button>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    /* FDA Brand Colors */
    .fwfps-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      font-family: 'Arial', 'Helvetica', sans-serif;
      margin: 0;
      padding: 0;
      animation: fadeIn 0.5s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* Enhanced FDA Header */
    .fda-header {
      background: linear-gradient(135deg, #1B2B85 0%, #0071BC 50%, #2d5a4d 100%);
      color: white;
      margin: 0;
      padding: 0;
      box-shadow: 0 4px 12px rgba(27, 43, 133, 0.3);
      border-bottom: 4px solid #FF6B35;
    }

    .header-bar {
      background: rgba(27, 43, 133, 0.9);
      padding: 12px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #0071BC;
      backdrop-filter: blur(10px);
    }

    .fda-title {
      font-size: 12px;
      font-weight: 600;
      color: #E7F6F8;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
      letter-spacing: 0.5px;
    }

    .system-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .model-badge {
      background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%);
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .system-name {
      font-size: 14px;
      font-weight: 700;
      color: #FFFFFF;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
      letter-spacing: 1px;
    }

    /* Navigation Bar */
    .nav-bar {
      background: linear-gradient(135deg, #0071BC 0%, #1B2B85 100%);
      padding: 0;
      display: flex;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);
      justify-content: space-evenly;
      align-items: stretch;
    }

    .nav-btn {
      flex: 1 1 auto;
      min-width: 120px;
      padding: 12px 8px;
      border: none;
      background: transparent;
      color: #E7F6F8;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      cursor: pointer;
      transition: all 0.3s ease;
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
    }

    .nav-btn:last-child {
      border-right: none;
    }

    .nav-btn span {
      display: block;
      line-height: 1.2;
      text-align: center;
      word-wrap: break-word;
      max-width: 100%;
    }

    .nav-btn i {
      font-size: 14px;
      margin-bottom: 2px;
    }

    .nav-btn:hover {
      background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%);
      color: #FFFFFF;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
    }

    .nav-btn.active {
      background: linear-gradient(135deg, #00A651 0%, #28a745 100%);
      color: #FFFFFF;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
    }

    .nav-btn.logout {
      background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
      color: #FFFFFF;
    }

    .nav-btn.logout:hover {
      background: linear-gradient(135deg, #c82333 0%, #a02622 100%);
      transform: translateY(-2px);
    }

    .main-content {
      flex: 1;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }

    .page-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .page-header h1 {
      font-size: 3rem;
      color: #1B2B85;
      font-weight: 700;
      margin: 0;
      padding: 1.5rem 0;
      background: linear-gradient(135deg, #E7F6F8 0%, #ffffff 100%);
      border: 3px solid #1B2B85;
      border-radius: 12px;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
      box-shadow: 0 6px 12px rgba(27, 43, 133, 0.2);
    }

    .workplan-sections {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .workplan-card {
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      border-radius: 12px;
      box-shadow: 0 6px 12px rgba(0,0,0,0.1);
      overflow: hidden;
      transition: all 0.3s ease;
      border: 3px solid #e1e1e1;
    }

    .workplan-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.15);
    }

    .workplan-card.current-year {
      border-color: #0071BC;
    }

    .workplan-card.upcoming-year {
      border-color: #FF6B35;
    }

    .workplan-card.previous-years {
      grid-column: 1 / -1;
      border-color: #6c757d;
    }

    .card-header {
      padding: 1rem 1.5rem;
      background: linear-gradient(135deg, #1B2B85 0%, #0071BC 100%);
    }

    .current-year .card-header {
      background: linear-gradient(135deg, #0071BC 0%, #00A651 100%);
    }

    .upcoming-year .card-header {
      background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%);
    }

    .previous-years .card-header {
      background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
    }

    .card-header h2 {
      color: #FFFFFF;
      margin: 0;
      font-size: 1.3rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
    }

    .card-content {
      padding: 1.5rem;
    }

    .workplan-item {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .workplan-icon {
      font-size: 2rem;
      opacity: 0.8;
    }

    .workplan-info {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .workplan-title {
      font-size: 1.2rem;
      font-weight: 600;
      color: #1B2B85;
    }

    .workplan-status {
      padding: 0.3rem 0.8rem;
      border-radius: 15px;
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      width: fit-content;
    }

    .workplan-status.active {
      background-color: #00A651;
      color: #FFFFFF;
    }

    .workplan-status.planning {
      background-color: #FF6B35;
      color: #FFFFFF;
    }

    .pps-btn {
      background: linear-gradient(135deg, #0071BC 0%, #1B2B85 100%);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 113, 188, 0.3);
    }

    .pps-btn:hover {
      background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(255, 107, 53, 0.4);
    }

    .workplan-select {
      width: 100%;
      margin-top: 1rem;
    }

    .dropdown-spacer {
      height: 150px;
      width: 100%;
    }

    /* Fix Material Select Dropdown */
    ::ng-deep .mat-mdc-select-panel {
      background: #ffffff !important;
      border: 2px solid #1B2B85 !important;
      border-radius: 8px !important;
      box-shadow: 0 8px 24px rgba(27, 43, 133, 0.25) !important;
      max-height: 250px !important;
      z-index: 9999 !important;
    }

    ::ng-deep .mat-mdc-option {
      background: #ffffff !important;
      color: #1B2B85 !important;
      font-size: 1rem !important;
      font-weight: 500 !important;
      padding: 0.75rem 1rem !important;
      min-height: 48px !important;
      line-height: 1.4 !important;
    }

    ::ng-deep .mat-mdc-option:hover {
      background: #E7F6F8 !important;
      color: #1B2B85 !important;
    }

    ::ng-deep .mat-mdc-option.mdc-list-item--selected {
      background: #0071BC !important;
      color: #FFFFFF !important;
      font-weight: 600 !important;
    }

    ::ng-deep .mat-mdc-option.mdc-list-item--selected:hover {
      background: #1B2B85 !important;
      color: #FFFFFF !important;
    }

    ::ng-deep .mat-mdc-form-field {
      font-size: 1rem !important;
    }

    ::ng-deep .mat-mdc-form-field-outline {
      color: #1B2B85 !important;
    }

    ::ng-deep .mat-mdc-form-field-label {
      color: #1B2B85 !important;
      font-weight: 500 !important;
    }

    ::ng-deep .mat-mdc-select-value-text {
      color: #1B2B85 !important;
      font-weight: 500 !important;
    }

    /* Force dropdown to open downward */
    ::ng-deep .cdk-overlay-pane {
      transform-origin: top left !important;
    }

    /* Dashboard Styles */
    .dashboard {
      text-align: center;
    }

    .navigation-buttons {
      margin-bottom: 2rem;
    }

    .system-links {
      display: flex;
      gap: 2rem;
      justify-content: center;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .workplan-sections {
        grid-template-columns: 1fr;
      }
      
      .header-content {
        padding: 1rem;
      }
      
      .brand-name {
        font-size: 1.5rem;
      }
      
      .brand-subtitle {
        display: none;
      }
      
      .nav-actions {
        gap: 0.25rem;
      }
      
      .nav-btn {
        padding: 0.3rem 0.6rem !important;
        font-size: 0.8rem !important;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  showDashboard = false;
  selectedWorkplan: string = '';
  currentYear = 2025;
  upcomingYear = 2026;
  oldWorkplans = [
    { year: 2024, name: 'Workplan 2024' },
    { year: 2023, name: 'Workplan 2023' },
    { year: 2022, name: 'Workplan 2022' }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.showDashboard = false;
  }

  toggleView() {
    // Instead of showing dashboard, navigate directly to PPS
    this.router.navigate(['/pps'], {
      queryParams: {
        workplan: `Workplan ${this.currentYear}`,
        year: this.currentYear
      }
    });
  }

  selectUpcomingWorkplan() {
    console.log('Opening upcoming workplan: ' + this.upcomingYear);
    this.router.navigate(['/pps'], {
      queryParams: {
        workplan: `Workplan ${this.upcomingYear}`,
        year: this.upcomingYear
      }
    });
  }

  logout() {
    this.router.navigate(['/auth/login']);
  }

  selectWorkplan(event: any) {
    this.selectedWorkplan = event.value;
    // Navigate to PPS with the selected previous workplan
    const selectedYear = this.oldWorkplans.find(wp => wp.name === event.value)?.year || 2024;
    this.router.navigate(['/pps'], {
      queryParams: {
        workplan: event.value,
        year: selectedYear
      }
    });
  }

  goToPPS() {
    this.router.navigate(['/pps']);
  }

  goToPAC() {
    this.router.navigate(['/pac']);
  }

  // Navigation methods for top menu
  navigateToModel(): void {
    this.router.navigate(['/model']);
  }

  navigateToReports(): void {
    alert('Report Module - Coming Soon!\n\nThis will navigate to comprehensive reporting and analytics dashboard.');
  }

  navigateToTasks(): void {
    alert('TO (Task Operations) Module - Coming Soon!\n\nThis will navigate to task management and operations tracking.');
  }

  navigateToGroupPAC(): void {
    this.router.navigate(['/pac', '11a'], {
      queryParams: {
        fromHome: true,
        workplan: `Workplan ${this.currentYear}`
      }
    });
  }

  navigateToPPS(workplan: string, year: number): void {
    this.router.navigate(['/pps'], {
      queryParams: {
        workplan: workplan,
        year: year
      }
    });
  }
}
