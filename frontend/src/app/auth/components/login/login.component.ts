import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="warning-banner">
      <h2>WARNING</h2>
      <ul>
        <li>This warning banner provides privacy and security notices consistent with applicable federal laws, directives, and other federal guidance for accessing this Government system, which includes (1) this computer network, (2) all computers connected to this network, and (3) all devices and storage media attached to this network or to a computer on this network.</li>
        <li>This system is provided for Government-authorized use only.</li>
        <li>Unauthorized or improper use of this system is prohibited and may result in disciplinary action and/or civil and criminal penalties.</li>
        <li>By using this system, you understand and consent to the following:
          <ul>
            <li>The Government may monitor, record, and audit your system usage, including usage of personal devices and email systems for official duties or to conduct HHS business. Therefore, you have no reasonable expectation of privacy regarding any communication or data transiting or stored on this system. At any time, and for any lawful Government purpose, the government may monitor, intercept, and search and seize any communication or data transiting or stored on this system.</li>
            <li>Any communication or data transiting or stored on this system may be disclosed or used for any lawful Government purpose.</li>
          </ul>
        </li>
      </ul>
    </div>

    <div class="usa-overlay"></div>
    <header class="usa-header usa-header--extended" role="banner">
      <div class="usa-navbar">
        <div class="usa-logo" id="extended-logo">
          <em class="usa-logo__text">
            <a href="/" title="Home" aria-label="Home">
              <span class="agency-name">U.S. FOOD AND DRUG ADMINISTRATION</span>
              <span class="system-title">FIELD WORK FORCE PLANNING SYSTEM</span>
            </a>
          </em>
        </div>
      </div>
      <nav aria-label="Primary navigation" class="usa-nav">
        <div class="usa-nav__inner">
          <ul class="usa-nav__primary usa-accordion">
            <li class="usa-nav__primary-item">
              <a href="#" class="usa-nav__link" aria-label="FDA Internet"><span>FDA INTERNET</span></a>
            </li>
            <li class="usa-nav__primary-item">
              <a href="#" class="usa-nav__link" aria-label="ORA Internet"><span>ORA INTERNET</span></a>
            </li>
            <li class="usa-nav__primary-item">
              <a href="#" class="usa-nav__link" aria-label="BPE Intranet"><span>BPE INTRANET</span></a>
            </li>
          </ul>
        </div>
      </nav>
    </header>

    <main id="main-content" class="grid-container usa-section" role="main">
      <div class="usa-alert usa-alert--info" role="alert">
        <div class="usa-alert__body">
          <h3 class="usa-alert__heading">System Access Notice</h3>
          <p class="usa-alert__text">
            This is a U.S. Government system intended for authorized use only. By using this system, you consent to monitoring, recording, and auditing of your activities.
          </p>
          <button class="usa-button usa-button--unstyled" (click)="toggleWarning()" aria-expanded="{{showFullWarning}}" 
                  aria-controls="warning-content">
            {{showFullWarning ? 'Show Less' : 'Read Full Notice'}}
          </button>
          <div class="usa-alert__text" id="warning-content" [attr.hidden]="!showFullWarning">
            <ul class="usa-list">
              <li>This warning banner provides privacy and security notices consistent with applicable federal laws, directives, and other federal guidance for accessing this Government system.</li>
              <li>Unauthorized or improper use of this system is prohibited and may result in disciplinary action and/or civil and criminal penalties.</li>
              <li>The Government may:
                <ul>
                  <li>Monitor, record, and audit your system usage</li>
                  <li>Intercept and search any communication or data</li>
                  <li>Use or disclose any data for lawful Government purposes</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="grid-row">
        <div class="tablet:grid-col-6 tablet:grid-offset-3">
          <div class="usa-form-wrapper">
            <h1>Sign In</h1>
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="usa-form">
              <fieldset class="usa-fieldset">
                <div class="usa-form-group">
                  <label class="usa-label" for="username">Username</label>
                  <input 
                    class="usa-input"
                    id="username"
                    type="text"
                    formControlName="username"
                    aria-required="true"
                    aria-describedby="username-description"
                  >
                  <span class="usa-hint" id="username-description">Enter your government username</span>
                </div>

                <div class="usa-form-group">
                  <label class="usa-label" for="password">Password</label>
                  <input 
                    class="usa-input"
                    id="password"
                    [type]="showPassword ? 'text' : 'password'"
                    formControlName="password"
                    aria-required="true"
                  >
                  <div class="usa-checkbox">
                    <input 
                      class="usa-checkbox__input" 
                      id="show-password" 
                      type="checkbox" 
                      (change)="togglePassword()"
                      aria-controls="password"
                    >
                    <label class="usa-checkbox__label" for="show-password">Show password</label>
                  </div>
                </div>

                <button 
                  class="usa-button usa-button--big usa-button--accent-cool width-full" 
                  type="submit"
                  [disabled]="!loginForm.valid"
                >
                  Sign In
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </main>

    <footer class="usa-footer" role="contentinfo">
      <div class="usa-footer__secondary-section">
        <div class="grid-container">
          <div class="usa-footer__logo grid-row grid-gap-2">
            <div class="grid-col-auto">
              <img class="usa-footer__logo-img" src="/assets/img/fda-logo.svg" alt="FDA Logo">
            </div>
            <div class="grid-col-auto">
              <p class="usa-footer__logo-heading">
                FWFPS Version 13.5.0 | {{currentDate | date:'MMMM d, yyyy'}} | U.S. Food and Drug Administration
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .warning-banner {
      background-color: #ffffff;
      color: #1a4480;
      padding: 1.5rem;
      margin-bottom: 1rem;
    }
    
    .warning-banner h2 {
      color: #1a4480;
      margin: 0 0 1rem 0;
      background-color: #1a4480;
      color: #ffffff;
      padding: 0.5rem 1rem;
      display: inline-block;
    }
    
    .warning-banner ul {
      margin: 0;
      padding-left: 1.5rem;
      color: #1a4480;
    }
    
    .warning-banner li {
      margin-bottom: 0.5rem;
    }
    
    .warning-banner ul ul {
      margin-top: 0.5rem;
    }
    .usa-header {
      background-color: #112e51;
    }

    .agency-name {
      display: block;
      font-size: 0.875rem;
      letter-spacing: 0.5px;
      color: #a9aeb1;
    }

    .system-title {
      display: block;
      font-size: 1.375rem;
      font-weight: 700;
      color: #ffffff;
    }

    .usa-nav__link span {
      color: #ffffff;
    }

    .usa-form-wrapper {
      background-color: #ffffff;
      padding: 2rem;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .usa-alert--info {
      margin-bottom: 2rem;
    }

    #warning-content {
      margin-top: 1rem;
    }

    .width-full {
      width: 100%;
    }

    .usa-footer {
      margin-top: 4rem;
    }

    .usa-footer__secondary-section {
      background-color: #112e51;
      color: #ffffff;
    }

    .usa-footer__logo-heading {
      color: #ffffff;
      font-size: 0.875rem;
    }
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: #f0f0f0;
    }

    .app-header {
      background-color: #333;
      color: white;
      padding: 10px;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
    }

    .org-name {
      font-size: 14px;
      margin-bottom: 5px;
    }

    .system-name {
      font-size: 24px;
      font-weight: bold;
      color: #90EE90;
      margin-bottom: 10px;
    }

    .nav-links {
      display: flex;
      gap: 20px;
    }

    .nav-link {
      color: white;
      text-decoration: none;
      font-size: 12px;
    }

    .nav-link:hover {
      text-decoration: underline;
    }

    .warning-banner {
      background-color: white;
      padding: 20px;
      margin: 20px;
      border: 1px solid #ddd;
    }

    .warning-banner h3 {
      color: #333;
      margin-bottom: 10px;
    }

    .warning-banner ul {
      list-style-type: disc;
      margin-left: 20px;
    }

    .warning-banner li {
      margin-bottom: 10px;
      font-size: 14px;
      line-height: 1.5;
    }

    .warning-banner ul ul {
      margin-top: 10px;
    }

    .login-container {
      background-color: white;
      padding: 20px;
      margin: 20px auto;
      max-width: 400px;
      border: 1px solid #ddd;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    label {
      font-weight: bold;
      color: #333;
    }

    input {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    button {
      padding: 10px;
      background-color: #333;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }

    button:hover {
      background-color: #444;
    }

    .app-footer {
      margin-top: auto;
      padding: 10px;
      background-color: #333;
      color: white;
      text-align: center;
      font-size: 12px;
    }
  `]
})
export class LoginComponent implements OnInit {
  currentDate: Date = new Date();
  loginForm: FormGroup;
  showPassword: boolean = false;
  showFullWarning: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    // Any initialization logic
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleWarning() {
    this.showFullWarning = !this.showFullWarning;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Login attempt:', this.loginForm.value);
      // TODO: Implement actual authentication
      this.router.navigateByUrl('/fwfps', { replaceUrl: true });
    }
  }
}
