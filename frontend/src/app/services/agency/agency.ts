import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr'; 
import { AgencyModel } from '../../models/agency';

@Injectable({
  providedIn: 'root',
})
export class AgencyService {
  private apiUrl = 'http://localhost:3000/agencies';

  constructor(private http: HttpClient, private router: Router,  private toastr: ToastrService ) { }


  getAgencyById(id: number){
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateAgency(id: number, agencyInfo: AgencyModel){
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, agencyInfo);
  }

  deleteAgency(id: number){
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }

}
