import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

interface WorkplanModel {
  id: string;
  description: string;
  year: string;
  status: 'active' | 'archived' | 'draft';
  createdDate: Date;
  lastModified: Date;
}

interface BackendWorkplan {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  start_date: string;
  end_date: string;
  assigned_to: string;
  progress: number;
  task_count: number;
}

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ModelComponent implements OnInit {
  workplanModels: WorkplanModel[] = [];
  backendWorkplans: BackendWorkplan[] = [];
  selectedModel: WorkplanModel | null = null;
  isCreatingNewModel: boolean = false;
  newModelYear: string = '';
  newModelDescription: string = '';
  currentDate: Date = new Date();
  backendConnected: boolean = false;

  constructor(
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.loadWorkplanModels();
    this.loadBackendWorkplans();
  }

  loadBackendWorkplans(): void {
    console.log('🔄 Loading workplans from backend API...');
    
    this.apiService.getWorkplans().subscribe({
      next: (response) => {
        console.log('✅ Backend data loaded successfully:', response);
        if (response.success && response.workplans) {
          this.backendWorkplans = response.workplans;
          this.backendConnected = true;
        }
      },
      error: (error) => {
        console.error('❌ Failed to load backend data:', error);
        this.backendConnected = false;
      }
    });
  }

  loadWorkplanModels(): void {
    // Load existing workplan models - this would come from a service
    this.workplanModels = [
      {
        id: '2026WP',
        description: 'Workplan 0 - 2026 ()',
        year: '2026',
        status: 'draft',
        createdDate: new Date('2025-01-01'),
        lastModified: new Date('2025-08-29')
      },
      {
        id: '2025WP',
        description: 'Workplan 0 - 2025 ()',
        year: '2025',
        status: 'active',
        createdDate: new Date('2024-01-01'),
        lastModified: new Date('2025-06-15')
      },
      {
        id: '2024WP',
        description: 'Workplan 0 - 2024 ()',
        year: '2024',
        status: 'archived',
        createdDate: new Date('2023-01-01'),
        lastModified: new Date('2024-12-31')
      },
      {
        id: '2023WP',
        description: 'Workplan 0 - 2023 ()',
        year: '2023',
        status: 'archived',
        createdDate: new Date('2022-01-01'),
        lastModified: new Date('2023-12-31')
      },
      {
        id: '2022WP',
        description: 'Workplan 0 - 2022 ()',
        year: '2022',
        status: 'archived',
        createdDate: new Date('2021-01-01'),
        lastModified: new Date('2022-12-31')
      },
      {
        id: '2021WP',
        description: 'Workplan 0 - 2021 ()',
        year: '2021',
        status: 'archived',
        createdDate: new Date('2020-01-01'),
        lastModified: new Date('2021-12-31')
      },
      {
        id: '2020WP',
        description: 'Workplan 0 - 2020 ()',
        year: '2020',
        status: 'archived',
        createdDate: new Date('2019-01-01'),
        lastModified: new Date('2020-12-31')
      },
      {
        id: '2019WP',
        description: 'Workplan 0 - 2019 ()',
        year: '2019',
        status: 'archived',
        createdDate: new Date('2018-01-01'),
        lastModified: new Date('2019-12-31')
      },
      {
        id: '2018WP',
        description: 'Workplan FY 2018',
        year: '2018',
        status: 'archived',
        createdDate: new Date('2017-01-01'),
        lastModified: new Date('2018-12-31')
      },
      {
        id: '2017WP',
        description: 'Workplan 0 - 2017 (FY 2017 Work Plan)',
        year: '2017',
        status: 'archived',
        createdDate: new Date('2016-01-01'),
        lastModified: new Date('2017-12-31')
      },
      {
        id: '2016WP',
        description: 'Workplan 0 - 2016 ()',
        year: '2016',
        status: 'archived',
        createdDate: new Date('2015-01-01'),
        lastModified: new Date('2016-12-31')
      },
      {
        id: '2015WP',
        description: 'Workplan 0 - 2015 (FY 2015 Workplan)',
        year: '2015',
        status: 'archived',
        createdDate: new Date('2014-01-01'),
        lastModified: new Date('2015-12-31')
      },
      {
        id: '2014WP',
        description: 'Workplan 0 - 2014 ()',
        year: '2014',
        status: 'archived',
        createdDate: new Date('2013-01-01'),
        lastModified: new Date('2014-12-31')
      },
      {
        id: '2013WP',
        description: 'Workplan 0 - 2013',
        year: '2013',
        status: 'archived',
        createdDate: new Date('2012-01-01'),
        lastModified: new Date('2013-12-31')
      },
      {
        id: '2012WP',
        description: 'Workplan 0 - 2012 (2012 WORKPLAN)',
        year: '2012',
        status: 'archived',
        createdDate: new Date('2011-01-01'),
        lastModified: new Date('2012-12-31')
      },
      {
        id: '2011WP',
        description: 'Workplan 0 - 2011 (FY 2011 ORA WORKPLAN)',
        year: '2011',
        status: 'archived',
        createdDate: new Date('2010-01-01'),
        lastModified: new Date('2011-12-31')
      },
      {
        id: '2010WP',
        description: 'Workplan 0 - 2010 (2010 workplan created 2/25/09)',
        year: '2010',
        status: 'archived',
        createdDate: new Date('2009-02-25'),
        lastModified: new Date('2010-12-31')
      },
      {
        id: '2009WP',
        description: 'Workplan 0 - 2009 (2009 Workplan)',
        year: '2009',
        status: 'archived',
        createdDate: new Date('2008-01-01'),
        lastModified: new Date('2009-12-31')
      },
      {
        id: '2008WP',
        description: 'Workplan FY 2008',
        year: '2008',
        status: 'archived',
        createdDate: new Date('2007-01-01'),
        lastModified: new Date('2008-12-31')
      },
      {
        id: '2007WP',
        description: 'Workplan 0 - 2007 (2007 WORKPLAN)',
        year: '2007',
        status: 'archived',
        createdDate: new Date('2006-01-01'),
        lastModified: new Date('2007-12-31')
      },
      {
        id: '2006WP',
        description: 'Workplan 0 - 2006 (Workplan for 2006)',
        year: '2006',
        status: 'archived',
        createdDate: new Date('2005-01-01'),
        lastModified: new Date('2006-12-31')
      },
      {
        id: '2005WP',
        description: 'Workplan 0 - 2005 (FY 2005 Final Workplan)',
        year: '2005',
        status: 'archived',
        createdDate: new Date('2004-01-01'),
        lastModified: new Date('2005-12-31')
      }
    ];
  }

  createNewModel(): void {
    this.isCreatingNewModel = true;
    this.newModelYear = '';
    this.newModelDescription = '';
  }

  cancelNewModel(): void {
    this.isCreatingNewModel = false;
    this.newModelYear = '';
    this.newModelDescription = '';
  }

  saveNewModel(): void {
    if (this.newModelYear && this.newModelDescription) {
      const newModel: WorkplanModel = {
        id: `${this.newModelYear}WP`,
        description: this.newModelDescription,
        year: this.newModelYear,
        status: 'draft',
        createdDate: new Date(),
        lastModified: new Date()
      };
      
      this.workplanModels.unshift(newModel);
      this.isCreatingNewModel = false;
      this.newModelYear = '';
      this.newModelDescription = '';
    }
  }

  editModel(model: WorkplanModel): void {
    this.selectedModel = { ...model };
  }

  deleteModel(model: WorkplanModel): void {
    if (confirm(`Are you sure you want to delete ${model.description}?`)) {
      this.workplanModels = this.workplanModels.filter(m => m.id !== model.id);
    }
  }

  viewModelDetails(model: WorkplanModel): void {
    // Navigate to model details or workplan view
    this.router.navigate(['/workplan', model.year], { 
      queryParams: { 
        workplan: model.description,
        modelId: model.id 
      } 
    });
  }

  checkPacData(model: WorkplanModel): void {
    // Navigate to PAC data check for this model
    this.router.navigate(['/pac', '21'], { 
      queryParams: { 
        workplan: model.description,
        year: model.year,
        ppsId: '21'
      } 
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'draft':
        return 'status-draft';
      case 'archived':
        return 'status-archived';
      default:
        return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'active':
        return 'ACTIVE';
      case 'draft':
        return 'DRAFT';
      case 'archived':
        return 'ARCHIVED';
      default:
        return status.toUpperCase();
    }
  }
}
