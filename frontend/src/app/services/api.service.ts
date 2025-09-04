import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
  department: string;
  is_active: boolean;
  created_at: string;
  last_login: string;
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

interface PacOperation {
  id: number;
  operation_type: string;
  facility_name: string;
  facility_id: string;
  facility_address: string;
  operation_date: string;
  status: string;
  priority: string;
  inspector: string;
  notes: string;
  findings: string;
  risk_level: string;
  compliance_status: string;
  sample_count: number;
  samples: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:8090/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    withCredentials: true // Important for session-based auth
  };

  constructor(private http: HttpClient) {
    // Check if user is already logged in on app start
    this.checkCurrentUser();
  }

  // Authentication Methods
  login(username: string, password: string): Observable<any> {
    const loginData = { username, password };
    return this.http.post<any>(`${this.baseUrl}/auth/login`, loginData, this.httpOptions)
      .pipe(
        map(response => {
          if (response.success && response.user) {
            this.currentUserSubject.next(response.user);
          }
          return response;
        })
      );
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/logout`, {}, this.httpOptions)
      .pipe(
        map(response => {
          if (response.success) {
            this.currentUserSubject.next(null);
          }
          return response;
        })
      );
  }

  checkCurrentUser(): void {
    this.http.get<any>(`${this.baseUrl}/auth/profile`, this.httpOptions)
      .subscribe({
        next: (response) => {
          if (response.success && response.user) {
            this.currentUserSubject.next(response.user);
          }
        },
        error: (error) => {
          // User not logged in, which is fine
          this.currentUserSubject.next(null);
        }
      });
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  // Health Check
  getHealth(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/health`);
  }

  // Workplan Methods
  getWorkplans(filters?: any): Observable<any> {
    let params = '';
    if (filters) {
      const queryParams = new URLSearchParams(filters);
      params = '?' + queryParams.toString();
    }
    return this.http.get<any>(`${this.baseUrl}/workplans${params}`, this.httpOptions);
  }

  getWorkplan(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/workplans/${id}`, this.httpOptions);
  }

  createWorkplan(workplan: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/workplans`, workplan, this.httpOptions);
  }

  updateWorkplan(id: number, workplan: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/workplans/${id}`, workplan, this.httpOptions);
  }

  deleteWorkplan(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/workplans/${id}`, this.httpOptions);
  }

  getWorkplanTasks(workplanId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/workplans/${workplanId}/tasks`, this.httpOptions);
  }

  createWorkplanTask(workplanId: number, task: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/workplans/${workplanId}/tasks`, task, this.httpOptions);
  }

  getWorkplanDashboard(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/workplans/dashboard`, this.httpOptions);
  }

  // PAC Operation Methods
  getPacOperations(filters?: any): Observable<any> {
    let params = '';
    if (filters) {
      const queryParams = new URLSearchParams(filters);
      params = '?' + queryParams.toString();
    }
    return this.http.get<any>(`${this.baseUrl}/pac/operations${params}`, this.httpOptions);
  }

  getPacOperation(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pac/operations/${id}`, this.httpOptions);
  }

  createPacOperation(operation: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/pac/operations`, operation, this.httpOptions);
  }

  updatePacOperation(id: number, operation: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/pac/operations/${id}`, operation, this.httpOptions);
  }

  deletePacOperation(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/pac/operations/${id}`, this.httpOptions);
  }

  getPacOperationSamples(operationId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pac/operations/${operationId}/samples`, this.httpOptions);
  }

  createPacSample(operationId: number, sample: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/pac/operations/${operationId}/samples`, sample, this.httpOptions);
  }

  getPacDashboard(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pac/dashboard`, this.httpOptions);
  }

  getPacOperationTypes(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pac/types`, this.httpOptions);
  }

  getPacStatuses(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pac/statuses`, this.httpOptions);
  }

  getPacPriorities(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pac/priorities`, this.httpOptions);
  }
}
