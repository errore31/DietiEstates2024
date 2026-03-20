import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestAgency } from '../../models/request-agency';

@Injectable({
  providedIn: 'root'
})
export class RequestAgencyService {
  private apiUrl = 'http://localhost:3000/requestAgency';

  constructor(private http: HttpClient) { }

  submitRequest(data: RequestAgency): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, data);
  }

  getAllRequests(): Observable<RequestAgency[]> {
    return this.http.get<RequestAgency[]>(`${this.apiUrl}`, { withCredentials: true });
  }

  approveRequest(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/approve`, {}, { withCredentials: true });
  }

  rejectRequest(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}/reject`, { withCredentials: true });
  }
}
