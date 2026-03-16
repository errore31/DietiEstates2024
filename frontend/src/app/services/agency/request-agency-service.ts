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

  /**
   * Invia una nuova richiesta di creazione agenzia (Pubblico)
   */
  submitRequest(data: RequestAgency): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, data);
  }

  /**
   * Restituisce tutte le richieste pendenti (Solo Admin)
   */
  getAllRequests(): Observable<RequestAgency[]> {
    return this.http.get<RequestAgency[]>(`${this.apiUrl}`, { withCredentials: true });
  }

  /**
   * Approva la richiesta: crea agenzia + agencyAdmin ed elimina la richiesta (Solo Admin)
   */
  approveRequest(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/approve`, {}, { withCredentials: true });
  }

  /**
   * Rifiuta la richiesta: elimina la richiesta pendente (Solo Admin)
   */
  rejectRequest(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}/reject`, { withCredentials: true });
  }
}
