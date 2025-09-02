import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

interface PPSItem {
  id: string;
  description: string;
  hours: number;
  plannedFtes: number;
}

interface Workplan {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  start_date: string;
  end_date: string;
  assigned_to: string;
  progress: number;
  created_at: string;
  updated_at: string;
  task_count: number;
  tasks: any[];
}

@Component({
  selector: 'app-pps',
  templateUrl: './pps.component.html',
  styleUrls: ['./pps.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class PpsComponent implements OnInit {
  selectedWorkplan: string = '';
  workplanYear: number = 2025;
  searchText: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 10;
  today = new Date();
  isLoading: boolean = true;
  
  // Real workplans from the database
  availableWorkplans: Workplan[] = [];
  
  // Mock PPS items (keeping for demo purposes, but we'll show backend status)
  workplanItems: PPSItem[] = [
    { id: '03', description: 'Foodborne Biological Hazards', hours: 761237.50, plannedFtes: 723.53 },
    { id: '04', description: 'Pesticides and Chemical Contaminants', hours: 207839.30, plannedFtes: 185.19 },
    { id: '07', description: 'Molecular Biology and Natural Toxins: Food and Cosmetics', hours: 39918.00, plannedFtes: 36.07 },
    { id: '09', description: 'Food and Color Additive Petition Review and Policy Devlop', hours: 12464.00, plannedFtes: 11.03 },
    { id: '18', description: 'Technical Assistance: Food and Cosmetics', hours: 105161.00, plannedFtes: 93.74 },
    { id: '21', description: 'Food Composition, Standards, Labeling and Economics', hours: 49435.60, plannedFtes: 46.78 },
    { id: '26', description: 'Colors and Cosmetics Technology', hours: 8710.00, plannedFtes: 8.12 },
    { id: '41', description: 'Human Cellular, Tissues&Gene Therapies(former Therapeutic Prd)', hours: 20828.40, plannedFtes: 22.89 },
    { id: '42', description: 'Blood and Blood Products', hours: 81166.00, plannedFtes: 87.92 },
    { id: '45', description: 'Vaccines and Allergenic Products', hours: 7468.70, plannedFtes: 8.21 },
    { id: '46', description: 'New Drug Evaluation', hours: 31043.00, plannedFtes: 32.04 },
    { id: '48', description: 'Bioresearch Monitoring: Human Drugs', hours: 49454.10, plannedFtes: 54.35 },
    { id: '52', description: 'Generic Drug Evaluation', hours: 42551.00, plannedFtes: 43.33 },
    { id: '53', description: 'Postmarketing Surveillance and Epidemiology: Human Drugs', hours: 9884.00, plannedFtes: 9.98 },
    { id: '56', description: 'Drug Quality Assurance', hours: 242417.00, plannedFtes: 248.90 },
    { id: '58', description: 'Prescription Drug Advertising and Labeling', hours: 0.00, plannedFtes: 0.00 },
    { id: '61', description: 'Over-the-Counter Drug Evaluation', hours: 1504.00, plannedFtes: 2.02 },
    { id: '63', description: 'Unapproved and Misbranded Drugs (former Health Fraud: Drugs)', hours: 7148.00, plannedFtes: 7.49 },
    { id: '68', description: 'Pre-Approval Evaluation of Animal Drugs and Food Additives', hours: 10757.00, plannedFtes: 10.71 },
    { id: '71', description: 'Monitoring of Marketed Animal Drugs, Feeds and Devices', hours: 130921.00, plannedFtes: 122.39 },
    { id: '81', description: 'Postmarket Assurance: Medical Devices', hours: 497.90, plannedFtes: 0.51 },
    { id: '82', description: 'Compliance: Medical Devices', hours: 137960.70, plannedFtes: 136.15 },
    { id: '83', description: 'Product Evaluation: Medical Devices', hours: 34504.60, plannedFtes: 36.32 },
    { id: '84', description: 'Science: Medical Devices', hours: 5975.00, plannedFtes: 5.06 },
    { id: '85', description: 'Mammography Quality Standards Act (MQSA) Authority', hours: 16125.00, plannedFtes: 15.59 },
    { id: '86', description: 'Radiation Control and Health Safety Act (RCHSA) Authority', hours: 35762.70, plannedFtes: 34.08 },
    { id: '88a', description: 'ICA (Interagency Cooperative Activities)', hours: 14160.00, plannedFtes: 12.00 }
  ];

  filteredItems: PPSItem[] = [];
  totalHours: number = 0;
  totalFtes: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    
    this.route.queryParams.subscribe(params => {
      this.selectedWorkplan = params['workplan'] || 'Workplan 2025';
      this.workplanYear = parseInt(params['year']) || 2025;
    });

    // Load real workplans from the backend
    this.loadBackendData();
  }

  private loadBackendData() {
    console.log('🔄 Loading workplans from backend API...');
    
    this.apiService.getWorkplans().subscribe({
      next: (response) => {
        console.log('✅ Backend data loaded successfully:', response);
        if (response.success && response.workplans) {
          this.availableWorkplans = response.workplans;
          this.selectedWorkplan = response.workplans[0]?.title || 'Workplan 2025';
        }
        this.loadWorkplanData();
        this.filteredItems = [...this.workplanItems];
        this.calculateTotals();
        this.calculatePages();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Failed to load backend data:', error);
        console.log('🔄 Falling back to mock data...');
        // Fall back to mock data if backend is not available
        this.loadWorkplanData();
        this.filteredItems = [...this.workplanItems];
        this.calculateTotals();
        this.calculatePages();
        this.isLoading = false;
      }
    });
  }

  private loadWorkplanData() {
    // Adjust data based on workplan year
    if (this.workplanYear === 2026) {
      // Future workplan - show projected increases
      this.workplanItems = this.workplanItems.map(item => ({
        ...item,
        hours: item.hours * 1.05, // 5% increase for future year
        plannedFtes: item.plannedFtes * 1.03 // 3% increase for FTEs
      }));
    } else if (this.workplanYear < 2025) {
      // Historical workplan - show historical data
      this.workplanItems = this.workplanItems.map(item => ({
        ...item,
        hours: item.hours * 0.95, // 5% decrease for historical data
        plannedFtes: item.plannedFtes * 0.97 // 3% decrease for FTEs
      }));
    }
    // Current year (2025) uses base data as-is
  }

  private calculateTotals() {
    this.totalHours = this.workplanItems.reduce((sum, item) => sum + item.hours, 0);
    this.totalFtes = this.workplanItems.reduce((sum, item) => sum + item.plannedFtes, 0);
  }

  private calculatePages() {
    this.totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage);
  }

  onSearch() {
    if (this.searchText) {
      this.filteredItems = this.workplanItems.filter(item =>
        item.description.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.id.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.filteredItems = [...this.workplanItems];
    }
    this.currentPage = 1;
    this.calculatePages();
  }

  getPaginatedItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredItems.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  exportData() {
    // Implement export functionality
  }

  printWorkplan() {
    window.print();
  }

  navigateToHome() {
    this.router.navigate(['/fwfps']);
  }

  logout() {
    this.router.navigate(['/auth/login']);
  }

  editItem(id: string) {
    // Implement edit functionality
  }

  viewDetails(id: string) {
    // Navigate to PAC view with the PPS ID
    this.router.navigate(['/pac', id], {
      queryParams: {
        ppsId: id,
        workplan: this.selectedWorkplan,
        year: this.workplanYear,
        fromPPS: true
      }
    });
  }

  navigateToPAC() {
    // Default navigation to PAC operations
    this.router.navigate(['/pac', '11a'], {
      queryParams: {
        ppsId: '11a',
        workplan: this.selectedWorkplan,
        year: this.workplanYear,
        fromPPS: true
      }
    });
  }
}
