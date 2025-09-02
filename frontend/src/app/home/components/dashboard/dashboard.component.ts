import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="usa-overlay"></div>
    <header class="usa-header usa-header--extended" role="banner">
      <div class="usa-navbar">
        <div class="usa-logo" id="extended-logo">
          <em class="usa-logo__text">
            <span class="agency-name">U.S. FOOD AND DRUG ADMINISTRATION / ORA-OFFICE OF REGULATORY AFFAIRS</span>
            <span class="system-name">MODEL | FIELD WORK FORCE PLANNING SYSTEM</span>
          </em>
        </div>
      </div>
      <nav class="usa-nav" role="navigation">
        <div class="usa-nav__inner">
          <ul class="usa-nav__primary">
            <li class="usa-nav__primary-item">
              <a href="#" class="usa-nav__link usa-current">FWFPS HOME</a>
            </li>
            <li class="usa-nav__primary-item">
              <a href="#" class="usa-nav__link">MODEL MODULE</a>
            </li>
            <li class="usa-nav__primary-item">
              <a href="#" class="usa-nav__link">REPORT MODULE</a>
            </li>
            <li class="usa-nav__primary-item">
              <a href="#" class="usa-nav__link">TO MODULE</a>
            </li>
            <li class="usa-nav__primary-item">
              <a href="#" class="usa-nav__link">GROUP PAC UTILITY</a>
            </li>
            <li class="usa-nav__primary-item">
              <a href="#" class="usa-nav__link" (click)="logout()">LOGOUT</a>
            </li>
          </ul>
        </div>
      </nav>
    </header>

    <main class="usa-layout-docs__main desktop:grid-col-9 usa-prose usa-layout-docs" id="main-content">
      <div class="grid-container">
        <div class="usa-layout-docs__main desktop:grid-col-9 usa-prose">
          <h1>FWFPS Home</h1>

          <div class="usa-card">
            <div class="usa-card__container">
              <div class="usa-card__header">
                <h2 class="usa-card__heading">FISCAL YEAR 2026</h2>
              </div>
              <div class="usa-card__body">
                <a href="#" class="usa-link">Workplan 0 - 2026 ()</a>
              </div>
            </div>
          </div>

          <div class="usa-card">
            <div class="usa-card__container">
              <div class="usa-card__header">
                <h2 class="usa-card__heading">FISCAL YEAR 2025</h2>
              </div>
              <div class="usa-card__body">
                <a href="#" class="usa-link">Workplan 0 - 2025 ()</a>
              </div>
            </div>
          </div>

          <div class="usa-form-group">
            <label class="usa-label" for="workplan-select">Select an older Workplan:</label>
            <select class="usa-select" id="workplan-select" name="workplan-select">
              <option value="">- Select -</option>
              <option value="2024">Workplan 2024</option>
              <option value="2023">Workplan 2023</option>
              <option value="2022">Workplan 2022</option>
            </select>
          </div>
        </div>

        <div class="grid-col-3">
          <div class="usa-card help-card">
            <div class="usa-card__container">
              <div class="usa-card__header">
                <h2 class="usa-card__heading">Help</h2>
              </div>
              <div class="usa-card__body">
                <button class="usa-button" (click)="openHelp()">
                  <i class="fas fa-question-circle"></i> Help
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  `,
  styles: [`
    .usa-header {
      background-color: #112e51;
      margin-bottom: 2rem;
    }

    .agency-name {
      display: block;
      font-size: 0.875rem;
      letter-spacing: 0.5px;
      color: #a9aeb1;
    }

    .system-name {
      display: block;
      font-size: 1.375rem;
      font-weight: 700;
      color: #ffffff;
    }

    .usa-nav__link {
      color: white !important;
      font-size: 0.9rem;
      text-decoration: none;
      padding: 0.5rem 1rem;
    }

    .usa-nav__link:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .usa-nav__primary {
      display: flex;
      gap: 1rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .usa-card {
      margin-bottom: 1.5rem;
      border: 1px solid #dfe1e2;
      background-color: #fff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .usa-card__header {
      background-color: #f0f0f0;
      padding: 1rem;
      border-bottom: 1px solid #dfe1e2;
    }

    .usa-card__heading {
      margin: 0;
      font-size: 1.125rem;
      color: #112e51;
    }

    .usa-card__body {
      padding: 1rem;
    }

    .usa-link {
      color: #0071bc;
      text-decoration: none;
      display: block;
      padding: 0.5rem 0;
    }

    .usa-link:hover {
      text-decoration: underline;
      background-color: #f8f9fa;
    }

    .usa-form-group {
      margin-top: 2rem;
      background-color: white;
      padding: 1.5rem;
      border: 1px solid #dfe1e2;
    }

    .usa-select {
      width: 100%;
      max-width: 100%;
    }

    .help-card {
      position: fixed;
      top: 6rem;
      right: 1rem;
      width: 250px;
    }

    .grid-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    h1 {
      color: #112e51;
      margin-bottom: 2rem;
    }
  `]
})
export class DashboardComponent {
  logout() {
    // TODO: Implement actual logout logic
    window.location.href = '/auth/login';
  }

  openHelp() {
    // TODO: Implement help functionality
    console.log('Opening help documentation...');
  }
}
