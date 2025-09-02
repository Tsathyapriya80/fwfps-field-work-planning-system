import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

interface PACItem {
  pac: string;
  description: string;
  endDate: string;
  monthsRemaining: number;
  status: string;
  hours: number;
  plannedFtes: number;
}

interface PACOperation {
  divisionCode: string;
  divisionName: string;
  operations: {
    ops: number;
    hours: number;
  }[];
  total: {
    ops: number;
    hours: number;
    ftes: number;
  };
}

interface PACDetail {
  pac: string;
  description: string;
  projectName: string;
  programAssignmentCode: string;
  endDate: string;
  duration: string;
  operations: PACOperation[];
  summary: {
    totalOps: number;
    totalHours: number;
    totalFtes: number;
    moduleTime: number;
    convFactor: number;
    plannedFtes: number;
  };
}

@Component({
  selector: 'app-pac',
  templateUrl: './pac.component.html',
  styleUrls: ['./pac.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class PacComponent implements OnInit {
  ppsId: string = '';
  workplanName: string = '';
  programTitle: string = '';
  pacItems: PACItem[] = [];
  selectedPacDetail: PACDetail | null = null;
  showPacDetail: boolean = false;
  
  // Operations navigation state
  showOperations: boolean = false;
  selectedPacForOperations: any = null;
  
  activeOperationTab: string = 'OPS_25_26';
  selectedReport: string = 'operations-hours';
  availableTabs: string[] = ['OPS_25_26', 'OPS_314_16', 'CONSOLIDATED'];
  
  totals = {
    hours: 0,
    plannedFtes: 0
  };

  // Navigation context
  fromPPS: boolean = false;
  workplanYear: number = 2025;
  
  // Backend integration properties
  backendOperations: any[] = [];
  backendConnected: boolean = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.ppsId = params['id'];
      this.loadPACData();
      this.loadBackendOperations();
    });

    this.route.queryParams.subscribe(params => {
      this.workplanName = params['workplan'] || 'Current Workplan';
      this.fromPPS = params['fromPPS'] === 'true';
      this.workplanYear = parseInt(params['year']) || 2025;
    });
  }

  loadBackendOperations(): void {
    console.log('🔄 Loading PAC operations from backend API...');
    
    this.apiService.getPacOperations().subscribe({
      next: (response) => {
        console.log('✅ Backend PAC operations loaded successfully:', response);
        if (response.success && response.operations) {
          this.backendOperations = response.operations;
          this.backendConnected = true;
        }
      },
      error: (error) => {
        console.error('❌ Failed to load backend PAC operations:', error);
        this.backendConnected = false;
      }
    });
  }

  loadPACData(): void {
    // Set program title based on PPS ID
    const programTitles: { [key: string]: string } = {
      '21': 'Food Composition, Standards, Labeling and Economics',
      '03': 'Foodborne Biological Hazards',
      '04': 'Pesticides and Chemical Contaminants',
      '07': 'Molecular Biology and Natural Toxins: Food and Cosmetics',
      '09': 'Food and Color Additive Petition Review and Policy Development',
      '18': 'Technical Assistance: Food and Cosmetics',
      '26': 'Colors and Cosmetics Technology',
      '41': 'Human Cellular, Tissues & Gene Therapies',
      '42': 'Blood and Blood Products',
      '45': 'Vaccines and Allergenic Products',
      '46': 'New Drug Evaluation',
      '48': 'Bioresearch Monitoring: Human Drugs',
      '52': 'Generic Drug Evaluation',
      '53': 'Postmarketing Surveillance and Epidemiology: Human Drugs',
      '56': 'Drug Quality Assurance',
      '58': 'Prescription Drug Advertising and Labeling',
      '61': 'Over-the-Counter Drug Evaluation',
      '63': 'Unapproved and Misbranded Drugs',
      '68': 'Pre-Approval Evaluation of Animal Drugs and Food Additives',
      '71': 'Monitoring of Marketed Animal Drugs, Feeds and Devices',
      '81': 'Postmarket Assurance: Medical Devices',
      '82': 'Compliance: Medical Devices',
      '83': 'Product Evaluation: Medical Devices',
      '84': 'Science: Medical Devices',
      '85': 'Mammography Quality Standards Act (MQSA) Authority',
      '86': 'Radiation Control and Health Safety Act (RCHSA) Authority',
      '88a': 'ICA (Interagency Cooperative Activities)'
    };

    this.programTitle = programTitles[this.ppsId] || 'Program Details';
    
    // Load PAC items based on PPS ID
    if (this.ppsId === '21') {
      this.pacItems = this.getPPS21Data();
    } else {
      this.pacItems = this.getDefaultPACData();
    }
    this.calculateTotals();
  }

  getPPS21Data(): PACItem[] {
    return [
      {
        pac: '21002',
        description: 'MEDICAL FOODS - IMPORT AND DOMESTIC',
        endDate: '',
        monthsRemaining: 0,
        status: 'C',
        hours: 5680.80,
        plannedFtes: 5.08
      },
      {
        pac: '21005',
        description: 'DOM & IMP NLEA, NUTR SMPL ANAL & GEN LBLING PROG',
        endDate: '',
        monthsRemaining: 0,
        status: 'C',
        hours: 9395.00,
        plannedFtes: 9.41
      },
      {
        pac: '21006',
        description: 'INFANT FORMULA SURVEY',
        endDate: '',
        monthsRemaining: 0,
        status: 'C',
        hours: 7011.00,
        plannedFtes: 6.28
      },
      {
        pac: '21008',
        description: 'DIETARY SUPPLEMENT SAMPLE COLLECTION AND ANALYSIS',
        endDate: '',
        monthsRemaining: 0,
        status: 'C',
        hours: 19513.00,
        plannedFtes: 19.41
      },
      {
        pac: '21839',
        description: 'TOTAL DIET STUDIES - SELECTED MINERALS',
        endDate: '',
        monthsRemaining: 0,
        status: 'C',
        hours: 4905.80,
        plannedFtes: 4.16
      },
      {
        pac: '21B816',
        description: 'OII/CENTER METHODS VALIDATION/DEVELOPMENT PROGRAM',
        endDate: '',
        monthsRemaining: 0,
        status: 'C',
        hours: 2920.00,
        plannedFtes: 2.44
      }
    ];
  }

  getDefaultPACData(): PACItem[] {
    return [
      {
        pac: this.ppsId + '001',
        description: `${this.programTitle.toUpperCase()} - CORE ACTIVITIES`,
        endDate: '',
        monthsRemaining: 0,
        status: 'C',
        hours: 15000.00,
        plannedFtes: 12.50
      },
      {
        pac: this.ppsId + '002',
        description: `${this.programTitle.toUpperCase()} - COMPLIANCE`,
        endDate: '',
        monthsRemaining: 0,
        status: 'C',
        hours: 8500.00,
        plannedFtes: 7.25
      },
      {
        pac: this.ppsId + '003',
        description: `${this.programTitle.toUpperCase()} - INSPECTION ACTIVITIES`,
        endDate: '',
        monthsRemaining: 0,
        status: 'C',
        hours: 12000.00,
        plannedFtes: 10.00
      }
    ];
  }

  calculateTotals(): void {
    this.totals.hours = this.pacItems.reduce((sum, item) => sum + item.hours, 0);
    this.totals.plannedFtes = this.pacItems.reduce((sum, item) => sum + item.plannedFtes, 0);
  }

  getStatusClass(status: string): string {
    switch (status.toUpperCase()) {
      case 'C':
        return 'status-completed';
      case 'P':
        return 'status-pending';
      case 'I':
        return 'status-in-progress';
      default:
        return '';
    }
  }

  getStatusText(status: string): string {
    switch (status.toUpperCase()) {
      case 'C':
        return 'Completed';
      case 'P':
        return 'Pending';
      case 'I':
        return 'In Progress';
      default:
        return status;
    }
  }

  navigateToHome(): void {
    this.router.navigate(['/fwfps']);
  }

  logout(): void {
    this.router.navigate(['/auth/login']);
  }

  printWorkplan(): void {
    window.print();
  }

  // PAC Detail Operations Methods
  viewPacDetails(pacId: string): void {
    this.selectedPacDetail = this.getPacDetailData(pacId);
    this.showPacDetail = true;
  }

  backToSummary(): void {
    this.showPacDetail = false;
    this.selectedPacDetail = null;
  }

  // Dynamic Operations Methods
  switchOperationTab(tabName: string): void {
    this.activeOperationTab = tabName;
    // Reload data for the selected tab
    if (this.selectedPacDetail) {
      this.selectedPacDetail = this.getPacDetailData(this.selectedPacDetail.pac, tabName);
    }
  }

  onReportChange(): void {
    // Handle report type change
    if (this.selectedPacDetail) {
      this.selectedPacDetail = this.getPacDetailData(this.selectedPacDetail.pac, this.activeOperationTab);
    }
  }

  getCurrentOperationsData(): any[] {
    if (this.activeOperationTab === 'OPS_25_26') {
      return this.getOPS_25_26_SimpleData();
    } else if (this.activeOperationTab === 'OPS_314_16') {
      return this.getOPS_314_16_SimpleData();
    }
    return [];
  }

  getOPS_25_26_SimpleData(): any[] {
    return [
      { divisionCode: 'NE', divisionName: 'Northeast Division', operations: 45, hours: 2340.00, ftes: 2.34 },
      { divisionCode: 'SE', divisionName: 'Southeast Division', operations: 38, hours: 1976.00, ftes: 1.98 },
      { divisionCode: 'MW', divisionName: 'Midwest Division', operations: 52, hours: 2704.00, ftes: 2.70 },
      { divisionCode: 'SW', divisionName: 'Southwest Division', operations: 41, hours: 2132.00, ftes: 2.13 },
      { divisionCode: 'W', divisionName: 'Western Division', operations: 47, hours: 2444.00, ftes: 2.44 },
      { divisionCode: 'PAC', divisionName: 'Pacific Division', operations: 35, hours: 1820.00, ftes: 1.82 }
    ];
  }

  getOPS_314_16_SimpleData(): any[] {
    return [
      { divisionCode: 'NWE', divisionName: 'North West Environmental', operations: 18, hours: 88.20, ftes: 0.88 },
      { divisionCode: 'NYK', divisionName: 'New York Labs', operations: 35, hours: 175.50, ftes: 1.76 },
      { divisionCode: 'BLT', divisionName: 'Baltimore Testing', operations: 29, hours: 148.10, ftes: 1.48 },
      { divisionCode: 'CHI', divisionName: 'Chicago Analysis', operations: 20, hours: 99.75, ftes: 1.00 },
      { divisionCode: 'CIN', divisionName: 'Cincinnati Labs', operations: 41, hours: 203.25, ftes: 2.03 },
      { divisionCode: 'DET', divisionName: 'Detroit Testing', operations: 31, hours: 156.80, ftes: 1.57 },
      { divisionCode: 'MIN', divisionName: 'Minneapolis Labs', operations: 25, hours: 127.45, ftes: 1.27 },
      { divisionCode: 'ATL', divisionName: 'Atlanta Analysis', operations: 38, hours: 189.60, ftes: 1.90 },
      { divisionCode: 'SRL', divisionName: 'Southern Regional Labs', operations: 27, hours: 134.90, ftes: 1.35 }
    ];
  }

  getOperationTabData(pacId: string, tabName: string): any[] {
    if (tabName === 'OPS_25_26') {
      return this.getOPS_25_26_Data(pacId);
    } else if (tabName === 'OPS_314_16') {
      return this.getOPS_314_16_Data(pacId);
    } else if (tabName === 'CONSOLIDATED') {
      return this.getConsolidatedData();
    }
    return [];
  }

  getOPS_25_26_Data(pacId: string): any[] {
    // Data for OPS 25-26 tab (Field Operations)
    return [
      { code: 'NWE', ops: [null, null, 4.00, null, 1.00, 2.00, null], hrs: [null, null, 21.20, null, 37.00, 10.00, null] },
      { code: 'NYK', ops: [null, null, 2.00, null, 2.00, null, null], hrs: [null, null, 10.60, null, 74.00, null, null] },
      { code: 'BLT', ops: [null, null, 7.00, null, 3.00, null, null], hrs: [null, null, 37.10, null, 111.00, null, null] },
      { code: 'CHI', ops: [null, null, null, null, 1.00, 7.00, null], hrs: [null, null, null, null, 37.00, 35.00, null] },
      { code: 'DET', ops: [null, null, 9.00, null, 4.00, 2.00, null], hrs: [null, null, 47.70, null, 148.00, 10.00, null] },
      { code: 'FCC', ops: [null, null, null, null, null, null, null], hrs: [null, null, null, null, null, null, null] },
      { code: 'MIN', ops: [null, null, 13.00, null, 4.00, 1.00, null], hrs: [null, null, 68.90, null, 148.00, 5.00, null] }
    ];
  }

  getOPS_314_16_Data(pacId: string): any[] {
    // Enhanced Data for OPS 314-16 tab (Laboratory Operations)
    return [
      { code: 'NWE', ops: [2.00, null, null, null, null, 1.00], hrs: [88.20, null, null, null, null, 21.00] },
      { code: 'NYK', ops: [3.00, null, 75.00, null, null, null], hrs: [15.90, null, 175.50, null, null, null] },
      { code: 'BLT', ops: [null, 2.00, null, null, null, null], hrs: [null, 148.10, null, null, null, null] },
      { code: 'CHI', ops: [null, null, null, 1.00, null, null], hrs: [null, null, null, 72.00, null, null] },
      { code: 'CIN', ops: [null, null, null, 2.00, null, null], hrs: [null, null, null, 84.80, null, null] },
      { code: 'DET', ops: [null, null, null, 5.00, null, null], hrs: [null, null, null, 205.70, null, null] },
      { code: 'MIN', ops: [null, null, null, 4.00, null, null], hrs: [null, null, null, 221.80, null, null] },
      { code: 'ATL', ops: [null, 2.00, null, 25.00, null, null], hrs: [null, 10.90, null, 40.60, null, null] },
      { code: 'SRL', ops: [10.00, null, null, null, null, null], hrs: [1000.00, null, null, null, null, null] }
    ];
  }

  // Simple consolidated data for operations view
  getConsolidatedData(): any[] {
    const fieldData = this.getOPS_25_26_SimpleData();
    const labData = this.getOPS_314_16_SimpleData();
    
    // Create a map to merge data by division
    const consolidated: any[] = [];
    
    // Create consolidated entries for divisions that exist in both
    const divisions = ['NE', 'SE', 'MW', 'SW', 'W', 'PAC'];
    
    divisions.forEach(divCode => {
      const fieldItem = fieldData.find(item => item.divisionCode === divCode);
      const labItem = labData.find(item => item.divisionCode === divCode);
      
      if (fieldItem) {
        consolidated.push({
          division: fieldItem.divisionName,
          field: {
            operations: fieldItem.operations,
            hours: fieldItem.hours,
            ftes: fieldItem.ftes
          },
          lab: labItem ? {
            operations: labItem.operations,
            hours: labItem.hours,
            ftes: labItem.ftes
          } : {
            operations: 0,
            hours: 0,
            ftes: 0
          },
          totalHours: fieldItem.hours + (labItem ? labItem.hours : 0),
          totalFtes: fieldItem.ftes + (labItem ? labItem.ftes : 0)
        });
      }
    });
    
    // Add lab-only divisions
    const labOnlyData = ['NWE', 'NYK', 'BLT', 'CHI', 'CIN', 'DET', 'MIN', 'ATL', 'SRL'];
    labOnlyData.forEach(divCode => {
      const labItem = labData.find(item => item.divisionCode === divCode);
      if (labItem) {
        consolidated.push({
          division: labItem.divisionName,
          field: {
            operations: 0,
            hours: 0,
            ftes: 0
          },
          lab: {
            operations: labItem.operations,
            hours: labItem.hours,
            ftes: labItem.ftes
          },
          totalHours: labItem.hours,
          totalFtes: labItem.ftes
        });
      }
    });
    
    return consolidated;
  }

  getConsolidatedData_Original(pacId: string): any[] {
    // Consolidated view of all operations
    const ops25_26 = this.getOPS_25_26_Data(pacId);
    const ops314_16 = this.getOPS_314_16_Data(pacId);
    
    // Merge data from both operation types
    const consolidated = new Map();
    
    // Add OPS 25-26 data
    ops25_26.forEach(item => {
      consolidated.set(item.code, {
        code: item.code,
        ops_25_26: item.ops,
        hrs_25_26: item.hrs,
        ops_314_16: [null, null, null, null, null, null],
        hrs_314_16: [null, null, null, null, null, null]
      });
    });
    
    // Add OPS 314-16 data
    ops314_16.forEach(item => {
      if (consolidated.has(item.code)) {
        consolidated.get(item.code).ops_314_16 = item.ops;
        consolidated.get(item.code).hrs_314_16 = item.hrs;
      } else {
        consolidated.set(item.code, {
          code: item.code,
          ops_25_26: [null, null, null, null, null, null],
          hrs_25_26: [null, null, null, null, null, null],
          ops_314_16: item.ops,
          hrs_314_16: item.hrs
        });
      }
    });
    
    return Array.from(consolidated.values());
  }

  getPacDetailData(pacId: string, tabName: string = 'OPS_25_26'): PACDetail {
    // Based on the screenshot, return detailed operations data for PAC 21006
    if (pacId === '21006') {
      return {
        pac: '21006',
        description: 'INFANT FORMULA SURVEY',
        projectName: 'Food Composition, Standards, Labeling and Economics',
        programAssignmentCode: '21006',
        endDate: '',
        duration: '',
        operations: [
          {
            divisionCode: 'OPS 25-26',
            divisionName: 'DSA CHEM',
            operations: [
              { ops: 0, hours: 0 },
              { ops: 0, hours: 0 },
              { ops: 0, hours: 0 },
              { ops: 0, hours: 0 },
              { ops: 0, hours: 0 },
              { ops: 0, hours: 0 }
            ],
            total: { ops: 0, hours: 0, ftes: 0 }
          },
          {
            divisionCode: 'OPS 314-16',
            divisionName: 'DSC ASSIGN',
            operations: [
              { ops: 3, hours: 15.90 },
              { ops: 0, hours: 0 },
              { ops: 75, hours: 175.50 },
              { ops: 0, hours: 0 },
              { ops: 0, hours: 0 },
              { ops: 0, hours: 0 }
            ],
            total: { ops: 78, hours: 191.40, ftes: 0.19 }
          }
        ],
        summary: {
          totalOps: 78,
          totalHours: 7011.00,
          totalFtes: 6.28,
          moduleTime: 5.30,
          convFactor: 930.00,
          plannedFtes: 0.08
        }
      };
    }

    // Default PAC detail structure for other PACs
    return {
      pac: pacId,
      description: this.pacItems.find(item => item.pac === pacId)?.description || 'PAC Details',
      projectName: this.programTitle,
      programAssignmentCode: pacId,
      endDate: '',
      duration: '',
      operations: [
        {
          divisionCode: 'OPS 25-26',
          divisionName: 'Operations Division',
          operations: [
            { ops: 10, hours: 520.00 },
            { ops: 5, hours: 260.00 },
            { ops: 8, hours: 416.00 },
            { ops: 3, hours: 156.00 },
            { ops: 12, hours: 624.00 },
            { ops: 7, hours: 364.00 }
          ],
          total: { ops: 45, hours: 2340.00, ftes: 2.34 }
        }
      ],
      summary: {
        totalOps: 45,
        totalHours: this.pacItems.find(item => item.pac === pacId)?.hours || 0,
        totalFtes: this.pacItems.find(item => item.pac === pacId)?.plannedFtes || 0,
        moduleTime: 100.00,
        convFactor: 1180.00,
        plannedFtes: 1.98
      }
    };
  }

  // Navigate to operations view for a specific PAC
  showPacOperations(pacItem: PACItem): void {
    this.selectedPacForOperations = pacItem;
    this.showOperations = true;
    this.showPacDetail = false; // Hide PAC detail if it was showing
  }

  // Navigate back to PAC listing
  backToPacListing(): void {
    this.showOperations = false;
    this.selectedPacForOperations = null;
    this.showPacDetail = false;
  }

  navigateBackToPPS(): void {
    if (this.fromPPS) {
      this.router.navigate(['/pps'], {
        queryParams: {
          workplan: this.workplanName,
          year: this.workplanYear
        }
      });
    } else {
      // If not from PPS, go to home
      this.navigateToHome();
    }
  }
}
